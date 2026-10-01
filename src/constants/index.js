export const STATUSES = ['Pending', 'In Progress', 'Resolved'];

export const CATEGORIES = [
  'Wi-Fi',
  'Broken Equipment',
  'Cleanliness',
  'Water',
  'Electrical',
  'Infrastructure',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const CATEGORY_ICONS = {
  'Wi-Fi': '📶',
  'Broken Equipment': '🛠️',
  Cleanliness: '🧹',
  Water: '💧',
  Electrical: '⚡',
  Infrastructure: '🏗️',
};

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

export const PAGES = {
  REPORT: 'report',
  TRACK: 'track',
  DASHBOARD: 'dashboard',
};

export const DEFAULT_FILTERS = {
  search: '',
  status: 'All',
  category: 'All',
  priority: 'All',
};
