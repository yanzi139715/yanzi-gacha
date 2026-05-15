// 游戏状态管理
const GameState = {
  STORAGE_KEY: 'memoria-yanzi-state',
  LEGACY_KEY: 'yanzi-gacha-state',  // 兼容旧 key
  SCHEMA_VERSION: 1,                  // 当前 schema 版本，将来 migrate 用

  defaultState() {
    return {
      // === 玩家资产 ===
      tickets: 3,          // 通用抽卡券
      coins: 0,            // Beacon
      echoShards: 0,       // 共鸣碎片 Echo Shard（重复 SSR 转化的新货币）
      collection: [],      // 已收集卡牌 ['charId_imageIdx', ...]
      skinUnlocks: {},     // 阶段解锁 { 'charId_idx': { pulls: N, level: 1-5 } }

      // === 保底 / 卡池 ===
      pityCount: 0,        // 旧版保底计数（兼容）
      pity_standard: 0,    // 混池保底
      pity_limited: 0,     // 限定池保底
      pity_bunny: 0,       // 兔女郎池保底
      ticket_standard: 0,  // 混池专属券
      ticket_limited: 0,
      ticket_bunny: 0,
      totalPulls: 0,
      currentPool: 'standard',
      freePullUsed: {},

      // === 任务 / 社交 ===
      lastCheckin: '',
      sharedWechat: false,
      sharedQQ: false,
      sharedWeibo: false,
      inviteCount: 0,

      // === 皮肤系统 ===
      mainSkin: null,        // 主皮肤 key (charId_idx，仅 SSR)
      battleSkins: {         // 战斗 archetype 对应皮肤 key
        A: null, B: null, C: null
      },

      // === 体验设置 ===
      fastPull: false,       // 快速抽卡（跳过 R/SR 仪式，SSR 仪式保留）

      // === V2.0 账号系统预留（现在不用，预留 schema 避免将来迁移痛苦）===
      _schemaVersion: this.SCHEMA_VERSION,
      _localSoulId: null,    // 本地"魂"ID（UUID），启动时若空则生成。账号绑定锚点
      _cloudBound: false,    // 是否已绑定云端账号
      _accountId: null,      // 服务端 user_id (V2.0 启用)
      _lastSyncedAt: null,   // 与云端最后同步时间戳 (ISO 8601)
      _pendingMigrate: false // 待迁移标记（旧设备）
    };
  },

  // 启动时调用：补 _localSoulId、做 schema migrate
  bootstrap() {
    const s = this.get();
    let dirty = false;

    if (!s._localSoulId) {
      s._localSoulId = this._genUuid();
      dirty = true;
    }

    // 旧 storage key 数据迁移
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const legacy = localStorage.getItem(this.LEGACY_KEY);
      if (legacy) {
        try {
          const old = JSON.parse(legacy);
          Object.assign(s, old);
          dirty = true;
        } catch {}
      }
    }

    // 将来 schema 升级在此 switch
    if ((s._schemaVersion || 0) < this.SCHEMA_VERSION) {
      // TODO: 各版本 migrate 逻辑
      s._schemaVersion = this.SCHEMA_VERSION;
      dirty = true;
    }

    if (dirty) this.save(s);
    return s;
  },

  _genUuid() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    // 兜底
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  get() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return this.defaultState();
      const state = JSON.parse(data);
      return { ...this.defaultState(), ...state };
    } catch {
      return this.defaultState();
    }
  },

  save(state) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    // 预留 hook：V2.0 在此触发云端同步
    if (this._cloudSyncHook) this._cloudSyncHook(state);
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // ====== V2.0 账号系统预留接口（现在 stub，将来实现）======
  // 注册/登录：绑定本地 soulId 到云端 accountId
  async bindAccount(/* accountId, authToken */) {
    // TODO V2.0: POST /api/migrate { _localSoulId, full_state } → 返回 accountId
    console.warn('[Memoria] bindAccount stub — V2.0 not yet implemented');
  },
  // 云端拉取：覆盖本地状态（换设备登录）
  async pullFromCloud() {
    // TODO V2.0: GET /api/state → merge → save
    console.warn('[Memoria] pullFromCloud stub');
  },
  // 云端推送：将本地状态推到云端
  async pushToCloud() {
    // TODO V2.0: POST /api/state { full_state, _lastSyncedAt }
    console.warn('[Memoria] pushToCloud stub');
  },
  // 设置云同步 hook（save 时自动触发）
  setCloudSyncHook(fn) {
    this._cloudSyncHook = fn;
  }
};

