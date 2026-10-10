/* Owner tool (not part of the game): draws Chapter 2's map and page background from the chapter's own drawing functions.
   Run from the site folder:  node tools/make_ch2_map.js   ->  assets/map_ch2.svg, assets/bg_ch2.svg
   STOPS are the five stops in map pixels (1224 x 1285); keep them in step with map.stops in chapters.js (percent). */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'ch2_art.js'), 'utf8'), ctx);
const A = ctx.window.CH2ART;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const f = n => (Math.round(n * 10) / 10);
function blob(pts) { // smooth closed curve
  const n = pts.length, P = i => pts[((i % n) + n) % n]; let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`; }
  return d + 'Z';
}
function curve(pts) { let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
  d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`; } return d; }

const W = 1224, H = 1285;
const SHORE = [[612, 62], [840, 78], [1040, 150], [1150, 330], [1172, 560], [1150, 800], [1120, 1010], [980, 1160], [760, 1222], [520, 1226], [300, 1180], [130, 1050], [70, 830], [60, 590], [90, 360], [200, 180], [390, 90]];
const LAND = SHORE.map(([x, y]) => [612 + (x - 612) * .93, 642 + (y - 642) * .935]);
const STOPS = [[367, 1054], [771, 874], [441, 655], [796, 475], [539, 180]];

const tree = (x, y, k, cols) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="4" rx="34" ry="9" fill="#000" opacity=".1"/><rect x="-7" y="-46" width="14" height="50" rx="5" fill="#9a7446"/>
  <g fill="${cols[0]}" stroke="${cols[1]}" stroke-width="3"><circle cx="-24" cy="-62" r="27"/><circle cx="24" cy="-62" r="27"/><circle cx="0" cy="-88" r="32"/></g>
  <circle cx="-10" cy="-96" r="9" fill="#fff" opacity=".22"/></g>`;
const bare = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})" fill="none" stroke="#8a6b45" stroke-linecap="round"><ellipse cx="0" cy="4" rx="30" ry="8" fill="#000" stroke="none" opacity=".08"/>
  <path d="M0 4V-70" stroke-width="12"/><path d="M0 -40L-30 -78M0 -56L30 -92M0 -70L-12 -112M0 -70L18 -118M-30 -78L-48 -84M-30 -78L-30 -104M30 -92L50 -96M30 -92L34 -118" stroke-width="6"/></g>`;
const flower = (x, y, c) => `<g transform="translate(${x} ${y})"><g fill="${c}">${[0, 72, 144, 216, 288].map(a => `<circle cx="${f(Math.sin(a * Math.PI / 180) * 7)}" cy="${f(-Math.cos(a * Math.PI / 180) * 7)}" r="5.6"/>`).join('')}</g><circle r="4.4" fill="#f0992b"/></g>`;
const tuft = (x, y) => `<path d="M${x - 8} ${y}q2 -14 6 -16M${x} ${y}q0 -18 2 -22M${x + 8} ${y}q-1 -12 -6 -16" fill="none" stroke="#6fb46a" stroke-width="3.4" stroke-linecap="round"/>`;
const leaf = (x, y, r, c) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(.9)" d="M0 0C-3-2-9-1-12-6C-9-8-8-10-9-15C-5-14-3-16 0-21C3-16 5-14 9-15C8-10 9-8 12-6C9-1 3-2 0 0Z" fill="${c}"/>`;
const duck = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)"><ellipse cx="0" cy="6" rx="26" ry="6" fill="#fff" opacity=".55"/><ellipse cx="0" cy="0" rx="20" ry="11" fill="#b98a55" stroke="#8a6238" stroke-width="2"/>
  <path d="M-6 -2q8 -8 18 0" fill="none" stroke="#8a6238" stroke-width="2"/><circle cx="18" cy="-12" r="9" fill="#3f8f6a" stroke="#2c6e50" stroke-width="2"/><path d="M26 -12l10 2l-10 3z" fill="#f2b134"/><circle cx="20" cy="-14" r="1.8" fill="#1f2a2a"/></g>`;
const flamingo = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="62" rx="24" ry="5" fill="#fff" opacity=".5"/><path d="M-4 16V60M6 16V44L-2 54" fill="none" stroke="#e58aa0" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="6" rx="22" ry="14" fill="#f7a8ba" stroke="#e07f97" stroke-width="2"/><path d="M-8 2q10 -8 22 2" fill="none" stroke="#e07f97" stroke-width="2"/>
  <path d="M16 0C30 -8 30 -24 20 -30C12 -35 12 -46 22 -48" fill="none" stroke="#f7a8ba" stroke-width="8" stroke-linecap="round"/><circle cx="24" cy="-49" r="7" fill="#f7a8ba" stroke="#e07f97" stroke-width="1.6"/>
  <path d="M29 -50l12 4l-9 6z" fill="#3b2d2a"/><path d="M29 -50l6 2l-4 3z" fill="#f6d9c8"/><circle cx="25" cy="-51" r="1.5" fill="#1f2a2a"/></g>`;
