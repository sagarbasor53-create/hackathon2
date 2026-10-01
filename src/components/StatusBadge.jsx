import { slugify } from '../utils/helpers.js';

export default function StatusBadge({ status }) {
  return (
    <span className={`badge status-${slugify(status)}`}>
      {status}
    </span>
  );
}
