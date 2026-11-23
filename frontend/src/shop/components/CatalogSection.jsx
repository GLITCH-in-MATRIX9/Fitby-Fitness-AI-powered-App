import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

const EMPTY = { q: '', cat: '', sub: '', tag: '', min: '', max: '', rating: 0, brand: '', inStock: false, purchased: false, favorites: false, sort: 'featured' };

const SORTS = [
  ['featured', 'Featured'], ['newest', 'Newest Arrivals'], ['best', 'Best Sellers'],
  ['priceAsc', 'Price: Low to High'], ['priceDesc', 'Price: High to Low'], ['rating', 'Top Rated'],
];

export default function CatalogSection({ initial = {}, title = 'All Products' }) {
  const { products, categories, subcategories, tags, orders, wishlist } = useShop();
  const [f, setF] = useState({ ...EMPTY, ...initial });
  const [open, setOpen] = useState(false);
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products]);
  const purchased = useMemo(() => new Set(orders.filter((o) => o.status !== 'Cancelled').flatMap((o) => o.items.map((i) => i.productId))), [orders]);
  const subs = subcategories.filter((s) => s.categoryId === f.cat);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const min = f.min === '' ? 0 : Number(f.min);
    const max = f.max === '' ? Infinity : Number(f.max);
    let out = products.filter((p) => {
      if (q) {
        const cat = categories.find((c) => c.id === p.categoryId)?.name || '';
        const sub = subcategories.find((s) => s.id === p.subcategoryId)?.name || '';
        if (![p.name, p.brand, p.description, cat, sub, ...(p.tags || [])].join(' ').toLowerCase().includes(q)) return false;
      }
      if (f.cat && p.categoryId !== f.cat) return false;
      if (f.sub && p.subcategoryId !== f.sub) return false;
      if (f.tag) {
        const tagged = (p.tags || []).some((t) => t.toLowerCase() === f.tag.toLowerCase());
        if (!(tagged || (f.tag.toLowerCase() === 'sale' && p.discount > 0))) return false;
      }
      if (p.finalPrice < min || p.finalPrice > max) return false;
      if (f.rating && p.rating < f.rating) return false;
      if (f.brand && p.brand !== f.brand) return false;
      if (f.inStock && p.stock <= 0) return false;
      if (f.purchased && !purchased.has(p.id)) return false;
      if (f.favorites && !wishlist.includes(p.id)) return false;
      return true;
    });
    const by = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      best: (a, b) => (b.sales || 0) - (a.sales || 0),
      priceAsc: (a, b) => a.finalPrice - b.finalPrice,
      priceDesc: (a, b) => b.finalPrice - a.finalPrice,
      rating: (a, b) => b.rating - a.rating,
    }[f.sort];
    if (by) out = [...out].sort(by);
    return out;
  }, [products, categories, subcategories, f, purchased, wishlist]);

  const activeCount = ['q', 'cat', 'sub', 'tag', 'min', 'max', 'brand'].filter((k) => f[k] !== '').length
    + (f.rating ? 1 : 0) + ['inStock', 'purchased', 'favorites'].filter((k) => f[k]).length;

  const input = 'w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ed6126]/40 focus:border-[#ed6126] bg-white';
  const chip = (on) => `px-3 py-1.5 rounded-full text-xs font-medium border transition ${on ? 'bg-[#ed6126] border-[#ed6126] text-white' : 'bg-white border-gray-200 text-[#626262] hover:border-[#ed6126] hover:text-[#ed6126]'}`;

  const Filters = (
    <div className="space-y-6 text-sm">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
        <div className="flex flex-wrap gap-2">
          <button className={chip(!f.cat)} onClick={() => set({ cat: '', sub: '' })}>All</button>
          {categories.map((c) => <button key={c.id} className={chip(f.cat === c.id)} onClick={() => set({ cat: c.id, sub: '' })}>{c.name}</button>)}
        </div>
        {subs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pl-3 border-l-2 border-orange-200">
            {subs.map((s) => <button key={s.id} className={chip(f.sub === s.id)} onClick={() => set({ sub: f.sub === s.id ? '' : s.id })}>{s.name}</button>)}
          </div>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Price (₹)</h4>
        <div className="flex items-center gap-2">
          <input type="number" min="0" placeholder="Min" value={f.min} onChange={(e) => set({ min: e.target.value })} className={input} />
          <span className="text-gray-400">–</span>
          <input type="number" min="0" placeholder="Max" value={f.max} onChange={(e) => set({ max: e.target.value })} className={input} />
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Rating</h4>
        <select value={f.rating} onChange={(e) => set({ rating: Number(e.target.value) })} className={input}>
          <option value={0}>Any rating</option><option value={4.5}>4.5 &amp; up</option><option value={4}>4 &amp; up</option><option value={3}>3 &amp; up</option>
        </select>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Brand</h4>
        <select value={f.brand} onChange={(e) => set({ brand: e.target.value })} className={input}>
          <option value="">All brands</option>{brands.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Collection / Tag</h4>
        <select value={f.tag} onChange={(e) => set({ tag: e.target.value })} className={input}>
          <option value="">All</option>{tags.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {[['inStock', 'In stock only'], ['purchased', 'Previously purchased'], ['favorites', 'Favorites only']].map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer text-[#626262]">
            <input type="checkbox" checked={f[k]} onChange={(e) => set({ [k]: e.target.checked })} className="accent-[#ed6126] w-4 h-4" /> {label}
          </label>
        ))}
      </div>
      <button onClick={() => setF({ ...EMPTY })} disabled={!activeCount && f.sort === 'featured'}
        className="w-full border border-[#ed6126] text-[#ed6126] py-2 rounded-md font-semibold hover:bg-[#ed6126] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#ed6126]">
        Clear all filters
      </button>
    </div>
  );

  return (
    <section id="all-products" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-[#626262] mt-1">{list.length} {list.length === 1 ? 'product' : 'products'} found</p>
        </div>
        <div className="flex gap-2 flex-1 md:max-w-xl md:justify-end">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search products, brands, categories…" className={`${input} pl-9`} />
          </div>
          <select value={f.sort} onChange={(e) => set({ sort: e.target.value })} className={`${input} !w-auto`} aria-label="Sort products">
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button onClick={() => setOpen(true)} className="md:hidden relative border border-gray-200 bg-white rounded-md px-3" aria-label="Open filters">
            <SlidersHorizontal size={18} />
            {activeCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#ed6126] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <aside className="hidden md:block w-64 shrink-0 bg-white rounded-2xl shadow-sm p-5 sticky top-24">{Filters}</aside>
        <div className="flex-1 min-w-0">
          {list.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm py-16 px-6 text-center">
              <PackageSearch size={44} className="mx-auto text-[#ed6126] mb-3" />
              <h3 className="font-semibold text-gray-900">No products match your filters</h3>
              <p className="text-sm text-[#626262] mt-1">Try a different search or clear the filters.</p>
              <button onClick={() => setF({ ...EMPTY })} className="mt-4 bg-[#ed6126] text-white px-5 py-2 rounded-md font-semibold hover:bg-black transition">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-[90] bg-black/50 flex justify-end" onClick={() => setOpen(false)}>
          <div className="bg-white w-80 max-w-full h-full overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">Filters</h3><button onClick={() => setOpen(false)} aria-label="Close filters"><X /></button></div>
            {Filters}
            <button onClick={() => setOpen(false)} className="mt-4 w-full bg-[#ed6126] text-white py-2 rounded-md font-semibold">Show {list.length} results</button>
          </div>
        </div>
      )}
    </section>
  );
}
