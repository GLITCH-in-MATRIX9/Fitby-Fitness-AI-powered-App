import { useState } from 'react';
import { X, Check, Ban } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ALL_STATUSES, ORDER_STATUSES, formatDate, formatINR } from '../../utils/helpers';
import StatusBadge from '../../components/StatusBadge';
import OrderTimeline from '../../components/OrderTimeline';

function OrderModal({ orderId, onClose }) {
  const { orders, updateOrderStatus, toast } = useShop();
  const o = orders.find((x) => x.id === orderId);
  if (!o) return null;
  const closed = o.status === 'Cancelled' || o.status === 'Delivered';
  const change = (s) => { updateOrderStatus(o.id, s); toast(`Order ${o.id} → ${s}`); };
  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start"><div><h3 className="font-bold text-lg font-mono">{o.id}</h3><p className="text-xs text-[#626262]">{formatDate(o.createdAt)}</p></div>
          <button onClick={onClose} aria-label="Close"><X /></button></div>
        <OrderTimeline order={o} />
        <div className="grid sm:grid-cols-2 gap-4 text-sm bg-gray-50 rounded-xl p-4">
          <div><p className="text-[#626262] text-xs">Customer</p><p className="font-medium">{o.customer.name}</p><p>{o.customer.email} · {o.customer.phone}</p></div>
          <div><p className="text-[#626262] text-xs">Address</p><p>{o.customer.house}, {o.customer.street}, {o.customer.city}, {o.customer.state} {o.customer.pin}</p></div>
          <div><p className="text-[#626262] text-xs">Payment</p><p className="font-medium">{o.payment.method} · {o.payment.status}</p></div>
          <div><p className="text-[#626262] text-xs">Amount</p><p className="font-bold text-[#ed6126]">{formatINR(o.total)}</p></div>
        </div>
        <div className="text-sm">{o.items.map((i) => <div key={i.key} className="flex justify-between py-2 border-t first:border-0"><div><p className="font-medium">{i.name} × {i.qty}</p><p className="text-xs text-[#626262]">{Object.entries(i.attrs).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p></div><span>{formatINR(i.price * i.qty)}</span></div>)}
          <div className="border-t pt-2 text-xs text-[#626262] flex justify-between"><span>Subtotal {formatINR(o.subtotal)} · Delivery {o.delivery ? formatINR(o.delivery) : 'Free'}</span></div></div>
        <div className="flex flex-wrap gap-2 items-center border-t pt-4">
          {o.status === 'Pending' && <>
            <button onClick={() => change('Accepted')} className="inline-flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-700"><Check size={16} /> Accept</button>
            <button onClick={() => change('Cancelled')} className="inline-flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-700"><Ban size={16} /> Reject</button></>}
          {!closed && o.status !== 'Pending' && <>
            <select value={o.status} onChange={(e) => change(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">{ORDER_STATUSES.filter((s) => s !== 'Pending').map((s) => <option key={s}>{s}</option>)}</select>
            <button onClick={() => change('Cancelled')} className="text-sm text-red-600 border border-red-200 px-3 py-2 rounded-md hover:bg-red-50">Cancel order</button></>}
          {closed && <p className="text-sm text-[#626262]">This order is {o.status.toLowerCase()} — no further changes.</p>}
        </div>
      </div>
    </div>
  );
}

export default function ManageOrders() {
  const { orders, updateOrderStatus, toast } = useShop();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState(null);
  const list = orders.filter((o) => (!status || o.status === status) && (!q.trim() || (o.id + o.customer.name).toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold">Manage Orders</h1><p className="text-sm text-[#626262]">Status changes appear instantly on the buyer’s order tracking.</p></div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order ID or customer…" className="flex-1 border border-gray-200 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ed6126]" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 bg-white rounded-md px-3 py-2 text-sm"><option value="">All statuses</option>{ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        {list.length === 0 ? <p className="py-14 text-center text-[#626262]">No orders found.</p> : (
          <table className="w-full text-sm min-w-[760px]">
            <thead className="text-left text-xs text-[#626262] bg-gray-50"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>{list.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3"><button onClick={() => setOpenId(o.id)} className="font-mono text-xs font-semibold hover:text-[#ed6126]">{o.id}</button><p className="text-xs text-[#626262]">{formatDate(o.createdAt)}</p></td>
                <td className="p-3">{o.customer.name}<p className="text-xs text-[#626262]">{o.customer.city}</p></td>
                <td className="p-3">{o.items.reduce((n, i) => n + i.qty, 0)}</td><td className="p-3 font-semibold">{formatINR(o.total)}</td>
                <td className="p-3 text-xs">{o.payment.method}<br /><b>{o.payment.status}</b></td><td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3"><div className="flex justify-end gap-1.5">
                  {o.status === 'Pending' && <>
                    <button onClick={() => { updateOrderStatus(o.id, 'Accepted'); toast('Order accepted'); }} className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-semibold">Accept</button>
                    <button onClick={() => { updateOrderStatus(o.id, 'Cancelled'); toast('Order rejected'); }} className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-semibold">Reject</button></>}
                  <button onClick={() => setOpenId(o.id)} className="px-2.5 py-1 rounded-md border text-xs font-semibold hover:border-[#ed6126] hover:text-[#ed6126]">{o.status === 'Pending' ? 'Details' : 'Update'}</button></div></td>
              </tr>))}</tbody>
          </table>)}
      </div>
      {openId && <OrderModal orderId={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
