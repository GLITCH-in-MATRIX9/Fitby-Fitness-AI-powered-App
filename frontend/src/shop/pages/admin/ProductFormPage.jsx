import { Link, useParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ProductForm from '../../components/ProductForm';

export default function ProductFormPage() {
  const { id } = useParams();
  const { products } = useShop();
  const product = id ? products.find((p) => p.id === id) : undefined;
  if (id && !product) return <div className="bg-white rounded-2xl p-10 text-center"><p>Product not found.</p><Link to="/shop/admin/products" className="text-[#ed6126] font-semibold">Back to products</Link></div>;
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h1><p className="text-sm text-[#626262]">{product ? product.name : 'New products appear instantly in Shopper Mode.'}</p></div>
      <ProductForm key={product?.id || 'new'} product={product} />
    </div>
  );
}
