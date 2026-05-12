// UI动画与交互
const UI = {
  // 显示抽卡结果弹窗
  showPullResults(cards, callback) {
    const overlay = document.getElementById('pull-overlay');
    const container = document.getElementById('pull-results');
    overlay.classList.add('active');
    container.innerHTML = '';

    cards.forEach((card, index) => {
      const cardEl = this.createCardElement(card, true);
      cardEl.style.animationDelay = `${index * 0.15}s`;
      container.appendChild(cardEl);
    });

    // 点击关闭
    overlay.onclick = () => {
      overlay.classList.remove('active');
      if (callback) callback();
    };
  },

  // 创建卡牌DOM元素
  createCardElement(card, withAnimation = false) {
    const el = document.createElement('div');
    el.className = `card card-${card.rarity.toLowerCase()}`;
    if (withAnimation) el.classList.add('card-reveal');

    const config = RARITY_CONFIG[card.rarity];

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="card-glow" style="box-shadow: 0 0 30px ${config.glow}, inset 0 0 30px ${config.glow}"></div>
          <img src="${card.image}" alt="${card.character.name}" loading="lazy">
          <div class="card-info">
            <span class="card-rarity" style="background: ${config.color}">${config.label}</span>
            <span class="card-name">${card.character.name}</span>
          </div>
          ${card.isDuplicate ? `<div class="card-duplicate">重复 +${card.coinValue}金币</div>` : ''}
        </div>
      </div>
    `;

    // 点击查看大图
    el.onclick = (e) => {
      e.stopPropagation();
      this.showCardDetail(card);
    };

    return el;
  },

  // 卡牌详情弹窗
  showCardDetail(card) {
    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('detail-content');
    const config = RARITY_CONFIG[card.rarity];

    content.innerHTML = `
      <div class="detail-card card-${card.rarity.toLowerCase()}">
        <img src="${card.image}" alt="${card.character.name}">
        <div class="detail-info">
          <h2>${card.character.name}</h2>
          <span class="detail-rarity" style="background: ${config.color}">${config.label}</span>
          <p>${card.character.description}</p>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    overlay.onclick = () => overlay.classList.remove('active');
  },

  // 更新顶部状态栏
  updateStatusBar() {
    const state = GameState.get();
    document.getElementById('ticket-count').textContent = state.tickets;
    document.getElementById('coin-count').textContent = state.coins;
    document.getElementById('pity-count').textContent = `${state.pityCount}/90`;
    document.getElementById('collection-count').textContent = state.collection.length;
  },

  // 渲染图鉴页
  renderCollection(filter = 'ALL') {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    const filtered = filter === 'ALL'
      ? CHARACTERS
      : CHARACTERS.filter(c => c.rarity === filter);

    filtered.forEach(char => {
      const progress = GachaEngine.getCharacterProgress(char.id);
      const config = RARITY_CONFIG[char.rarity];
      const state = GameState.get();

      // 获取该角色已收集的卡牌
      const collectedImages = char.images
        .map((img, idx) => ({ img, idx, uid: `${char.id}_${idx}` }))
        .filter(item => state.collection.includes(item.uid));

      const previewImg = collectedImages.length > 0
        ? collectedImages[0].img
        : null;

      const el = document.createElement('div');
      el.className = `collection-card card-${char.rarity.toLowerCase()}`;
      el.innerHTML = `
        ${previewImg
          ? `<img src="${previewImg}" alt="${char.name}" loading="lazy">`
          : `<div class="card-locked"><span>?</span></div>`
        }
        <div class="collection-info">
          <span class="collection-rarity" style="background:${config.color}">${config.label}</span>
          <span class="collection-name">${char.name}</span>
          <div class="collection-progress">
            <div class="progress-bar" style="width:${progress.percent}%"></div>
            <span>${progress.collected}/${progress.total}</span>
          </div>
        </div>
      `;

      el.onclick = () => this.showCharacterGallery(char);
      grid.appendChild(el);
    });
  },

  // 角色画廊（展示该角色已收集的所有卡牌）
  showCharacterGallery(char) {
    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('detail-content');
    const state = GameState.get();
    const config = RARITY_CONFIG[char.rarity];
    const progress = GachaEngine.getCharacterProgress(char.id);

    const cardsHtml = char.images.map((img, idx) => {
      const uid = `${char.id}_${idx}`;
      const collected = state.collection.includes(uid);
      if (collected) {
        return `<div class="gallery-card" onclick="UI.showCardDetail({character:CHARACTERS.find(c=>c.id==='${char.id}'),image:'${img}',rarity:'${char.rarity}',cardUid:'${uid}',isDuplicate:false})">
          <img src="${img}" loading="lazy">
        </div>`;
      }
      return `<div class="gallery-card locked"><span>?</span></div>`;
    }).join('');

    content.innerHTML = `
      <div class="gallery">
        <div class="gallery-header">
          <h2>${char.name}</h2>
          <span class="detail-rarity" style="background:${config.color}">${config.label}</span>
          <p>${char.description}</p>
          <p class="gallery-progress">收集进度: ${progress.collected}/${progress.total} (${progress.percent}%)</p>
        </div>
        <div class="gallery-grid">${cardsHtml}</div>
      </div>
    `;

    overlay.classList.add('active');
    overlay.onclick = (e) => {
      if (e.target === overlay || e.target.classList.contains('gallery')) {
        overlay.classList.remove('active');
      }
    };
  },

  // 渲染任务页
  renderTasks() {
    const list = document.getElementById('task-list');
    const state = GameState.get();
    const today = new Date().toDateString();

    const tasks = [
      {
        id: 'daily-checkin',
        name: '每日签到',
        desc: '每天签到获得1张抽卡券',
        reward: '1张抽卡券',
        done: state.lastCheckin === today,
        action: () => {
          if (state.lastCheckin === today) return '今天已经签到过了';
          state.tickets += 1;
          state.lastCheckin = today;
          GameState.save(state);
          UI.updateStatusBar();
          UI.renderTasks();
          return '签到成功！获得1张抽卡券';
        }
      },
      {
        id: 'share-wechat',
        name: '分享到微信',
        desc: '分享链接给好友或朋友圈',
        reward: '2张抽卡券',
        done: state.sharedWechat,
        action: () => {
          if (state.sharedWechat) return '已经分享过了';
          // 尝试复制链接
          navigator.clipboard.writeText(window.location.href).then(() => {
            state.sharedWechat = true;
            state.tickets += 2;
            GameState.save(state);
            UI.updateStatusBar();
            UI.renderTasks();
            alert('链接已复制！去微信粘贴分享吧！\n获得2张抽卡券');
          }).catch(() => {
            state.sharedWechat = true;
            state.tickets += 2;
            GameState.save(state);
            UI.updateStatusBar();
            UI.renderTasks();
            alert('获得2张抽卡券！');
          });
          return null;
        }
      },
      {
        id: 'share-qq',
        name: '分享到QQ',
        desc: '分享链接到QQ空间或好友',
        reward: '2张抽卡券',
        done: state.sharedQQ,
        action: () => {
          if (state.sharedQQ) return '已经分享过了';
          navigator.clipboard.writeText(window.location.href).then(() => {
            state.sharedQQ = true;
            state.tickets += 2;
            GameState.save(state);
            UI.updateStatusBar();
            UI.renderTasks();
            alert('链接已复制！去QQ粘贴分享吧！\n获得2张抽卡券');
          }).catch(() => {
            state.sharedQQ = true;
            state.tickets += 2;
            GameState.save(state);
            UI.updateStatusBar();
            UI.renderTasks();
            alert('获得2张抽卡券！');
          });
          return null;
        }
      },
      {
        id: 'share-weibo',
        name: '分享到微博',
        desc: '分享链接到微博',
        reward: '2张抽卡券',
        done: state.sharedWeibo,
        action: () => {
          if (state.sharedWeibo) return '已经分享过了';
          const text = encodeURIComponent('快来抽妍子的Cosplay卡牌！超多SSR等你来拿！');
          const url = encodeURIComponent(window.location.href);
          window.open(`https://service.weibo.com/share/share.php?title=${text}&url=${url}`, '_blank');
          setTimeout(() => {
            state.sharedWeibo = true;
            state.tickets += 2;
            GameState.save(state);
            UI.updateStatusBar();
            UI.renderTasks();
          }, 2000);
          return null;
        }
      },
      {
        id: 'invite',
        name: '邀请好友',
        desc: '通过专属链接邀请新玩家',
        reward: '3张抽卡券',
        done: false,
        action: () => {
          const inviteUrl = `${window.location.href}?inviter=${Date.now()}`;
          navigator.clipboard.writeText(inviteUrl).then(() => {
            alert('邀请链接已复制！分享给好友即可获得3张抽卡券！');
            state.tickets += 3;
            state.inviteCount = (state.inviteCount || 0) + 1;
            GameState.save(state);
            UI.updateStatusBar();
            UI.renderTasks();
          }).catch(() => {
            alert('邀请链接：' + inviteUrl);
          });
          return null;
        }
      }
    ];

    list.innerHTML = tasks.map(task => `
      <div class="task-item ${task.done ? 'task-done' : ''}">
        <div class="task-info">
          <h3>${task.name}</h3>
          <p>${task.desc}</p>
          <span class="task-reward">${task.reward}</span>
        </div>
        <button class="task-btn ${task.done ? 'btn-done' : ''}"
                onclick="UI.handleTask('${task.id}')"
                ${task.done ? 'disabled' : ''}>
          ${task.done ? '已完成' : '去完成'}
        </button>
      </div>
    `).join('');

    // 保存任务引用
    this._tasks = tasks;
  },

  handleTask(taskId) {
    const task = this._tasks?.find(t => t.id === taskId);
    if (task) task.action();
  },

  // 渲染商店页
  renderShop() {
    const list = document.getElementById('shop-list');
    const packs = [
      { id: 'small', name: '初识礼包', coins: 60, price: '¥6', desc: '60金币，可抽6次' },
      { id: 'medium', name: '心动礼包', coins: 330, price: '¥30', desc: '330金币，超值10%加赠' },
      { id: 'large', name: '挚爱礼包', coins: 1100, price: '¥98', desc: '1100金币，超值12%加赠' }
    ];

    list.innerHTML = packs.map(pack => `
      <div class="shop-item">
        <div class="shop-info">
          <h3>${pack.name}</h3>
          <p>${pack.desc}</p>
          <span class="shop-coins">+${pack.coins} 金币</span>
        </div>
        <button class="shop-btn" onclick="UI.buyPack('${pack.id}', ${pack.coins})">
          ${pack.price}
        </button>
      </div>
    `).join('');

    // 金币换抽卡
    list.innerHTML += `
      <div class="shop-item shop-exchange">
        <div class="shop-info">
          <h3>金币抽卡</h3>
          <p>使用金币进行抽卡</p>
          <span class="shop-coins">10金币 = 1抽 | 100金币 = 10连</span>
        </div>
        <div class="shop-exchange-btns">
          <button class="shop-btn small" onclick="app.doSinglePull()">单抽</button>
          <button class="shop-btn small" onclick="app.doTenPull()">十连</button>
        </div>
      </div>
    `;
  },

  buyPack(id, coins) {
    // 模拟购买
    const confirmed = confirm(`模拟购买：获得${coins}金币\n（实际支付功能开发中，当前为模拟充值）`);
    if (confirmed) {
      const state = GameState.get();
      state.coins += coins;
      GameState.save(state);
      this.updateStatusBar();
      alert(`充值成功！获得${coins}金币`);
    }
  },

  // Tab切换
  switchTab(tab) {
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(`page-${tab}`).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'collection') this.renderCollection();
    if (tab === 'tasks') this.renderTasks();
    if (tab === 'shop') this.renderShop();
  }
};
