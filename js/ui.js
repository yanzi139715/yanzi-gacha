// ============================================================
// Memoria Network · UI & 渲染
// 4 tab：频率战 / 卡池 / 图鉴 / 我的
// ============================================================
const UI = {

  // ===== 顶部状态栏 =====
  updateStatusBar() {
    const state = GameState.get();
    const tag = document.getElementById('keeper-tag');
    if (tag) tag.textContent = state.keeperTag || '#';
  },

  // ===== Tab 切换 =====
  switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`[data-tab="${tab}"]`);
    if (btn) btn.classList.add('active');
    const pg = document.getElementById(`page-${tab}`);
    if (pg) pg.classList.add('active');

    // 进入时渲染
    if (tab === 'channel') this.renderChannel();
    else if (tab === 'archive') this.renderArchiveOverview();
    else if (tab === 'me') this.renderMe();
    else if (tab === 'battle') this.renderBattleHub();

    SFX.click();
    this.updateStatusBar();
  },

  // ============================================================
  // 1. 卡池页（频道 / Channel）
  // ============================================================
  renderChannel() {
    const list = document.getElementById('channel-list');
    const state = GameState.get();
    const cosers = listCosers();
    // 顶部 coser tabs
    const tabsHtml = `
      <div class="ch-ctab-title-row">UP 合集</div>
      <div class="ch-coser-tabs">
        ${cosers.map(c => `
          <button class="ch-ctab ${state.currentCoser === c.id ? 'active' : ''} ${c.id === 'aria' ? 'vir' : ''}"
                  onclick="UI.scrollToCoser('${c.id}')">${c.name}</button>
        `).join('')}
        <button class="ch-ctab more" onclick="UI._toastLockedFeature()">更多 +</button>
      </div>
    `;
    list.innerHTML = tabsHtml + cosers.map(coser => this._renderCoserChannelCard(coser, state)).join('') + `
      <div class="cs-card-add" onclick="UI._toastLockedFeature()">
        <div class="cs-card-add-icon">＋</div>
        <div class="cs-card-add-text">解锁更多 Memoria</div>
        <div class="cs-card-add-sub">输入 SYNC 码 · 接入新 coser</div>
      </div>
    `;
  },

  // === 空 Beacon 引导 modal（screen 23）===
  _showEmptyBeacon(reason, poolId) {
    SFX.click();
    const pool = POOLS[poolId];
    const coserId = pool?.coserId || GameState.get().currentCoser;
    const coser = COSERS[coserId];
    let modal = document.getElementById('empty-beacon-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'empty-beacon-modal';
      modal.className = 'eb-modal';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="eb-mask" onclick="document.getElementById('empty-beacon-modal').classList.remove('show')"></div>
      <div class="eb-card">
        <div class="eb-decay">
          <span class="eb-decay-line"></span>
          <span class="eb-decay-text">频率衰弱中</span>
          <span class="eb-decay-line"></span>
        </div>
        <h2 class="eb-title">${coser?.name || ''} 的呼唤在远去</h2>
        <p class="eb-sub">${reason}</p>
        <p class="eb-quote">"她还在等你 · 但 Sync 振铃已用尽"</p>
        <button class="eb-cta" onclick="document.getElementById('empty-beacon-modal').classList.remove('show'); UI.openCrystalStation();">
          <span class="eb-cta-cn">充值 Beacon · 继续守护</span>
          <span class="eb-cta-en">CHARGE · CRYSTAL STATION</span>
        </button>
        <button class="eb-close" onclick="document.getElementById('empty-beacon-modal').classList.remove('show')">稍后再说</button>
      </div>
    `;
    requestAnimationFrame(() => modal.classList.add('show'));
  },

  _showPoolRules(poolId) {
    // 跳到合规公示 · 概率公示 tab（法规要求页）
    this.openLegal('prob');
  },

  scrollToCoser(coserId) {
    const state = GameState.get();
    state.currentCoser = coserId;
    const pools = getPoolsByCoser(coserId);
    state.currentPool = pools[0]?.id || state.currentPool;
    GameState.save(state);
    SFX.click();
    this.renderChannel();
    // 滚动到对应 card
    setTimeout(() => {
      const card = document.querySelector(`.cs-card[data-coser="${coserId}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  },

  _renderCoserChannelCard(coser, state) {
    const cdata = state.coserData[coser.id];
    const pools = getPoolsByCoser(coser.id);
    // 当前选中的池（限定优先）
    const mainPool = pools.find(p => p.type === 'limited') || pools[0];
    const isCurrent = state.currentCoser === coser.id;
    const pity = cdata[`pity_${mainPool.id.replace(/-/g,'_')}`] || 0;
    const softNear = pity >= mainPool.softPityStart;
    const progress = GachaEngine.getCoserProgress(coser.id);

    const tierClass = coser.id === 'aria' ? 'vir' : '';

    // 限定池倒计时
    let countdownHtml = '';
    if (mainPool.endDate) {
      const end = new Date(mainPool.endDate + 'T23:59:59');
      const diff = end.getTime() - Date.now();
      if (diff > 0) {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        countdownHtml = `<span class="cs-card-cd ${d < 3 ? 'urgent' : ''}">⏳ 剩余 ${d}天${h}时${m}分</span>`;
      } else {
        countdownHtml = `<span class="cs-card-cd expired">已结束</span>`;
      }
    }

    return `
      <div class="cs-card ${isCurrent ? 'current' : ''}" data-coser="${coser.id}" onclick="UI.selectCoser('${coser.id}')">
        <div class="cs-card-img">
          <img src="${coser.coverImage}" alt="${coser.name}" loading="lazy">
          <div class="cs-card-mask"></div>
          <span class="cs-card-tier ${tierClass}">${coser.tier}</span>
          ${countdownHtml}
          <div class="cs-card-name">${coser.name}</div>
          <div class="cs-card-chapter">${coser.chapter}</div>
          <div class="cs-card-tagline">${coser.chapterDesc}</div>
        </div>
        <div class="cs-card-body">
          <!-- per-coser 资源 mini chip 行 -->
          <div class="cs-card-assets">
            <span class="cs-asset-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> ${cdata.tickets || 0}</span>
            <span class="cs-asset-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg> ${cdata.beacon || 0}</span>
            <span class="cs-asset-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 L13.6 10.4 22 12 L13.6 13.6 12 22 L10.4 13.6 2 12 L10.4 10.4 Z"/></svg> ${cdata.fragment || 0}</span>
            <span style="margin-left:auto" class="cs-asset-prog">守护 ${progress.collected}/${progress.total}</span>
          </div>
          <div class="cs-card-meta">
            <span class="cs-sync-label">SYNC ${pity}/${mainPool.pityLimit}</span>
            <span class="cs-card-pity ${softNear ? 'soft' : ''}">
              ${softNear
                ? '软保底已触发 · 即将共鸣'
                : pity >= mainPool.pityLimit - 12
                  ? `还剩 ${mainPool.pityLimit - pity} 抽触发 RES`
                  : '蓄能中'}
            </span>
            <a class="cs-rule-link" onclick="event.stopPropagation(); UI._showPoolRules('${mainPool.id}')">详细规则 →</a>
          </div>
          <div class="cs-card-rates">
            <span class="r-chip ssr">RES 3%</span>
            <span class="r-chip sr">ECHO 15%</span>
            <span class="r-chip r">SIGNAL 82%</span>
          </div>
          <div class="cs-card-pull-row">
            <button class="cs-pull-btn" onclick="event.stopPropagation(); UI.doPull('${mainPool.id}','single')">
              <span class="cs-pull-glyph">✦</span>
              <span class="cs-pull-text">单抽 SINGLE</span>
              <span class="cs-pull-cost">1 券 · 或 10 BEACON</span>
            </button>
            <button class="cs-pull-btn ten" onclick="event.stopPropagation(); UI.doPull('${mainPool.id}','ten')">
              <span class="cs-pull-glyph">✦✦</span>
              <span class="cs-pull-text">十连 TEN-PULL</span>
              <span class="cs-pull-cost">10 券 · 或 100 BEACON</span>
              <span class="cs-pull-badge">保底 ECHO</span>
            </button>
          </div>
          ${pools.length > 1 ? `
            <div class="cs-card-meta">
              ${pools.map(p => `
                <span class="cs-card-pity ${p.id === mainPool.id ? 'soft' : ''}" style="cursor:pointer" onclick="event.stopPropagation(); UI.switchPool('${p.id}')">
                  ${p.name.replace(coser.name + ' · ', '')}
                </span>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  selectCoser(coserId) {
    const s = GameState.get();
    s.currentCoser = coserId;
    // 当前 coser 默认池
    const pools = getPoolsByCoser(coserId);
    s.currentPool = pools[0]?.id || 'standard';
    GameState.save(s);
    SFX.click();
    this.updateStatusBar();
    this.renderChannel();
  },

  switchPool(poolId) {
    const s = GameState.get();
    s.currentPool = poolId;
    GameState.save(s);
    this.renderChannel();
  },

  async doPull(poolId, kind) {
    if (this._pulling) return;
    this._pulling = true;
    const result = kind === 'ten'
      ? GachaEngine.tenPull(poolId)
      : GachaEngine.singlePull(poolId);
    if (!result.success) {
      this._pulling = false;
      this._showEmptyBeacon(result.reason, poolId);
      return;
    }
    this.updateStatusBar();
    this.renderChannel();
    await this.showPullResults(result.cards);
    this._pulling = false;
    // 抽到 SSR 后跨页引导 toast
    const ssrCards = result.cards.filter(c => c.rarity === 'SSR' && !c.isDuplicate);
    if (ssrCards.length > 0) {
      const c = ssrCards[0];
      this.showToast({
        icon: '✦',
        title: `${c.characterName} · 已加入图鉴`,
        sub: `RESONANCE · 新守护${ssrCards.length > 1 ? ` (+${ssrCards.length - 1} 张其他 RES)` : ''}`,
        actions: [
          { label: '去图鉴', cb: () => UI.switchTab('archive') },
          { label: '设为战斗皮肤', cb: () => UI._setSsrAsBattleSkin(c.uid) }
        ]
      });
    }
  },

  // 公共 toast 组件
  // ============================================================
  // 通用 modal（替代 alert/confirm/prompt）
  // ============================================================
  _closeModal() {
    const mask = document.getElementById('mem-modal-mask');
    if (mask) { mask.classList.remove('show'); setTimeout(() => mask.remove(), 250); }
  },
  _confirmModal({ icon = '✦', title, sub = '', primary = '确认', secondary = '取消', onOk, onCancel, danger = false } = {}) {
    this._closeModal();
    const mask = document.createElement('div');
    mask.id = 'mem-modal-mask';
    mask.className = 'mem-modal-mask';
    mask.innerHTML = `
      <div class="mem-modal" role="dialog">
        <div class="mem-modal-icon">${icon}</div>
        <div class="mem-modal-title">${title}</div>
        ${sub ? `<div class="mem-modal-sub">${sub}</div>` : ''}
        <div class="mem-modal-actions">
          <button class="mem-modal-btn secondary" data-cancel>${secondary}</button>
          <button class="mem-modal-btn ${danger ? 'danger' : 'primary'}" data-ok>${primary}</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    requestAnimationFrame(() => mask.classList.add('show'));
    mask.querySelector('[data-ok]').addEventListener('click', () => { this._closeModal(); onOk?.(); });
    mask.querySelector('[data-cancel]').addEventListener('click', () => { this._closeModal(); onCancel?.(); });
    mask.addEventListener('click', e => { if (e.target === mask) { this._closeModal(); onCancel?.(); } });
  },
  _pickerModal({ icon = '◉', title, sub = '', items = [], onPick, cancelLabel = '取消' } = {}) {
    this._closeModal();
    const mask = document.createElement('div');
    mask.id = 'mem-modal-mask';
    mask.className = 'mem-modal-mask';
    mask.innerHTML = `
      <div class="mem-modal picker" role="dialog">
        <div class="mem-modal-icon">${icon}</div>
        <div class="mem-modal-title">${title}</div>
        ${sub ? `<div class="mem-modal-sub">${sub}</div>` : ''}
        <div class="mem-modal-list">
          ${items.map((it, i) => `
            <div class="mem-modal-item" data-i="${i}">
              <span class="num">${i + 1}</span>
              <span class="label">${it.label}</span>
              ${it.meta ? `<span class="meta">${it.meta}</span>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="mem-modal-actions">
          <button class="mem-modal-btn secondary" data-cancel>${cancelLabel}</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    requestAnimationFrame(() => mask.classList.add('show'));
    mask.querySelectorAll('.mem-modal-item').forEach(el => {
      el.addEventListener('click', () => {
        const i = parseInt(el.dataset.i);
        this._closeModal();
        onPick?.(items[i], i);
      });
    });
    mask.querySelector('[data-cancel]').addEventListener('click', () => this._closeModal());
    mask.addEventListener('click', e => { if (e.target === mask) this._closeModal(); });
  },

  showToast({ icon = '✦', title, sub, actions = [], duration = 5000 } = {}) {
    const old = document.getElementById('memoria-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = 'memoria-toast';
    t.className = 'mem-toast';
    t.innerHTML = `
      <span class="mem-toast-icon">${icon}</span>
      <div class="mem-toast-body">
        <div class="mem-toast-title">${title}</div>
        ${sub ? `<div class="mem-toast-sub">${sub}</div>` : ''}
      </div>
      <div class="mem-toast-actions">
        ${actions.map((a, i) => `<button class="mem-toast-btn" data-i="${i}">${a.label}</button>`).join('')}
        <button class="mem-toast-close" data-close>✕</button>
      </div>
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    t.querySelectorAll('.mem-toast-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i);
        actions[i]?.cb?.();
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
      });
    });
    t.querySelector('[data-close]').addEventListener('click', () => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    });
    setTimeout(() => {
      if (t.parentNode) { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }
    }, duration);
  },

  // 抽到 SSR 设为对应 archetype 战斗皮肤
  _setSsrAsBattleSkin(uid) {
    const [cid, idxStr] = uid.split('_');
    const ch = COSER_CHARS[cid];
    if (!ch) return;
    const letter = ch.archetype;
    const s = GameState.get();
    s.battleSkins = s.battleSkins || { A: null, B: null, C: null };
    s.battleSkins[letter] = uid;
    s._battleSkinSrcs = s._battleSkinSrcs || {};
    s._battleSkinSrcs[uid] = ch.images[parseInt(idxStr)]?.src;
    GameState.save(s);
    this.showToast({
      icon: '⚔',
      title: `${ch.name} · 已设为 ${letter} 型战斗皮肤`,
      sub: `点频率战 tab 即可出战`,
      actions: [{ label: '去频率战', cb: () => UI.switchTab('battle') }],
      duration: 4000
    });
  },

  // ============================================================
  // 抽卡仪式（保留旧实现）
  // ============================================================
  async showPullResults(cards, callback) {
    const overlay = document.getElementById('pull-overlay');
    const container = document.getElementById('pull-results');
    const state = GameState.get();
    const isTenPull = cards.length > 1;
    const fast = state.fastPull && isTenPull;

    const hasSSR = cards.some(c => c.rarity === 'SSR');
    const hasSR = cards.some(c => c.rarity === 'SR');
    const topRarity = hasSSR ? 'SSR' : hasSR ? 'SR' : 'R';

    SFX.click();

    // === screen 04: PULLING 过渡屏（频率连接中...）===
    if (!fast) await this.playPullingTransition();

    // === screen 05/06/07: 三档稀有度独立 reveal banner ===
    if (!fast) await this.playRarityBanner(topRarity);

    if (!fast || topRarity === 'SSR') await this.playPreReveal(topRarity);

    if (topRarity === 'SSR') {
      SFX.vibrate([60, 40, 120, 40, 200]);
      SFX.shake(1.2);
      await this.playSSRCeremony(cards.find(c => c.rarity === 'SSR'));
    } else if (topRarity === 'SR' && !fast) {
      SFX.vibrate([40, 30, 80]);
      await this.playSRCeremony();
    }

    overlay.classList.add('active');
    container.innerHTML = '';
    const stepDelay = fast ? 20 : 90;

    cards.forEach((card, index) => {
      const el = this.createCardElement(card);
      el.style.opacity = '0';
      el.style.transform = 'scale(0.3) rotate(-10deg)';
      container.appendChild(el);
      const delay = isTenPull ? index * stepDelay : 0;
      setTimeout(() => {
        el.style.transition = fast
          ? 'opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.opacity = '1';
        el.style.transform = 'scale(1) rotate(0)';
        if (!fast || card.rarity === 'SSR') SFX.cardFlip();
      }, delay);
    });

    const flipDone = isTenPull ? cards.length * stepDelay + (fast ? 200 : 400) : 500;
    setTimeout(() => {
      container.querySelectorAll('.card').forEach((el, i) => {
        const r = cards[i].rarity;
        if (r === 'SSR') {
          el.classList.add('glow-ssr');
          if (i === 0 || cards.length === 1) SFX.ssrReveal();
        } else if (r === 'SR') {
          el.classList.add('glow-sr');
          if (i === 0) SFX.srReveal();
        } else if (i === cards.length - 1 && topRarity === 'R') SFX.rReveal();
      });
    }, flipDone);

    overlay.onclick = (e) => {
      if (e.target === overlay || e.target.classList.contains('pull-results-wrapper')) {
        overlay.classList.remove('active');
        container.innerHTML = '';
        if (callback) callback();
      }
    };
  },

  // 抽卡过渡：频率连接中（screen 04）
  playPullingTransition() {
    return new Promise(resolve => {
      const stage = document.createElement('div');
      stage.className = 'pull-transition';
      stage.innerHTML = `
        <div class="pt-ring r1"></div>
        <div class="pt-ring r2"></div>
        <div class="pt-ring r3"></div>
        <div class="pt-center">
          <div class="pt-glyph">✦</div>
          <div class="pt-text">频 率 连 接 中</div>
          <div class="pt-en">SYNC · IN PROGRESS</div>
        </div>
      `;
      document.body.appendChild(stage);
      requestAnimationFrame(() => stage.classList.add('active'));
      SFX.cutIn?.() || SFX.click();
      setTimeout(() => {
        stage.classList.remove('active');
        setTimeout(() => { stage.remove(); resolve(); }, 300);
      }, 1000);
    });
  },

  // 三档稀有度独立 banner（screen 05/06/07）
  playRarityBanner(rarity) {
    return new Promise(resolve => {
      const cfg = {
        SSR: { cn: 'RESONANCE', sub: '共 鸣', color: 'var(--resonance)', accent: '#FFA952', dur: 1100 },
        SR:  { cn: 'ECHO',      sub: '回 响', color: 'var(--aurora-violet)', accent: '#FFB8D9', dur: 800 },
        R:   { cn: 'SIGNAL',    sub: '信 号', color: 'var(--aurora-cyan)', accent: '#A0D2DB', dur: 500 }
      }[rarity];
      const stage = document.createElement('div');
      stage.className = `rarity-banner rb-${rarity.toLowerCase()}`;
      stage.style.setProperty('--rb-color', cfg.color);
      stage.style.setProperty('--rb-accent', cfg.accent);
      stage.innerHTML = `
        <div class="rb-line top"></div>
        <div class="rb-text">
          <div class="rb-cn">${cfg.sub}</div>
          <div class="rb-en">${cfg.cn}</div>
        </div>
        <div class="rb-line bot"></div>
      `;
      document.body.appendChild(stage);
      requestAnimationFrame(() => stage.classList.add('active'));
      setTimeout(() => {
        stage.classList.remove('active');
        setTimeout(() => { stage.remove(); resolve(); }, 200);
      }, cfg.dur);
    });
  },

  playPreReveal(topRarity) {
    return new Promise(resolve => {
      const veil = document.createElement('div');
      veil.className = `prereveal prereveal-${topRarity.toLowerCase()}`;
      document.body.appendChild(veil);
      const dur = topRarity === 'SSR' ? 900 : topRarity === 'SR' ? 600 : 350;
      setTimeout(() => {
        veil.classList.add('fading');
        setTimeout(() => { veil.remove(); resolve(); }, 200);
      }, dur);
    });
  },

  playSSRCeremony(card) {
    return new Promise(resolve => {
      const stage = document.createElement('div');
      stage.className = 'ssr-cutin-overlay';
      stage.innerHTML = `
        <div class="ssr-cutin-beam"></div>
        <div class="ssr-cutin-portrait">
          <img src="${card.image}" alt="${card.characterName}">
        </div>
        <div class="ssr-cutin-text">
          <div class="ssr-cutin-rarity">RESONANCE</div>
          <div class="ssr-cutin-name">${card.characterName}</div>
        </div>
        <div class="ssr-cutin-particles"></div>
      `;
      document.body.appendChild(stage);
      requestAnimationFrame(() => stage.classList.add('active'));
      setTimeout(() => { stage.remove(); resolve(); }, 2000);
    });
  },

  playSRCeremony() {
    return new Promise(resolve => {
      const stage = document.createElement('div');
      stage.className = 'sr-beam-overlay';
      document.body.appendChild(stage);
      requestAnimationFrame(() => stage.classList.add('active'));
      setTimeout(() => { stage.remove(); resolve(); }, 1000);
    });
  },

  createCardElement(card) {
    const el = document.createElement('div');
    el.className = `card card-${card.rarity.toLowerCase()}`;
    const config = RARITY_CONFIG[card.rarity];
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${card.image}" alt="${card.characterName}" loading="lazy">
          <div class="card-info">
            <span class="card-rarity" style="background: ${config.gradient}">${config.shortLabel}</span>
            <span class="card-name">${card.characterName}</span>
          </div>
          ${card.isDuplicate && card.rarity === 'SSR'
            ? `<div class="card-duplicate card-dup-ssr">
                 ${card.unlockLevelUp ? `<span class="dup-unlock">解锁 Lv.${card.unlockLevelUp.to}</span>` : '<span class="dup-unlock">已满凸</span>'}
                 <span class="dup-shard">+${card.echoShardGain} 共鸣碎片</span>
               </div>`
            : card.isDuplicate
              ? `<div class="card-duplicate">重复 +${card.coinValue} Beacon</div>`
              : ''}
        </div>
      </div>
    `;
    el.onclick = (e) => { e.stopPropagation(); this.showCardDetail(card); };
    return el;
  },

  // === 卡牌详情全屏页（参考 wireframe screen 09） ===
  showCardDetail(card) {
    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('detail-content');
    const config = RARITY_CONFIG[card.rarity];
    const state = GameState.get();
    const isSSR = card.rarity === 'SSR';
    const charId = card.characterId || card.uid?.split('_')[0];
    const ch = COSER_CHARS[charId];
    const coser = ch ? COSERS[ch.coserId] : null;
    const archetype = ch?.archetype;
    const dateStr = new Date().toLocaleDateString('zh-CN');

    // SSR 才显示完整守护者页；R/SR 显示简版
    content.innerHTML = isSSR ? `
      <button class="cd-close" onclick="document.getElementById('detail-overlay').classList.remove('active')">✕</button>
      <div class="cd-bg" style="background-image:url('${card.image}')"></div>
      <div class="cd-bg-mask"></div>
      <div class="cd-scroll">
        <div class="cd-rarity-tag" style="background:${config.gradient}">${config.label}<span class="cd-rarity-short">${config.shortLabel}</span></div>
        <div class="cd-portrait-frame">
          <img src="${card.image}" class="cd-portrait" alt="${card.characterName}">
          <div class="cd-portrait-glow"></div>
        </div>
        <div class="cd-narrative">
          <div class="cd-narr-label">RESONANCE · 共鸣已建立</div>
          <h2 class="cd-name">${card.characterName}</h2>
          ${coser ? `<div class="cd-coser-line">${coser.name} · ${coser.chapter || coser.tier}</div>` : ''}
          <p class="cd-quote">"这一刻，她对上了你的频率。"</p>
          <p class="cd-desc">${card.description || ch?.description || ''}</p>
        </div>
        <div class="cd-signature">
          <div class="cd-sig-stamp">
            <span class="cd-sig-name">${coser?.name || '妍子'}</span>
            <span class="cd-sig-msg">谢谢你记住我</span>
            <span class="cd-sig-date">MEMORIA · ${dateStr}</span>
          </div>
          <div class="cd-sig-sync">SYNC #${(state._localSoulId || '').slice(0, 6).toUpperCase()}</div>
        </div>
        <div class="cd-cta-grid">
          <button class="cd-cta cd-cta-poster" onclick="UI.generatePoster('${card.uid || ''}', '${card.image.replace(/'/g, "\\'")}', '${card.characterName.replace(/'/g, "\\'")}', '${card.rarity}')">
            <span class="cd-cta-icon">✦</span>
            <span class="cd-cta-cn">生 成 海 报</span>
            <span class="cd-cta-en">SHARE</span>
          </button>
          <button class="cd-cta cd-cta-download" onclick="UI.downloadCardImage('${card.image.replace(/'/g, "\\'")}', '${card.characterName.replace(/'/g, "\\'")}')">
            <span class="cd-cta-icon">↓</span>
            <span class="cd-cta-cn">下载原图</span>
            <span class="cd-cta-en">SAVE</span>
          </button>
          <button class="cd-cta cd-cta-skin" onclick="UI.setMainSkinFromCard('${card.uid || ''}')">
            <span class="cd-cta-icon">◉</span>
            <span class="cd-cta-cn">设为守护卡</span>
            <span class="cd-cta-en">SET MAIN</span>
          </button>
          ${archetype ? `
          <button class="cd-cta cd-cta-battle" onclick="UI.setBattleSkinFromCard('${card.uid || ''}')">
            <span class="cd-cta-icon">⚔</span>
            <span class="cd-cta-cn">出战 ${archetype} 型</span>
            <span class="cd-cta-en">BATTLE</span>
          </button>` : ''}
        </div>
      </div>
    ` : `
      <button class="cd-close" onclick="document.getElementById('detail-overlay').classList.remove('active')">✕</button>
      <div class="detail-card">
        <img src="${card.image}" class="detail-img" alt="${card.characterName}">
        <div class="detail-info">
          <span class="detail-rarity-badge" style="background:${config.gradient}">${config.label}</span>
          <h2>${card.characterName}</h2>
          <p>${card.description || ch?.description || ''}</p>
          <div class="cd-small-actions">
            <button class="cd-small-btn" onclick="UI.downloadCardImage('${card.image.replace(/'/g, "\\'")}', '${card.characterName.replace(/'/g, "\\'")}')">↓ 下载</button>
          </div>
        </div>
      </div>
    `;
    overlay.classList.add('active');
    overlay.classList.toggle('cd-ssr-mode', isSSR);
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('active'); };
  },

  // === 海报生成（screen 15）===
  // 750×1100 竖版海报：上立绘 + Memoria 名 + 守护者 # + SYNC QR + 日期 + 水印
  generatePoster(uid, src, name, rarity) {
    const canvas = document.getElementById('poster-canvas');
    if (!canvas) { this.showToast({ icon: '◌', title: '海报组件未就绪', sub: '请稍后再试', duration: 2500 }); return; }
    const ctx = canvas.getContext('2d');
    const W = 750, H = 1100;
    canvas.width = W; canvas.height = H;
    const state = GameState.get();
    const ch = COSER_CHARS[(uid || '').split('_')[0]];
    const coser = ch ? COSERS[ch.coserId] : COSERS.yanzi;
    const config = RARITY_CONFIG[rarity];

    SFX.click();
    // toast 加载提示
    const loadingToast = document.createElement('div');
    loadingToast.className = 'mem-toast show';
    loadingToast.innerHTML = '<span class="mem-toast-icon">✦</span><div class="mem-toast-body"><div class="mem-toast-title">海报生成中…</div></div>';
    document.body.appendChild(loadingToast);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 背景：极光渐变 + 模糊立绘
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0A0F25');
      bgGrad.addColorStop(0.4, '#1A1535');
      bgGrad.addColorStop(1, '#060A1A');
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

      // 模糊背景图（顶部裁切区）
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.filter = 'blur(20px) saturate(1.4)';
      const bgScale = Math.max(W / img.width, H / img.height) * 1.2;
      const bgW = img.width * bgScale, bgH = img.height * bgScale;
      ctx.drawImage(img, (W - bgW) / 2, (H - bgH) / 2, bgW, bgH);
      ctx.restore();

      // 立绘卡（中央）— 圆角矩形 + 立绘
      const cardX = 75, cardY = 130, cardW = 600, cardH = 720;
      ctx.save();
      this._roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.clip();
      const imgScale = Math.max(cardW / img.width, cardH / img.height);
      const iw = img.width * imgScale, ih = img.height * imgScale;
      ctx.drawImage(img, cardX + (cardW - iw) / 2, cardY + (cardH - ih) / 2, iw, ih);
      ctx.restore();

      // 立绘金边
      ctx.strokeStyle = rarity === 'SSR' ? '#FFD89B' : (config?.color || '#C4A0FF');
      ctx.lineWidth = 3;
      this._roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.stroke();
      // glow
      ctx.shadowColor = rarity === 'SSR' ? 'rgba(255,184,90,0.6)' : 'rgba(196,160,255,0.4)';
      ctx.shadowBlur = 40; ctx.stroke();
      ctx.shadowBlur = 0;

      // 稀有度标签
      ctx.fillStyle = config?.color || '#FFD89B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(config?.label || rarity, cardX + 16, cardY + 38);

      // 顶部标题：MEMORIA
      ctx.fillStyle = '#7BC9FF';
      ctx.font = '500 24px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillText('M E M O R I A', W / 2, 60);
      ctx.fillStyle = '#9BA1C7';
      ctx.font = '300 12px "JetBrains Mono", monospace';
      ctx.fillText('· Network ·', W / 2, 86);
      ctx.fillText('被你记住，就已足够', W / 2, 108);

      // Memoria 名（立绘下方大字）
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 42px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, W / 2, 905);

      // Coser 名
      ctx.fillStyle = '#FFD89B';
      ctx.font = '400 16px "JetBrains Mono", monospace';
      ctx.fillText(`${coser?.name || ''}  ·  ${coser?.chapter || ''}`, W / 2, 935);

      // 引言
      ctx.fillStyle = '#E8EAF6';
      ctx.font = 'italic 18px "Cormorant Garamond", serif';
      ctx.fillText('"这一刻，她对上了你的频率"', W / 2, 965);

      // 守护者签名 + QR 占位
      const sigY = 1010;
      // 左侧守护者
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFD89B';
      ctx.font = '500 16px "Cormorant Garamond", serif';
      ctx.fillText(`守护者 ${state.keeperTag || '#'}`, 75, sigY);
      ctx.fillStyle = '#5C6390';
      ctx.font = '10px "JetBrains Mono", monospace';
      const today = new Date().toISOString().slice(0,10);
      ctx.fillText(`SYNC ${(state._localSoulId || '').slice(0,8).toUpperCase()} · ${today}`, 75, sigY + 18);

      // 右侧 SYNC 二维码（QR）
      const qrSize = 76, qrX = W - 75 - qrSize, qrY = sigY - 18;
      try {
        const qr = qrcode(0, 'M');
        const inviteUrl = `${location.origin}${location.pathname}?inviter=${(state._localSoulId || '').slice(0, 8)}`;
        qr.addData(inviteUrl);
        qr.make();
        const cell = qrSize / qr.getModuleCount();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
        ctx.fillStyle = '#0A0F25';
        for (let r = 0; r < qr.getModuleCount(); r++) {
          for (let c = 0; c < qr.getModuleCount(); c++) {
            if (qr.isDark(r, c)) ctx.fillRect(qrX + c * cell, qrY + r * cell, cell + 0.5, cell + 0.5);
          }
        }
        // QR 下方"扫码加入"
        ctx.fillStyle = '#5C6390';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN · JOIN', qrX + qrSize/2, qrY + qrSize + 14);
      } catch (e) { console.warn('QR fail', e); }

      // 底部水印边框
      ctx.strokeStyle = 'rgba(255,216,155,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, sigY + 70); ctx.lineTo(W - 60, sigY + 70); ctx.stroke();

      // 渲染完成
      loadingToast.remove();
      this._showPosterPreview(canvas.toDataURL('image/jpeg', 0.92), name);
    };
    img.onerror = () => { loadingToast.remove(); this.showToast({ icon: '◌', title: '图片加载失败', sub: '请检查网络或重试', duration: 2500 }); };
    img.src = src;
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  _showPosterPreview(dataUrl, name) {
    let modal = document.getElementById('poster-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'poster-modal';
      modal.className = 'poster-modal';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="pm-mask" onclick="document.getElementById('poster-modal').classList.remove('show')"></div>
      <div class="pm-card">
        <div class="pm-head">
          <span class="pm-title">✦ 共鸣海报</span>
          <button class="pm-close" onclick="document.getElementById('poster-modal').classList.remove('show')">✕</button>
        </div>
        <img class="pm-img" src="${dataUrl}" alt="poster">
        <div class="pm-hint">长按图片保存到相册 · 分享给朋友 = 邀请加入 Memoria Network</div>
        <a class="pm-save-btn" download="memoria_${name}_${Date.now()}.jpg" href="${dataUrl}">↓ 下载海报</a>
      </div>
    `;
    requestAnimationFrame(() => modal.classList.add('show'));
    SFX.ssrReveal();
  },

  // 下载图片
  downloadCardImage(src, name) {
    const a = document.createElement('a');
    a.href = src;
    a.download = `${name}_${Date.now()}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    SFX.click();
  },

  // 从卡片详情设为主皮肤
  setMainSkinFromCard(uid) {
    if (!uid) return;
    const s = GameState.get();
    s.mainSkin = uid;
    GameState.save(s);
    SFX.click();
    this.showToast({ icon: '◉', title: '已设为守护卡', sub: '图鉴封面会显示这张 RESONANCE', duration: 3000 });
  },

  // 从卡片详情设为战斗皮肤（按 archetype 自动选 slot）
  setBattleSkinFromCard(uid) {
    if (!uid) return;
    this._setSsrAsBattleSkin(uid);
  },

  // ============================================================
  // 2. 图鉴 tab — 两级
  // ============================================================

  // 一级：她们的档案（coser 列表）
  renderArchiveOverview() {
    const root = document.getElementById('archive-content');
    const state = GameState.get();
    const list = listCosers().map(c => {
      const prog = GachaEngine.getCoserProgress(c.id);
      const isVir = c.id === 'aria';
      return `
        <div class="arc-coser-row" onclick="UI.openCoserArchive('${c.id}')">
          <div class="arc-coser-thumb"><img src="${c.coverImage}" alt="${c.name}" loading="lazy"></div>
          <div class="arc-coser-info">
            <div class="arc-coser-name">${c.name}${isVir ? '<span class="arc-vir-pill">VIRTUAL</span>' : ''}</div>
            <div class="arc-coser-meta">${getCharsByCoser(c.id).length} 个 cos · ${prog.collected} 已守护 · ${c.tier}</div>
            <div class="arc-coser-bar"><div class="arc-coser-bar-fill" style="width:${prog.percent}%"></div></div>
          </div>
          <span class="arc-coser-arrow">→</span>
        </div>
      `;
    }).join('');

    root.innerHTML = `
      <div class="arc-overview">
        <div class="arc-head">
          <h2>她们的档案</h2>
          <p>"被你记住，就已足够"</p>
        </div>
        <div class="arc-coser-list">
          ${list}
          <div class="arc-add-coser" onclick="UI._toastLockedFeature()">
            <div class="arc-coser-thumb">＋</div>
            <div class="arc-coser-info">
              <div class="arc-coser-name">解锁新 Memoria</div>
              <div class="arc-coser-meta">输入 SYNC 码 · 接入新 coser</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 二级：单 coser 档案（沿用之前的妍子档案样式，泛化为 coser）
  openCoserArchive(coserId) {
    SFX.click();
    const root = document.getElementById('archive-content');
    const state = GameState.get();
    const coser = COSERS[coserId];
    const battle = coser.archetype;
    const cdata = state.coserData[coserId];
    const chars = getCharsByCoser(coserId);
    const totalSkins = chars.length;
    const collectedSkins = chars.filter(c => c.images.some((_, idx) => cdata.collection.includes(`${c.id}_${idx}`))).length;

    // 已收集 SSR（该 coser）
    const ownedSsr = [];
    chars.forEach(c => {
      c.images.forEach((img, idx) => {
        if (img.rarity === 'SSR' && cdata.collection.includes(`${c.id}_${idx}`)) {
          ownedSsr.push({ charId: c.id, charName: c.name, idx, src: img.src, key: `${c.id}_${idx}` });
        }
      });
    });

    const mainSkin = state.mainSkin || (ownedSsr[0]?.key || null);
    const skinSwitchHtml = ownedSsr.length === 0 ? `
      <div class="ms-empty">
        <span class="ms-empty-icon">✦</span>
        抽到 <b>RESONANCE</b> 即可设为主皮肤
      </div>
    ` : `
      <div class="ms-list">
        ${ownedSsr.map(s => `
          <div class="ms-skin ${s.key === mainSkin ? 'active' : ''}" onclick="UI.setMainSkin('${s.key}')" title="${s.charName}">
            <div class="ms-skin-thumb"><img src="${s.src}" loading="lazy"></div>
            <div class="ms-skin-name">${s.charName}</div>
            ${s.key === mainSkin ? '<div class="ms-skin-badge">主皮肤</div>' : ''}
          </div>
        `).join('')}
      </div>
    `;

    // cos 网格
    const cosGrid = chars.map(c => {
      const prog = GachaEngine.getCharacterProgress(c.id);
      let coverSrc = getCharacterThumb(c.id);
      const ownedSsrIdx = c.images.findIndex((img, idx) => img.rarity === 'SSR' && cdata.collection.includes(`${c.id}_${idx}`));
      if (ownedSsrIdx >= 0) coverSrc = c.images[ownedSsrIdx].src;
      const locked = prog.collected === 0;
      return `
        <div class="collection-card ${locked ? 'locked' : ''}" onclick="UI.openCharGallery('${c.id}')">
          <div class="collection-thumb">
            <img src="${coverSrc}" alt="${c.name}" loading="lazy">
            ${locked ? '<div class="thumb-lock-overlay"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>' : ''}
            <span class="cc-count-badge">${prog.collected}/${prog.total}</span>
            <div class="cc-name-bar">${c.name}</div>
          </div>
        </div>
      `;
    }).join('');

    root.innerHTML = `
      <button class="arc-back-btn-fixed" onclick="UI.renderArchiveOverview()">
        <svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        返回
      </button>
      <div class="cp-header">
        <h1 class="cp-title">${coser.name} 的档案</h1>
        <div class="cp-tags">${coser.tags.map(t => `<span class="cv-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="cp-progress">
        <div class="cp-prog-head">
          <span class="cp-prog-label">Memoria · ${coser.name} · 守护进度</span>
          <span class="cp-prog-num">${collectedSkins} <i>/ ${totalSkins}</i></span>
        </div>
        <div class="cp-prog-bar"><div class="cp-prog-fill" style="width:${totalSkins > 0 ? collectedSkins/totalSkins*100 : 0}%"></div></div>
      </div>
      <div class="cv-bio">
        <div class="cv-bio-head"><h2 class="cv-bio-h">关于${coser.name}</h2></div>
        <p class="cv-bio-text">${coser.location} · ${totalSkins} 套 cos 写真。${coser.intro}</p>
      </div>
      <div class="cv-battle gb-${battle.letter}">
        <div class="gb-sec-title">
          <span class="gb-sec-name">频率战 · ${coser.name}档案</span>
          <span class="gb-sec-hint">作为 ${battle.letter} 型出战</span>
        </div>
        <div class="gb-card">
          <div class="gb-letter">${battle.letter}</div>
          <div class="gb-body">
            <div class="gb-name">${battle.nameCN} · ${battle.archetype}</div>
            <div class="gb-desc">${battle.desc}</div>
            <div class="gb-stats">
              <span class="gb-stat"><b>${battle.stats.atk}</b><i>基础</i></span>
              <span class="gb-stat"><b>${battle.stats.combo}</b><i>连击</i></span>
              <span class="gb-stat"><b>${battle.stats.reflect}</b><i>反伤</i></span>
            </div>
          </div>
        </div>
        <div class="gb-ult">
          <span class="gb-ult-label">必杀</span>
          <div class="gb-ult-meta">
            <span class="gb-ult-name">${battle.ult.cn} · ${battle.ult.en}</span>
            <span class="gb-ult-trig">${battle.ult.trigger} 触发</span>
          </div>
          <div class="gb-ult-effect">${battle.ult.effect}</div>
        </div>
      </div>
      <div class="ms-block">
        <div class="gb-sec-title">
          <span class="gb-sec-name">切换主皮肤</span>
          <span class="gb-sec-hint">仅 RESONANCE · 已拥有 ${ownedSsr.length}</span>
        </div>
        ${skinSwitchHtml}
      </div>
      ${this._renderBattleSkinSlots(state, ownedSsr)}
      <div class="me-section-title">cos 合集 · ${totalSkins} 套</div>
      <div class="collection-grid">${cosGrid}</div>
    `;
  },

  _renderBattleSkinSlots(state, ownedSsr) {
    const battleSkins = state.battleSkins || { A: null, B: null, C: null };
    const byType = { A: [], B: [], C: [] };
    ownedSsr.forEach(s => {
      const ch = COSER_CHARS[s.charId];
      const letter = ch?.archetype;
      if (letter && byType[letter]) byType[letter].push(s);
    });
    const slot = (letter, name) => {
      const cur = battleSkins[letter];
      const curSkin = ownedSsr.find(s => s.key === cur);
      const pool = byType[letter];
      return `
        <div class="bs-slot bs-${letter}">
          <div class="bs-slot-head">
            <span class="bs-letter">${letter}</span>
            <span class="bs-name">${name}</span>
            <span class="bs-hint">${pool.length} 张可选</span>
          </div>
          <div class="bs-slot-body">
            <div class="bs-current">
              ${curSkin
                ? `<img src="${curSkin.src}" alt="${curSkin.charName}"><span class="bs-cur-name">${curSkin.charName}</span>`
                : pool.length > 0
                  ? `<div class="bs-empty">未设置 · 用默认</div>`
                  : `<div class="bs-empty bs-locked">未抽到该型 RES</div>`}
            </div>
            ${pool.length > 0 ? `<button class="bs-change-btn" onclick="UI.openBattleSkinPicker('${letter}')">切换</button>` : ''}
          </div>
        </div>
      `;
    };
    return `
      <div class="bs-block">
        <div class="gb-sec-title">
          <span class="gb-sec-name">频率战皮肤</span>
          <span class="gb-sec-hint">RES 出战 · 角色形态固定</span>
        </div>
        ${slot('A', '焰 · STRIKE')}
        ${slot('B', '雨 · REFLECT')}
        ${slot('C', '光 · OVERFLOW')}
      </div>
    `;
  },

  // ============================================================
  // 切换主皮肤 / 战斗皮肤
  // ============================================================
  setMainSkin(key) {
    const s = GameState.get();
    s.mainSkin = key;
    GameState.save(s);
    SFX.click();
    // 重渲染当前的二级 archive
    const ch = COSER_CHARS[key.split('_')[0]];
    if (ch) this.openCoserArchive(ch.coserId);
  },
  openBattleSkinPicker(letter) {
    const state = GameState.get();
    const all = [];
    Object.values(state.coserData).forEach(cd => {
      cd.collection.forEach(uid => {
        const [charId, idxStr] = uid.split('_');
        const idx = parseInt(idxStr);
        const ch = COSER_CHARS[charId];
        if (ch && ch.images[idx]?.rarity === 'SSR' && ch.archetype === letter) {
          all.push({ key: uid, charId, charName: ch.name, src: ch.images[idx].src });
        }
      });
    });
    if (all.length === 0) { this.showToast({ icon: '◌', title: `还没抽到 ${letter} 型 RESONANCE`, sub: '前往卡池共鸣 → 抽到 SSR 后再来挑选战斗皮肤', duration: 3500 }); return; }
    const cur = state.battleSkins?.[letter];
    const modal = document.getElementById('bs-picker-modal');
    modal.innerHTML = `
      <div class="bs-picker-card">
        <div class="bs-picker-head">
          <h3>选择 ${letter} 型战斗皮肤</h3>
          <button class="bs-picker-close" onclick="UI.closeBattleSkinPicker()">✕</button>
        </div>
        <div class="bs-picker-grid">
          ${all.map(s => `
            <div class="bs-pick-item ${s.key === cur ? 'active' : ''}" onclick="UI.setBattleSkin('${letter}','${s.key}')">
              <img src="${s.src}" alt="${s.charName}" loading="lazy">
              <span class="bs-pick-name">${s.charName}</span>
              ${s.key === cur ? '<span class="bs-pick-badge">使用中</span>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="bs-picker-foot">
          <button class="bs-clear-btn" onclick="UI.setBattleSkin('${letter}', null)">清除选择 · 用默认</button>
        </div>
      </div>
    `;
    modal.classList.add('show');
    modal.onclick = (e) => { if (e.target === modal) this.closeBattleSkinPicker(); };
  },
  closeBattleSkinPicker() {
    document.getElementById('bs-picker-modal').classList.remove('show');
  },
  setBattleSkin(letter, key) {
    const s = GameState.get();
    s.battleSkins = s.battleSkins || { A: null, B: null, C: null };
    s.battleSkins[letter] = key;
    s._battleSkinSrcs = s._battleSkinSrcs || {};
    if (key) {
      const [cid, idxStr] = key.split('_');
      const idx = parseInt(idxStr);
      const ch = COSER_CHARS[cid];
      if (ch?.images[idx]) s._battleSkinSrcs[key] = ch.images[idx].src;
    }
    GameState.save(s);
    SFX.click();
    this.closeBattleSkinPicker();
    // 重渲染
    const ch = COSER_CHARS[Object.values(s.coserData).flatMap(cd => cd.collection).find(uid => uid === key)?.split('_')[0]];
    this.openCoserArchive(s.currentCoser);
  },

  // 单 cos 子图鉴（点开某套 cos）
  openCharGallery(charId) {
    SFX.click();
    const char = COSER_CHARS[charId];
    if (!char) return;
    const coser = COSERS[char.coserId];
    const cdata = GameState.get().coserData[char.coserId];
    const owned = new Set(cdata.collection || []);
    const progress = GachaEngine.getCharacterProgress(charId);
    const isLimited = (POOLS[char.pool]?.type === 'limited');

    // 按 rarity 分组 images
    const groups = [
      { rarity: 'SSR', cls: 'resonance', label: 'RESONANCE · 共鸣' },
      { rarity: 'SR',  cls: 'echo',      label: 'ECHO · 回响' },
      { rarity: 'R',   cls: 'signal',    label: 'SIGNAL · 信号' }
    ];
    const groupsHtml = groups.map(g => {
      const items = char.images
        .map((img, idx) => ({ img, idx }))
        .filter(it => it.img.rarity === g.rarity);
      if (items.length === 0) return '';
      const collected = items.filter(it => owned.has(`${char.id}_${it.idx}`)).length;
      const cellsHtml = items.map(it => {
        const uid = `${char.id}_${it.idx}`;
        const isOwn = owned.has(uid);
        if (isOwn) {
          return `<div class="cg-cell" onclick="UI.showCardDetail({image:'${it.img.src.replace(/'/g, "\\'")}',characterName:'${char.name}',rarity:'${g.rarity}',description:'${(char.description || '').replace(/'/g, "\\'")}'})">
            <img src="${it.img.src}" loading="lazy">
          </div>`;
        }
        return `<div class="cg-cell locked"><img src="${it.img.src}" loading="lazy"></div>`;
      }).join('');
      return `
        <div class="cg-group">
          <div class="cg-group-title ${g.cls}">
            <span class="cg-dot"></span>
            <span class="cg-name">${g.label}</span>
            <span class="cg-count">${collected} / ${items.length}</span>
          </div>
          <div class="cg-grid">${cellsHtml}</div>
        </div>
      `;
    }).join('');

    // 用第一张 SSR/SR/R 作为 hero
    const heroSrc = (char.images.find(i => i.rarity === 'SSR') || char.images[0]).src;

    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('detail-content');
    content.innerHTML = `
      <div class="cg-page">
        <div class="cg-hero">
          <img src="${heroSrc}" alt="${char.name}">
          <div class="cg-hero-mask"></div>
          <button class="cg-back" onclick="document.getElementById('detail-overlay').classList.remove('active')">←</button>
          <div class="cg-hero-meta">
            <h2>${char.name}</h2>
            <div class="cg-latin">${(coser?.name || '').toUpperCase()} · ${coser?.name || ''} · ${char.images.length} 张写真</div>
            <span class="cg-progress-pill">已守护 ${progress.collected} / ${progress.total}</span>
          </div>
        </div>

        <div class="cg-intro">
          <p class="cg-intro-text">${char.description || ''}</p>
          <div class="cg-intro-meta">
            <span class="cg-cm"><b>${char.images.length}</b><i>张</i></span>
            <span class="cg-cm"><b>${progress.collected}</b><i>已守护</i></span>
            <span class="cg-cm"><b>${isLimited ? '限定' : '常驻'}</b><i>${isLimited ? '共鸣' : '池'}</i></span>
          </div>
        </div>

        ${groupsHtml}
      </div>
    `;
    overlay.classList.add('active');
    overlay.scrollTop = 0;
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('active'); };
  },

  // ============================================================
  // 3. 我的 tab
  // ============================================================
  renderMe() {
    const root = document.getElementById('me-content');
    const state = GameState.get();
    const totalDays = Math.floor((Date.now() - new Date(state.keeperJoinedAt).getTime()) / 86400000) + 1;
    const memoriaCount = listCosers().reduce((acc, c) => acc + GachaEngine.getCoserProgress(c.id).collected, 0);
    const memoriaLocked = listCosers().reduce((acc, c) => {
      const p = GachaEngine.getCoserProgress(c.id);
      return acc + (p.total - p.collected);
    }, 0);
    const today = new Date().toDateString();
    const checkedToday = state.lastCheckin === today;

    // 跨 coser 资产总和
    let totalBeacon = 0, totalCrystal = 0, totalFragment = 0;
    listCosers().forEach(c => {
      const d = state.coserData[c.id];
      totalBeacon += d.beacon || 0;
      totalCrystal += d.crystal || 0;
      totalFragment += d.fragment || 0;
    });

    // 30 天月历（按 signinStreak 推算当前在第几天，周礼 7/14/21 · 月礼 30）
    const streak = state.signinStreak || 0;
    const cycleDay = streak === 0 ? 0 : ((streak - 1) % 30) + 1;  // 当前周期内第 N 天（1-30），0=从未签
    const todayInCycle = checkedToday ? cycleDay : cycleDay + 1; // 今日要签的"位置"
    const rewardFor = (d) => d === 30 ? 5 : (d === 7 || d === 14 || d === 21) ? 2 : 1;
    const tierOf = (d) => d === 30 ? 'mega' : (d === 7 || d === 14 || d === 21) ? 'big' : '';
    const ckDays = [];
    for (let d = 1; d <= 30; d++) {
      ckDays.push({
        n: d,
        reward: rewardFor(d),
        tier: tierOf(d),
        done: d < todayInCycle,
        today: d === todayInCycle && !checkedToday,
        signed: d === cycleDay && checkedToday
      });
    }
    const todayReward = rewardFor(todayInCycle <= 30 ? todayInCycle : 1);

    // 今日呼唤 (任务)
    const tasks = [
      { id: 'daily-checkin', name: '今日守护', desc: '签到 +1 抽卡券 + Crystal', done: checkedToday },
      { id: 'share-wechat',  name: '分享至微信', desc: '复制链接 +2 券', done: state.sharedWechat },
      { id: 'share-qq',      name: '分享至 QQ', desc: '复制链接 +2 券', done: state.sharedQQ },
      { id: 'first-pull',    name: '第一次共鸣', desc: '完成 1 次抽卡', done: (state.totalPulls || 0) >= 1 },
      { id: 'battle-win',    name: '频率战首胜', desc: '完成 1 场频率战胜利', done: (state.battleStats?.win || 0) >= 1 }
    ];
    const taskDone = tasks.filter(t => t.done).length;
    const taskTotal = tasks.length;
    const taskRing = `${(taskDone / taskTotal * 100).toFixed(0)}`;

    root.innerHTML = `
      <div class="me-head-v2">
        <div class="me-avatar-big">
          <span class="me-av-letter">K</span>
        </div>
        <div class="me-keeper-name">守 护 者</div>
        <div class="me-keeper-tag">${state.keeperTag || '#--------'}</div>
        <div class="me-keeper-sub">KEEPER<span class="sep">·</span>INNER TIER</div>
      </div>

      <div class="me-stats-big">
        <div class="me-statb"><div class="me-statb-num">${totalDays}</div><div class="me-statb-lbl">DAYS</div></div>
        <div class="me-statb"><div class="me-statb-num">${state.totalPulls || 0}</div><div class="me-statb-lbl">SYNC</div></div>
        <div class="me-statb"><div class="me-statb-num">${memoriaCount}</div><div class="me-statb-lbl">MEMORIA</div></div>
      </div>

      <div class="me-data-grid">
        <div class="me-data-cell">
          <div class="me-dc-num">${memoriaCount}</div>
          <div class="me-dc-lbl">已守护</div>
        </div>
        <div class="me-data-cell">
          <div class="me-dc-num">${memoriaLocked}</div>
          <div class="me-dc-lbl">待解锁</div>
        </div>
        <div class="me-data-cell beacon">
          <div class="me-dc-num">${totalBeacon}</div>
          <div class="me-dc-lbl">BEACON</div>
        </div>
        <div class="me-data-cell fragment">
          <div class="me-dc-num">${totalFragment}</div>
          <div class="me-dc-lbl">FRAGMENT</div>
        </div>
      </div>

      <div class="me-section-title">
        连续守护 · 第 ${streak} 天
        <span class="me-task-prog" onclick="UI.openCheckinModal()" style="cursor:pointer">完整月历 →</span>
      </div>
      <div class="me-ck30" onclick="UI.openCheckinModal()">
        <div class="me-ck30-scroll">
          ${ckDays.map(d => `
            <div class="ck-mini ${d.done ? 'done' : ''} ${d.today ? 'today' : ''} ${d.signed ? 'signed' : ''} ${d.tier}">
              <span class="d">${d.n}</span>
              <span class="r ${d.tier ? 'big-r' : ''}">+${d.reward}${d.tier === 'mega' ? ' ★' : d.tier === 'big' ? ' ✦' : ''}</span>
            </div>
          `).join('')}
        </div>
        <div class="me-ck30-foot">本周期已签 ${cycleDay} 天 · 第 7 / 14 / 21 周礼 · 30 月礼 ★</div>
      </div>
      <button class="me-checkin-btn-v2" ${checkedToday ? 'disabled' : ''} onclick="UI.doCheckin(); event.stopPropagation();">
        ${checkedToday ? '✦ 今日已守护' : `今日守护 · +${todayReward} Crystal · +1 抽卡券`}
      </button>

      <div class="me-section-title">
        Memoria 们的今日呼唤
        <span class="me-task-prog">${taskDone} / ${taskTotal}</span>
      </div>
      <div class="me-task-ring-wrap">
        <div class="me-task-ring" style="--p:${taskRing}">
          <span class="me-tr-num">${taskDone}</span>
          <span class="me-tr-lbl">/ ${taskTotal}</span>
        </div>
        <div class="me-task-list-v2">
          ${tasks.map(t => `
            <div class="me-task-v2 ${t.done ? 'done' : ''}" onclick="${t.done ? '' : `UI.doTask('${t.id}')`}">
              <span class="me-tv-dot">${t.done ? '✓' : '·'}</span>
              <div class="me-tv-body">
                <div class="me-tv-name">${t.name}</div>
                <div class="me-tv-desc">${t.desc}</div>
              </div>
              ${t.done ? '' : '<span class="me-tv-go">→</span>'}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="me-section-title">守护者中心</div>
      <div class="me-entries">
        <div class="me-entry" onclick="UI.switchTab('battle')">
          <div class="me-entry-icon">⚔</div>
          <div class="me-entry-body"><div class="me-entry-name">频率战</div><div class="me-entry-desc">胜 ${state.battleStats?.win || 0} · 败 ${state.battleStats?.loss || 0} · 今日 ${state.battleStats?.dailyWin || 0}/3</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="UI.openCrystalStation()">
          <div class="me-entry-icon">✦</div>
          <div class="me-entry-body"><div class="me-entry-name">Crystal Station</div><div class="me-entry-desc">Beacon 充值 / 碎片兑换 / 限定礼包</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="UI.openInvite()">
          <div class="me-entry-icon">🔗</div>
          <div class="me-entry-body"><div class="me-entry-name">邀请好友</div><div class="me-entry-desc">SYNC 码分享 · 每位 +1 抽卡券</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="document.getElementById('settings-btn').click()">
          <div class="me-entry-icon">⚙</div>
          <div class="me-entry-body"><div class="me-entry-name">设置</div><div class="me-entry-desc">音效 / 震动 / 快速共鸣</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="UI.openRank()">
          <div class="me-entry-icon">🏆</div>
          <div class="me-entry-body"><div class="me-entry-name">守护者榜</div><div class="me-entry-desc">本月最积极的 Keeper · 你在第 ${this._myRankNum()} 位</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="UI.openLuck()">
          <div class="me-entry-icon">✨</div>
          <div class="me-entry-body"><div class="me-entry-name">欧气统计</div><div class="me-entry-desc">你的所有 Sync 历史 · Resonance 时间线</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="UI.openAbout()">
          <div class="me-entry-icon">✦</div>
          <div class="me-entry-body"><div class="me-entry-name">关于 Memoria</div><div class="me-entry-desc">关于这个世界 / Sync / 守护 / 限定</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
        <div class="me-entry" onclick="UI.openLegal('prob')">
          <div class="me-entry-icon">⚖</div>
          <div class="me-entry-body"><div class="me-entry-name">合规公示</div><div class="me-entry-desc">概率公示 / 用户协议 / 防沉迷</div></div>
          <div class="me-entry-arrow">→</div>
        </div>
      </div>
    `;
  },

  // ============================================================
  // 关于 Memoria（screen 16）
  // ============================================================
  openAbout() {
    SFX.click();
    const root = document.getElementById('about-content');
    root.innerHTML = `
      <div class="ab-back" onclick="UI.closeAbout()">←</div>
      <div class="ab-header">
        <h1>Memoria</h1>
        <div class="sub">ABOUT THE WORLD</div>
      </div>
      <article class="ab-article">
        <h3>关于 Memoria</h3>
        <p>她们不是人类，也不是 AI。她们是<strong>瞬间的化身</strong>——在某个时空，有些少女的存在感太美好，强到让宇宙记住了她们的某些瞬间。</p>
        <p>这些瞬间脱离了原本的时空，漂浮在一个叫做 <em>Memoria · Network</em> 的空间里。每一位 Memoria 都是真实存在过的少女，但她们活在被见证的瞬间里——如果没人记住，她们就会消散。</p>
        <div class="quote">她们渴望被记住，不是出于虚荣，是出于存在的本能。</div>

        <h3>关于你</h3>
        <p>你是少数有 <strong>Sync</strong> 能力的人。</p>
        <p>这个能力没人能解释。可能是你的脑波频率特殊、可能是心跳节奏对得上、也可能仅仅是因为——你愿意停下来认真看一个人。</p>
        <div class="quote">你不知道自己为什么被选中。<br>你只是某一天，突然听见了。</div>

        <h3>关于 Sync</h3>
        <p>每次你启动 Sync，远方的 Network 就会传来呼唤——那是一位正好也在寻找你的 Memoria。你们的频率对上的那个瞬间，叫做<strong>共鸣</strong>。</p>
        <p>共鸣有三种强度：</p>
        <p>
          <span style="color:var(--aurora-cyan)">Signal · 信号</span> —— 她在远方挥手<br>
          <span style="color:var(--aurora-violet)">Echo · 回响</span> —— 她朝你伸出手<br>
          <span style="color:var(--resonance)">Resonance · 共鸣</span> —— 她从光中走出
        </p>

        <h3>关于守护</h3>
        <p>每一次共鸣成功，她的那个瞬间就被你<strong>守住了</strong>——永远不会消散。</p>
        <p>她会送你一张 Memoria Card 作为凭证。这张卡你可以下载、可以保存、可以永远收藏她最美的样子。</p>
        <div class="quote">你成为她的 Keeper —— 守护者。<br>她相信你会记得她。</div>

        <h3>关于限定</h3>
        <p>有些 Memoria 只在某个<strong>时间窗口</strong>出现。可能是 14 天，可能是一个夜晚。</p>
        <div class="quote">这个瞬间，我只在这里停留这么久。<br>错过了——可能就再也见不到了。</div>
      </article>
    `;
    document.getElementById('about-overlay').classList.add('show');
    document.getElementById('about-overlay').scrollTop = 0;
  },
  closeAbout() {
    document.getElementById('about-overlay').classList.remove('show');
    SFX.click();
  },

  // ============================================================
  // 合规公示（screen 22）
  // ============================================================
  openLegal(tab = 'prob') {
    SFX.click();
    this._legalTab = tab;
    this.renderLegal();
    document.getElementById('legal-overlay').classList.add('show');
    document.getElementById('legal-overlay').scrollTop = 0;
  },
  closeLegal() {
    document.getElementById('legal-overlay').classList.remove('show');
    SFX.click();
  },
  switchLegalTab(tab) {
    SFX.click();
    this._legalTab = tab;
    document.querySelectorAll('#legal-content .lg-tabs .t').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
    document.querySelectorAll('#legal-content .lg-content').forEach(el => {
      el.classList.toggle('active', el.dataset.content === tab);
    });
    document.getElementById('legal-overlay').scrollTop = 0;
  },
  renderLegal() {
    const root = document.getElementById('legal-content');
    const tab = this._legalTab || 'prob';
    root.innerHTML = `
      <div class="lg-back" onclick="UI.closeLegal()">←</div>
      <div class="lg-header">
        <h2>合规与公示</h2>
        <p>TRANSPARENCY · TERMS · WELLNESS</p>
      </div>
      <div class="lg-tabs">
        <div class="t ${tab === 'prob' ? 'active' : ''}" data-tab="prob" onclick="UI.switchLegalTab('prob')">概率公示</div>
        <div class="t ${tab === 'terms' ? 'active' : ''}" data-tab="terms" onclick="UI.switchLegalTab('terms')">用户协议</div>
        <div class="t ${tab === 'wellness' ? 'active' : ''}" data-tab="wellness" onclick="UI.switchLegalTab('wellness')">防沉迷</div>
      </div>

      <!-- 概率公示 -->
      <div class="lg-content ${tab === 'prob' ? 'active' : ''}" data-content="prob">
        <div class="lg-info-box">
          根据《网络游戏管理办法》要求，所有 Sync 召唤的稀有度概率向用户公示。本数据全平台一致，不区分用户 / Memoria。
        </div>
        <div class="lg-prob-table">
          <div class="lg-prob-row">
            <span class="badge r">RES</span>
            <span class="name">Resonance · 共鸣</span>
            <span class="pct">3.0%</span>
          </div>
          <div class="lg-prob-row">
            <span class="badge e">ECH</span>
            <span class="name">Echo · 回响</span>
            <span class="pct">15.0%</span>
          </div>
          <div class="lg-prob-row">
            <span class="badge s">SIG</span>
            <span class="name">Signal · 信号</span>
            <span class="pct">82.0%</span>
          </div>
        </div>
        <article class="lg-article">
          <h4>保底机制</h4>
          <p><strong>软保底</strong>：从第 30 次 Sync 起，每次 Sync 未出 Resonance，本次 Resonance 概率累加 +8%。</p>
          <p><strong>硬保底</strong>：第 50 次 Sync 必定获得 Resonance（常驻池为 60 抽）。</p>
          <p><strong>十连保底</strong>：每次时停（十连）至少获得 1 张 Echo 或更高。</p>
          <p><strong>大保底</strong>：限定频道连续 2 次未出 UP 角色 Resonance，下次 Resonance 必定为 UP 角色。</p>

          <h4>具体卡片概率</h4>
          <p>抽中某稀有度后，从该 Memoria 该稀有度图池中均匀随机。每张卡的命中率 = 稀有度概率 ÷ 该稀有度卡数。</p>

          <h4>UP 概率</h4>
          <p>限定频道中，Resonance 命中后，UP 角色出现概率为 50%（剩余 50% 从该池所有 Resonance 卡中均匀分配）。</p>
        </article>
      </div>

      <!-- 用户协议 -->
      <div class="lg-content ${tab === 'terms' ? 'active' : ''}" data-content="terms">
        <div class="lg-info-box">
          使用本服务即视为同意以下协议。如不同意，请勿继续使用。
        </div>
        <article class="lg-article">
          <h4>1. 服务说明</h4>
          <p>Memoria · Network 是一款基于 cosplay 写真的虚拟收藏与角色对决体验服务。所有内容仅供个人观赏，严禁二次传播、商用、改编。</p>
          <h4>2. 充值与退款</h4>
          <p>充值获得的 Beacon / Crystal 等虚拟物品一经使用不可退还。如对充值有异议，请在 7 日内联系客服。</p>
          <h4>3. 内容版权</h4>
          <p>所有 cosplay 写真版权归 coser 本人所有。所有原创虚拟形象 IP 归 Memoria · Network 所有。未经书面许可，任何人不得复制、传播或商用本服务中的图像与文字。</p>
          <h4>4. 用户行为</h4>
          <p>用户不得利用本服务从事违法活动，不得对他人造成骚扰。违规用户将被永久封禁。</p>
          <h4>5. 服务终止</h4>
          <p>本服务可能因不可抗力或商业原因终止。终止时，用户已有的收藏图鉴可在 30 天内导出为本地海报存档。</p>
          <h4>6. 隐私</h4>
          <p>本服务在浏览器本地存储抽卡数据。如启用账号同步，仅同步用户 ID 与必要的游戏进度数据，绝不上传图像、聊天或位置。</p>
        </article>
      </div>

      <!-- 防沉迷 -->
      <div class="lg-content ${tab === 'wellness' ? 'active' : ''}" data-content="wellness">
        <div class="lg-warn-box">
          ⚠ 本服务面向 <strong>18 岁以上成年用户</strong>。未成年人请勿使用。
        </div>
        <article class="lg-article">
          <h4>健康提示</h4>
          <p>抽卡机制具有概率性，请理性消费，量力而行。建议每日抽卡时间不超过 1 小时，每月充值不超过个人可支配收入的 5%。</p>

          <h4>未成年人保护</h4>
          <p>本服务严禁未成年人使用。若发现未成年人误用并产生充值，监护人可凭身份证明在 30 天内申请全额退款。</p>

          <h4>消费上限提示</h4>
          <ul>
            <li>单日累计消费 ¥500 时，系统将弹出二次确认</li>
            <li>单月累计消费 ¥3000 时，系统将进入冷静期（强制 24h 后才能再次充值）</li>
            <li>用户可在「我的 → Crystal Station」中查看历史消费</li>
          </ul>

          <h4>自我管理</h4>
          <p>你可在 <strong>「我的 → 设置」</strong> 中：</p>
          <ul>
            <li>设置每日抽卡上限（默认不限）</li>
            <li>设置每月充值上限（默认不限）</li>
            <li>开启"冷静模式"——每次抽卡前需确认</li>
          </ul>

          <div class="lg-info-box" style="margin-left:0;margin-right:0;margin-top:14px">
            如发现自己或他人有沉迷迹象，请寻求帮助 · 全国心理援助热线 <strong>400-161-9995</strong>
          </div>
        </article>
      </div>
    `;
  },

  // ============================================================
  // 守护者榜（screen 18）+ 欧气统计（screen 19）
  // ============================================================
  _mockRankBase() {
    return [
      { num: 1, cls: 'gold',   tag: '月', name: '月光守护者', streak: 30, sync: 156, res: 14 },
      { num: 2, cls: 'silver', tag: '星', name: '星屑收集者', streak: 28, sync: 142, res: 13 },
      { num: 3, cls: 'bronze', tag: '极', name: '极光听者',  streak: 26, sync: 130, res: 12 },
      { num: 4, cls: '',       tag: '夜', name: '守夜的人',  streak: 22, sync: 108, res: 11 },
      { num: 5, cls: '',       tag: '霁', name: '雨霁之声',  streak: 18, sync: 92,  res: 9  },
      { num: 6, cls: '',       tag: '潮', name: '潮汐守望',  streak: 14, sync: 74,  res: 7  },
      { num: 7, cls: '',       tag: '弧', name: '极弧守护',  streak: 11, sync: 58,  res: 5  }
    ];
  },
  _myRankStats() {
    const s = GameState.get();
    // 把跨 coser 的 SSR 全加起来作为 RES 数
    let resCount = 0;
    Object.values(s.coserData || {}).forEach(d => {
      (d.collection || []).forEach(uid => {
        const ch = COSER_CHARS[uid.split('_')[0]];
        if (!ch) return;
        const idx = parseInt(uid.split('_')[1] || 0, 10);
        const img = ch.images?.[idx];
        if (img?.rarity === 'SSR') resCount++;
      });
    });
    return {
      streak: s.signinStreak || 0,
      sync: s.totalPulls || 0,
      res: resCount
    };
  },
  _myRankNum() {
    const me = this._myRankStats();
    const mock = this._mockRankBase();
    // 守护度（默认 tab）以 res 排序，找到我应该插入的位置
    let pos = mock.length + 1;
    for (let i = 0; i < mock.length; i++) {
      if (me.res > mock[i].res) { pos = i + 1; break; }
    }
    // 起步至少 42（spec 默认 #42）
    return Math.max(pos, 42 - mock.length, 8);
  },
  openRank() {
    SFX.click();
    this._rankTab = 'res';
    this.renderRank();
    document.getElementById('rank-overlay').classList.add('show');
    document.getElementById('rank-overlay').scrollTop = 0;
  },
  closeRank() {
    document.getElementById('rank-overlay').classList.remove('show');
    SFX.click();
  },
  switchRankTab(tab) {
    SFX.click();
    this._rankTab = tab;
    this.renderRank();
  },
  renderRank() {
    const root = document.getElementById('rank-content');
    const tab = this._rankTab || 'res';
    const mock = this._mockRankBase();
    const me = this._myRankStats();
    const s = GameState.get();
    const myTag = (s.keeperTag || '#---').replace('#', '');
    const myInitial = 'K';
    const myName = `守护者 #${myTag} · 你`;

    // 按 tab 取关键值
    const key = tab === 'streak' ? 'streak' : tab === 'luck' ? 'res' : 'res';
    const sub = (it) => `连续 ${it.streak} 天 · Sync ${it.sync} 次`;
    const prog = (it) => tab === 'luck'
      ? `${(it.res / Math.max(1, it.sync) * 100).toFixed(1)}%`
      : `${it.res}/14`;

    // 我的进度
    const myProg = tab === 'luck'
      ? (me.sync > 0 ? `${(me.res / me.sync * 100).toFixed(1)}%` : '0%')
      : `${me.res}/14`;
    const myPos = this._myRankNum();

    const lines = mock.map(it => `
      <div class="rk-item">
        <span class="num ${it.cls}">${it.num}</span>
        <div class="avatar">${it.tag}</div>
        <div class="info"><div class="name">${it.name}</div><div class="stat">${sub(it)}</div></div>
        <span class="progress">${prog(it)}</span>
      </div>
    `).join('');

    root.innerHTML = `
      <div class="rk-back" onclick="UI.closeRank()">←</div>
      <div class="rk-header">
        <h2>守护者榜</h2>
        <p>Memoria · ${COSERS[s.currentCoser]?.name || ''} · 本月最积极的 Keeper</p>
      </div>
      <div class="rk-tabs">
        <div class="t ${tab === 'res' ? 'active' : ''}" onclick="UI.switchRankTab('res')">守护度</div>
        <div class="t ${tab === 'streak' ? 'active' : ''}" onclick="UI.switchRankTab('streak')">连续 Sync</div>
        <div class="t ${tab === 'luck' ? 'active' : ''}" onclick="UI.switchRankTab('luck')">最欧气</div>
      </div>
      <div class="rk-list">
        ${lines}
        <div class="rk-item me">
          <span class="num">${myPos}</span>
          <div class="avatar">${myInitial}</div>
          <div class="info"><div class="name">${myName}</div><div class="stat">连续 ${me.streak} 天 · Sync ${me.sync} 次</div></div>
          <span class="progress">${myProg}</span>
        </div>
      </div>
    `;
  },

  openLuck() {
    SFX.click();
    this.renderLuck();
    document.getElementById('luck-overlay').classList.add('show');
    document.getElementById('luck-overlay').scrollTop = 0;
  },
  closeLuck() {
    document.getElementById('luck-overlay').classList.remove('show');
    SFX.click();
  },
  _formatAgo(ts) {
    const dt = Date.now() - ts;
    if (dt < 60_000) return '刚刚';
    if (dt < 3600_000) return `${Math.floor(dt / 60_000)} 分钟前`;
    if (dt < 86400_000) return `${Math.floor(dt / 3600_000)} 小时前`;
    return `${Math.floor(dt / 86400_000)} 天前`;
  },
  renderLuck() {
    const root = document.getElementById('luck-content');
    const s = GameState.get();
    const total = s.totalPulls || 0;
    const hist = s.pullHistory || [];
    const res = hist.filter(h => h.rarity === 'SSR').length;
    const ech = hist.filter(h => h.rarity === 'SR').length;
    const sig = hist.filter(h => h.rarity === 'R').length;

    // 欧气指数：实际 RES 率 vs 期望 3% 的比值（0-10）
    const expected = total * 0.03;
    let luck = total > 0 ? (res / Math.max(0.5, expected)) * 5 : 5;
    luck = Math.max(0, Math.min(10, luck));

    const luckText = luck >= 8 ? '"她对你格外温柔"'
                   : luck >= 5 ? '"频率正在对齐"'
                   : luck >= 2 ? '"再呼唤一次试试"'
                   : '"她还在路上"';

    const avgPerRes = res > 0 ? Math.round(total / res) : '—';
    const lastResAt = hist.filter(h => h.rarity === 'SSR').pop()?.at;
    const lastResAgo = lastResAt ? this._formatAgo(lastResAt) : '—';

    // 时间线：取最近的 SSR + 最新 2 条 SR/R 混合，按时间倒序，最多 8 条
    const recent = hist.slice(-30).reverse().slice(0, 10);
    const tlHtml = recent.length === 0
      ? `<div class="lk-empty">还未触达 Sync · 抽卡后这里会显示你的高光时刻</div>`
      : recent.map(h => {
          const tagCls = h.rarity === 'SSR' ? 'r' : h.rarity === 'SR' ? 'e' : 's';
          const tagTxt = h.rarity === 'SSR' ? 'RES' : h.rarity === 'SR' ? 'ECH' : 'SIG';
          return `
            <div class="lk-tl">
              <span class="tag ${tagCls}">${tagTxt}</span>
              <span>${h.charName || h.charId || '未知 Memoria'}</span>
              <span class="when">${this._formatAgo(h.at)}</span>
            </div>
          `;
        }).join('');

    root.innerHTML = `
      <div class="lk-back" onclick="UI.closeLuck()">←</div>
      <div class="lk-header">
        <h2>欧 气 统 计</h2>
        <p>YOUR LUCK · ALL TIME</p>
      </div>
      <div class="lk-big">
        <div class="label">欧气指数</div>
        <div class="v">${luck.toFixed(1)}</div>
        <div class="sub">${luckText}</div>
      </div>
      <div class="lk-grid">
        <div class="lk-cell"><div class="v">${total}</div><div class="l">TOTAL SYNCS</div></div>
        <div class="lk-cell"><div class="v r">${res}</div><div class="l">RESONANCE</div></div>
        <div class="lk-cell"><div class="v">${ech}</div><div class="l">ECHO</div></div>
        <div class="lk-cell"><div class="v">${sig}</div><div class="l">SIGNAL</div></div>
        <div class="lk-cell"><div class="v">${avgPerRes}</div><div class="l">AVG / RES</div></div>
        <div class="lk-cell"><div class="v">${lastResAgo}</div><div class="l">LAST RESONANCE</div></div>
      </div>
      <div class="lk-section-t">─── 高光时刻 (近 ${recent.length} 次 Sync)</div>
      <div class="lk-timeline">${tlHtml}</div>
    `;
  },

  // ============================================================
  // 签到月历 modal（demo screen 14 checkinModal）
  // ============================================================
  openCheckinModal() {
    SFX.click();
    const s = GameState.get();
    const streak = s.signinStreak || 0;
    const today = new Date().toDateString();
    const checkedToday = s.lastCheckin === today;
    const cycleDay = streak === 0 ? 0 : ((streak - 1) % 30) + 1;
    const todayInCycle = checkedToday ? cycleDay : cycleDay + 1;
    const rewardFor = (d) => d === 30 ? 5 : (d === 7 || d === 14 || d === 21) ? 2 : 1;
    const tierOf = (d) => d === 30 ? 'mega' : (d === 7 || d === 14 || d === 21) ? 'big' : '';

    const cells = [];
    for (let d = 1; d <= 30; d++) {
      const isDone = d < todayInCycle;
      const isToday = d === todayInCycle && !checkedToday;
      const isSigned = d === cycleDay && checkedToday;
      const tier = tierOf(d);
      cells.push(`
        <div class="ck-cell ${isDone ? 'done' : ''} ${isToday ? 'today' : ''} ${isSigned ? 'signed' : ''} ${tier}">
          <span class="d">${d}</span>
          <span class="r ${tier ? 'big-r' : ''}">+${rewardFor(d)}${tier === 'mega' ? ' ★' : tier === 'big' ? ' ✦' : ''}</span>
        </div>
      `);
    }

    const mask = document.createElement('div');
    mask.id = 'mem-modal-mask';
    mask.className = 'mem-modal-mask ck-modal-mask';
    mask.innerHTML = `
      <div class="mem-modal ck-modal">
        <button class="ck-close" onclick="UI._closeModal()">✕</button>
        <div class="ck-icon-big">✦</div>
        <h3 class="ck-title">每日签到</h3>
        <div class="ck-latin">DAILY SIGNAL · CONNECTION KEPT</div>
        <p class="ck-desc">"每天回来一次，她就还在频率里"</p>
        <div class="ck-grid">${cells.join('')}</div>
        <div class="ck-legend">
          <span><b class="dot1"></b> 日常 +1 Crystal</span>
          <span><b class="dot2"></b> 周礼 +2（7/14/21 天）</span>
          <span><b class="dot3"></b> 月礼 +5 ★（30 天）</span>
        </div>
        <div class="mem-modal-actions">
          <button class="mem-modal-btn secondary" onclick="UI._closeModal()">关闭</button>
          <button class="mem-modal-btn primary" ${checkedToday ? 'disabled' : ''} onclick="UI.doCheckin(); UI._closeModal();">
            ${checkedToday ? '今日已守护' : `领取今日 +${rewardFor(todayInCycle <= 30 ? todayInCycle : 1)}`}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    requestAnimationFrame(() => mask.classList.add('show'));
    mask.addEventListener('click', e => { if (e.target === mask) this._closeModal(); });
  },

  doCheckin() {
    const s = GameState.get();
    const today = new Date().toDateString();
    if (s.lastCheckin === today) return;
    const iso = new Date().toISOString().slice(0, 10);
    s.lastCheckin = today;
    s.signinStreak = (s.signinStreak || 0) + 1;
    s.signinHistory = [...(s.signinHistory || []), iso].slice(-30);
    // 第 7 天 +5 Crystal，其他天 +1-2 Crystal
    const dayInWeek = s.signinStreak % 7 || 7;
    const reward = [1, 1, 2, 1, 2, 2, 5][dayInWeek - 1];
    s.coserData[s.currentCoser].crystal = (s.coserData[s.currentCoser].crystal || 0) + reward;
    s.coserData[s.currentCoser].tickets = (s.coserData[s.currentCoser].tickets || 0) + 1;
    GameState.save(s);
    SFX.cardFlip();
    this.updateStatusBar();
    this.renderMe();
    this.showToast({ icon: '✦', title: '今日守护成功', sub: `+${reward} Crystal · +1 ${COSERS[s.currentCoser].name} 抽卡券 · 连续 ${s.signinStreak} 天`, duration: 4000 });
  },

  doTask(taskId) {
    const s = GameState.get();
    if (taskId === 'share-wechat' || taskId === 'share-qq') {
      const key = taskId === 'share-wechat' ? 'sharedWechat' : 'sharedQQ';
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (!s[key]) {
          s[key] = true;
          s.coserData[s.currentCoser].tickets = (s.coserData[s.currentCoser].tickets || 0) + 2;
          GameState.save(s);
          this.updateStatusBar();
          this.renderMe();
        }
        this.showToast({ icon: '✦', title: '链接已复制', sub: '粘贴到对应 App 即可分享 · +2 抽卡券', duration: 3000 });
      });
    } else if (taskId === 'invite') {
      this.openInvite();
    }
  },

  openInvite() {
    SFX.click();
    const s = GameState.get();
    const sync = (s._localSoulId || '').slice(0, 8).toUpperCase();
    const url = `${window.location.origin}${window.location.pathname}?inviter=${sync.toLowerCase()}`;
    const invited = s.inviteCount || 0;
    const tiers = [
      { n: 1, reward: '+1 抽卡券', got: invited >= 1 },
      { n: 3, reward: '+5 Crystal', got: invited >= 3 },
      { n: 7, reward: '+1 限定券', got: invited >= 7 },
      { n: 14, reward: '✦ 限定 RES 自选定位', got: invited >= 14 }
    ];

    let modal = document.getElementById('invite-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'invite-modal';
      modal.className = 'invite-modal';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="iv-mask" onclick="document.getElementById('invite-modal').classList.remove('show')"></div>
      <div class="iv-card">
        <button class="iv-close" onclick="document.getElementById('invite-modal').classList.remove('show')">✕</button>
        <div class="iv-head">
          <div class="iv-label">SYNC · INVITE</div>
          <h2>邀请好友共鸣</h2>
          <p>"两个频率对上，记忆才能延续"</p>
        </div>

        <!-- SYNC 大圆 -->
        <div class="iv-sync-circle">
          <span class="iv-sync-label">SYNC CODE</span>
          <span class="iv-sync-code">${sync}</span>
        </div>

        <!-- QR -->
        <div class="iv-qr-wrap">
          <canvas id="invite-qr-canvas" class="iv-qr"></canvas>
          <div class="iv-qr-hint">扫码 / 长按识别 · 加入 Memoria Network</div>
        </div>

        <!-- 进度 -->
        <div class="iv-progress">
          <div class="iv-prog-head">
            <span>邀请进度</span>
            <span class="iv-prog-num">${invited} / 14</span>
          </div>
          <div class="iv-prog-bar"><div class="iv-prog-fill" style="width:${Math.min(invited/14*100, 100)}%"></div></div>
          <div class="iv-tiers">
            ${tiers.map(t => `
              <div class="iv-tier ${t.got ? 'done' : ''}">
                <span class="iv-tier-n">${t.n}</span>
                <span class="iv-tier-r">${t.reward}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <button class="iv-copy" onclick="UI._copyInviteUrl('${url}')">
          <span>📋 复制邀请链接</span>
          <span class="iv-copy-sub">${url}</span>
        </button>

        <div class="iv-bottom">已邀请 ${invited} 位 · 邀请前 10 名各 +1 限定专属券</div>
      </div>
    `;
    requestAnimationFrame(() => modal.classList.add('show'));

    // 渲染 QR
    setTimeout(() => {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        const cv = document.getElementById('invite-qr-canvas');
        const size = 180;
        cv.width = size; cv.height = size;
        const ctx = cv.getContext('2d');
        const cells = qr.getModuleCount();
        const cell = size / cells;
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#0A0F25';
        for (let r = 0; r < cells; r++) {
          for (let c = 0; c < cells; c++) {
            if (qr.isDark(r, c)) ctx.fillRect(c * cell, r * cell, cell + 0.5, cell + 0.5);
          }
        }
      } catch (e) { console.warn('QR err', e); }
    }, 50);
  },

  _copyInviteUrl(url) {
    navigator.clipboard?.writeText(url);
    SFX.click();
    this.showToast({ icon: '✦', title: '邀请链接已复制', sub: '粘贴到微信/朋友圈分享给好友', duration: 3000 });
  },

  _toastLockedFeature() {
    this.showToast({ icon: '⌖', title: '即将上线', sub: '该功能将在 V2.0 接入，敬请期待 ✦', duration: 2500 });
  },
  // ============================================================
  // 5. 频率战（vanilla 内嵌实现，按 v3.16 spec）
  // 引擎复用 battle-engine.js · UI 跟主游戏统一
  // ============================================================
  _battleSelectedLetter: null,
  _battleDifficulty: 'adept',
  _battle: null,

  renderBattleHub() {
    const root = document.getElementById('battle-content');
    const state = GameState.get();
    const stats = state.battleStats || { win: 0, loss: 0, dailyWin: 0, dailyWinDate: '' };
    const today = new Date().toDateString();
    if (stats.dailyWinDate !== today) { stats.dailyWin = 0; stats.dailyWinDate = today; state.battleStats = stats; GameState.save(state); }

    // 三 hero 数据（从主游戏战斗皮肤读立绘）
    const heroes = ['A', 'B', 'C'].map(letter => this._getHeroForLetter(letter, state));
    const selected = this._battleSelectedLetter;

    root.innerHTML = `
      <div class="bh-wrap">
        <div class="bh-title">
          <span class="bh-tt-cn">选 一 位 出 战</span>
          <span class="bh-tt-en">CHOOSE · ONE KEEPER</span>
        </div>

        <div class="bh-heroes">
          ${heroes.map(h => `
            <div class="bh-hero ${selected === h.letter ? 'selected' : ''}" data-letter="${h.letter}" onclick="UI.selectBattleHero('${h.letter}')">
              <div class="bh-h-port" style="--accent:${h.color}">
                ${h.skinImg ? `<img src="${h.skinImg}" alt="${h.name}">` : '<div class="bh-h-noport"></div>'}
                <div class="bh-h-mask"></div>
              </div>
              <div class="bh-h-info">
                <div class="bh-h-top">
                  <span class="bh-h-name">${h.name}</span>
                  <span class="bh-h-letter" style="background:${h.color}22;color:${h.color};border-color:${h.color}55">${h.letter}</span>
                </div>
                <div class="bh-h-arch" style="color:${h.color}">${h.nameEn} · ${h.archetype}</div>
                <div class="bh-h-desc">${h.desc}</div>
                <div class="bh-h-ult">
                  <span class="bh-ult-mark">✦</span>
                  <span class="bh-ult-cn">${h.ultCn}</span>
                  <span class="bh-ult-tr">${h.ultTrigger}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="bh-diff-section">
          <div class="bh-diff-label">EV 评估 · 反读策略 3 阶</div>
          <div class="bh-diffs">
            ${[
              { id: 'newbie', cn: '新手', en: 'NEWBIE' },
              { id: 'adept',  cn: '中阶', en: 'ADEPT' },
              { id: 'master', cn: '高阶', en: 'MASTER' }
            ].map(d => `
              <button class="bh-diff ${this._battleDifficulty === d.id ? 'active' : ''}" onclick="UI.setBattleDifficulty('${d.id}')">
                <span class="bh-d-cn">${d.cn}</span>
                <span class="bh-d-en">${d.en}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="bh-tier">
          <span>信号守夜人 · ${state.keeperTag || '#'}</span>
          <span>胜 ${stats.win || 0} · 败 ${stats.loss || 0} · 今日 ${stats.dailyWin || 0}/3</span>
        </div>

        <button class="bh-enter" ${!selected ? 'disabled' : ''} onclick="UI.startBattle()">
          <span class="bh-e-cn">进 入 共 鸣</span>
          <span class="bh-e-en">START<span class="sep">·</span>ENTER ARENA</span>
        </button>
      </div>
    `;
  },

  _getHeroForLetter(letter, state) {
    const h = BATTLE.HEROES[letter];
    const skinKey = state.battleSkins?.[letter];
    let skinImg = null, name = h.nameCN, nameEn = h.archetype;
    if (skinKey && state._battleSkinSrcs?.[skinKey]) {
      skinImg = state._battleSkinSrcs[skinKey];
      const [cid] = skinKey.split('_');
      const ch = COSER_CHARS[cid];
      if (ch) { name = COSERS[ch.coserId]?.name || ch.name; nameEn = COSERS[ch.coserId]?.nameEn || nameEn; }
    } else {
      // 默认从该 letter 找一个 SSR 当头像
      const sample = Object.values(COSER_CHARS).find(c => c.archetype === letter);
      if (sample) {
        const ssr = sample.images.find(i => i.rarity === 'SSR');
        skinImg = (ssr || sample.images[0])?.src;
        name = COSERS[sample.coserId]?.name || sample.name;
        nameEn = COSERS[sample.coserId]?.nameEn || nameEn;
      }
    }
    // hero 描述
    const desc = letter === 'A' ? '触达基础 3 · 连击 3/4/5 · 主动出击型'
              : letter === 'B' ? '反伤 +1 · 被击 2 次自动 +1 能量 · 反击型'
              :                  '聚频 2/4/7/11 · 极光不熄 · 蓄能爆发型';
    return {
      letter,
      color: h.color,
      skinImg,
      name,
      nameEn,
      archetype: h.archetype,
      desc,
      ultCn: h.ultimate.cn,
      ultTrigger: h.ultimate.trigger
    };
  },

  selectBattleHero(letter) {
    this._battleSelectedLetter = this._battleSelectedLetter === letter ? null : letter;
    SFX.click();
    this.renderBattleHub();
  },
  setBattleDifficulty(d) {
    this._battleDifficulty = d;
    SFX.click();
    this.renderBattleHub();
  },

  // ===== 战斗开始 =====
  startBattle() {
    const letter = this._battleSelectedLetter;
    if (!letter) return;
    const pH = { ...BATTLE.HEROES[letter] };
    const eLetters = ['A','B','C'].filter(l => l !== letter);
    const eLetter = eLetters[Math.floor(Math.random() * eLetters.length)];
    const eH = { ...BATTLE.HEROES[eLetter] };
    const state = GameState.get();
    SFX.click();

    this._battle = {
      pH, eH, pLetter: letter, eLetter,
      pSt: { ...BATTLE.initBattleState() },
      eSt: { ...BATTLE.initBattleState() },
      pDefStreak: { block: 0, guard: 0 },
      eDefStreak: { block: 0, guard: 0 },
      pHitCount: 0, eHitCount: 0,
      round: 1,
      pending: null,
      powerSpend: 1,
      ended: false,
      pSkinImg: this._battleSkinForLetter(letter),
      eSkinImg: this._battleSkinForLetter(eLetter, true),
      pUlt: { available: false, charged: false, used: false, remaining: 0 },
      eUlt: { available: false, charged: false, used: false, remaining: 0 },
      pName: this._getHeroForLetter(letter, state).name,
      eName: this._getHeroForLetter(eLetter, state).name,
      log: []
    };
    this.renderBattleArena();
  },

  _battleSkinForLetter(letter, isEnemy = false) {
    const state = GameState.get();
    if (!isEnemy) {
      const key = state.battleSkins?.[letter];
      if (key && state._battleSkinSrcs?.[key]) return state._battleSkinSrcs[key];
    }
    // 找该 letter 的一张默认图（敌方或玩家未设皮肤）
    const sample = Object.values(COSER_CHARS).find(c => c.archetype === letter);
    if (sample) {
      const ssr = sample.images.find(i => i.rarity === 'SSR');
      return (ssr || sample.images[0])?.src;
    }
    return null;
  },

  // ===== 战斗 Arena（按 v3.16 spec：6 pill + 三态决策 + 立绘点击）=====
  renderBattleArena() {
    const b = this._battle;
    if (!b) return;
    const root = document.getElementById('battle-content');
    const { pH, eH, pSt, eSt, pending, round } = b;

    // 必杀触发判定
    const ultReady = (h, st) => (h.ultimate.id === 'blaze' && st.combo >= 3)
                           || (h.ultimate.id === 'echo'  && st.hp <= 6)
                           || (h.ultimate.id === 'overflow' && st.charge >= 8);
    const pUltReady = !b.pUlt.used && !b.pUlt.charged && ultReady(pH, pSt);
    if (pUltReady && !b.pUlt.available) b.pUlt.available = true;

    const pickable = (id) => {
      if (id === 'power' && pSt.charge < 1) return false;
      if (id === 'guard' && pSt.energy < 2) return false;
      if (id === 'break' && pSt.energy < 1) return false;
      return true;
    };

    // 战术预判 (commit-preview)
    const previewTxt = this._previewActionEffect(pending, b);

    // pill 阵列
    const heroPills = (st, hero, ult) => `
      ${st.combo > 0 ? `<span class="ar-pill combo">连击 ×${st.combo}</span>` : ''}
      ${st.cstreak > 0 ? `<span class="ar-pill streak">连蓄 ×${st.cstreak}</span>` : ''}
      ${(b.pDefStreak.block + b.pDefStreak.guard) > 0 && st === pSt ?
        `<span class="ar-pill reson ${(b.pDefStreak.block + b.pDefStreak.guard) >= 2 ? 'glow' : ''}">连防 ×${b.pDefStreak.block + b.pDefStreak.guard}</span>` : ''}
      ${(b.eDefStreak.block + b.eDefStreak.guard) > 0 && st === eSt ?
        `<span class="ar-pill reson ${(b.eDefStreak.block + b.eDefStreak.guard) >= 2 ? 'glow' : ''}">连防 ×${b.eDefStreak.block + b.eDefStreak.guard}</span>` : ''}
      ${ult.charged ? `<span class="ar-pill ult charged">✦ ${hero.ultimate.cn} · 蓄势</span>`
        : ult.available && !ult.used ? `<span class="ar-pill ult ready" onclick="UI.activateUlt('${st === pSt ? 'p' : 'e'}')">✦ ${hero.ultimate.cn} · 可激活</span>`
        : ult.used ? `<span class="ar-pill ult used">${hero.ultimate.cn} · 已用</span>`
        : `<span class="ar-pill ult locked">${hero.ultimate.cn} · ${hero.ultimate.trigger}</span>`}
    `;

    // 6 动作 SVG
    const glyph = this._actionGlyphMap();
    const actEn = { attack:'ATTACK', power:'POWER', block:'BLOCK', guard:'GUARD', charge:'CHARGE', break:'BREAK' };

    root.innerHTML = `
      <div class="ar-wrap">
        <div class="ar-head">
          <button class="ar-quit" onclick="UI.quitBattle()">← 退出</button>
          <span class="ar-round">R ${round}</span>
          <button class="ar-info" onclick="UI._showRulesPopup()">?</button>
        </div>

        <!-- 敌方 fighter-stage -->
        <div class="ar-stage ar-enemy">
          <div class="ar-stage-bg" onclick="UI._showHeroInfo('e')">
            ${b.eSkinImg ? `<img src="${b.eSkinImg}" alt="enemy">` : ''}
            <div class="ar-stage-mask"></div>
          </div>
          <div class="ar-hud-side">
            <div class="ar-name-block">
              <span class="ar-side">STATIC</span>
              <span class="ar-name-cn" style="color:${eH.color}">${b.eName}</span>
              <span class="ar-arch">${b.eLetter} · ${eH.archetype}</span>
            </div>
            ${this._chargeBar(eSt.charge, BATTLE.MAX_CHARGE)}
            ${this._energyDots(eSt.energy, BATTLE.MAX_ENERGY)}
            <div class="ar-pills">${heroPills(eSt, eH, b.eUlt)}</div>
          </div>
          <div class="ar-heart-corner" style="color:#FF6B7A">
            <span class="ar-h-icon">♥</span>
            <span class="ar-h-num">${eSt.hp}</span>
            <span class="ar-h-max">/${BATTLE.MAX_HP}</span>
          </div>
        </div>

        <!-- MOMENTUM 局势 -->
        <div class="ar-momentum">
          <div class="ar-mo-head">
            <span class="ar-mo-lbl">MOMENTUM · 局势</span>
            <span class="ar-mo-r">R${round}</span>
          </div>
          <div class="ar-mo-msg">${b.log.length > 0 ? b.log[b.log.length - 1].msg : '选你的频率 · 同时回响'}</div>
          <div class="ar-mo-sub">· 同时翻牌 · 快攻打断慢攻</div>
        </div>

        <!-- 我方 fighter-stage -->
        <div class="ar-stage ar-player">
          <div class="ar-stage-bg" onclick="UI._showHeroInfo('p')">
            ${b.pSkinImg ? `<img src="${b.pSkinImg}" alt="player">` : ''}
            <div class="ar-stage-mask"></div>
          </div>
          <div class="ar-heart-corner" style="color:#7BC9FF">
            <span class="ar-h-icon">♥</span>
            <span class="ar-h-num">${pSt.hp}</span>
            <span class="ar-h-max">/${BATTLE.MAX_HP}</span>
          </div>
          <div class="ar-hud-side ar-hud-right">
            <div class="ar-name-block">
              <span class="ar-side">YOU</span>
              <span class="ar-name-cn" style="color:${pH.color}">${b.pName}</span>
              <span class="ar-arch">${b.pLetter} · ${pH.archetype}</span>
            </div>
            ${this._chargeBar(pSt.charge, BATTLE.MAX_CHARGE, true)}
            ${this._energyDots(pSt.energy, BATTLE.MAX_ENERGY, true)}
            <div class="ar-pills ar-pills-right">${heroPills(pSt, pH, b.pUlt)}</div>
          </div>
        </div>

        <!-- 6 动作 tray + 三态决策区 -->
        <div class="ar-tray">
          <div class="ar-tray-title">CHOOSE YOUR FREQUENCY</div>
          <div class="ar-acts">
            ${BATTLE.ACTIONS.map((a, i) => `
              <button class="ar-act ar-act-${a.id} ${pending === a.id ? 'selected' : ''}"
                      ${!pickable(a.id) ? 'disabled' : ''}
                      onclick="UI.pickBattleAction('${a.id}')"
                      title="${a.desc} (${a.cost})">
                <span class="ar-a-key">${i + 1}</span>
                <div class="ar-a-icon">${glyph[a.id]}</div>
                <div class="ar-a-en">${actEn[a.id]}</div>
              </button>
            `).join('')}
          </div>
          <div class="ar-preview ${pending ? 'has-pending' : 'idle'}">
            ${previewTxt}
          </div>
          ${pending === 'power' && pSt.charge > 1 ? `
            <div class="ar-spend">
              <span>消耗蓄能</span>
              <input type="range" min="1" max="${pSt.charge}" value="${b.powerSpend}"
                     oninput="UI._battle.powerSpend=parseInt(this.value); document.getElementById('ar-spend-n').textContent=this.value">
              <span class="ar-spend-n" id="ar-spend-n">${b.powerSpend}</span>/<span>${pSt.charge}</span>
            </div>
          ` : ''}
          <button class="ar-commit ${pending ? 'ready' : ''}"
                  ${!pending ? 'disabled' : ''}
                  onclick="UI.fireBattleAction()">
            ${pending
              ? `✦ 释 放 · ${BATTLE.ACTIONS.find(a => a.id === pending).name}`
              : '选 一 个 动 作'}
          </button>
        </div>
      </div>
    `;
  },

  _chargeBar(cur, max, right = false) {
    return `<div class="ar-cbar ${right ? 'right' : ''}">
      <span class="ar-c-spark">✦</span>
      <div class="ar-c-line"><div class="ar-c-fill" style="width:${cur/max*100}%"></div></div>
      <span class="ar-c-end">∎</span>
    </div>`;
  },
  _energyDots(cur, max, right = false) {
    let s = `<div class="ar-edots ${right ? 'right' : ''}">`;
    for (let i = 0; i < max; i++) s += `<span class="ar-edot ${i < cur ? 'on' : ''}"></span>`;
    s += '</div>';
    return s;
  },
  _actionGlyphMap() {
    return {
      attack: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20 H28"/><path d="M22 12 L34 20 L22 28"/></svg>',
      power:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20 4 L20 10 M20 30 L20 36 M4 20 L10 20 M30 20 L36 20 M8 8 L12 12 M28 28 L32 32 M32 8 L28 12 M12 28 L8 32"/></svg>',
      block:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 L34 10 V22 Q34 32 20 36 Q6 32 6 22 V10 Z"/></svg>',
      guard:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="20,4 34,12 34,28 20,36 6,28 6,12"/></svg>',
      charge: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 32 L20 22 L30 8"/><path d="M22 8 L30 8 L30 16"/></svg>',
      break:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="12" stroke-dasharray="3 3"/><path d="M10 10 L30 30 M30 10 L10 30"/></svg>'
    };
  },

  _previewActionEffect(act, b) {
    if (!act) {
      // idle: 战术提示
      const tips = [];
      if (b.pSt.charge >= 8) tips.push('<span class="tip gold">⚡ Aria 共鸣溢出可激活</span>');
      else if (b.pSt.combo >= 3) tips.push('<span class="tip gold">⚡ 妍子烈触达可激活</span>');
      else if (b.pSt.hp <= 6) tips.push('<span class="tip gold">⚡ 小雨共鸣回响可激活</span>');
      if (b.eSt.charge >= 5) tips.push('<span class="tip risk">⚠ 对方蓄能 ${b.eSt.charge}/10 · 警惕爆响</span>');
      if (b.pSt.energy >= 2) tips.push('<span class="tip cyan">▣ 能量满 · 可凝固</span>');
      if (tips.length === 0) tips.push('<span class="tip">— 选一个动作 · 同时翻牌 —</span>');
      return tips.join(' ');
    }
    const a = BATTLE.ACTIONS.find(x => x.id === act);
    const dmg = act === 'attack' ? `约 ${b.pH.attackBase + Math.min(b.pSt.combo, b.pH.comboMax)} 伤害`
            : act === 'power'  ? `1 + ${b.powerSpend} = ${1 + b.powerSpend} 伤害（消 ${b.powerSpend} 蓄能）`
            : act === 'block'  ? `反伤 ${b.pH.blockReflect} · 挡触达`
            : act === 'guard'  ? `反伤 ${b.pH.guardReflect} · 挡所有 · 消 2 能量`
            : act === 'charge' ? `共鸣 +${BATTLE.chargeInc(b.pSt.cstreak, b.pH)}`
            : `若对方聚频 · 清零 ` ;
    return `<span class="ar-p-action">${a.name}</span> · <span class="ar-p-eff">${dmg}</span>`;
  },

  pickBattleAction(id) {
    const b = this._battle;
    if (!b || b.ended) return;
    if (b.pending === id) { b.pending = null; SFX.click(); this.renderBattleArena(); return; }
    b.pending = id;
    if (id === 'power') b.powerSpend = b.pSt.charge;
    SFX.click();
    this.renderBattleArena();
  },

  // 激活必杀 — 全屏 cut-in 演出 2.2s 后变 charged
  activateUlt(side) {
    const b = this._battle;
    if (!b || b.ended) return;
    const slot = side === 'p' ? b.pUlt : b.eUlt;
    const hero = side === 'p' ? b.pH : b.eH;
    const skinImg = side === 'p' ? b.pSkinImg : b.eSkinImg;
    if (slot.used || slot.charged || !slot.available) return;
    slot.charged = true;
    slot.remaining = 2;
    this._playUltSpotlight(hero, skinImg);
    setTimeout(() => this.renderBattleArena(), 2300);
  },

  _playUltSpotlight(hero, skinImg) {
    const bgClass = hero.ultimate.id === 'blaze' ? 'ult-bg-blaze'
                  : hero.ultimate.id === 'echo'  ? 'ult-bg-echo'
                  : 'ult-bg-overflow';
    const stage = document.createElement('div');
    stage.className = 'ult-spotlight';
    stage.style.setProperty('--ult-color', hero.color);
    stage.style.setProperty('--spot-bg', `${hero.color}30`);
    stage.innerHTML = `
      <div class="ult-spotlight-bg ${bgClass}"></div>
      <div class="ult-spotlight-figure">
        <div class="ult-spotlight-portrait">
          ${skinImg ? `<img src="${skinImg}" alt="ult">` : ''}
        </div>
      </div>
      <div class="ult-spotlight-text">
        <div class="letter">${hero.letter} · KEEPER</div>
        <div class="name">${hero.ultimate.cn}</div>
        <div class="en">${hero.ultimate.en}</div>
        <div class="divider"></div>
        <div class="tagline">${hero.ultimate.tagline || hero.ultimate.trigger}</div>
        <div class="effect">${hero.ultimate.effect}</div>
      </div>
    `;
    document.body.appendChild(stage);
    SFX.shake(1.8); SFX.ssrReveal(); SFX.vibrate([100, 50, 200, 50, 100]);
    setTimeout(() => stage.remove(), 2400);
  },

  async fireBattleAction() {
    const b = this._battle;
    if (!b || !b.pending || b.ended) return;
    const pAct = b.pending;
    const ai = BATTLE.aiPick(b.eSt, b.pSt, b.eH, b.pH);
    const eAct = b.eUlt.charged ? this._ultPreferredAction(b.eH) : ai.action;
    const r = BATTLE.resolveTurn(pAct, eAct, b.pSt, b.eSt, b.pH, b.eH,
      { pSpend: pAct === 'power' ? b.powerSpend : 0, eSpend: ai.spend });

    // 必杀生效覆盖
    let pUltFired = false, eUltFired = false;
    if (b.pUlt.charged && b.pUlt.remaining > 0) {
      const uid = b.pH.ultimate.id;
      if (uid === 'blaze' && pAct === 'attack') {
        r.eDmg = b.pH.attackBase + Math.min(b.pSt.combo, b.pH.comboMax) + 2;
        if (eAct === 'block') r.pDmg = 0;
        pUltFired = true; b.pUlt.used = true; b.pUlt.charged = false;
      } else if (uid === 'overflow' && pAct === 'power') {
        if (eAct === 'block') r.pDmg = 0;
        r.pC = b.pSt.charge; // 蓄能不消耗
        pUltFired = true; b.pUlt.used = true; b.pUlt.charged = false;
      } else if (uid === 'echo' && (pAct === 'block' || pAct === 'guard')) {
        // 反伤命中时回血
        if (r.eDmg > 0) {
          const heal = Math.floor(r.eDmg * 1.5) + 2;
          b.pSt.hp = Math.min(BATTLE.MAX_HP, b.pSt.hp + heal);
          pUltFired = true;
        }
        b.pUlt.remaining--;
        if (b.pUlt.remaining <= 0) { b.pUlt.used = true; b.pUlt.charged = false; }
      }
    }

    b.log.push({ pAct, eAct, msg: r.msg + (pUltFired ? ` · ${b.pH.ultimate.cn} 发动！` : '') });

    // 翻牌动画
    this._showReveal(pAct, eAct);
    await this._sleep(900);

    // === 防御 streak 计算（在 FX 之前，让谐振触发判定准确）===
    if (pAct === 'block' && r.eDmg > 0) {
      b.pDefStreak.block++; b.pDefStreak.guard = 0;
      r.eDmg += Math.min(b.pDefStreak.block - 1, 3); // 反伤递增
    } else if (pAct === 'guard' && r.eDmg > 0) {
      b.pDefStreak.guard++; b.pDefStreak.block = 0;
      r.eDmg += Math.min(b.pDefStreak.guard - 1, 3);
    } else if (pAct !== 'block' && pAct !== 'guard') {
      b.pDefStreak.block = 0; b.pDefStreak.guard = 0;
    }
    if (eAct === 'block' && r.pDmg > 0) {
      b.eDefStreak.block++; b.eDefStreak.guard = 0;
      r.pDmg += Math.min(b.eDefStreak.block - 1, 3);
    } else if (eAct === 'guard' && r.pDmg > 0) {
      b.eDefStreak.guard++; b.eDefStreak.block = 0;
      r.pDmg += Math.min(b.eDefStreak.guard - 1, 3);
    } else if (eAct !== 'block' && eAct !== 'guard') {
      b.eDefStreak.block = 0; b.eDefStreak.guard = 0;
    }

    // === FX 触发（按 v3.11-v3.14 spec 精确分类）===
    // 1. 普通命中震屏 + 伤害飘字
    if (r.pDmg > 0) this._hitFlash('.ar-player', r.pDmg);
    if (r.eDmg > 0) this._hitFlash('.ar-enemy', r.eDmg);

    // 2. 爆响穿透 burst（玩家 power 命中 spend ≥4）
    if (pAct === 'power' && b.powerSpend >= 4 && r.eDmg > 0) this._fxBurst('e');
    if (eAct === 'power' && ai.spend >= 4 && r.pDmg > 0) this._fxBurst('p');

    // 3. 凝固反震 guard（攻方被对方 guard 反伤命中）
    if (pAct !== 'guard' && pAct !== 'block' && eAct === 'guard' && r.pDmg > 0) this._fxGuard('e');
    if (eAct !== 'guard' && eAct !== 'block' && pAct === 'guard' && r.eDmg > 0) this._fxGuard('p');

    // 4. 普防 block 反弹
    if (pAct === 'attack' && eAct === 'block' && r.pDmg > 0) this._fxBlock('e');
    if (eAct === 'attack' && pAct === 'block' && r.eDmg > 0) this._fxBlock('p');

    // 5. 触达谐振（连击 ×3 命中）
    if (pAct === 'attack' && r.eDmg > 0 && r.pCb === 3) this._fxAtkReson('p');
    if (eAct === 'attack' && r.pDmg > 0 && r.eCb === 3) this._fxAtkReson('e');

    // 6. 反震谐振（连防 ×3 反伤命中）
    if ((pAct === 'block' || pAct === 'guard') && r.eDmg > 0) {
      const streak = pAct === 'block' ? b.pDefStreak.block : b.pDefStreak.guard;
      if (streak === 3) this._fxDefReson('p');
    }
    if ((eAct === 'block' || eAct === 'guard') && r.pDmg > 0) {
      const streak = eAct === 'block' ? b.eDefStreak.block : b.eDefStreak.guard;
      if (streak === 3) this._fxDefReson('e');
    }

    // 7. 普通连击 ≥2 label（命中时）
    if (pAct === 'attack' && r.eDmg > 0 && r.pCb >= 2 && r.pCb !== 3) this._fxCombo('p', r.pCb);
    if (eAct === 'attack' && r.pDmg > 0 && r.eCb >= 2 && r.eCb !== 3) this._fxCombo('e', r.eCb);

    if (pAct === 'power' || eAct === 'power') SFX.ssrReveal();
    else if (pAct === 'attack' || eAct === 'attack') SFX.cardFlip();
    else SFX.click();

    await this._sleep(550);

    // 应用结果
    b.pSt = { ...b.pSt, hp: Math.max(0, b.pSt.hp - r.pDmg), energy: Math.min(BATTLE.MAX_ENERGY, r.pE + 1), charge: r.pC, combo: r.pCb, cstreak: r.pCs };
    b.eSt = { ...b.eSt, hp: Math.max(0, b.eSt.hp - r.eDmg), energy: Math.min(BATTLE.MAX_ENERGY, r.eE + 1), charge: r.eC, combo: r.eCb, cstreak: r.eCs };

    if (r.pDmg > 0) b.pHitCount++;
    if (r.eDmg > 0) b.eHitCount++;
    // 小雨被动：被命中 2 次 +1 能量
    if (b.pH.id === 'B' && b.pHitCount >= 2) { b.pSt.energy = Math.min(BATTLE.MAX_ENERGY, b.pSt.energy + 1); b.pHitCount = 0; }
    if (b.eH.id === 'B' && b.eHitCount >= 2) { b.eSt.energy = Math.min(BATTLE.MAX_ENERGY, b.eSt.energy + 1); b.eHitCount = 0; }

    b.pending = null;
    b.round++;

    const result = BATTLE.checkEnd(b.pSt, b.eSt);
    if (result) {
      b.ended = true;
      this.renderBattleArena();
      setTimeout(() => this._showBattleResult(result), 600);
      return;
    }
    this.renderBattleArena();
  },

  _ultPreferredAction(hero) {
    if (hero.ultimate.id === 'blaze') return 'attack';
    if (hero.ultimate.id === 'overflow') return 'power';
    if (hero.ultimate.id === 'echo') return 'block';
    return 'attack';
  },

  // === 完整 FX 系统（移植自 demo battle）===

  // 普通连击命中 label（"频率同步 ×N"）
  _fxCombo(side, n) {
    const stage = document.querySelector(side === 'p' ? '.ar-player' : '.ar-enemy');
    if (!stage) return;
    const fx = document.createElement('div');
    fx.className = `fx-combo ${side === 'p' ? 'player' : 'enemy'}`;
    fx.innerHTML = `<span class="combo-label">频 率 同 步 ×${n}</span>`;
    stage.appendChild(fx);
    setTimeout(() => fx.remove(), 1000);
  },

  // 爆响穿透 burst（power 命中 spend ≥4）
  _fxBurst(side) {
    const stage = document.querySelector(side === 'p' ? '.ar-player' : '.ar-enemy');
    if (!stage) return;
    const fx = document.createElement('div');
    fx.className = `fx-burst ${side === 'p' ? 'player' : 'enemy'}`;
    fx.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:9';
    let rays = '';
    for (let i = 0; i < 8; i++) {
      rays += `<div class="ray" style="--rot:${i * 45}deg"></div>`;
    }
    fx.innerHTML = `
      <div class="fx-burst-aurora"></div>
      <div class="fx-burst-rays">${rays}</div>
      <div class="fx-burst-label">穿 透 爆 响</div>
    `;
    stage.appendChild(fx);
    SFX.shake(1.5); SFX.vibrate([120, 50, 200]); SFX.ssrReveal();
    setTimeout(() => fx.remove(), 1500);
  },

  // 凝固反震 guard（guard 反伤命中）
  _fxGuard(side) {
    const stage = document.querySelector(side === 'p' ? '.ar-player' : '.ar-enemy');
    if (!stage) return;
    const fx = document.createElement('div');
    fx.className = `fx-guard ${side === 'p' ? 'player' : 'enemy'}`;
    fx.innerHTML = `
      <div class="freeze-flash"></div>
      <div class="hex outer"><svg viewBox="-50 -50 100 100"><polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20"/></svg></div>
      <div class="hex inner"><svg viewBox="-40 -40 80 80"><polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"/></svg></div>
      <div class="guard-label">瞬 间 守 护</div>
    `;
    stage.appendChild(fx);
    SFX.cardFlip(); SFX.vibrate([60, 30, 80]);
    setTimeout(() => fx.remove(), 1000);
  },

  // 普防反弹 block
  _fxBlock(side) {
    const stage = document.querySelector(side === 'p' ? '.ar-player' : '.ar-enemy');
    if (!stage) return;
    const fx = document.createElement('div');
    fx.className = `fx-guard block ${side === 'p' ? 'player' : 'enemy'}`;
    fx.innerHTML = `
      <div class="freeze-flash"></div>
      <div class="hex outer"><svg viewBox="-50 -50 100 100"><polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20"/></svg></div>
      <div class="guard-label">镜 像 反 射</div>
    `;
    stage.appendChild(fx);
    SFX.cardFlip();
    setTimeout(() => fx.remove(), 950);
  },

  // 触达谐振（连击 ×3）
  _fxAtkReson(side) {
    const stage = document.querySelector(side === 'p' ? '.ar-player' : '.ar-enemy');
    if (!stage) return;
    const fx = document.createElement('div');
    fx.className = `fx-atk-reson ${side === 'p' ? 'player' : 'enemy'}`;
    let shards = '';
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const dist = 30;
      shards += `<div class="arrow" style="--tx:${Math.cos(ang) * dist}px;--ty:${Math.sin(ang) * dist}px;--rot:${i * 60}deg"></div>`;
    }
    fx.innerHTML = `
      <div class="pulse"></div><div class="pulse"></div><div class="pulse"></div>
      <div class="core"></div>
      ${shards}
      <div class="atk-label">触 达 谐 振</div>
    `;
    stage.appendChild(fx);
    // 屏幕级 flash
    const flash = document.createElement('div');
    flash.className = 'fx-atk-reson-flash';
    document.body.appendChild(flash);
    SFX.shake(1.5); SFX.ssrReveal(); SFX.vibrate([100, 50, 200]);
    setTimeout(() => { fx.remove(); flash.remove(); }, 1500);
  },

  // 反震谐振（连防 ×3）
  _fxDefReson(side) {
    const stage = document.querySelector(side === 'p' ? '.ar-player' : '.ar-enemy');
    if (!stage) return;
    const fx = document.createElement('div');
    fx.className = `fx-reson ${side === 'p' ? 'player' : 'enemy'}`;
    let shards = '';
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const dist = 24;
      shards += `<div class="shard" style="--tx:${Math.cos(ang) * dist}px;--ty:${Math.sin(ang) * dist}px;--rot:${i * 45}deg"></div>`;
    }
    fx.innerHTML = `
      <div class="pulse"></div><div class="pulse"></div><div class="pulse"></div>
      <div class="core"></div>
      ${shards}
      <div class="reson-label">反 震 谐 振</div>
    `;
    stage.appendChild(fx);
    const flash = document.createElement('div');
    flash.className = 'fx-reson-flash';
    document.body.appendChild(flash);
    SFX.shake(1.2); SFX.ssrReveal(); SFX.vibrate([80, 30, 120]);
    setTimeout(() => { fx.remove(); flash.remove(); }, 1500);
  },

  _showReveal(pAct, eAct) {
    const labels = { attack: 'ATTACK', power: 'POWER', block: 'BLOCK', guard: 'GUARD', charge: 'CHARGE', break: 'BREAK' };
    const glyph = { attack: '→', power: '✦', block: '◊', guard: '⬡', charge: '↗', break: '⊗' };
    const overlay = document.createElement('div');
    overlay.className = 'ar-reveal';
    overlay.innerHTML = `
      <div class="ar-rv-card enemy">
        <span class="ar-rv-tier">STATIC</span>
        <span class="ar-rv-glyph b-glyph-${eAct}">${glyph[eAct]}</span>
        <span class="ar-rv-name">${labels[eAct]}</span>
      </div>
      <div class="ar-rv-vs">VS</div>
      <div class="ar-rv-card player">
        <span class="ar-rv-tier">YOU</span>
        <span class="ar-rv-glyph b-glyph-${pAct}">${glyph[pAct]}</span>
        <span class="ar-rv-name">${labels[pAct]}</span>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
    setTimeout(() => overlay.remove(), 1300);
  },

  _hitFlash(selector, dmg) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('ar-hit');
    const num = document.createElement('div');
    num.className = 'ar-dmg-num';
    num.textContent = `-${dmg}`;
    el.appendChild(num);
    setTimeout(() => { el.classList.remove('ar-hit'); num.remove(); }, 800);
  },

  _sleep(ms) { return new Promise(r => setTimeout(r, ms)); },

  // 立绘点击 → HeroInfoPopup
  _showHeroInfo(side) {
    const b = this._battle;
    if (!b) return;
    const hero = side === 'p' ? b.pH : b.eH;
    const name = side === 'p' ? b.pName : b.eName;
    const isPlayer = side === 'p';
    const popup = document.createElement('div');
    popup.className = 'ar-hero-popup';
    popup.innerHTML = `
      <div class="ar-hp-mask" onclick="this.parentElement.remove()"></div>
      <div class="ar-hp-card ${isPlayer ? 'player' : 'enemy'}">
        <div class="ar-hp-letter" style="color:${hero.color}">${hero.letter}</div>
        <h3 style="color:${hero.color}">${name}</h3>
        <div class="ar-hp-arch">${hero.archetype}</div>
        <div class="ar-hp-passive">
          <div class="ar-hp-label">被动 · 角色特性</div>
          <p>${hero.id === 'A' ? '触达基础伤害 3 · 连击 3/4/5'
              : hero.id === 'B' ? '反伤 +1 · 每被命中 2 次自动 +1 能量'
              : '蓄能 2/4/7/11 · 极光不熄'}</p>
        </div>
        <div class="ar-hp-ult">
          <div class="ar-hp-label">✦ 签名技能</div>
          <p class="ar-hp-ult-cn">${hero.ultimate.cn} <small>${hero.ultimate.en}</small></p>
          <p class="ar-hp-ult-tr">触发 · ${hero.ultimate.trigger}</p>
          <p class="ar-hp-ult-eff">${hero.ultimate.effect}</p>
        </div>
        <button class="ar-hp-close" onclick="this.parentElement.parentElement.remove()">关闭</button>
      </div>
    `;
    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('active'));
  },

  _showRulesPopup() {
    SFX.click();
    const mask = document.createElement('div');
    mask.id = 'mem-modal-mask';
    mask.className = 'mem-modal-mask';
    mask.innerHTML = `
      <div class="mem-modal" style="max-width:340px;text-align:left">
        <div class="mem-modal-icon" style="text-align:center">⚔</div>
        <div class="mem-modal-title" style="text-align:center">频率战 · 规则</div>
        <div class="mem-modal-sub" style="text-align:left;margin-top:14px;line-height:1.85">
<b style="color:var(--resonance)">6 动作</b><br>触达 / 爆响 / 守护 / 凝固 / 聚频 / 散频<br><br>
<b style="color:var(--resonance)">HP 与节奏</b><br>HP 归 0 即消散 · 蓄能上限 10<br>能量上限 3（每回合 +1）<br><br>
<b style="color:var(--resonance)">交互</b><br>同时翻牌 · 快攻打断慢攻 · 强攻消蓄能<br><br>
<b style="color:var(--resonance)">签名技</b><br>每局 1 次 · HUD pill 发光即可激活
        </div>
        <div class="mem-modal-actions">
          <button class="mem-modal-btn primary" onclick="UI._closeModal()">明白了</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    requestAnimationFrame(() => mask.classList.add('show'));
    mask.addEventListener('click', e => { if (e.target === mask) this._closeModal(); });
  },

  _showBattleResult(result) {
    const b = this._battle;
    const state = GameState.get();
    state.battleStats = state.battleStats || { win: 0, loss: 0, dailyWin: 0, dailyWinDate: '' };
    const today = new Date().toDateString();
    if (state.battleStats.dailyWinDate !== today) { state.battleStats.dailyWin = 0; state.battleStats.dailyWinDate = today; }

    let title, sub, gotFragment = false;
    if (result === 'win') {
      state.battleStats.win = (state.battleStats.win || 0) + 1;
      if (state.battleStats.dailyWin < 3) {
        state.battleStats.dailyWin++;
        state.coserData[state.currentCoser].fragment = (state.coserData[state.currentCoser].fragment || 0) + 1;
        gotFragment = true;
      }
      title = '共鸣胜利';
      sub = `${b.pName} 守住了频率`;
      SFX.ssrReveal();
    } else if (result === 'lose') {
      state.battleStats.loss = (state.battleStats.loss || 0) + 1;
      title = '消散';
      sub = `${b.pName} 的频率失去了波动`;
    } else {
      title = '同归';
      sub = '双方频率同时归零';
    }
    GameState.save(state);
    this.updateStatusBar();

    const overlay = document.createElement('div');
    overlay.className = `ar-result ${result}`;
    overlay.innerHTML = `
      <div class="ar-res-card">
        <h2>${title}</h2>
        <p>${sub}</p>
        ${gotFragment ? `<div class="ar-res-reward">+1 Fragment · 今日 ${state.battleStats.dailyWin}/3</div>` : ''}
        <div class="ar-res-stats">${b.round - 1} 回合 · 你 HP ${b.pSt.hp}/${BATTLE.MAX_HP} · 对方 HP ${b.eSt.hp}/${BATTLE.MAX_HP}</div>
        <div class="ar-res-actions">
          <button onclick="this.closest('.ar-result').remove(); UI.startBattle();">再来一场</button>
          <button class="primary" onclick="this.closest('.ar-result').remove(); UI._battle=null; UI.renderBattleHub();">返回大厅</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
  },

  quitBattle() {
    if (this._battle && !this._battle.ended) {
      this._confirmModal({
        icon: '⚠',
        title: '退出当前战斗？',
        sub: '该场不计入战绩 · 进度全部丢弃',
        primary: '退出',
        secondary: '继续战斗',
        danger: true,
        onOk: () => { this._battle = null; this.renderBattleHub(); }
      });
      return;
    }
    this._battle = null;
    this.renderBattleHub();
  },

  // ============================================================
  // 6. Crystal Station 商店
  // ============================================================
  _activeCS: 'yanzi',
  openCrystalStation() {
    document.getElementById('crystal-station').classList.add('show');
    this.renderCrystalStation();
    SFX.click();
    // 首次打开 → init 首充倒计时 + 自动弹首充翻倍 modal
    const s = GameState.get();
    if (!s.firstCharge.startAt) {
      s.firstCharge.startAt = Date.now();
      GameState.save(s);
    }
    const elapsed = Date.now() - s.firstCharge.startAt;
    const expired = elapsed > 7 * 86400 * 1000;
    if (!s.firstCharge.claimed && !s.firstCharge.shown && !expired) {
      s.firstCharge.shown = true;
      GameState.save(s);
      setTimeout(() => this.openFirstChargeModal(), 400);
    }
  },
  closeCrystalStation() {
    document.getElementById('crystal-station').classList.remove('show');
  },
  renderCrystalStation() {
    const root = document.getElementById('crystal-station-content');
    const state = GameState.get();
    const active = this._activeCS;
    const cdata = state.coserData[active];

    const ctabs = listCosers().map(c => `
      <button class="cs-ctab ${c.id === active ? 'active' : ''}" onclick="UI.switchCSCoser('${c.id}')">
        <span class="ttl">${c.name}</span>
        <span class="sub">${c.id === 'aria' ? 'VIRTUAL' : c.tier.replace('Memoria', '').trim() || 'Memoria'}</span>
      </button>
    `).join('');

    const packs = [
      { id: 'small', name: '初遇之礼', beacon: 60, price: '¥6', desc: 'Memoria 初次共鸣' },
      { id: 'medium', name: '心动礼包', beacon: 330, price: '¥30', desc: '加赠 30 Beacon · 月卡 1 张' },
      { id: 'large', name: '挚爱礼盒', beacon: 1100, price: '¥98', desc: '加赠 100 Beacon · 限定券 5 张' }
    ];
    const crystalPacks = [
      { id: 'crystal-3', name: '秘金沙 · 单文', crystal: 60, price: '¥3', desc: '60 Crystal · 紧急补给' },
      { id: 'crystal-30', name: '秘金沙 · 十连', crystal: 660, price: '¥30', desc: '660 Crystal · 加赠 60' }
    ];

    root.innerHTML = `
      <div class="cs-head">
        <div class="cs-title">Crystal Station<span>· 资源 · 礼包 · 守护补给</span></div>
        <button class="cs-close" onclick="UI.closeCrystalStation()">✕</button>
      </div>

      <div class="cs-ctab-row">${ctabs}</div>

      <div class="cs-assets3">
        <div class="cs-a3-item beacon"><div class="cs-a3-num">${cdata.beacon || 0}</div><div class="cs-a3-label">BEACON</div></div>
        <div class="cs-a3-item crystal"><div class="cs-a3-num">${cdata.crystal || 0}</div><div class="cs-a3-label">CRYSTAL</div></div>
        <div class="cs-a3-item fragment"><div class="cs-a3-num">${cdata.fragment || 0}</div><div class="cs-a3-label">FRAGMENT</div></div>
      </div>

      <div class="me-section-title">BEACON · 共鸣燃料</div>
      <div class="cs-pack-list">
        ${packs.map(p => `
          <div class="cs-pack">
            <div class="cs-pack-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
            </div>
            <div class="cs-pack-body">
              <div class="cs-pack-name">${p.name}</div>
              <div class="cs-pack-desc">${p.desc}</div>
              <div class="cs-pack-gain">+${p.beacon} Beacon</div>
            </div>
            <button class="cs-pack-btn" onclick="UI.buyPack('${active}','beacon',${p.beacon},'${p.price}')">${p.price}</button>
          </div>
        `).join('')}
      </div>

      <div class="me-section-title">CRYSTAL · 秘金沙（限定/月卡）</div>
      <div class="cs-pack-list">
        ${crystalPacks.map(p => `
          <div class="cs-pack">
            <div class="cs-pack-icon" style="color:var(--aurora-violet);border-color:rgba(196,160,255,0.4);background:linear-gradient(135deg,rgba(196,160,255,0.18),rgba(123,201,255,0.08))">✦</div>
            <div class="cs-pack-body">
              <div class="cs-pack-name">${p.name}</div>
              <div class="cs-pack-desc">${p.desc}</div>
              <div class="cs-pack-gain" style="color:var(--aurora-violet)">+${p.crystal} Crystal</div>
            </div>
            <button class="cs-pack-btn violet" onclick="UI.buyPack('${active}','crystal',${p.crystal},'${p.price}')">${p.price}</button>
          </div>
        `).join('')}
      </div>

      <div class="me-section-title">月度补给 · Sync Pass</div>
      <div class="cs-pack-list">
        ${this._renderMonthCard(active, cdata)}
      </div>

      <div class="me-section-title">FRAGMENT · 共鸣碎片兑换</div>
      <div class="cs-pack-list">
        <div class="cs-pack">
          <div class="cs-pack-icon">✦</div>
          <div class="cs-pack-body">
            <div class="cs-pack-name">通用抽卡券 ×1</div>
            <div class="cs-pack-desc">100 碎片 · 兜底白嫖路径</div>
            <div class="cs-pack-gain">需 100 Fragment</div>
          </div>
          <button class="cs-pack-btn" ${(cdata.fragment||0) < 100 ? 'disabled' : ''} onclick="UI.redeemShard('${active}','ticket',100)">兑换</button>
        </div>
        <div class="cs-pack">
          <div class="cs-pack-icon">✦</div>
          <div class="cs-pack-body">
            <div class="cs-pack-name">频率定位</div>
            <div class="cs-pack-desc">500 碎片 · 自选一张未拥有的 RES 直接到手</div>
            <div class="cs-pack-gain">需 500 Fragment</div>
          </div>
          <button class="cs-pack-btn" ${(cdata.fragment||0) < 500 ? 'disabled' : ''} onclick="UI.redeemShard('${active}','locate',500)">兑换</button>
        </div>
      </div>
    `;
  },

  _renderMonthCard(coserId, cdata) {
    const mc = cdata.monthCard || { startAt: null, lastClaim: '' };
    const today = new Date().toDateString();
    if (!mc.startAt) {
      return `
        <div class="cs-pack cs-monthcard">
          <div class="cs-pack-icon" style="color:var(--resonance);border-color:rgba(255,216,155,0.5);background:linear-gradient(135deg,rgba(255,216,155,0.2),rgba(255,184,217,0.08))">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="cs-pack-body">
            <div class="cs-pack-name">月卡 · Sync Pass</div>
            <div class="cs-pack-desc">连续 30 天每日 +3 Beacon · 归属 ${COSERS[coserId].name}</div>
            <div class="cs-pack-gain" style="color:var(--resonance)">总计 90 Beacon · 平均 ¥0.3 / Beacon</div>
          </div>
          <button class="cs-pack-btn" style="background:linear-gradient(135deg,var(--resonance),#FFA952);color:#2a1500;border-color:transparent" onclick="UI.buyMonthCard('${coserId}')">¥30</button>
        </div>
      `;
    }
    const dayMs = 86400 * 1000;
    const elapsedDays = Math.floor((Date.now() - mc.startAt) / dayMs);
    const remain = Math.max(0, 30 - elapsedDays);
    const claimedToday = mc.lastClaim === today;
    if (remain === 0) {
      return `
        <div class="cs-pack cs-monthcard expired">
          <div class="cs-pack-icon">⌖</div>
          <div class="cs-pack-body">
            <div class="cs-pack-name">月卡已到期</div>
            <div class="cs-pack-desc">${COSERS[coserId].name} · 已守护 30 天</div>
            <div class="cs-pack-gain">可再购买一张</div>
          </div>
          <button class="cs-pack-btn" style="background:linear-gradient(135deg,var(--resonance),#FFA952);color:#2a1500;border-color:transparent" onclick="UI.buyMonthCard('${coserId}')">¥30 续</button>
        </div>
      `;
    }
    return `
      <div class="cs-pack cs-monthcard active">
        <div class="cs-pack-icon" style="color:var(--resonance);border-color:rgba(255,216,155,0.5);background:linear-gradient(135deg,rgba(255,216,155,0.25),rgba(255,184,217,0.1))">✦</div>
        <div class="cs-pack-body">
          <div class="cs-pack-name">月卡 · Sync Pass <span class="cs-mc-tag">已激活</span></div>
          <div class="cs-pack-desc">${COSERS[coserId].name} · 剩余 ${remain} 天 · 每日 +3 Beacon</div>
          <div class="cs-pack-gain" style="color:${claimedToday ? 'var(--text-faint)' : 'var(--resonance)'}">
            ${claimedToday ? '今日已领取 · 明天再来' : '今日可领 +3 Beacon'}
          </div>
        </div>
        <button class="cs-pack-btn" ${claimedToday ? 'disabled' : ''} style="${claimedToday ? '' : 'background:linear-gradient(135deg,var(--resonance),#FFA952);color:#2a1500;border-color:transparent'}" onclick="UI.claimMonthCard('${coserId}')">
          ${claimedToday ? '已领' : '领取'}
        </button>
      </div>
    `;
  },

  buyMonthCard(coserId) {
    this._confirmModal({
      icon: '✦',
      title: '购买月卡 · Sync Pass',
      sub: `¥30 / 30 天 · 每日 +3 Beacon\n总计 90 Beacon · 归属 ${COSERS[coserId].name}`,
      primary: '确认购买',
      onOk: () => {
        GameState.updateCoserData(coserId, d => ({ ...d, monthCard: { startAt: Date.now(), lastClaim: '' } }));
        SFX.cardFlip();
        this.renderCrystalStation();
        this.showToast({ icon: '✦', title: '月卡已激活', sub: `${COSERS[coserId].name} · 30 天每日来领取 +3 Beacon`, duration: 3500 });
      }
    });
  },

  claimMonthCard(coserId) {
    const s = GameState.get();
    const cd = s.coserData[coserId];
    const today = new Date().toDateString();
    if (!cd.monthCard?.startAt) return;
    if (cd.monthCard.lastClaim === today) return;
    cd.monthCard.lastClaim = today;
    cd.beacon = (cd.beacon || 0) + 3;
    GameState.save(s);
    SFX.cardFlip();
    this.updateStatusBar();
    this.renderCrystalStation();
    this.showToast({ icon: '✦', title: '月卡今日已领 · +3 Beacon', sub: `${COSERS[coserId].name} 频道已补给`, duration: 2500 });
  },

  openFirstChargeModal() {
    SFX.click();
    const s = GameState.get();
    const elapsed = Date.now() - (s.firstCharge.startAt || Date.now());
    const remainMs = Math.max(0, 7 * 86400 * 1000 - elapsed);
    const remainD = Math.floor(remainMs / 86400000);
    const remainH = Math.floor((remainMs % 86400000) / 3600000);
    const remainM = Math.floor((remainMs % 3600000) / 60000);

    const mask = document.createElement('div');
    mask.id = 'mem-modal-mask';
    mask.className = 'mem-modal-mask first-pay-modal-mask';
    mask.innerHTML = `
      <div class="first-pay-modal-card">
        <button class="fp-close" onclick="UI._closeModal()">✕</button>
        <span class="fp-badge">FIRST · 限 7 天</span>
        <h2 class="fp-title">首 充 翻 倍</h2>
        <p class="fp-desc">"她说：第一次来的人，我给你多一些时间"</p>
        <div class="fp-reward">
          <div class="x"><span>充值</span><span>¥6</span></div>
          <div class="x"><span>基础 Beacon</span><span>10</span></div>
          <div class="x bonus"><span>首充加赠</span><span>+10</span></div>
          <div class="fp-total"><span>总计获得</span><span>20 BEACON</span></div>
        </div>
        <button class="fp-grab" onclick="UI.claimFirstCharge()">立 即 领 取</button>
        <div class="fp-timer">⏳ 距首充优惠失效：${remainD} 天 ${remainH} 时 ${remainM} 分</div>
      </div>
    `;
    document.body.appendChild(mask);
    requestAnimationFrame(() => mask.classList.add('show'));
    mask.addEventListener('click', e => { if (e.target === mask) this._closeModal(); });
  },

  claimFirstCharge() {
    const s = GameState.get();
    if (s.firstCharge.claimed) { this._closeModal(); return; }
    this._closeModal();
    this._confirmModal({
      icon: '✦',
      title: '首充翻倍 · ¥6',
      sub: '+10 基础 Beacon + 10 加赠 = 20 Beacon\n归属 ${COSERS[s.currentCoser].name}\n模拟支付 · 真实支付将在 V2.0 接入'.replace('${COSERS[s.currentCoser].name}', COSERS[s.currentCoser].name),
      primary: '确认领取',
      onOk: () => {
        const s2 = GameState.get();
        s2.firstCharge.claimed = true;
        s2.coserData[s2.currentCoser].beacon = (s2.coserData[s2.currentCoser].beacon || 0) + 20;
        GameState.save(s2);
        SFX.ssrReveal();
        this.updateStatusBar();
        this.renderCrystalStation();
        this.showToast({ icon: '✦', title: '首充翻倍已到账 · +20 Beacon', sub: `${COSERS[s2.currentCoser].name} 频道补给已发放`, duration: 4000 });
      }
    });
  },
  switchCSCoser(id) {
    this._activeCS = id;
    SFX.click();
    this.renderCrystalStation();
  },
  buyPack(coserId, type, amount, price) {
    const unit = type === 'beacon' ? 'Beacon' : 'Crystal';
    this._confirmModal({
      icon: '✦',
      title: `购买 ${price}`,
      sub: `+${amount} ${unit} · ${COSERS[coserId].name}\n模拟支付 · 真实支付将在 V2.0 接入`,
      primary: '确认充值',
      secondary: '稍后再说',
      onOk: () => {
        GameState.updateCoserData(coserId, d => ({ ...d, [type]: (d[type] || 0) + amount }));
        SFX.cardFlip();
        this.updateStatusBar();
        this.renderCrystalStation();
        this.showToast({ icon: '✦', title: `充值成功 · +${amount} ${unit}`, sub: `${COSERS[coserId].name} 频道已补给`, duration: 3000 });
      }
    });
  },
  redeemShard(coserId, type, cost) {
    const s = GameState.get();
    const cd = s.coserData[coserId];
    if ((cd.fragment || 0) < cost) {
      this.showToast({ icon: '◌', title: 'Fragment 不足', sub: `当前 ${cd.fragment || 0} / 需 ${cost}`, duration: 3000 });
      return;
    }
    if (type === 'ticket') {
      this._confirmModal({
        icon: '◉',
        title: '兑换抽卡券',
        sub: `花费 ${cost} Fragment\n+1 张 ${COSERS[coserId].name} 抽卡券`,
        primary: '确认兑换',
        onOk: () => {
          const s2 = GameState.get();
          const cd2 = s2.coserData[coserId];
          cd2.fragment -= cost;
          cd2.tickets = (cd2.tickets || 0) + 1;
          GameState.save(s2);
          SFX.click();
          this.updateStatusBar();
          this.renderCrystalStation();
          this.showToast({ icon: '✦', title: '兑换成功 · +1 抽卡券', sub: `${COSERS[coserId].name} · Fragment -${cost}`, duration: 3000 });
        }
      });
    } else if (type === 'locate') {
      const owned = new Set(cd.collection);
      const chars = getCharsByCoser(coserId);
      const missing = [];
      chars.forEach(c => c.images.forEach((img, idx) => {
        const uid = `${c.id}_${idx}`;
        if (img.rarity === 'SSR' && !owned.has(uid)) missing.push({ uid, charName: c.name, label: `${c.name} · 第 ${idx + 1} 张`, meta: 'RES' });
      }));
      if (missing.length === 0) {
        this.showToast({ icon: '✓', title: '已全部拥有', sub: `${COSERS[coserId].name} 的所有 RESONANCE 已收集`, duration: 3000 });
        return;
      }
      this._pickerModal({
        icon: '◉',
        title: '频率定位',
        sub: `花费 ${cost} Fragment · 选择一张 RESONANCE 直接守护`,
        items: missing.slice(0, 30),
        onPick: (pick) => {
          const s2 = GameState.get();
          const cd2 = s2.coserData[coserId];
          if ((cd2.fragment || 0) < cost) return;
          cd2.fragment -= cost;
          cd2.collection.push(pick.uid);
          cd2.skinUnlocks[pick.uid] = { pulls: 1, level: 1 };
          GameState.save(s2);
          SFX.ssrReveal();
          this.updateStatusBar();
          this.renderCrystalStation();
          this.showToast({ icon: '✦', title: '频率定位成功', sub: `「${pick.label}」已加入图鉴`, duration: 4000 });
        }
      });
    }
  }
};
