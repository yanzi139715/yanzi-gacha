// 游戏状态管理
const GameState = {
  STORAGE_KEY: 'yanzi-gacha-state',

  defaultState() {
    return {
      tickets: 3,          // 抽卡券
      coins: 0,            // 金币
      collection: [],      // 已收集卡牌 ['charId_imageIdx', ...]
      pityCount: 0,        // SSR保底计数
      totalPulls: 0,       // 总抽卡次数
      lastCheckin: '',     // 上次签到日期
      sharedWechat: false,
      sharedQQ: false,
      sharedWeibo: false,
      inviteCount: 0
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
    this.renderBanner();
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

  doSinglePull() {
    const result = GachaEngine.singlePull();
    if (!result.success) {
      alert(result.reason);
      return;
    }
    UI.updateStatusBar();
    UI.showPullResults(result.cards);
  },

  doTenPull() {
    const result = GachaEngine.tenPull();
    if (!result.success) {
      alert(result.reason);
      return;
    }
    UI.updateStatusBar();
    UI.showPullResults(result.cards);
  },

  renderBanner() {
    const ssrCards = getCardsByRarity('SSR');
    if (ssrCards.length > 0) {
      const banner = document.getElementById('banner');
      banner.style.backgroundImage = `url(${ssrCards[0].src})`;
    }
  },

  renderCharPreview() {
    const container = document.getElementById('char-preview');
    container.innerHTML = CHARACTERS.map(char => {
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
