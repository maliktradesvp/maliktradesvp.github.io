/* MalikTrades · Mochi on the hub (shared drawing + today's outfit). Same Mochi as the Mindset tool. */
(function(){
"use strict";
const INK = "#21414A";
const st = (() => { try { return JSON.parse(localStorage.getItem("maliktrades.mochi.v1")) || { resets: 0 }; } catch (e) { return { resets: 0 }; } })();
function face(m){
  const E = (x, y) => `<g class="ey"><circle cx="${x}" cy="${y}" r="6.2" fill="${INK}"/><circle cx="${x+2.1}" cy="${y-2.3}" r="2.2" fill="#fff"/><circle cx="${x-2.1}" cy="${y+2.4}" r="1" fill="#fff" opacity=".9"/></g>`;
  const H = (x, y) => `<path d="M${x-6.5} ${y+1} q6.5 -8 13 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const sm = (y, w) => `<path d="M${70-w/2} ${y} q${w/2} ${w*.5} ${w} 0" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  switch (m) {
    case "happy": return H(56, 72) + H(84, 72) + `<path d="M62 82 q8 11 16 0 z" fill="${INK}"/>`;
    case "concern": return E(56, 73) + E(84, 73) + `<path d="M47 64 l12 -4 M93 64 l-12 -4" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` + `<path d="M63 89 q7 -5 14 0" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
    case "worried": return E(56, 73) + E(84, 73) + `<path d="M48 64 l12 -3 M92 64 l-12 -3" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="70" cy="88" rx="5" ry="4" fill="${INK}"/><path d="M108 56 q5 8 0 12 q-5 -4 0 -12 z" fill="#8FC7E8" stroke="${INK}" stroke-width="2"/>`;
    case "sleepy": return `<path d="M49 74 h13 M77 74 h13" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` + sm(86, 10) + `<text x="104" y="52" font-family="Source Sans 3,sans-serif" font-weight="800" font-size="13" fill="${INK}">z</text><text x="112" y="42" font-family="Source Sans 3,sans-serif" font-weight="800" font-size="10" fill="${INK}">z</text>`;
    case "cool": return `<path d="M44 66 h52 v4 q-1 12 -12 12 q-10 0 -12 -10 h-4 q-2 10 -12 10 q-11 0 -12 -12 z" fill="${INK}"/><path d="M50 69 l6 0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>` + sm(89, 14);
    case "sad": return E(56, 74) + E(84, 74) + `<path d="M48 65 l12 -3 M92 65 l-12 -3" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M63 90 q7 -5 14 0" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M50 82 q-3 6 0 9 q3 -3 0 -9 z" fill="#8FC7E8"/>`;
    case "breathe": return H(56, 72) + H(84, 72) + `<ellipse cx="70" cy="88" rx="4" ry="3.2" fill="${INK}"/>`;
    case "giggle": return H(56, 72) + H(84, 72) + `<path d="M61 81 q9 13 18 0 z" fill="${INK}"/><path d="M66 86 q4 3 8 0" stroke="#E8857A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case "love": return `<path d="M50 66 c-5 -5 -11 1 -6 7 l6 6 l6 -6 c5 -6 -1 -12 -6 -7 z M84 66 c-5 -5 -11 1 -6 7 l6 6 l6 -6 c5 -6 -1 -12 -6 -7 z" fill="#E8857A" stroke="${INK}" stroke-width="2"/>` + sm(86, 12);
    case "dizzy": return `<path d="M56 72 m-6 0 a6 6 0 1 1 6 6 a4 4 0 1 1 -4 -4 a2 2 0 1 1 2 2 M84 72 m-6 0 a6 6 0 1 1 6 6 a4 4 0 1 1 -4 -4 a2 2 0 1 1 2 2" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M62 88 q4 -4 8 0 q4 4 8 0" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
    case "surprised": return E(56, 71) + E(84, 71) + `<ellipse cx="70" cy="88" rx="5" ry="6" fill="${INK}"/>`;
    default: return E(56, 72) + E(84, 72) + `<path d="M65 81 q2.5 3 5 0 q2.5 3 5 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
}

function sproutSvg(n){
  // grows with completed resets
  const lv = n >= 15 ? 4 : n >= 7 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0;
  let s = `<path d="M70 40 q0 -14 2 -24" stroke="#4E8B57" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M72 18 q14 -14 27 -6 q-12 12 -27 6 Z" fill="#7BC07A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  s += `<path d="M70 23 q-14 -12 -25 -4 q10 10 25 4 Z" fill="#9AD196" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  if (lv >= 1) s += `<path d="M71 32 q12 -6 19 2 q-11 6 -19 -2 Z" fill="#8ACB88" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (lv >= 2) s += `<path d="M70 34 q-11 -5 -17 2 q9 6 17 -2 Z" fill="#A9D9A4" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (lv >= 3) s += `<circle cx="72" cy="12" r="6" fill="#F4A9A0" stroke="${INK}" stroke-width="2.6"/>`;
  if (lv >= 4) s += [0, 72, 144, 216, 288].map(a => `<ellipse cx="72" cy="4" rx="4.5" ry="6.5" fill="#F7C6BF" stroke="${INK}" stroke-width="2" transform="rotate(${a} 72 12)"/>`).join("") + `<circle cx="72" cy="12" r="4.5" fill="#F6CB5A" stroke="${INK}" stroke-width="2"/>`;
  return s;
}

/* ---- outfits (only on the day itself) + time-aware greetings ---- */
const OUT = (() => {
  const K = INK, S = `stroke="${K}" stroke-width="3" stroke-linejoin="round"`;
  const partyHat = `<path d="M52 44 L66 2 L84 42 Z" fill="#F6CB5A" ${S}/><path d="M57 30 l20 -2 M61 18 l10 -1" stroke="#D94336" stroke-width="4" stroke-linecap="round"/><circle cx="66" cy="2" r="5" fill="#E8857A" stroke="${K}" stroke-width="2.4"/>`;
  const confetti = `<g><rect x="2" y="20" width="6" height="10" rx="1.5" fill="#E8857A" transform="rotate(-20 5 25)"/><rect x="124" y="26" width="6" height="10" rx="1.5" fill="#7BC07A" transform="rotate(25 127 31)"/><circle cx="12" cy="52" r="3.5" fill="#F6CB5A"/><circle cx="130" cy="60" r="3.5" fill="#8FC7E8"/><rect x="118" y="6" width="5" height="9" rx="1.5" fill="#F6CB5A" transform="rotate(40 120 10)"/><rect x="16" y="2" width="5" height="9" rx="1.5" fill="#8FC7E8" transform="rotate(-35 18 6)"/></g>`;
  const songkok = `<path d="M40 50 L42 30 Q70 22 98 30 L100 50 Q70 42 40 50 Z" fill="#2F3A44" ${S}/><path d="M44 36 Q70 30 96 36" stroke="#B4893A" stroke-width="2" fill="none"/>`;
  const ketupat = `<g transform="translate(134 92) rotate(45)"><rect x="-11" y="-11" width="22" height="22" rx="2" fill="#9AD196" ${S}/><path d="M-11 -3.5 H11 M-11 3.5 H11 M-3.5 -11 V11 M3.5 -11 V11" stroke="#4E8B57" stroke-width="2"/><path d="M11 -11 q8 -6 12 2" stroke="#4E8B57" stroke-width="2.6" fill="none"/></g>`;
  const diya = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 6 Q0 20 14 6 Z" fill="#E2A33A" stroke="${K}" stroke-width="2.6"/><path d="M0 4 q-6 -8 0 -16 q6 8 0 16 Z" fill="#F6CB5A" stroke="#E2A33A" stroke-width="2"/></g>`;
  const mandarin = x => `<circle cx="${x}" cy="98" r="12" fill="#F29A3A" ${S}/><path d="M${x} 86 q5 -6 10 -2" stroke="#4E8B57" stroke-width="3" fill="none"/>`;
  return {
    newyear: { o: partyHat + confetti, f: "happy", t: "Happy New Year! 🎆 New year, same rules. That's the edge." },
    nye: { o: partyHat + confetti, f: "happy", t: "Last day of the year! 🎉 Close it out clean. No hero trades." },
    xmas: { o: `<g transform="rotate(-12 70 40)"><path d="M34 46 Q52 4 92 14 Q104 18 108 34 Q90 26 74 30 Q60 34 54 44 Z" fill="#D94336" ${S}/><circle cx="110" cy="36" r="8" fill="#fff" stroke="${K}" stroke-width="2.6"/><path d="M28 50 Q70 30 106 46 Q108 56 100 56 Q70 42 32 60 Q24 58 28 50 Z" fill="#fff" ${S}/></g>`, f: "happy", t: "Merry Christmas! 🎄 Ho ho hold your stop 🎅" },
    valentine: { o: `<g transform="translate(128 92) rotate(20)"><path d="M0 18 L0 -4" stroke="#4E8B57" stroke-width="3"/><path d="M0 -4 q-9 -2 -8 -10 q4 -6 8 -2 q4 -4 8 2 q1 8 -8 10z" fill="#E8574A" ${S}/></g>`, f: "love", t: "Happy Valentine's 💚 Love your process, not your P&L." },
    fools: { o: `<g><circle cx="56" cy="72" r="10" fill="none" stroke="${K}" stroke-width="3"/><circle cx="84" cy="72" r="10" fill="none" stroke="${K}" stroke-width="3"/><path d="M66 72 h8" stroke="${K}" stroke-width="3"/><path d="M44 62 q12 -6 22 0 M74 62 q10 -6 22 0" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="70" cy="82" rx="6" ry="5" fill="#F4A9A0" ${S}/><path d="M56 90 q14 -7 28 0" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`, fr: true, f: "calm", t: "Your stop moved itself!… April Fools 😜 It's exactly where you put it." },
    earth: { o: `<g transform="translate(132 96)"><circle r="13" fill="#8FC7E8" ${S}/><path d="M-8 -6 q6 -2 8 4 q-2 6 4 8 M2 -12 q4 4 10 2" stroke="#4E8B57" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>`, f: "happy", t: "Happy Earth Day 🌍 Growth takes time. Base hits, every day." },
    labour: { o: `<path d="M32 50 Q34 22 70 20 Q106 22 108 50 Z" fill="#F6CB5A" ${S}/><path d="M26 50 H114" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M70 20 V48" stroke="#E2A33A" stroke-width="4"/>`, f: "happy", t: "Happy Labour Day 👷 Rest counts as work too." },
    natday: { o: `<g transform="translate(118 50) rotate(12)"><path d="M0 0 l0 50" stroke="${K}" stroke-width="3"/><rect x="0" y="0" width="30" height="20" fill="#fff" stroke="${K}" stroke-width="2.4"/><rect x="0" y="0" width="30" height="10" fill="#E03C3C" stroke="${K}" stroke-width="2.4"/><circle cx="7" cy="5" r="3" fill="#fff"/></g>`, f: "happy", t: "Happy National Day, Singapore! 🇸🇬" },
    halloween: { o: `<path d="M30 48 L108 48 Q102 42 92 40 L80 0 Q76 -4 72 2 L60 38 Q42 40 30 48 Z" fill="#3A3150" ${S}/><path d="M58 40 L88 40" stroke="#F29A3A" stroke-width="5"/><g transform="translate(132 100)"><ellipse rx="14" ry="11" fill="#F29A3A" stroke="${K}" stroke-width="2.6"/><path d="M-5 -2 l3 -3 l2 3 M3 -2 l3 -3 l2 3 M-6 4 q6 4 12 0" stroke="${K}" stroke-width="2" fill="none"/><path d="M0 -11 l1 -5" stroke="#4E8B57" stroke-width="3"/></g>`, f: "calm", t: "Happy Halloween 🎃 The only scary thing is a moved stop 👻" },
    fri13: { o: `<path d="M36 52 L40 26 L56 42 Z M104 52 L100 26 L84 42 Z" fill="#2E3B44" ${S}/><path d="M42 44 L42 34 L50 42 Z M98 44 L98 34 L90 42 Z" fill="#F4A9A0"/>`, f: "calm", t: "Friday the 13th 🐈‍⬛ Luck isn't a strategy. Your levels are." },
    witching: { o: `<path d="M28 50 Q70 38 112 50 Q100 40 88 38 L74 -2 Q70 -6 66 0 L54 38 Q40 40 28 50 Z" fill="#5B4B9A" ${S}/><path d="M66 18 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 z" fill="#F6CB5A"/><circle cx="82" cy="30" r="2.5" fill="#F6CB5A"/><circle cx="58" cy="32" r="2" fill="#F6CB5A"/>`, f: "happy", t: "Triple witching today 🧙 Quarterly expiry can bring extra volume. Stick to your levels." },
    thanks: { o: `<path d="M38 48 L44 18 H96 L102 48 Z" fill="#3A3A3A" ${S}/><path d="M30 50 H110" stroke="${K}" stroke-width="5" stroke-linecap="round"/><rect x="44" y="34" width="52" height="8" fill="#8A6528"/><rect x="62" y="31" width="16" height="14" rx="2" fill="none" stroke="#F6CB5A" stroke-width="3"/>`, f: "happy", t: "Happy Thanksgiving 🦃 US holiday hours today, so check your platform's schedule." },
    july4: { o: `<g stroke-width="3" stroke-linecap="round"><g stroke="#E8574A"><path d="M14 14 l0 -8 M14 14 l7 -4 M14 14 l7 4 M14 14 l0 8 M14 14 l-7 4 M14 14 l-7 -4"/></g><g stroke="#8FC7E8"><path d="M126 22 l0 -8 M126 22 l7 -4 M126 22 l7 4 M126 22 l0 8 M126 22 l-7 4 M126 22 l-7 -4"/></g></g>`, f: "happy", t: "Happy 4th of July 🎆 US holiday hours today, so check your platform's schedule." },
    cny: { o: `<path d="M30 52 Q70 20 110 52 Q70 40 30 52 Z" fill="#D94336" ${S}/><circle cx="70" cy="32" r="6" fill="#F6CB5A" stroke="${K}" stroke-width="2.4"/>` + mandarin(2) + mandarin(138), f: "happy", t: "Huat ah! 🧧 Happy Chinese New Year. May your 1:1s be plenty 🍊" },
    puasa: { o: songkok + ketupat, f: "happy", t: "Selamat Hari Raya Aidilfitri! 🌙 Maaf zahir dan batin." },
    haji: { o: songkok, f: "happy", t: "Selamat Hari Raya Haji! 🌙" },
    vesak: { o: `<g transform="translate(132 100)"><path d="M0 4 q-14 -2 -16 -14 q10 0 16 10 q6 -10 16 -10 q-2 12 -16 14z" fill="#F7C6BF" ${S}/><path d="M0 4 q-6 -10 0 -20 q6 10 0 20z" fill="#F4A9A0" ${S}/></g>`, f: "happy", t: "Happy Vesak Day 🪷 Calm mind, steady hands." },
    deepavali: { o: diya(134, 98, 1) + diya(4, 102, .8), f: "happy", t: "Happy Deepavali! 🪔 Let the light win over the fear." },
    easter: { o: `<g ${S}><path d="M52 44 Q40 4 52 2 Q62 4 62 42 Z" fill="#fff"/><path d="M78 42 Q80 4 90 4 Q100 8 88 44 Z" fill="#fff"/></g><path d="M52 38 Q46 12 52 8 Q57 12 58 38 Z M82 38 Q84 12 89 10 Q94 14 86 38 Z" fill="#F7C6BF"/><g transform="translate(134 100)"><ellipse rx="10" ry="13" fill="#8FC7E8" ${S}/><path d="M-10 0 l5 -3 l5 3 l5 -3 l5 3" stroke="#fff" stroke-width="2.4" fill="none"/></g>`, f: "happy", t: "Happy Easter 🐣" },
    midautumn: { o: `<g transform="translate(136 70)"><path d="M0 -26 V-14" stroke="${K}" stroke-width="2.4"/><ellipse rx="12" ry="14" fill="#E8574A" ${S}/><path d="M-12 0 H12 M0 -14 V14" stroke="#F6CB5A" stroke-width="1.8"/><path d="M0 14 v8" stroke="#F6CB5A" stroke-width="3"/></g><g transform="translate(2 102)"><circle r="12" fill="#D9A15A" ${S}/><circle r="6" fill="none" stroke="#8A6528" stroke-width="2"/></g>`, f: "happy", t: "Happy Mid-Autumn Festival 🏮 Mooncakes after the session." },
    scarf: { o: `<path d="M10 98 Q70 114 130 98 L131 109 Q70 125 9 109 Z" fill="#21414A" ${S}/><path d="M12 103 Q70 118 128 103" stroke="#E2C27A" stroke-width="2" fill="none" stroke-dasharray="4 4"/><path d="M95 110 L101 134 L119 129 L113 107 Z" fill="#2F5A60" ${S}/><image href="data:image/png;base64,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" x="101" y="113" width="11" height="15" transform="rotate(-18 106 120)"/><path d="M102 134 l-1 4 M108 133 l0 4 M114 131 l1 4" stroke="${K}" stroke-width="2" stroke-linecap="round"/>`, f: "calm" },
    weekend: { o: `<path d="M36 48 Q60 16 96 22 Q112 26 116 46 Q96 36 70 40 Q50 42 36 48 Z" fill="#6E8FCF" ${S}/><circle cx="118" cy="50" r="7" fill="#F6CB5A" stroke="${K}" stroke-width="2.4"/>`, f: "sleepy" },
    headset: { o: `<path d="M12 84 A58 54 0 0 1 128 84" fill="none" stroke="${K}" stroke-width="5"/><rect x="0" y="74" width="15" height="26" rx="6.5" fill="#B4893A" stroke="${K}" stroke-width="3"/><rect x="125" y="74" width="15" height="26" rx="6.5" fill="#B4893A" stroke="${K}" stroke-width="3"/><path d="M133 98 q4 12 -10 16" stroke="${K}" stroke-width="3" fill="none"/><circle cx="121" cy="114" r="3.5" fill="${K}"/>`, f: "calm" }
  };
})();
/* lunar & religious dates (MOM gazette 2026–2027; 2028 tentative). Add new years here. */
const LUNAR = {
  "2026-02-17": "cny", "2026-03-21": "puasa", "2026-05-27": "haji", "2026-05-31": "vesak", "2026-09-25": "midautumn", "2026-11-08": "deepavali",
  "2027-02-06": "cny", "2027-03-10": "puasa", "2027-05-17": "haji", "2027-05-20": "vesak", "2027-09-15": "midautumn", "2027-10-28": "deepavali",
  "2028-01-26": "cny", "2028-02-27": "puasa", "2028-05-05": "haji", "2028-05-09": "vesak", "2028-10-03": "midautumn", "2028-10-17": "deepavali"
};
const FIXED = { "01-01": "newyear", "02-14": "valentine", "04-01": "fools", "04-22": "earth", "05-01": "labour", "07-04": "july4", "08-09": "natday", "10-31": "halloween", "12-25": "xmas", "12-31": "nye" };
const USER_TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Singapore"; } catch (e) { return "Asia/Singapore"; } })();
let NOW_OVERRIDE = null;
const nowMs = () => NOW_OVERRIDE ?? Date.now();
function tp(ms, tz){
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short" }).formatToParts(new Date(ms)).map(x => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, wd: p.weekday };
}
function zoned(y, mo, d, h, mi, tz){
  let g = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) { const p = tp(g, tz); const asUtc = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi); g -= (asUtc - Date.UTC(y, mo - 1, d, h, mi)); }
  return g;
}
function easter(y){ const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1; return [mo, day]; }
function holidayKey(ms){
  const p = tp(ms, USER_TZ), pad = n => String(n).padStart(2, "0"), md = pad(p.mo) + "-" + pad(p.d), ymd = p.y + "-" + md;
  if (LUNAR[ymd]) return LUNAR[ymd];
  const [em, ed] = easter(p.y); if (p.mo === em && p.d === ed) return "easter";
  if (p.mo === 11 && p.wd === "Thu" && p.d >= 22 && p.d <= 28) return "thanks";
  if (FIXED[md]) return FIXED[md];
  if (p.wd === "Fri" && [3, 6, 9, 12].includes(p.mo) && p.d >= 15 && p.d <= 21) return "witching";
  if (p.wd === "Fri" && p.d === 13) return "fri13";
  return null;
}
const SESS = [
  { n: "Asia", e: "🌏", tz: "Asia/Singapore", h: 8, m: 0, end: [11, 0], tip: "Levels marked? No limits resting into the open.", live: "Asia's live 🎧 <b>Patience at your levels.</b>" },
  { n: "London", e: "🇬🇧", tz: "America/New_York", h: 2, m: 0, end: [5, 0], tip: "Mark your levels and set your alerts.", live: "London's live 🎧 <b>Patience at your levels.</b>" },
  { n: "NY", e: "🗽", tz: "America/New_York", h: 9, m: 30, end: [16, 0], tip: "Let the developing VP build. <span class='nw'>Start from 10:00 ET.</span>", live: "NY's live 🎧 <b>Patience at your levels.</b>" }
];
const WK = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);
function opens(s, now){
  const out = [];
  for (let k = -1; k <= 7; k++) { const p = tp(now + k * 864e5, s.tz); const o = zoned(p.y, p.mo, p.d, s.h, s.m, s.tz), e = zoned(p.y, p.mo, p.d, s.end[0], s.end[1], s.tz);
    if (WK.has(tp(o, s.tz).wd)) out.push([o, e]); }
  return out;
}
const dur = ms => { const m = Math.max(1, Math.round(ms / 60000)); if (m < 60) return m + "&nbsp;min"; const h = Math.floor(m / 60), r = m % 60; return h + "h" + (r ? "&nbsp;" + r + "m" : ""); };
function greet(){
  const now = nowMs(), hk = holidayKey(now), et = tp(now, "America/New_York"), loc = tp(now, USER_TZ);
  const hol = hk ? OUT[hk] : null;
  let line = "", face = "calm", outfit = hol ? hk : null;
  const weekend = (et.wd === "Fri" && et.h >= 17) || et.wd === "Sat" || (et.wd === "Sun" && et.h < 18);
  let live = null, next = null;
  for (const s of SESS) for (const [o, e] of opens(s, now)) { if (now >= o && now < e) live = s; if (o > now && (!next || o < next[1])) next = [s, o]; }
  if (weekend) {
    face = "sleepy"; outfit = outfit || "weekend";
    line = (et.wd === "Sun" && next) ? `Markets reopen soon 😴 <b class="nw">Asia opens in ${dur(next[1] - now)}.</b>` : "Markets are closed 😴 <b>Rest, review your week, come back fresh.</b>";
  } else if (live) {
    outfit = outfit || "headset";
    line = (live.n === "NY" && (et.h === 9)) ? "NY's open 🗽 <b>Let the developing VP build <span class='nw'>until 10:00 ET.</span></b>" : live.live;
  } else if (next && next[1] - now <= 60 * 60000) {
    line = (next[0].n === "Asia" && tp(now, "Asia/Singapore").wd === "Mon") ? `New week 🌱 <b>Mark your prior-week levels.</b> <span class="nw">Asia opens in <b>${dur(next[1] - now)}</b> 🌏</span>`
      : `${next[0].n} opens in <span class="nw"><b>${dur(next[1] - now)}</b> ${next[0].e}</span> ${next[0].tip}`;
  } else if (et.wd === "Fri" && et.h >= 16) {
    face = "happy"; line = "That's the week! 🎉 <b>Do your weekly review</b> in the Journal.";
  } else if (loc.h < 5) {
    face = "sleepy"; line = `It's ${loc.h === 0 ? 12 : loc.h}am… 🥱 <b>If there's no session, sleep is the best trade.</b>`;
  } else if ((et.wd === "Sun" && et.h >= 18) || (et.wd === "Mon" && et.h < 2 && next && next[0].n === "Asia")) {
    line = "New week 🌱 <b>Mark your prior-week levels</b> before Asia opens.";
  } else {
    const part = loc.h < 12 ? "Good morning" : loc.h < 18 ? "Good afternoon" : "Good evening";
    line = next ? `${part}! Next up: <span class="nw"><b>${next[0].n} in ${dur(next[1] - now)}</b> ${next[0].e}</span>` : `${part}!`;
  }
  if (!outfit) outfit = "scarf";
  if (hol) { face = hol.f; line = hol.t + (line ? "<br>" + line : ""); }
  return { line, face, outfit };
}


