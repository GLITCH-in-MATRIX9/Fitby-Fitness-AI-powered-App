import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/helpers';
import ShopImage from './ShopImage';
import Stars from './Stars';

export default function ProductCard({ product: p }) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const liked = wishlist.includes(p.id);
  const out = p.stock <= 0;
  const needsOptions = (p.attributes || []).some((a) => a.values.length);

  const handleAdd = () => {
    if (needsOptions) navigate(`/shop/product/${p.id}`); // attributes must be chosen first
    else addToCart(p.id);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-orange-50">
        <Link to={`/shop/product/${p.id}`}>
          <ShopImage src={p.images?.[0]} alt={p.name} label={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        </Link>
        {p.discount > 0 && <span className="absolute top-3 left-3 bg-[#ed6126] text-white text-xs font-bold px-2 py-1 rounded-full">-{p.discount}%</span>}
        {out && <span className="absolute bottom-3 left-3 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">Out of stock</span>}
        <button onClick={() => toggleWishlist(p.id)} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition">
          <Heart size={18} className={liked ? 'fill-[#ed6126] text-[#ed6126]' : 'text-gray-500'} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[#626262]">{p.brand}</p>
        <Link to={`/shop/product/${p.id}`} className="font-semibold text-gray-900 hover:text-[#ed6126] line-clamp-2 min-h-[2.75rem]">{p.name}</Link>
        <div className="mt-1"><Stars rating={p.rating} /></div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatINR(p.finalPrice)}</span>
          {p.discount > 0 && <span className="text-sm text-gray-400 line-through">{formatINR(p.price)}</span>}
        </div>
        <button onClick={handleAdd} disabled={out}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#ed6126] text-white py-2 rounded-md font-semibold hover:bg-black transition disabled:bg-gray-300 disabled:cursor-not-allowed">
          <ShoppingCart size={16} /> {out ? 'Unavailable' : needsOptions ? 'Select Options' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