const cloud = (x, y, k, o = 1) => `<g transform="translate(${x} ${y}) scale(${k})" fill="#fff" opacity="${o}"><ellipse cx="0" cy="0" rx="60" ry="22"/><ellipse cx="-26" cy="-16" rx="30" ry="22"/><ellipse cx="20" cy="-22" rx="36" ry="27"/></g>`;

let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6ecf8"/><stop offset="1" stop-color="#8fd3ee"/></linearGradient>
  <linearGradient id="land" x1=".1" y1=".95" x2=".9" y2=".05"><stop offset="0" stop-color="#b4e092"/><stop offset=".36" stop-color="#cbe79b"/><stop offset=".55" stop-color="#eee0a6"/><stop offset=".74" stop-color="#e4e6d6"/><stop offset="1" stop-color="#dfe9ee"/></linearGradient>
  <linearGradient id="sand" x1=".1" y1=".95" x2=".9" y2=".05"><stop offset="0" stop-color="#f6e3ae"/><stop offset="1" stop-color="#ece7d8"/></linearGradient>
  <clipPath id="landClip"><path d="${blob(LAND)}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#sea)"/>
<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6">`;
[[90, 150], [1060, 1180], [1130, 90], [60, 1215], [200, 1250], [1010, 60], [30, 720], [1195, 700]].forEach(([x, y]) => { s += `<path d="M${x - 22} ${y}q11 -10 22 0t22 0"/>`; });
s += `</g>
<path d="${blob(SHORE.map(([x, y]) => [612 + (x - 612) * 1.035, 642 + (y - 642) * 1.03]))}" fill="#fff" opacity=".55"/>
<path d="${blob(SHORE)}" fill="url(#sand)" stroke="#e3cf9b" stroke-width="4"/>
<path d="${blob(LAND)}" fill="url(#land)"/>
<g clip-path="url(#landClip)">`;
/* soft patches */
s += `<ellipse cx="330" cy="1000" rx="250" ry="150" fill="#a5d886" opacity=".5"/><ellipse cx="880" cy="1010" rx="230" ry="130" fill="#f1dfa2" opacity=".75"/>
  <ellipse cx="960" cy="330" rx="260" ry="210" fill="#e9f1f4" opacity=".8"/><ellipse cx="330" cy="250" rx="230" ry="150" fill="#e3ecec" opacity=".55"/>
  <ellipse cx="640" cy="640" rx="330" ry="130" fill="#f0d99a" opacity=".45" transform="rotate(-28 640 640)"/>`;
