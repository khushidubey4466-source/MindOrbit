/* MindOrbit – app logic. Sections: storage, helpers, views, galaxy, quiz, learning, custom topics. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

/* ---------- Storage (LocalStorage) ---------- */
const KEY = 'mindorbit.v1';
const DEFAULTS = { recent: [], explored: {}, done: {}, scores: {}, custom: [], theme: 'dark', last: null };
let S = (() => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { ...DEFAULTS }; } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { toast('Storage is full or blocked, so progress will not be saved.'); } };

/* ---------- Helpers ---------- */
const topics = () => [...SAMPLE_TOPICS, ...S.custom];
const getTopic = id => topics().find(t => t.id === id);
const list = (map, id) => map[id] || (map[id] = []);
let cur = null; // current topic
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('on'), 2400); }
function withLoader(fn) { const l = $('#loader'); l.hidden = false; setTimeout(() => { fn(); l.hidden = true; }, 650); }

/* ---------- Navigation ---------- */
function go(view) {
  if (view === 'galaxy' && !cur) { const id = S.last && getTopic(S.last) ? S.last : SAMPLE_TOPICS[0].id; return openTopic(id); }
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + view));
  $$('nav button').forEach(b => b.classList.toggle('on', b.dataset.view === view));
  ({ home: renderHome, learning: renderLearning })[view]?.();
  scrollTo(0, 0);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) go(b.dataset.view); });

/* ---------- Home ---------- */
function renderHome() {
  const all = topics(), total = all.reduce((n, t) => n + t.concepts.length, 0);
  const seen = Object.values(S.explored).reduce((n, a) => n + a.length, 0);
  const pct = total ? Math.round(seen / total * 100) : 0;
  $('#stats').innerHTML = `<div class="stat"><b>${seen}</b><span>Concepts explored</span></div>
    <div class="stat"><b>${S.recent.filter(getTopic).length}</b><span>Topics visited</span></div>
    <div class="stat"><b>${pct}%</b><span>Learning progress</span><div class="bar2"><i style="width:${pct}%"></i></div></div>`;
  const rec = S.recent.map(getTopic).filter(Boolean).slice(0, 6);
  $('#recent').innerHTML = rec.length ? rec.map(t => `<button class="chip" data-open="${t.id}">${t.emoji} ${esc(t.name)}</button>`).join('')
    : '<div class="empty">Nothing yet. Pick a topic below to launch your first galaxy.</div>';
  $('#topics').innerHTML = all.map(t => `<button class="card" style="--h:${t.hue}" data-open="${t.id}"><span class="em">${t.emoji}</span>
    <h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><p>${t.concepts.length} concepts</p></button>`).join('');
}
document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openTopic(b.dataset.open); });

/* Search: matches topic names first, then concept names inside topics */
$('#searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const q = $('#q').value.trim().toLowerCase(), msg = $('#searchMsg');
  if (!q) { msg.textContent = 'Type a topic such as “physics” or “brain” to begin.'; return; }
  const byTopic = topics().find(t => t.name.toLowerCase().includes(q) || t.id === q);
  const hit = byTopic || topics().find(t => t.concepts.some(c => c.n.toLowerCase().includes(q)));
  if (hit) { msg.textContent = ''; $('#q').value = ''; openTopic(hit.id, byTopic ? null : q); }
  else msg.innerHTML = `No topic matches “${esc(q)}”. Try ${SAMPLE_TOPICS.slice(0, 3).map(t => `<button type="button" class="chip" data-open="${t.id}">${t.name}</button>`).join(', ')} or <button type="button" class="chip" data-view="create">add your own topic</button>`;
});

/* ---------- Galaxy (SVG) ---------- */
let pan = { x: 0, y: 0, k: 1 }, drag = null, moved = false, pos = [];
const applyPan = () => $('#world').setAttribute('transform', `translate(${pan.x + 400} ${pan.y + 300}) scale(${pan.k}) translate(-400 -300)`);

