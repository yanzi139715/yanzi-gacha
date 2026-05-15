// 抽卡引擎 - 多池版本
const GachaEngine = {
  // 获取卡池的保底计数key
  pityKey(poolId) {
    return `pity_${poolId}`;
  },

  // 获取卡池保底计数
  getPity(poolId) {
    const state = GameState.get();
    return state[this.pityKey(poolId)] || 0;
  },

  // 设置卡池保底计数
  setPity(poolId, count) {
    const state = GameState.get();
    state[this.pityKey(poolId)] = count;
    GameState.save(state);
  },

  // 从指定卡池抽取一张卡
  pull(poolId) {
    const pool = POOL_CONFIG[poolId];
    if (!pool) return null;

    const state = GameState.get();
    const pityKey = this.pityKey(poolId);
    const pityCount = state[pityKey] || 0;

    // 计算SSR概率（含软保底）
    let ssrProb = RARITY_CONFIG.SSR.prob;
    if (pityCount >= pool.softPityStart) {
      ssrProb += (pityCount - pool.softPityStart + 1) * pool.softPityRate;
    }

    const rand = Math.random() * 100;
    let rarity;

    if (rand < ssrProb) {
      rarity = 'SSR';
    } else if (rand < ssrProb + RARITY_CONFIG.SR.prob) {
      rarity = 'SR';
    } else {
      rarity = 'R';
    }

    // 选择卡牌
    let card;
    const hasRateUp = pool.rateUpCharId && pool.rateUpFraction > 0;

    if (hasRateUp) {
      // 有UP角色的卡池：按概率决定是否出UP角色
      const upRoll = Math.random();
      if (upRoll < pool.rateUpFraction) {
        // 出UP角色的该稀有度卡牌
        const upChar = getCharacterById(pool.rateUpCharId);
        const upCards = upChar.images
          .map((img, idx) => ({
            characterId: upChar.id,
            characterName: upChar.name,
            description: upChar.description,
            imageIndex: idx,
            src: img.src,
            rarity: img.rarity,
            uid: `${upChar.id}_${idx}`
          }))
          .filter(c => c.rarity === rarity);

        if (upCards.length > 0) {
          card = upCards[Math.floor(Math.random() * upCards.length)];
        }
      }
    }

    // 非UP或UP角色没有该稀有度的卡，从整个卡池该稀有度中选
    if (!card) {
      const poolCards = getCardsByRarityInPool(rarity, poolId);
      if (poolCards.length > 0) {
        card = poolCards[Math.floor(Math.random() * poolCards.length)];
      } else {
        // fallback: 从整个卡池随机选（不应发生）
        const allPoolCards = getCardsByRarityInPool('R', poolId);
        card = allPoolCards[Math.floor(Math.random() * allPoolCards.length)];
      }
    }

    // 检查是否重复
    const isDuplicate = state.collection.includes(card.uid);
    let echoShardGain = 0;
    let unlockLevelUp = null; // { from, to }

    // 更新状态
    if (!isDuplicate) {
      state.collection.push(card.uid);
      // SSR 首抽：写入 skinUnlocks，level=1
      if (rarity === 'SSR') {
        state.skinUnlocks = state.skinUnlocks || {};
        state.skinUnlocks[card.uid] = { pulls: 1, level: 1 };
      }
    } else {
      // 重复
      if (rarity === 'SSR') {
        // === SSR 重复：阶段解锁 + 共鸣碎片，不再给 Beacon ===
        state.skinUnlocks = state.skinUnlocks || {};
        const entry = state.skinUnlocks[card.uid] || { pulls: 1, level: 1 };
        const prevLevel = entry.level;
        entry.pulls = (entry.pulls || 1) + 1;
        // 每抽 1 次 = level +1，最高 5（满凸）
        entry.level = Math.min(5, entry.level + 1);
        state.skinUnlocks[card.uid] = entry;
        if (entry.level > prevLevel) {
          unlockLevelUp = { from: prevLevel, to: entry.level };
        }
        // 重复 SSR → +50 共鸣碎片
        echoShardGain = RARITY_CONFIG.SSR.shardValue || 50;
        state.echoShards = (state.echoShards || 0) + echoShardGain;
      } else {
        // 重复 SR/R 仍走 Beacon
        state.coins += RARITY_CONFIG[rarity].coinValue;
      }
    }

    // 更新保底计数
    if (rarity === 'SSR') {
      state[pityKey] = 0;
    } else {
      state[pityKey] = (state[pityKey] || 0) + 1;
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
      coinValue: isDuplicate && rarity !== 'SSR' ? RARITY_CONFIG[rarity].coinValue : 0,
      echoShardGain,             // SSR 重复获得的碎片
      unlockLevelUp,             // { from, to } 解锁升级提示
      currentLevel: state.skinUnlocks?.[card.uid]?.level || null
    };
  },

  // 单抽
  singlePull(poolId) {
    const pool = POOL_CONFIG[poolId];
    if (!pool) return { success: false, reason: '卡池不存在' };

    const state = GameState.get();
    const ticketKey = `ticket_${poolId}`;
    const hasTicket = (state[ticketKey] || 0) > 0;
    const hasUniversalTicket = (state.tickets || 0) > 0;

    if (!hasTicket && !hasUniversalTicket && state.coins < 10) {
      return { success: false, reason: '没有抽卡券，Beacon也不够（需要10Beacon）' };
    }

    // 优先使用卡池专属券，再用通用券，最后用Beacon
    if (hasTicket) {
      state[ticketKey]--;
    } else if (hasUniversalTicket) {
      state.tickets--;
    } else {
      state.coins -= 10;
    }
    GameState.save(state);

    return { success: true, cards: [this.pull(poolId)], poolId };
  },

  // 十连抽（保底至少1张SR）
  tenPull(poolId) {
    const pool = POOL_CONFIG[poolId];
    if (!pool) return { success: false, reason: '卡池不存在' };

    const state = GameState.get();
    const cost = 10;
    const ticketKey = `ticket_${poolId}`;
    const poolTickets = state[ticketKey] || 0;
    const universalTickets = state.tickets || 0;

    // 计算券的使用
    let usePoolTickets = Math.min(poolTickets, cost);
    let remain = cost - usePoolTickets;
    let useUniversal = Math.min(universalTickets, remain);
    remain -= useUniversal;
    let useCoins = remain * 10;

    if (state.coins < useCoins) {
      return { success: false, reason: '抽卡券或Beacon不足（需要10张券或100Beacon）' };
    }

    state[ticketKey] = poolTickets - usePoolTickets;
    state.tickets = universalTickets - useUniversal;
    state.coins -= useCoins;
    GameState.save(state);

    const cards = [];
    let hasSR = false;

    for (let i = 0; i < 10; i++) {
      const card = this.pull(poolId);
      cards.push(card);
      if (card.rarity === 'SR' || card.rarity === 'SSR') hasSR = true;
    }

    // 保底SR
    if (!hasSR) {
      const srPool = getCardsByRarityInPool('SR', poolId);
      if (srPool.length > 0) {
        const guaranteed = srPool[Math.floor(Math.random() * srPool.length)];
        const cur = GameState.get(); // 重读，前面循环已修改
        const isDuplicate = cur.collection.includes(guaranteed.uid);

        if (!isDuplicate) {
          cur.collection.push(guaranteed.uid);
        } else {
          cur.coins += RARITY_CONFIG.SR.coinValue;
        }
        GameState.save(cur);

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
    }

    return { success: true, cards, poolId };
  },

  // 获取卡池可用抽卡次数
  getAvailablePulls(poolId) {
    const state = GameState.get();
    const ticketKey = `ticket_${poolId}`;
    return (state[ticketKey] || 0) + (state.tickets || 0) + Math.floor(state.coins / 10);
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
