// ============================================================
// 频率战 · 战斗引擎（从 battle/index.html 抽取核心规则）
// 6 动作猜拳：触达/爆响/守护/凝固/聚频/散频
// ============================================================
const BATTLE = {
  MAX_HP: 15,
  MAX_ENERGY: 3,
  MAX_CHARGE: 10,

  // 6 个动作
  ACTIONS: [
    { id: 'attack', name: '触达', en: 'attack', desc: '快攻 · 普攻基础伤害', cost: '无' },
    { id: 'power',  name: '爆响', en: 'power',  desc: '强攻 · 消耗蓄能造成 1+N 伤害', cost: '≥1 蓄能' },
    { id: 'block',  name: '守护', en: 'block',  desc: '普防 · 挡触达 + 反伤', cost: '无' },
    { id: 'guard',  name: '凝固', en: 'guard',  desc: '有效防 · 挡所有攻击 + 反伤', cost: '2 能量' },
    { id: 'charge', name: '聚频', en: 'charge', desc: '蓄能 · 共鸣值 +N（连蓄递增）', cost: '无' },
    { id: 'break',  name: '散频', en: 'break',  desc: '破蓄 · 仅对方聚频时清零', cost: '1 能量' }
  ],

  // 3 个 archetype 角色
  HEROES: {
    A: { id: 'A', letter: 'A', archetype: 'STRIKE',   nameCN: '焰',
         attackBase: 3, comboMax: 2, blockReflect: 1, guardReflect: 1, chargeBoost: 0,
         color: '#FF8A5C',
         ultimate: { id: 'blaze', cn: '烈触达', en: 'BLAZE TOUCH', trigger: '连击 ≥ 3', effect: '下次触达 +2 · 穿透守护' } },
    B: { id: 'B', letter: 'B', archetype: 'REFLECT', nameCN: '雨',
         attackBase: 2, comboMax: 2, blockReflect: 2, guardReflect: 2, chargeBoost: 0,
         color: '#C4A0FF',
         ultimate: { id: 'echo', cn: '潮汐回响', en: 'TIDAL ECHO', trigger: 'HP ≤ 6', effect: '两回合内反伤 ×150%' } },
    C: { id: 'C', letter: 'C', archetype: 'OVERFLOW', nameCN: '光',
         attackBase: 2, comboMax: 2, blockReflect: 1, guardReflect: 1, chargeBoost: 1,
         color: '#7BC9FF',
         ultimate: { id: 'overflow', cn: '共鸣溢出', en: 'OVERFLOW', trigger: '蓄能 ≥ 8', effect: '下次爆响穿透 + 蓄能不消耗' } }
  },

  chargeInc(streak, hero) {
    const base = [1, 3, 6, 10, 14, 18];
    return base[Math.min(streak, 5)] + (hero.chargeBoost || 0);
  },

  // 6×6 = 36 case 完整 resolve
  resolveTurn(pAct, eAct, pSt, eSt, pH, eH, cfg = {}) {
    const pSpend = pAct === 'power' ? Math.max(1, Math.min(pSt.charge, cfg.pSpend ?? pSt.charge)) : 0;
    const eSpend = eAct === 'power' ? Math.max(1, Math.min(eSt.charge, cfg.eSpend ?? eSt.charge)) : 0;
    const pAtkDmg = pAct === 'attack' ? pH.attackBase + Math.min(pSt.combo, pH.comboMax) : 0;
    const eAtkDmg = eAct === 'attack' ? eH.attackBase + Math.min(eSt.combo, eH.comboMax) : 0;
    const pPwrDmg = pAct === 'power' ? 1 + pSpend : 0;
    const ePwrDmg = eAct === 'power' ? 1 + eSpend : 0;
    const pPwrLeft = pAct === 'power' ? pSt.charge - pSpend : pSt.charge;
    const ePwrLeft = eAct === 'power' ? eSt.charge - eSpend : eSt.charge;
    const r = { pDmg: 0, eDmg: 0, pE: pSt.energy, eE: eSt.energy, pC: pSt.charge, eC: eSt.charge, pCb: 0, eCb: 0, pCs: 0, eCs: 0, msg: '' };
    const key = pAct + '_' + eAct;
    switch (key) {
      case 'attack_attack': r.pDmg = eAtkDmg; r.eDmg = pAtkDmg; r.pCb = pSt.combo + 1; r.eCb = eSt.combo + 1; r.msg = `互殴 · 你 -${eAtkDmg}，对方 -${pAtkDmg}`; break;
      case 'attack_power':
        if (eSpend >= 5) { r.pDmg = ePwrDmg; r.eDmg = pAtkDmg; r.eC = ePwrLeft; r.pCb = pSt.combo + 1; r.msg = `对方穿透爆响 · 你 -${ePwrDmg}`; }
        else { r.eDmg = pAtkDmg; r.pCb = pSt.combo + 1; r.msg = `普攻打断强攻 · 对方 -${pAtkDmg}`; }
        break;
      case 'attack_block': r.pDmg = eH.blockReflect; r.pCb = 0; r.msg = `对方反伤 · 你 -${r.pDmg}`; break;
      case 'attack_guard': r.pDmg = eH.guardReflect; r.eE = Math.max(0, eSt.energy - 2); r.pCb = 0; r.msg = `对方凝固反伤 · 你 -${r.pDmg}`; break;
      case 'attack_charge': r.eDmg = pAtkDmg; r.pCb = pSt.combo + 1; r.eC = Math.min(10, eSt.charge + this.chargeInc(eSt.cstreak, eH)); r.eCs = eSt.cstreak + 1; r.msg = `打中蓄能 · 对方 -${pAtkDmg} 但蓄能照收`; break;
      case 'attack_break': r.eDmg = pAtkDmg; r.eE = Math.max(0, eSt.energy - 1); r.pCb = pSt.combo + 1; r.msg = `打中破蓄 · 对方 -${pAtkDmg}`; break;
      case 'power_attack':
        if (pSpend >= 5) { r.eDmg = pPwrDmg; r.pDmg = eAtkDmg; r.pC = pPwrLeft; r.eCb = eSt.combo + 1; r.msg = `穿透爆响 · 对方 -${pPwrDmg}，你 -${eAtkDmg}`; }
        else { r.pDmg = eAtkDmg; r.eCb = eSt.combo + 1; r.msg = `普攻打断你强攻 · 你 -${eAtkDmg}`; }
        break;
      case 'power_power':
        if (pPwrDmg > ePwrDmg) { r.eDmg = pPwrDmg - ePwrDmg; r.msg = `强攻对轰 · 对方 -${r.eDmg}`; }
        else if (ePwrDmg > pPwrDmg) { r.pDmg = ePwrDmg - pPwrDmg; r.msg = `强攻对轰 · 你 -${r.pDmg}`; }
        else r.msg = `强攻同轰`;
        r.pC = pPwrLeft; r.eC = ePwrLeft; break;
      case 'power_block': r.eDmg = pPwrDmg; r.pC = pPwrLeft; r.msg = `强攻穿普防 · 对方 -${pPwrDmg}`; break;
      case 'power_guard': {
        const bonus = Math.floor(pSpend / 3);
        r.pDmg = eH.guardReflect + bonus; r.eE = Math.max(0, eSt.energy - 2); r.pC = pPwrLeft;
        r.msg = `凝固反震 · 你 -${r.pDmg}`;
        break;
      }
      case 'power_charge': r.eDmg = pPwrDmg; r.pC = pPwrLeft; r.msg = `强攻打断蓄能 · 对方 -${pPwrDmg}`; break;
      case 'power_break': r.eDmg = pPwrDmg; r.eE = Math.max(0, eSt.energy - 1); r.pC = pPwrLeft; r.msg = `强攻命中破蓄 · 对方 -${pPwrDmg}`; break;
      case 'block_attack': r.eDmg = pH.blockReflect; r.eCb = 0; r.msg = `你普防反伤 · 对方 -${r.eDmg}`; break;
      case 'block_power': r.pDmg = ePwrDmg; r.eC = ePwrLeft; r.msg = `对方强攻穿你普防 · 你 -${ePwrDmg}`; break;
      case 'block_block': r.msg = `双方对峙`; break;
      case 'block_guard': r.eE = Math.max(0, eSt.energy - 2); r.msg = `对方 -2 能量`; break;
      case 'block_charge': r.eC = Math.min(10, eSt.charge + this.chargeInc(eSt.cstreak, eH)); r.eCs = eSt.cstreak + 1; r.msg = `对方安全蓄能 +${this.chargeInc(eSt.cstreak, eH)}`; break;
      case 'block_break': r.eE = Math.max(0, eSt.energy - 1); r.msg = `对方破蓄落空 · -1 能量`; break;
      case 'guard_attack': r.eDmg = pH.guardReflect; r.pE = Math.max(0, pSt.energy - 2); r.eCb = 0; r.msg = `你凝固反伤 · 对方 -${r.eDmg}`; break;
      case 'guard_power': {
        const bonus = Math.floor(eSpend / 3);
        r.eDmg = pH.guardReflect + bonus; r.pE = Math.max(0, pSt.energy - 2); r.eC = ePwrLeft;
        r.msg = `你凝固反震 · 对方 -${r.eDmg}`;
        break;
      }
      case 'guard_block': r.pE = Math.max(0, pSt.energy - 2); r.msg = `你 -2 能量`; break;
      case 'guard_guard': r.pE = Math.max(0, pSt.energy - 2); r.eE = Math.max(0, eSt.energy - 2); r.msg = `双方对峙 · 各 -2 能量`; break;
      case 'guard_charge': r.pE = Math.max(0, pSt.energy - 2); r.eC = Math.min(10, eSt.charge + this.chargeInc(eSt.cstreak, eH)); r.eCs = eSt.cstreak + 1; r.msg = `你举盾落空，对方蓄能`; break;
      case 'guard_break': r.pE = Math.max(0, pSt.energy - 2); r.eE = Math.max(0, eSt.energy - 1); r.msg = `双方资源浪费`; break;
      case 'charge_attack': r.pDmg = eAtkDmg; r.eCb = eSt.combo + 1; r.pC = Math.min(10, pSt.charge + this.chargeInc(pSt.cstreak, pH)); r.pCs = pSt.cstreak + 1; r.msg = `你蓄能被打 · 你 -${eAtkDmg}`; break;
      case 'charge_power': r.pDmg = ePwrDmg; r.eC = ePwrLeft; r.msg = `你蓄能被强攻打断 · 你 -${ePwrDmg}`; break;
      case 'charge_block': r.pC = Math.min(10, pSt.charge + this.chargeInc(pSt.cstreak, pH)); r.pCs = pSt.cstreak + 1; r.msg = `你安全蓄能 +${this.chargeInc(pSt.cstreak, pH)}`; break;
      case 'charge_guard': r.pC = Math.min(10, pSt.charge + this.chargeInc(pSt.cstreak, pH)); r.pCs = pSt.cstreak + 1; r.eE = Math.max(0, eSt.energy - 2); r.msg = `你安全蓄能 +${this.chargeInc(pSt.cstreak, pH)}`; break;
      case 'charge_charge': {
        const pInc = Math.max(1, Math.floor(this.chargeInc(pSt.cstreak, pH) / 2));
        const eInc = Math.max(1, Math.floor(this.chargeInc(eSt.cstreak, eH) / 2));
        r.pC = Math.min(10, pSt.charge + pInc); r.eC = Math.min(10, eSt.charge + eInc);
        r.pCs = pSt.cstreak + 1; r.eCs = eSt.cstreak + 1;
        r.msg = `双方对蓄 · 你 +${pInc}，对方 +${eInc}`;
        break;
      }
      case 'charge_break': r.pC = 0; r.eE = Math.max(0, eSt.energy - 1); r.eC = Math.min(10, eSt.charge + 2); r.msg = `你蓄能被破 · 清零，对方偷 2 点`; break;
      case 'break_attack': r.pDmg = eAtkDmg; r.pE = Math.max(0, pSt.energy - 1); r.eCb = eSt.combo + 1; r.msg = `你破蓄被打 · 你 -${eAtkDmg}`; break;
      case 'break_power': r.pDmg = ePwrDmg; r.pE = Math.max(0, pSt.energy - 1); r.eC = ePwrLeft; r.msg = `你破蓄被强攻 · 你 -${ePwrDmg}`; break;
      case 'break_block': r.pE = Math.max(0, pSt.energy - 1); r.msg = `你破蓄落空 · -1 能量`; break;
      case 'break_guard': r.pE = Math.max(0, pSt.energy - 1); r.eE = Math.max(0, eSt.energy - 2); r.msg = `双方资源浪费`; break;
      case 'break_charge': r.eC = 0; r.pE = Math.max(0, pSt.energy - 1); r.pC = Math.min(10, pSt.charge + 2); r.msg = `破蓄成功 · 对方清零，你偷 2 点`; break;
      case 'break_break': r.pE = Math.max(0, pSt.energy - 1); r.eE = Math.max(0, eSt.energy - 1); r.msg = `双方破蓄 · 各 -1 能量`; break;
    }
    return r;
  },

  // 简化版 AI：根据敌方蓄能/HP 加权随机
  aiPick(eSt, pSt, eH, pH) {
    const weights = { attack: 0.25, power: 0, block: 0.15, guard: 0, charge: 0.25, break: 0 };
    // 蓄能足时倾向爆响
    if (eSt.charge >= 5) weights.power = 0.3;
    if (eSt.charge >= 7) weights.power = 0.5;
    // 有能量时可凝固
    if (eSt.energy >= 2) weights.guard = 0.15;
    // 有能量时可破蓄
    if (eSt.energy >= 1 && pSt.cstreak >= 1) weights.break = 0.2;
    // HP 低时倾向防御
    if (eSt.hp / this.MAX_HP < 0.3) { weights.guard += 0.15; weights.block += 0.1; weights.attack -= 0.1; }
    // 归一化
    const tot = Object.values(weights).reduce((a,b)=>a+b, 0);
    Object.keys(weights).forEach(k => weights[k] = Math.max(0, weights[k] / tot));
    let rand = Math.random();
    for (const k of Object.keys(weights)) {
      if (rand < weights[k]) return { action: k, spend: k === 'power' ? Math.max(1, Math.min(eSt.charge, Math.floor(Math.random() * eSt.charge) + 1)) : 0 };
      rand -= weights[k];
    }
    return { action: 'attack', spend: 0 };
  },

  // 初始战斗 state
  initBattleState() {
    return { hp: this.MAX_HP, energy: 0, charge: 0, combo: 0, cstreak: 0 };
  },

  // 决定胜负
  checkEnd(pSt, eSt) {
    if (pSt.hp <= 0 && eSt.hp <= 0) return 'draw';
    if (pSt.hp <= 0) return 'lose';
    if (eSt.hp <= 0) return 'win';
    return null;
  }
};
