import { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../constants/index.js';
import { suggestPriority } from '../utils/priorityEngine.js';
import { findSimilarIssues } from '../utils/duplicateDetector.js';
const INITIAL_FORM = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  priority: 'Medium',
  location: '',
  reportedBy: '',
};

function validate(form) {
  const errors = {};
  if (form.title.trim().length < 5) errors.title = 'Title must be at least 5 characters.';
  if (form.description.trim().length < 10)
    errors.description = 'Please describe the problem (at least 10 characters).';
  if (!form.location.trim()) errors.location = 'Location is required.';
  if (!form.reportedBy.trim()) errors.reportedBy = 'Your name is required.';
  return errors;
}

export default function IssueForm({ onSubmit, issues = [] }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
const prioritySuggestion = suggestPriority(
  form.title,
  form.description,
  form.category
);

const suggestedPriority = prioritySuggestion.priority;
const similarIssues = findSimilarIssues(
  issues,
  form.title,
  form.location,
  form.category
);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      {similarIssues.length > 0 && (
  <div className="alert alert-error">
    <div>
      <strong>⚠️ Similar issue already reported</strong>

      <p>
        We found {similarIssues.length} similar open issue
        {similarIssues.length > 1 ? 's' : ''}.
      </p>

      {similarIssues.slice(0, 2).map((issue) => (
        <div key={issue.id} style={{ marginTop: '8px' }}>
          <strong>{issue.id}</strong> — {issue.title}
          <br />
          Status: <strong>{issue.status}</strong>
        </div>
      ))}

      <p style={{ marginTop: '8px' }}>
        Please check the existing report before submitting a duplicate.
      </p>
    </div>
  </div>
)}
      {errors.form && <div className="alert alert-error">{errors.form}</div>}

      <div className="field">
        <label htmlFor="title">Issue title</label>
        <input
          id="title"
          name="title"
          className="input"
          placeholder="e.g. Wi-Fi not working in Lab 2"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="input"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
  <label htmlFor="priority">Priority</label>

  <select
    id="priority"
    name="priority"
    className="input"
    value={form.priority}
    onChange={handleChange}
  >
    {PRIORITIES.map((p) => (
      <option key={p} value={p}>
        {p}
      </option>
    ))}
  </select>

 <div className="field-hint">
  💡 Smart suggestion:{' '}
  <strong>{prioritySuggestion.priority}</strong>
  {' — '}
  {prioritySuggestion.reason}
</div>
</div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            className="input"
            placeholder="e.g. Block A, 2nd Floor"
            value={form.location}
            onChange={handleChange}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>
        <div className="field">
          <label htmlFor="reportedBy">Your name</label>
          <input
            id="reportedBy"
            name="reportedBy"
            className="input"
            placeholder="Full name"
            value={form.reportedBy}
            onChange={handleChange}
          />
          {errors.reportedBy && <span className="error-text">{errors.reportedBy}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="input"
          rows={5}
          placeholder="Describe the problem in detail…"
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Issue'}
      </button>
    </form>
  );
}

