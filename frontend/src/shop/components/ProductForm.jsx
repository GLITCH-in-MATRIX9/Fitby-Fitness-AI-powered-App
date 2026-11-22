import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlus, Plus, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { compressImage, saveImage, deleteImage } from '../utils/imageStore';
import { computeFinal, formatINR, uid } from '../utils/helpers';
import ShopImage from './ShopImage';

const inputCls = (err) => `w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ed6126]/40 ${err ? 'border-red-400' : 'border-gray-200 focus:border-[#ed6126]'}`;
const Err = ({ m }) => (m ? <p className="text-xs text-red-600 mt-1">{m}</p> : null);
const Label = ({ children }) => <span className="block text-sm font-medium text-gray-700 mb-1">{children}</span>;

export default function ProductForm({ product }) {
  const { categories, subcategories, tags: allTags, addCategory, addSubcategory, addTag, addProduct, updateProduct, toast } = useShop();
  const navigate = useNavigate();
  const editing = Boolean(product);
  const fileRef = useRef(null);
  const addedImgs = useRef([]);
  const removedImgs = useRef([]);

  const blank = { name: '', description: '', price: '', discount: '0', stock: '', brand: '', rating: '4', categoryId: '', subcategoryId: '', tags: [], images: [], attributes: [] };
  const [f, setF] = useState(() => product ? {
    ...blank, ...product, price: String(product.price), discount: String(product.discount), stock: String(product.stock), rating: String(product.rating),
    attributes: (product.attributes || []).map((a) => ({ id: uid('a'), name: a.name, values: [...a.values], draft: '' })),
  } : blank);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(null);
  const [newCat, setNewCat] = useState(null);   // null = hidden, string = input value
  const [newSub, setNewSub] = useState(null);
  const [tagDraft, setTagDraft] = useState('');
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  const subs = subcategories.filter((s) => s.categoryId === f.categoryId);
  const finalPrice = computeFinal(f.price || 0, f.discount || 0);

  /* images */
  const onFiles = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    setUploading(true);
    const refs = [];
    for (const file of files) {
      try { const ref = await saveImage(await compressImage(file)); refs.push(ref); addedImgs.current.push(ref); }
      catch (err) { toast(err.message, 'error'); }
    }
    setF((s) => ({ ...s, images: [...s.images, ...refs] }));
    setErrors((x) => ({ ...x, images: undefined }));
    setUploading(false);
  };
  const removeImage = (ref) => {
    removedImgs.current.push(ref);
    set({ images: f.images.filter((i) => i !== ref) });
  };

  /* category / subcategory creation */
  const createCategory = () => {
    const id = addCategory(newCat || '');
    if (!id) return;
    set({ categoryId: id, subcategoryId: '' });
    setNewCat(null);
    toast('Category created — it is now live in the Shop');
  };
  const createSub = () => {
    const id = addSubcategory(f.categoryId, newSub || '');
    if (!id) return;
    set({ subcategoryId: id });
    setNewSub(null);
    toast('Subcategory created');
  };

  /* tags */
  const toggleTag = (t) => set({ tags: f.tags.some((x) => x.toLowerCase() === t.toLowerCase()) ? f.tags.filter((x) => x.toLowerCase() !== t.toLowerCase()) : [...f.tags, t] });
  const createTag = () => {
    const t = addTag(tagDraft);
    if (!t) return;
    if (!f.tags.some((x) => x.toLowerCase() === t.toLowerCase())) set({ tags: [...f.tags, t] });
    setTagDraft('');
  };

  /* attributes */
  const updAttr = (id, patch) => set({ attributes: f.attributes.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  const addValue = (a) => {
    const vals = a.draft.split(',').map((v) => v.trim()).filter(Boolean).filter((v) => !a.values.some((x) => x.toLowerCase() === v.toLowerCase()));
    if (vals.length) updAttr(a.id, { values: [...a.values, ...vals], draft: '' }); else updAttr(a.id, { draft: '' });
  };

  /* validation + save */
  const validate = () => {
    const e = {};
    if (f.name.trim().length < 3) e.name = 'Product name must be at least 3 characters';
    if (f.description.trim().length < 10) e.description = 'Add a description (min. 10 characters)';
    if (!f.categoryId) e.categoryId = 'Select or create a category';
    if (f.categoryId && subs.length && !f.subcategoryId) e.subcategoryId = 'Select or create a subcategory';
    if (!(Number(f.price) > 0)) e.price = 'Enter a price greater than 0';
    const dsc = Number(f.discount);
    if (f.discount === '' || Number.isNaN(dsc) || dsc < 0 || dsc > 90) e.discount = 'Discount must be 0–90%';
    if (f.stock === '' || !Number.isInteger(Number(f.stock)) || Number(f.stock) < 0) e.stock = 'Enter a whole number (0 or more)';
    const r = Number(f.rating);
    if (Number.isNaN(r) || r < 0 || r > 5) e.rating = 'Rating must be between 0 and 5';
    if (!f.images.length) e.images = 'Upload at least one product image';
    const names = new Set();
    for (const a of f.attributes) {
      const n = a.name.trim().toLowerCase();
      if (!n) { e.attributes = 'Every attribute needs a name (or remove it)'; break; }
      if (names.has(n)) { e.attributes = `Duplicate attribute "${a.name}"`; break; }
      names.add(n);
      if (!a.values.length && !a.draft.trim()) { e.attributes = `Add at least one value to "${a.name}"`; break; }
    }
    return e;
  };

  const save = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { toast('Please fix the errors in the form', 'error'); return; }
    const attributes = f.attributes.map((a) => {
      const pending = a.draft.split(',').map((v) => v.trim()).filter(Boolean);
      const values = [...a.values, ...pending.filter((v) => !a.values.some((x) => x.toLowerCase() === v.toLowerCase()))];
      return { name: a.name.trim(), values };
    });
    const payload = {
      name: f.name.trim(), description: f.description.trim(), categoryId: f.categoryId, subcategoryId: f.subcategoryId,
      tags: f.tags, price: Number(f.price), discount: Number(f.discount), stock: Number(f.stock), brand: f.brand.trim(),
      rating: Number(f.rating), images: f.images, attributes,
    };
    removedImgs.current.forEach(deleteImage);
    removedImgs.current = []; addedImgs.current = [];
    if (editing) { updateProduct(product.id, payload); toast('Product updated'); navigate('/shop/admin/products'); }
    else { setSaved(addProduct(payload)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const cancel = () => {
    addedImgs.current.forEach(deleteImage);
    navigate('/shop/admin/products');
  };

  if (saved) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center shop-pop">
        <CheckCircle2 size={56} className="mx-auto text-green-500" />
        <h2 className="text-2xl font-bold mt-3">Product saved</h2>
        <p className="text-[#626262] mt-1"><b>{saved.name}</b> is now live in Shopper Mode — in All Products, its category{saved.tags.some((t) => t.toLowerCase() === 'new arrival') ? ', New Arrivals' : ''}, search and filters.</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to={`/shop/product/${saved.id}`} className="bg-[#ed6126] text-white px-5 py-2 rounded-md font-semibold hover:bg-black transition">View in Shop</Link>
          <button onClick={() => { setSaved(null); setF(blank); }} className="border border-[#ed6126] text-[#ed6126] px-5 py-2 rounded-md font-semibold hover:bg-[#ed6126] hover:text-white transition">Add another</button>
          <Link to="/shop/admin/products" className="border border-gray-300 px-5 py-2 rounded-md font-semibold hover:bg-gray-100">Manage products</Link>
        </div>
      </div>
    );
  }

  const card = 'bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4';
  return (
    <form onSubmit={save} className="space-y-6" noValidate>
      <section className={card}>
        <h3 className="font-bold text-lg">Product information</h3>
        <label className="block"><Label>Product name *</Label><input value={f.name} onChange={(e) => set({ name: e.target.value })} className={inputCls(errors.name)} /><Err m={errors.name} /></label>
        <label className="block"><Label>Description *</Label><textarea rows={4} value={f.description} onChange={(e) => set({ description: e.target.value })} className={inputCls(errors.description)} /><Err m={errors.description} /></label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="block"><Label>Price (₹) *</Label><input type="number" min="0" value={f.price} onChange={(e) => set({ price: e.target.value })} className={inputCls(errors.price)} /><Err m={errors.price} /></label>
          <label className="block"><Label>Discount (%)</Label><input type="number" min="0" max="90" value={f.discount} onChange={(e) => set({ discount: e.target.value })} className={inputCls(errors.discount)} /><Err m={errors.discount} />
            {Number(f.price) > 0 && <p className="text-xs text-[#626262] mt-1">Final price: <b className="text-[#ed6126]">{formatINR(finalPrice)}</b></p>}</label>
          <label className="block"><Label>Stock quantity *</Label><input type="number" min="0" value={f.stock} onChange={(e) => set({ stock: e.target.value })} className={inputCls(errors.stock)} /><Err m={errors.stock} /></label>
          <label className="block"><Label>Brand</Label><input value={f.brand} onChange={(e) => set({ brand: e.target.value })} className={inputCls()} /></label>
          <label className="block"><Label>Rating (mock, 0–5)</Label><input type="number" step="0.1" min="0" max="5" value={f.rating} onChange={(e) => set({ rating: e.target.value })} className={inputCls(errors.rating)} /><Err m={errors.rating} /></label>
        </div>
      </section>

      <section className={card}>
        <h3 className="font-bold text-lg">Images</h3>
        <div className="flex flex-wrap gap-3">
          {f.images.map((im, i) => (
            <div key={im} className="relative w-24 h-24 rounded-xl overflow-hidden border bg-orange-50">
              <ShopImage src={im} alt="" label={f.name} className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center">Cover</span>}
              <button type="button" onClick={() => removeImage(im)} className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:text-red-600" aria-label="Remove image"><X size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#ed6126] hover:text-[#ed6126] text-gray-400 flex flex-col items-center justify-center text-xs gap-1 transition">
            {uploading ? <Loader2 className="shop-spin" /> : <ImagePlus />} {uploading ? 'Saving…' : 'Upload'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
        </div>
        <p className="text-xs text-[#626262]">Images are resized to max 900px and stored in your browser (IndexedDB). Max 8 MB each.</p>
        <Err m={errors.images} />
      </section>

      <section className={card}>
        <h3 className="font-bold text-lg">Category</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Main category *</Label>
            <select value={f.categoryId} onChange={(e) => set({ categoryId: e.target.value, subcategoryId: '' })} className={inputCls(errors.categoryId)}>
              <option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Err m={errors.categoryId} />
            {newCat === null ? <button type="button" onClick={() => setNewCat('')} className="text-xs text-[#ed6126] font-semibold mt-2 inline-flex items-center gap-1"><Plus size={12} /> Create new category</button> : (
              <div className="flex gap-2 mt-2"><input autoFocus value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createCategory(); } }} placeholder="e.g. Women" className={inputCls()} />
                <button type="button" onClick={createCategory} className="bg-[#ed6126] text-white px-3 rounded-md text-sm font-semibold">Add</button>
                <button type="button" onClick={() => setNewCat(null)} className="px-2 text-gray-500" aria-label="Cancel"><X size={16} /></button></div>
            )}
          </div>
          <div>
            <Label>Subcategory {subs.length ? '*' : ''}</Label>
            <select value={f.subcategoryId} onChange={(e) => set({ subcategoryId: e.target.value })} disabled={!f.categoryId} className={`${inputCls(errors.subcategoryId)} disabled:bg-gray-50`}>
              <option value="">{f.categoryId ? (subs.length ? 'Select subcategory' : 'No subcategories yet') : 'Select a category first'}</option>
              {subs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Err m={errors.subcategoryId} />
            {f.categoryId && (newSub === null ? <button type="button" onClick={() => setNewSub('')} className="text-xs text-[#ed6126] font-semibold mt-2 inline-flex items-center gap-1"><Plus size={12} /> Create new subcategory</button> : (
              <div className="flex gap-2 mt-2"><input autoFocus value={newSub} onChange={(e) => setNewSub(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createSub(); } }} placeholder="e.g. Gym Leggings" className={inputCls()} />
                <button type="button" onClick={createSub} className="bg-[#ed6126] text-white px-3 rounded-md text-sm font-semibold">Add</button>
                <button type="button" onClick={() => setNewSub(null)} className="px-2 text-gray-500" aria-label="Cancel"><X size={16} /></button></div>
            ))}
          </div>
        </div>
      </section>

      <section className={card}>
        <h3 className="font-bold text-lg">Tags</h3>
        <p className="text-xs text-[#626262] -mt-2">Tags power storefront sections: “New Arrival”, “Best Seller”, “Trending” and “Sale”.</p>
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => { const on = f.tags.some((x) => x.toLowerCase() === t.toLowerCase());
            return <button type="button" key={t} onClick={() => toggleTag(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${on ? 'bg-[#ed6126] border-[#ed6126] text-white' : 'bg-white border-gray-200 text-[#626262] hover:border-[#ed6126]'}`}>{t}</button>; })}
        </div>
        <div className="flex gap-2 max-w-sm">
          <input value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createTag(); } }} placeholder="Create custom tag" className={inputCls()} />
          <button type="button" onClick={createTag} className="bg-gray-900 text-white px-3 rounded-md text-sm font-semibold hover:bg-[#ed6126]">Add</button>
        </div>
      </section>

      <section className={card}>
        <div className="flex items-center justify-between"><h3 className="font-bold text-lg">Attributes</h3>
          <button type="button" onClick={() => set({ attributes: [...f.attributes, { id: uid('a'), name: '', values: [], draft: '' }] })} className="text-sm text-[#ed6126] font-semibold inline-flex items-center gap-1"><Plus size={14} /> Add attribute</button></div>
        {f.attributes.length === 0 && <p className="text-sm text-[#626262]">No attributes. Add e.g. Size → S, M, L or Color → Black, White.</p>}
        {f.attributes.map((a) => (
          <div key={a.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex gap-2"><input value={a.name} onChange={(e) => updAttr(a.id, { name: e.target.value })} placeholder="Attribute name (e.g. Size)" className={inputCls()} />
              <button type="button" onClick={() => set({ attributes: f.attributes.filter((x) => x.id !== a.id) })} className="text-gray-400 hover:text-red-600 px-2" aria-label="Remove attribute"><X size={18} /></button></div>
            <div className="flex flex-wrap gap-2">{a.values.map((v) => <span key={v} className="inline-flex items-center gap-1 bg-orange-50 text-[#ed6126] text-xs font-medium pl-3 pr-1.5 py-1 rounded-full">{v}<button type="button" onClick={() => updAttr(a.id, { values: a.values.filter((x) => x !== v) })} aria-label={`Remove ${v}`}><X size={12} /></button></span>)}</div>
            <div className="flex gap-2"><input value={a.draft} onChange={(e) => updAttr(a.id, { draft: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addValue(a); } }} placeholder="Add value(s), press Enter or comma" className={inputCls()} />
              <button type="button" onClick={() => addValue(a)} className="bg-gray-900 text-white px-3 rounded-md text-sm font-semibold hover:bg-[#ed6126]">Add</button></div>
          </div>
        ))}
        <Err m={errors.attributes} />
      </section>

      <div className="flex gap-3 justify-end sticky bottom-0 bg-gray-50/90 backdrop-blur py-3">
        <button type="button" onClick={cancel} className="px-6 py-2.5 rounded-md border border-gray-300 font-semibold hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-md bg-[#ed6126] text-white font-semibold hover:bg-black transition disabled:opacity-60">{editing ? 'Save Changes' : 'Save Product'}</button>
      </div>
    </form>
  );
}
