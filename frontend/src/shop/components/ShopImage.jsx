import { useEffect, useState } from 'react';
import { getImage } from '../utils/imageStore';

const placeholder = (label = 'FitBy') => {
  const letter = (label || 'F').trim().charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1ea"/><stop offset="1" stop-color="#ffc9ad"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><text x="400" y="460" font-family="Arial,sans-serif" font-size="260" font-weight="700" fill="#ed6126" fill-opacity=".55" text-anchor="middle">${letter}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/** Resolves http(s) URLs, data URLs and "idb:" references; falls back to a branded placeholder. */
export default function ShopImage({ src, alt = '', className = '', label }) {
  const direct = src && !src.startsWith('idb:') ? src : null;
  const [resolved, setResolved] = useState(null); // { src, url }
  const [failedSrc, setFailedSrc] = useState(null);

  useEffect(() => {
    if (!src || !src.startsWith('idb:')) return undefined;
    let live = true;
    getImage(src).then((url) => { if (live) setResolved({ src, url }); });
    return () => { live = false; };
  }, [src]);

  const url = direct || (resolved?.src === src ? resolved.url : null);
  const show = url && failedSrc !== src ? url : placeholder(label || alt);
  return <img src={show} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className={className} />;
}
