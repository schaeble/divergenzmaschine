/* Divergenzmaschine – Service Worker (offline-fähig) */
const CACHE = 'divergenzmaschine-ts-4.252.0';
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
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API-Aufrufe (Anthropic) nie cachen – immer Netz
  if (url.hostname.endsWith('anthropic.com')) return;

  // Wikipedia-Tagesfeed (Sammler): Netz zuerst, Cache als Rueckfall. Jeder Tag
  // hat seine eigene Adresse, deshalb ist der Cache hier ein Gewinn: einmal
  // geholte Tage bleiben offline lesbar, ohne je zu veralten.
  if (url.hostname.endsWith('wikipedia.org') || url.hostname.endsWith('wikimedia.org')) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || Response.error()))
    );
    return;
  }

  // Seite selbst: network-first MIT Zeitlimit. Ohne Limit haengt der Start bei
  // langsamem/halbtotem Netz, bis der Browser-Timeout greift; deshalb nach 2,5 s
  // aus dem Cache ausliefern und die Netzantwort im Hintergrund weiter uebernehmen.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    const fromCache = () => caches.match('./index.html').then((hit) => hit || caches.match('./'));
    const net = fetch(req, { cache: 'no-cache' }).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); }
      return res;
    });
    e.respondWith(
      new Promise((resolve) => {
        let done = false;
        const finish = (r) => { if (!done && r) { done = true; resolve(r); } };
        net.then(finish).catch(() => { fromCache().then((hit) => finish(hit) || (done || resolve(Response.error()))); });
        setTimeout(() => { if (!done) fromCache().then((hit) => { if (hit) finish(hit); }); }, 2500);
      })
    );
    return;
  }

  // Übrige Ressourcen (Manifest, Icons …): cache-first, dann Netz
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
