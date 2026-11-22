import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Store, Search } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// remember where the user was in each mode so switching back feels continuous
const lastPath = { shopper: '/shop', admin: '/shop/admin' };

export default function ShopTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useShop();
  const [q, setQ] = useState('');
  const admin = pathname.startsWith('/shop/admin');

  useEffect(() => {
    if (admin) lastPath.admin = pathname;
    else if (!/^\/shop\/(checkout|confirmation)/.test(pathname)) lastPath.shopper = pathname;
  }, [pathname, admin]);

  const go = (mode) => { if ((mode === 'admin') !== admin) navigate(lastPath[mode]); };
  const t = 'transition-all duration-300 ease-out motion-reduce:transition-none';
  const link = ({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-[#ed6126]' : 'text-[#626262] hover:text-[#ed6126]'}`;

  return (
    <div className={`sticky top-[72px] z-40 border-b-[3px] ${t} ${admin ? 'bg-gray-900 border-[#ed6126]' : 'bg-white border-gray-200 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* left: brand ⇄ admin badge (cross-fade, fixed width so nothing jumps) */}
        <div className="relative h-8 w-32 shrink-0">
          <Link to="/shop" tabIndex={admin ? -1 : 0} className={`absolute inset-0 flex items-center font-bold text-gray-900 whitespace-nowrap ${t} ${admin ? 'opacity-0 -translate-y-1 pointer-events-none' : 'opacity-100'}`}>
            FitBy&nbsp;<span className="text-[#ed6126]">Shop</span>
          </Link>
          <span aria-hidden={!admin} className={`absolute inset-0 flex items-center ${t} ${admin ? 'opacity-100' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
            <span className="bg-[#ed6126] text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide">ADMIN MODE</span>
          </span>
        </div>

        {/* search collapses away in admin */}
        <form inert={admin} onSubmit={(e) => { e.preventDefault(); navigate(`/shop/browse?q=${encodeURIComponent(q.trim())}`); }}
          className={`hidden md:flex relative overflow-hidden ${t} ${admin ? 'flex-none max-w-0 opacity-0' : 'flex-1 max-w-md opacity-100'}`}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full border border-gray-200 rounded-full pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-[#ed6126]" />
        </form>

        {/* shopper links collapse away in admin */}
        <nav inert={admin} className={`ml-auto flex items-center gap-4 overflow-visible whitespace-nowrap ${t} ${admin ? 'max-w-0 opacity-0 !overflow-hidden ml-0' : 'max-w-xs opacity-100'}`}>
          <NavLink to="/shop" end className={link}>Home</NavLink>
          <NavLink to="/shop/orders" className={link}>My Orders</NavLink>
          <NavLink to="/shop/cart" className={(s) => `${link(s)} relative inline-flex items-center gap-1`}>
            <ShoppingCart size={18} /><span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-[#ed6126] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{cartCount}</span>}
          </NavLink>
        </nav>

        {/* sliding segmented toggle */}
        <div role="group" aria-label="Switch mode" className={`relative ${admin ? 'ml-auto' : ''} shrink-0 inline-flex rounded-full p-1 text-xs font-semibold ${t} ${admin ? 'bg-white/10' : 'bg-gray-100'}`}>
          <span aria-hidden className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#ed6126] shadow transition-transform duration-300 ease-out motion-reduce:transition-none ${admin ? 'translate-x-full' : ''}`} />
          <button onClick={() => go('shopper')} aria-pressed={!admin} className={`relative z-10 w-24 py-1.5 rounded-full inline-flex items-center justify-center gap-1 transition-colors duration-300 ${!admin ? 'text-white' : 'text-gray-300 hover:text-white'}`}><Store size={14} /> Shopper</button>
          <button onClick={() => go('admin')} aria-pressed={admin} className={`relative z-10 w-24 py-1.5 rounded-full inline-flex items-center justify-center gap-1 transition-colors duration-300 ${admin ? 'text-white' : 'text-[#626262] hover:text-black'}`}><ShieldCheck size={14} /> Admin</button>
        </div>
      </div>
    </div>
  );
}
