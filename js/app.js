// 游戏状态管理
const GameState = {
  STORAGE_KEY: 'yanzi-gacha-state',

  defaultState() {
    return {
      tickets: 3,          // 通用抽卡券
      coins: 0,            // 金币
      collection: [],      // 已收集卡牌 ['charId_imageIdx', ...]
      pityCount: 0,        // 旧版保底计数（兼容）
      pity_standard: 0,    // 混池保底
      pity_limited: 0,     // 限定池保底
      pity_bunny: 0,       // 兔女郎池保底
      ticket_standard: 0,  // 混池专属券
      ticket_limited: 0,   // 限定池专属券
      ticket_bunny: 0,     // 兔女郎池专属券
      totalPulls: 0,       // 总抽卡次数
      lastCheckin: '',     // 上次签到日期
      sharedWechat: false,
      sharedQQ: false,
      sharedWeibo: false,
      inviteCount: 0,
      currentPool: 'standard', // 当前选中的卡池
      freePullUsed: {}     // 每池免费抽使用记录 { poolId: 'YYYY-MM-DD' }
    };
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
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// 主应用
const app = {
  init() {
    this.bindEvents();
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
    // Tab切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
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

    // 更新按钮文案
    this.updatePullButtons(poolId);

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

    if (pool.bgImage) {
      banner.style.backgroundImage = `url(${pool.bgImage})`;
    } else {
      // 从卡池中取第一张SSR
      const ssrCards = getCardsByRarityInPool('SSR', poolId);
      banner.style.backgroundImage = ssrCards.length > 0 ? `url(${ssrCards[0].src})` : '';
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
        countdownEl.style.display = 'block';
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

  // 更新抽卡按钮文案
  updatePullButtons(poolId) {
    const singleBtn = document.getElementById('btn-single');
    const tenBtn = document.getElementById('btn-ten');
    if (singleBtn) singleBtn.innerHTML = `<span class="btn-icon">&#9733;</span> 单抽`;
    if (tenBtn) tenBtn.innerHTML = `<span class="btn-icon">&#9733;&#9733;</span> 十连抽`;
  },

  doSinglePull() {
    const state = GameState.get();
    const poolId = state.currentPool || 'standard';
    const result = GachaEngine.singlePull(poolId);
    if (!result.success) {
      alert(result.reason);
      return;
    }
    UI.updateStatusBar();
    this.updatePityDisplay(poolId);
    UI.showPullResults(result.cards);
  },

  doTenPull() {
    const state = GameState.get();
    const poolId = state.currentPool || 'standard';
    const result = GachaEngine.tenPull(poolId);
    if (!result.success) {
      alert(result.reason);
      return;
    }
    UI.updateStatusBar();
    this.updatePityDisplay(poolId);
    UI.showPullResults(result.cards);
  },

  renderCharPreview(poolId = 'standard') {
    const container = document.getElementById('char-preview');
    if (!container) return;
    const chars = getCharactersByPool(poolId);
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
