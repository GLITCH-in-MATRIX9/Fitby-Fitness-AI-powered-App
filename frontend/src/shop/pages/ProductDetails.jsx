import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/helpers';
import ShopImage from '../components/ShopImage';
import Stars from '../components/Stars';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, categories, subcategories, wishlist, toggleWishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const [sel, setSel] = useState({});
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [showErr, setShowErr] = useState(false);

  const p = products.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-[#626262] mt-2">It may have been removed by the shop admin.</p>
        <Link to="/shop" className="inline-block mt-6 bg-[#ed6126] text-white px-6 py-2 rounded-md font-semibold hover:bg-black transition">Back to Shop</Link>
      </div>
    );
  }
  const cat = categories.find((c) => c.id === p.categoryId);
  const sub = subcategories.find((s) => s.id === p.subcategoryId);
  const out = p.stock <= 0;
  const liked = wishlist.includes(p.id);
  const images = p.images?.length ? p.images : [''];
  const related = products.filter((x) => x.id !== p.id && x.categoryId === p.categoryId).slice(0, 4);

  const add = () => {
    setShowErr(true);
    return addToCart(p.id, sel, qty).ok;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center flex-wrap gap-1 text-sm text-[#626262] mb-6">
        <Link to="/shop" className="hover:text-[#ed6126]">Shop</Link><ChevronRight size={14} />
        {cat && <><Link to={`/shop/browse?cat=${cat.id}`} className="hover:text-[#ed6126]">{cat.name}</Link><ChevronRight size={14} /></>}
        {sub && <><Link to={`/shop/browse?cat=${cat?.id}&sub=${sub.id}`} className="hover:text-[#ed6126]">{sub.name}</Link><ChevronRight size={14} /></>}
        <span className="text-gray-900 line-clamp-1">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl shadow-sm p-5 md:p-8">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-orange-50">
            <ShopImage src={images[img]} alt={p.name} label={p.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto shop-hide-scroll">
              {images.map((im, i) => (
                <button key={i} onClick={() => setImg(i)} className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 ${i === img ? 'border-[#ed6126]' : 'border-transparent'}`}>
                  <ShopImage src={im} alt="" label={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-[#626262]">{p.brand} · {cat?.name}{sub ? ` › ${sub.name}` : ''}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{p.name}</h1>
          <div className="mt-2"><Stars rating={p.rating} size={16} /></div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-[#ed6126]">{formatINR(p.finalPrice)}</span>
            {p.discount > 0 && <><span className="text-lg text-gray-400 line-through">{formatINR(p.price)}</span><span className="bg-orange-100 text-[#ed6126] text-xs font-bold px-2 py-1 rounded-full">{p.discount}% OFF</span></>}
          </div>
          <p className="mt-4 text-[#626262] leading-relaxed">{p.description}</p>
          <p className={`mt-3 text-sm font-semibold ${out ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
            {out ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : `In stock · ${p.stock} available`}
          </p>

          {(p.attributes || []).filter((a) => a.values.length).map((a) => (
            <div key={a.name} className="mt-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">{a.name}{sel[a.name] && <span className="font-normal text-[#626262]">: {sel[a.name]}</span>}</p>
              <div className="flex flex-wrap gap-2">
                {a.values.map((v) => (
                  <button key={v} onClick={() => setSel((s) => ({ ...s, [a.name]: v }))}
                    className={`px-4 py-2 rounded-md text-sm border transition ${sel[a.name] === v ? 'bg-[#ed6126] border-[#ed6126] text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-[#ed6126]'}`}>{v}</button>
                ))}
              </div>
              {showErr && !sel[a.name] && <p className="text-xs text-red-600 mt-1">Please choose a {a.name.toLowerCase()}</p>}
            </div>
          ))}

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center border border-gray-300 rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:text-[#ed6126]" aria-label="Decrease quantity"><Minus size={16} /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} className="p-2.5 hover:text-[#ed6126]" aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button onClick={() => toggleWishlist(p.id)} className="w-11 h-11 border border-gray-300 rounded-md flex items-center justify-center hover:border-[#ed6126]" aria-label="Toggle wishlist">
              <Heart size={20} className={liked ? 'fill-[#ed6126] text-[#ed6126]' : 'text-gray-500'} />
            </button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button onClick={add} disabled={out} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#ed6126] text-white py-3 rounded-md font-semibold hover:bg-black transition disabled:bg-gray-300 disabled:cursor-not-allowed"><ShoppingCart size={18} /> Add to Cart</button>
            <button onClick={() => add() && navigate('/shop/cart')} disabled={out} className="flex-1 inline-flex items-center justify-center gap-2 border border-[#ed6126] text-[#ed6126] py-3 rounded-md font-semibold hover:bg-[#ed6126] hover:text-white transition disabled:opacity-40"><Zap size={18} /> Buy Now</button>
          </div>

          <div className="mt-6 pt-5 border-t text-sm grid grid-cols-2 gap-y-2">
            <span className="text-[#626262]">Category</span><span>{cat?.name || '—'}</span>
            <span className="text-[#626262]">Subcategory</span><span>{sub?.name || '—'}</span>
            <span className="text-[#626262]">Brand</span><span>{p.brand || '—'}</span>
            {(p.attributes || []).map((a) => <div key={a.name} className="contents"><span className="text-[#626262]">{a.name}</span><span>{a.values.join(', ')}</span></div>)}
            {p.tags?.length > 0 && <><span className="text-[#626262]">Tags</span><span className="flex flex-wrap gap-1">{p.tags.map((t) => <Link key={t} to={`/shop/browse?tag=${encodeURIComponent(t)}`} className="text-xs bg-gray-100 hover:bg-orange-100 px-2 py-0.5 rounded-full">{t}</Link>)}</span></>}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-5">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  );
}
