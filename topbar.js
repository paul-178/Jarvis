// =============================================================
// Persistent dashboard top bar + bottom tab bar — warm light theme.
// Drop on any page with:  <script src="topbar.js" defer></script>
// Self-injects HTML + CSS. Skips chrome when embedded in iframes.
// 5 tabs: HOME / GOALS / HEALTH / ACAD / MONEY
// =============================================================
(function () {
  'use strict';

  const TOPBAR_SUPABASE_URL = 'https://amicfjnjxjftknxukbsm.supabase.co';
  const TOPBAR_SUPABASE_KEY = 'sb_publishable_NRjDW71socMl8qKRID8n_g_ktB02qW5';

  // ---------------------------------------------------------------- CSS
  const css = `
.topbar {
  position: sticky; top: 0; z-index: 40;
  display: flex; justify-content: flex-end; align-items: center;
  gap: 8px;
  padding: max(10px, env(safe-area-inset-top)) 14px 8px;
  background: rgba(255, 238, 190, 0.50);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-bottom: 1px solid rgba(210, 148, 40, 0.14);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
}

/* topbar weather/time info (injected by page scripts) */
.topbar-info {
  display: flex; align-items: center; gap: 5px;
  margin-right: auto;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11.5px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  white-space: nowrap; color: rgba(80, 48, 8, 0.72);
}
.topbar-info-weather { opacity: 0.4; transition: opacity 0.4s; }
.topbar-info-sep { color: rgba(160, 100, 20, 0.40); margin: 0 1px; }
.topbar-info-datetime { color: rgba(100, 64, 10, 0.55); font-variant-numeric: tabular-nums; }
@media (max-width: 360px) { .topbar-info-sep, .topbar-info-datetime { display: none; } }

/* water pill */
.topbar-water-wrap { display: flex; align-items: stretch; }
.topbar-water-pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 12px;
  background: rgba(140, 210, 255, 0.26);
  border: 1.5px solid rgba(100, 175, 230, 0.35);
  border-right: none;
  border-radius: 12px 0 0 12px;
  text-decoration: none; color: #1A4F7A;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s;
}
.topbar-water-pill:active { background: rgba(120, 195, 250, 0.40); }
.topbar-water-emoji { font-size: 14px; line-height: 1; flex-shrink: 0; }
.topbar-pill-count {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px; font-weight: 800; color: #1A4F7A;
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.topbar-water-add {
  width: 38px;
  border: 1.5px solid rgba(100, 175, 230, 0.35);
  background: rgba(110, 190, 250, 0.30);
  color: #1A4F7A; font-family: inherit;
  font-size: 19px; font-weight: 700; line-height: 1;
  cursor: pointer; border-radius: 0 12px 12px 0;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s, transform 0.10s;
}
.topbar-water-add:active { transform: scale(0.97); }
.topbar-water-add.flash { background: rgba(80, 170, 240, 0.55); }

/* bottom bar — transparent container, floating pill inside */
.bottombar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
  display: flex; justify-content: center; align-items: flex-end;
  padding: 10px 20px calc(10px + env(safe-area-inset-bottom));
  background: transparent;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
}
.bottombar-pill {
  pointer-events: auto;
  display: flex; align-items: center;
  gap: 2px; padding: 5px;
  background: rgba(22, 14, 3, 0.93);
  border-radius: 28px;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.32),
    0 2px 8px rgba(0,0,0,0.20),
    inset 0 1px 0 rgba(255, 220, 140, 0.07);
}
.bottombar-tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; padding: 7px 12px 6px;
  text-decoration: none;
  color: rgba(255, 215, 140, 0.38);
  font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
  border-radius: 22px;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.2s, background 0.2s;
}
.bottombar-tab-icon { font-size: 20px; line-height: 1; transition: transform 0.15s; }
.bottombar-tab:active .bottombar-tab-icon { transform: scale(0.90); }
.bottombar-tab.active {
  color: #FF8C1A;
  background: rgba(255, 140, 26, 0.16);
}
.bottombar-tab-badge {
  position: absolute; top: 4px; right: 3px;
  background: #FF8C1A; color: #1C0A00;
  font-size: 8.5px; font-weight: 800; line-height: 1;
  padding: 2px 5px; border-radius: 10px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  display: none; white-space: nowrap;
}
.bottombar-tab-badge.show { display: block; }

body.has-bottombar { padding-bottom: calc(88px + env(safe-area-inset-bottom)) !important; }

@media (max-width: 480px) {
  .topbar { padding-left: 10px; padding-right: 10px; gap: 5px; }
  .topbar-water-pill { padding: 6px 10px; gap: 5px; }
  .topbar-pill-count { font-size: 12px; }
  .topbar-water-add { width: 34px; font-size: 17px; }
  .bottombar-tab { padding: 6px 9px 5px; font-size: 8px; }
  .bottombar-tab-icon { font-size: 18px; }
  .bottombar { padding-left: 12px; padding-right: 12px; }
}
html, body { -webkit-text-size-adjust: 100%; }
@media (max-width: 768px) {
  html { touch-action: pan-y; }
  ::-webkit-scrollbar { width: 0; height: 0; display: none; }
  html, body { scrollbar-width: none; -ms-overflow-style: none; }
}
.modal-bg, .modal, .po-modal-bg, .po-modal, .wt-overlay, .wt-viewer { overscroll-behavior: contain; }
body.topbar-modal-open { overflow: hidden; touch-action: none; }
@media (max-width: 480px) {
  .modal-bg, .po-modal-bg { padding: 0 !important; align-items: stretch !important; justify-content: stretch !important; }
  .modal, .po-modal {
    width: 100% !important; max-width: 100% !important;
    max-height: 100vh !important; height: 100vh !important;
    border-radius: 0 !important;
    padding-top: max(20px, env(safe-area-inset-top)) !important;
    padding-bottom: max(28px, env(safe-area-inset-bottom)) !important;
    overflow-y: auto !important; overscroll-behavior: contain;
  }
}
`;

  // ---------------------------------------------------------------- HTML
  const topbarHtml = `
<header class="topbar" id="topbar" role="banner">
  <div class="topbar-water-wrap">
    <a href="health.html#water" class="topbar-water-pill" id="topbarWater" aria-label="Water progress">
      <span class="topbar-water-emoji">💧</span>
      <span class="topbar-pill-count" id="topbarWaterCount">0/0</span>
    </a>
    <button class="topbar-water-add" id="topbarWaterAdd" aria-label="Log one drink" type="button">+</button>
  </div>
</header>`;

  const bottombarHtml = `
<nav class="bottombar" id="bottombar" role="navigation" aria-label="Main tabs">
  <div class="bottombar-pill">
    <a href="index.html" class="bottombar-tab" data-page="main">
      <span class="bottombar-tab-icon">🏠</span><span>HOME</span>
    </a>
    <a href="goals.html" class="bottombar-tab" data-page="goals">
      <span class="bottombar-tab-icon">🎯</span>
      <span class="bottombar-tab-badge" id="bottombarGoalsBadge"></span>
      <span>GOALS</span>
    </a>
    <a href="health.html" class="bottombar-tab" data-page="health">
      <span class="bottombar-tab-icon">💚</span><span>HEALTH</span>
    </a>
    <a href="acad.html" class="bottombar-tab" data-page="acad">
      <span class="bottombar-tab-icon">📚</span><span>ACAD</span>
    </a>
    <a href="finance.html" class="bottombar-tab" data-page="money">
      <span class="bottombar-tab-icon">💰</span><span>MONEY</span>
    </a>
  </div>
</nav>`;

  // ---------------------------------------------------------------- routing
  function isEmbedded() { try { return window.self !== window.top; } catch (e) { return true; } }
  function shouldShowChrome() { return !isEmbedded(); }
  function currentPageKey() {
    const p = (window.location.pathname || '').toLowerCase();
    if (p.endsWith('goals.html'))   return 'goals';
    if (p.endsWith('health.html') || p.endsWith('gym.html')) return 'health';
    if (p.endsWith('acad.html'))    return 'acad';
    if (p.endsWith('finance.html')) return 'money';
    return 'main';
  }

  // ---------------------------------------------------------------- inject
  function injectStyleAndHTML() {
    if (document.getElementById('topbar') || document.getElementById('bottombar')) return;
    if (!shouldShowChrome()) return;
    const style = document.createElement('style');
    style.id = 'topbar-style';
    style.textContent = css;
    document.head.appendChild(style);
    const topWrap = document.createElement('div');
    topWrap.innerHTML = topbarHtml.trim();
    document.body.insertBefore(topWrap.firstChild, document.body.firstChild);
    const bottomWrap = document.createElement('div');
    bottomWrap.innerHTML = bottombarHtml.trim();
    document.body.appendChild(bottomWrap.firstChild);
    document.querySelectorAll('.bottombar-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.page === currentPageKey());
    });
    document.body.classList.add('has-bottombar');
  }

  // ---------------------------------------------------------------- goals badge
  function updateGoalsBadge() {
    const badge = document.getElementById('bottombarGoalsBadge');
    if (!badge) return;
    try {
      const now = new Date();
      const d = new Date(now);
      if (now.getHours() < 6) d.setDate(d.getDate() - 1);
      const key = 'goals:' + d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      const goals = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(goals) || goals.length === 0) { badge.classList.remove('show'); return; }
      const done = goals.filter(g => g.done).length;
      badge.textContent = done + '/' + goals.length;
      badge.classList.add('show');
    } catch { badge.classList.remove('show'); }
  }

  // ---------------------------------------------------------------- water
  function calendarDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function getWaterProgress() {
    let state = null;
    try { state = JSON.parse(localStorage.getItem('po_water_v1')); } catch (e) {}
    if (!state) return { done: 0, total: 0 };
    const todayKey = calendarDateKey();
    const done = (state.logs || {})[todayKey] || 0;
    const p = state.profile || { weightKg: 75 };
    const wKg = state.weightUnit === 'lb' ? (p.weightKg || 0) / 2.20462 : (p.weightKg || 0);
    const base = wKg * 35;
    const exercise = (p.activityHrsPerWeek || 0) / 7 * 500;
    const caffeine = Math.max(0, (state.caffeineMgPerDay || 0) - 200) * 1.5;
    const subs = (state.substances || []).reduce((s, x) => {
      const dose = (x && x.dose != null ? x.dose : (x && x.defaultDose)) || 0;
      return s + Math.max(0, dose * ((x && x.mlPerUnit) || 0));
    }, 0);
    let adjust = 0;
    if (p.sex === 'm') adjust += 200;
    if ((p.age || 0) >= 50) adjust += 100;
    const totalMl = base + exercise + caffeine + subs + adjust;
    let unitVol;
    if (state.unit === 'glass') unitVol = state.glassMl || 250;
    else if (state.unit === 'oz') unitVol = 30;
    else if (state.unit === 'ml') unitVol = 1;
    else unitVol = state.bottleMl || 500;
    const total = Math.max(1, Math.ceil(totalMl / unitVol));
    return { done, total };
  }
  function render() {
    const waterEl = document.getElementById('topbarWater');
    if (!waterEl) return;
    const w = getWaterProgress();
    const countEl = document.getElementById('topbarWaterCount');
    if (countEl) countEl.textContent = w.total ? w.done + '/' + w.total : '0/0';
  }
  function defaultWaterState() {
    return {
      unit: 'bottle', bottleMl: 500, glassMl: 250, weightUnit: 'kg',
      profile: { weightKg: 75, age: 25, sex: 'm', activityHrsPerWeek: 5 },
      caffeineMgPerDay: 200, substances: [], logs: {}
    };
  }
  async function pushWaterMergedToSupabase(localWater) {
    if (window.location.pathname.endsWith('health.html')) return;
    if (!window.supabase || !TOPBAR_SUPABASE_URL) return;
    if (TOPBAR_SUPABASE_URL.indexOf('PASTE-') === 0) return;
    try {
      const supa = window.supabase.createClient(TOPBAR_SUPABASE_URL, TOPBAR_SUPABASE_KEY);
      const { data } = await supa.from('app_state').select('data').eq('key', 'health').maybeSingle();
      const current = (data && data.data) || {};
      const merged = Object.assign({}, current, { po_water_v1: localWater });
      await supa.from('app_state').upsert({ key: 'health', data: merged, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    } catch (e) {}
  }
  function addWater() {
    let state = null;
    try { state = JSON.parse(localStorage.getItem('po_water_v1')); } catch (e) {}
    if (!state || typeof state !== 'object') state = defaultWaterState();
    state.logs = state.logs || {};
    const k = calendarDateKey();
    state.logs[k] = (state.logs[k] || 0) + 1;
    try { localStorage.setItem('po_water_v1', JSON.stringify(state)); } catch (e) {}
    render();
    const btn = document.getElementById('topbarWaterAdd');
    if (btn) { btn.classList.add('flash'); setTimeout(() => btn.classList.remove('flash'), 220); }
    pushWaterMergedToSupabase(state);
  }

  // ---------------------------------------------------------------- gesture / modal lock
  function blockGesture(e) { e.preventDefault(); }
  function lockGestures() {
    document.addEventListener('gesturestart', blockGesture, { passive: false });
    document.addEventListener('gesturechange', blockGesture, { passive: false });
    document.addEventListener('gestureend', blockGesture, { passive: false });
    let lastTouch = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouch <= 300) e.preventDefault();
      lastTouch = now;
    }, { passive: false });
  }
  function startModalLock() {
    const SELECTORS = ['.modal-bg', '.po-modal-bg', '.wt-overlay', '.wt-viewer', '.wt-cam'];
    function anyOpen() {
      for (const sel of SELECTORS) {
        for (const el of document.querySelectorAll(sel)) {
          if (el.classList.contains('show') || el.classList.contains('is-open')) return true;
        }
      }
      return false;
    }
    function sync() { document.body.classList.toggle('topbar-modal-open', anyOpen()); }
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
    sync();
  }

  // ---------------------------------------------------------------- boot
  function boot() {
    injectStyleAndHTML();
    const btn = document.getElementById('topbarWaterAdd');
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); addWater(); });
    render();
    updateGoalsBadge();
    lockGestures();
    startModalLock();
    window.addEventListener('storage', (e) => {
      render();
      if (e.key && e.key.startsWith('goals:')) updateGoalsBadge();
    });
    window.addEventListener('focus', render);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
    setInterval(render, 30 * 1000);
    setInterval(updateGoalsBadge, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
