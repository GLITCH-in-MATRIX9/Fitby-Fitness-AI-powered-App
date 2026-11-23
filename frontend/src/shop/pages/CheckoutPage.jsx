import { useContext, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, Loader2, Lock, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/helpers';
import { SummaryRows } from './CartPage';
import ShopImage from '../components/ShopImage';

const METHODS = [
  { id: 'Credit/Debit Card', label: 'Credit / Debit Card', icon: CreditCard, note: 'Demo only' },
  { id: 'UPI', label: 'UPI', icon: Smartphone, note: 'Demo only' },
  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, note: 'Pay when it arrives' },
];

const validateDelivery = (d) => {
  const e = {};
  if (d.name.trim().length < 2) e.name = 'Enter your full name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email';
  if (!/^\d{10}$/.test(d.phone)) e.phone = 'Enter a 10-digit phone number';
  if (!d.house.trim()) e.house = 'Required';
  if (!d.street.trim()) e.street = 'Required';
  if (!d.city.trim()) e.city = 'Required';
  if (!d.state.trim()) e.state = 'Required';
  if (!/^\d{6}$/.test(d.pin)) e.pin = 'Enter a 6-digit PIN code';
  return e;
};

const validateCard = (c) => {
  const e = {};
  if (c.name.trim().length < 2) e.cardName = 'Enter the cardholder name';
  if (c.number.replace(/\s/g, '').length !== 16) e.cardNumber = 'Enter a 16-digit card number';
  const m = c.expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m || +m[1] < 1 || +m[1] > 12) e.expiry = 'Use MM/YY';
  else {
    const now = new Date();
    const exp = new Date(2000 + +m[2], +m[1], 0, 23, 59);
    if (exp < now) e.expiry = 'Card has expired';
  }
  if (!/^\d{3,4}$/.test(c.cvv)) e.cvv = '3 or 4 digits';
  return e;
};

