import { Check, XCircle } from 'lucide-react';
import { ORDER_STATUSES, formatDate } from '../utils/helpers';

export default function OrderTimeline({ order }) {
  if (order.status === 'Cancelled') {
    const at = order.history.find((h) => h.status === 'Cancelled')?.at;
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
        <XCircle size={22} />
        <div><p className="font-semibold">Order cancelled</p>{at && <p className="text-xs">{formatDate(at)}</p>}</div>
      </div>
    );
  }
  const current = ORDER_STATUSES.indexOf(order.status);
  return (
    <ol className="flex flex-col md:flex-row md:items-start">
      {ORDER_STATUSES.map((s, i) => {
        const done = i < current || order.status === 'Delivered';
        const active = i === current && order.status !== 'Delivered';
        const at = order.history.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="flex md:flex-col md:flex-1 items-start md:items-center gap-3 md:gap-2 relative pb-5 md:pb-0">
            {i > 0 && <span className={`hidden md:block absolute top-4 right-1/2 w-full h-0.5 -z-0 ${i <= current ? 'bg-[#ed6126]' : 'bg-gray-200'}`} />}
            {i < ORDER_STATUSES.length - 1 && <span className={`md:hidden absolute left-4 top-8 -ml-px w-0.5 h-full ${i < current ? 'bg-[#ed6126]' : 'bg-gray-200'}`} />}
            <span className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition ${done ? 'bg-[#ed6126] border-[#ed6126] text-white' : active ? 'bg-white border-[#ed6126] text-[#ed6126] ring-4 ring-orange-100' : 'bg-white border-gray-300 text-gray-400'}`}>
              {done ? <Check size={16} /> : i + 1}
            </span>
            <span className="md:text-center">
              <span className={`block text-sm font-semibold ${done || active ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              <span className="block text-xs text-[#626262]">{at ? formatDate(at) : active ? 'In progress' : 'Upcoming'}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
