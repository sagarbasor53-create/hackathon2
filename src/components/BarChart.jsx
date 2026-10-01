export default function BarChart({ title, data, tone = 'primary' }) {
  const entries = Object.entries(data);
  const max = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <ul className="bar-list">
        {entries.map(([label, value]) => (
          <li key={label} className="bar-row">
            <span className="bar-label">{label}</span>
            <div className="bar-track">
              <div
                className={`bar-fill fill-${tone}`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="bar-value">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
