import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatINR, FREE_DELIVERY_ABOVE } from '../utils/helpers';
import ShopImage from '../components/ShopImage';

export function SummaryRows({ totals }) {
  return (
    <dl className="text-sm space-y-2">
      <div className="flex justify-between"><dt className="text-[#626262]">Subtotal</dt><dd>{formatINR(totals.subtotal)}</dd></div>
      {totals.discount > 0 && <div className="flex justify-between"><dt className="text-[#626262]">You save</dt><dd className="text-green-600">-{formatINR(totals.discount)}</dd></div>}
      <div className="flex justify-between"><dt className="text-[#626262]">Delivery</dt><dd>{totals.delivery === 0 ? 'FREE' : formatINR(totals.delivery)}</dd></div>
      <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd className="text-[#ed6126]">{formatINR(totals.total)}</dd></div>
    </dl>
  );
}

export default function CartPage() {
  const { cartItems, cartTotals, updateCartQty, removeFromCart } = useShop();
  const navigate = useNavigate();

  if (!cartItems.length) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <ShoppingBag size={56} className="mx-auto text-[#ed6126]" />
        <h2 className="text-2xl font-bold mt-4">Your cart is empty</h2>
        <p className="text-[#626262] mt-2">Looks like you haven&apos;t added any gear yet.</p>
        <Link to="/shop" className="inline-block mt-6 bg-[#ed6126] text-white px-6 py-3 rounded-md font-semibold hover:bg-black transition">Start Shopping</Link>
      </div>
    );
  }
  const toFree = FREE_DELIVERY_ABOVE - cartTotals.subtotal;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((c) => {
            const p = c.product;
            return (
              <div key={c.key} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
                <Link to={`/shop/product/${p.id}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-orange-50">
                  <ShopImage src={p.images?.[0]} alt={p.name} label={p.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link to={`/shop/product/${p.id}`} className="font-semibold hover:text-[#ed6126] line-clamp-2">{p.name}</Link>
                    <button onClick={() => removeFromCart(c.key)} className="text-gray-400 hover:text-red-600 shrink-0" aria-label="Remove item"><Trash2 size={18} /></button>
                  </div>
                  <p className="text-xs text-[#626262] mt-1">{Object.entries(c.attrs).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Standard'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-gray-300 rounded-md">
                      <button onClick={() => updateCartQty(c.key, c.qty - 1)} disabled={c.qty <= 1} className="p-1.5 disabled:opacity-30 hover:text-[#ed6126]" aria-label="Decrease"><Minus size={14} /></button>
                      <span className="w-9 text-center text-sm font-semibold">{c.qty}</span>
                      <button onClick={() => updateCartQty(c.key, c.qty + 1)} disabled={c.qty >= p.stock} className="p-1.5 disabled:opacity-30 hover:text-[#ed6126]" aria-label="Increase"><Plus size={14} /></button>
                    </div>
                    <div className="text-right"><p className="font-bold">{formatINR(p.finalPrice * c.qty)}</p><p className="text-xs text-[#626262]">{formatINR(p.finalPrice)} each</p></div>
                  </div>
                  {c.qty >= p.stock && <p className="text-xs text-amber-600 mt-1">Maximum available stock reached</p>}
                </div>
              </div>
            );
          })}
          <Link to="/shop" className="inline-flex items-center gap-2 text-[#ed6126] font-semibold hover:text-black"><ArrowLeft size={16} /> Continue Shopping</Link>
        </div>
        <aside className="bg-white rounded-2xl shadow-sm p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <SummaryRows totals={cartTotals} />
          {toFree > 0 && <p className="text-xs text-[#626262] mt-3 bg-orange-50 rounded-md p-2">Add {formatINR(toFree)} more for free delivery.</p>}
          <button onClick={() => navigate('/shop/checkout')} className="mt-5 w-full bg-[#ed6126] text-white py-3 rounded-md font-semibold hover:bg-black transition">Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  );
}
