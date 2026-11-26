/* MalikTrades app: makes the hub installable (home screen app on iPhone and Android),
   registers the offline service worker, and shows a small "Get the app" prompt on phones. */
(function () {
  "use strict";
  if (window.__mtApp) return; window.__mtApp = 1;
  const head = document.head;
  const add = (tag, attrs) => { if (attrs.rel && head.querySelector(`link[rel="${attrs.rel}"]`)) return; if (attrs.name && head.querySelector(`meta[name="${attrs.name}"]`)) return;
    const e = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); head.appendChild(e); };
  add("link", { rel: "manifest", href: "/manifest.webmanifest" });
  add("meta", { name: "theme-color", content: "#21414A" });
  add("meta", { name: "apple-mobile-web-app-capable", content: "yes" });
  add("meta", { name: "mobile-web-app-capable", content: "yes" });
  add("meta", { name: "apple-mobile-web-app-title", content: "MalikTrades" });
  add("meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" });

  // Cloudflare Web Analytics (anonymous, cookie-free; the dashboard is private to the site owner)
  if (location.hostname === "maliktradesvp.github.io" && !document.querySelector('script[src*="cloudflareinsights.com/beacon"]')) {
    const cf = document.createElement("script");
    cf.type = "module"; cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cf.setAttribute("data-cf-beacon", JSON.stringify({ token: "cc250df447dc4549a4c96a123348d5ba" }));
    head.appendChild(cf);
  }

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    addEventListener("load", () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {}));
  }

  // ---------- install prompt (phones only) ----------
  const KEY = "maliktrades.install.v1";
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (standalone) { document.documentElement.classList.add("mt-standalone"); return; }
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isIOSSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance|Discord/i.test(ua);
  const inApp = /Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance|Discord/i.test(ua);
  const dismissed = () => { try { return Date.now() - (+localStorage.getItem(KEY) || 0) < 14 * 864e5; } catch (e) { return false; } };
  const phone = () => matchMedia("(max-width: 900px)").matches;
  let deferred = null;

  const css = `
.mtapp{position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:60;background:#FFFCF6;border:1px solid #E6DCCB;border-radius:20px;box-shadow:0 18px 40px rgba(27,39,41,.22);
 padding:14px 14px 14px 12px;display:flex;gap:12px;align-items:center;font-family:var(--body,'Source Sans 3',system-ui,sans-serif);color:#1B2729;transform:translateY(20px);opacity:0;transition:transform .3s,opacity .3s}
.mtapp.in{transform:none;opacity:1}
.mtapp img{width:52px;height:52px;border-radius:13px;flex:none;box-shadow:0 4px 10px rgba(0,0,0,.18)}
.mtapp b{display:block;font-size:16px;line-height:1.2}
.mtapp span{display:block;font-size:13px;color:#6E746F;line-height:1.35;margin-top:2px}
.mtapp .go{margin-left:auto;flex:none;background:#21414A;color:#fff;border:0;border-radius:999px;padding:9px 16px;font:700 14px inherit;font-family:inherit;cursor:pointer}
.mtapp .x{position:absolute;top:-10px;right:-6px;width:28px;height:28px;border-radius:50%;border:1px solid #E6DCCB;background:#FFFCF6;color:#6E746F;font-size:16px;line-height:1;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.1)}
.mtapp .sh{display:inline-block;width:15px;height:18px;vertical-align:-3px;margin:0 1px}
@media(min-width:901px){.mtapp{left:auto;right:24px;bottom:24px;width:380px}}`;

  function show(kind) {
    if (document.querySelector(".mtapp") || dismissed()) return;
    const st = document.createElement("style"); st.textContent = css; head.appendChild(st);
    const shareIc = '<svg class="sh" viewBox="0 0 15 18" fill="none" stroke="#2F78AE" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 1v10M4 4.5 7.5 1 11 4.5"/><path d="M5 7.5H2.5v9h10v-9H10"/></svg>';
    const body = kind === "ios"
      ? `<div><b>Get the MalikTrades app</b><span>Tap ${shareIc} Share, then <strong>Add to Home Screen</strong>.</span></div>`
      : kind === "inapp"
      ? `<div><b>Get the MalikTrades app</b><span>Open this page in ${isIOS ? "Safari" : "Chrome"} to add it to your home screen.</span></div>`
      : `<div><b>Get the MalikTrades app</b><span>Free. Opens full screen from your home screen.</span></div><button class="go" type="button">Install</button>`;
    const el = document.createElement("div"); el.className = "mtapp"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Install the MalikTrades app");
    el.innerHTML = `<img src="/app-icon-192.png" alt="">${body}<button class="x" type="button" aria-label="Not now">×</button>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
    const close = () => { try { localStorage.setItem(KEY, Date.now()); } catch (e) {} el.classList.remove("in"); setTimeout(() => el.remove(), 300); };
    el.querySelector(".x").addEventListener("click", close);
    const go = el.querySelector(".go");
    if (go) go.addEventListener("click", async () => { if (!deferred) return close(); deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; close(); });
  }
  window.MTApp = { show };

  addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; if (phone()) setTimeout(() => show("android"), 2500); });
  addEventListener("appinstalled", () => { try { localStorage.setItem(KEY, Date.now() + 3650 * 864e5); } catch (e) {} const el = document.querySelector(".mtapp"); if (el) el.remove(); });
  if (phone() && !dismissed()) {
    if (isIOSSafari) setTimeout(() => show("ios"), 2500);
    else if (inApp) setTimeout(() => show("inapp"), 2500);
  }
})();
