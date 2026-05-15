// ============================================================
// Memoria Network · 多 Coser 数据层
// 三位 Memoria：妍子（主线）/ 小雨（新接入）/ Aria（虚拟原创 IP）
// ============================================================

// === 稀有度配置（Resonance / Echo / Signal 对应 SSR / SR / R）===
const RARITY_CONFIG = {
  SSR: { color: '#FFD89B', glow: 'rgba(255,216,155,0.55)', label: 'RESONANCE', shortLabel: 'SSR', prob: 3,  coinValue: 0,  shardValue: 50, gradient: 'linear-gradient(135deg, #FFD89B, #FFA952)' },
  SR:  { color: '#C4A0FF', glow: 'rgba(196,160,255,0.5)',  label: 'ECHO',      shortLabel: 'SR',  prob: 15, coinValue: 20, shardValue: 0,  gradient: 'linear-gradient(135deg, #C4A0FF, #7BC9FF)' },
  R:   { color: '#7BC9FF', glow: 'rgba(123,201,255,0.4)',  label: 'SIGNAL',    shortLabel: 'R',   prob: 82, coinValue: 5,  shardValue: 0,  gradient: 'linear-gradient(135deg, #7BC9FF, #A0D2DB)' }
};

// === Coser 表（妍子/小雨/Aria） ===
const COSERS = {
  yanzi: {
    id: 'yanzi',
    name: '妍子',
    nameEn: 'YANZI',
    tier: '主线 Memoria',
    statusLine: '已上线 · 持续更新',
    location: '北京',
    tags: ['森林系', '古典童话', '高质量写真'],
    intro: '北京 · 擅长古典、童话、二次元角色。每套写真精修约 14 张，守护后可下载原图。',
    chapter: 'Chapter Ⅰ · 卡提希娅',
    chapterDesc: '"我在这里等了很久了"',
    coverImage: 'img/卡提希娅/DSC_8497.jpg',
    accentColor: '#FFD89B',
    archetype: { letter: 'A', archetype: 'STRIKE', nameCN: '焰',
      desc: '触达基础伤害 3 · 连击 3/4/5 · 主动出击型',
      stats: { atk: 3, combo: 2, reflect: 1 },
      ult: { cn: '烈触达', en: 'BLAZE TOUCH', trigger: '连击 ≥ 3', effect: '下次触达 · 伤害 +2 · 穿透守护', tagline: '焰息共鸣 · 一击破阵' }
    }
  },
  xiaoyu: {
    id: 'xiaoyu',
    name: '小雨',
    nameEn: 'XIAOYU',
    tier: 'Memoria',
    statusLine: '已上线 · 新人 Memoria',
    location: '杭州',
    tags: ['治愈系', '日常温柔', '夏季少女'],
    intro: '杭州 · 初次接入 Memoria Network。擅长温柔治愈系、日系少女写真。',
    chapter: 'Chapter Ⅰ · 夏日呢喃',
    chapterDesc: '"听见雨声，请记得我"',
    coverImage: 'img/小雨/xy-1.jpg',
    accentColor: '#C4A0FF',
    archetype: { letter: 'B', archetype: 'REFLECT', nameCN: '雨',
      desc: '反伤 +1 · 被击 2 次自动 +1 能量 · 反击型',
      stats: { atk: 2, combo: 2, reflect: 2 },
      ult: { cn: '潮汐回响', en: 'TIDAL ECHO', trigger: 'HP ≤ 6', effect: '两回合内 · 反伤回血 ×150% +2', tagline: '雨落不息 · 心跳回响' }
    }
  },
  aria: {
    id: 'aria',
    name: 'Aria',
    nameEn: 'ARIA',
    tier: 'Virtual Memoria',
    statusLine: 'VIRTUAL · 原创 IP',
    location: 'Network',
    tags: ['虚拟', '极光', '原创 IP'],
    intro: '虚拟 Memoria · 原创角色 · 极光少女。诞生于 Network 频率波动中。',
    chapter: 'Chapter Ⅰ · 极光初鸣',
    chapterDesc: '"频率永续，记忆不灭"',
    coverImage: 'spec/assets/virtual/aria/v1.jpg',
    accentColor: '#7BC9FF',
    archetype: { letter: 'C', archetype: 'OVERFLOW', nameCN: '光',
      desc: '聚频 2/4/7/11 · 极光不熄 · 频率永续',
      stats: { atk: 2, combo: 2, reflect: 1, charge: 1 },
      ult: { cn: '共鸣溢出', en: 'OVERFLOW', trigger: '蓄能 ≥ 8', effect: '下次爆响 · 穿透守护 · 蓄能不消耗', tagline: '极光不熄 · 频率永续' }
    }
  }
};