// 主应用
const app = {
  init() {
    // 启动时补预留字段 + schema migrate
    GameState.bootstrap();

    this.bindEvents();
    this.bindSettings();
    UI.updateStatusBar();
    this.renderPoolSelector();
    this.switchPool('standard');
    this.renderCharPreview();

    // 检查邀请链接参数
    const params = new URLSearchParams(window.location.search);
    if (params.get('inviter')) {
      const state = GameState.get();
      if (!state._invited) {
        state.tickets += 1;
        state._invited = true;
        GameState.save(state);
        UI.updateStatusBar();
        setTimeout(() => alert('欢迎！你通过好友邀请来到这里，获得1张抽卡券！'), 500);
      }
    }
  },

  bindEvents() {
    // Tab切换 / 频率战外跳
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.hasAttribute('data-battle-link')) {
          window.location.href = 'battle/';
          return;
        }
        UI.switchTab(btn.dataset.tab);
      });
    });

    // 抽卡按钮
    document.getElementById('btn-single').addEventListener('click', () => this.doSinglePull());
    document.getElementById('btn-ten').addEventListener('click', () => this.doTenPull());

    // 图鉴筛选
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        UI.renderCollection(btn.dataset.filter);
      });
    });
  },

  // 设置面板:音效 + 震动开关,持久化到 localStorage
  bindSettings() {
    const btn = document.getElementById('settings-btn');
    const panel = document.getElementById('settings-panel');
    const mask = document.getElementById('settings-mask');
    const closeBtn = document.getElementById('settings-close');
    const toggleSfx = document.getElementById('toggle-sfx');
    const toggleVib = document.getElementById('toggle-vibrate');
    const toggleFast = document.getElementById('toggle-fast');
    if (!btn || !panel) return;

    toggleSfx.checked = SFX.enabled;
    toggleVib.checked = SFX.vibrateEnabled;
    if (toggleFast) toggleFast.checked = !!GameState.get().fastPull;

    const open = () => {
      panel.classList.add('show');
      mask.classList.add('show');
    };
    const close = () => {
      panel.classList.remove('show');
      mask.classList.remove('show');
    };

    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    mask.addEventListener('click', close);

    toggleSfx.addEventListener('change', () => {
      SFX.setEnabled(toggleSfx.checked);
      if (toggleSfx.checked) SFX.click();
    });
    toggleVib.addEventListener('change', () => {
      SFX.setVibrateEnabled(toggleVib.checked);
      if (toggleVib.checked) SFX.vibrate([50]);
    });
    if (toggleFast) {
      toggleFast.addEventListener('change', () => {
        const s = GameState.get();
        s.fastPull = toggleFast.checked;
        GameState.save(s);
        SFX.click();
      });
    }
  },

  // 渲染卡池选择器
  renderPoolSelector() {
    const container = document.getElementById('pool-tabs');
    if (!container) return;

    container.innerHTML = Object.entries(POOL_CONFIG).map(([id, pool]) => {
      const isLimited = pool.type === 'limited';
      const limitedClass = isLimited ? 'pool-limited' : '';
      return `<div class="pool-tab ${limitedClass}" data-pool="${id}" onclick="app.switchPool('${id}')">
        <span class="pool-tab-name">${pool.name}</span>
        ${isLimited ? '<span class="pool-badge">限定</span>' : ''}
      </div>`;
    }).join('');
  },

  // 切换卡池
  switchPool(poolId) {
    const pool = POOL_CONFIG[poolId];
    if (!pool) return;

    const state = GameState.get();
    state.currentPool = poolId;
    GameState.save(state);

    // 更新tab高亮
    document.querySelectorAll('.pool-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.pool === poolId);
    });

    // 更新banner
    this.renderBanner(poolId);

    // 更新保底显示
    this.updatePityDisplay(poolId);

    // 更新当前卡池角色预览
    this.renderCharPreview(poolId);

    // 检查限定池是否过期
    if (pool.type === 'limited' && pool.endDate) {
      const now = new Date();
      const end = new Date(pool.endDate + 'T23:59:59');
      if (now > end) {
        document.getElementById('btn-single').disabled = true;
        document.getElementById('btn-ten').disabled = true;
        document.getElementById('pool-expired-msg').textContent = '该限定卡池已结束';
        document.getElementById('pool-expired-msg').style.display = 'block';
      } else {
        document.getElementById('btn-single').disabled = false;
        document.getElementById('btn-ten').disabled = false;
        document.getElementById('pool-expired-msg').style.display = 'none';
      }
    } else {
      document.getElementById('btn-single').disabled = false;
      document.getElementById('btn-ten').disabled = false;
      document.getElementById('pool-expired-msg').style.display = 'none';
    }
  },

  // 渲染卡池banner
  renderBanner(poolId) {
    const pool = POOL_CONFIG[poolId];
    const banner = document.getElementById('banner');
    if (!banner) return;

    // banner 主图：限定池优先用 UP 角色，常驻池随机选一张该池 SSR
    let bgSrc = pool.bgImage;
    if (!bgSrc && pool.rateUpCharId) {
      const upChar = getCharacterById(pool.rateUpCharId);
      const upSsr = upChar?.images.find(i => i.rarity === 'SSR');
      if (upSsr) bgSrc = upSsr.src;
    }
    if (!bgSrc) {
      const ssrCards = getCardsByRarityInPool('SSR', poolId);
      if (ssrCards.length > 0) bgSrc = ssrCards[0].src;
    }
    banner.style.backgroundImage = bgSrc ? `url("${bgSrc}")` : '';

    // 限定池视觉强化
    const isLimited = pool.type === 'limited';
    banner.classList.toggle('banner-limited', isLimited);
    const upTag = document.getElementById('banner-up-tag');
    if (upTag) {
      if (pool.rateUpCharId) {
        const upChar = getCharacterById(pool.rateUpCharId);
        upTag.textContent = isLimited
          ? `UP · 限定 · ${upChar?.name || ''}`
          : `UP · ${upChar?.name || ''}`;
        upTag.style.display = 'inline-block';
      } else {
        upTag.style.display = 'none';
      }
    }

    // 更新卡池标题
    const titleEl = document.getElementById('pool-title');
    const subtitleEl = document.getElementById('pool-subtitle');
    if (titleEl) titleEl.textContent = pool.name;
    if (subtitleEl) subtitleEl.textContent = pool.description;

    // 限定池倒计时
    const countdownEl = document.getElementById('pool-countdown');
    if (countdownEl) {
      if (pool.type === 'limited' && pool.endDate) {
        countdownEl.style.display = 'inline-block';
        this.updateCountdown(pool);
      } else {
        countdownEl.style.display = 'none';
      }
    }
  },

  // 更新限定池倒计时
  updateCountdown(pool) {
    const el = document.getElementById('pool-countdown');
    if (!el || !pool.endDate) return;

    const update = () => {
      const now = new Date();
      const end = new Date(pool.endDate + 'T23:59:59');
      const diff = end - now;
      if (diff <= 0) {
        el.textContent = '已结束';
        clearInterval(this._countdownTimer);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      el.textContent = `剩余 ${days}天${hours}时${mins}分`;
    };

    update();
    if (this._countdownTimer) clearInterval(this._countdownTimer);
    this._countdownTimer = setInterval(update, 60000);
  },

  // 更新保底显示
  updatePityDisplay(poolId) {
    const pool = POOL_CONFIG[poolId];
    const pity = GachaEngine.getPity(poolId);
    const el = document.getElementById('pity-counter');
    if (el) {
      el.textContent = `距保底: ${pity}/${pool.pityLimit}`;
      el.style.display = pity > 0 ? 'block' : 'block';
    }

    // 软保底提示
    const softEl = document.getElementById('soft-pity-hint');
    if (softEl) {
      if (pity >= pool.softPityStart) {
        softEl.textContent = `软保底已触发！当前SSR概率提升中`;
        softEl.style.display = 'block';
      } else {
        softEl.style.display = 'none';
      }
    }
  },

  _pulling: false,

  lockButtons(locked) {
    ['btn-single', 'btn-ten'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = locked;
    });
  },

  async doSinglePull() {
    if (this._pulling) return;
    const state = GameState.get();
    const poolId = state.currentPool || 'standard';
    const result = GachaEngine.singlePull(poolId);
    if (!result.success) {
      alert(result.reason);
      return;
    }
    this._pulling = true;
    this.lockButtons(true);
    UI.updateStatusBar();
    this.updatePityDisplay(poolId);
    await UI.showPullResults(result.cards);
    this._pulling = false;
    this.lockButtons(false);
  },

  async doTenPull() {
    if (this._pulling) return;
    const state = GameState.get();
    const poolId = state.currentPool || 'standard';
    const result = GachaEngine.tenPull(poolId);
    if (!result.success) {
      alert(result.reason);
      return;
    }
    this._pulling = true;
    this.lockButtons(true);
    UI.updateStatusBar();
    this.updatePityDisplay(poolId);
    await UI.showPullResults(result.cards);
    this._pulling = false;
    this.lockButtons(false);
  },

  renderCharPreview(poolId = 'standard') {
    const container = document.getElementById('char-preview');
    if (!container) return;
    const chars = getCharactersByPool(poolId);
    if (chars.length === 0) {
      container.innerHTML = '<div class="char-empty">该卡池暂无角色</div>';
      return;
    }
    container.innerHTML = chars.map(char => {
      const thumb = getCharacterThumb(char.id);
      return `<div class="char-thumb"
                   onclick="UI.showCharacterGallery(CHARACTERS.find(c=>c.id==='${char.id}'))"
                   title="${char.name}">
        <img src="${thumb}" alt="${char.name}" loading="lazy">
      </div>`;
    }).join('');
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => app.init());
