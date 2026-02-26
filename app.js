/* ───────────────────────────────────────────
   LP/SP Tracker — V1 Logic
   ─────────────────────────────────────────── */

const lpDisplay = document.getElementById('lp-value');
const spDisplay = document.getElementById('sp-value');

const state = { lp: 20, sp: 20 };

render();

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

function render() {
  lpDisplay.textContent = state.lp;
  spDisplay.textContent = state.sp;
}

const displays = { lp: lpDisplay, sp: spDisplay };

function flashNumber(stat) {
  const el = displays[stat];
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}
