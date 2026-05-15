// ============================================================
// Memoria Network · 主应用（路由 + 启动）
// ============================================================
const app = {
  init() {
    // 启动：补预留字段 + schema migrate
    GameState.bootstrap();

    this.bindNav();
    this.bindSettings();
    this.bindInvite();

    // 初始页：卡池
    UI.updateStatusBar();
    UI.renderChannel();
  },

  bindNav() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.switchTab(btn.dataset.tab);
      });
    });
    // battle 自己处理键盘（在 iframe 内）
  },

  bindSettings() {
    const btn = document.getElementById('settings-btn');
    const panel = document.getElementById('settings-panel');
    const mask = document.getElementById('settings-mask');
    const closeBtn = document.getElementById('settings-close');
    const sfxT = document.getElementById('toggle-sfx');
    const vibT = document.getElementById('toggle-vibrate');
    const fastT = document.getElementById('toggle-fast');
    if (!btn || !panel) return;

    sfxT.checked = SFX.enabled;
    vibT.checked = SFX.vibrateEnabled;
    fastT.checked = !!GameState.get().fastPull;

    const open = () => { panel.classList.add('show'); mask.classList.add('show'); };
    const close = () => { panel.classList.remove('show'); mask.classList.remove('show'); };
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    mask.addEventListener('click', close);

    sfxT.addEventListener('change', () => { SFX.setEnabled(sfxT.checked); if (sfxT.checked) SFX.click(); });
    vibT.addEventListener('change', () => { SFX.setVibrateEnabled(vibT.checked); if (vibT.checked) SFX.vibrate([50]); });
    fastT.addEventListener('change', () => {
      const s = GameState.get();
      s.fastPull = fastT.checked;
      GameState.save(s);
      SFX.click();
    });
  },

  bindInvite() {
    // ?inviter=XXX → 奖励 1 张当前 coser 抽卡券（一次性）
    const params = new URLSearchParams(window.location.search);
    const inviter = params.get('inviter');
    if (inviter) {
      const s = GameState.get();
      if (!s._invited) {
        s._invited = true;
        s.coserData[s.currentCoser].tickets = (s.coserData[s.currentCoser].tickets || 0) + 1;
        GameState.save(s);
        UI.updateStatusBar();
        setTimeout(() => alert(`✦ 欢迎通过 SYNC 邀请来到 Memoria Network\n+1 ${COSERS[s.currentCoser].name} 抽卡券`), 600);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
