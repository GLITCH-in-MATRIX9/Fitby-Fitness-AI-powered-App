import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './styles/shop.css';
import ShopTopBar from './components/ShopTopBar';
import Toasts from './components/Toasts';
import ShopHome from './pages/ShopHome';
import BrowsePage from './pages/BrowsePage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductFormPage from './pages/admin/ProductFormPage';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname, search]);
  return null;
}

/** Entry point of the independent Shop module (mounted at /shop/*). */
export default function ShopApp() {
  const admin = useLocation().pathname.startsWith('/shop/admin');
  return (
    <div className="shop-root bg-gray-50 min-h-[80vh] text-gray-800">
      <ScrollToTop />
      <ShopTopBar />
      {/* keyed by mode: content fades in on Shopper ⇄ Admin, but not on normal page-to-page navigation */}
      <div key={admin ? 'admin' : 'shopper'} className="shop-pop">
      <Routes>
        <Route index element={<ShopHome />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add" element={<ProductFormPage />} />
          <Route path="edit/:id" element={<ProductFormPage />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
      </div>
      <Toasts />
    </div>
  );
}
