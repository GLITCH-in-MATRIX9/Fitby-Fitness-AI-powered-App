import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Toasts() {
  const { toasts } = useShop();
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`shop-pop pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
          {t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-[#ed6126]" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
