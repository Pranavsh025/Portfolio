// Offline support: caches the portfolio so it opens even without internet.
const CACHE = 'pranav-portfolio-v11';
const FILES = ['./', './index.html', './resume.pdf', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png',
  './images/rockguard-monitor.webp', './images/rockguard-assessment.webp', './images/rockguard-actions.webp',
  './images/rockguard-mines.webp', './images/rockguard-trends.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Network first (so updates show up right away), cache as the offline fallback.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
