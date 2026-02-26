/* ───────────────────────────────────────────
   LP/SP Tracker — Logic
   ─────────────────────────────────────────── */

const HEROES = [
  { name: 'Iron Warden',    slug: 'iron-warden',    lp: 27, sp: 15 },
  { name: 'Bone Tyrant',    slug: 'bone-tyrant',    lp: 21, sp: 21 },
  { name: 'Thread-Cutter',  slug: 'thread-cutter',  lp: 18, sp: 24 },
  { name: 'Void Scholar',   slug: 'void-scholar',   lp: 18, sp: 24 },
  { name: 'Crimson Ranger', slug: 'crimson-ranger',  lp: 24, sp: 18 },
];

const LP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
    2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
    C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
    c0 3.78-3.4 6.86-8.55 11.54z"/>
</svg>`;

const SP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 4C6 4 1.5 10 1 12c.5 2 5 8 11 8s10.5-6 11-8
    c-.5-2-5-8-11-8zm0 2c4.5 0 8 4.2 8.8 6-.8 1.8-4.3 6-8.8
    6s-8-4.2-8.8-6c.8-1.8 4.3-6 8.8-6z"/>
  <circle cx="12" cy="12" r="4.5"/>
  <circle cx="12" cy="12" r="2" opacity="0.3"/>
  <path d="M3.5 7L1.5 4.5M20.5 7l2-2.5M3.5 17L1.5 19.5M20.5 17l2 2.5"
    stroke="currentColor" stroke-width="1" stroke-linecap="round" fill="none"/>
</svg>`;

const trackerScreen = document.getElementById('tracker-screen');
const selectScreen = document.getElementById('select-screen');
const lpDisplay = document.getElementById('lp-value');
const spDisplay = document.getElementById('sp-value');
const heroGrid = document.getElementById('hero-grid');

const state = { lp: 20, sp: 20 };
const displays = { lp: lpDisplay, sp: spDisplay };

buildHeroGrid();
render();

/* ── Tracker Buttons ─────────────────────── */

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const stat = btn.dataset.stat;
    const delta = btn.dataset.action === 'increment' ? 1 : -1;
    const newVal = state[stat] + delta;

    if (newVal < 0) return;

    state[stat] = newVal;
    render();
    flashNumber(stat);
  });
});

/* ── Hamburger → Hero Select ─────────────── */

document.getElementById('hamburger-btn').addEventListener('click', () => {
  trackerScreen.classList.add('hidden');
  selectScreen.classList.remove('hidden');
});

/* ── Hero Grid Builder ───────────────────── */

function buildHeroGrid() {
  HEROES.forEach(hero => {
    const card = document.createElement('button');
    card.className = 'hero-card';
    card.innerHTML = `
      <img src="assets/heroes/${hero.slug}.jpg" alt="${hero.name}">
      <div class="hero-card-overlay">
        <div class="hero-stats">
          <div class="hero-stat hero-stat-lp">
            <div class="hero-stat-icon">${LP_ICON}<span class="hero-stat-num">${hero.lp}</span></div>
            <span class="hero-stat-label">LP</span>
          </div>
          <div class="hero-stat hero-stat-sp">
            <div class="hero-stat-icon">${SP_ICON}<span class="hero-stat-num">${hero.sp}</span></div>
            <span class="hero-stat-label">SP</span>
          </div>
        </div>
        <div class="hero-name">${hero.name}</div>
      </div>
    `;
    card.addEventListener('click', () => selectHero(hero));
    heroGrid.appendChild(card);
  });
}

/* ── Hero Selection ──────────────────────── */

function selectHero(hero) {
  state.lp = hero.lp;
  state.sp = hero.sp;
  render();
  selectScreen.classList.add('hidden');
  trackerScreen.classList.remove('hidden');
}

/* ── Render & Animations ─────────────────── */

function render() {
  lpDisplay.textContent = state.lp;
  spDisplay.textContent = state.sp;
}

function flashNumber(stat) {
  const el = displays[stat];
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}