/* frost dots in the winter corner, flowers and grass in the summer corner, fallen leaves in the middle */
for (let i = 0; i < 70; i++) { const x = 560 + rnd() * 620, y = 80 + rnd() * 520; if (x + y * 0.9 > 1180) s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.5 + rnd() * 2.5)}" fill="#fff" opacity=".85"/>`; }
for (let i = 0; i < 26; i++) { const x = 90 + rnd() * 380, y = 80 + rnd() * 330; if (x * .8 + y < 520) s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.5 + rnd() * 2.5)}" fill="#fff" opacity=".8"/>`; }
for (let i = 0; i < 26; i++) { const x = 90 + rnd() * 600, y = 700 + rnd() * 480; s += tuft(f(x), f(y)); }
const FL = ['#ffd84a', '#ff9fb2', '#ffffff', '#ffd84a', '#c9a7ea'];
for (let i = 0; i < 30; i++) { const x = 100 + rnd() * 560, y = 760 + rnd() * 420; s += flower(f(x), f(y), FL[i % FL.length]); }
const LC = ['#e39a3b', '#d9763a', '#e8c14a', '#c98a3a'];
for (let i = 0; i < 34; i++) { const t = rnd(), x = 160 + t * 860 + (rnd() - .5) * 150, y = 860 - t * 420 + (rnd() - .5) * 190; s += leaf(f(x), f(y), Math.round(rnd() * 360), LC[i % 4]); }
s += '</g>';
/* pond with the winter visitors */
s += `<g><ellipse cx="262" cy="432" rx="160" ry="92" fill="#e9dcae"/><ellipse cx="262" cy="428" rx="146" ry="80" fill="#a9defa" stroke="#7fc6ea" stroke-width="4"/>
  <path d="M180 410q14 -10 28 0t28 0M290 462q14 -10 28 0t28 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>
  ${duck(215, 455)}${duck(330, 410, true)}${flamingo(292, 372, 1.05)}${flamingo(160, 400, .85)}</g>`;
/* the trail between the stops */
const TR = [[250, 1150], STOPS[0], [560, 1010], STOPS[1], [640, 760], STOPS[2], [600, 540], STOPS[3], [700, 300], STOPS[4], [470, 110]];
s += `<path d="${curve(TR)}" fill="none" stroke="#dcc48a" stroke-width="44" stroke-linecap="round"/><path d="${curve(TR)}" fill="none" stroke="#fbf0cf" stroke-width="34" stroke-linecap="round"/>
  <path d="${curve(TR)}" fill="none" stroke="#e6cf96" stroke-width="5" stroke-linecap="round" stroke-dasharray="4 22"/>`;
STOPS.forEach(([x, y]) => { s += `<ellipse cx="${x}" cy="${y + 6}" rx="62" ry="40" fill="#fbf0cf" stroke="#dcc48a" stroke-width="5"/>`; });
/* trees */
const GREEN = ['#7cc86e', '#4f9f52'], GREEN2 = ['#96d47c', '#5fae58'], ORANGE = ['#f0a94a', '#cf7f2c'], YELLOW = ['#f2cf5a', '#d6a531'], RED = ['#e9895a', '#c5613a'];
s += tree(118, 905, 1.1, GREEN) + tree(455, 1190, .9, GREEN2) + tree(690, 1120, 1.2, GREEN) + tree(205, 1118, .9, GREEN2) + tree(585, 1150, .8, GREEN)
  + tree(150, 690, 1.05, YELLOW) + tree(960, 800, 1.15, ORANGE) + tree(1060, 860, .9, RED) + tree(300, 640, .9, ORANGE) + tree(850, 650, .85, YELLOW)
  + bare(1100, 330, 1) + bare(330, 230, 1) + bare(205, 300, .8) + bare(720, 190, .9) + bare(1118, 690, .8);
