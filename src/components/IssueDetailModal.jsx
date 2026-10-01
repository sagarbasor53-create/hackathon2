import { useEffect, useState } from 'react';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import { CATEGORY_ICONS, STATUSES } from '../constants/index.js';
import { useIssues } from '../context/IssueContext.jsx';
import { formatDate } from '../utils/helpers.js';

export default function IssueDetailModal({ issue, isAdmin, onClose }) {
  const { updateIssue, removeIssue } = useIssues();
  const [note, setNote] = useState(issue.adminNote || '');
  const [busy, setBusy] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteError, setNoteError] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!noteSaved) return undefined;
    const timer = setTimeout(() => setNoteSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [noteSaved]);

  const run = async (action) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const handleStatusChange = (e) => run(() => updateIssue(issue.id, { status: e.target.value }));

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    setNoteSaved(false);
    setNoteError(false);
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    setNoteSaved(false);
    setNoteError(false);
    try {
      const updated = await updateIssue(issue.id, { adminNote: note.trim() });
      setNote(updated.adminNote || '');
      setNoteSaved(true);
    } catch {
      setNoteError(true);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this issue permanently?')) return;
    run(async () => {
      await removeIssue(issue.id);
      onClose();
    });
  };

  const noteUnchanged = note.trim() === (issue.adminNote || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Issue ${issue.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="issue-id">{issue.id}</span>
            <h2>{issue.title}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-badges">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          <span className="category-tag">
            {CATEGORY_ICONS[issue.category]} {issue.category}
          </span>
        </div>

        <p className="modal-desc">{issue.description}</p>

        <dl className="detail-grid">
          <div>
            <dt>Location</dt>
            <dd>{issue.location}</dd>
          </div>
          <div>
            <dt>Reported by</dt>
            <dd>{issue.reportedBy}</dd>
          </div>
          <div>
            <dt>Reported on</dt>
            <dd>{formatDate(issue.createdAt)}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{formatDate(issue.updatedAt)}</dd>
          </div>
        </dl>

        {isAdmin ? (
          <div className="admin-panel">
            <div className="field">
              <label htmlFor="modal-status">Update status</label>
              <select
                id="modal-status"
                className="input"
                value={issue.status}
                onChange={handleStatusChange}
                disabled={busy}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="modal-note">Admin note</label>
              <textarea
                id="modal-note"
                className="input"
                rows={3}
                placeholder="Add progress details visible to students…"
                value={note}
                onChange={handleNoteChange}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveNote}
                disabled={busy || savingNote || noteUnchanged}
              >
                {savingNote ? 'Saving…' : 'Save note'}
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={busy || savingNote}>
                Delete issue
              </button>
              {noteSaved && (
                <span className="badge status-resolved" role="status">
                  Note saved ✓
                </span>
              )}
              {noteError && (
                <span className="badge priority-critical" role="alert">
                  Could not save note
                </span>
              )}
            </div>
          </div>
        ) : (
          issue.adminNote && (
            <div className="note-box">
              <strong>Update from administration</strong>
              <p>{issue.adminNote}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}