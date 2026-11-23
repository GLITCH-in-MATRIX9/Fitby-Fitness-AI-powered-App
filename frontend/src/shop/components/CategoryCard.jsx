import { Link } from 'react-router-dom';
import ShopImage from './ShopImage';

export default function CategoryCard({ category, count }) {
  return (
    <Link to={`/shop/browse?cat=${category.id}`} className="group relative block rounded-2xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-xl transition bg-orange-100">
      <ShopImage src={category.image} alt={category.name} label={category.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-[#ed6126]/85 transition" />
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="font-bold text-lg leading-tight">{category.name}</h3>
        <p className="text-xs text-white/85 line-clamp-1">{category.description}</p>
        <p className="text-xs mt-1 font-medium">{count} {count === 1 ? 'product' : 'products'}</p>
      </div>
    </Link>
  );
}