let CUR_OUT = null;
function mochiSvg(m){
  return `<svg class="mochi" viewBox="-16 -16 172 160" role="img" aria-label="Mochi, the MalikTrades mascot">
<ellipse cx="70" cy="114" rx="58" ry="6" fill="#000" opacity=".18"/>
<path d="M8 100 C4 70 26 40 70 40 C114 40 136 70 132 100 C130 116 10 116 8 100 Z" fill="#FBF6EC" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>
<path d="M18 92 q-2 -22 20 -40" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>
<path d="M14 104 Q70 118 126 104" stroke="#E6DCCB" stroke-width="4" fill="none" opacity=".9"/>
<g class="sp">${sproutSvg(st.resets)}</g>
<ellipse cx="36" cy="88" rx="10" ry="6" fill="#F4A9A0" opacity=".9"/><ellipse cx="104" cy="88" rx="10" ry="6" fill="#F4A9A0" opacity=".9"/>
<g class="fc" transform="translate(0 6) translate(70 72) scale(1.2) translate(-70 -72)">${face(m)}${CUR_OUT && OUT[CUR_OUT] && OUT[CUR_OUT].fr ? OUT[CUR_OUT].o : ""}</g>${CUR_OUT && OUT[CUR_OUT] && !OUT[CUR_OUT].fr ? `<g class="outfit">${OUT[CUR_OUT].o}</g>` : ""}</svg>`;
}

