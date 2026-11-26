/* MalikTrades service worker.
   Pages and data: network first, so members always get the latest when online; the saved copy is used only when offline.
   Images, fonts and guide PDFs: served from the saved copy and refreshed in the background.
   The separate tool apps (Journal, Trade Review, Prop Tracker, Mindset) are left alone. */
const VERSION = "mt-v1";
const CORE = ["/", "/index.html", "/mt-shell.css", "/mt-shell.js", "/mt-search.js", "/mt-updates.js", "/mt-app.js", "/mt-wordmark.png", "/mt-wordmark-teal.png", "/app-icon-192.png", "/offline.html"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const SKIP = /^\/(MalikTradesJournal|MalikTradesReview|MalikTradesPropTracker|MalikTrades-Mindset-Tool)\b/;

async function networkFirst(req) {
  const c = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await c.match(req) || await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") return (await c.match("/offline.html")) || Response.error();
    return Response.error();
  }
}
async function staleWhileRevalidate(req, evt) {
  const c = await caches.open(VERSION);
  const hit = await c.match(req);
  const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
  if (hit) { evt.waitUntil(net); return hit; }
  return (await net) || (await c.match(req, { ignoreSearch: true })) || Response.error();
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || SKIP.test(url.pathname)) return;
  if (req.headers.has("range")) return;
  const p = url.pathname;
  if (req.mode === "navigate" || /\.(html|json|js|css|webmanifest)$/.test(p) || p.endsWith("/")) { e.respondWith(networkFirst(req)); return; }
  if (/\.(jpg|jpeg|png|webp|svg|ico|woff2|pdf)$/.test(p)) { e.respondWith(staleWhileRevalidate(req, e)); return; }
});
