/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_CATEGORIES, SEED_SUBCATEGORIES, SEED_TAGS, SEED_PRODUCTS, SEED_ORDERS } from '../data/seed';
import { computeFinal, lineKey, deliveryFor, newOrderId, slugify, uid } from '../utils/helpers';
import { deleteImage } from '../utils/imageStore';

export const ShopContext = createContext(null);
const KEY = 'fitby_shop_v1';

const seedData = () => ({
  categories: SEED_CATEGORIES,
  subcategories: SEED_SUBCATEGORIES,
  tags: SEED_TAGS,
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  cart: [],
  wishlist: [],
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedData();
    const parsed = JSON.parse(raw);
    const base = seedData();
    // make sure every expected key exists with the right type
    Object.keys(base).forEach((k) => { if (!Array.isArray(parsed[k])) parsed[k] = base[k]; });
    return parsed;
  } catch {
    return seedData();
  }
}

const normalizeProduct = (p) => {
  const price = Number(p.price) || 0;
  const discount = Number(p.discount) || 0;
  const stock = Math.max(0, parseInt(p.stock, 10) || 0);
  return {
    ...p, price, discount, stock,
    finalPrice: computeFinal(price, discount),
    availability: stock > 0 ? 'In Stock' : 'Out of Stock',
  };
};

