import { useState } from 'react';
import IssueCard from '../components/IssueCard.jsx';
import IssueFilters from '../components/IssueFilters.jsx';
import IssueDetailModal from '../components/IssueDetailModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useIssues } from '../context/IssueContext.jsx';
import { filterIssues } from '../utils/helpers.js';
import { DEFAULT_FILTERS, ROLES } from '../constants/index.js';

export default function TrackIssuesPage({ role }) {
  const { issues, loading, error } = useIssues();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState(null);

  if (loading) return <p className="muted">Loading issues…</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const filtered = filterIssues(issues, filters);
  const selected = issues.find((i) => i.id === selectedId) || null;

  return (
    <section>
      <div className="page-header">
        <h1>{role === ROLES.ADMIN ? 'All issues' : 'Track issues'}</h1>
        <p>Follow the progress of reported problems across campus.</p>
      </div>

      <IssueFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No issues found" message="Try changing or clearing your filters." />
      ) : (
        <div className="issue-grid">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={(i) => setSelectedId(i.id)} />
          ))}
        </div>
      )}

      {selected && (
        <IssueDetailModal
          issue={selected}
          isAdmin={role === ROLES.ADMIN}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