function openTopic(id, focusQuery) {
  cur = getTopic(id); S.last = id;
  S.recent = [id, ...S.recent.filter(r => r !== id)].slice(0, 50); save();
  withLoader(() => {
    pan = { x: 0, y: 0, k: 1 };
    $('#gTitle').textContent = cur.emoji + ' ' + cur.name;
    drawGalaxy(); showOverview(); go('galaxy');
    const i = focusQuery ? cur.concepts.findIndex(c => c.n.toLowerCase().includes(focusQuery)) : -1;
    if (i >= 0) showConcept(i);
  });
}

function drawGalaxy() {
  const cs = cur.concepts, n = cs.length, done = list(S.done, cur.id);
  // Place planets on two alternating rings around the centre
  pos = cs.map((_, i) => { const a = i / n * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 235 : 175; return { x: 400 + Math.cos(a) * r, y: 300 + Math.sin(a) * r * .78 }; });
  let h = `<g id="world"><circle class="orbit" cx="400" cy="300" r="175"/><circle class="orbit" cx="400" cy="300" r="235"/>`;
  cs.forEach((c, i) => c.r.forEach(j => { if (j > i) h += `<line class="edge f" x1="${pos[i].x}" y1="${pos[i].y}" x2="${pos[j].x}" y2="${pos[j].y}"/>`; }));
  pos.forEach(p => h += `<line class="edge" x1="400" y1="300" x2="${p.x}" y2="${p.y}"/>`);
  h += `<g class="node" data-c="-1" transform="translate(400 300)"><circle class="halo" r="62" fill="hsl(${cur.hue} 90% 60%/.35)"/><circle class="pl" r="42" fill="hsl(${cur.hue} 80% 55%)" style="filter:drop-shadow(0 0 16px hsl(${cur.hue} 90% 65%))"/><text y="10" font-size="30" text-anchor="middle">${cur.emoji}</text></g>`;
  cs.forEach((c, i) => {
    const hue = (cur.hue + i * 28) % 360, ok = done.includes(c.n);
    h += `<g class="node" data-c="${i}" transform="translate(${pos[i].x} ${pos[i].y})" tabindex="0" role="button" aria-label="${esc(c.n)}">
      <circle class="halo" r="40" fill="hsl(${hue} 90% 60%/.3)" style="animation-delay:${i * .5}s"/>
      <circle class="pl" r="27" fill="hsl(${hue} 85% 58%)" style="filter:drop-shadow(0 0 12px hsl(${hue} 90% 65%))"/>
      <circle cx="-8" cy="-9" r="7" fill="#fff" opacity=".35"/>${ok ? '<text y="6" text-anchor="middle" font-size="18" fill="#fff">✓</text>' : ''}
      <text class="lbl" y="48">${esc(c.n.length > 22 ? c.n.slice(0, 21) + '…' : c.n)}</text></g>`;
  });
  $('#galaxy').innerHTML = h + '</g>';
  applyPan(); // keep the user's current pan/zoom after a redraw
  updateProgress();
}
const updateProgress = () => $('#gProg').textContent = `${list(S.explored, cur.id).length} of ${cur.concepts.length} explored · ${list(S.done, cur.id).length} completed`;

// Drag to pan, wheel to zoom, click to open a planet
const svg = $('#galaxy');
svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; moved = false; });
addEventListener('pointermove', e => {
  if (!drag) return;
  const r = svg.getBoundingClientRect(), f = Math.max(800 / r.width, 600 / r.height);
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
  pan.x = drag.px + dx * f; pan.y = drag.py + dy * f; applyPan();
});
addEventListener('pointerup', () => drag = null);
svg.addEventListener('wheel', e => { e.preventDefault(); pan.k = Math.min(2, Math.max(.5, pan.k - e.deltaY * .001)); applyPan(); }, { passive: false });
const pick = t => { const n = t.closest('.node'); if (n && !moved) { const i = +n.dataset.c; i < 0 ? showOverview() : showConcept(i); } };
svg.addEventListener('click', e => pick(e.target));
svg.addEventListener('keydown', e => { if (e.key === 'Enter') pick(e.target); });
$('#resetView').onclick = () => { pan = { x: 0, y: 0, k: 1 }; applyPan(); };
$('#startQuiz').onclick = () => startQuiz();

