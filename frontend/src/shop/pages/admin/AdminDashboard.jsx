import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, CheckCircle2, Truck, IndianRupee } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ALL_STATUSES, formatDate, formatINR } from '../../utils/helpers';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const { products, orders } = useShop();
  const count = (s) => orders.filter((o) => o.status === s).length;
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const stats = [
    ['Total Products', products.length, Package], ['Total Orders', orders.length, ShoppingBag], ['Pending Orders', count('Pending'), Clock],
    ['Accepted Orders', count('Accepted'), CheckCircle2], ['Delivered Orders', count('Delivered'), Truck], ['Mock Revenue', formatINR(revenue), IndianRupee],
  ];
  const low = products.filter((p) => p.stock <= 5).slice(0, 5);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-sm text-[#626262]">Overview of your demo store</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((st) => (
          <div key={st[0]} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <span className="w-11 h-11 rounded-xl bg-orange-50 text-[#ed6126] flex items-center justify-center shrink-0">{(() => { const Icon = st[2]; return <Icon size={22} />; })()}</span>
            <div><p className="text-xs text-[#626262]">{st[0]}</p><p className="text-xl font-bold">{st[1]}</p></div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex justify-between mb-3"><h2 className="font-bold">Recent Orders</h2><Link to="/shop/admin/orders" className="text-sm text-[#ed6126] font-semibold">View all</Link></div>
          {orders.length === 0 ? <p className="text-sm text-[#626262] py-6 text-center">No orders yet.</p> : (
            <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="py-3 pr-3"><Link to="/shop/admin/orders" className="font-mono text-xs font-semibold hover:text-[#ed6126]">{o.id}</Link><p className="text-xs text-[#626262]">{formatDate(o.createdAt)}</p></td>
                  <td className="py-3 pr-3">{o.customer.name}</td><td className="py-3 pr-3 font-semibold">{formatINR(o.total)}</td><td className="py-3"><StatusBadge status={o.status} /></td>
                </tr>))}
            </tbody></table></div>
          )}
        </section>
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold mb-3">Order Status Overview</h2>
            <div className="space-y-2.5">
              {ALL_STATUSES.map((s) => { const n = count(s); return (
                <div key={s}><div className="flex justify-between text-xs mb-1"><span>{s}</span><span className="font-semibold">{n}</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s === 'Cancelled' ? 'bg-red-400' : 'bg-[#ed6126]'}`} style={{ width: `${orders.length ? (n / orders.length) * 100 : 0}%` }} /></div></div>); })}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold mb-3">Low Stock</h2>
            {low.length === 0 ? <p className="text-sm text-[#626262]">All products are well stocked.</p> : low.map((p) => (
              <div key={p.id} className="flex justify-between text-sm py-1.5 border-t first:border-0"><span className="truncate pr-2">{p.name}</span><span className={p.stock === 0 ? 'text-red-600 font-semibold' : 'text-amber-600 font-semibold'}>{p.stock === 0 ? 'Out' : `${p.stock} left`}</span></div>))}
          </div>
        </section>
      </div>
    </div>
  );
}
