import { useState } from 'react';
import { IssueProvider } from './context/IssueContext.jsx';
import Navbar from './components/Navbar.jsx';
import ReportIssuePage from './pages/ReportIssuePage.jsx';
import TrackIssuesPage from './pages/TrackIssuesPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import { PAGES, ROLES } from './constants/index.js';

export default function App() {
  const [role, setRole] = useState(ROLES.STUDENT);
  const [page, setPage] = useState(PAGES.REPORT);

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setPage(nextRole === ROLES.ADMIN ? PAGES.DASHBOARD : PAGES.REPORT);
  };

  let content;
  if (page === PAGES.DASHBOARD && role === ROLES.ADMIN) {
    content = <AdminDashboardPage />;
  } else if (page === PAGES.TRACK) {
    content = <TrackIssuesPage role={role} />;
  } else {
    content = <ReportIssuePage onNavigate={setPage} />;
  }

  return (
    <IssueProvider>
      <div className="app">
        <Navbar role={role} page={page} onNavigate={setPage} onRoleChange={handleRoleChange} />
        <main className="container main">{content}</main>
        <footer className="footer">
          <div className="container">CampusFix · Making campus life better, one fix at a time.</div>
        </footer>
      </div>
    </IssueProvider>
  );
}