export function ShopProvider({ children }) {
  const [data, setData] = useState(load);
  const [toasts, setToasts] = useState([]);

  // Single persistence point for the whole shop.
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { console.warn('Shop: could not persist data', e); }
  }, [data]);

  // keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY && e.newValue) { try { setData(JSON.parse(e.newValue)); } catch { /* ignore */ } }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toast = useCallback((message, type = 'success') => {
    const id = uid('t');
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  /* ---------------- catalog (admin) ---------------- */
  const addCategory = useCallback((name, description = '') => {
    const clean = name.trim();
    if (!clean) return null;
    const existing = data.categories.find((c) => c.name.toLowerCase() === clean.toLowerCase());
    if (existing) return existing.id;
    let id = slugify(clean) || uid('cat');
    if (data.categories.some((c) => c.id === id)) id = `${id}-${Date.now().toString(36)}`;
    setData((d) => ({ ...d, categories: [...d.categories, { id, name: clean, description: description || 'Explore the collection', image: '' }] }));
    return id;
  }, [data.categories]);

  const addSubcategory = useCallback((categoryId, name) => {
    const clean = name.trim();
    if (!clean || !categoryId) return null;
    const existing = data.subcategories.find((s) => s.categoryId === categoryId && s.name.toLowerCase() === clean.toLowerCase());
    if (existing) return existing.id;
    let id = `${categoryId}-${slugify(clean)}`;
    if (data.subcategories.some((s) => s.id === id)) id = `${id}-${Date.now().toString(36)}`;
    setData((d) => ({ ...d, subcategories: [...d.subcategories, { id, categoryId, name: clean }] }));
    return id;
  }, [data.subcategories]);

  const addTag = useCallback((name) => {
    const clean = name.trim();
    if (!clean) return null;
    const existing = data.tags.find((t) => t.toLowerCase() === clean.toLowerCase());
    if (existing) return existing;
    setData((d) => ({ ...d, tags: [...d.tags, clean] }));
    return clean;
  }, [data.tags]);

  const addProduct = useCallback((form) => {
    const product = normalizeProduct({
      ...form, id: uid('p'), createdAt: new Date().toISOString(), sales: 0,
    });
    setData((d) => {
      const newTags = (product.tags || []).filter((t) => !d.tags.some((x) => x.toLowerCase() === t.toLowerCase()));
      return { ...d, products: [product, ...d.products], tags: [...d.tags, ...newTags] };
    });
    return product;
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setData((d) => {
      const products = d.products.map((p) => (p.id === id ? normalizeProduct({ ...p, ...patch }) : p));
      const added = (patch.tags || []).filter((t) => !d.tags.some((x) => x.toLowerCase() === t.toLowerCase()));
      return { ...d, products, tags: added.length ? [...d.tags, ...added] : d.tags };
    });
  }, []);

  const deleteProduct = useCallback((id) => {
    const p = data.products.find((x) => x.id === id);
    p?.images?.forEach(deleteImage);
    setData((d) => ({
      ...d,
      products: d.products.filter((x) => x.id !== id),
      cart: d.cart.filter((c) => c.productId !== id),
      wishlist: d.wishlist.filter((w) => w !== id),
    }));
  }, [data.products]);

  /* ---------------- wishlist ---------------- */
  const toggleWishlist = useCallback((id) => {
    setData((d) => ({ ...d, wishlist: d.wishlist.includes(id) ? d.wishlist.filter((w) => w !== id) : [...d.wishlist, id] }));
  }, []);

  /* ---------------- cart ---------------- */
  const addToCart = useCallback((productId, attrs = {}, qty = 1) => {
    const p = data.products.find((x) => x.id === productId);
    if (!p) return { ok: false };
    if (p.stock <= 0) { toast('This product is out of stock', 'error'); return { ok: false }; }
    const missing = (p.attributes || []).find((a) => a.values.length && !attrs[a.name]);
    if (missing) { toast(`Please select ${missing.name}`, 'error'); return { ok: false, missing: missing.name }; }
    const key = lineKey(productId, attrs);
    setData((d) => {
      const ex = d.cart.find((c) => c.key === key);
      const nq = Math.min(p.stock, (ex ? ex.qty : 0) + qty);
      const cart = ex ? d.cart.map((c) => (c.key === key ? { ...c, qty: nq } : c)) : [...d.cart, { key, productId, attrs, qty: nq }];
      return { ...d, cart };
    });
    toast(`${p.name} added to cart`);
    return { ok: true };
  }, [data.products, toast]);

  const updateCartQty = useCallback((key, qty) => {
    setData((d) => ({
      ...d,
      cart: d.cart.map((c) => {
        if (c.key !== key) return c;
        const p = d.products.find((x) => x.id === c.productId);
        return { ...c, qty: Math.max(1, Math.min(p ? p.stock : qty, qty)) };
      }),
    }));
  }, []);

  const removeFromCart = useCallback((key) => setData((d) => ({ ...d, cart: d.cart.filter((c) => c.key !== key) })), []);
  const clearCart = useCallback(() => setData((d) => ({ ...d, cart: [] })), []);

  // cart lines joined with live product data (admin price/stock edits reflect immediately)
  const cartItems = useMemo(() =>
    data.cart.map((c) => ({ ...c, product: data.products.find((p) => p.id === c.productId) })).filter((c) => c.product),
  [data.cart, data.products]);

  const cartCount = cartItems.reduce((n, c) => n + c.qty, 0);
  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce((s, c) => s + c.product.finalPrice * c.qty, 0);
    const discount = cartItems.reduce((s, c) => s + (c.product.price - c.product.finalPrice) * c.qty, 0);
    const delivery = deliveryFor(subtotal);
    return { subtotal, discount, delivery, total: subtotal + delivery };
  }, [cartItems]);

  /* ---------------- orders ---------------- */
  const placeOrder = useCallback(({ customer, payment }) => {
    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      customer,
      items: cartItems.map((c) => ({
        key: c.key, productId: c.productId, name: c.product.name, image: c.product.images?.[0] || '',
        price: c.product.finalPrice, originalPrice: c.product.price, qty: c.qty, attrs: c.attrs,
      })),
      ...cartTotals,
      payment, // { method, status } – never card details
      history: [{ status: 'Pending', at: new Date().toISOString() }],
    };
    setData((d) => ({
      ...d,
      orders: [order, ...d.orders],
      cart: [],
      products: d.products.map((p) => {
        const bought = order.items.filter((i) => i.productId === p.id).reduce((n, i) => n + i.qty, 0);
        return bought ? normalizeProduct({ ...p, stock: Math.max(0, p.stock - bought), sales: (p.sales || 0) + bought }) : p;
      }),
    }));
    return order;
  }, [cartItems, cartTotals]);

  const updateOrderStatus = useCallback((orderId, status) => {
    setData((d) => {
      const o = d.orders.find((x) => x.id === orderId);
      if (!o || o.status === status) return d;
      const now = new Date().toISOString();
      let products = d.products;
      let payment = o.payment;
      if (status === 'Cancelled') {
        products = d.products.map((p) => {
          const back = o.items.filter((i) => i.productId === p.id).reduce((n, i) => n + i.qty, 0);
          return back ? normalizeProduct({ ...p, stock: p.stock + back, sales: Math.max(0, (p.sales || 0) - back) }) : p;
        });
        if (payment.status === 'Paid') payment = { ...payment, status: 'Refunded' };
        else payment = { ...payment, status: 'Cancelled' };
      }
      if (status === 'Delivered' && payment.method === 'Cash on Delivery') payment = { ...payment, status: 'Paid' };
      const orders = d.orders.map((x) => (x.id === orderId ? { ...x, status, payment, history: [...x.history, { status, at: now }] } : x));
      return { ...d, orders, products };
    });
  }, []);

  const resetShop = useCallback(() => setData(seedData()), []);

  const value = useMemo(() => ({
    ...data, toasts, toast,
    cartItems, cartCount, cartTotals,
    addCategory, addSubcategory, addTag, addProduct, updateProduct, deleteProduct,
    toggleWishlist, addToCart, updateCartQty, removeFromCart, clearCart,
    placeOrder, updateOrderStatus, resetShop,
  }), [data, toasts, toast, cartItems, cartCount, cartTotals, addCategory, addSubcategory, addTag, addProduct,
    updateProduct, deleteProduct, toggleWishlist, addToCart, updateCartQty, removeFromCart, clearCart, placeOrder, updateOrderStatus, resetShop]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
};