function today(){ const g = greet(); return g; }
const TAPS = ["Hehe, that tickles!", "Boop! 💚", "Small, steady base hits 🌱", "Process over P&L.", "The next trade doesn't know about the last one.", "Two losses? We're done for the day.", "No setup is a position too.", "I'm squishy. Your stop isn't.", "Mark your levels, then let price come to you.", "Did you drink water today? 💧", "1:1, every time. Boring on purpose.", "Size by the stars, never by the last trade."];
let last = -1;
function pick(){ let i; do { i = Math.floor(Math.random() * TAPS.length); } while (i === last); last = i; return TAPS[i]; }
function draw(el, face){ el.innerHTML = mochiSvg(face); }
/* el: container; opts.say: element for speech; opts.line: default line html */
function mount(el, opts){
  opts = opts || {};
  const g = greet(); CUR_OUT = g.outfit; let base = g.face === "sleepy" ? "sleepy" : "calm"; if (opts.face) base = opts.face;
  draw(el, base);
  if (opts.say) opts.say.innerHTML = opts.line || g.line;
  el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("aria-label", "Tap Mochi");
  let t = null;
  const tap = () => {
    draw(el, Math.random() < .5 ? "giggle" : "love"); const svg = el.querySelector("svg"); svg.classList.add("boing"); setTimeout(() => svg.classList.remove("boing"), 600);
    if (opts.say) { opts.say.innerHTML = pick(); opts.say.classList.add("on"); }
    if (opts.onTap) opts.onTap();
    clearTimeout(t); t = setTimeout(() => { draw(el, base); if (opts.say) { opts.say.innerHTML = opts.line || g.line; if (opts.hideSay) opts.say.classList.remove("on"); } }, 2600);
  };
  el.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); tap(); });
  el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(); } });
  setInterval(() => { const f = el.querySelectorAll(".ey"); f.forEach(x => x.classList.add("bl")); setTimeout(() => f.forEach(x => x.classList.remove("bl")), 140); }, 3800 + Math.random() * 2000);
}
window.MTMochi = { mount, today, svg: (face, outfit) => { const o = CUR_OUT; CUR_OUT = outfit === undefined ? greet().outfit : outfit; const s = mochiSvg(face || "calm"); CUR_OUT = o; return s; } };
})();
