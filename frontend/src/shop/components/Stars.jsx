import { Star } from 'lucide-react';

export default function Stars({ rating = 0, size = 14, showValue = true }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={size} className={i <= Math.round(rating) ? 'fill-[#ed6126] text-[#ed6126]' : 'text-gray-300'} />
        ))}
      </span>
      {showValue && <span className="text-xs text-[#626262]">{Number(rating).toFixed(1)}</span>}
    </span>
  );
}