// === 池配置（per coser 1-2 个池） ===
const POOLS = {
  // 妍子：混池 + 卡提希娅限定
  'standard': {
    id: 'standard',
    coserId: 'yanzi',
    name: '妍子 · 共鸣池',
    subtitle: '常驻 · 全角色',
    description: '妍子的全部 cos 角色，每次共鸣随机降临',
    type: 'permanent',
    cost: 1,
    pityLimit: 60,
    softPityStart: 30,
    softPityRate: 8,
    rateUpCharId: null,
    rateUpFraction: 0
  },
  'limited': {
    id: 'limited',
    coserId: 'yanzi',
    name: '卡提希娅限定池',
    subtitle: '限定 UP',
    description: '限定 Memoria · 卡提希娅频率 UP！错过不再有',
    type: 'limited',
    cost: 1,
    pityLimit: 50,
    softPityStart: 30,
    softPityRate: 8,
    rateUpCharId: 'katixiya',
    rateUpFraction: 0.5,
    startDate: '2026-05-14',
    endDate: '2026-05-28'
  },
  // 小雨：1 个混池
  'xy-standard': {
    id: 'xy-standard',
    coserId: 'xiaoyu',
    name: '小雨 · 共鸣池',
    subtitle: '夏日呢喃',
    description: '小雨初次接入 Network，共鸣呼唤她的频率',
    type: 'permanent',
    cost: 1,
    pityLimit: 60,
    softPityStart: 30,
    softPityRate: 8,
    rateUpCharId: null,
    rateUpFraction: 0
  },
  // Aria：1 个混池
  'aria-standard': {
    id: 'aria-standard',
    coserId: 'aria',
    name: 'Aria · 极光池',
    subtitle: '虚拟 · 原创 IP',
    description: 'Aria 的极光频率，原创虚拟 Memoria',
    type: 'permanent',
    cost: 1,
    pityLimit: 60,
    softPityStart: 30,
    softPityRate: 8,
    rateUpCharId: null,
    rateUpFraction: 0
  }
};

