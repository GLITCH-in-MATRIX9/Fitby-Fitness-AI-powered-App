import { STATUS_STYLES } from '../utils/helpers';

export default function StatusBadge({ status }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}
