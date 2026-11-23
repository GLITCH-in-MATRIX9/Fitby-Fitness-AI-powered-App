import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Search, Package } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/helpers';
import ShopImage from '../../components/ShopImage';

function InlineNumber({ value, onSave, min = 0, width = 'w-20' }) {
  const [v, setV] = useState(String(value));
  const [last, setLast] = useState(value);
  if (value !== last) { setLast(value); setV(String(value)); } // re-sync when the store changes
  const commit = () => {
    const n = Number(v);
    if (v === '' || Number.isNaN(n) || n < min) { setV(String(value)); return; }
    if (n !== value) onSave(n);
  };
  return <input type="number" min={min} value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} className={`${width} border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#ed6126]`} />;
}

export default function ManageProducts() {
  const { products, categories, subcategories, updateProduct, deleteProduct, toast } = useShop();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [confirm, setConfirm] = useState(null);

  const list = products.filter((p) => (!cat || p.categoryId === cat) && (!q.trim() || [p.name, p.brand].join(' ').toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Manage Products</h1><p className="text-sm text-[#626262]">{products.length} products · edits show instantly in the shop</p></div>
        <Link to="/shop/admin/add" className="bg-[#ed6126] text-white px-4 py-2 rounded-md font-semibold hover:bg-black transition">+ Add Product</Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full border border-gray-200 bg-white rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#ed6126]" /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-gray-200 bg-white rounded-md px-3 py-2 text-sm"><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        {list.length === 0 ? <div className="py-14 text-center text-[#626262]"><Package size={36} className="mx-auto text-[#ed6126] mb-2" />No products found.</div> : (
          <table className="w-full text-sm min-w-[720px]">
            <thead className="text-left text-xs text-[#626262] bg-gray-50"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price (₹)</th><th className="p-3">Stock</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg overflow-hidden bg-orange-50 shrink-0"><ShopImage src={p.images?.[0]} alt="" label={p.name} className="w-full h-full object-cover" /></div>
                    <div className="min-w-0"><p className="font-medium line-clamp-1">{p.name}</p><p className="text-xs text-[#626262]">{p.brand} · final {formatINR(p.finalPrice)}{p.discount ? ` (-${p.discount}%)` : ''}</p></div></div></td>
                  <td className="p-3 text-[#626262]">{categories.find((c) => c.id === p.categoryId)?.name || '—'}<br /><span className="text-xs">{subcategories.find((s) => s.id === p.subcategoryId)?.name}</span></td>
                  <td className="p-3"><InlineNumber value={p.price} min={1} onSave={(n) => { updateProduct(p.id, { price: n }); toast('Price updated'); }} /></td>
                  <td className="p-3"><InlineNumber value={p.stock} width="w-16" onSave={(n) => { updateProduct(p.id, { stock: Math.round(n) }); toast('Stock updated'); }} /></td>
                  <td className="p-3"><div className="flex justify-end gap-1">
                    <Link to={`/shop/admin/edit/${p.id}`} className="p-2 rounded-md hover:bg-orange-50 text-[#ed6126]" aria-label="Edit"><Pencil size={16} /></Link>
                    <button onClick={() => setConfirm(p)} className="p-2 rounded-md hover:bg-red-50 text-red-500" aria-label="Delete"><Trash2 size={16} /></button></div></td>
                </tr>))}
            </tbody>
          </table>
        )}
      </div>
      {confirm && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg">Delete product?</h3><p className="text-sm text-[#626262] mt-1">“{confirm.name}” will be removed from the shop and from any carts. Past orders keep their record.</p>
            <div className="flex justify-end gap-2 mt-5"><button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={() => { deleteProduct(confirm.id); toast('Product deleted'); setConfirm(null); }} className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold">Delete</button></div>
          </div>
        </div>)}
    </div>
  );
}
