// ============================================================
// Memoria Network · GameState（多 coser 隔离 + V2.0 账号预留）
// ============================================================
const GameState = {
  STORAGE_KEY: 'memoria-network-state',
  LEGACY_KEYS: ['memoria-yanzi-state', 'yanzi-gacha-state'],
  SCHEMA_VERSION: 2,

  defaultState() {
    const coserDefault = () => ({
      beacon: 0,         // 该 coser 的硬通货（充值/任务）
      crystal: 0,        // 晶核（高级付费货币，限定/月卡）
      fragment: 0,       // 碎片（重复 SSR 转化的共鸣碎片）
      tickets: 0,        // 该 coser 通用券
      pity_standard: 0,
      pity_limited: 0,
      pity_xy: 0,
      pity_aria: 0,
      ticket_standard: 0,
      ticket_limited: 0,
      freePullUsed: {},
      collection: [],    // 该 coser 已收集卡牌 ['charId_idx']
      skinUnlocks: {},   // 阶段解锁 { 'charId_idx': { pulls, level } }
      monthCard: { startAt: null, lastClaim: '' }  // 月卡 Sync Pass · 30 天每日 +3 Beacon
    });

    return {
      // === V2.0 账号系统预留 ===
      _schemaVersion: this.SCHEMA_VERSION,
      _localSoulId: null,
      _cloudBound: false,
      _accountId: null,
      _lastSyncedAt: null,
      _pendingMigrate: false,

      // === 全局玩家档案（守护者）===
      keeperTag: null,       // KEEPER · #20260515 形态
      keeperJoinedAt: null,  // ISO 加入日期
      lastCheckin: '',
      signinStreak: 0,
      signinHistory: [],     // ['2026-05-14','2026-05-15',...] 近 7 天
      totalPulls: 0,
      inviteCount: 0,
      sharedWechat: false, sharedQQ: false, sharedWeibo: false,

      // === 抽卡历史（最近 100 条，用于欧气统计/时间线） ===
      pullHistory: [],       // [{ uid, charId, charName, rarity, at, poolId, coserId }]

      // === 首充翻倍（7 天限时，全局一次性） ===
      firstCharge: { startAt: null, shown: false, claimed: false },

      // === Current 状态 ===
      currentCoser: 'yanzi',
      currentPool: 'standard',
      fastPull: false,

      // === 皮肤系统（跨 coser 全局）===
      mainSkin: null,                                          // 全局主皮肤 key
      battleSkins: { A: null, B: null, C: null },              // 战斗 3 槽位
      _battleSkinSrcs: {},                                     // 跨页面 src 缓存

      // === 各 coser 隔离数据 ===
      coserData: {
        yanzi:  { ...coserDefault(), tickets: 3, beacon: 0 },  // 起步 3 张妍子券
        xiaoyu: { ...coserDefault() },
        aria:   { ...coserDefault() }
      }
    };
  },

  bootstrap() {
    const s = this.get();
    let dirty = false;

    if (!s._localSoulId) {
      s._localSoulId = this._genUuid();
      dirty = true;
    }

    if (!s.keeperJoinedAt) {
      const d = new Date();
      const yyyymmdd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
      s.keeperTag = `#${yyyymmdd}`;
      s.keeperJoinedAt = d.toISOString();
      dirty = true;
    }

    // 旧版本数据迁移
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      for (const legacy of this.LEGACY_KEYS) {
        const raw = localStorage.getItem(legacy);
        if (raw) {
          try {
            const old = JSON.parse(raw);
            // 旧 schema 的 tickets/coins/collection 全部归到 yanzi.coserData
            if (old.tickets != null) s.coserData.yanzi.tickets = old.tickets;
            if (old.coins != null) s.coserData.yanzi.beacon = old.coins;
            if (old.echoShards != null) s.coserData.yanzi.fragment = old.echoShards;
            if (Array.isArray(old.collection)) s.coserData.yanzi.collection = old.collection;
            if (old.skinUnlocks) s.coserData.yanzi.skinUnlocks = old.skinUnlocks;
            if (old.lastCheckin) s.lastCheckin = old.lastCheckin;
            if (old.battleSkins) s.battleSkins = old.battleSkins;
            if (old._battleSkinSrcs) s._battleSkinSrcs = old._battleSkinSrcs;
            if (old.mainSkin) s.mainSkin = old.mainSkin;
            if (old.fastPull) s.fastPull = old.fastPull;
            if (old._localSoulId) s._localSoulId = old._localSoulId;
            dirty = true;
            break;
          } catch {}
        }
      }
    }

    if ((s._schemaVersion || 0) < this.SCHEMA_VERSION) {
      s._schemaVersion = this.SCHEMA_VERSION;
      dirty = true;
    }
    if (dirty) this.save(s);
    return s;
  },

  _genUuid() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  get() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return this.defaultState();
      const state = JSON.parse(data);
      const def = this.defaultState();
      // 浅合并 + coserData 深合并兜底
      const merged = { ...def, ...state };
      merged.coserData = { ...def.coserData, ...(state.coserData || {}) };
      Object.keys(def.coserData).forEach(cid => {
        merged.coserData[cid] = { ...def.coserData[cid], ...(state.coserData?.[cid] || {}) };
      });
      return merged;
    } catch {
      return this.defaultState();
    }
  },

  save(state) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    if (this._cloudSyncHook) this._cloudSyncHook(state);
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // ====== Coser 数据快捷访问 ======
  // 获取当前 coser 的数据片段
  getCurrentCoserData(state) {
    state = state || this.get();
    return state.coserData[state.currentCoser] || state.coserData.yanzi;
  },
  // 更新当前 coser 数据并保存
  updateCoserData(coserId, updater) {
    const s = this.get();
    s.coserData[coserId] = updater(s.coserData[coserId]);
    this.save(s);
    return s;
  },

  // ====== V2.0 账号系统预留接口（stub）======
  async bindAccount(/* accountId, authToken */) {
    console.warn('[Memoria] bindAccount stub — V2.0 未实现');
  },
  async pullFromCloud() {
    console.warn('[Memoria] pullFromCloud stub');
  },
  async pushToCloud() {
    console.warn('[Memoria] pushToCloud stub');
  },
  setCloudSyncHook(fn) {
    this._cloudSyncHook = fn;
  }
};
