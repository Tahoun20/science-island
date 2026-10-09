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
    if (!c || !c.ready) { location.href = CHAPTERS_PAGE; return null; }
    return c;
  }
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
      if (!c || !c.questions) return rej(new Error('This chapter has no questions yet.'));
      window.IDEAS = undefined;
      const el = document.createElement('script'); el.src = c.questions;
      el.onload = () => (Array.isArray(window.IDEAS) ? res(window.IDEAS) : rej(new Error('No questions in ' + c.questions)));
      el.onerror = () => rej(new Error('Could not load ' + c.questions));
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
  function levelInfo(xp) {
    let i = 0; LEVELS.forEach((l, k) => { if (xp >= l[0]) i = k; });
    const nxt = LEVELS[i + 1];
    return { n: i + 1, title: LEVELS[i][1], xp, from: LEVELS[i][0], to: nxt ? nxt[0] : null, pct: nxt ? (xp - LEVELS[i][0]) / (nxt[0] - LEVELS[i][0]) : 1, next: nxt ? nxt[1] : null };
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
     A clip that is missing falls back to the device's Arabic text-to-speech, or stays silent. */
  const VOICE = {
    ok: ['ok1', 'ok2', 'ok3', 'ok4', 'ok5', 'ok6', 'ok7', 'ok8'], bad: ['bad1', 'bad2', 'bad3', 'bad4'], streak: ['streak'], boss: ['boss'],
    box: ['box'], finish: ['finish'], hello: ['hello'], level: ['level'], champion: ['champion']
  };
  const VOICE_TEXT = {
    ok1: 'رائع!', ok2: 'ممتاز!', ok3: 'أحسنت!', ok4: 'عظيم!', ok5: 'برافو عليك!', ok6: 'يا سلام عليك!', ok7: 'شاطر!', ok8: 'كده تمام!',
    bad1: 'حاول مرة تانية', bad2: 'قربت! جرّب تاني', bad3: 'ولا يهمك، جرّب تاني', bad4: 'فكّر تاني براحتك',
    streak: 'ما شاء الله! إنت نار!', boss: 'استعد للتحدي الكبير!', box: 'مفاجأة!',
    finish: 'أحسنت يا بطل! خلّصت المهمة', hello: 'أهلًا يا بطل!', level: 'مبروك! طلعت مستوى جديد', champion: 'إنت من الأبطال!'
  };
  const LEAD = { finish: .45, box: .45, level: .35, boss: .7 };   // seconds Koko waits so the effect is heard first (default .12)
  const ALL_CLIPS = Object.keys(VOICE_TEXT);
  const raw = {}, decoded = {}, bufs = {}, els = {}, missing = {}, lastId = {};
  let noFetch = location.protocol === 'file:', lastVoiceAt = 0;
  function arabicVoice() {
    try { return (speechSynthesis.getVoices() || []).find(v => /^ar/i.test(v.lang)) || null; } catch (e) { return null; }
  }
  try { speechSynthesis && speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', arabicVoice); } catch (e) {}
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
    if (p && p.catch) p.catch(e => { if (e && e.name === 'NotAllowedError') return; missing[id] = true; speak(VOICE_TEXT[id]); });
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
    if (missing[id]) return speak(VOICE_TEXT[id]);
    if (noFetch) return playElement(id);
    audio();                                                   // unlock inside the tap
    clip(id).then(buf => {
      if (buf) return playBuffer(buf, lead, now);
      if (Date.now() - now > 1500 || isMuted()) return;
      if (missing[id]) return speak(VOICE_TEXT[id]);
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
    _db: undefined, _fs: null,
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
  const PAGE_NAMES = { 'index.html': 'Home', 'chapters.html': 'Chapters', 'map.html': 'Island map', 'arm.html': 'Arm Mechanic', 'champions.html': 'Champions',
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

  window.SI = { HOME, CHAPTERS_PAGE, store, players, player, addPlayer, usePlayer, requirePlayer, prof, updateProf,
    chapters, chapterById, chapterId, chapter, setChapter, requireChapter, chProf, updateChProf, chapterStars, applyTheme, loadQuestions, checkName, LEVELS, levelInfo, xp, addXP, today, dailyState, completeDaily,
    weekKey, weekEndsIn, isMuted, setMuted, sfx, voice, speak, LB, esc, NAME: 'Koko' };
})();
