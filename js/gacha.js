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
      ssrProb += (state.pityCount - 59) * 6;
    }

    if (rand < ssrProb) {
      rarity = 'SSR';
    } else if (rand < ssrProb + RARITY_CONFIG.SR.prob) {
      rarity = 'SR';
    } else {
      rarity = 'R';
    }

    // 从该稀有度的全部卡牌中随机选一张
    const pool = getCardsByRarity(rarity);
    const card = pool[Math.floor(Math.random() * pool.length)];

    // 检查是否重复
    const isDuplicate = state.collection.includes(card.uid);

    // 更新状态
    if (!isDuplicate) {
      state.collection.push(card.uid);
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
      uid: card.uid,
      characterId: card.characterId,
      characterName: card.characterName,
      description: card.description,
      image: card.src,
      rarity: card.rarity,
      imageIndex: card.imageIndex,
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
    const cost = 10;
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

    // 保底SR
    if (!hasSR) {
      const srPool = getCardsByRarity('SR');
      const guaranteed = srPool[Math.floor(Math.random() * srPool.length)];
      const isDuplicate = state.collection.includes(guaranteed.uid);

      if (!isDuplicate) {
        state.collection.push(guaranteed.uid);
      } else {
        state.coins += RARITY_CONFIG.SR.coinValue;
      }
      GameState.save(state);

      cards[9] = {
        uid: guaranteed.uid,
        characterId: guaranteed.characterId,
        characterName: guaranteed.characterName,
        description: guaranteed.description,
        image: guaranteed.src,
        rarity: 'SR',
        imageIndex: guaranteed.imageIndex,
        isDuplicate,
        coinValue: isDuplicate ? RARITY_CONFIG.SR.coinValue : 0
      };
    }

    return { success: true, cards };
  },

  // 获取角色收集进度
  getCharacterProgress(charId) {
    const allCards = getCardsByCharacter(charId);
    const state = GameState.get();
    const collected = allCards.filter(c => state.collection.includes(c.uid)).length;
    return {
      total: allCards.length,
      collected,
      percent: allCards.length > 0 ? Math.round((collected / allCards.length) * 100) : 0
    };
  },

  // 获取角色已收集的卡牌列表
  getCollectedCardsForCharacter(charId) {
    const allCards = getCardsByCharacter(charId);
    const state = GameState.get();
    return allCards.map(c => ({
      ...c,
      collected: state.collection.includes(c.uid)
    }));
  }
};
