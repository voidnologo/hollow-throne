/* ───────────────────────────────────────────
   LP/SP Tracker — Logic
   ─────────────────────────────────────────── */

const HEROES = [
  { name: 'Iron Warden',    slug: 'iron-warden',    lp: 27, sp: 15, essence: 2 },
  { name: 'Bone Tyrant',    slug: 'bone-tyrant',    lp: 21, sp: 21, essence: 2 },
  { name: 'Thread-Cutter',  slug: 'thread-cutter',  lp: 18, sp: 24, essence: 3 },
  { name: 'Void Scholar',   slug: 'void-scholar',   lp: 18, sp: 24, essence: 3 },
  { name: 'Crimson Ranger', slug: 'crimson-ranger',  lp: 24, sp: 18, essence: 2 },
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

const ESSENCE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 1L5.5 5.5L4 12L5.5 18.5L12 23L18.5 18.5L20 12L18.5 5.5Z"/>
  <path d="M12 1L5.5 5.5L4 12L12 12Z" opacity="0.3"/>
  <path d="M12 1L18.5 5.5L20 12L12 12Z" opacity="0.15"/>
  <path d="M12 23L5.5 18.5L4 12L12 12Z" opacity="0.15"/>
  <path d="M12 23L18.5 18.5L20 12L12 12Z" opacity="0.3"/>
</svg>`;

const trackerScreen = document.getElementById('tracker-screen');
const selectScreen = document.getElementById('select-screen');
const lpDisplay = document.getElementById('lp-value');
const spDisplay = document.getElementById('sp-value');
const essenceDisplay = document.getElementById('essence-value');
const heroGrid = document.getElementById('hero-grid');
const essenceSection = document.getElementById('essence-section');
const lpSection = document.getElementById('lp-section');
const spSection = document.getElementById('sp-section');
const showEssenceToggle = document.getElementById('show-essence-toggle');

const storedShowEssence = localStorage.getItem('showEssence');
const showEssenceDefault = storedShowEssence === null ? true : storedShowEssence === 'true';

const state = { lp: 20, sp: 20, lpMax: 20, spMax: 20, essence: 0, essenceBase: 0, showEssence: showEssenceDefault };
const displays = { lp: lpDisplay, sp: spDisplay, essence: essenceDisplay };

showEssenceToggle.checked = state.showEssence;
applyEssenceVisibility();
buildHeroGrid();
render();

/* ── Tracker Buttons ─────────────────────── */

document.querySelectorAll('.btn[data-stat]').forEach(btn => {
  btn.addEventListener('click', () => {
    const stat = btn.dataset.stat;
    const delta = btn.dataset.action === 'increment' ? 1 : -1;
    const newVal = state[stat] + delta;

    if (newVal < 0) return;
    if (stat === 'lp' && newVal > state.lpMax) return;
    if (stat === 'sp' && newVal > state.spMax) return;

    state[stat] = newVal;
    render();
    flashNumber(stat);
  });
});

/* ── Essence Reset Button ──────────────────── */

document.getElementById('essence-reset').addEventListener('click', () => {
  state.essence = state.essenceBase;
  render();
  flashNumber('essence');
});

/* ── Show Essence Toggle ───────────────────── */

showEssenceToggle.addEventListener('change', () => {
  state.showEssence = showEssenceToggle.checked;
  localStorage.setItem('showEssence', state.showEssence);
  applyEssenceVisibility();
  rebuildHeroGrid();
});

/* ── Hamburger → Hero Select ─────────────── */

document.getElementById('hamburger-btn').addEventListener('click', () => {
  trackerScreen.classList.add('hidden');
  selectScreen.classList.remove('hidden');
});

/* ── Hero Grid Builder ───────────────────── */

function buildEssenceStat(hero) {
  if (!state.showEssence) return '';
  return `
    <div class="hero-stat hero-stat-essence">
      <div class="hero-stat-icon">${ESSENCE_ICON}<span class="hero-stat-num">${hero.essence}</span></div>
      <span class="hero-stat-label">ESS</span>
    </div>
  `;
}

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
          ${buildEssenceStat(hero)}
        </div>
        <div class="hero-name">${hero.name}</div>
      </div>
    `;
    card.addEventListener('click', () => selectHero(hero));
    heroGrid.appendChild(card);
  });
}

function rebuildHeroGrid() {
  heroGrid.innerHTML = '';
  buildHeroGrid();
}

/* ── Hero Selection ──────────────────────── */

function selectHero(hero) {
  state.lp = hero.lp;
  state.sp = hero.sp;
  state.lpMax = hero.lp;
  state.spMax = hero.sp;
  state.essence = hero.essence;
  state.essenceBase = hero.essence;
  render();
  selectScreen.classList.add('hidden');
  trackerScreen.classList.remove('hidden');
}

/* ── Render & Animations ─────────────────── */

function render() {
  lpDisplay.textContent = state.lp;
  spDisplay.textContent = state.sp;
  essenceDisplay.textContent = state.essence;

  applyStatWarnings(lpSection, state.lp);
  applyStatWarnings(spSection, state.sp);
}

function applyStatWarnings(section, value) {
  section.classList.toggle('loss', value === 0);
  section.classList.toggle('warning', value > 0 && value <= 2);
}

function applyEssenceVisibility() {
  if (state.showEssence) {
    essenceSection.classList.remove('hidden');
    trackerScreen.classList.add('essence-visible');
  } else {
    essenceSection.classList.add('hidden');
    trackerScreen.classList.remove('essence-visible');
  }
}

function flashNumber(stat) {
  const el = displays[stat];
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}
