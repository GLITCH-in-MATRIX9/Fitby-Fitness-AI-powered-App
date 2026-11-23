import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, Package, ClipboardList, Tags } from 'lucide-react';

const links = [
  ['/shop/admin', 'Dashboard', LayoutDashboard, true],
  ['/shop/admin/add', 'Add Product', PackagePlus],
  ['/shop/admin/products', 'Manage Products', Package],
  ['/shop/admin/orders', 'Manage Orders', ClipboardList],
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:flex gap-6 items-start">
      <aside className="md:w-56 shrink-0 mb-5 md:mb-0 md:sticky md:top-32">
        <nav className="bg-gray-900 rounded-2xl p-2 flex md:flex-col gap-1 overflow-x-auto shop-hide-scroll">
          {links.map((l) => (
            <NavLink key={l[0]} to={l[0]} end={l[3]} className={({ isActive }) => `flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-[#ed6126] text-white' : 'text-gray-300 hover:bg-white/10'}`}>
              {(() => { const Icon = l[2]; return <Icon size={18} />; })()} {l[1]}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0"><Outlet /></main>
    </div>
  );
}
