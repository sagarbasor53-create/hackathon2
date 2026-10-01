import { CATEGORIES, PRIORITIES } from '../constants/index.js';

export function slugify(value) {
  return String(value).toLowerCase().replace(/\s+/g, '-');
}

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function filterIssues(issues, filters) {
  const query = filters.search.trim().toLowerCase();
  return issues.filter((issue) => {
    const matchesSearch =
      !query ||
      [issue.id, issue.title, issue.description, issue.location].some((field) =>
        String(field).toLowerCase().includes(query)
      );
    const matchesStatus = filters.status === 'All' || issue.status === filters.status;
    const matchesCategory = filters.category === 'All' || issue.category === filters.category;
    const matchesPriority = filters.priority === 'All' || issue.priority === filters.priority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });
}

export function computeStats(issues) {
  const total = issues.length;
  const count = (status) => issues.filter((i) => i.status === status).length;
  const resolved = count('Resolved');

  const byCategory = CATEGORIES.reduce((acc, category) => {
    acc[category] = issues.filter((i) => i.category === category).length;
    return acc;
  }, {});

  const byPriority = PRIORITIES.reduce((acc, priority) => {
    acc[priority] = issues.filter((i) => i.priority === priority).length;
    return acc;
  }, {});

  return {
    total,
    pending: count('Pending'),
    inProgress: count('In Progress'),
    resolved,
    criticalOpen: issues.filter((i) => i.priority === 'Critical' && i.status !== 'Resolved').length,
    resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    byCategory,
    byPriority,
  };
}
