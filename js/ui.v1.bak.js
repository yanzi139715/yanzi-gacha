// UI动画与交互
const UI = {
  // ===== 抽卡结果（仪式序列：预告 → 揭晓 → 立绘 cut-in） =====
  async showPullResults(cards, callback) {
    const overlay = document.getElementById('pull-overlay');
    const container = document.getElementById('pull-results');
    const state = GameState.get();
    const isTenPull = cards.length > 1;
    const fast = state.fastPull && isTenPull; // 单抽不跳过

    // 计算这次抽到的最高稀有度
    const hasSSR = cards.some(c => c.rarity === 'SSR');
    const hasSR = cards.some(c => c.rarity === 'SR');
    const topRarity = hasSSR ? 'SSR' : hasSR ? 'SR' : 'R';

    // === 第 0 步：仪式前置 - 屏幕预告色（fast 模式跳过非 SSR 预告） ===
    SFX.click();
    if (!fast || topRarity === 'SSR') {
      await this.playPreReveal(topRarity);
    }

    // === 第 1 步：SSR 触发仪式（光柱 + 震动 + cut-in） — SSR 仪式永远保留 ===
    if (topRarity === 'SSR') {
      SFX.vibrate([60, 40, 120, 40, 200]);
      SFX.shake(1.2);
      await this.playSSRCeremony(cards.find(c => c.rarity === 'SSR'));
    } else if (topRarity === 'SR' && !fast) {
      // SR 仪式快速模式跳过
      SFX.vibrate([40, 30, 80]);
      await this.playSRCeremony();
    }

    // === 第 2 步：展示卡牌结果 ===
    overlay.classList.add('active');
    container.innerHTML = '';

    // fast 模式：所有卡片一次性出现，间隔大幅缩短
    const stepDelay = fast ? 20 : 90;

    cards.forEach((card, index) => {
      const cardEl = this.createCardElement(card);
      cardEl.style.opacity = '0';
      cardEl.style.transform = 'scale(0.3) rotate(-10deg)';
      container.appendChild(cardEl);

      const delay = isTenPull ? index * stepDelay : 0;
      setTimeout(() => {
        cardEl.style.transition = fast
          ? 'opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'scale(1) rotate(0)';
        if (!fast || card.rarity === 'SSR') SFX.cardFlip();
      }, delay);
    });

    // === 第 3 步：揭晓后稀有卡持续光环 ===
    const flipDone = isTenPull ? cards.length * stepDelay + (fast ? 200 : 400) : 500;

    setTimeout(() => {
      container.querySelectorAll('.card').forEach((cardEl, i) => {
        const r = cards[i].rarity;
        if (r === 'SSR') {
          cardEl.classList.add('glow-ssr');
          if (i === 0 || cards.length === 1) SFX.ssrReveal();
        } else if (r === 'SR') {
          cardEl.classList.add('glow-sr');
          if (i === 0) SFX.srReveal();
        } else if (i === cards.length - 1 && topRarity === 'R') {
          SFX.rReveal();
        }
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

  // 预告光晕：金 / 紫 / 蓝（短暂闪过让玩家提前知道有大的）
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

  // SSR 仪式：金色光柱 + 角色立绘 cut-in
  playSSRCeremony(ssrCard) {
    return new Promise(resolve => {
      const stage = document.createElement('div');
      stage.className = 'ssr-ceremony';
      stage.innerHTML = `
        <div class="ssr-beam"></div>
        <div class="ssr-rays"></div>
        <div class="ssr-particles"></div>
        <div class="ssr-cutin">
          <img src="${ssrCard.image}" alt="${ssrCard.characterName}">
          <div class="ssr-cutin-overlay">
            <div class="ssr-cutin-rarity">SSR</div>
            <div class="ssr-cutin-name">${ssrCard.characterName}</div>
          </div>
        </div>
      `;
      document.body.appendChild(stage);

      // 生成粒子
      const particleHost = stage.querySelector('.ssr-particles');
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'gold-particle';
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 300;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        p.style.setProperty('--delay', `${Math.random() * 0.3}s`);
        particleHost.appendChild(p);
      }

      // cut-in 时刻配套音效
      setTimeout(() => SFX.cutIn(), 350);

      // 整个仪式时长 1.8s
      setTimeout(() => { stage.remove(); resolve(); }, 1800);
    });
  },

  // SR 仪式：紫色光柱
  playSRCeremony() {
    return new Promise(resolve => {
      const stage = document.createElement('div');
      stage.className = 'sr-ceremony';
      stage.innerHTML = `<div class="sr-beam"></div><div class="sr-particles"></div>`;
      document.body.appendChild(stage);

      const particleHost = stage.querySelector('.sr-particles');
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'purple-particle';
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 200;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        p.style.setProperty('--delay', `${Math.random() * 0.2}s`);
        particleHost.appendChild(p);
      }

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
            <span class="card-rarity" style="background: ${config.gradient}">${config.label}</span>
            <span class="card-name">${card.characterName}</span>
          </div>
          ${card.isDuplicate && card.rarity === 'SSR'
            ? `<div class="card-duplicate card-dup-ssr">
                 ${card.unlockLevelUp
                    ? `<span class="dup-unlock">解锁 Lv.${card.unlockLevelUp.to}</span>`
                    : '<span class="dup-unlock">已满凸</span>'}
                 <span class="dup-shard">+${card.echoShardGain} 共鸣碎片</span>
               </div>`
            : card.isDuplicate
              ? `<div class="card-duplicate">重复 +${card.coinValue} Beacon</div>`
              : ''}
        </div>
      </div>
    `;

    el.onclick = (e) => {
      e.stopPropagation();
      this.showCardDetail(card);
    };

    return el;
  },

  // ===== 卡牌详情（带保存/分享） =====
  showCardDetail(card) {
    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('detail-content');
    const config = RARITY_CONFIG[card.rarity];

    content.innerHTML = `
      <button class="back-btn" onclick="document.getElementById('detail-overlay').classList.remove('active')">
        <svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </button>
      <div class="detail-card">
        <div class="detail-img-wrap">
          <img src="${card.image}" alt="${card.characterName}">
          <span class="detail-rarity-badge" style="background:${config.gradient}">${config.label}</span>
        </div>
        <div class="detail-info">
          <h2>${card.characterName}</h2>
          <p class="detail-desc">${card.description}</p>
          <div class="action-bar">
            <button class="action-btn" onclick="UI.saveImage('${card.image.replace(/'/g, "\\'")}', '${card.characterName}_${card.rarity}')">
              <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              保存图片
            </button>
            <button class="action-btn primary" onclick="UI.generatePoster('${card.image.replace(/'/g, "\\'")}', '${card.characterName}', '${card.rarity}', '${card.description.replace(/'/g, "\\'")}')">
              <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              生成海报
            </button>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    };
  },

  // ===== 角色画廊（无保存分享按钮） =====
  showCharacterGallery(char) {
    const overlay = document.getElementById('detail-overlay');
    const content = document.getElementById('detail-content');
    const state = GameState.get();
    const progress = GachaEngine.getCharacterProgress(char.id);

    const allCards = GachaEngine.getCollectedCardsForCharacter(char.id);

    const cardsHtml = allCards.map(card => {
      const config = RARITY_CONFIG[card.rarity];
      if (card.collected) {
        const imgSrc = card.src.replace(/'/g, "\\'");
        return `<div class="gallery-card" onclick="UI.showCardDetail({image:'${imgSrc}',characterName:'${char.name}',rarity:'${card.rarity}',description:'${char.description.replace(/'/g, "\\'")}',characterId:'${char.id}',imageIndex:${card.imageIndex}})">
          <img src="${card.src}" loading="lazy">
          <span class="gallery-rarity-tag" style="background:${config.gradient}">${config.label}</span>
        </div>`;
      }
      return `<div class="gallery-card locked">
        <div class="lock-icon-wrap" style="color:${config.color}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <span class="gallery-rarity-tag locked-tag" style="background:${config.gradient};opacity:0.5">${config.label}</span>
      </div>`;
    }).join('');

    content.innerHTML = `
      <button class="back-btn" onclick="document.getElementById('detail-overlay').classList.remove('active')">
        <svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </button>
      <div class="gallery">
        <div class="gallery-header">
          <h2>${char.name}</h2>
          <p class="gallery-subtitle">${char.description}</p>
          <div class="gallery-progress-bar">
            <div class="gallery-progress-fill" style="width:${progress.percent}%"></div>
          </div>
          <span class="gallery-progress-text">已守护 ${progress.collected} / ${progress.total}</span>
        </div>
        <div class="gallery-grid">${cardsHtml}</div>
      </div>
    `;

    overlay.classList.add('active');
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    };
  },

  // ===== 保存图片 =====
  saveImage(imgSrc, filename) {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = filename + '.jpg';
    link.target = '_blank';
    if (imgSrc.startsWith('img/')) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(imgSrc, '_blank');
    }
  },

  // ===== 生成海报（修复变形） =====
  generatePoster(imgSrc, name, rarity, description) {
    const canvas = document.getElementById('poster-canvas');
    const ctx = canvas.getContext('2d');
    const config = RARITY_CONFIG[rarity];
    const rarityColors = { SSR: '#FFD700', SR: '#E8A0BF', R: '#89CFF0' };
    const color = rarityColors[rarity] || '#E8A0BF';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const W = 750, H = 1200;
      canvas.width = W;
      canvas.height = H;

      // 背景 - 甜美渐变
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#FFF0F5');
      bgGrad.addColorStop(0.5, '#FFF5F8');
      bgGrad.addColorStop(1, '#FFF0F5');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 装饰圆点
      ctx.fillStyle = 'rgba(255,182,193,0.15)';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const r = 3 + Math.random() * 8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 卡片区域 - 白色圆角卡片
      const cardX = 30, cardY = 30, cardW = W - 60, cardH = 700;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255,105,180,0.15)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 8;
      this.roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 主图 - 保持原始宽高比，不变形
      const padding = 20;
      const imgAreaW = cardW - padding * 2;
      const imgAreaH = cardH - padding * 2;
      const imgRatio = img.width / img.height;
      const areaRatio = imgAreaW / imgAreaH;

      let drawW, drawH, drawX, drawY;
      if (imgRatio > areaRatio) {
        drawW = imgAreaW;
        drawH = imgAreaW / imgRatio;
      } else {
        drawH = imgAreaH;
        drawW = imgAreaH * imgRatio;
      }
      drawX = cardX + padding + (imgAreaW - drawW) / 2;
      drawY = cardY + padding + (imgAreaH - drawH) / 2;

      // 图片裁切为圆角
      ctx.save();
      this.roundRect(ctx, cardX + padding, cardY + padding, imgAreaW, imgAreaH, 16);
      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // 稀有度标签
      const tagW = 64, tagH = 30;
      const tagX = cardX + cardW - tagW - 20;
      const tagY = cardY + 20;
      ctx.fillStyle = color;
      this.roundRect(ctx, tagX, tagY, tagW, tagH, 8);
      ctx.fill();
      ctx.fillStyle = rarity === 'SSR' ? '#000' : '#FFF';
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rarity, tagX + tagW / 2, tagY + tagH / 2);

      // 角色名
      const textY = cardY + cardH + 30;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#2D2D3A';
      ctx.font = 'bold 34px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText(name, 50, textY);

      // 描述
      ctx.fillStyle = '#9B8EA8';
      ctx.font = '18px -apple-system, "PingFang SC", sans-serif';
      const descLines = this.wrapText(ctx, description, W - 100, 18);
      descLines.forEach((line, i) => {
        ctx.fillText(line, 50, textY + 46 + i * 28);
      });

      // 分隔线
      const lineY = H - 180;
      ctx.strokeStyle = 'rgba(232,160,191,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, lineY);
      ctx.lineTo(W - 50, lineY);
      ctx.stroke();

      // QR码区域
      const qrSize = 110;
      const qrX = W - 50 - qrSize;
      const qrY = lineY + 20;

      try {
        const qr = qrcode(0, 'M');
        qr.addData(window.location.href);
        qr.make();
        const qrModuleCount = qr.getModuleCount();
        const moduleSize = qrSize / qrModuleCount;

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 10;
        this.roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#2D2D3A';
        for (let row = 0; row < qrModuleCount; row++) {
          for (let col = 0; col < qrModuleCount; col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect(qrX + col * moduleSize, qrY + row * moduleSize, moduleSize + 0.5, moduleSize + 0.5);
            }
          }
        }
      } catch (e) {}

      // 左侧品牌文字
      ctx.fillStyle = '#FF69B4';
      ctx.font = 'bold 22px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('妍子 Cosplay', 50, qrY + 5);

      ctx.fillStyle = '#9B8EA8';
      ctx.font = '14px -apple-system, sans-serif';
      ctx.fillText('扫码开启抽卡之旅', 50, qrY + 36);
      ctx.fillText('收集你最爱的角色卡牌', 50, qrY + 56);

      // 底部装饰线
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, H - 2);
      ctx.lineTo(W, H - 2);
      ctx.stroke();

      this.showPosterPreview(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => { alert('图片加载失败'); };
    img.src = imgSrc;
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  wrapText(ctx, text, maxWidth) {
    const lines = [];
    let currentLine = '';
    for (const char of text) {
      const testLine = currentLine + char;
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 3);
  },

  // ===== 海报预览 =====
  showPosterPreview(dataUrl) {
    let el = document.getElementById('poster-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'poster-overlay';
      el.className = 'poster-overlay';
      document.body.appendChild(el);
    }

    el.innerHTML = `
      <div class="poster-card">
        <img src="${dataUrl}" id="poster-img">
        <div class="poster-btns">
          <button class="poster-btn save" onclick="UI.downloadPoster()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            保存到相册
          </button>
          <button class="poster-btn share" onclick="UI.sharePoster()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;margin-right:4px"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            分享给好友
          </button>
          <button class="poster-btn close" onclick="document.getElementById('poster-overlay').classList.remove('active')">关闭</button>
        </div>
      </div>
    `;

    el.classList.add('active');
    el._dataUrl = dataUrl;
  },

  downloadPoster() {
    const el = document.getElementById('poster-overlay');
    const link = document.createElement('a');
    link.download = '妍子Cosplay海报_' + Date.now() + '.jpg';
    link.href = el._dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  async sharePoster() {
    const el = document.getElementById('poster-overlay');
    const dataUrl = el._dataUrl;

    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], '妍子Cosplay海报.jpg', { type: 'image/jpeg' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: '妍子Cosplay抽卡集', text: '来看看我抽到的卡牌！', files: [file] });
          return;
        }
      } catch (e) {}
    }

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      alert('海报已复制到剪贴板！可以粘贴到微信/QQ发送');
    } catch (e) {
      this.downloadPoster();
      alert('海报已保存到本地');
    }
  },

  // ===== 顶部状态栏 =====
  updateStatusBar() {
    const state = GameState.get();
    const poolId = state.currentPool || 'standard';
    const pool = POOL_CONFIG[poolId];
    const pity = GachaEngine.getPity(poolId);

    document.getElementById('ticket-count').textContent = state.tickets;
    document.getElementById('coin-count').textContent = state.coins;
    document.getElementById('pity-count').textContent = `${pity}/${pool ? pool.pityLimit : 90}`;
    document.getElementById('collection-count').textContent = state.collection.length;
    const shardEl = document.getElementById('shard-count');
    if (shardEl) shardEl.textContent = state.echoShards || 0;
  },

  // ===== 图鉴页 =====
  // 妍子的档案块 — 图鉴 tab 顶部
  renderCoserProfile() {
    const block = document.getElementById('coser-profile-block');
    if (!block) return;
    const state = GameState.get();
    const coser = COSER_PROFILE;
    const battle = coser.battle;

    const totalSkins = CHARACTERS.length;
    let collectedSkins = 0;
    CHARACTERS.forEach(c => {
      if (c.images.some((_, idx) => state.collection.includes(`${c.id}_${idx}`))) collectedSkins++;
    });

    // 已收集的 SSR 列表（可设为主皮肤）
    const ownedSsr = [];
    CHARACTERS.forEach(c => {
      c.images.forEach((img, idx) => {
        if (img.rarity === 'SSR' && state.collection.includes(`${c.id}_${idx}`)) {
          ownedSsr.push({ charId: c.id, charName: c.name, idx, src: img.src, key: `${c.id}_${idx}` });
        }
      });
    });
    const mainSkin = state.mainSkin || (ownedSsr[0]?.key || null);

    const skinSwitchHtml = ownedSsr.length === 0 ? `
      <div class="ms-empty">
        <span class="ms-empty-icon">✦</span>
        抽到 <b>SSR</b> 即可设为主皮肤
      </div>
    ` : `
      <div class="ms-list">
        ${ownedSsr.map(s => `
          <div class="ms-skin ${s.key === mainSkin ? 'active' : ''}"
               onclick="UI.setMainSkin('${s.key}')"
               title="${s.charName}">
            <div class="ms-skin-thumb"><img src="${s.src}" loading="lazy"></div>
            <div class="ms-skin-name">${s.charName}</div>
            ${s.key === mainSkin ? '<div class="ms-skin-badge">主皮肤</div>' : ''}
          </div>
        `).join('')}
      </div>
    `;

    block.innerHTML = `
      <!-- 标题 -->
      <div class="cp-header">
        <h1 class="cp-title">${coser.name} 的档案</h1>
        <div class="cp-tags">
          ${coser.tags.map(t => `<span class="cv-tag">${t}</span>`).join('')}
        </div>
      </div>

      <!-- 守护进度（大字 + 渐变条，按参考图风格） -->
      <div class="cp-progress">
        <div class="cp-prog-head">
          <span class="cp-prog-label">Memoria · ${coser.name} · 守护进度</span>
          <span class="cp-prog-num">${collectedSkins} <i>/ ${totalSkins}</i></span>
        </div>
        <div class="cp-prog-bar">
          <div class="cp-prog-fill" style="width:${totalSkins > 0 ? collectedSkins/totalSkins*100 : 0}%"></div>
        </div>
      </div>

      <!-- 关于妍子 -->
      <div class="cv-bio">
        <div class="cv-bio-head"><h2 class="cv-bio-h">关于${coser.name}</h2></div>
        <p class="cv-bio-text">${coser.location} · ${totalSkins} 套 cos 写真。${coser.intro}</p>
      </div>

      <!-- 频率战档案 -->
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

      <!-- 切换主皮肤（只有 SSR 才能设为皮肤） -->
      <div class="ms-block">
        <div class="gb-sec-title">
          <span class="gb-sec-name">切换主皮肤</span>
          <span class="gb-sec-hint">仅 SSR · 已拥有 ${ownedSsr.length}</span>
        </div>
        ${skinSwitchHtml}
      </div>

      <!-- 频率战皮肤（A/B/C 三槽位，从抽到的 SSR 中选） -->
      ${this._renderBattleSkinSlots(state, ownedSsr)}
    `;
  },

  // 频率战皮肤三槽位（A/B/C）— archetype 固定，SSR 当皮肤
  _renderBattleSkinSlots(state, ownedSsr) {
    const battleSkins = state.battleSkins || { A: null, B: null, C: null };
    // 按 archetype 分组所有已拥有 SSR
    const byType = { A: [], B: [], C: [] };
    ownedSsr.forEach(s => {
      const prof = getBattleProfile(s.charId);
      if (prof && byType[prof.letter]) byType[prof.letter].push(s);
    });
    const slot = (letter, name, color) => {
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
                ? `<img src="${curSkin.src}" alt="${curSkin.charName}">
                   <span class="bs-cur-name">${curSkin.charName}</span>`
                : pool.length > 0
                  ? `<div class="bs-empty">未设置 · 使用默认</div>`
                  : `<div class="bs-empty bs-locked">未抽到该型 SSR</div>`}
            </div>
            ${pool.length > 0
              ? `<button class="bs-change-btn" onclick="UI.openBattleSkinPicker('${letter}')">切换</button>`
              : ''}
          </div>
        </div>
      `;
    };
    return `
      <div class="bs-block">
        <div class="gb-sec-title">
          <span class="gb-sec-name">频率战皮肤</span>
          <span class="gb-sec-hint">SSR 出战 · 角色形态固定</span>
        </div>
        ${slot('A', '焰 · STRIKE',   '#FF8A5C')}
        ${slot('B', '阿尔贝 · REFLECT', '#C4A0FF')}
        ${slot('C', '雪 · OVERFLOW', '#7BC9FF')}
      </div>
    `;
  },

  // 战斗皮肤选择器（弹 modal 显示某 archetype 所有可选 SSR）
  openBattleSkinPicker(letter) {
    const state = GameState.get();
    const ownedSsr = [];
    CHARACTERS.forEach(c => {
      c.images.forEach((img, idx) => {
        if (img.rarity === 'SSR' && state.collection.includes(`${c.id}_${idx}`)) {
          const prof = getBattleProfile(c.id);
          if (prof?.letter === letter) {
            ownedSsr.push({ charId: c.id, charName: c.name, idx, src: img.src, key: `${c.id}_${idx}` });
          }
        }
      });
    });
    if (ownedSsr.length === 0) {
      alert(`你还没抽到 ${letter} 型的 SSR`);
      return;
    }
    const cur = state.battleSkins?.[letter];

    // 渲染 modal
    let modal = document.getElementById('bs-picker-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bs-picker-modal';
      modal.className = 'bs-picker-overlay';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="bs-picker-card">
        <div class="bs-picker-head">
          <h3>选择 ${letter} 型战斗皮肤</h3>
          <button class="bs-picker-close" onclick="UI.closeBattleSkinPicker()">✕</button>
        </div>
        <div class="bs-picker-grid">
          ${ownedSsr.map(s => `
            <div class="bs-pick-item ${s.key === cur ? 'active' : ''}"
                 onclick="UI.setBattleSkin('${letter}','${s.key}')">
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
    const modal = document.getElementById('bs-picker-modal');
    if (modal) modal.classList.remove('show');
  },
  setBattleSkin(letter, key) {
    const state = GameState.get();
    state.battleSkins = state.battleSkins || { A: null, B: null, C: null };
    state.battleSkins[letter] = key;
    // 缓存对应 src 给 battle 页读取（battle 是独立 SPA 读不到 CHARACTERS）
    state._battleSkinSrcs = state._battleSkinSrcs || {};
    if (key) {
      const [charId, idxStr] = key.split('_');
      const idx = parseInt(idxStr);
      const c = CHARACTERS.find(c => c.id === charId);
      if (c && c.images[idx]) state._battleSkinSrcs[key] = c.images[idx].src;
    }
    GameState.save(state);
    SFX.click();
    this.closeBattleSkinPicker();
    this.renderCoserProfile();
  },

  setMainSkin(key) {
    const state = GameState.get();
    state.mainSkin = key;
    GameState.save(state);
    SFX.click();
    this.renderCoserProfile();
    this.renderCollection(this._lastFilter || 'ALL');
  },

  renderCollection(filter = 'ALL') {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    const state = GameState.get();

    // === 顶部 Coser 档案块（关于妍子 + 频率战出战 + 守护总进度） ===
    this.renderCoserProfile();

    CHARACTERS.forEach(char => {
      const progress = GachaEngine.getCharacterProgress(char.id);
      const allCards = GachaEngine.getCollectedCardsForCharacter(char.id);

      // 按筛选条件过滤
      const hasMatching = filter === 'ALL' || allCards.some(c => c.rarity === filter);
      if (!hasMatching && filter !== 'ALL') return;

      // 优先用已收集的 SSR 作为该 cos 的封面
      let coverSrc = getCharacterThumb(char.id);
      const ownedSsrInChar = char.images.findIndex((img, idx) =>
        img.rarity === 'SSR' && state.collection.includes(`${char.id}_${idx}`)
      );
      if (ownedSsrInChar >= 0) coverSrc = char.images[ownedSsrInChar].src;

      const collectedCount = allCards.filter(c => c.collected).length;
      const isFullyLocked = collectedCount === 0;

      const el = document.createElement('div');
      el.className = 'collection-card';
      if (isFullyLocked) el.classList.add('locked');

      el.innerHTML = `
        <div class="collection-thumb">
          <img src="${coverSrc}" alt="${char.name}" loading="lazy">
          ${isFullyLocked ? '<div class="thumb-lock-overlay"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>' : ''}
          <span class="cc-count-badge">${progress.collected}/${progress.total}</span>
          <div class="cc-name-bar">${char.name}</div>
        </div>
      `;

      el.onclick = () => this.showCharacterGallery(char);
      grid.appendChild(el);
    });

    this._lastFilter = filter;
  },

  // ===== 任务页 =====
  renderTasks() {
    const list = document.getElementById('task-list');
    const state = GameState.get();
    const today = new Date().toDateString();

    const tasks = [
      {
        id: 'daily-checkin', name: '每日签到', desc: '签到获得1张抽卡券',
        reward: '+1 抽卡券', done: state.lastCheckin === today,
        action: () => {
          if (state.lastCheckin === today) return '今天已签到';
          state.tickets += 1; state.lastCheckin = today;
          GameState.save(state); UI.updateStatusBar(); UI.renderTasks();
        }
      },
      {
        id: 'share-wechat', name: '分享到微信', desc: '分享给好友或朋友圈',
        reward: '+2 抽卡券', done: state.sharedWechat,
        action: () => {
          if (state.sharedWechat) return '已完成';
          navigator.clipboard.writeText(window.location.href).then(() => {
            state.sharedWechat = true; state.tickets += 2;
            GameState.save(state); UI.updateStatusBar(); UI.renderTasks();
            alert('链接已复制，去微信粘贴分享吧！');
          });
        }
      },
      {
        id: 'share-qq', name: '分享到QQ', desc: '分享到QQ空间或好友',
        reward: '+2 抽卡券', done: state.sharedQQ,
        action: () => {
          if (state.sharedQQ) return '已完成';
          navigator.clipboard.writeText(window.location.href).then(() => {
            state.sharedQQ = true; state.tickets += 2;
            GameState.save(state); UI.updateStatusBar(); UI.renderTasks();
            alert('链接已复制，去QQ粘贴分享吧！');
          });
        }
      },
      {
        id: 'share-weibo', name: '分享到微博', desc: '分享链接到微博',
        reward: '+2 抽卡券', done: state.sharedWeibo,
        action: () => {
          if (state.sharedWeibo) return '已完成';
          const t = encodeURIComponent('快来抽妍子的Cosplay卡牌！');
          const u = encodeURIComponent(window.location.href);
          window.open(`https://service.weibo.com/share/share.php?title=${t}&url=${u}`, '_blank');
          setTimeout(() => { state.sharedWeibo = true; state.tickets += 2; GameState.save(state); UI.updateStatusBar(); UI.renderTasks(); }, 2000);
        }
      },
      {
        id: 'invite', name: '邀请好友', desc: '分享邀请链接',
        reward: '+3 抽卡券', done: false,
        action: () => {
          const url = `${window.location.href}?inviter=${Date.now()}`;
          navigator.clipboard.writeText(url).then(() => {
            alert('邀请链接已复制！'); state.tickets += 3;
            GameState.save(state); UI.updateStatusBar(); UI.renderTasks();
          });
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
                onclick="UI.handleTask('${task.id}')" ${task.done ? 'disabled' : ''}>
          ${task.done ? '已完成' : '去完成'}
        </button>
      </div>
    `).join('');

    this._tasks = tasks;
  },

  handleTask(taskId) {
    const task = this._tasks?.find(t => t.id === taskId);
    if (task) task.action();
  },

  // ===== 商店页 =====
  _activeCoser: 'yanzi',
  COSER_LIST: [
    { id: 'yanzi', name: '妍子', short: '妍', currency: 'Beacon', active: true },
    { id: 'xiaoyu', name: '小雨', short: '雨', currency: 'XIAOYU·B', disabled: true, hint: '即将接入' },
    { id: 'amei', name: 'A妹', short: 'A',  currency: 'AMEI·B',   disabled: true, hint: '即将接入' },
  ],

  renderShop() {
    const list = document.getElementById('shop-list');
    const state = GameState.get();

    // === Coser 切换横滑 tabs（跟 wireframe spec 同结构） ===
    const tabsHtml = `
      <div class="sh-coser-tabs">
        <div class="sh-ctab-scroll">
          ${this.COSER_LIST.map(c => `
            <button class="sh-ctab ${c.id === this._activeCoser ? 'active' : ''} ${c.disabled ? 'disabled' : ''}"
                    onclick="${c.disabled ? '' : `UI.switchCoser('${c.id}')`}"
                    ${c.disabled ? 'disabled' : ''}>
              <span class="ttl">${c.name}</span>
              <span class="sub">${c.disabled ? c.hint : c.currency}</span>
            </button>
          `).join('')}
          <button class="sh-ctab add-coser" onclick="alert('更多 Coser 即将上线，敬请期待 ✦')">
            <span class="ttl">+</span>
            <span class="sub">解锁更多</span>
          </button>
        </div>
      </div>
    `;

    if (this._activeCoser !== 'yanzi') {
      const coser = this.COSER_LIST.find(c => c.id === this._activeCoser);
      list.innerHTML = tabsHtml + `
        <div class="sh-placeholder">
          <div class="sh-placeholder-icon">✦</div>
          <h3>${coser?.name || ''} 商店即将上线</h3>
          <p>该 Coser 的卡池与货币体系正在筹备中</p>
        </div>
      `;
      return;
    }

    const packs = [
      { id: 'small', name: '初遇之礼', coins: 60, price: '¥6', desc: '60Beacon，可抽6次' },
      { id: 'medium', name: '心动礼包', coins: 330, price: '¥30', desc: '330Beacon，超值加赠' },
      { id: 'large', name: '挚爱礼盒', coins: 1100, price: '¥98', desc: '1100Beacon，豪华加赠' }
    ];

    // 检查有限定池
    const hasLimited = Object.values(POOL_CONFIG).some(p => p.type === 'limited');

    let html = tabsHtml + packs.map(p => `
      <div class="shop-item">
        <div class="shop-info">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <span class="shop-coins">+${p.coins} Beacon</span>
        </div>
        <button class="shop-btn" onclick="UI.buyPack('${p.id}',${p.coins})">${p.price}</button>
      </div>
    `).join('');

    // 限定池专属券
    if (hasLimited) {
      const limitedPacks = [
        { id: 'ticket-1', name: '限定单抽券', tickets: 1, price: '¥3', desc: '限定池专用抽卡券×1' },
        { id: 'ticket-10', name: '限定十连券', tickets: 10, price: '¥25', desc: '限定池专用抽卡券×10，优惠价' }
      ];

      html += `<div class="shop-section-title">限定池专属券</div>`;
      html += limitedPacks.map(p => `
        <div class="shop-item shop-item-limited">
          <div class="shop-info">
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <span class="shop-coins">拥有: ${state.ticket_limited || 0} 张</span>
          </div>
          <button class="shop-btn shop-btn-limited" onclick="UI.buyTicket('${p.id}',${p.tickets})">${p.price}</button>
        </div>
      `).join('');
    }

    // === 共鸣碎片兑换 ===
    const shards = state.echoShards || 0;
    html += `
      <div class="shop-section-title">共鸣碎片兑换</div>
      <div class="shop-shard-hud">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 L13.6 10.4 22 12 L13.6 13.6 12 22 L10.4 13.6 2 12 L10.4 10.4 Z"/></svg>
        <span class="shard-hud-num">${shards}</span>
        <span class="shard-hud-label">Echo Shards · 抽到重复 SSR 获得</span>
      </div>
      <div class="shop-item shop-item-shard">
        <div class="shop-info">
          <h3>通用抽卡券 ×1</h3>
          <p>100 碎片 · 兜底白嫖路径</p>
          <span class="shop-coins">需 100 Echo Shards</span>
        </div>
        <button class="shop-btn shop-btn-shard" ${shards < 100 ? 'disabled' : ''} onclick="UI.redeemShard('ticket',100)">兑换</button>
      </div>
      <div class="shop-item shop-item-shard">
        <div class="shop-info">
          <h3>频率定位 ✦</h3>
          <p>500 碎片 · 自选一张未拥有的 SSR 直接到手（pity 外硬保底）</p>
          <span class="shop-coins">需 500 Echo Shards</span>
        </div>
        <button class="shop-btn shop-btn-shard" ${shards < 500 ? 'disabled' : ''} onclick="UI.redeemShard('locate',500)">兑换</button>
      </div>
      <div class="shop-item shop-item-shard">
        <div class="shop-info">
          <h3>离线原图下载权</h3>
          <p>1000 碎片 · 任意已拥有 SSR 永久收藏（防止账号丢图）</p>
          <span class="shop-coins">需 1000 Echo Shards</span>
        </div>
        <button class="shop-btn shop-btn-shard" ${shards < 1000 ? 'disabled' : ''} onclick="UI.redeemShard('offline',1000)">兑换</button>
      </div>
    `;

    // 当前券数量总览
    html += `
      <div class="shop-section-title">持有资产</div>
      <div class="shop-assets">
        <div class="asset-item">
          <span class="asset-label">通用券</span>
          <span class="asset-value">${state.tickets}</span>
        </div>
        <div class="asset-item">
          <span class="asset-label">限定券</span>
          <span class="asset-value">${state.ticket_limited || 0}</span>
        </div>
        <div class="asset-item">
          <span class="asset-label">兔女郎券</span>
          <span class="asset-value">${state.ticket_bunny || 0}</span>
        </div>
        <div class="asset-item">
          <span class="asset-label">Beacon</span>
          <span class="asset-value">${state.coins}</span>
        </div>
        <div class="asset-item">
          <span class="asset-label">共鸣碎片</span>
          <span class="asset-value" style="color:var(--resonance)">${shards}</span>
        </div>
      </div>
    `;

    // Beacon抽卡快捷入口
    html += `
      <div class="shop-section-title">Beacon抽卡</div>
      <div class="shop-item">
        <div class="shop-info">
          <h3>Beacon抽卡</h3>
          <p>使用Beacon抽卡</p>
          <span class="shop-coins">10 = 1抽 | 100 = 10连</span>
        </div>
        <div style="display:flex;gap:8px">
          <button class="shop-btn small" onclick="app.doSinglePull()">单抽</button>
          <button class="shop-btn small" onclick="app.doTenPull()">十连</button>
        </div>
      </div>
    `;

    list.innerHTML = html;
  },

  switchCoser(id) {
    if (this._activeCoser === id) return;
    this._activeCoser = id;
    SFX.click();
    this.renderShop();
  },

  // 共鸣碎片兑换
  redeemShard(type, cost) {
    const state = GameState.get();
    if ((state.echoShards || 0) < cost) {
      alert('共鸣碎片不足');
      return;
    }
    if (type === 'ticket') {
      if (!confirm(`花费 ${cost} 共鸣碎片，兑换 1 张通用抽卡券？`)) return;
      state.echoShards -= cost;
      state.tickets = (state.tickets || 0) + 1;
      GameState.save(state);
      this.updateStatusBar();
      this.renderShop();
      SFX.click();
      alert('兑换成功！+1 通用抽卡券');
    } else if (type === 'locate') {
      // TODO 待用户决策窗口：频率定位的具体 UI / 选卡流程
      // 现版本：弹出未拥有的 SSR 列表让用户选
      const ownedSet = new Set(state.collection);
      const allSsr = [];
      CHARACTERS.forEach(c => {
        c.images.forEach((img, idx) => {
          const uid = `${c.id}_${idx}`;
          if (img.rarity === 'SSR' && !ownedSet.has(uid)) {
            allSsr.push({ uid, name: c.name + ' · 第 ' + (idx + 1) + ' 张', char: c, idx });
          }
        });
      });
      if (allSsr.length === 0) {
        alert('你已经拥有全部 SSR ✦ 无需定位');
        return;
      }
      // 简陋版选择器：将来要换成精美 modal
      const choice = prompt(
        '【频率定位】可选未拥有 SSR：\n' +
        allSsr.slice(0, 20).map((c, i) => `${i + 1}. ${c.name}`).join('\n') +
        '\n\n输入编号 (1-' + Math.min(allSsr.length, 20) + ') 确认定位：'
      );
      const i = parseInt(choice) - 1;
      if (isNaN(i) || i < 0 || i >= Math.min(allSsr.length, 20)) {
        alert('已取消');
        return;
      }
      const target = allSsr[i];
      state.echoShards -= cost;
      state.collection.push(target.uid);
      state.skinUnlocks = state.skinUnlocks || {};
      state.skinUnlocks[target.uid] = { pulls: 1, level: 1 };
      GameState.save(state);
      this.updateStatusBar();
      this.renderShop();
      SFX.ssrReveal();
      alert(`✦ 频率定位成功！「${target.name}」已加入图鉴`);
    } else if (type === 'offline') {
      // TODO 离线原图下载权：将来对接服务端鉴权下载链接
      alert('离线原图下载权 · 功能将在 V2.0 接入后端时启用。\n\n现在的"下载图片"按钮已经可以保存图片，无需此兑换。');
      // 不扣碎片，因为功能未上
    }
  },

  buyTicket(id, tickets) {
    if (confirm(`模拟购买：获得${tickets}张限定池专属券（支付功能开发中）`)) {
      const state = GameState.get();
      state.ticket_limited = (state.ticket_limited || 0) + tickets;
      GameState.save(state);
      this.updateStatusBar();
      this.renderShop();
      alert(`购买成功！+${tickets}张限定池专属券`);
    }
  },

  buyPack(id, coins) {
    if (confirm(`模拟购买：获得${coins}Beacon（支付功能开发中）`)) {
      const state = GameState.get();
      state.coins += coins;
      GameState.save(state);
      this.updateStatusBar();
      alert(`充值成功！+${coins}Beacon`);
    }
  },

  // ===== Tab切换 =====
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