/* ---------- Concept Explorer panel ---------- */
function showOverview() {
  $$('.node').forEach(n => n.classList.remove('sel'));
  $('#panel').classList.remove('off');
  $('#panel').innerHTML = `<h3>${cur.emoji} ${esc(cur.name)}</h3><p>${esc(cur.desc)}</p><p>Tap a planet to learn about a concept. Explore them all, then test yourself.</p>
    <button class="btn" onclick="startQuiz()">Start quiz</button>`;
}
function showConcept(i) {
  const c = cur.concepts[i], ex = list(S.explored, cur.id), dn = list(S.done, cur.id);
  if (!ex.includes(c.n)) { ex.push(c.n); save(); updateProgress(); }
  $$('.node').forEach(n => n.classList.toggle('sel', +n.dataset.c === i));
  const p = $('#panel'); p.classList.remove('off');
  p.innerHTML = `<h3>${esc(c.n)}</h3><p>${esc(c.s)}</p><b>Key points</b><ul>${c.p.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <b>Related concepts</b><div class="chips" style="margin:.5rem 0 1rem">${c.r.map(j => `<button class="chip" data-rel="${j}">${esc(cur.concepts[j].n)}</button>`).join('')}</div>
    <button class="btn" id="doneBtn">${dn.includes(c.n) ? '✓ Completed' : 'Mark as completed'}</button>
    <button class="btn ghost" id="backBtn">Back to Galaxy</button>`;
  $$('[data-rel]', p).forEach(b => b.onclick = () => showConcept(+b.dataset.rel));
  $('#backBtn').onclick = showOverview;
  $('#doneBtn').onclick = () => {
    const k = dn.indexOf(c.n); k < 0 ? dn.push(c.n) : dn.splice(k, 1);
    save(); drawGalaxy(); showConcept(i); toast(k < 0 ? 'Concept completed' : 'Marked as not completed');
  };
}

/* ---------- Quiz: questions are generated from the topic's own concepts ---------- */
let quiz = null;
function buildQuiz(t) {
  const cs = t.concepts, qs = [];
  cs.forEach(c => {
    qs.push({ q: `Which concept is described as: “${c.s}”`, a: c.n, o: cs.map(x => x.n) });
    qs.push({ q: `Which is a key point of ${c.n}?`, a: c.p[0], o: cs.filter(x => x !== c).map(x => x.p[0]) });
  });
  return shuffle(qs).slice(0, 6).map(q => ({ q: q.q, a: q.a, o: shuffle([q.a, ...shuffle(q.o.filter(x => x !== q.a)).slice(0, 3)]) }));
}
function startQuiz() { quiz = { qs: buildQuiz(cur), i: 0, score: 0, done: false }; go('quiz'); renderQuiz(); }
function renderQuiz() {
  const box = $('#quizBox'), q = quiz.qs[quiz.i];
  if (quiz.i >= quiz.qs.length) {
    const pct = Math.round(quiz.score / quiz.qs.length * 100);
    S.scores[cur.id] = { last: pct, best: Math.max(pct, S.scores[cur.id]?.best || 0) }; save();
    box.innerHTML = `<h3>Quiz complete</h3><div class="score">${quiz.score} / ${quiz.qs.length}</div>
      <p style="text-align:center">${pct >= 80 ? 'Stellar work, explorer!' : pct >= 50 ? 'Good orbit. One more try will lock it in.' : 'Revisit the planets and try again.'}</p>
      <button class="btn" id="again">Try again</button> <button class="btn ghost" id="toGal">Back to Galaxy</button>`;
    $('#again').onclick = startQuiz; $('#toGal').onclick = () => go('galaxy'); return;
  }
  box.innerHTML = `<small>${esc(cur.name)} · Question ${quiz.i + 1} of ${quiz.qs.length}</small><h3>${esc(q.q)}</h3>
    ${q.o.map(o => `<button class="opt">${esc(o)}</button>`).join('')}<p id="fb"></p>`;
  $$('.opt', box).forEach(b => b.onclick = () => {
    const right = b.textContent === q.a; if (right) quiz.score++;
    $$('.opt', box).forEach(x => { x.disabled = true; if (x.textContent === q.a) x.classList.add('ok'); });
    if (!right) b.classList.add('bad');
    $('#fb').innerHTML = `${right ? '✅ Correct!' : '❌ Not quite. The answer is highlighted.'}<br><button class="btn" id="next" style="margin-top:.6rem">${quiz.i + 1 < quiz.qs.length ? 'Next question' : 'See my score'}</button>`;
    $('#next').onclick = () => { quiz.i++; renderQuiz(); };
  });
}

