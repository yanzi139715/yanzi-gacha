// ============================================================
// Memoria Network · 抽卡引擎（per coser 数据隔离）
// ============================================================
const GachaEngine = {
  pityKey(poolId) {
    // 简化：所有池统一用 pool.id 作 pity key
    return `pity_${poolId.replace(/-/g, '_')}`;
  },

  getPity(poolId) {
    const pool = POOLS[poolId];
    if (!pool) return 0;
    const state = GameState.get();
    const cdata = state.coserData[pool.coserId];
    return cdata?.[this.pityKey(poolId)] || 0;
  },

  setPity(poolId, count) {
    const pool = POOLS[poolId];
    if (!pool) return;
    GameState.updateCoserData(pool.coserId, d => ({ ...d, [this.pityKey(poolId)]: count }));
  },

  // 单抽一张
  pull(poolId) {
    const pool = POOLS[poolId];
    if (!pool) return null;
    const state = GameState.get();
    const cdata = state.coserData[pool.coserId];
    const pityCount = cdata[this.pityKey(poolId)] || 0;

    let ssrProb = RARITY_CONFIG.SSR.prob;
    if (pityCount >= pool.softPityStart) {
      ssrProb += (pityCount - pool.softPityStart + 1) * pool.softPityRate;
    }
    if (pityCount + 1 >= pool.pityLimit) ssrProb = 100; // 硬保底

    const rand = Math.random() * 100;
    const rarity = rand < ssrProb ? 'SSR'
      : rand < ssrProb + RARITY_CONFIG.SR.prob ? 'SR' : 'R';

    let card;
    if (pool.rateUpCharId && pool.rateUpFraction > 0 && Math.random() < pool.rateUpFraction) {
      const upChar = getCharacterById(pool.rateUpCharId);
      const ups = upChar.images.map((img, idx) => ({
        uid: `${upChar.id}_${idx}`, characterId: upChar.id, characterName: upChar.name,
        coserId: upChar.coserId, description: upChar.description, imageIndex: idx,
        src: img.src, rarity: img.rarity
      })).filter(c => c.rarity === rarity);
      if (ups.length > 0) card = ups[Math.floor(Math.random() * ups.length)];
    }
    if (!card) {
      const pcards = getCardsByRarityInPool(rarity, poolId);
      if (pcards.length > 0) card = pcards[Math.floor(Math.random() * pcards.length)];
      else {
        const fallback = getCardsByRarityInPool('R', poolId);
        card = fallback[Math.floor(Math.random() * fallback.length)];
      }
    }

    // 更新 coser data
    const isDup = cdata.collection.includes(card.uid);
    let echoShardGain = 0;
    let unlockLevelUp = null;

    const newData = { ...cdata };
    newData.collection = [...cdata.collection];
    newData.skinUnlocks = { ...cdata.skinUnlocks };

    if (!isDup) {
      newData.collection.push(card.uid);
      if (rarity === 'SSR') {
        newData.skinUnlocks[card.uid] = { pulls: 1, level: 1 };
      }
    } else {
      if (rarity === 'SSR') {
        const entry = newData.skinUnlocks[card.uid] || { pulls: 1, level: 1 };
        const prev = entry.level;
        entry.pulls = (entry.pulls || 1) + 1;
        entry.level = Math.min(5, entry.level + 1);
        newData.skinUnlocks[card.uid] = entry;
        if (entry.level > prev) unlockLevelUp = { from: prev, to: entry.level };
        echoShardGain = RARITY_CONFIG.SSR.shardValue;
        newData.fragment = (newData.fragment || 0) + echoShardGain;
      } else {
        newData.beacon = (newData.beacon || 0) + RARITY_CONFIG[rarity].coinValue;
      }
    }

    // 保底计数
    newData[this.pityKey(poolId)] = rarity === 'SSR' ? 0 : (cdata[this.pityKey(poolId)] || 0) + 1;

    GameState.updateCoserData(pool.coserId, () => newData);
    const s2 = GameState.get();
    s2.totalPulls++;
    s2.pullHistory = (s2.pullHistory || []).concat([{
      uid: card.uid,
      charId: card.characterId,
      charName: card.characterName,
      rarity: card.rarity,
      at: Date.now(),
      poolId,
      coserId: pool.coserId
    }]).slice(-100);
    GameState.save(s2);

    return {
      uid: card.uid,
      characterId: card.characterId,
      characterName: card.characterName,
      coserId: card.coserId,
      description: card.description,
      image: card.src,
      rarity: card.rarity,
      imageIndex: card.imageIndex,
      isDuplicate: isDup,
      coinValue: isDup && rarity !== 'SSR' ? RARITY_CONFIG[rarity].coinValue : 0,
      echoShardGain,
      unlockLevelUp,
      currentLevel: newData.skinUnlocks[card.uid]?.level || null
    };
  },

  // 单抽
  singlePull(poolId) {
    const pool = POOLS[poolId];
    if (!pool) return { success: false, reason: '卡池不存在' };
    const cdata = GameState.get().coserData[pool.coserId];

    if ((cdata.tickets || 0) > 0) {
      GameState.updateCoserData(pool.coserId, d => ({ ...d, tickets: d.tickets - 1 }));
    } else if ((cdata.beacon || 0) >= 10) {
      GameState.updateCoserData(pool.coserId, d => ({ ...d, beacon: d.beacon - 10 }));
    } else {
      return { success: false, reason: `${COSERS[pool.coserId].name} 的抽卡券与 Beacon 都不足（需 1 券或 10 Beacon）` };
    }
    return { success: true, cards: [this.pull(poolId)], poolId };
  },

  // 十连
  tenPull(poolId) {
    const pool = POOLS[poolId];
    if (!pool) return { success: false, reason: '卡池不存在' };
    const cdata = GameState.get().coserData[pool.coserId];
    const ticketsHave = cdata.tickets || 0;
    const useTickets = Math.min(ticketsHave, 10);
    const beaconNeed = (10 - useTickets) * 10;
    if ((cdata.beacon || 0) < beaconNeed) {
      return { success: false, reason: `${COSERS[pool.coserId].name} 的资源不足（需 10 券 或 100 Beacon）` };
    }

    GameState.updateCoserData(pool.coserId, d => ({
      ...d,
      tickets: d.tickets - useTickets,
      beacon: d.beacon - beaconNeed
    }));

    const cards = [];
    let hasSR = false;
    for (let i = 0; i < 10; i++) {
      const c = this.pull(poolId);
      cards.push(c);
      if (c.rarity === 'SR' || c.rarity === 'SSR') hasSR = true;
    }
    // SR 保底
    if (!hasSR) {
      const srs = getCardsByRarityInPool('SR', poolId);
      if (srs.length > 0) {
        const g = srs[Math.floor(Math.random() * srs.length)];
        const cur = GameState.get();
        const curC = cur.coserData[pool.coserId];
        const isDup = curC.collection.includes(g.uid);
        const newD = { ...curC, collection: [...curC.collection] };
        if (!isDup) newD.collection.push(g.uid);
        else newD.beacon = (newD.beacon || 0) + RARITY_CONFIG.SR.coinValue;
        GameState.updateCoserData(pool.coserId, () => newD);
        cards[9] = {
          uid: g.uid, characterId: g.characterId, characterName: g.characterName,
          coserId: g.coserId, description: g.description, image: g.src,
          rarity: 'SR', imageIndex: g.imageIndex,
          isDuplicate: isDup, coinValue: isDup ? RARITY_CONFIG.SR.coinValue : 0
        };
      }
    }
    return { success: true, cards, poolId };
  },

  getAvailablePulls(poolId) {
    const pool = POOLS[poolId];
    if (!pool) return 0;
    const c = GameState.get().coserData[pool.coserId];
    return (c.tickets || 0) + Math.floor((c.beacon || 0) / 10);
  },

  getCharacterProgress(charId) {
    const char = COSER_CHARS[charId];
    if (!char) return { total: 0, collected: 0, percent: 0 };
    const c = GameState.get().coserData[char.coserId];
    const all = getCardsByCharacter(charId);
    const collected = all.filter(card => c.collection.includes(card.uid)).length;
    return { total: all.length, collected, percent: all.length > 0 ? Math.round(collected / all.length * 100) : 0 };
  },

  getCollectedCardsForCharacter(charId) {
    const char = COSER_CHARS[charId];
    if (!char) return [];
    const c = GameState.get().coserData[char.coserId];
    return getCardsByCharacter(charId).map(card => ({
      ...card,
      collected: c.collection.includes(card.uid)
    }));
  },

  // Coser 整体守护进度
  getCoserProgress(coserId) {
    const c = GameState.get().coserData[coserId];
    const chars = getCharsByCoser(coserId);
    const total = chars.length;
    const collected = chars.filter(ch =>
      ch.images.some((_, idx) => c.collection.includes(`${ch.id}_${idx}`))
    ).length;
    return { total, collected, percent: total > 0 ? Math.round(collected / total * 100) : 0 };
  }
};
