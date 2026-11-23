import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/helpers';
import ShopImage from '../components/ShopImage';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { orders } = useShop();
  const o = orders.find((x) => x.id === orderId);
  if (!o) return (
    <div className="max-w-xl mx-auto py-24 px-4 text-center"><h2 className="text-2xl font-bold">Order not found</h2>
      <Link to="/shop/orders" className="inline-block mt-6 bg-[#ed6126] text-white px-6 py-2 rounded-md font-semibold">My Orders</Link></div>
  );
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 text-center shop-pop">
        <CheckCircle2 size={64} className="mx-auto text-green-500" />
        <h1 className="text-3xl font-bold mt-4">Order placed!</h1>
        <p className="text-[#626262] mt-2">Thanks, {o.customer.name.split(' ')[0]}. We&apos;ve sent the details to {o.customer.email} (demo — no email is actually sent).</p>
        <p className="mt-5 inline-block bg-orange-50 text-[#ed6126] font-mono font-semibold px-4 py-2 rounded-md">{o.id}</p>
        <div className="mt-6 text-left border-t pt-5 space-y-3">
          {o.items.map((i) => (
            <div key={i.key} className="flex gap-3 items-center text-sm">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-orange-50"><ShopImage src={i.image} alt="" label={i.name} className="w-full h-full object-cover" /></div>
              <div className="flex-1"><p className="font-medium">{i.name}</p><p className="text-xs text-[#626262]">{Object.values(i.attrs).join(' · ')} · Qty {i.qty}</p></div>
              <span className="font-semibold">{formatINR(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3 font-bold"><span>Total</span><span className="text-[#ed6126]">{formatINR(o.total)}</span></div>
          <p className="text-sm text-[#626262]">Payment: {o.payment.method} — <b>{o.payment.status}</b></p>
          <p className="text-sm text-[#626262]">Deliver to: {o.customer.house}, {o.customer.street}, {o.customer.city}, {o.customer.state} {o.customer.pin}</p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop/orders" className="bg-[#ed6126] text-white px-6 py-3 rounded-md font-semibold hover:bg-black transition">Track Order</Link>
          <Link to="/shop" className="border border-[#ed6126] text-[#ed6126] px-6 py-3 rounded-md font-semibold hover:bg-[#ed6126] hover:text-white transition">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
