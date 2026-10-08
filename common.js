/* Science Island · shared helpers: storage, player, XP levels, daily streak, sounds, Arabic voice, Champions board */
(function () {
  'use strict';
  const HOME = 'index.html';
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
  /* per-player progress: xp, daily, cards (review schedule), last phrasing, best scores */
  function prof() { const s = store.load(); return ((s.profiles || {})[s.current]) || {}; }
  function updateProf(fn) { store.update(s => { s.profiles = s.profiles || {}; const p = s.profiles[s.current] = s.profiles[s.current] || {}; fn(p); }); return prof(); }

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

  /* ---------- daily challenge streak ---------- */
  const pad = n => String(n).padStart(2, '0');
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const dayDiff = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  function dailyState() {
    const d = prof().daily || {}, t = today();
    const done = d.last === t, alive = !!d.last && (done || dayDiff(d.last, t) === 1);
    return { done, streak: alive ? (d.streak || 0) : 0 };
  }
  function completeDaily() {
    let st = 0;
    updateProf(p => { const d = p.daily || {}, t = today(); if (d.last !== t) { d.streak = d.last && dayDiff(d.last, t) === 1 ? (d.streak || 0) + 1 : 1; d.last = t; } p.daily = d; st = d.streak; });
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

  /* ---------- sound effects ---------- */
  const isMuted = () => !!store.load().muted;
  const setMuted = v => store.update(s => { s.muted = !!v; });
  let ac = null;
  function tone(f, d = .12, type = 'sine', v = .08, delay = 0) {
    if (isMuted()) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .03);
    } catch (e) {}
  }
  const sfx = {
    ok() { tone(660, .12); tone(880, .2, 'sine', .08, .1); },
    bad() { tone(220, .25, 'triangle', .09); },
    win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, .2, 'sine', .08, i * .11)); },
    tick() { tone(520, .05, 'sine', .04); },
    beep() { tone(880, .06, 'square', .03); },
    boss() { [196, 233, 262, 311].forEach((f, i) => tone(f, .25, 'sawtooth', .04, i * .14)); },
    level() { [523, 784, 1046, 1318].forEach((f, i) => tone(f, .25, 'triangle', .07, i * .12)); }
  };

  /* ---------- Koko's Arabic voice ----------
     Recorded clips go in assets/voice/<id>.mp3. Until a clip exists, the device's Arabic
     text-to-speech is used if it has one; otherwise Koko stays silent. */
  const VOICE = {
    ok: ['ok1', 'ok2', 'ok3', 'ok4', 'ok5'], bad: ['bad1', 'bad2'], streak: ['streak'], boss: ['boss'],
    box: ['box'], finish: ['finish'], hello: ['hello'], level: ['level'], champion: ['champion']
  };
  const VOICE_TEXT = {
    ok1: 'رائع!', ok2: 'ممتاز!', ok3: 'أحسنت!', ok4: 'عظيم!', ok5: 'برافو عليك!',
    bad1: 'حاول مرة أخرى', bad2: 'قربت! جرّب تاني',
    streak: 'ما شاء الله! إنت نار!', boss: 'استعد للتحدي الكبير!', box: 'مفاجأة!',
    finish: 'أحسنت يا بطل! خلّصت المهمة', hello: 'أهلًا يا بطل!', level: 'مبروك! طلعت مستوى جديد', champion: 'إنت من الأبطال!'
  };
  const clips = {}, missing = {};
  let lastVoiceAt = 0;
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
  function voice(kind) {
    if (isMuted()) return;
    const list = VOICE[kind]; if (!list) return;
    const now = Date.now(); if (now - lastVoiceAt < 700) return; lastVoiceAt = now;   // never talk over itself
    const id = list[Math.floor(Math.random() * list.length)];
    if (missing[id]) return speak(VOICE_TEXT[id]);
    let a = clips[id];
    if (!a) { a = clips[id] = new Audio(`assets/voice/${id}.mp3`); a.preload = 'auto'; a.addEventListener('error', () => { missing[id] = true; }); }
    try { a.currentTime = 0; } catch (e) {}
    const p = a.play();
    if (p && p.catch) p.catch(() => { missing[id] = true; speak(VOICE_TEXT[id]); });
  }

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
    board() { const p = player() || {}; return `${p.grade || 'g5'}-${p.track || 'lang'}-ch1-${weekKey()}`; },
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

  window.SI = { HOME, store, players, player, addPlayer, usePlayer, requirePlayer, prof, updateProf, checkName, LEVELS, levelInfo, xp, addXP, today, dailyState, completeDaily,
    weekKey, weekEndsIn, isMuted, setMuted, sfx, voice, speak, LB, esc, NAME: 'Koko' };
})();
