export const ORDER_STATUSES = ['Pending', 'Accepted', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
export const ALL_STATUSES = [...ORDER_STATUSES, 'Cancelled'];
export const FREE_DELIVERY_ABOVE = 999;
export const DELIVERY_FEE = 99;

export const formatINR = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const uid = (p = 'id') =>
  `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const computeFinal = (price, discount) =>
  Math.round(Number(price) * (1 - (Number(discount) || 0) / 100));

export const deliveryFor = (subtotal) =>
  subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

export const lineKey = (productId, attrs = {}) =>
  productId + '|' + Object.keys(attrs).sort().map((k) => `${k}=${attrs[k]}`).join('&');

export const newOrderId = () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `FB-${ymd}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const hasTag = (p, tag) => (p.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase());

export const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Processing: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-purple-100 text-purple-700',
  'Out for Delivery': 'bg-orange-100 text-[#ed6126]',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};
