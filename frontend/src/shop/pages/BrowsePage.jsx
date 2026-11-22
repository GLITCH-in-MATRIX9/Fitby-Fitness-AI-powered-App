import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import CatalogSection from '../components/CatalogSection';

export default function BrowsePage() {
  const [params] = useSearchParams();
  const { categories, subcategories } = useShop();
  const initial = {
    cat: params.get('cat') || '', sub: params.get('sub') || '', tag: params.get('tag') || '',
    q: params.get('q') || '', sort: params.get('sort') || 'featured',
  };
  const cat = categories.find((c) => c.id === initial.cat);
  const sub = subcategories.find((s) => s.id === initial.sub);
  const title = sub?.name || cat?.name || initial.tag || 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-[#626262] mb-4">
        <Link to="/shop" className="hover:text-[#ed6126]">Shop</Link><ChevronRight size={14} />
        {cat ? <><Link to={`/shop/browse?cat=${cat.id}`} className="hover:text-[#ed6126]">{cat.name}</Link>{sub && <><ChevronRight size={14} /><span className="text-gray-900">{sub.name}</span></>}</> : <span className="text-gray-900">{title}</span>}
      </nav>
      {/* key remounts the catalog when the URL query changes (e.g. clicking another category) */}
      <CatalogSection key={params.toString()} initial={initial} title={title} />
    </div>
  );
}
