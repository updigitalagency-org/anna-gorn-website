const CACHE = 'gorn-import-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/blog.html',
  '/blog-china-import-guide.html',
  '/blog-supplier-check.html',
  '/blog-logistics-routes.html',
  '/blog-customs-duty.html',
  '/blog-payment-china.html',
  '/blog-alibaba-vs-1688.html',
  '/styles.css',
  '/main.js',
  '/anna.jpg',
  '/blog-images/blog-1-import-guide.jpg',
  '/blog-images/blog-2-supplier-verify.jpg',
  '/blog-images/blog-3-logistics.jpg',
  '/blog-images/blog-4-customs.jpg',
  '/blog-images/blog-5-payments.jpg',
  '/blog-images/blog-6-alibaba-vs-1688.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin && !url.hostname.includes('fonts.g')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
