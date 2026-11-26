/* MalikTrades "What's new": built automatically from setup-library.json and hall-of-fame.json,
   plus whats-new.json for guide releases and updates. Renders the home band (#wnBand) and the full list (#wnAll). */
(function () {
  "use strict";
  const SEEN = "maliktrades.seen.v1";
  const seen = () => { try { return new Set(JSON.parse(localStorage.getItem(SEEN)) || []); } catch (e) { return new Set(); } };
  const markSeen = k => { const s = seen(); s.add(k); try { localStorage.setItem(SEEN, JSON.stringify([...s].slice(-300))); } catch (e) {} };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayDiff = d => { const [y, m, dd] = d.split("-").map(Number); const a = new Date(y, m - 1, dd), n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((n - a) / 864e5); };
  const nice = d => { const [, m, dd] = d.split("-").map(Number); return `${dd} ${MON[m - 1]}`; };
  const rel = d => { const n = dayDiff(d); return n <= 0 ? "Today" : n === 1 ? "Yesterday" : n < 7 ? `${n} days ago` : nice(d); };
  const SETUP = { snap: ["Snap", "Snaps"], flip: ["Flip", "Flips"], magnet: ["Magnet", "Magnets"], anchor: ["Anchor", "Anchors"], wall: ["Wall", "Walls"], whip: ["Whip", "Whips"], guard: ["Guard", "Guards"] };

  const css = `
.wc2{margin:18px 0 0;background:linear-gradient(90deg,#1B2729,#21414A);border-radius:22px;padding:16px 18px;color:#F7EFDC}
.wc2 .hd{display:flex;align-items:baseline;gap:12px;margin:0 4px 12px}
.wc2 .hd b{font:600 26px/1 var(--display);color:#F7EFDC}
.wc2 .cnt{font:800 11px var(--body);letter-spacing:1.5px;background:#E2C27A;color:#1B2729;border-radius:999px;padding:3px 9px}
.wc2 .hd a{margin-left:auto;font:700 13px var(--body);color:#E2C27A;text-decoration:none}
.wc2 .row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.wnit{display:flex;gap:14px;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:10px 14px 10px 10px;position:relative;text-decoration:none;color:inherit;min-width:0;transition:background .15s}
.wnit:hover{background:rgba(255,255,255,.1)}
.wnit.new{border-color:rgba(226,194,122,.55);background:rgba(226,194,122,.08)}
.wnth{width:72px;height:72px;border-radius:12px;flex:none;background-repeat:no-repeat;background-color:#0d0f12;border:1px solid rgba(255,255,255,.15);position:relative;overflow:hidden}
.wnth .bd{position:absolute;left:4px;bottom:4px;font:800 9px var(--body);letter-spacing:.8px;padding:2px 6px;border-radius:6px;background:rgba(27,39,41,.88);color:#F7EFDC;white-space:nowrap;max-width:62px;overflow:hidden;text-overflow:ellipsis}
.wnk{font:800 10px var(--body);letter-spacing:2px;text-transform:uppercase;color:var(--a);display:flex;align-items:center;gap:6px}
.wnk i{width:7px;height:7px;border-radius:50%;background:#E2C27A;display:inline-block;flex:none}
.wnt{font-weight:700;font-size:15px;color:#F7EFDC;margin:3px 0 2px;line-height:1.2}
.wnd{font-size:12.5px;color:#C3D1CE;line-height:1.3}
.wntm{position:absolute;top:10px;right:12px;font:700 11px var(--body);color:#9FB3B0}
.wnit > div:last-of-type{min-width:0;padding-right:58px}
.wc2 .dots{display:none}
@media(max-width:900px){.wc2 .row{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:86%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -18px;padding:0 18px;scroll-padding:0 18px}
.wc2 .row::-webkit-scrollbar{display:none}.wnit{scroll-snap-align:start}
.wc2 .dots{display:flex;gap:6px;justify-content:center;margin-top:12px}.wc2 .dots span{width:6px;height:6px;border-radius:99px;background:rgba(255,255,255,.3);transition:.2s}.wc2 .dots span.on{width:18px;background:#E2C27A}
.wc2 .hd a{font-size:12px}}
.wnall .mo{font:800 12px var(--body);letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin:26px 0 10px}
.wnall .list{display:flex;flex-direction:column;gap:10px}
.wnall .wnit{background:#21414A;border-color:#21414A;padding:12px 16px 12px 12px}
.wnall .wnit.new{background:#2A4A52;border-color:#E2C27A}
.wnall .wnth{width:86px;height:86px}
.wnall .wnt{font-size:17px}.wnall .wnd{font-size:14px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const get = u => fetch(u + (u.includes("?") ? "&" : "?") + "v=" + Date.now()).then(r => r.ok ? r.json() : []).catch(() => []);
  Promise.all([get("/setup-library.json"), get("/hall-of-fame.json"), get("/whats-new.json")]).then(([lib, hof, man]) => {
    lib = Array.isArray(lib) ? lib : (lib.trades || []);
    const U = [];
    // trades, grouped by day
    const byDay = {};
    lib.forEach(t => (byDay[t.date] = byDay[t.date] || []).push(t));
    Object.entries(byDay).forEach(([d, ts]) => {
      const c = {}; ts.forEach(t => c[t.setup] = (c[t.setup] || 0) + 1);
      const sum = Object.entries(c).sort((a, b) => b[1] - a[1]).map(([s, n]) => `${n} ${(SETUP[s] || [s, s + "s"])[n > 1 ? 1 : 0]}`).join(" · ");
      const ins = [...new Set(ts.map(t => t.instrument))];
      U.push({ key: "lib:" + d, date: d, kind: "Setup Library", col: "#7CC6B4", title: `${ts.length} trade${ts.length > 1 ? "s" : ""} added`, desc: sum,
        badge: ins.length > 2 ? `${ins.length} markets` : ins.join(" · "), img: "/" + ts[0].images[0], pos: "38% 44%", size: "210%", href: ts.length === 1 ? `/setup-library.html#${encodeURIComponent(ts[0].id)}` : "/setup-library.html" });
    });
    // hall of fame, grouped by day and type
    const hd = {};
    (Array.isArray(hof) ? hof : (hof.members || [])).forEach(p => (p.items || []).forEach(it => { const k = it.date + "|" + it.type; (hd[k] = hd[k] || []).push(it); }));
    Object.entries(hd).forEach(([k, its]) => {
      const [d, type] = k.split("|"), n = its.length;
      const title = type === "payout" ? (n > 1 ? `${n} payouts` : "Payout") : `${n} account${n > 1 ? "s" : ""} funded`;
      const firm = [...new Set(its.map(i => (i.firm || "").replace(" Trader Funding", "")))].join(", ");
      const size = (its[0].label || "").split("·").pop().trim();
      U.push({ key: "hof:" + k, date: d, kind: "Hall of Fame", col: "#E2C27A", title, desc: [firm, type === "payout" ? "Payout" : "Funded " + size].filter(Boolean).join(" · "),
        badge: type === "payout" ? "PAID" : size, img: "/" + its[0].img, pos: "30% 40%", size: "240%", href: "/hall-of-fame.html" });
    });
    // guides (manual)
    (Array.isArray(man) ? man : (man.items || [])).forEach(m => U.push({ key: "g:" + m.date + ":" + m.slug + ":" + m.title, date: m.date, kind: m.kind === "updated" ? "Guide updated" : "New guide", col: "#C3D1CE",
      title: m.title, desc: m.desc, badge: m.badge || "", img: m.img || `/${m.slug}-cover.jpg`, pos: m.pos || "50% 50%", size: m.size || "cover", href: `/read-${m.slug}.html${m.page ? "#page-" + m.page : ""}` }));

    U.sort((a, b) => b.date.localeCompare(a.date) || a.kind.localeCompare(b.kind));
    const S = seen(), isNew = u => !S.has(u.key) && dayDiff(u.date) <= 7;
    const card = u => `<a class="wnit ${isNew(u) ? "new" : ""}" href="${u.href}" data-k="${esc(u.key)}" style="--a:${u.col}">
<div class="wnth" style="background-image:url('${u.img}');background-size:${u.size};background-position:${u.pos}">${u.badge ? `<span class="bd">${esc(u.badge)}</span>` : ""}</div>
<div><div class="wnk">${isNew(u) ? "<i></i>" : ""}${esc(u.kind)}</div><div class="wnt">${esc(u.title)}</div><div class="wnd">${esc(u.desc)}</div></div><span class="wntm">${rel(u.date)}</span></a>`;
    const onClick = e => { const a = e.target.closest(".wnit"); if (a) markSeen(a.dataset.k); };

    const band = document.getElementById("wnBand");
    if (band && U.length) {
      const pick = [], kinds = new Set(); U.forEach(u => { const k = u.kind.startsWith("Guide") || u.kind === "New guide" ? "g" : u.kind; if (!kinds.has(k)) { kinds.add(k); pick.push(u); } });
      U.forEach(u => { if (pick.length < 3 && !pick.includes(u)) pick.push(u); });
      const top = pick.slice(0, 3).sort((a, b) => b.date.localeCompare(a.date)), nNew = U.filter(isNew).length;
      band.className = "wc2"; band.hidden = false;
      band.innerHTML = `<div class="hd"><b>What's new</b>${nNew ? `<span class="cnt">${nNew} NEW</span>` : ""}<a href="/updates.html">See all updates →</a></div>
<div class="row">${top.map(card).join("")}</div><div class="dots">${top.map((_, i) => `<span class="${i ? "" : "on"}"></span>`).join("")}</div>`;
      band.addEventListener("click", onClick);
      const row = band.querySelector(".row"), dots = [...band.querySelectorAll(".dots span")];
      row.addEventListener("scroll", () => { const i = Math.round(row.scrollLeft / (row.scrollWidth / top.length)); dots.forEach((d, j) => d.classList.toggle("on", j === i)); }, { passive: true });
    }
    const all = document.getElementById("wnAll");
    if (all) {
      const g = {}; U.forEach(u => { const [y, m] = u.date.split("-").map(Number); const k = `${MON[m - 1]} ${y}`; (g[k] = g[k] || []).push(u); });
      all.className = "wnall";
      all.innerHTML = Object.entries(g).map(([k, us]) => `<div class="mo">${k}</div><div class="list">${us.map(card).join("")}</div>`).join("") || "<p>No updates yet.</p>";
      all.addEventListener("click", onClick);
    }
  });
})();
