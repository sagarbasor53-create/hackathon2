import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import { CATEGORY_ICONS } from '../constants/index.js';
import { formatDate } from '../utils/helpers.js';

export default function IssueCard({ issue, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(issue);
    }
  };

  return (
    <article
      className="issue-card"
      tabIndex={0}
      role="button"
      onClick={() => onClick(issue)}
      onKeyDown={handleKeyDown}
    >
      <div className="issue-card-top">
        <span className="issue-id">{issue.id}</span>
        <StatusBadge status={issue.status} />
      </div>
      <h3 className="issue-title">{issue.title}</h3>
      <p className="issue-desc">{issue.description}</p>
      <div className="issue-meta">
        <span className="category-tag">
          {CATEGORY_ICONS[issue.category]} {issue.category}
        </span>
        <PriorityBadge priority={issue.priority} />
      </div>
      <div className="issue-footer">
        <span>📍 {issue.location}</span>
        <span>{formatDate(issue.createdAt)}</span>
      </div>
    </article>
  );
}
