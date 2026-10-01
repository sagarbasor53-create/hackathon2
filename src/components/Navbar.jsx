import { PAGES, ROLES } from '../constants/index.js';

const NAV_ITEMS = {
  [ROLES.STUDENT]: [
    { id: PAGES.REPORT, label: 'Report Issue' },
    { id: PAGES.TRACK, label: 'Track Issues' },
  ],
  [ROLES.ADMIN]: [
    { id: PAGES.DASHBOARD, label: 'Dashboard' },
    { id: PAGES.TRACK, label: 'All Issues' },
  ],
};

export default function Navbar({ role, page, onNavigate, onRoleChange }) {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <div className="brand">
          <span className="brand-icon">🛠️</span>
          <span className="brand-name">CampusFix</span>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_ITEMS[role].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="role-switch" role="group" aria-label="Switch role">
          <button
            type="button"
            className={role === ROLES.STUDENT ? 'active' : ''}
            onClick={() => onRoleChange(ROLES.STUDENT)}
          >
            Student
          </button>
          <button
            type="button"
            className={role === ROLES.ADMIN ? 'active' : ''}
            onClick={() => onRoleChange(ROLES.ADMIN)}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