// === Cos 角色卡数据（charId → 元数据 + images） ===
const COSER_CHARS = {
  // ===== 妍子 (yanzi) =====
  '2b': { id: '2b', coserId: 'yanzi', name: '2B', pool: 'standard', archetype: 'A',
    description: '《尼尔：机械纪元》人造人2B，冷静而强大的战斗机器',
    images: [
      { src: 'img/2B/DSC03676-5000.jpg', rarity: 'SSR' },
      { src: 'img/2B/DSC03715-5000.jpg', rarity: 'SSR' },
      { src: 'img/2B/DSC03741-5000.jpg', rarity: 'SR' },
      { src: 'img/2B/DSC03756-5000.jpg', rarity: 'SR' },
      { src: 'img/2B/DSC03767-5000.jpg', rarity: 'SR' },
      { src: 'img/2B/DSC03778-5000.jpg', rarity: 'SR' },
      { src: 'img/2B/DSC04172-5000.jpg', rarity: 'R' },
      { src: 'img/2B/DSC04179-5000.jpg', rarity: 'R' },
      { src: 'img/2B/DSC04205-5000.jpg', rarity: 'R' },
      { src: 'img/2B/DSC04206-5000.jpg', rarity: 'R' },
      { src: 'img/2B/DSC04209-5000.jpg', rarity: 'R' },
      { src: 'img/2B/DSC04216-5000.jpg', rarity: 'R' }
    ]
  },
  'raiden-shogun': { id: 'raiden-shogun', coserId: 'yanzi', name: '雷电将军·魅魔', pool: 'standard', archetype: 'A',
    description: '《原神》雷电将军的暗黑魅魔形态，掌控雷电之力',
    images: [
      { src: 'img/雷电将军魅魔/DSC_1905.jpg', rarity: 'SSR' },
      { src: 'img/雷电将军魅魔/DSC_1909.jpg', rarity: 'SSR' },
      { src: 'img/雷电将军魅魔/DSC_1949.jpg', rarity: 'SR' },
      { src: 'img/雷电将军魅魔/DSC_1950.jpg', rarity: 'SR' },
      { src: 'img/雷电将军魅魔/DSC_1955.jpg', rarity: 'SR' },
      { src: 'img/雷电将军魅魔/DSC_1959.jpg', rarity: 'SR' },
      { src: 'img/雷电将军魅魔/DSC_1966.jpg', rarity: 'R' },
      { src: 'img/雷电将军魅魔/DSC_1968.jpg', rarity: 'R' },
      { src: 'img/雷电将军魅魔/DSC_1971.jpg', rarity: 'R' },
      { src: 'img/雷电将军魅魔/DSC_1973.jpg', rarity: 'R' },
      { src: 'img/雷电将军魅魔/DSC_1979.jpg', rarity: 'R' },
      { src: 'img/雷电将军魅魔/DSC_1989.jpg', rarity: 'R' },
      { src: 'img/雷电将军魅魔/DSC_2015.jpg', rarity: 'R' }
    ]
  },
  'tifa': { id: 'tifa', coserId: 'yanzi', name: '蒂法', pool: 'standard', archetype: 'A',
    description: '《最终幻想7》格斗少女蒂法，温柔而坚韧',
    images: [
      { src: 'img/蒂法/1.jpg', rarity: 'SSR' },
      { src: 'img/蒂法/2.jpg', rarity: 'SR' },
      { src: 'img/蒂法/3.jpg', rarity: 'SR' },
      { src: 'img/蒂法/4.jpg', rarity: 'SR' },
      { src: 'img/蒂法/5.jpg', rarity: 'R' },
      { src: 'img/蒂法/6.jpg', rarity: 'R' },
      { src: 'img/蒂法/7.jpg', rarity: 'R' },
      { src: 'img/蒂法/8.jpg', rarity: 'R' },
      { src: 'img/蒂法/9.jpg', rarity: 'R' }
    ]
  },
  'albedo': { id: 'albedo', coserId: 'yanzi', name: '雅儿贝德', pool: 'standard', archetype: 'B',
    description: '《Overlord》纳萨力克大坟墓守护者总管，最高阶天使',
    images: [
      { src: 'img/雅儿贝德/DSC02143.jpg', rarity: 'SSR' },
      { src: 'img/雅儿贝德/DSC02159.jpg', rarity: 'SR' },
      { src: 'img/雅儿贝德/DSC02185.jpg', rarity: 'SR' },
      { src: 'img/雅儿贝德/DSC02186.jpg', rarity: 'SR' },
      { src: 'img/雅儿贝德/DSC02200.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02204.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02232.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02264.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02282.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02301.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02325.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02328.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02341.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02351.jpg', rarity: 'R' },
      { src: 'img/雅儿贝德/DSC02360.jpg', rarity: 'R' }
    ]
  },
  'haimeng': { id: 'haimeng', coserId: 'yanzi', name: '海梦·女警', pool: 'standard', archetype: 'B',
    description: '《青春猪头少年》樱岛麻衣女警造型，秩序与魅力',
    images: [
      { src: 'img/海梦女警/1.jpg', rarity: 'SSR' },
      { src: 'img/海梦女警/2.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/3.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/4.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/5.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/6.jpg', rarity: 'R' },
      { src: 'img/海梦女警/7.jpg', rarity: 'R' },
      { src: 'img/海梦女警/8.jpg', rarity: 'R' },
      { src: 'img/海梦女警/9.jpg', rarity: 'R' },
      { src: 'img/海梦女警/10.jpg', rarity: 'R' },
      { src: 'img/海梦女警/11.jpg', rarity: 'R' },
      { src: 'img/海梦女警/12.jpg', rarity: 'R' },
      { src: 'img/海梦女警/13.jpg', rarity: 'R' },
      { src: 'img/海梦女警/14.jpg', rarity: 'R' },
      { src: 'img/海梦女警/IMG_3543.jpg', rarity: 'R' }
    ]
  },
  'asuka': { id: 'asuka', coserId: 'yanzi', name: '明日香·战斗服', pool: 'standard', archetype: 'A',
    description: '《新世纪福音战士》明日香战斗服造型，骄傲而强大',
    images: [
      { src: 'img/明日香战斗服/1.jpg', rarity: 'SSR' },
      { src: 'img/明日香战斗服/2.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/3.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/4.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/5.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/6.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/7.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/8.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/9.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/10.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/11.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/12.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/13.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/14.jpg', rarity: 'R' }
    ]
  },
  '02-wedding': { id: '02-wedding', coserId: 'yanzi', name: '02·花嫁', pool: 'standard', archetype: 'C',
    description: '《DARLING in the FRANXX》02花嫁造型，誓约爱情',
    images: [
      { src: 'img/02花嫁/DSC04236-5000.jpg', rarity: 'SSR' },
      { src: 'img/02花嫁/DSC04247-5000.jpg', rarity: 'SSR' },
      { src: 'img/02花嫁/DSC04254-5000.jpg', rarity: 'SR' },
      { src: 'img/02花嫁/DSC04266-5000.jpg', rarity: 'SR' },
      { src: 'img/02花嫁/DSC04275-5000.jpg', rarity: 'SR' },
      { src: 'img/02花嫁/DSC04292-5000.jpg', rarity: 'SR' },
      { src: 'img/02花嫁/DSC04303-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04308-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04317-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04328-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04337-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04341-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04350-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04353-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04360-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04363-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04367-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04369-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04379-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04382-5000.jpg', rarity: 'R' },
      { src: 'img/02花嫁/DSC04395-5000.jpg', rarity: 'R' }
    ]
  },
  'qipao': { id: 'qipao', coserId: 'yanzi', name: '旗袍', pool: 'standard', archetype: 'B',
    description: '原创古典旗袍造型，东方韵味的极致演绎',
    images: [
      { src: 'img/w旗袍/4N7A6336.jpg', rarity: 'SSR' },
      { src: 'img/w旗袍/4N7A6337.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6351.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6360.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6361.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6419.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6430.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6442.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6460.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6510.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6537.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6547.jpg', rarity: 'R' },
      { src: 'img/w旗袍/4N7A6548.jpg', rarity: 'R' }
    ]
  },
  'kato': { id: 'kato', coserId: 'yanzi', name: '加藤惠·小礼服', pool: 'standard', archetype: 'B',
    description: '《路人女主的养成方法》加藤惠小礼服造型，邻家温柔',
    images: [
      { src: 'img/加藤惠小礼服/IMG_3188.jpg', rarity: 'SSR' },
      { src: 'img/加藤惠小礼服/IMG_3232.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3244.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3294.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3298.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3316.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3351.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3384.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3466.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3477.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3496.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3510.jpg', rarity: 'R' }
    ]
  },
  'zombie': { id: 'zombie', coserId: 'yanzi', name: '玉玲珑·僵尸', pool: 'standard', archetype: 'C',
    description: '暗黑系僵尸少女，诡异而迷人的东方美学',
    images: [
      { src: 'img/玉玲珑僵尸/DSC02929.jpg', rarity: 'SSR' },
      { src: 'img/玉玲珑僵尸/DSC02952.jpg', rarity: 'SR' },
      { src: 'img/玉玲珑僵尸/DSC02955.jpg', rarity: 'SR' },
      { src: 'img/玉玲珑僵尸/DSC02968.jpg', rarity: 'SR' },
      { src: 'img/玉玲珑僵尸/DSC02973.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC02993.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC03014.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC03018.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC03022.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC03025.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC03027.jpg', rarity: 'R' },
      { src: 'img/玉玲珑僵尸/DSC03034.jpg', rarity: 'R' }
    ]
  },
  'rei': { id: 'rei', coserId: 'yanzi', name: '绫波丽·校服', pool: 'standard', archetype: 'B',
    description: '《新世纪福音战士》绫波丽校服造型，清冷如月',
    images: [
      { src: 'img/绫波丽校服/1.jpg', rarity: 'SSR' },
      { src: 'img/绫波丽校服/2.jpg', rarity: 'SR' },
      { src: 'img/绫波丽校服/3.jpg', rarity: 'SR' },
      { src: 'img/绫波丽校服/4.jpg', rarity: 'R' },
      { src: 'img/绫波丽校服/5.jpg', rarity: 'R' },
      { src: 'img/绫波丽校服/6.jpg', rarity: 'R' },
      { src: 'img/绫波丽校服/7.jpg', rarity: 'R' },
      { src: 'img/绫波丽校服/8.jpg', rarity: 'R' },
      { src: 'img/绫波丽校服/9.jpg', rarity: 'R' }
    ]
  },
  'hutao': { id: 'hutao', coserId: 'yanzi', name: '胡桃·云樱天女', pool: 'standard', archetype: 'C',
    description: '《原神》胡桃云樱天女造型，灵动飘逸',
    images: [
      { src: 'img/胡桃云樱天女/2025-12-11 233855.jpg', rarity: 'SSR' },
      { src: 'img/胡桃云樱天女/2025-12-11 233859.jpg', rarity: 'SR' },
      { src: 'img/胡桃云樱天女/2025-12-11 233903.jpg', rarity: 'SR' },
      { src: 'img/胡桃云樱天女/2025-12-11 233911.jpg', rarity: 'R' },
      { src: 'img/胡桃云樱天女/2025-12-11 233915.jpg', rarity: 'R' },
      { src: 'img/胡桃云樱天女/2025-12-11 233918.jpg', rarity: 'R' },
      { src: 'img/胡桃云樱天女/2025-12-11 233921.jpg', rarity: 'R' },
      { src: 'img/胡桃云樱天女/2025-12-11 235105.jpg', rarity: 'R' },
      { src: 'img/胡桃云樱天女/2025-12-11 235110.jpg', rarity: 'R' }
    ]
  },
  'garden-snow': { id: 'garden-snow', coserId: 'yanzi', name: '花园白雪之仪', pool: 'standard', archetype: 'C',
    description: '纯白花园中的雪之公主，优雅与纯洁的化身',
    images: [
      { src: 'img/花园白雪之仪/1.jpg', rarity: 'SSR' },
      { src: 'img/花园白雪之仪/2.jpg', rarity: 'SR' },
      { src: 'img/花园白雪之仪/3.jpg', rarity: 'SR' },
      { src: 'img/花园白雪之仪/4.jpg', rarity: 'R' },
      { src: 'img/花园白雪之仪/5.jpg', rarity: 'R' },
      { src: 'img/花园白雪之仪/6.jpg', rarity: 'R' },
      { src: 'img/花园白雪之仪/7.jpg', rarity: 'R' },
      { src: 'img/花园白雪之仪/8.jpg', rarity: 'R' },
      { src: 'img/花园白雪之仪/9.jpg', rarity: 'R' },
      { src: 'img/花园白雪之仪/10.jpg', rarity: 'R' }
    ]
  },
  'katixiya': { id: 'katixiya', coserId: 'yanzi', name: '卡提希娅', pool: 'limited', archetype: 'C',
    description: '限定 Memoria · 卡提希娅，神秘优雅的异世界少女',
    images: [
      { src: 'img/卡提希娅/DSC_8497.jpg', rarity: 'SSR' },
      { src: 'img/卡提希娅/DSC_8498.jpg', rarity: 'SSR' },
      { src: 'img/卡提希娅/DSC_8500.jpg', rarity: 'SR' },
      { src: 'img/卡提希娅/DSC_8501.jpg', rarity: 'SR' },
      { src: 'img/卡提希娅/DSC_8504.jpg', rarity: 'SR' },
      { src: 'img/卡提希娅/DSC_8505.jpg', rarity: 'SR' },
      { src: 'img/卡提希娅/DSC_8506.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8508.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8510.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8518.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8522.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8529.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8532.jpg', rarity: 'R' },
      { src: 'img/卡提希娅/DSC_8543.jpg', rarity: 'R' }
    ]
  },

  // ===== 小雨 (xiaoyu) =====
  'xy-summer': { id: 'xy-summer', coserId: 'xiaoyu', name: '夏日呢喃', pool: 'xy-standard', archetype: 'B',
    description: '夏日午后的温柔时刻，治愈系日常少女',
    images: [
      { src: 'img/小雨/xy-1.jpg', rarity: 'SSR' },
      { src: 'img/小雨/xy-2.jpg', rarity: 'SR' },
      { src: 'img/小雨/xy-3.jpg', rarity: 'SR' },
      { src: 'img/小雨/xy-4.jpg', rarity: 'R' },
      { src: 'img/小雨/xy-5.jpg', rarity: 'R' },
      { src: 'img/小雨/xy-6.jpg', rarity: 'R' },
      { src: 'img/小雨/xy-7.jpg', rarity: 'R' }
    ]
  },

  // ===== Aria (aria) — 虚拟原创 IP =====
  'aria-aurora': { id: 'aria-aurora', coserId: 'aria', name: '极光初鸣', pool: 'aria-standard', archetype: 'C',
    description: '虚拟 Memoria 极光少女的首次频率显形',
    images: [
      { src: 'spec/assets/virtual/aria/v1.jpg', rarity: 'SSR' },
      { src: 'spec/assets/virtual/aria/v2.jpg', rarity: 'SR' },
      { src: 'spec/assets/virtual/aria/v3.jpg', rarity: 'R' },
      { src: 'spec/assets/virtual/aria/v4.jpg', rarity: 'R' }
    ]
  }
};

