/* Science Island · Chapter 2 "Changes in the Seasons" · drawings made in code (SVG).
   Shared by the chapter's game (seasons.html) and by the tap pictures of the question pages (quiz.html).
   Everything is driven by one number, u = the place in the year (0 → 1):
     0 cold winter, seeds in the soil → 0.2 getting warmer, seeds sprout → 0.5 summer, hottest: tall stems, wide leaves, flowers
     → 0.65 the fruit grows → 0.8 getting colder, the fruit turns brown → 1 cold winter: the plant has withered and left its seeds.
   temp(u) is the temperature (0 cold … 1 hot). The lizard is active when it is high, slow when it is low,
   and stays still in the rock crevice (hibernation) when it is cold.
   window.CH_DIAGRAMS adds this chapter's tap pictures: plantYear, lizardSummer, lizardWinter. */
(function () {
  'use strict';
  const T = (en, ar) => (window.SI ? window.SI.T(en, ar) : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); t = clamp(t, 0, 1); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
  const mix3 = (a, b, c, t) => (t < .5 ? mix(a, b, t * 2) : mix(b, c, (t - .5) * 2));
  let uid = 0;

  const temp = u => Math.sin(Math.PI * clamp(u, 0, 1));
  const COLD = 0.34;                                   // below this the lizard hibernates
  const season = u => { const t = temp(u); return t < COLD ? 'cold' : t > 0.8 ? 'hot' : (u < 0.5 ? 'warming' : 'cooling'); };

  /* smooth open curve through points */
  function curve(pts) {
    if (pts.length < 2) return '';
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d;
  }
  /* the first part (0…1) of a list of points */
  function partial(nodes, g) {
    const pos = clamp(g, 0, 1) * (nodes.length - 1), k = Math.floor(pos), fr = pos - k, out = nodes.slice(0, k + 1);
    if (fr > 0.02 && k + 1 < nodes.length) out.push([lerp(nodes[k][0], nodes[k + 1][0], fr), lerp(nodes[k][1], nodes[k + 1][1], fr)]);
    return out;
  }

  /* ---------- the luffa on its trellis. Origin: soil level under the plant; the plant grows up to y = -155 ---------- */
  const STEM = [[0, 0], [-10, -18], [8, -38], [-12, -58], [10, -78], [-8, -98], [12, -118], [-4, -138], [6, -152]];
  const BR1 = [[-12, -58], [-28, -64], [-40, -78], [-46, -100]], BR2 = [[10, -78], [26, -84], [40, -104], [46, -128]];
  const LEAVES = [
    { p: [-10, -18], r: -62, s: .78, t: .12 }, { p: [8, -38], r: 58, s: .92, t: .25 }, { p: [-12, -58], r: -48, s: 1.02, t: .37 },
    { p: [10, -78], r: 62, s: 1.08, t: .5 }, { p: [-8, -98], r: -56, s: 1.04, t: .62 }, { p: [12, -118], r: 52, s: 1, t: .74 },
    { p: [-4, -138], r: -42, s: .9, t: .86 }, { p: [-40, -78], r: -84, s: 1, t: .62 }, { p: [-46, -100], r: -28, s: .9, t: .8 },
    { p: [40, -104], r: 78, s: 1, t: .76 }, { p: [46, -128], r: 26, s: .9, t: .92 }, { p: [6, -152], r: 8, s: .8, t: .97 }
  ];
  const FLOWERS = [[22, -66], [-24, -112], [28, -136], [-32, -48], [-2, -124]];
  const FRUITS = [{ p: [27, -94], len: 46 }, { p: [-31, -88], len: 40 }];
  const SEED0 = [[0, 3], [-9, 5], [8, 5]], SEED1 = [[16, 3], [24, 6], [31, 2], [38, 6], [9, 7], [-24, 4], [-33, 7], [-16, 7]];
  const LEAF = 'M0 0C-3-2-9-1-12-6C-9-8-8-10-9-15C-5-14-3-16 0-21C3-16 5-14 9-15C8-10 9-8 12-6C9-1 3-2 0 0Z';

  function plant(u) {
    u = clamp(u, 0, 1);
    const id = 'c2clip' + (++uid);
    const g = clamp((u - .08) / .36, 0, 1);                         // how far the vine has climbed
    const flower = sstep(.38, .48, u) * (1 - sstep(.6, .7, u));
    const fruit = sstep(.5, .68, u);
    const brown = sstep(.7, .88, u);
    const wilt = sstep(.8, .97, u);
    const vineCol = mix('#4c9a4f', '#8f7448', sstep(.74, .92, u)), leafCol = mix3('#55b360', '#cdb34c', '#9a7446', brown), leafDark = mix3('#3c8f48', '#a8903a', '#7a5a36', brown);
    let s = '';
    /* trellis */
    s += `<clipPath id="${id}"><rect x="-58" y="-150" width="116" height="154"/></clipPath>
      <g clip-path="url(#${id})" stroke="#d9bd8d" stroke-width="2.6" fill="none">`;
    for (let k = -6; k <= 6; k++) s += `<path d="M${k * 30 - 90} 4L${k * 30 + 70} -156M${k * 30 + 90} 4L${k * 30 - 70} -156"/>`;
    s += `</g><g stroke="#b08a57" stroke-width="5" stroke-linecap="round" fill="none"><path d="M-58 5V-152M58 5V-152"/><path d="M-63 -148H63M-63 -12H63" stroke-width="4.2"/></g>`;
    /* seeds planted in the soil (start of the year) */
    const s0 = 1 - sstep(.1, .2, u);
    if (s0 > .01) s += `<g opacity="${f1(s0)}">${SEED0.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.3" transform="rotate(${i * 40 - 30} ${x} ${y})" fill="#2e2823"/>`).join('')}</g>`;
    /* vine */
    if (g > 0) {
      const w = lerp(3.4, 2.4, wilt);
      s += `<g fill="none" stroke="${vineCol}" stroke-width="${f1(w)}" stroke-linecap="round" stroke-linejoin="round">
        <path d="${curve(partial(STEM, g))}"/>`;
      if (g > .4) s += `<path d="${curve(partial(BR1, clamp((g - .4) / .45, 0, 1)))}" stroke-width="${f1(w * .8)}"/>`;
      if (g > .52) s += `<path d="${curve(partial(BR2, clamp((g - .52) / .45, 0, 1)))}" stroke-width="${f1(w * .8)}"/>`;
      s += '</g>';
      /* the two first small leaves of the sprout */
      const cot = sstep(.08, .15, u) * (1 - sstep(.3, .5, u));
      if (cot > .02) {
        const tip = partial(STEM, Math.min(g, .11)).pop();
        s += `<g transform="translate(${f1(tip[0])} ${f1(tip[1])}) scale(${f1(cot * 1.35)})" fill="#7ccf73" stroke="#3c8f48" stroke-width="1.1">
          <ellipse cx="-8" cy="-4" rx="8.5" ry="4.6" transform="rotate(-24 -8 -4)"/><ellipse cx="8" cy="-4" rx="8.5" ry="4.6" transform="rotate(24 8 -4)"/></g>`;
      }
    }
    /* leaves */
    LEAVES.forEach((L, i) => {
      const open = sstep(L.t, Math.min(1.08, L.t + .16), g) * sstep(.14, .3, u);
      if (open < .03) return;
      const gone = (i % 3 === 1) ? sstep(.45, 1, wilt) : 0;
      const sc = L.s * open * lerp(1, .62, wilt), rot = lerp(L.r, L.r < 0 ? -158 : 158, wilt);
      s += `<g transform="translate(${L.p[0]} ${L.p[1]}) rotate(${f1(rot)}) scale(${f1(sc * 1.25)})" opacity="${f1(1 - gone)}">
        <path d="${LEAF}" fill="${leafCol}" stroke="${leafDark}" stroke-width="1"/><path d="M0-1V-16M0-8L-6-11M0-8L6-11" stroke="${leafDark}" stroke-width=".9" fill="none" stroke-linecap="round"/></g>`;
    });
    /* fruits hang in front of the leaves */
    if (fruit > .02) FRUITS.forEach((F, i) => {
      const k = lerp(.22, 1, fruit) * (i ? .9 : 1), len = F.len * k, rx = 8.6 * k, col = mix('#86c96e', '#c59a58', brown), dk = mix('#5c9e4d', '#96713c', brown);
      const x = F.p[0], y = F.p[1];
      s += `<g><path d="M${x} ${y}v${f1(6 * k)}" stroke="${vineCol}" stroke-width="2.2" stroke-linecap="round"/>
        <rect x="${f1(x - rx)}" y="${f1(y + 5 * k)}" width="${f1(rx * 2)}" height="${f1(len)}" rx="${f1(rx)}" fill="${col}" stroke="${dk}" stroke-width="1.6"/>
        <path d="M${f1(x - rx * .35)} ${f1(y + 11 * k)}v${f1(len - 12 * k)}M${f1(x + rx * .4)} ${f1(y + 11 * k)}v${f1(len - 12 * k)}" stroke="${dk}" stroke-width="1" opacity=".55" stroke-linecap="round"/>`;
      const hole = sstep(.5, .95, brown);
      if (!i && hole > .02) s += `<g opacity="${f1(hole)}"><ellipse cx="${x}" cy="${f1(y + len * .68)}" rx="${f1(rx * .66)}" ry="${f1(len * .2)}" fill="#6b5234"/>
        ${[[-1.6, -3], [1.8, -.5], [-1.2, 2.6], [1.4, 4.6]].map(([dx, dy]) => `<ellipse cx="${f1(x + dx)}" cy="${f1(y + len * .68 + dy)}" rx="2" ry="1.5" fill="#211d1a"/>`).join('')}</g>`;
      s += '</g>';
    });
    /* flowers */
    if (flower > .02) FLOWERS.forEach(([x, y], i) => {
      const k = clamp(flower * 1.25 - i * .05, 0, 1); if (k <= 0) return;
      let pet = ''; for (let a = 0; a < 5; a++) { const an = a * 72 * Math.PI / 180; pet += `<circle cx="${f1(Math.sin(an) * 5.4)}" cy="${f1(-Math.cos(an) * 5.4)}" r="4.5"/>`; }
      s += `<g transform="translate(${x} ${y}) scale(${f1(k)})"><g fill="#ffd84a" stroke="#e2b420" stroke-width="1">${pet}</g><circle r="3.3" fill="#f0992b"/></g>`;
    });
    /* seeds left on the ground for the next generation */
    const s1 = sstep(.86, .97, u);
    if (s1 > .01) s += `<g opacity="${f1(s1)}">${SEED1.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.2" transform="rotate(${i * 50 - 40} ${x} ${y})" fill="#2e2823"/>`).join('')}</g>`;
    return s;
  }

  /* ---------- the lizard (side view, looking right). Origin: under its feet, in the middle ---------- */
  function lizard(o = {}) {
    const body = '#c9a56a', dark = '#94713f', belly = '#ecdcb4', step = o.step ? 1 : 0;
    const leg = (pts, far) => `<path d="${pts}" fill="none" stroke="${far ? dark : body}" stroke-width="${far ? 4.4 : 5}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const legsFar = step ? leg('M-9 -8L-15 -1L-9 0', 1) + leg('M19 -9L24 -2L30 -1', 1) : leg('M-11 -8L-5 -1L1 0', 1) + leg('M17 -9L12 -2L18 -1', 1);
    const legsNear = step ? leg('M-15 -8L-9 -1L-3 0') + leg('M13 -9L8 -2L14 -1') : leg('M-13 -8L-20 -1L-14 0') + leg('M15 -9L21 -2L27 -1');
    const eye = o.closed ? `<path d="M30.6 -15.4Q33 -13.4 35.4 -15.4" fill="none" stroke="#3b2d1c" stroke-width="1.4" stroke-linecap="round"/>`
      : `<circle cx="33" cy="-15.6" r="2.7" fill="#fff" stroke="${dark}" stroke-width=".8"/><circle cx="33.7" cy="-15.6" r="1.4" fill="#2b2118"/>`;
    return `${legsFar}
      <path d="M-18 -17C-34 -17-50 -11-66 -1C-50 -5-34 -6-18 -6Z" fill="${body}" stroke="${dark}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M-28 -15.4l-1 8.6M-36 -13.4l-1.2 7.2M-44 -10.6l-1.2 5.4M-52 -7.4l-1 3.6" stroke="${dark}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>
      <ellipse cx="0" cy="-12" rx="23" ry="8.6" fill="${body}" stroke="${dark}" stroke-width="1.4"/>
      <ellipse cx="1" cy="-8.6" rx="18" ry="3.6" fill="${belly}" opacity=".85"/>
      <path d="M17 -18C25 -22 36 -22 42 -16C44.5 -13.5 43 -10 39 -9C31 -7 23 -7 17 -8Z" fill="${body}" stroke="${dark}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M43 -13.4Q39 -12 35 -12" fill="none" stroke="${dark}" stroke-width="1" stroke-linecap="round"/>
      <g fill="${dark}" opacity=".5"><ellipse cx="-12" cy="-16" rx="3" ry="1.8"/><ellipse cx="-2" cy="-17.4" rx="3" ry="1.8"/><ellipse cx="8" cy="-16.6" rx="3" ry="1.8"/><ellipse cx="-7" cy="-12.6" rx="2.4" ry="1.4"/><ellipse cx="4" cy="-13" rx="2.4" ry="1.4"/></g>
      ${eye}${legsNear}`;
  }

  /* ---------- game scene (viewBox 0 0 420 280) ---------- */
  const GEO = { W: 420, H: 280, ground: 222, plant: [112, 224], run: { y: 155, x1: 294, x2: 352, s: .8 }, sleep: { x: 344, y: 224, s: .4 },
    spots: { rock: [322, 142, 27], crevice: [340, 204, 26], sand: [196, 246, 25] } };

  function back(tm, o = {}) {
    const cold = 1 - sstep(.1, .5, tm), SX = o.sunX || 232;
    const sky = mix('#d3e1ec', '#bfe9fb', tm), sky2 = mix('#eef3f6', '#eafaff', tm), gr = mix('#dbd5c6', '#f3e1b1', tm), gr2 = mix('#c9c3b4', '#e6cf96', tm), far = mix('#c5cfd6', '#f0d9a6', tm);
    const sunY = o.sunY || lerp(96, 44, tm), sunR = lerp(13, 21, tm), sunC = mix('#f6efcf', '#ffd24a', tm);
    let rays = '';
    for (let a = 0; a < 12; a++) { const an = a * 30 * Math.PI / 180, r1 = sunR + 5, r2 = sunR + 5 + 9 * tm; rays += `M${f1(SX + Math.cos(an) * r1)} ${f1(sunY + Math.sin(an) * r1)}L${f1(SX + Math.cos(an) * r2)} ${f1(sunY + Math.sin(an) * r2)}`; }
    const cloud = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})" fill="#fff"><ellipse cx="0" cy="0" rx="26" ry="10"/><ellipse cx="-12" cy="-7" rx="13" ry="9"/><ellipse cx="8" cy="-9" rx="15" ry="11"/></g>`;
    let frost = '';
    [[40, 236], [66, 252], [150, 262], [190, 240], [236, 262], [268, 246], [396, 250], [352, 266], [96, 266], [300, 268]].forEach(([x, y]) => { frost += `<circle cx="${x}" cy="${y}" r="1.8"/>`; });
    return `<rect width="420" height="280" fill="${sky}"/><rect y="150" width="420" height="80" fill="${sky2}" opacity=".7"/>
      <path d="${rays}" stroke="${sunC}" stroke-width="3" stroke-linecap="round" opacity="${f1(tm)}"/><circle cx="${SX}" cy="${f1(sunY)}" r="${f1(sunR)}" fill="${sunC}"/>
      <g opacity="${f1(.35 + cold * .6)}">${cloud(70, 44, 1)}${cloud(330, 62, .8)}${cold > .3 ? cloud(190, 30, .7) : ''}</g>
      <path d="M0 214C60 196 120 204 190 200C260 196 330 186 420 204V280H0Z" fill="${far}"/>
      <path d="M0 ${GEO.ground}C80 216 180 226 260 220C330 215 380 222 420 218V280H0Z" fill="${gr}"/>
      <path d="M0 250C90 244 200 258 300 250C350 246 390 250 420 248V280H0Z" fill="${gr2}" opacity=".55"/>
      <g fill="#fff" opacity="${f1(cold * .9)}">${frost}</g>
      <rect width="420" height="280" fill="#6f9cc4" opacity="${f1(cold * .13)}"/>`;
  }
  function rocks() {
    return `<path d="M236 227C232 196 240 170 258 158C280 148 360 145 386 152C404 160 412 190 414 227Z" fill="#cdb692" stroke="#8c7655" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M258 158C280 148 360 145 386 152C391 156 388 161 380 162C350 157 290 159 264 165C255 165 253 161 258 158Z" fill="#e3d1af"/>
      <path d="M248 204C258 198 266 200 272 208M384 176C390 182 396 186 402 198M290 176c8 2 12 8 12 16M282 214c8-2 14 0 18 6" fill="none" stroke="#8c7655" stroke-width="1.6" stroke-linecap="round" opacity=".65"/>
      <path d="M316 227C313 205 320 187 334 171C339 182 352 190 358 205C362 213 364 221 364 227Z" fill="#4b3b2e"/>
      <path d="M322 227C321 209 326 196 334 184C339 194 349 201 353 212C356 218 357 223 357 227Z" fill="#33271e"/>
      <path d="M218 229C224 215 242 213 250 228ZM392 229C397 220 412 220 418 229Z" fill="#b89f7c" stroke="#8c7655" stroke-width="1.6" stroke-linejoin="round"/>`;
  }
  function thermo(tm, lab) {
    const h = 96 * clamp(tm, 0, 1), col = mix3('#4c9be8', '#f2a13c', '#e5533d', tm);
    return `<g transform="translate(18 44)"><rect x="-3" y="-8" width="22" height="146" rx="11" fill="#fff" opacity=".86"/>
      <rect x="3" y="0" width="10" height="110" rx="5" fill="#eef3f6" stroke="#9db4c4" stroke-width="1.6"/>
      <rect x="5.2" y="${f1(104 - h)}" width="5.6" height="${f1(h + 14)}" rx="2.8" fill="${col}"/>
      <circle cx="8" cy="120" r="10.5" fill="${col}" stroke="#9db4c4" stroke-width="1.6"/>
      <path d="M14 14h5M14 38h5M14 62h5M14 86h5" stroke="#9db4c4" stroke-width="1.4" stroke-linecap="round"/></g>
      ${lab ? `<text x="26" y="33" text-anchor="middle" font-size="11" font-weight="900" fill="#1f3d57">${lab}</text>` : ''}`;
  }

  /* ---------- tap pictures for the question pages ---------- */
  const hot = (id, label, inner) => `<g class="hot" data-id="${id}" role="button" tabindex="0" aria-label="${label}">${inner}</g>`;
  function plantYear() {
    const P = [['flower', .47, T('A tall plant with flowers', 'نبات طويل عليه أزهار')], ['wither', .99, T('A brown plant with seeds on the ground', 'نبات بُني وبذور على الأرض')],
      ['sprout', .19, T('A small new plant', 'نبات صغير جديد')], ['fruit', .7, T('A plant with green fruit', 'نبات عليه ثمار خضراء')]];
    const at = [[5, 5], [170, 5], [5, 155], [170, 155]];
    let s = '';
    P.forEach(([id, u, label], i) => {
      const [x, y] = at[i], tm = temp(u);
      s += hot(id, label, `<rect x="${x}" y="${y}" width="155" height="140" rx="14" fill="${mix('#dbe6ee', '#d6f1fb', tm)}"/>
        <path d="M${x} ${y + 116}h155v10a14 14 0 0 1-14 14h-127a14 14 0 0 1-14-14z" fill="${mix('#d8d1c1', '#efdcab', tm)}"/>
        <g transform="translate(${x + 77.5} ${y + 121}) scale(.7)">${plant(u)}</g>
        <rect class="ring" x="${x}" y="${y}" width="155" height="140" rx="14"/>`);
    });
    return `<svg class="diagram" viewBox="0 0 330 300" role="img" aria-label="${T('Four pictures of the same plant at different times of the year', 'أربع صور للنبات نفسه في أوقات مختلفة من السنة')}">${s}</svg>`;
  }
  function lizardPlaces(cold) {
    const tm = cold ? .12 : 1, S = GEO.spots;
    const ring = (k, label) => hot(k, label, `<circle class="ring" cx="${S[k][0]}" cy="${S[k][1]}" r="${S[k][2]}"/>`);
    return `<svg class="diagram" viewBox="160 96 260 184" role="img" aria-label="${cold ? T('A cold winter day: a big rock with a crevice, and open sand', 'يوم بارد من أيام الشتاء: صخرة كبيرة فيها شق، ورمال مكشوفة') : T('A hot summer day: a big sunny rock with a crevice, and open sand', 'يوم حار من أيام الصيف: صخرة كبيرة ساخنة فيها شق، ورمال مكشوفة')}">
      ${back(tm, { sunX: 196, sunY: cold ? 140 : 132 })}${rocks()}
      ${ring('rock', T('On top of the rock, in the sun', 'فوق الصخرة تحت أشعة الشمس'))}${ring('crevice', T('Inside the rock crevice', 'داخل شق الصخرة'))}${ring('sand', T('Out on the open sand', 'على الرمال المكشوفة'))}</svg>`;
  }

  window.CH2ART = { temp, season, COLD, plant, lizard, back, rocks, thermo, GEO, mix, sstep };
  window.CH_DIAGRAMS = Object.assign(window.CH_DIAGRAMS || {}, { plantYear, lizardSummer: () => lizardPlaces(false), lizardWinter: () => lizardPlaces(true) });
})();
