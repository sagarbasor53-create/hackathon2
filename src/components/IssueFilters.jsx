import { CATEGORIES, PRIORITIES, STATUSES } from '../constants/index.js';

export default function IssueFilters({ filters, onChange, onReset }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filters card">
      <input
        type="search"
        name="search"
        className="input"
        placeholder="Search by ID, title or location…"
        value={filters.search}
        onChange={handleChange}
      />
      <select name="status" className="input" value={filters.status} onChange={handleChange}>
        <option value="All">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select name="category" className="input" value={filters.category} onChange={handleChange}>
        <option value="All">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select name="priority" className="input" value={filters.priority} onChange={handleChange}>
        <option value="All">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