// === Helpers ===

// 获取某 coser 的所有 cos id
function getCharsByCoser(coserId) {
  return Object.values(COSER_CHARS).filter(c => c.coserId === coserId);
}

// 获取某 coser 的池列表
function getPoolsByCoser(coserId) {
  return Object.values(POOLS).filter(p => p.coserId === coserId);
}

// 获取某池的角色列表
function getCharsByPool(poolId) {
  return Object.values(COSER_CHARS).filter(c => c.pool === poolId);
}

// 获取某池指定稀有度的所有卡牌（拍平 images）
function getCardsByRarityInPool(rarity, poolId) {
  const chars = getCharsByPool(poolId);
  const cards = [];
  chars.forEach(c => {
    c.images.forEach((img, idx) => {
      if (img.rarity === rarity) {
        cards.push({
          uid: `${c.id}_${idx}`,
          characterId: c.id,
          characterName: c.name,
          coserId: c.coserId,
          description: c.description,
          imageIndex: idx,
          src: img.src,
          rarity: img.rarity
        });
      }
    });
  });
  return cards;
}

// 角色完整卡列表
function getCardsByCharacter(charId) {
  const c = COSER_CHARS[charId];
  if (!c) return [];
  return c.images.map((img, idx) => ({
    uid: `${c.id}_${idx}`,
    characterId: c.id,
    characterName: c.name,
    coserId: c.coserId,
    description: c.description,
    imageIndex: idx,
    src: img.src,
    rarity: img.rarity
  }));
}