/* ---------- My Learning ---------- */
function renderLearning() {
  const rows = topics().filter(t => t.custom || list(S.explored, t.id).length || S.scores[t.id]); // custom topics always listed so they can be deleted
  if (!rows.length) { $('#learnBox').innerHTML = '<div class="empty">No learning yet. <button class="chip" data-view="home">Explore a topic</button> and your progress will appear here.</div>'; return; }
  $('#learnBox').innerHTML = rows.map(t => {
    const e = list(S.explored, t.id).length, d = list(S.done, t.id).length, n = t.concepts.length, sc = S.scores[t.id];
    return `<div class="glass row"><div><b>${t.emoji} ${esc(t.name)}</b><div class="bar2"><i style="width:${Math.round(d / n * 100)}%"></i></div>
      <small>${e}/${n} explored · ${d}/${n} completed · ${sc ? `quiz best ${sc.best}%, last ${sc.last}%` : 'no quiz yet'}</small></div>
      <div><button class="btn ghost" data-open="${t.id}">Continue</button>
      ${t.custom ? `<button class="btn ghost" data-del="${t.id}">Delete</button>` : ''}</div></div>`;
  }).join('') + '<button class="btn ghost" id="reset">Reset all progress</button>';
  $('#reset').onclick = () => { if (confirm('Clear all explored concepts, completions and scores? Your custom topics stay.')) { Object.assign(S, { recent: [], explored: {}, done: {}, scores: {} }); save(); renderLearning(); toast('Progress reset'); } };
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-del]'); if (!b || !confirm('Delete this custom topic?')) return;
  S.custom = S.custom.filter(t => t.id !== b.dataset.del); if (cur?.id === b.dataset.del) cur = null;
  S.recent = S.recent.filter(r => r !== b.dataset.del); save(); renderLearning(); toast('Topic deleted');
});

/* ---------- Custom topics. Format per line: Name | Explanation | point; point ---------- */
$('#createForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = $('#cMsg'), name = $('#cName').value.trim();
  const lines = $('#cText').value.split('\n').map(l => l.split('|').map(s => s.trim())).filter(p => p[0]);
  const bad = lines.find(p => !p[1]);
  if (lines.length < 3) { msg.textContent = 'Add at least 3 concepts, one per line, so the galaxy and quiz have enough to work with.'; return; }
  if (bad) { msg.textContent = `“${bad[0]}” needs an explanation. Use: Name | Explanation | point; point`; return; }
  const n = lines.length;
  S.custom.push({ id: 'c' + Date.now(), custom: true, name, emoji: '✨', hue: Math.floor(Math.random() * 360), desc: 'Your custom topic.',
    concepts: lines.map((p, i) => ({ n: p[0], s: p[1], p: (p[2] || p[1]).split(';').map(x => x.trim()).filter(Boolean), r: [...new Set([(i + 1) % n, (i + n - 1) % n])] })) });
  save(); msg.textContent = ''; e.target.reset(); toast('Topic saved'); openTopic(S.custom.at(-1).id);
});

/* ---------- Theme ---------- */
function setTheme(t) { S.theme = t; document.documentElement.dataset.theme = t; save(); }
$('#theme').onclick = () => setTheme(S.theme === 'dark' ? 'light' : 'dark');
setTheme(S.theme);
go('home');