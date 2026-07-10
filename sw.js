/* Divergenzmaschine V4.2 – Service Worker */
const CACHE = 'divergenzmaschine-v4.2.3';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // API-Aufrufe (Anthropic) nie cachen – immer Netz
  if (url.hostname.endsWith('anthropic.com')) return;

  // Google Fonts: cache-first mit Nachladen
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const hit = await c.match(e.request);
        const net = fetch(e.request).then((res) => {
          if (res.ok) c.put(e.request, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Eigene Dateien: cache-first, Fallback Netz
  if (e.request.method === 'GET') {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((hit) =>
        hit || fetch(e.request).then((res) => {
          if (res.ok && url.origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        }).catch(() => caches.match('./index.html'))
      )
    );
  }
});
