// 角色卡牌数据配置
const CHARACTERS = [
  // ===== SSR 稀有度 =====
  {
    id: '2b',
    name: '2B',
    rarity: 'SSR',
    description: '《尼尔：机械纪元》人造人2B，冷静而强大的战斗机器',
    images: [
      'img/2B/DSC03676-5000.jpg','img/2B/DSC03715-5000.jpg','img/2B/DSC03741-5000.jpg',
      'img/2B/DSC03756-5000.jpg','img/2B/DSC03767-5000.jpg','img/2B/DSC03778-5000.jpg',
      'img/2B/DSC04172-5000.jpg','img/2B/DSC04179-5000.jpg','img/2B/DSC04205-5000.jpg',
      'img/2B/DSC04206-5000.jpg','img/2B/DSC04209-5000.jpg','img/2B/DSC04216-5000.jpg'
    ]
  },
  {
    id: 'raiden-shogun',
    name: '雷电将军·魅魔',
    rarity: 'SSR',
    description: '《原神》雷电将军的暗黑魅魔形态，掌控雷电之力',
    images: [
      'img/雷电将军魅魔/DSC_1905.jpg','img/雷电将军魅魔/DSC_1909.jpg','img/雷电将军魅魔/DSC_1949.jpg',
      'img/雷电将军魅魔/DSC_1950.jpg','img/雷电将军魅魔/DSC_1955.jpg','img/雷电将军魅魔/DSC_1959.jpg',
      'img/雷电将军魅魔/DSC_1966.jpg','img/雷电将军魅魔/DSC_1968.jpg','img/雷电将军魅魔/DSC_1971.jpg',
      'img/雷电将军魅魔/DSC_1973.jpg','img/雷电将军魅魔/DSC_1979.jpg','img/雷电将军魅魔/DSC_1989.jpg',
      'img/雷电将军魅魔/DSC_2015.jpg'
    ]
  },

  // ===== SR 稀有度 =====
  {
    id: 'tifa',
    name: '蒂法',
    rarity: 'SR',
    description: '《最终幻想7》格斗少女蒂法，温柔而坚韧',
    images: [
      'img/蒂法/1.jpg','img/蒂法/2.jpg','img/蒂法/3.jpg','img/蒂法/4.jpg','img/蒂法/5.jpg',
      'img/蒂法/6.jpg','img/蒂法/7.jpg','img/蒂法/8.jpg','img/蒂法/9.jpg'
    ]
  },
  {
    id: 'albedo',
    name: '雅儿贝德',
    rarity: 'SR',
    description: '《Overlord》纳萨力克大坟墓守护者总管，最高阶天使',
    images: [
      'img/雅儿贝德/DSC02143.jpg','img/雅儿贝德/DSC02159.jpg','img/雅儿贝德/DSC02185.jpg',
      'img/雅儿贝德/DSC02186.jpg','img/雅儿贝德/DSC02200.jpg','img/雅儿贝德/DSC02204.jpg',
      'img/雅儿贝德/DSC02232.jpg','img/雅儿贝德/DSC02264.jpg','img/雅儿贝德/DSC02282.jpg',
      'img/雅儿贝德/DSC02301.jpg','img/雅儿贝德/DSC02325.jpg','img/雅儿贝德/DSC02328.jpg',
      'img/雅儿贝德/DSC02341.jpg','img/雅儿贝德/DSC02351.jpg','img/雅儿贝德/DSC02360.jpg'
    ]
  },
  {
    id: 'haimeng',
    name: '海梦·女警',
    rarity: 'SR',
    description: '《更衣人偶坠入爱河》海梦cos女警造型，飒爽英姿',
    images: [
      'img/海梦女警/1.jpg','img/海梦女警/2.jpg','img/海梦女警/3.jpg','img/海梦女警/4.jpg',
      'img/海梦女警/5.jpg','img/海梦女警/6.jpg','img/海梦女警/7.jpg','img/海梦女警/8.jpg',
      'img/海梦女警/9.jpg','img/海梦女警/10.jpg','img/海梦女警/11.jpg','img/海梦女警/12.jpg',
      'img/海梦女警/13.jpg','img/海梦女警/14.jpg','img/海梦女警/IMG_3543.jpg'
    ]
  },
  {
    id: 'asuka',
    name: '明日香·战斗服',
    rarity: 'SR',
    description: '《新世纪福音战士》明日香战斗服形态，傲娇战士',
    images: [
      'img/明日香战斗服/1.jpg','img/明日香战斗服/2.jpg','img/明日香战斗服/3.jpg',
      'img/明日香战斗服/4.jpg','img/明日香战斗服/5.jpg','img/明日香战斗服/6.jpg',
      'img/明日香战斗服/7.jpg','img/明日香战斗服/8.jpg','img/明日香战斗服/9.jpg',
      'img/明日香战斗服/10.jpg','img/明日香战斗服/11.jpg','img/明日香战斗服/12.jpg'
    ]
  },

  // ===== R 普通稀有度 =====
  {
    id: '02-wedding',
    name: '02·花嫁',
    rarity: 'R',
    description: '《DARLING in the FRANXX》02花嫁婚纱形态，最美的新娘',
    images: [
      'img/02花嫁/DSC04236-5000.jpg','img/02花嫁/DSC04247-5000.jpg','img/02花嫁/DSC04254-5000.jpg',
      'img/02花嫁/DSC04266-5000.jpg','img/02花嫁/DSC04275-5000.jpg','img/02花嫁/DSC04292-5000.jpg',
      'img/02花嫁/DSC04303-5000.jpg','img/02花嫁/DSC04308-5000.jpg','img/02花嫁/DSC04317-5000.jpg',
      'img/02花嫁/DSC04328-5000.jpg','img/02花嫁/DSC04337-5000.jpg','img/02花嫁/DSC04341-5000.jpg',
      'img/02花嫁/DSC04350-5000.jpg','img/02花嫁/DSC04353-5000.jpg','img/02花嫁/DSC04360-5000.jpg',
      'img/02花嫁/DSC04363-5000.jpg','img/02花嫁/DSC04367-5000.jpg','img/02花嫁/DSC04369-5000.jpg',
      'img/02花嫁/DSC04379-5000.jpg','img/02花嫁/DSC04382-5000.jpg','img/02花嫁/DSC04395-5000.jpg'
    ]
  },
  {
    id: 'qipao',
    name: '旗袍',
    rarity: 'R',
    description: '典雅旗袍造型，东方韵味十足',
    images: [
      'img/w旗袍/4N7A6336.jpg','img/w旗袍/4N7A6337.jpg','img/w旗袍/4N7A6351.jpg',
      'img/w旗袍/4N7A6360.jpg','img/w旗袍/4N7A6361.jpg','img/w旗袍/4N7A6419.jpg',
      'img/w旗袍/4N7A6430.jpg','img/w旗袍/4N7A6442.jpg','img/w旗袍/4N7A6460.jpg',
      'img/w旗袍/4N7A6510.jpg','img/w旗袍/4N7A6537.jpg','img/w旗袍/4N7A6547.jpg',
      'img/w旗袍/4N7A6548.jpg'
    ]
  },
  {
    id: 'kato',
    name: '加藤惠·小礼服',
    rarity: 'R',
    description: '《路人女主的养成方法》加藤惠小礼服造型，温柔可人',
    images: [
      'img/加藤惠小礼服/IMG_3188.jpg','img/加藤惠小礼服/IMG_3232.jpg','img/加藤惠小礼服/IMG_3244.jpg',
      'img/加藤惠小礼服/IMG_3294.jpg','img/加藤惠小礼服/IMG_3298.jpg','img/加藤惠小礼服/IMG_3316.jpg',
      'img/加藤惠小礼服/IMG_3351.jpg','img/加藤惠小礼服/IMG_3384.jpg','img/加藤惠小礼服/IMG_3466.jpg',
      'img/加藤惠小礼服/IMG_3477.jpg','img/加藤惠小礼服/IMG_3496.jpg','img/加藤惠小礼服/IMG_3510.jpg'
    ]
  },
  {
    id: 'guitar',
    name: '吉他妹妹',
    rarity: 'R',
    description: '元气满满的吉他少女，音乐与美的结合',
    images: [
      'img/吉他妹妹/1.JPG','img/吉他妹妹/2.JPG','img/吉他妹妹/3.JPG','img/吉他妹妹/4.JPG',
      'img/吉他妹妹/5.JPG','img/吉他妹妹/6.JPG','img/吉他妹妹/7.JPG','img/吉他妹妹/8.JPG',
      'img/吉他妹妹/9.JPG','img/吉他妹妹/10.JPG','img/吉他妹妹/11.JPG','img/吉他妹妹/12.JPG',
      'img/吉他妹妹/13.JPG','img/吉他妹妹/14.JPG','img/吉他妹妹/15.JPG','img/吉他妹妹/16.JPG',
      'img/吉他妹妹/17.JPG','img/吉他妹妹/18.JPG'
    ]
  },
  {
    id: 'bunny',
    name: '喜多川兔女郎',
    rarity: 'R',
    description: '《青春猪头少年》喜多川海梦兔女郎造型，可爱与性感并存',
    images: [
      'img/喜多川兔女郎/1.jpg','img/喜多川兔女郎/2.jpg','img/喜多川兔女郎/3.jpg',
      'img/喜多川兔女郎/4.jpg','img/喜多川兔女郎/5.jpg','img/喜多川兔女郎/6.jpg',
      'img/喜多川兔女郎/7.jpg','img/喜多川兔女郎/8.jpg','img/喜多川兔女郎/9.jpg',
      'img/喜多川兔女郎/10.jpg','img/喜多川兔女郎/11.jpg','img/喜多川兔女郎/12.jpg',
      'img/喜多川兔女郎/13.jpg'
    ]
  },
  {
    id: 'zombie',
    name: '玉玲珑·僵尸',
    rarity: 'R',
    description: '暗黑系僵尸少女，诡异而迷人的东方美学',
    images: [
      'img/玉玲珑僵尸/DSC02929.jpg','img/玉玲珑僵尸/DSC02952.jpg','img/玉玲珑僵尸/DSC02955.jpg',
      'img/玉玲珑僵尸/DSC02968.jpg','img/玉玲珑僵尸/DSC02973.jpg','img/玉玲珑僵尸/DSC02993.jpg',
      'img/玉玲珑僵尸/DSC03014.jpg','img/玉玲珑僵尸/DSC03018.jpg','img/玉玲珑僵尸/DSC03022.jpg',
      'img/玉玲珑僵尸/DSC03025.jpg','img/玉玲珑僵尸/DSC03027.jpg','img/玉玲珑僵尸/DSC03034.jpg'
    ]
  },
  {
    id: 'rei',
    name: '绫波丽·校服',
    rarity: 'R',
    description: '《新世纪福音战士》绫波丽校服造型，清冷如月',
    images: [
      'img/绫波丽校服/1.jpg','img/绫波丽校服/2.jpg','img/绫波丽校服/3.jpg','img/绫波丽校服/4.jpg',
      'img/绫波丽校服/5.jpg','img/绫波丽校服/6.jpg','img/绫波丽校服/7.jpg','img/绫波丽校服/8.jpg',
      'img/绫波丽校服/9.jpg'
    ]
  },
  {
    id: 'hutao',
    name: '胡桃·云樱天女',
    rarity: 'R',
    description: '《原神》胡桃云樱天女造型，灵动飘逸',
    images: [
      'img/胡桃云樱天女/2025-12-11 233855.jpg','img/胡桃云樱天女/2025-12-11 233859.jpg',
      'img/胡桃云樱天女/2025-12-11 233903.jpg','img/胡桃云樱天女/2025-12-11 233911.jpg',
      'img/胡桃云樱天女/2025-12-11 233915.jpg','img/胡桃云樱天女/2025-12-11 233918.jpg',
      'img/胡桃云樱天女/2025-12-11 233921.jpg','img/胡桃云樱天女/2025-12-11 235105.jpg',
      'img/胡桃云樱天女/2025-12-11 235110.jpg'
    ]
  },
  {
    id: 'garden-snow',
    name: '花园白雪之仪',
    rarity: 'R',
    description: '纯白花园中的雪之公主，优雅与纯洁的化身',
    images: [
      'img/花园白雪之仪/1.jpg','img/花园白雪之仪/2.jpg','img/花园白雪之仪/3.jpg',
      'img/花园白雪之仪/4.jpg','img/花园白雪之仪/5.jpg','img/花园白雪之仪/6.jpg',
      'img/花园白雪之仪/7.jpg','img/花园白雪之仪/8.jpg','img/花园白雪之仪/9.jpg',
      'img/花园白雪之仪/10.jpg'
    ]
  }
];

// 稀有度配置
const RARITY_CONFIG = {
  SSR: { color: '#FFD700', glow: 'rgba(255,215,0,0.6)', label: 'SSR', prob: 3, coinValue: 50 },
  SR:  { color: '#C066FF', glow: 'rgba(192,102,255,0.5)', label: 'SR',  prob: 15, coinValue: 20 },
  R:   { color: '#4FC3F7', glow: 'rgba(79,195,247,0.4)', label: 'R',   prob: 82, coinValue: 5 }
};

// 按稀有度分组
function getCharactersByRarity(rarity) {
  return CHARACTERS.filter(c => c.rarity === rarity);
}

// 根据ID获取角色
function getCharacterById(id) {
  return CHARACTERS.find(c => c.id === id);
}