/* summer: the luffa in flower on its trellis, and the lizard on its sunny rock */
s += `<g transform="translate(215 985) scale(1.42)"><ellipse cx="0" cy="6" rx="78" ry="12" fill="#000" opacity=".1"/>${A.plant(.5)}</g>`;
s += `<g transform="translate(520 742) scale(1.35)"><ellipse cx="326" cy="230" rx="104" ry="12" fill="#000" opacity=".1"/>${A.rocks()}<g transform="translate(322 155) scale(.82)">${A.lizard({})}</g></g>`;
/* winter: the withered luffa with its seeds, and the lizard in its rock crevice */
s += `<g transform="translate(925 318) scale(1.2)"><ellipse cx="0" cy="6" rx="78" ry="12" fill="#000" opacity=".08"/>${A.plant(.99)}</g>`;
s += `<g transform="translate(560 318) scale(1.3)"><ellipse cx="326" cy="230" rx="104" ry="12" fill="#000" opacity=".08"/>${A.rocks()}<g transform="translate(344 224) scale(.4)">${A.lizard({ closed: true })}</g><text x="352" y="186" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">z z</text></g>`;
/* a sprout near the start of the trail */
s += `<g transform="translate(458 915) scale(1.02)"><ellipse cx="0" cy="6" rx="78" ry="12" fill="#000" opacity=".08"/>${A.plant(.2)}</g>`;
/* sun over the summer side, clouds over the winter side */
let rays = ''; for (let a = 0; a < 12; a++) { const an = a * 30 * Math.PI / 180; rays += `M${f(108 + Math.cos(an) * 74)} ${f(1178 + Math.sin(an) * 74)}L${f(108 + Math.cos(an) * 98)} ${f(1178 + Math.sin(an) * 98)}`; }
s += `<path d="${rays}" stroke="#ffd24a" stroke-width="10" stroke-linecap="round"/><circle cx="108" cy="1178" r="60" fill="#ffd24a" stroke="#f2b134" stroke-width="5"/>
  ${cloud(1085, 118, 1.15, .95)}${cloud(930, 70, .7, .85)}${cloud(1150, 250, .6, .8)}`;
s += '</svg>';
s = s.replace(/\n\s+/g, '\n');
fs.writeFileSync(path.join(ROOT, 'assets', 'map_ch2.svg'), s);
console.log('map', (s.length / 1024).toFixed(1) + ' KB');

/* background for the game and question pages (sits under a light veil) */
seed = 11;
let b = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe7f8"/><stop offset=".55" stop-color="#e9f6f4"/><stop offset=".56" stop-color="#f6e6b6"/><stop offset="1" stop-color="#f1d79a"/></linearGradient></defs>
<rect width="1600" height="1000" fill="url(#g)"/>
<circle cx="1330" cy="170" r="92" fill="#ffe08a"/><circle cx="1330" cy="170" r="130" fill="#ffe08a" opacity=".3"/>
${cloud(260, 170, 1.5, .9)}${cloud(820, 110, 1.1, .8)}${cloud(1100, 300, .9, .7)}
<path d="M0 560C200 500 420 530 640 520C900 508 1200 470 1600 530V1000H0Z" fill="#f3dfa8"/>
<path d="M0 640C260 600 520 660 820 630C1100 604 1360 620 1600 600V1000H0Z" fill="#f7e8bd"/>
<path d="M0 800C300 770 620 820 900 790C1180 762 1400 790 1600 780V1000H0Z" fill="#efd392" opacity=".8"/>`;
for (let i = 0; i < 14; i++) { const x = 40 + rnd() * 1520, y = 660 + rnd() * 300; b += tuft(f(x), f(y)); }
for (let i = 0; i < 16; i++) { const x = 40 + rnd() * 1520, y = 640 + rnd() * 320; b += leaf(f(x), f(y), Math.round(rnd() * 360), ['#e39a3b', '#8fcf7a', '#e8c14a', '#6fb46a'][i % 4]); }
b += `${tree(120, 640, 1.5, GREEN)}${tree(1480, 660, 1.4, ORANGE)}${tree(1380, 600, 1, YELLOW)}${tree(240, 600, 1, GREEN2)}</svg>`;
b = b.replace(/\n\s+/g, '\n');
fs.writeFileSync(path.join(ROOT, 'assets', 'bg_ch2.svg'), b);
console.log('bg', (b.length / 1024).toFixed(1) + ' KB');