function getCharacterById(charId) {
  return COSER_CHARS[charId];
}

// 取角色封面缩略图：第一张 SSR 优先，否则第一张
function getCharacterThumb(charId) {
  const c = COSER_CHARS[charId];
  if (!c) return '';
  const ssr = c.images.find(i => i.rarity === 'SSR');
  return (ssr || c.images[0]).src;
}

// 角色 archetype（A/B/C）
function getBattleProfile(charId) {
  const c = COSER_CHARS[charId];
  if (!c) return null;
  return { letter: c.archetype };
}

// 取该 coser 当期主推 archetype（用于"该 Memoria 频率战出战型"）
function getCoserArchetype(coserId) {
  return COSERS[coserId]?.archetype || null;
}

// 全部 coser 列表
function listCosers() {
  return Object.values(COSERS);
}

// 兼容旧代码（保留导出别名）
const CHARACTERS = Object.values(COSER_CHARS); // 旧的 CHARACTERS 数组
const POOL_CONFIG = POOLS;                      // 旧的 POOL_CONFIG
const BATTLE_PROFILES = Object.fromEntries(
  Object.values(COSER_CHARS).map(c => [c.id, { letter: c.archetype, archetype: ['STRIKE','REFLECT','OVERFLOW'][{A:0,B:1,C:2}[c.archetype]] }])
);
const COSER_PROFILE = COSERS.yanzi; // 兼容
