import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, PackageOpen } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatDate, formatINR } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import ShopImage from '../components/ShopImage';

export default function MyOrders() {
  const { orders, updateOrderStatus, toast } = useShop();
  const [open, setOpen] = useState(() => orders[0]?.id);

  if (!orders.length) return (
    <div className="max-w-xl mx-auto py-24 px-4 text-center">
      <PackageOpen size={56} className="mx-auto text-[#ed6126]" />
      <h2 className="text-2xl font-bold mt-4">No orders yet</h2>
      <p className="text-[#626262] mt-2">Your placed orders will show up here.</p>
      <Link to="/shop" className="inline-block mt-6 bg-[#ed6126] text-white px-6 py-3 rounded-md font-semibold hover:bg-black transition">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => {
          const isOpen = open === o.id;
          return (
            <div key={o.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : o.id)} className="w-full p-4 md:p-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-left">
                <div className="flex-1 min-w-[10rem]"><p className="font-mono font-semibold text-sm">{o.id}</p><p className="text-xs text-[#626262]">{formatDate(o.createdAt)}</p></div>
                <div className="flex -space-x-2">{o.items.slice(0, 3).map((i) => <div key={i.key} className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-orange-50"><ShopImage src={i.image} alt="" label={i.name} className="w-full h-full object-cover" /></div>)}</div>
                <span className="font-bold">{formatINR(o.total)}</span>
                <StatusBadge status={o.status} />
                <ChevronDown size={18} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 md:px-5 pb-5 border-t pt-5 space-y-5 shop-pop">
                  <OrderTimeline order={o} />
                  <div className="space-y-3">
                    {o.items.map((i) => (
                      <div key={i.key} className="flex gap-3 items-center text-sm">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-orange-50"><ShopImage src={i.image} alt="" label={i.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1"><Link to={`/shop/product/${i.productId}`} className="font-medium hover:text-[#ed6126]">{i.name}</Link>
                          <p className="text-xs text-[#626262]">{Object.entries(i.attrs).map(([k, v]) => `${k}: ${v}`).join(' · ')} · Qty {i.qty}</p></div>
                        <span className="font-semibold">{formatINR(i.price * i.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm bg-gray-50 rounded-xl p-4">
                    <div><p className="text-[#626262]">Payment</p><p className="font-medium">{o.payment.method} · {o.payment.status}</p></div>
                    <div><p className="text-[#626262]">Total (incl. {o.delivery ? `${formatINR(o.delivery)} delivery` : 'free delivery'})</p><p className="font-bold text-[#ed6126]">{formatINR(o.total)}</p></div>
                    <div className="sm:col-span-2"><p className="text-[#626262]">Delivering to</p><p>{o.customer.name} — {o.customer.house}, {o.customer.street}, {o.customer.city}, {o.customer.state} {o.customer.pin}</p></div>
                  </div>
                  {o.status === 'Pending' && (
                    <button onClick={() => { updateOrderStatus(o.id, 'Cancelled'); toast('Order cancelled'); }} className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-50">Cancel order</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
