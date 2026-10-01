import { useState } from 'react';
import IssueForm from '../components/IssueForm.jsx';
import { useIssues } from '../context/IssueContext.jsx';
import { PAGES } from '../constants/index.js';

export default function ReportIssuePage({ onNavigate }) {
  const { addIssue, issues } = useIssues();
  const [created, setCreated] = useState(null);

  const handleSubmit = async (data) => {
    const issue = await addIssue(data);
    setCreated(issue);
  };

  return (
    <section>
      <div className="report-hero">
        <span className="hero-eyebrow">🛠️ CampusFix</span>
        <h1>Spot a problem on campus? Report it in under a minute.</h1>
        <p>
          Wi-Fi outages, broken equipment, water or electrical faults — tell us what's wrong and
          our team will take it from here.
        </p>
        <div className="hero-chips">
          <span className="hero-chip">⚡ Quick to submit</span>
          <span className="hero-chip">📍 Location-based</span>
          <span className="hero-chip">🔔 Track every update</span>
        </div>
      </div>

      <div className="steps">
        <div className="step">
          <span className="step-number">1</span>
          <div className="step-body">
            <div className="step-title">Describe the issue</div>
            <div className="step-text">Pick a category and add the details.</div>
          </div>
        </div>
        <div className="step">
          <span className="step-number">2</span>
          <div className="step-body">
            <div className="step-title">We review it</div>
            <div className="step-text">Admins prioritise and assign a fix.</div>
          </div>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <div className="step-body">
            <div className="step-title">Track the progress</div>
            <div className="step-text">Follow it from Pending to Resolved.</div>
          </div>
        </div>
      </div>

      {created && (
        <div className="alert alert-success">
          <span>
            ✅ Issue <strong>{created.id}</strong> submitted successfully.
          </span>
          <button type="button" className="btn btn-link" onClick={() => onNavigate(PAGES.TRACK)}>
            Track issues →
          </button>
        </div>
      )}

      <div className="two-col">
        <IssueForm onSubmit={handleSubmit} issues={issues} />

        <div className="report-side">
          <aside className="card tips">
            <h3 className="card-title">Tips for a quick fix</h3>
            <ul className="tips-list">
              <li>Mention the exact building, floor and room.</li>
              <li>Describe what is broken and since when.</li>
              <li>Choose Critical only for safety hazards.</li>
              <li>Check existing issues first to avoid duplicates.</li>
            </ul>
          </aside>

          <aside className="card">
            <h3 className="card-title">Priority guide</h3>
            <ul className="guide-list">
              <li className="guide-item">
                <span className="dot dot-low" />
                <div>
                  <span className="guide-label">Low</span>
                  <span className="guide-text">Minor inconvenience, no impact on daily activity.</span>
                </div>
              </li>
              <li className="guide-item">
                <span className="dot dot-medium" />
                <div>
                  <span className="guide-label">Medium</span>
                  <span className="guide-text">Affects a few people or a single facility.</span>
                </div>
              </li>
              <li className="guide-item">
                <span className="dot dot-high" />
                <div>
                  <span className="guide-label">High</span>
                  <span className="guide-text">Disrupts classes, labs or hostel life.</span>
                </div>
              </li>
              <li className="guide-item">
                <span className="dot dot-critical" />
                <div>
                  <span className="guide-label">Critical</span>
                  <span className="guide-text">Safety hazard or complete service failure.</span>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