export default function CheckoutPage() {
  const { cartItems, cartTotals, placeOrder, toast } = useShop();
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const submitted = useRef(false);

  const [d, setD] = useState({ name: user?.name || '', email: user?.email || '', phone: '', house: '', street: '', city: '', state: '', pin: '' });
  const [method, setMethod] = useState(METHODS[0].id);
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [errors, setErrors] = useState({});
  const [payError, setPayError] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!cartItems.length && !submitted.current) return <Navigate to="/shop/cart" replace />;

  const field = (key, label, props = {}) => (
    <label className={`block ${props.span || ''}`}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input value={d[key]} onChange={(e) => setD({ ...d, [key]: e.target.value })} {...props.input}
        className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ed6126]/40 ${errors[key] ? 'border-red-400' : 'border-gray-200 focus:border-[#ed6126]'}`} />
      {errors[key] && <span className="text-xs text-red-600">{errors[key]}</span>}
    </label>
  );
  const cardInput = 'mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ed6126]/40';

  const pay = async (ev) => {
    ev.preventDefault();
    setPayError('');
    let errs = validateDelivery(d);
    if (method === 'Credit/Debit Card') errs = { ...errs, ...validateCard(card) };
    if (method === 'UPI' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upi.trim())) errs.upi = 'Enter a valid UPI ID (e.g. name@bank)';
    setErrors(errs);
    if (Object.keys(errs).length) { toast('Please fix the highlighted fields', 'error'); return; }

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1600)); // simulated gateway latency
    const declined = (method === 'Credit/Debit Card' && card.number.replace(/\s/g, '').endsWith('0000')) || (method === 'UPI' && upi.toLowerCase().startsWith('fail'));
    if (declined) {
      setProcessing(false);
      setPayError('Payment declined (simulated). Try another card or method — nothing was charged.');
      return;
    }
    submitted.current = true;
    const order = placeOrder({
      customer: { ...d },
      payment: { method, status: method === 'Cash on Delivery' ? 'Pending' : 'Paid' }, // card/UPI details are never stored
    });
    setCard({ name: '', number: '', expiry: '', cvv: '' });
    navigate(`/shop/confirmation/${order.id}`, { replace: true });
  };

  return (
    <form onSubmit={pay} className="max-w-6xl mx-auto px-4 py-8" noValidate>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
            <h2 className="font-bold text-lg mb-4">1. Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('name', 'Full Name', { input: { autoComplete: 'name' } })}
              {field('email', 'Email', { input: { type: 'email', autoComplete: 'email' } })}
              {field('phone', 'Phone Number', { input: { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel' } })}
              {field('house', 'House / Flat Number')}
              {field('street', 'Street Address', { span: 'sm:col-span-2' })}
              {field('city', 'City')}
              {field('state', 'State')}
              {field('pin', 'PIN Code', { input: { inputMode: 'numeric', maxLength: 6 } })}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
            <h2 className="font-bold text-lg mb-1">2. Payment</h2>
            <p className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-md p-2 mb-4"><AlertTriangle size={14} /> Simulated checkout — no real payment is processed and card details are never stored or sent anywhere.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {METHODS.map((m) => (
                <button type="button" key={m.id} onClick={() => { setMethod(m.id); setPayError(''); }}
                  className={`text-left p-3 rounded-xl border-2 transition ${method === m.id ? 'border-[#ed6126] bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                  <m.icon size={20} className="text-[#ed6126]" />
                  <p className="font-semibold text-sm mt-1">{m.label}</p><p className="text-xs text-[#626262]">{m.note}</p>
                </button>
              ))}
            </div>

            {method === 'Credit/Debit Card' && (
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <label className="sm:col-span-2 block"><span className="text-sm font-medium">Cardholder Name</span>
                  <input value={card.name} autoComplete="off" onChange={(e) => setCard({ ...card, name: e.target.value })} className={`${cardInput} ${errors.cardName ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.cardName && <span className="text-xs text-red-600">{errors.cardName}</span>}</label>
                <label className="sm:col-span-2 block"><span className="text-sm font-medium">Card Number</span>
                  <input value={card.number} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" maxLength={19}
                    onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() })} className={`${cardInput} ${errors.cardNumber ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.cardNumber && <span className="text-xs text-red-600">{errors.cardNumber}</span>}</label>
                <label className="block"><span className="text-sm font-medium">Expiry (MM/YY)</span>
                  <input value={card.expiry} inputMode="numeric" autoComplete="off" placeholder="08/29" maxLength={5}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setCard({ ...card, expiry: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v }); }} className={`${cardInput} ${errors.expiry ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.expiry && <span className="text-xs text-red-600">{errors.expiry}</span>}</label>
                <label className="block"><span className="text-sm font-medium">CVV</span>
                  <input value={card.cvv} type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="•••"
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} className={`${cardInput} ${errors.cvv ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.cvv && <span className="text-xs text-red-600">{errors.cvv}</span>}</label>
                <p className="sm:col-span-2 text-xs text-[#626262]">Demo tip: any 16 digits succeed; a number ending in <b>0000</b> simulates a declined payment.</p>
              </div>
            )}
            {method === 'UPI' && (
              <label className="block mt-5"><span className="text-sm font-medium">UPI ID</span>
                <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@bank" autoComplete="off" className={`${cardInput} ${errors.upi ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.upi && <span className="text-xs text-red-600">{errors.upi}</span>}
                <span className="block text-xs text-[#626262] mt-1">Demo tip: a UPI ID starting with &quot;fail&quot; simulates a declined payment.</span></label>
            )}
            {method === 'Cash on Delivery' && <p className="mt-5 text-sm text-[#626262] bg-gray-50 rounded-md p-3">Pay {formatINR(cartTotals.total)} in cash when your order arrives. Payment status will show as <b>Pending</b> until delivery.</p>}
            {payError && <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-md p-3">{payError}</p>}
          </section>
        </div>

        <aside className="bg-white rounded-2xl shadow-sm p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4 max-h-72 overflow-y-auto">
            {cartItems.map((c) => (
              <li key={c.key} className="flex gap-3 text-sm">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-orange-50 shrink-0"><ShopImage src={c.product.images?.[0]} alt="" label={c.product.name} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium line-clamp-1">{c.product.name}</p>
                  <p className="text-xs text-[#626262] line-clamp-1">{Object.entries(c.attrs).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
                  <p className="text-xs text-[#626262]">Qty {c.qty}</p></div>
                <span className="font-semibold">{formatINR(c.product.finalPrice * c.qty)}</span>
              </li>
            ))}
          </ul>
          <SummaryRows totals={cartTotals} />
          <button type="submit" disabled={processing} className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#ed6126] text-white py-3 rounded-md font-semibold hover:bg-black transition disabled:opacity-70">
            {processing ? <><Loader2 size={18} className="shop-spin" /> Processing…</> : <><Lock size={16} /> {method === 'Cash on Delivery' ? 'Place Order' : `Pay ${formatINR(cartTotals.total)}`}</>}
          </button>
          <Link to="/shop/cart" className="block text-center text-sm text-[#626262] hover:text-[#ed6126] mt-3">Back to cart</Link>
        </aside>
      </div>
    </form>
  );
}
