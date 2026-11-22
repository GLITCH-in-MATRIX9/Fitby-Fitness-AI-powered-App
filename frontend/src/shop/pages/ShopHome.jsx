import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { hasTag } from '../utils/helpers';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import CatalogSection from '../components/CatalogSection';
import ShopImage from '../components/ShopImage';

const HERO_IMG = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=70';
const PROMO_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=70';

function ProductRow({ title, subtitle, products, to }) {
  if (!products.length) return null; // graceful: hide empty collections
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} to={to} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

export default function ShopHome() {
  const { products, categories } = useShop();
  const byNew = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
  const featured = [...products].filter((p) => p.stock > 0 && (p.rating >= 4.5 || p.discount >= 15)).sort((a, b) => b.rating - a.rating);
  const arrivals = products.filter((p) => hasTag(p, 'New Arrival')).sort(byNew);
  const trending = products.filter((p) => hasTag(p, 'Trending')).sort(byNew);
  const bestSellers = products.filter((p) => hasTag(p, 'Best Seller')).sort((a, b) => (b.sales || 0) - (a.sales || 0));
  const sale = products.filter((p) => p.discount > 0 || hasTag(p, 'Sale')).sort((a, b) => b.discount - a.discount);
  const countFor = (id) => products.filter((p) => p.categoryId === id).length;

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ed6126] to-[#b8430f]">
        <ShopImage src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-28 text-white">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium"><Sparkles size={14} /> New Arrivals · Explore the Collection</span>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight max-w-2xl">Gear Up. Move Better. Live Stronger.</h1>
          <p className="mt-4 text-white/90 max-w-xl md:text-lg">Premium sportswear, equipment and nutrition picked to support every rep, run and recovery on your FitBy journey.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#all-products" className="inline-flex items-center gap-2 bg-white text-[#ed6126] px-6 py-3 rounded-md font-bold hover:bg-black hover:text-white transition">Shop Now <ArrowRight size={18} /></a>
            <a href="#categories" className="inline-flex items-center gap-2 border border-white/70 px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition">Browse Categories</a>
          </div>
        </div>
      </section>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-[#626262]">
          <span className="flex items-center gap-2 justify-center"><Truck size={18} className="text-[#ed6126]" /> Free delivery over ₹999</span>
          <span className="flex items-center gap-2 justify-center"><ShieldCheck size={18} className="text-[#ed6126]" /> Secure (demo) checkout</span>
          <span className="flex items-center gap-2 justify-center"><RotateCcw size={18} className="text-[#ed6126]" /> Easy order tracking</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* 2. Categories */}
        <section id="categories" className="scroll-mt-24">
          <SectionHeader title="Shop by Categories" subtitle="Find gear built for the way you train" />
          {categories.length === 0 ? <p className="text-[#626262]">No categories yet.</p> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((c) => <CategoryCard key={c.id} category={c} count={countFor(c.id)} />)}
            </div>
          )}
        </section>

        {/* 3. Featured */}
        <ProductRow title="Featured Products" subtitle="Top-rated and best-value picks" products={featured} to="/shop/browse?sort=best" />
        {/* 4. New arrivals */}
        <ProductRow title="New Arrivals" subtitle="Fresh drops, newest first" products={arrivals} to="/shop/browse?tag=New%20Arrival&sort=newest" />
        {/* 5. Trending / best sellers */}
        <ProductRow title="Trending Now" subtitle="Products tagged Trending" products={trending} to="/shop/browse?tag=Trending" />
        <ProductRow title="Best Sellers" subtitle="What the FitBy community is buying most" products={bestSellers} to="/shop/browse?tag=Best%20Seller&sort=best" />

        {/* 6. Promo banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white">
          <ShopImage src={PROMO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-[#ed6126]/50" />
          <div className="relative p-8 md:p-14 max-w-xl">
            <p className="text-[#ed6126] font-semibold">Limited-time offers</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-1">Save up to {Math.max(25, ...sale.map((p) => p.discount))}% on top gear</h2>
            <p className="mt-3 text-white/85">Explore more collections — from studio-ready yoga sets to heavy-duty gym essentials.</p>
            <Link to="/shop/browse?tag=Sale" className="mt-6 inline-flex items-center gap-2 bg-[#ed6126] px-6 py-3 rounded-md font-bold hover:bg-white hover:text-[#ed6126] transition">Shop the Sale <ArrowRight size={18} /></Link>
          </div>
        </section>

        {/* 7. All products */}
        <CatalogSection />
      </div>
    </div>
  );
}
