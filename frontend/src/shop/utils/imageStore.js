// Frontend-only image persistence: compressed images live in IndexedDB,
// products store a lightweight "idb:<id>" reference.
import { uid } from './helpers';

const DB_NAME = 'fitby_shop_images';
const STORE = 'images';
const cache = new Map();

const openDB = () =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const run = async (mode, fn) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
  });
};

export async function saveImage(dataUrl) {
  const ref = 'idb:' + uid('img');
  cache.set(ref, dataUrl);
  try {
    await run('readwrite', (s) => s.put(dataUrl, ref));
    return ref;
  } catch {
    return dataUrl; // fallback: inline (already compressed) data URL
  }
}

export async function getImage(ref) {
  if (cache.has(ref)) return cache.get(ref);
  try {
    const v = await run('readonly', (s) => s.get(ref));
    if (v) cache.set(ref, v);
    return v || null;
  } catch {
    return null;
  }
}

export async function deleteImage(ref) {
  if (!ref || !ref.startsWith('idb:')) return;
  cache.delete(ref);
  try { await run('readwrite', (s) => s.delete(ref)); } catch { /* ignore */ }
}

export function compressImage(file, maxDim = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error(`${file.name} is not an image`));
    if (file.size > 8 * 1024 * 1024) return reject(new Error(`${file.name} is larger than 8 MB`));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`${file.name} could not be decoded`));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
