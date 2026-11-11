/* MalikTrades shared page shell. Add data-page="library" (or "reproom") to <body>,
   include /mt-shell.css and this script, and the page content gets wrapped in the sidebar layout. */
(function(){
  "use strict";
  const DISCORD = ""; // paste your Discord invite link here to show the Join buttons
  const IC = {
    home:'<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    book:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>',
    layers:'<path d="m12 4 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/>',
    grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/>',
    pen:'<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M14 7l3 3"/>',
    card:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 15l3-3 2 2 3-4"/>',
    chart:'<path d="M4 19h16"/><rect x="6" y="11" width="3" height="6"/><rect x="11" y="7" width="3" height="10"/><rect x="16" y="13" width="3" height="4"/>',
    calc:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01"/>',
    brain:'<path d="M12 5a3 3 0 0 0-5.5 1.5A3 3 0 0 0 5 12a3 3 0 0 0 2 5 3 3 0 0 0 5 1z"/><path d="M12 5a3 3 0 0 1 5.5 1.5A3 3 0 0 1 19 12a3 3 0 0 1-2 5 3 3 0 0 1-5 1z"/>',
    chat:'<path d="M5 5h14v10H9l-4 4z"/>',
    play:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>'
  };
  const ic = (n, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
  const page = document.body.dataset.page || "";
  let read = 0; try{ const r = JSON.parse(localStorage.getItem("maliktrades.reading.v1")); read = (r && r.read || []).filter(x => /^a0\d$/.test(x)).length; }catch(e){}
  const L = [
    ["home","home","Home","/",""], ["book","academy","VP Academy","/#academy",`${read}/9`], ["layers","playbook","The Playbook","/#playbook",""],
    ["grid","library","Setup Library","/setup-library.html",'<span class="ct" id="mtLibCt"></span>'], ["target","reproom","The Rep Room","/simulator.html",""]
  ];
  const T = [["pen","Journal","/MalikTradesJournal/"],["card","Trade Review","/MalikTradesReview/"],["chart","Prop Tracker","/MalikTradesPropTracker/"],["calc","Prop Firm Hacking Tool","/prop-firm-tool.html"],["brain","Mindset","/MalikTrades-Mindset-Tool/"]];
  const side = `<aside class="mt-side" aria-label="Main menu"><a href="/"><img class="wm" src="/mt-wordmark.png" alt="MalikTrades"></a>
    <nav class="mt-nav" aria-label="Learn"><div class="mt-navh">LEARN</div>${L.map(([i, id, t, h, c]) => `<a class="${id === page ? "on" : ""}" href="${h}"${id === page ? ' aria-current="page"' : ""}>${ic(i, 19)}${t}${c && !c.startsWith("<") ? `<span class="ct">${c}</span>` : c}</a>`).join("")}</nav>
    <nav class="mt-nav" aria-label="Tools"><div class="mt-navh">TOOLS</div>${T.map(([i, t, h]) => `<a href="${h}">${ic(i, 19)}${t}</a>`).join("")}</nav>
    <div class="mt-end"><div class="mt-disc"><b>Malik's Auction House</b>Ask questions, post reviews and trade the session together.<br>${DISCORD ? `<a href="${DISCORD}" target="_blank" rel="noopener">${ic("chat", 16)} Join the Discord</a>` : ""}</div>
    <a class="mt-tk" href="https://www.tiktok.com/@maliktradesvp" target="_blank" rel="noopener">${ic("play", 22)}<span><b>@maliktradesvp</b>Daily live recaps on TikTok</span></a></div></aside>`;
  const top = `<div class="mt-top"><a href="/"><img src="/mt-wordmark-teal.png" alt="MalikTrades"></a><span style="display:flex;gap:8px"><a class="b2" href="https://www.tiktok.com/@maliktradesvp" target="_blank" rel="noopener">TikTok</a>${DISCORD ? `<a class="b2" href="${DISCORD}" target="_blank" rel="noopener">Discord</a>` : ""}</span></div>`;
  const tabs = `<nav class="mt-tabs" aria-label="Quick menu">${[["home","home","Home","/"],["book","academy","Academy","/#academy"],["grid","library","Library","/setup-library.html"],["target","reproom","Rep Room","/simulator.html"],["calc","tools","Tools","/#tools"]]
    .map(([i, id, t, h]) => `<a class="${id === page ? "on" : ""}" href="${h}">${ic(i, 22)}${t}</a>`).join("")}</nav>`;
  const app = document.createElement("div"); app.className = "mt-app";
  app.innerHTML = side + '<div class="mt-main"></div>';
  const main = app.querySelector(".mt-main");
  main.insertAdjacentHTML("afterbegin", top);
  [...document.body.childNodes].forEach(n => { if(n.nodeName !== "SCRIPT") main.appendChild(n); });
  document.body.prepend(app);
  document.body.insertAdjacentHTML("beforeend", tabs);
  fetch("/setup-library.json?v=" + Date.now()).then(r => r.ok ? r.json() : []).then(d => { const el = document.getElementById("mtLibCt"); if(el && Array.isArray(d)) el.textContent = d.length; }).catch(() => {});
})();
