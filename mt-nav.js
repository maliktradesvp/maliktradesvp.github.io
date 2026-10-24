/* MalikTrades shared menu.
   Add this one line to any MalikTrades tool, just before </body>:
     <script src="/mt-nav.js" defer></script>
   It draws a slim menu bar at the very top of the page. The bar lives in its own
   shadow DOM, so it can't clash with the tool's own styles. */
(function(){
  if (window.__mtNav) return; window.__mtNav = true;

  var LINKS = [
    { label: "Home",          href: "/" },
    { label: "Journal",       href: "/MalikTradesJournal/" },
    { label: "Trade Review",  href: "/MalikTradesReview/" },
    { label: "Prop Firm Tool", href: "/prop-firm-tool/" },
    { label: "Prop Tracker",  href: "/MalikTradesPropTracker/" },
    { label: "Mindset",       href: "/MalikTrades-Mindset-Tool/" },
    { label: "Guides",        href: "/#guides" }
  ];

  function currentHref(){
    var p = location.pathname.replace(/index\.html$/, "");
    var best = null;
    LINKS.forEach(function(l){
      if (l.href.indexOf("#") > -1) return;
      if (l.href === "/") { if (p === "/") best = best || l.href; return; }
      if (p.indexOf(l.href) === 0 && (!best || l.href.length > best.length)) best = l.href;
    });
    return best;
  }

  function px(v){ v = parseFloat(v); return isFinite(v) ? v : 0; }

  function mount(){
    var body = document.body; if (!body || document.getElementById("mt-nav")) return;
    var cs = getComputedStyle(body);
    var host = document.createElement("div");
    host.id = "mt-nav";
    // stretch edge to edge even if the tool pads its <body>
    host.style.cssText = "display:block;position:relative;z-index:30;margin:" +
      (-(px(cs.paddingTop) + px(cs.marginTop))) + "px " +
      (-(px(cs.paddingRight) + px(cs.marginRight))) + "px " + "0 " +
      (-(px(cs.paddingLeft) + px(cs.marginLeft))) + "px";

    var cur = currentHref();
    var links = LINKS.map(function(l){
      var on = l.href === cur;
      return '<a href="' + l.href + '"' + (on ? ' aria-current="page"' : '') + '>' + l.label + '</a>';
    }).join("");

    var html =
      '<style>' +
      ':host{all:initial;display:block}' +
      'nav{background:#16292C;border-bottom:1px solid rgba(244,235,217,.12);font:400 13.5px/1 "Figtree","Avenir Next","Segoe UI",system-ui,-apple-system,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}' +
      '.in{max-width:1180px;margin:0 auto;padding:0 24px;height:46px;display:flex;align-items:center;gap:18px}' +
      '.brand{font:600 19px/1 "Cormorant Garamond","Hoefler Text","Baskerville","Palatino Linotype",Palatino,Georgia,serif;letter-spacing:.04em;color:#F4EBD9;text-decoration:none;white-space:nowrap;flex:none}' +
      '.links{display:flex;gap:2px;margin-left:auto;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}' +
      '.links::-webkit-scrollbar{display:none}' +
      '.links a{color:rgba(244,235,217,.68);text-decoration:none;padding:8px 11px;border-radius:3px;white-space:nowrap}' +
      '.links a:hover{color:#F4EBD9;background:rgba(244,235,217,.07)}' +
      '.links a[aria-current=page]{color:#F4EBD9;background:rgba(244,235,217,.12)}' +
      'a:focus-visible{outline:2px solid #F4EBD9;outline-offset:1px}' +
      '@media (max-width:760px){.in{padding:0 0 0 16px;gap:8px}.links{padding-right:16px}}' +
      '.links.r{-webkit-mask-image:linear-gradient(90deg,#000 82%,transparent);mask-image:linear-gradient(90deg,#000 82%,transparent)}' +
      '.links.l{-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%);mask-image:linear-gradient(90deg,transparent,#000 14%)}' +
      '.links.l.r{-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 82%,transparent);mask-image:linear-gradient(90deg,transparent,#000 14%,#000 82%,transparent)}' +
      '@media print{nav{display:none}}' +
      '</style>' +
      '<nav aria-label="MalikTrades tools"><div class="in">' +
      '<a class="brand" href="/">MalikTrades</a>' +
      '<div class="links">' + links + '</div>' +
      '</div></nav>';

    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.innerHTML = html;
    body.insertBefore(host, body.firstChild);

    // on phones, make sure the current tool's link is visible in the scroll row
    try {
      var on = root.querySelector('[aria-current="page"]'), row = root.querySelector(".links");
      if (on && row && row.scrollWidth > row.clientWidth) {
        row.scrollLeft += on.getBoundingClientRect().left - row.getBoundingClientRect().left - 2;
      }
      var fade = function(){
        if (!row) return;
        row.classList.toggle("l", row.scrollLeft > 4);
        row.classList.toggle("r", row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
      };
      fade(); row.addEventListener("scroll", fade, { passive: true }); window.addEventListener("resize", fade);
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
