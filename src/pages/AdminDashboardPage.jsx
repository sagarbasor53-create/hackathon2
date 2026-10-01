import { useMemo, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import BarChart from '../components/BarChart.jsx';
import IssueFilters from '../components/IssueFilters.jsx';
import IssueDetailModal from '../components/IssueDetailModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useIssues } from '../context/IssueContext.jsx';
import { computeStats, filterIssues, formatDate } from '../utils/helpers.js';
import { DEFAULT_FILTERS, STATUSES } from '../constants/index.js';

export default function AdminDashboardPage() {
  const { issues, loading, error, updateIssue } = useIssues();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState(null);

  const stats = useMemo(() => computeStats(issues), [issues]);

  if (loading) return <p className="muted">Loading dashboard…</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const filtered = filterIssues(issues, filters);
  const selected = issues.find((i) => i.id === selectedId) || null;

  return (
    <section>
      <div className="page-header">
        <h1>Admin dashboard</h1>
        <p>Monitor campus issues and keep resolution times low.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total issues" value={stats.total} hint="All reports" />
        <StatCard label="Pending" value={stats.pending} hint="Awaiting action" tone="warning" />
        <StatCard label="In progress" value={stats.inProgress} hint="Being handled" tone="info" />
        <StatCard label="Resolved" value={stats.resolved} hint="Completed" tone="success" />
        <StatCard
          label="Resolution rate"
          value={`${stats.resolutionRate}%`}
          hint="Resolved / total"
          tone="success"
        />
        <StatCard
          label="Open critical"
          value={stats.criticalOpen}
          hint="Needs attention"
          tone="danger"
        />
      </div>

      <div className="charts-grid">
        <BarChart title="Issues by category" data={stats.byCategory} tone="primary" />
        <BarChart title="Issues by priority" data={stats.byPriority} tone="accent" />
      </div>

      <h2 className="section-title">Manage issues</h2>

      <IssueFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No issues found" message="Try changing or clearing your filters." />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => (
                <tr key={issue.id}>
                  <td className="mono">{issue.id}</td>
                  <td className="cell-title">{issue.title}</td>
                  <td>{issue.category}</td>
                  <td>
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td>
                    <div className="status-cell">
                      <StatusBadge status={issue.status} />
                      <select
                        className="input input-sm"
                        value={issue.status}
                        aria-label={`Change status of ${issue.id}`}
                        onChange={(e) => updateIssue(issue.id, { status: e.target.value })}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>{formatDate(issue.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedId(issue.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <IssueDetailModal issue={selected} isAdmin onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}
