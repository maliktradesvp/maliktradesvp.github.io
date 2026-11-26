/* MalikTrades guide reader: renders the guide PDF page by page with PDF.js, with shelf progress, prev/next and mark-as-read.
   Each /read-<slug>.html page sets <body data-guide="<slug>"> and loads /guides-data.js before this file. */
(function () {
  "use strict";
  const G = window.MT_GUIDES, V = window.MT_V;
  const slug = document.body.dataset.guide;
  const g = G.find(x => x.slug === slug);
  if (!g) return;
  const by = s => G.find(x => x.slug === s);
  const $ = id => document.getElementById(id);
  const RKEY = "maliktrades.reading.v1";
  const readSet = () => { try { return new Set((JSON.parse(localStorage.getItem(RKEY)) || {}).read || []); } catch (e) { return new Set(); } };
  const save = s => { try { localStorage.setItem(RKEY, JSON.stringify({ read: [...s] })); } catch (e) {} };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pdfUrl = `/${slug}.pdf?v=${V}`;
  const prev = g.prev && by(g.prev), next = g.next && by(g.next);

  document.title = `${g.title.replace(/^#\d+ /, "")} · ${g.shelfLabel} · MalikTrades`;
  document.body.insertAdjacentHTML("afterbegin", `
<header class="rd-bar"><div class="rd-in">
  <a class="rd-back" href="${g.shelfHref}" aria-label="Back to ${esc(g.shelfLabel)}">←<span class="rd-hide">${esc(g.shelfLabel)}</span></a>
  <div class="rd-t"><div class="rd-k">${esc(g.shelfLabel)} · ${g.idx} of ${g.total}</div><div class="rd-h">${esc(g.title)}</div></div>
  <span class="rd-pg rd-hide" id="rdPg">Page 1 / ${g.pages}</span>
  <button class="rd-b rd-sr" type="button" data-mt-search aria-label="Search">🔍</button>
  <a class="rd-b rd-hide" ${prev ? `href="/read-${prev.slug}.html"` : 'aria-disabled="true"'}>‹ Prev</a>
  <a class="rd-b" ${next ? `href="/read-${next.slug}.html"` : `href="${g.shelfHref}"`}>${next ? "Next ›" : "Done ›"}</a>
  <button class="rd-b mk rd-hide" type="button" id="rdMk"></button>
</div><div class="rd-prog"><i id="rdProg"></i></div></header>
<main class="rd-doc" id="rdDoc"><div id="rdPages"></div>
  <div class="rd-done"><div><b>Finished this one?</b><p>Mark it as read and it ticks off on your shelf.</p></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="rd-b mk" type="button" id="rdMk2"></button></div></div>
  <div class="rd-end">
    ${prev ? `<a class="rd-nv" href="/read-${prev.slug}.html"><img src="/${prev.slug}-cover.jpg?v=${V}" alt=""><div><small>‹ PREVIOUS</small><b>${esc(prev.title)}</b><span>${esc(prev.line)}</span></div></a>`
           : `<a class="rd-nv home" href="${g.shelfHref}"><span class="ic">📚</span><div><small>‹ BACK</small><b>${esc(g.shelfLabel)}</b><span>See the whole shelf</span></div></a>`}
    ${next ? `<a class="rd-nv nx" href="/read-${next.slug}.html"><img src="/${next.slug}-cover.jpg?v=${V}" alt=""><div><small>UP NEXT ›</small><b>${esc(next.title)}</b><span>${esc(next.line)}</span></div></a>`
           : `<a class="rd-nv nx home" href="${g.shelfHref}"><span class="ic">✓</span><div><small>END OF THE SHELF ›</small><b>That's all of ${esc(g.shelfLabel)}</b><span>Head back to pick your next read</span></div></a>`}
  </div>
</main>`);

  // mark as read (shares storage with the home page ticks)
  const paintMk = () => { const on = readSet().has(g.id);
    for (const b of [$("rdMk"), $("rdMk2")]) { b.setAttribute("aria-pressed", on); b.textContent = on ? "✓ Read" : "✓ Mark as read"; } };
  for (const b of [$("rdMk"), $("rdMk2")]) b.addEventListener("click", () => { const s = readSet(); s.has(g.id) ? s.delete(g.id) : s.add(g.id); save(s); paintMk(); });
  paintMk();

  // scroll progress + current page
  const host = $("rdPages");
  const onScroll = () => {
    const d = $("rdDoc"), r = d.getBoundingClientRect(), h = d.offsetHeight - innerHeight * 0.6;
    $("rdProg").style.width = Math.max(0, Math.min(100, (-r.top / Math.max(1, h)) * 100)) + "%";
    const pgs = host.children; let cur = 1;
    for (let i = 0; i < pgs.length; i++) if (pgs[i].getBoundingClientRect().top < innerHeight * 0.45) cur = i + 1;
    const p = $("rdPg"); if (p) p.textContent = `Page ${cur} / ${g.pages}`;
  };
  addEventListener("scroll", onScroll, { passive: true });

  const fail = () => { host.innerHTML = `<div class="rd-fail"><p>This guide couldn't load. Check your connection and refresh the page.</p><a href="${location.pathname}">Refresh →</a></div>`; };
  if (!window.pdfjsLib) { fail(); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  pdfjsLib.getDocument({ url: pdfUrl }).promise.then(async pdf => {
    const first = await pdf.getPage(1), vp1 = first.getViewport({ scale: 1 });
    const ratio = vp1.height / vp1.width;
    const boxes = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const d = document.createElement("div");
      d.className = "rd-page"; d.id = "page-" + i; d.style.aspectRatio = `${vp1.width} / ${vp1.height}`;
      d.innerHTML = `<div class="ld">Loading page ${i}…</div>`;
      host.appendChild(d); boxes.push(d);
    }
    const done = new Set();
    const render = async i => {
      if (done.has(i)) return; done.add(i);
      const page = i === 1 ? first : await pdf.getPage(i);
      const box = boxes[i - 1], w = box.clientWidth || 800;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const vp = page.getViewport({ scale: (w * dpr) / page.getViewport({ scale: 1 }).width });
      const c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
      c.addEventListener("contextmenu", e => e.preventDefault());
      box.innerHTML = ""; box.appendChild(c);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) render(+e.target.id.slice(5)); }), { rootMargin: "1200px 0px" });
    boxes.forEach(b => io.observe(b));
    render(1);
    const m = location.hash.match(/^#page-?(\d+)$/i) || location.hash.match(/^#page=(\d+)$/i);
    if (m) { const n = Math.min(pdf.numPages, +m[1]); render(n).then(() => boxes[n - 1].scrollIntoView({ block: "start" })); }
    onScroll();
  }).catch(fail);
})();
