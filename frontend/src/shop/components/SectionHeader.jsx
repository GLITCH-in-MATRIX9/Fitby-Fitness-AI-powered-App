import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ title, subtitle, to, linkLabel = 'View all' }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-[#626262] mt-1">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="text-sm font-semibold text-[#ed6126] hover:text-black inline-flex items-center gap-1 whitespace-nowrap">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
