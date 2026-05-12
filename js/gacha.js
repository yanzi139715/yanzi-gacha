// 抽卡引擎
const GachaEngine = {
  // 抽取一张卡
  pull() {
    const state = GameState.get();
    const rand = Math.random() * 100;
    let rarity;

    // 软保底：60抽后开始递增SSR概率
    let ssrProb = RARITY_CONFIG.SSR.prob;
    if (state.pityCount >= 60) {
      ssrProb += (state.pityCount - 59) * 6; // 每抽+6%
    }

    if (rand < ssrProb) {
      rarity = 'SSR';
    } else if (rand < ssrProb + RARITY_CONFIG.SR.prob) {
      rarity = 'SR';
    } else {
      rarity = 'R';
    }

    // 从该稀有度角色中随机选一个
    const pool = getCharactersByRarity(rarity);
    const character = pool[Math.floor(Math.random() * pool.length)];

    // 随机选一张该角色的图片
    const imageIndex = Math.floor(Math.random() * character.images.length);
    const image = character.images[imageIndex];

    // 生成唯一卡牌ID
    const cardUid = `${character.id}_${imageIndex}`;

    // 检查是否重复
    const isDuplicate = state.collection.includes(cardUid);

    // 更新状态
    if (!isDuplicate) {
      state.collection.push(cardUid);
    } else {
      state.coins += RARITY_CONFIG[rarity].coinValue;
    }

    // 更新保底计数
    if (rarity === 'SSR') {
      state.pityCount = 0;
    } else {
      state.pityCount++;
    }

    state.totalPulls++;
    GameState.save(state);

    return {
      character,
      image,
      rarity,
      cardUid,
      isDuplicate,
      coinValue: isDuplicate ? RARITY_CONFIG[rarity].coinValue : 0
    };
  },

  // 单抽
  singlePull() {
    const state = GameState.get();
    if (state.tickets <= 0 && state.coins < 10) {
      return { success: false, reason: '没有抽卡券，金币也不够（需要10金币）' };
    }

    if (state.tickets > 0) {
      state.tickets--;
    } else {
      state.coins -= 10;
    }
    GameState.save(state);

    return { success: true, cards: [this.pull()] };
  },

  // 十连抽（保底至少1张SR）
  tenPull() {
    const state = GameState.get();
    const cost = 10; // 10连抽 = 10张券 或 100金币
    let useTickets = Math.min(state.tickets, cost);
    let useCoins = (cost - useTickets) * 10;

    if (state.tickets < cost && state.coins < useCoins) {
      return { success: false, reason: '抽卡券或金币不足（需要10张券或100金币）' };
    }

    state.tickets -= useTickets;
    state.coins -= useCoins;
    GameState.save(state);

    const cards = [];
    let hasSR = false;

    for (let i = 0; i < 10; i++) {
      const card = this.pull();
      cards.push(card);
      if (card.rarity === 'SR' || card.rarity === 'SSR') hasSR = true;
    }

    // 保底SR：如果10张没有SR/R以上，强制替换最后一张
    if (!hasSR) {
      const srPool = getCharactersByRarity('SR');
      const character = srPool[Math.floor(Math.random() * srPool.length)];
      const imageIndex = Math.floor(Math.random() * character.images.length);
      const image = character.images[imageIndex];
      const cardUid = `${character.id}_${imageIndex}`;
      const isDuplicate = state.collection.includes(cardUid);

      if (!isDuplicate) {
        state.collection.push(cardUid);
      } else {
        state.coins += RARITY_CONFIG.SR.coinValue;
      }
      GameState.save(state);

      cards[9] = { character, image, rarity: 'SR', cardUid, isDuplicate, coinValue: isDuplicate ? RARITY_CONFIG.SR.coinValue : 0 };
    }

    return { success: true, cards };
  },

  // 获取所有已收集的角色（去重）
  getCollectedCharacters() {
    const state = GameState.get();
    const collected = {};
    state.collection.forEach(uid => {
      const charId = uid.split('_')[0];
      if (!collected[charId]) collected[charId] = 0;
      collected[charId]++;
    });
    return collected;
  },

  // 获取角色收集进度
  getCharacterProgress(charId) {
    const character = getCharacterById(charId);
    if (!character) return { total: 0, collected: 0, percent: 0 };
    const state = GameState.get();
    const collected = character.images.filter((_, idx) =>
      state.collection.includes(`${charId}_${idx}`)
    ).length;
    return {
      total: character.images.length,
      collected,
      percent: Math.round((collected / character.images.length) * 100)
    };
  }
};
