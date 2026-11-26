/* MalikTrades site search: guides (page by page), Setup Library trades and a glossary.
   Open with the search box, the 🔍 button, "/" or Ctrl/Cmd+K. Data loads on first open. */
(function () {
  "use strict";
  if (window.__mtSearch) return; window.__mtSearch = 1;

  const GLOSS = [
    ["POC", "Point of control: the price where the most volume traded in a profile.", "point of control"],
    ["VAH", "Value area high: the top of the range where 70% of the profile's volume traded.", "value area high"],
    ["VAL", "Value area low: the bottom of the range where 70% of the profile's volume traded.", "value area low"],
    ["Value area", "The range holding 70% of a profile's volume: where the market agreed on price.", "va"],
    ["dPOC", "Developing POC: the price with the most volume so far in the current session's profile.", "developing poc"],
    ["dVAH", "Developing value area high: the top of today's value area as the session builds. In a balanced D-shape it's the expensive edge you fade short.", "developing vah"],
    ["dVAL", "Developing value area low: the bottom of today's value area as the session builds. In a balanced D-shape it's the cheap edge you fade long.", "developing val"],
    ["NYVAH · NYPOC · NYVAL", "Value area high, POC and value area low of the previous New York session (09:30–15:59 ET).", "nyvah nypoc nyval new york"],
    ["ONVAH · ONPOC · ONVAL", "Value area high, POC and value area low of the overnight session (18:00–09:29 ET).", "onvah onpoc onval overnight"],
    ["PWVAH · PWPOC · PWVAL", "Prior week value area high, POC and low (Sunday 18:00 to Friday 16:59 ET). Marked once at the start of the week and carried Monday to Friday.", "pwvah pwpoc pwval prior week"],
    ["Developing VP", "The profile of the current session as it builds: from 18:00 ET for Asia and London, from 09:30 ET for New York.", "developing profile dvp"],
    ["HVN", "High-volume node: a fat shelf in the profile where price was accepted.", "high volume node"],
    ["LVN", "Low-volume node: a thin area of the profile that price moved through fast.", "low volume node"],
    ["VWAP", "Volume-weighted average price. VWAP and its bands only count as extra confluence; they never trigger a trade on their own.", "vwap band bands"],
    ["ATR", "Average true range (60, RMA). ATR × 2 is a safe stop guide, used on gold and oil because they need room to breathe.", "average true range stop"],
    ["Acceptance", "Price holding beyond a level and building volume there. Judge it by the volume in the profile, not by counting candles.", "accepted"],
    ["Rejection", "Price reaching a level and refusing it, snapping back the other way.", "rejected"],
    ["D-shape", "A balanced profile: fat in the middle, thin at both ends. Fade the edges and keep ping-ponging until price is accepted outside value.", "d shape balance balanced ping pong"],
    ["P-shape / b-shape", "One side won, then the market settled. The fat part is where it settled; the thin tail is where it moved through fast.", "p shape b shape"],
    ["The Snap 🫰", "Fading a level: take the reaction off it with a limit order at the level. The most common setup.", "snap fade"],
    ["The Flip 🔄", "A retest of a level from the other side after price has broken past it and built volume beyond it. Enter on the retest.", "flip retest"],
    ["The Magnet 🧲", "A dPOC retest for continuation, only after price has gone past the dVAH or dVAL and comes back to the dPOC.", "magnet continuation"],
    ["The Anchor ⚓", "An earlier dPOC from the same session, valid only when its node is about the same size as the current dPOC's. Same conditions as the Magnet.", "anchor old dpoc"],
    ["The Wall 🧱", "When price has moved one way all session and there are no levels left: continuation retests of an obvious HVN shelf in the developing profile.", "wall hvn"],
    ["The Whip ⚡", "Price spikes through a level and takes out the stop, then whips straight back. The re-entry after the whip is the trade.", "whip"],
    ["The Whip at the Open", "When a key level sits where the open is heading: no limit resting into the open. Wait for the spike into the level and the whip back, then enter.", "whip open"],
    ["The Guard 💂", "London session only: fresh dPOC retests that aren't Magnets. By London the developing profile has built for hours, so the dPOC is strong.", "guard london"],
    ["Confluence", "Levels (plus a VWAP band) sitting in the same zone. More confluences means a higher-rated setup.", "confluences stacked"],
    ["Setup rating", "S = 4+ confluences, A = 3, B = 2, C = 1. Stars on a trade card count the confluences.", "grade grading stars s a b c"],
    ["1:1", "Target equals risk. Every MalikTrades setup targets 1:1: small, reliable moves (base hits).", "one to one risk reward rr"],
    ["Base hits", "Taking small, reliable moves every session instead of swinging for big ones.", "base hit scalp"],
    ["Breakeven at 75%", "Once price reaches 75% of the way to the target, move the stop to breakeven.", "be breakeven"],
    ["Limit order", "Every setup is entered with a limit: at the level for a Snap, on the retest for a Flip or Magnet.", "limit entry"],
    ["FRVP", "TradingView's Fixed Range Volume Profile tool, used to draw the session profiles (row size 1000, value area 70%).", "fixed range volume profile"],
    ["R", "One unit of risk. A 1:1 win is +1R; a full loss is −1R.", "r multiple"],
    ["Trailing drawdown", "A prop firm drawdown floor that follows your highest balance. Intraday trailing updates as you trade; EOD trailing updates at the close.", "intraday trailing eod drawdown"],
    ["Consistency rule", "A payout rule capping how much of your total profit can come from your best day.", "consistency"],
    ["Concentrated rotation", "Trade one prop account until it hits the daily loss limit, then switch to the next for the rest of the session.", "rotation accounts"],
    ["Resulting", "Judging a trade by its outcome instead of the process. A good trade can lose; a bad trade can win.", "outcome process"],
  ].map(([t, d, a]) => ({ t, d, a: (t + " " + (a || "")).toLowerCase() }));

  const css = `
.mts-box{display:flex;align-items:center;gap:10px;width:calc(100% - 4px);margin:14px 2px 0;padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#C3D1CE;font:600 14px var(--body,'Source Sans 3',sans-serif);cursor:pointer;text-align:left}
.mts-box:hover{background:rgba(255,255,255,.12);color:#fff}
.mts-box kbd{margin-left:auto;font:700 11px var(--body,sans-serif);border:1px solid rgba(255,255,255,.25);border-radius:6px;padding:0 7px;color:#E4ECEA}
.mts-ph{display:inline-flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer}
.mts{position:fixed;inset:0;z-index:9999;background:rgba(27,39,41,.45);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:flex-start;padding:9vh 12px 12px}
.mts[hidden]{display:none}
.mts-p{width:min(720px,100%);max-height:80vh;display:flex;flex-direction:column;background:#FFFCF6;border-radius:22px;box-shadow:0 40px 80px rgba(0,0,0,.3);overflow:hidden;font-family:var(--body,'Source Sans 3',sans-serif);color:#1B2729}
.mts-in{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid #E6DCCB}
.mts-in input{flex:1;border:0;background:none;font:600 19px var(--body,sans-serif);color:#1B2729;outline:none;min-width:0}
.mts-x{border:1px solid #E6DCCB;background:none;border-radius:8px;padding:3px 9px;font:700 12px var(--body,sans-serif);color:#6E746F;cursor:pointer}
.mts-r{overflow-y:auto;padding-bottom:10px}
.mts-s{padding:12px 20px 4px;font:800 11px var(--body,sans-serif);letter-spacing:3px;color:#6E746F;text-transform:uppercase}
.mts-g{display:block;margin:6px 14px;padding:12px 14px;border-radius:14px;background:#E4ECEA;color:inherit;text-decoration:none}
.mts-g b{font-size:15px}.mts-g div{font-size:14px;color:#3A4649;margin-top:3px;line-height:1.4}
.mts-row{display:flex;gap:12px;align-items:center;padding:9px 20px;color:inherit;text-decoration:none}
.mts-row img{width:34px;height:48px;object-fit:cover;border-radius:5px;flex:none}
.mts-row b{font-size:15px;display:block}.mts-row span{font-size:13px;color:#6E746F;display:block;line-height:1.35}
.mts mark{background:#F3E2B6;color:inherit;border-radius:3px;padding:0 2px}
.mts-th{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px;padding:6px 20px 8px}
.mts-t{display:block;color:inherit;text-decoration:none;border-radius:12px}
.mts-t img{width:100%;height:84px;object-fit:cover;object-position:50% 45%;border-radius:10px;border:1px solid #E6DCCB;display:block}
.mts-t span{display:block;font-size:12px;font-weight:700;margin-top:4px;line-height:1.25}
.mts .on{background:#E4ECEA;outline:2px solid #B4893A;outline-offset:-2px}
.mts-e{padding:22px 20px;color:#6E746F;font-size:15px}
.mts-e button{border:1px solid #E6DCCB;background:#fff;border-radius:999px;padding:5px 12px;margin:6px 6px 0 0;font:700 13px var(--body,sans-serif);color:#1B2729;cursor:pointer}
@media(max-width:700px){.mts{padding:0}.mts-p{max-height:100vh;height:100%;border-radius:0}.mts-in{padding-top:max(16px,env(safe-area-inset-top))}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // entry points
  const wm = document.querySelector("aside .wm, .mt-side .wm");
  if (wm) { const b = document.createElement("button"); b.type = "button"; b.className = "mts-box"; b.setAttribute("data-mt-search", "");
    b.innerHTML = '🔍 <span>Search guides, trades, terms</span><kbd>/</kbd>'; (wm.closest("a") || wm).after(b); }
  const bar = document.querySelector(".mtop > span, .mt-top > span");
  if (bar) { const a = document.createElement("a"); a.className = "mts-ph" + (document.querySelector(".mt-top") ? " b2" : ""); a.href = "#"; a.setAttribute("data-mt-search", ""); a.setAttribute("aria-label", "Search"); a.textContent = "🔍"; bar.prepend(a); }

  const el = document.createElement("div"); el.className = "mts"; el.hidden = true;
  el.innerHTML = `<div class="mts-p" role="dialog" aria-modal="true" aria-label="Search"><div class="mts-in">🔍<input type="search" placeholder="Search guides, trades, terms…" autocomplete="off" spellcheck="false" aria-label="Search"><button type="button" class="mts-x">esc</button></div><div class="mts-r" tabindex="-1"></div></div>`;
  document.body.appendChild(el);
  const inp = el.querySelector("input"), res = el.querySelector(".mts-r");

  let IDX = null, TR = null, loading = null;
  const load = () => loading || (loading = Promise.all([
    fetch("/search-index.json?v=" + (window.MT_V || "")).then(r => r.json()).catch(() => ({ guides: [] })),
    fetch("/setup-library.json?v=" + Date.now()).then(r => r.json()).catch(() => [])
  ]).then(([a, b]) => { IDX = a.guides || []; TR = Array.isArray(b) ? b : (b.trades || []); render(); }));

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hl = (s, toks) => { let o = esc(s); toks.forEach(t => { if (t.length > 1) o = o.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return o; };
  const snip = (txt, toks) => { const l = txt.toLowerCase(); let i = l.indexOf(toks[0]); if (i < 0) i = 0; const a = Math.max(0, i - 50); return (a ? "…" : "") + txt.slice(a, a + 130).trim() + "…"; };
  const SETUP = { snap: "Snap 🫰", flip: "Flip 🔄", magnet: "Magnet 🧲", anchor: "Anchor ⚓", wall: "The Wall 🧱", whip: "The Whip ⚡", guard: "The Guard 💂" };
  const INS = { NQ: "nasdaq nq", ES: "s&p es spx", GC: "gold gc", CL: "oil crude cl" };

  function render() {
    const q = inp.value.trim().toLowerCase(), toks = q.split(/\s+/).filter(Boolean);
    if (!toks.length) { res.innerHTML = `<div class="mts-e">Search every guide page, every trade in the Setup Library and the glossary.<br>${["Snap", "dVAL", "D-shape", "breakeven", "prop firm", "gold Asia", "acceptance"].map(s => `<button type="button" data-q="${s}">${s}</button>`).join("")}</div>`; return; }
    const all = t => toks.every(k => t.includes(k));
    let h = "";
    const gl = GLOSS.filter(x => all(x.a + " " + x.d.toLowerCase())).sort((a, b) => (b.a.startsWith(toks[0]) - a.a.startsWith(toks[0]))).slice(0, 3);
    if (gl.length) h += `<div class="mts-s">Glossary</div>` + gl.map(x => `<div class="mts-g r"><b>${esc(x.t)}</b><div>${hl(x.d, toks)}</div></div>`).join("");
    if (!IDX) { res.innerHTML = h + `<div class="mts-e">Loading guides and trades…</div>`; return; }
    const gr = [];
    IDX.forEach(g => {
      const inTitle = all((g.title + " " + g.line).toLowerCase());
      const pg = g.pages.map((t, i) => [i + 1, t]).filter(([, t]) => all(t.toLowerCase())).sort((a, b) => (a[0] === 1) - (b[0] === 1) || a[0] - b[0]);
      if (inTitle || pg.length) gr.push({ g, pg, score: (inTitle ? 100 : 0) + pg.length });
    });
    gr.sort((a, b) => b.score - a.score);
    if (gr.length) h += `<div class="mts-s">Guides · ${gr.length}</div>` + gr.slice(0, 6).map(({ g, pg }) => {
      const p = pg[0], more = pg.slice(1, 4).map(x => x[0]);
      const sub = p ? `Page ${p[0]}${more.length ? ` (also ${more.sort((a, b) => a - b).join(", ")})` : ""} · ${hl(snip(p[1], toks), toks)}` : esc(g.line);
      return `<a class="mts-row r" href="/read-${g.slug}.html${p ? "#page-" + p[0] : ""}"><img src="/${g.slug}-cover.jpg" alt=""><div><b>${esc(g.title)}</b><span>${sub}</span></div></a>`;
    }).join("");
    const tr = TR.filter(t => all([t.title, t.summary, (t.confluences || []).join(" "), t.setup, SETUP[t.setup] || "", t.instrument, INS[t.instrument] || "", t.direction, (t.notes || []).join(" ")].join(" ").toLowerCase()))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (tr.length) h += `<div class="mts-s">Setup Library · ${tr.length} trade${tr.length > 1 ? "s" : ""}</div><div class="mts-th">` + tr.slice(0, 8).map(t =>
      `<a class="mts-t r" href="/setup-library.html#${encodeURIComponent(t.id)}"><img src="/${t.images[0]}" alt="" loading="lazy"><span>${esc(t.instrument)} · ${esc(SETUP[t.setup] || t.setup)}<br>${esc(t.title)}</span></a>`).join("") + `</div>`
      + (tr.length > 8 ? `<a class="mts-row r" href="/setup-library.html"><div><b>See all ${tr.length} in the Setup Library →</b></div></a>` : "");
    res.innerHTML = h || `<div class="mts-e">No results for “${esc(inp.value)}”. Try a level (dVAL), a setup (Flip) or a topic (prop firm).</div>`;
    sel = -1;
  }

  let sel = -1;
  const items = () => [...res.querySelectorAll(".r")];
  const move = d => { const it = items(); if (!it.length) return; sel = (sel + d + it.length) % it.length; it.forEach((x, i) => x.classList.toggle("on", i === sel)); it[sel].scrollIntoView({ block: "nearest" }); };
  const open = () => { el.hidden = false; document.documentElement.style.overflow = "hidden"; inp.focus(); inp.select(); render(); load(); };
  const close = () => { el.hidden = true; document.documentElement.style.overflow = ""; };
  window.MTSearch = { open, close };

  document.addEventListener("click", e => { const t = e.target.closest("[data-mt-search]"); if (t) { e.preventDefault(); open(); } });
  el.addEventListener("click", e => { if (e.target === el || e.target.closest(".mts-x") || e.target.closest(".mts-r a")) close(); const b = e.target.closest("[data-q]"); if (b) { inp.value = b.dataset.q; render(); inp.focus(); } });
  inp.addEventListener("input", render);
  inp.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); } else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { const it = items()[sel < 0 ? 0 : sel]; if (it && it.href) location.href = it.href; }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !el.hidden) { close(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); open(); }
  });
})();
