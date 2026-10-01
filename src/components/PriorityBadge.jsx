import { slugify } from '../utils/helpers.js';

export default function PriorityBadge({ priority }) {
  return <span className={`badge priority-${slugify(priority)}`}>{priority}</span>;
}
