/* Science Island · shared helpers: storage, player, chapters, XP levels, daily streak, sounds, Arabic voice, Champions board */
(function () {
  'use strict';
  const HOME = 'index.html', CHAPTERS_PAGE = 'chapters.html';
  const KEY = 'si.v2';
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} },
    update(fn) { const s = this.load(); fn(s); this.save(s); return s; }
  };
  const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  /* ---------- players (several children can share one device) ---------- */
  const players = () => store.load().players || {};
  const player = () => { const s = store.load(); return (s.players || {})[s.current] ? Object.assign({ id: s.current }, s.players[s.current]) : null; };
  function addPlayer(p) {
    const id = rid();
    store.update(s => { s.players = s.players || {}; s.players[id] = { name: p.name, grade: p.grade || 'g5', track: p.track || 'lang' }; s.current = id; });
    return player();
  }
  /* ---------- language: an Arabic-track player sees the site in Arabic, right to left ----------
     T(en, ar) picks the text for the current player; static HTML carries data-ar (inner HTML),
     data-ar-label (aria-label + title) and data-ar-ph (placeholder), swapped in by applyLang(). */
  const isAr = () => ((player() || {}).track === 'ar');
  const T = (en, ar) => (isAr() && ar != null ? ar : en);
  const chTitle = c => (c ? (isAr() && c.titleAr) || c.title : '');
  const RTL_CSS = `
html[dir=rtl] body{font-family:"Cairo","Nunito",system-ui,-apple-system,"Segoe UI",sans-serif}
html[dir=rtl] .opt,html[dir=rtl] .choice,html[dir=rtl] .lvlbox,html[dir=rtl] .ch,html[dir=rtl] .coachCard{text-align:right}
html[dir=rtl] .opt .num{margin-left:0;margin-right:auto}
html[dir=rtl] .story{border-left:0;border-right:6px solid #9fdcc4}
html[dir=rtl] .badge,html[dir=rtl] .colhead,html[dir=rtl] .banner small,html[dir=rtl] .you{text-transform:none;letter-spacing:0}
html[dir=rtl] .float{right:auto;left:10px}
html[dir=rtl] .timer span{right:auto;left:8px}`;
  function applyLang() {
    const h = document.documentElement;
    if (!isAr() || h.hasAttribute('data-bilingual')) return;   // the home page stays bilingual
    h.lang = 'ar'; h.dir = 'rtl'; h.classList.add('ar-track');
    if (!document.getElementById('rtlCss')) { const st = document.createElement('style'); st.id = 'rtlCss'; st.textContent = RTL_CSS; document.head.appendChild(st); }
    document.querySelectorAll('[data-ar]').forEach(e => { e.innerHTML = e.dataset.ar; });
    document.querySelectorAll('[data-ar-label]').forEach(e => { e.setAttribute('aria-label', e.dataset.arLabel); if (e.hasAttribute('title')) e.title = e.dataset.arLabel; });
    document.querySelectorAll('[data-ar-ph]').forEach(e => { e.placeholder = e.dataset.arPh; });
  }
  function usePlayer(id) { store.update(s => { if ((s.players || {})[id]) s.current = id; }); return player(); }
  function requirePlayer() { const p = player(); if (!p || !p.name) { location.href = HOME; return null; } return p; }
  /* per-player progress shared by all chapters: xp, daily streak, the chapter being played (cur) */
  function prof() { const s = store.load(); return ((s.profiles || {})[s.current]) || {}; }
  function updateProf(fn) { store.update(s => { s.profiles = s.profiles || {}; const p = s.profiles[s.current] = s.profiles[s.current] || {}; fn(p); }); return prof(); }

  /* ---------- chapters (the list lives in chapters.js) ----------
     Each chapter keeps its own progress in profile.ch[chapterId]:
     quest and game (best, stars, plays), cards (review schedule), lastVar (last phrasing), dailyLast */
  const chapters = () => window.CHAPTERS || [];
  const chapterById = id => chapters().find(c => c.id === id) || null;
  const chapterId = () => prof().cur || null;
  const chapter = () => chapterById(chapterId());
  function setChapter(id) { if (chapterById(id)) updateProf(p => { p.cur = id; }); return chapter(); }
  /* pages inside a chapter call this; a game page passes its own chapter id */
  function requireChapter(id) {
    if (id) setChapter(id);
    const c = chapter();
    if (!chReady(c)) { location.href = CHAPTERS_PAGE; return null; }
    return c;
  }
  /* open for this player: marked ready, and for the Arabic track it also needs its Arabic questions */
  function chReady(c) { return !!(c && c.ready && (!isAr() || c.questionsAr)); }
  function chProf(id) { id = id || chapterId(); return ((prof().ch || {})[id]) || {}; }
  function updateChProf(fn, id) {
    id = id || chapterId(); if (!id) return {};
    updateProf(p => { p.ch = p.ch || {}; const c = p.ch[id] = p.ch[id] || {}; fn(c); });
    return chProf(id);
  }
  function chapterStars(id) {
    const c = chapterById(id) || {}, p = chProf(id);
    return { got: ((p.quest || {}).stars || 0) + ((p.game || {}).stars || 0), of: c.game ? 6 : 3 };
  }
  function applyTheme() {
    const c = chapter(); if (!c || !c.theme) return;
    Object.keys(c.theme).forEach(k => document.documentElement.style.setProperty('--' + k, c.theme[k]));
  }
  function loadQuestions() {
    const c = chapter();
    return new Promise((res, rej) => {
      const src = c && ((isAr() && c.questionsAr) || c.questions);   // Arabic-track players get the Arabic file
      if (!src) return rej(new Error('This chapter has no questions yet.'));
      window.IDEAS = undefined;
      const el = document.createElement('script'); el.src = src;
      el.onload = () => (Array.isArray(window.IDEAS) ? res(window.IDEAS) : rej(new Error('No questions in ' + src)));
      el.onerror = () => rej(new Error('Could not load ' + src));
      document.head.appendChild(el);
    });
  }
  /* saves made before the site had several chapters all belong to Chapter 1: move them into ch.ch1 */
  (function migrate() {
    const s = store.load(); let changed = false;
    const best = (a, b) => { if (!a) return b; if (!b) return a; return Object.assign({}, a, b, { best: Math.max(a.best || 0, b.best || 0), stars: Math.max(a.stars || 0, b.stars || 0), plays: (a.plays || 0) + (b.plays || 0) }); };
    Object.keys(s.profiles || {}).forEach(k => {
      const p = s.profiles[k];
      if (!p || !(p.quest || p.arm || p.cards || p.lastVar || (p.daily && !p.ch))) return;
      p.ch = p.ch || {}; const c = p.ch.ch1 = p.ch.ch1 || {};
      if (p.quest) c.quest = best(c.quest, p.quest);
      if (p.arm) c.game = best(c.game, p.arm);
      if (p.cards) c.cards = Object.assign(c.cards || {}, p.cards);
      if (p.lastVar) c.lastVar = Object.assign(c.lastVar || {}, p.lastVar);
      if (p.daily && p.daily.last && !c.dailyLast) c.dailyLast = p.daily.last;
      delete p.quest; delete p.arm; delete p.cards; delete p.lastVar;
      if (!p.cur) p.cur = 'ch1';
      changed = true;
    });
    if (changed) store.save(s);
  })();

  /* names: first name or nickname, letters only, simple word filter */
  const BLOCK = ['stupid', 'idiot', 'dumb', 'fuck', 'shit', 'sex', 'kill', 'hate', 'حمار', 'غبي', 'غبية', 'كلب', 'زفت', 'وسخ', 'خول', 'شرموط', 'متخلف', 'حيوان', 'تافه'];
  function checkName(raw) {
    const n = String(raw || '').replace(/\s+/g, ' ').trim();
    if (n.length < 2) return { ok: false, msg: 'Write at least 2 letters.\nاكتب حرفين على الأقل' };
    if (n.length > 14) return { ok: false, msg: 'Use 14 letters or fewer.\nاستخدم 14 حرفًا أو أقل' };
    if (!/^[\p{L}\p{M} ]+$/u.test(n)) return { ok: false, msg: 'Use letters only.\nاستخدم الحروف فقط' };
    const low = n.toLowerCase();
    if (BLOCK.some(w => low.includes(w))) return { ok: false, msg: 'Please choose a kind name.\nاختر اسمًا لطيفًا' };
    return { ok: true, name: n };
  }

  /* ---------- XP and levels ---------- */
  const LEVELS = [[0, 'Bone Rookie'], [300, 'Joint Explorer'], [800, 'Muscle Mover'], [1500, 'Skeleton Pro'], [2500, 'Science Hero'], [4000, 'Island Legend']];
  const LEVELS_AR = ['مبتدئ العظام', 'مستكشف المفاصل', 'محرّك العضلات', 'محترف الهيكل', 'بطل العلوم', 'أسطورة الجزيرة'];
  function levelInfo(xp) {
    let i = 0; LEVELS.forEach((l, k) => { if (xp >= l[0]) i = k; });
    const nxt = LEVELS[i + 1], nm = k => T(LEVELS[k][1], LEVELS_AR[k]);
    return { n: i + 1, title: nm(i), xp, from: LEVELS[i][0], to: nxt ? nxt[0] : null, pct: nxt ? (xp - LEVELS[i][0]) / (nxt[0] - LEVELS[i][0]) : 1, next: nxt ? nm(i + 1) : null };
  }
  const xp = () => prof().xp || 0;
  function addXP(n) { let b = 0, a = 0; updateProf(p => { b = p.xp || 0; p.xp = b + Math.max(0, Math.round(n)); a = p.xp; }); return { before: levelInfo(b), after: levelInfo(a), gained: a - b }; }

  /* ---------- daily challenge streak ----------
     One streak for the player (any chapter's Daily 5 keeps it alive); "done today" is per chapter. */
  const pad = n => String(n).padStart(2, '0');
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const dayDiff = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  function dailyState() {
    const d = prof().daily || {}, t = today();
    const alive = !!d.last && (d.last === t || dayDiff(d.last, t) === 1);
    return { done: chProf().dailyLast === t, streak: alive ? (d.streak || 0) : 0 };
  }
  function completeDaily() {
    let st = 0;
    updateProf(p => { const d = p.daily || {}, t = today(); if (d.last !== t) { d.streak = d.last && dayDiff(d.last, t) === 1 ? (d.streak || 0) + 1 : 1; d.last = t; } p.daily = d; st = d.streak; });
    updateChProf(c => { c.dailyLast = today(); });
    return st;
  }

  /* ---------- week of the Champions board (resets every Saturday) ---------- */
  function weekKey(date = new Date()) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() - ((d.getDay() + 1) % 7));          // back to Saturday
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function weekEndsIn() {
    const now = new Date(), start = new Date(weekKey(now) + 'T00:00:00');
    const end = new Date(start); end.setDate(end.getDate() + 7);
    return end - now;
  }

  /* ---------- sound engine: one AudioContext for the effects and for Koko's voice ---------- */
  const isMuted = () => !!store.load().muted;
  let ac = null, fxOut = null, voiceOut = null, talking = null;
  function audio() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ac = new AC();
      fxOut = ac.createGain(); fxOut.connect(ac.destination);      // effects: levels below are set so that effect + voice never clip
      voiceOut = ac.createGain(); voiceOut.gain.value = .8; voiceOut.connect(ac.destination);
    }
    if (ac.state === 'suspended') { try { const r = ac.resume(); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
    return ac;
  }
  function hush() {
    try { if (talking) talking.stop(); } catch (e) {} talking = null;
    try { Object.keys(els).forEach(id => els[id].pause()); } catch (e) {}
    try { speechSynthesis.cancel(); } catch (e) {}
  }
  const setMuted = v => { store.update(s => { s.muted = !!v; }); if (v) hush(); };

  /* one soft note: quick attack, bell-like decay; options: at (delay), d (length), v (volume),
     type, parts ([multiple, level] overtones), to (slide to this pitch), lp (low-pass cut-off) */
  function note(f, o = {}) {
    if (isMuted()) return;
    try {
      const a = audio(); if (!a) return;
      const d = o.d || .25, t = a.currentTime + (o.at || 0), g = a.createGain();
      const v = o.v || .1;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(v * .03, t + d); g.gain.linearRampToValueAtTime(0, t + d + .03);
      if (o.lp) { const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lp; g.connect(lp); lp.connect(fxOut); } else g.connect(fxOut);
      (o.parts || [[1, 1]]).forEach(([mul, amp]) => {
        const osc = a.createOscillator(), pg = a.createGain();
        osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f * mul, t);
        if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to * mul, t + d);
        pg.gain.value = amp; osc.connect(pg); pg.connect(g); osc.start(t); osc.stop(t + d + .06);
      });
    } catch (e) {}
  }
  const CHIME = [[1, 1], [2, .35], [3, .12]];                 // warm bell: the note plus two quiet overtones
  const SOFT = [[1, 1], [2, .4], [3, .15]];                   // rounder, so low notes still sound on phone speakers
  const sfx = {
    ok() { note(784, { d: .25, v: .16, parts: CHIME }); note(1046.5, { d: .45, v: .18, parts: CHIME, at: .09 }); },                 // G5 up to C6
    bad() { note(329.6, { d: .22, v: .2, parts: SOFT, to: 294 }); note(261.6, { d: .38, v: .2, parts: SOFT, to: 233, at: .17 }); },   // two soft falling notes, no buzzer
    win() { [523.25, 659.25, 784, 1046.5].forEach((f, i) => note(f, { d: .3, v: .14, parts: CHIME, at: i * .1 })); [1046.5, 1318.5, 1568].forEach(f => note(f, { d: .9, v: .06, parts: CHIME, at: .42 })); },
    tick() { note(1400, { d: .06, v: .1 }); },
    beep() { note(988, { d: .12, v: .13, parts: [[1, 1], [2, .2]] }); },
    boss() { note(110, { d: .5, v: .3, to: 55 }); [146.83, 174.61, 220, 293.66].forEach((f, i) => note(f, { d: .32, v: .13, type: 'sawtooth', lp: 900, at: .05 + i * .15 })); },
    level() { [523.25, 659.25, 784].forEach((f, i) => note(f, { d: .18, v: .14, parts: CHIME, at: i * .09 })); [1046.5, 1318.5, 1568].forEach(f => note(f, { d: .8, v: .07, parts: CHIME, at: .3 })); }
  };

  /* ---------- Koko's Arabic voice ----------
     Recorded clips live in assets/voice/<id>.mp3 and play through the same AudioContext as the
     effects, so one tap unlocks them all (phones block sound that does not follow a tap).
     A clip that is missing falls back to the device's Arabic text-to-speech, or stays silent.
     The rating clips (rate, better, thanks) are only ever played in Koko's own recorded voice. */
  const VOICE = {
    ok: ['ok1', 'ok2', 'ok3', 'ok4', 'ok5', 'ok6', 'ok7', 'ok8'], bad: ['bad1', 'bad2', 'bad3', 'bad4'], streak: ['streak'], boss: ['boss'],
    box: ['box'], finish: ['finish'], hello: ['hello'], level: ['level'], champion: ['champion'],
    rate: ['rate'], better: ['better'], thanks: ['thanks']
  };
  const VOICE_TEXT = {
    ok1: 'رائع!', ok2: 'ممتاز!', ok3: 'أحسنت!', ok4: 'عظيم!', ok5: 'برافو عليك!', ok6: 'يا سلام عليك!', ok7: 'شاطر!', ok8: 'كده تمام!',
    bad1: 'حاول مرة تانية', bad2: 'قربت! جرّب تاني', bad3: 'ولا يهمك، جرّب تاني', bad4: 'فكّر تاني براحتك',
    streak: 'ما شاء الله! إنت نار!', boss: 'استعد للتحدي الكبير!', box: 'مفاجأة!',
    finish: 'أحسنت يا بطل! خلّصت المهمة', hello: 'أهلًا يا بطل!', level: 'مبروك! طلعت مستوى جديد', champion: 'إنت من الأبطال!',
    rate: 'استنى يا بطل! قولّي رأيك في اللعبة', better: 'ولا يهمك! قولّي نضيف إيه علشان تبقى أحلى؟', thanks: 'شكرًا يا بطل! رأيك مهم عندي'
  };
  const NO_ROBOT = { rate: 1, better: 1, thanks: 1 };            // silent until the recorded clip is uploaded
  const LEAD = { finish: .45, box: .45, level: .35, boss: .7, rate: .3, thanks: .3 };   // seconds Koko waits so the effect is heard first (default .12)
  const ALL_CLIPS = Object.keys(VOICE_TEXT);
  const raw = {}, decoded = {}, bufs = {}, els = {}, missing = {}, lastId = {};
  let noFetch = location.protocol === 'file:', lastVoiceAt = 0;
  function arabicVoice() {
    try { return (speechSynthesis.getVoices() || []).find(v => /^ar/i.test(v.lang)) || null; } catch (e) { return null; }
  }
  try { speechSynthesis && speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', arabicVoice); } catch (e) {}
  const robot = id => { if (!NO_ROBOT[id]) speak(VOICE_TEXT[id]); };
  function speak(text) {
    try {
      const v = arabicVoice(); if (!v || !text) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = 1.05; u.pitch = 1.5; u.volume = 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function fetchClip(id) {
    if (noFetch) return Promise.resolve(null);
    return raw[id] || (raw[id] = fetch(`assets/voice/${id}.mp3`).then(
      r => { if (!r.ok) { missing[id] = true; return null; } return r.arrayBuffer(); },
      () => { noFetch = true; return null; }));               // page opened from a file, or offline: use <audio> instead
  }
  function clip(id) {
    if (bufs[id]) return Promise.resolve(bufs[id]);
    return fetchClip(id).then(data => {
      const a = audio(); if (!data || !a) return null;
      return decoded[id] || (decoded[id] = new Promise(res => {
        try { const p = a.decodeAudioData(data, b => res(bufs[id] = b), () => { missing[id] = true; res(null); }); if (p && p.catch) p.catch(() => {}); }
        catch (e) { missing[id] = true; res(null); }
      }));
    });
  }
  function playBuffer(buf, lead, asked) {
    const a = audio(); if (!a) return;
    const go = () => {
      if (isMuted() || Date.now() - asked > 1500) return;      // too late to make sense
      try { if (talking) talking.stop(); } catch (e) {}
      const s = a.createBufferSource(); s.buffer = buf; s.connect(voiceOut);
      s.onended = () => { if (talking === s) talking = null; };
      s.start(a.currentTime + lead); talking = s;
    };
    if (a.state === 'running') return go();
    try { const r = a.resume(); if (r && r.then) r.then(go, () => {}); else go(); } catch (e) {}
  }
  function playElement(id) {
    let a = els[id];
    if (!a) { a = els[id] = new Audio(`assets/voice/${id}.mp3`); a.preload = 'auto'; a.addEventListener('error', () => { missing[id] = true; }); }
    try { a.currentTime = 0; } catch (e) {}
    const p = a.play();
    if (p && p.catch) p.catch(e => { if (e && e.name === 'NotAllowedError') return; missing[id] = true; robot(id); });
  }
  function pick(kind) {                                        // never the same phrase twice in a row
    const list = VOICE[kind]; let id;
    do { id = list[Math.floor(Math.random() * list.length)]; } while (list.length > 1 && id === lastId[kind]);
    return (lastId[kind] = id);
  }
  function voice(kind) {
    if (isMuted() || !VOICE[kind]) return;
    const now = Date.now(); if (now - lastVoiceAt < 700) return; lastVoiceAt = now;   // never talk over itself
    const id = pick(kind), lead = LEAD[kind] || .12;
    if (missing[id]) return robot(id);
    if (noFetch) return playElement(id);
    audio();                                                   // unlock inside the tap
    clip(id).then(buf => {
      if (buf) return playBuffer(buf, lead, now);
      if (Date.now() - now > 1500 || isMuted()) return;
      if (missing[id]) return robot(id);
      playElement(id);
    });
  }
  /* fetch the clips while the page is idle, decode them on the first tap or key press */
  window.addEventListener('load', () => setTimeout(() => ALL_CLIPS.forEach(fetchClip), 400));
  const prime = () => { if (!isMuted() && audio()) ALL_CLIPS.forEach(clip); };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, prime, { once: true, passive: true, capture: true }));

  /* ---------- Champions board: Firebase when configured, this device otherwise ---------- */
  const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const LB = {
    _db: undefined, _fs: null, base: FB,
    async ready() {
      if (this._db !== undefined) return this._db;
      const cfg = window.FIREBASE_CONFIG;
      if (!cfg || !cfg.projectId) return (this._db = null);
      try {
        const app = await import(FB + 'firebase-app.js'), fs = await import(FB + 'firebase-firestore.js');
        this._fs = fs; this._db = fs.getFirestore(app.initializeApp(cfg));
      } catch (e) { console.warn('Champions board is offline:', e); this._db = null; }
      return this._db;
    },
    board() { const p = player() || {}; return `${p.grade || 'g5'}-${p.track || 'lang'}-${chapterId() || 'ch1'}-${weekKey()}`; },   // one board per chapter
    localRows() {
      const b = (store.load().board || {})[this.board()] || {};
      return Object.entries(b).map(([id, v]) => Object.assign({ id }, v)).sort((a, c) => c.score - a.score);
    },
    async submit(score) {
      const p = player(); if (!p || !p.name) return { saved: false };
      score = Math.round(score);
      store.update(s => {
        s.board = s.board || {}; const k = this.board(), b = s.board[k] = s.board[k] || {};
        if (!b[p.id] || b[p.id].score < score) b[p.id] = { name: p.name, score };
      });
      const db = await this.ready(); if (!db) return { saved: true, online: false };
      const fs = this._fs, ref = fs.doc(db, 'boards', this.board(), 'scores', p.id);
      try {
        const snap = await fs.getDoc(ref);
        if (!snap.exists() || snap.data().score < score) await fs.setDoc(ref, { name: p.name, score, at: fs.serverTimestamp() });
        return { saved: true, online: true };
      } catch (e) { console.warn(e); return { saved: true, online: false }; }
    },
    async top(n = 10) {
      const db = await this.ready();
      if (db) {
        try {
          const fs = this._fs, q = fs.query(fs.collection(db, 'boards', this.board(), 'scores'), fs.orderBy('score', 'desc'), fs.limit(n));
          const ss = await fs.getDocs(q);
          return { online: true, rows: ss.docs.map(d => Object.assign({ id: d.id }, d.data())) };
        } catch (e) { console.warn(e); }
      }
      return { online: false, rows: this.localRows().slice(0, n) };
    },
    async me() {
      const p = player(); if (!p) return null;
      const db = await this.ready();
      if (db) {
        try {
          const fs = this._fs, col = fs.collection(db, 'boards', this.board(), 'scores');
          const snap = await fs.getDoc(fs.doc(col, p.id)); if (!snap.exists()) return null;
          const score = snap.data().score;
          const c = await fs.getCountFromServer(fs.query(col, fs.where('score', '>', score)));
          return { score, rank: c.data().count + 1, online: true };
        } catch (e) { console.warn(e); }
      }
      const rows = this.localRows(), i = rows.findIndex(r => r.id === p.id);
      return i < 0 ? null : { score: rows[i].score, rank: i + 1, online: false };
    }
  };

  /* ---------- small UI helpers ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  ['wave', 'think', 'celebrate', 'thumbs', 'sad', 'point'].forEach(p => { const i = new Image(); i.src = `assets/parrot_${p}.png`; });

  /* ---------- visitor statistics (Google Analytics 4) ----------
     Counts page views with approximate location only. No player names are sent, and the data
     is not used for advertising. Runs on the published site only, not on local copies. */
  const GA_ID = 'G-XP595P45PX';
  const PAGE_NAMES = { 'index.html': 'Home', 'chapters.html': 'Chapters', 'map.html': 'Island map', 'arm.html': 'Arm Mechanic', 'champions.html': 'Champions', 'contact.html': 'Contact', 'reviews.html': 'Owner page',
    'quiz.html': 'Chapter Quest', 'quiz.html#quest': 'Chapter Quest', 'quiz.html#daily': 'Daily 5', 'quiz.html#review': 'Review' };
  function pageName() {
    const file = location.pathname.split('/').pop() || 'index.html';
    return PAGE_NAMES[file + location.hash] || PAGE_NAMES[file] || document.title;
  }
  try {
    if (GA_ID && location.protocol === 'https:' && !/^(localhost|127\.)/.test(location.hostname)) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { page_title: pageName(), allow_google_signals: false, allow_ad_personalization_signals: false });
      const g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
      document.head.appendChild(g);
    }
  } catch (e) {}

  /* ---------- "How was it?" : Koko asks for a rating, once per chapter ----------
     Shown when the player leaves a results screen or leaves the chapter map (a browser cannot
     show a page of ours at the moment its tab is closed, so we ask at these moments instead).
     Koko asks out loud (voice clips rate / better / thanks). The child picks one face and may add
     one line in Arabic or English. A low rating (1 or 2) always asks what to add or change: quick
     choices plus the line, and it is not sent without one of them. Skipping counts as asked.
     Answers go to Firestore `feedback/{random id}`: players can only write; the owner reads them,
     signed in, on reviews.html. An answer that could not be sent waits on the device (`fb` in the
     save) and is sent the next time a page opens. */
  const RATE_CHOICES = [
    { v: 1, face: '😕', en: 'Not fun', ar: 'مش ممتع', mood: 'sad', say: 'No worries! Tell me what to add.', sayAr: 'ولا يهمك! قولّي نضيف إيه؟' },
    { v: 2, face: '😐', en: 'It’s OK', ar: 'عادي', mood: 'think', say: 'Thanks! How can I make it better?', sayAr: 'شكرًا! أخليها أحلى إزاي؟' },
    { v: 3, face: '😊', en: 'I liked it', ar: 'أعجبني', mood: 'thumbs', say: 'Yay! Thank you!', sayAr: 'شكرًا ليك!' },
    { v: 4, face: '😍', en: 'Lovely', ar: 'جميل', mood: 'thumbs', say: 'That makes me so happy!', sayAr: 'فرّحتني أوي!' },
    { v: 5, face: '🤩', en: 'Amazing', ar: 'رائع', mood: 'celebrate', say: 'Woohoo! High five!', sayAr: 'يا سلام! كفّك!' }
  ];
  const RATE_WANTS = [                                              // quick answers to "what should Koko add or change?"
    { k: 'games', i: '🎮', en: 'More games', ar: 'ألعاب أكتر' },
    { k: 'easier', i: '🙂', en: 'Easier questions', ar: 'أسئلة أسهل' },
    { k: 'harder', i: '💪', en: 'Harder questions', ar: 'أسئلة أصعب' },
    { k: 'time', i: '⏱️', en: 'More time', ar: 'وقت أطول' },
    { k: 'sound', i: '🔊', en: 'Better sounds', ar: 'أصوات أحلى' },
    { k: 'pictures', i: '🖼️', en: 'More pictures', ar: 'صور أكتر' }
  ];
  const RATE_LOW = 2;                                               // 1 and 2 are the low ratings
  const RATE_TEXT_MAX = 120;
  const RATE_CSS = `
.rt-ov{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;overscroll-behavior:contain;
  padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));
  background:rgba(31,61,87,.42);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:rt-fade .2s;
  font-family:"Nunito","Cairo",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1f3d57}
.rt-ov *{box-sizing:border-box}
.rt-ov [hidden]{display:none!important}
.rt-p{background:#fff8ea;border-radius:28px;padding:18px 20px;width:100%;max-width:470px;max-height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;
  overscroll-behavior:contain;text-align:center;box-shadow:0 14px 40px rgba(31,61,87,.35);animation:rt-pop .28s cubic-bezier(.2,1.3,.5,1)}
.rt-ar{display:block;direction:rtl;unicode-bidi:isolate;font-family:"Cairo","Nunito",system-ui,sans-serif}
.rt-head{display:flex;align-items:flex-end;gap:10px;text-align:left}
.rt-head img{height:104px;width:auto;flex:none;transition:transform .2s}
.rt-head img.rt-hop{animation:rt-hop .45s}
.rt-bub{flex:1;min-width:0;background:#fff;border:3px solid #cfe3ee;border-radius:20px;padding:10px 14px;font-weight:800;font-size:16.5px;line-height:1.35}
.rt-bub b{font-weight:900}
.rt-bub .rt-ar{font-size:15.5px;text-align:right;color:#3a5c75}
.rt-q{margin:12px 0 8px;font-size:21px;font-weight:900;line-height:1.25}
.rt-q .rt-ar{font-size:18px;color:#3a5c75;text-align:center}
.rt-faces{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.rt-face{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:2px;font:inherit;color:inherit;cursor:pointer;min-width:0;
  background:#fff;border:3px solid #cfe3ee;border-radius:16px;padding:8px 2px 7px;transition:transform .12s,border-color .12s,background .12s}
.rt-face i{font-style:normal;font-size:32px;line-height:1.15}
.rt-face span{font-size:12.5px;font-weight:900;line-height:1.2;overflow-wrap:anywhere}
.rt-face .rt-ar{font-size:13px;font-weight:800;color:#3a5c75}
.rt-face:hover{border-color:var(--primary,#23799f)}
.rt-face:focus-visible,.rt-in:focus-visible,.rt-btn:focus-visible,.rt-skip:focus-visible{outline:3px solid #f7b267;outline-offset:2px}
.rt-face[aria-pressed="true"]{border-color:var(--primary,#23799f);background:#e3f1f7;transform:translateY(-3px) scale(1.04);box-shadow:0 5px 0 var(--primary,#23799f)}
.rt-face[aria-pressed="true"] i{animation:rt-hop .45s}
.rt-lab{display:block;margin:14px 2px 5px;font-size:14.5px;font-weight:800;text-align:left;color:#3a5c75}
.rt-lab .rt-ar{text-align:right;font-size:14px}
.rt-in{display:block;width:100%;font:inherit;font-size:17px;font-weight:700;color:#1f3d57;background:#fff;border:3px solid #cfe3ee;border-radius:14px;padding:10px 14px}
.rt-in:focus{outline:none;border-color:var(--primary,#23799f)}
.rt-note{margin:5px 2px 0;font-size:12px;font-weight:700;color:#5d7a8f;text-align:left;line-height:1.3}
.rt-note .rt-ar{text-align:right}
.rt-wants{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.rt-want{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:0;min-height:58px;font:inherit;color:inherit;cursor:pointer;
  background:#fff;border:3px solid #cfe3ee;border-radius:14px;padding:6px 3px;font-size:12.5px;font-weight:900;line-height:1.2;transition:border-color .12s,background .12s}
.rt-want .rt-ar{font-size:13px;font-weight:800;color:#3a5c75}
.rt-want:hover{border-color:var(--primary,#23799f)}
.rt-want:focus-visible{outline:3px solid #f7b267;outline-offset:2px}
.rt-want[aria-pressed="true"]{border-color:var(--primary,#23799f);background:#e3f1f7;box-shadow:inset 0 0 0 1px var(--primary,#23799f)}
.rt-more.rt-nudge .rt-want{animation:rt-nudge .5s}
.rt-low .rt-head img{height:70px}
.rt-low .rt-q{font-size:18px;margin:8px 0 6px}.rt-low .rt-q .rt-ar{font-size:16px}
.rt-low .rt-lab{margin-top:9px}
/* the buttons stay in view while the pop-up scrolls inside itself */
.rt-acts{display:flex;flex-direction:column;align-items:center;gap:4px;position:sticky;bottom:-18px;z-index:1;
  margin:6px -20px -18px;padding:10px 20px 18px;background:linear-gradient(rgba(255,248,234,0),#fff8ea 10px)}
.rt-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-weight:900;font-size:19px;border:0;border-radius:16px;padding:11px 30px;min-height:52px;min-width:200px;cursor:pointer;
  background:var(--primary,#23799f);color:#fff;box-shadow:0 4px 0 var(--primary-d,#1b6182);transition:transform .08s}
.rt-btn:active{transform:translateY(2px);box-shadow:0 2px 0 var(--primary-d,#1b6182)}
.rt-btn:disabled{opacity:.45;cursor:default}
.rt-skip{font:inherit;font-size:15px;font-weight:800;color:#3a5c75;background:none;border:0;padding:9px 14px;min-height:40px;cursor:pointer;text-decoration:underline}
.rt-done{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 0 4px}
.rt-done img{height:150px;animation:rt-hop .6s}
.rt-done h2{margin:0;font-size:28px;font-weight:900}
.rt-done p{margin:0;font-size:17px;font-weight:800;color:#3a5c75}
@keyframes rt-fade{from{opacity:0}to{opacity:1}}
@keyframes rt-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes rt-nudge{0%,100%{transform:none}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes rt-hop{0%,100%{transform:none}35%{transform:translateY(-9px) scale(1.12)}70%{transform:translateY(2px)}}
@media (max-width:520px){
  .rt-p{padding:14px 12px;border-radius:24px}
  .rt-head img{height:78px}
  .rt-bub{font-size:15px;padding:8px 11px}.rt-bub .rt-ar{font-size:14.5px}
  .rt-q{font-size:19px;margin:10px 0 7px}.rt-q .rt-ar{font-size:16.5px}
  .rt-faces{gap:4px}
  .rt-face{border-width:2px;border-radius:13px;padding:7px 1px 6px}
  .rt-face i{font-size:27px}
  .rt-face span{font-size:11px}.rt-face .rt-ar{font-size:11.5px}
  .rt-lab{margin-top:11px}
  .rt-want{border-width:2px;border-radius:12px;min-height:50px;font-size:11.5px}.rt-want .rt-ar{font-size:12px}
  .rt-low .rt-head img{height:56px}
  .rt-low .rt-q{font-size:16.5px;margin:6px 0 5px}.rt-low .rt-q .rt-ar{font-size:15px}
  .rt-low .rt-face{padding:5px 1px 4px}.rt-low .rt-face i{font-size:23px}
  .rt-acts{bottom:-14px;margin:4px -12px -14px;padding:8px 12px 14px}
  .rt-done img{height:120px}
}
@media (max-width:340px){ .rt-face span{font-size:10px}.rt-face .rt-ar{font-size:10.5px}.rt-face i{font-size:24px} }
@media (max-width:340px),(max-height:600px) and (orientation:portrait){
  .rt-p{padding:12px 10px}
  .rt-head img{height:60px}
  .rt-bub{font-size:14px;padding:6px 10px}.rt-bub .rt-ar{font-size:13.5px}
  .rt-q{font-size:16.5px;margin:8px 0 6px}.rt-q .rt-ar{font-size:15.5px}
  .rt-lab{margin:9px 2px 4px;font-size:13.5px}.rt-lab .rt-ar{font-size:13px}
  .rt-in{padding:8px 12px;font-size:16px}
  .rt-note{font-size:11px}
  .rt-want{min-height:46px;font-size:10.5px;padding:4px 2px}.rt-want .rt-ar{font-size:11px}
  .rt-acts{bottom:-12px;margin:2px -10px -12px;padding:6px 10px 12px;gap:0}
  .rt-btn{min-height:46px;padding:8px 24px;font-size:17px}
}
@media (max-height:520px) and (orientation:landscape){
  .rt-p{max-width:640px;padding:10px 16px}
  .rt-head img{height:54px}
  .rt-bub{font-size:14.5px;padding:6px 10px}.rt-bub .rt-ar{display:none}
  .rt-q{font-size:17px;margin:6px 0 5px}.rt-q .rt-ar{display:inline;font-size:16px;margin-left:8px}
  .rt-face{flex-direction:row;flex-wrap:wrap;justify-content:center;gap:0 5px;padding:4px 2px}
  .rt-face i{font-size:22px}
  .rt-lab{margin:7px 2px 3px;display:flex;justify-content:space-between;gap:10px}
  .rt-in{padding:7px 12px;font-size:16px}
  .rt-note{display:none}
  .rt-wants{grid-template-columns:repeat(6,minmax(0,1fr))}
  .rt-want{min-height:44px;font-size:11px;padding:3px 2px}.rt-want .rt-ar{font-size:11.5px}
  .rt-acts{flex-direction:row;justify-content:center;gap:10px;bottom:-10px;margin:2px -16px -10px;padding:6px 16px 10px}
  .rt-btn{min-height:44px;padding:8px 26px;font-size:17px}
  .rt-done img{height:84px}
}
@media (prefers-reduced-motion:reduce){ .rt-ov,.rt-ov *{animation:none!important;transition:none!important} }`;

  const rateText = v => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, RATE_TEXT_MAX);
  function ratePlayed(id) {
    const c = chProf(id);
    return !!((c.quest || {}).plays || (c.game || {}).plays || c.dailyLast || Object.keys(c.cards || {}).length);
  }
  /* true when this player has finished something in the chapter and has not been asked yet */
  function rateDue(id) {
    id = id || chapterId(); const p = player();
    return !!(p && p.name && chapterById(id) && !chProf(id).rate && ratePlayed(id));
  }
  let rateSending = false;
  async function rateFlush() {
    if (rateSending || !(store.load().fb || []).length) return;
    rateSending = true;
    try {
      const db = await LB.ready(); if (!db) return;                 // no online board on this page: keep waiting
      const fs = LB._fs;
      for (const it of store.load().fb || []) {
        const data = Object.assign({}, it); delete data.id; data.at = fs.serverTimestamp();
        try {
          await Promise.race([fs.setDoc(fs.doc(db, 'feedback', it.id), data), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 8000))]);
          store.update(s => { s.fb = (s.fb || []).filter(x => x.id !== it.id); });
        } catch (e) { console.warn('Feedback is waiting on this device:', (e && e.code) || e); break; }
      }
    } catch (e) { console.warn(e); } finally { rateSending = false; }
  }
  function rateSave(choice, text, from, id, wants) {
    const p = player() || {};
    updateChProf(c => { c.rate = { v: choice ? choice.v : 0, on: today() }; }, id);   // v 0 = asked and skipped
    if (!choice) return;
    store.update(s => {
      s.fb = (s.fb || []).slice(-29);                                // the document id is random, so it cannot be guessed from the Champions board
      s.fb.push({ id: rid(), rating: choice.v, label: choice.en, text: rateText(text), wants: (wants || []).join(','), chapter: id, grade: p.grade || 'g5', track: p.track || 'lang', name: p.name || '', from: from || '' });
    });
    try { if (window.gtag) window.gtag('event', 'chapter_rating', { rating: choice.v, rating_label: choice.en, chapter: id }); } catch (e) {}   // number only, no name and no text
    rateFlush();
  }
  let rateOpen = null;
  /* shows the rating pop-up; the promise ends when the child has sent or skipped it */
  function rateAsk(from, id) {
    if (rateOpen) return rateOpen;
    id = id || chapterId();
    const ch = chapterById(id), p = player();
    if (!ch || !p) return Promise.resolve(false);
    if (!document.getElementById('rt-css')) { const st = document.createElement('style'); st.id = 'rt-css'; st.textContent = RATE_CSS; document.head.appendChild(st); }
    return (rateOpen = new Promise(res => {
      const back = document.activeElement;
      const o = document.createElement('div'); o.className = 'rt-ov';
      o.innerHTML = `<div class="rt-p" role="dialog" aria-modal="true" aria-labelledby="rt-q">
        <div class="rt-head">
          <img id="rt-koko" src="assets/parrot_wave.png" alt="">
          <div class="rt-bub" id="rt-bub" aria-live="polite">Wait, <b>${esc(p.name)}</b>! Can I ask you something?<span class="rt-ar">استنى يا بطل! ممكن أسألك سؤال؟</span></div>
        </div>
        <h2 class="rt-q" id="rt-q">How was <b>${esc(ch.title)}</b>?<span class="rt-ar">إيه رأيك في الفصل ده؟</span></h2>
        <div class="rt-faces" role="group" aria-label="Pick one">
          ${RATE_CHOICES.map(c => `<button type="button" class="rt-face" data-v="${c.v}" aria-pressed="false"><i aria-hidden="true">${c.face}</i><span>${c.en}</span><span class="rt-ar">${c.ar}</span></button>`).join('')}
        </div>
        <div class="rt-more" id="rt-more" hidden>
          <p class="rt-lab" id="rt-wl">What should Koko add or change?<span class="rt-ar">نضيف إيه أو نغيّر إيه؟</span></p>
          <div class="rt-wants" role="group" aria-labelledby="rt-wl">
            ${RATE_WANTS.map(w => `<button type="button" class="rt-want" data-k="${w.k}" aria-pressed="false"><span>${w.i} ${w.en}</span><span class="rt-ar">${w.ar}</span></button>`).join('')}
          </div>
        </div>
        <label class="rt-lab" for="rt-in" id="rt-lab"></label>
        <input class="rt-in" id="rt-in" type="text" dir="auto" maxlength="${RATE_TEXT_MAX}" autocomplete="off" enterkeyhint="send" placeholder="I wish… · نفسي في…">
        <p class="rt-note">Please don’t write phone numbers or addresses.<span class="rt-ar">من فضلك لا تكتب أرقام تليفونات أو عناوين</span></p>
        <div class="rt-acts">
          <button type="button" class="rt-btn" id="rt-send" disabled>Send ▸</button>
          <button type="button" class="rt-skip" id="rt-skip">Not now · مش دلوقتي</button>
        </div>
      </div>`;
      document.body.appendChild(o);
      const q = s => o.querySelector(s), faces = [...o.querySelectorAll('.rt-face')], input = q('#rt-in'), send = q('#rt-send'), koko = q('#rt-koko');
      const more = q('#rt-more'), wantBtns = [...o.querySelectorAll('.rt-want')];
      const LAB = { free: 'Tell Koko more, in one line (if you like)<span class="rt-ar">اكتب رأيك في سطر واحد (لو تحب)</span>',
        low: 'Or write your idea in one line<span class="rt-ar">أو اكتب فكرتك في سطر واحد</span>' };
      q('#rt-lab').innerHTML = LAB.free;
      const wanted = () => wantBtns.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.k);
      wantBtns.forEach(b => b.onclick = () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); sfx.tick(); });
      let pick = null, closed = false;
      const close = (sent) => {
        if (closed) return; closed = true;
        document.removeEventListener('keydown', onKey, true);
        o.remove(); rateOpen = null;
        try { if (back && back.focus && document.contains(back)) back.focus({ preventScroll: true }); } catch (e) {}
        res(sent);
      };
      const bub = (en, ar) => { q('#rt-bub').innerHTML = `${en}<span class="rt-ar">${ar}</span>`; };
      faces.forEach(b => b.onclick = () => {
        pick = RATE_CHOICES.find(c => c.v === +b.dataset.v);
        faces.forEach(x => x.setAttribute('aria-pressed', x === b));
        send.disabled = false; sfx.tick();
        koko.src = `assets/parrot_${pick.mood}.png`; koko.classList.remove('rt-hop'); void koko.offsetWidth; koko.classList.add('rt-hop');
        bub(pick.say, pick.sayAr);
        const low = pick.v <= RATE_LOW;                              // a low rating: Koko must ask what to add or change
        if (low && more.hidden) voice('better');
        more.hidden = !low; q('.rt-p').classList.toggle('rt-low', low); q('#rt-lab').innerHTML = low ? LAB.low : LAB.free;
        input.placeholder = low ? 'I want… · عايز…' : 'I wish… · نفسي في…';
        if (low) setTimeout(() => { try { more.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }, 60);
      });
      const submit = () => {
        if (closed) return;
        if (!pick) { bub('First tap one of the faces!', 'اختار وش من الوشوش الأول'); koko.src = 'assets/parrot_point.png'; faces[2].focus(); return; }
        const low = pick.v <= RATE_LOW, wants = low ? wanted() : [];
        if (low && !wants.length && !rateText(input.value)) {
          bub('Pick one of these, or write your idea!', 'اختار حاجة من دول أو اكتب فكرتك'); koko.src = 'assets/parrot_point.png';
          more.classList.remove('rt-nudge'); void more.offsetWidth; more.classList.add('rt-nudge');
          try { more.scrollIntoView({ block: 'nearest' }); } catch (e) {}
          return;
        }
        rateSave(pick, input.value, from, id, wants);
        sfx.ok(); voice('thanks');
        q('.rt-p').innerHTML = `<div class="rt-done" role="status"><img src="assets/parrot_celebrate.png" alt="">
          <h2>Thank you, ${esc(p.name)}!</h2><p class="rt-ar">شكرًا يا بطل! رأيك وصل لكوكو</p></div>`;
        const said = bufs.thanks ? (LEAD.thanks + bufs.thanks.duration) * 1000 + 250 : 0;   // wait for Koko's whole "thank you" before moving on
        setTimeout(() => close(true), isMuted() ? 1500 : Math.max(1800, Math.min(said, 6000)));
      };
      send.onclick = submit;
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      input.addEventListener('focus', () => setTimeout(() => { try { input.scrollIntoView({ block: 'center' }); } catch (e) {} }, 350));   // stay above the phone keyboard
      q('#rt-skip').onclick = () => { rateSave(null, '', from, id); close(false); };
      function onKey(e) {
        if (closed) return;
        if (e.key === 'Escape') { e.preventDefault(); q('#rt-skip').click(); return; }
        if (e.key !== 'Tab') return;                                 // keep the keyboard inside the pop-up
        const f = [...o.querySelectorAll('button:not(:disabled), input')]; if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!o.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      document.addEventListener('keydown', onKey, true);
      try { faces[faces.length - 1].focus({ preventScroll: true }); } catch (e) {}
      voice('rate');                                               // Koko asks out loud (the pop-up always follows a tap, so phones allow the sound)
    }));
  }
  /* asks before the player follows one of the "leaving" links or buttons inside `root`, then lets the click go on */
  function rateGuard(root, selector, from) {
    let busy = false, asked = false;                                 // asked: at most once per page, even if the save failed
    root.addEventListener('click', e => {
      const a = e.target && e.target.closest ? e.target.closest(selector) : null;
      if (!a || busy || asked || e.ctrlKey || e.metaKey || e.shiftKey || !rateDue()) return;
      e.preventDefault(); e.stopPropagation();
      busy = true;
      rateAsk(from).then(() => { asked = true; busy = false; a.click(); });
    }, true);
  }
  window.addEventListener('load', () => setTimeout(rateFlush, 2500));
  const rate = { due: rateDue, ask: rateAsk, guard: rateGuard, flush: rateFlush, CHOICES: RATE_CHOICES, WANTS: RATE_WANTS };

  window.SI = { HOME, CHAPTERS_PAGE, store, players, player, addPlayer, usePlayer, requirePlayer, prof, updateProf,
    chapters, chapterById, chapterId, chapter, setChapter, requireChapter, chProf, updateChProf, chapterStars, chReady, applyTheme, loadQuestions, checkName, LEVELS, levelInfo, xp, addXP, today, dailyState, completeDaily,
    weekKey, weekEndsIn, isMuted, setMuted, sfx, voice, speak, LB, rate, esc, NAME: 'Koko', isAr, T, chTitle, applyLang };
  applyLang();
})();
