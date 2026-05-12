// 角色卡牌数据配置 - 每张卡独立稀有度
const CHARACTERS = [
  {
    id: '2b',
    name: '2B',
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
  {
    id: 'raiden-shogun',
    name: '雷电将军·魅魔',
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
  {
    id: 'tifa',
    name: '蒂法',
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
  {
    id: 'albedo',
    name: '雅儿贝德',
    description: '《Overlord》纳萨力克大坟墓守护者总管，最高阶天使',
    images: [
      { src: 'img/雅儿贝德/DSC02143.jpg', rarity: 'SSR' },
      { src: 'img/雅儿贝德/DSC02159.jpg', rarity: 'SSR' },
      { src: 'img/雅儿贝德/DSC02185.jpg', rarity: 'SR' },
      { src: 'img/雅儿贝德/DSC02186.jpg', rarity: 'SR' },
      { src: 'img/雅儿贝德/DSC02200.jpg', rarity: 'SR' },
      { src: 'img/雅儿贝德/DSC02204.jpg', rarity: 'SR' },
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
  {
    id: 'haimeng',
    name: '海梦·女警',
    description: '《更衣人偶坠入爱河》海梦cos女警造型，飒爽英姿',
    images: [
      { src: 'img/海梦女警/1.jpg', rarity: 'SSR' },
      { src: 'img/海梦女警/2.jpg', rarity: 'SSR' },
      { src: 'img/海梦女警/3.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/4.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/5.jpg', rarity: 'SR' },
      { src: 'img/海梦女警/6.jpg', rarity: 'SR' },
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
  {
    id: 'asuka',
    name: '明日香·战斗服',
    description: '《新世纪福音战士》明日香战斗服形态，傲娇战士',
    images: [
      { src: 'img/明日香战斗服/1.jpg', rarity: 'SSR' },
      { src: 'img/明日香战斗服/2.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/3.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/4.jpg', rarity: 'SR' },
      { src: 'img/明日香战斗服/5.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/6.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/7.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/8.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/9.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/10.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/11.jpg', rarity: 'R' },
      { src: 'img/明日香战斗服/12.jpg', rarity: 'R' }
    ]
  },
  {
    id: '02-wedding',
    name: '02·花嫁',
    description: '《DARLING in the FRANXX》02花嫁婚纱形态，最美的新娘',
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
  {
    id: 'qipao',
    name: '旗袍',
    description: '典雅旗袍造型，东方韵味十足',
    images: [
      { src: 'img/w旗袍/4N7A6336.jpg', rarity: 'SSR' },
      { src: 'img/w旗袍/4N7A6337.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6351.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6360.jpg', rarity: 'SR' },
      { src: 'img/w旗袍/4N7A6361.jpg', rarity: 'R' },
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
  {
    id: 'kato',
    name: '加藤惠·小礼服',
    description: '《路人女主的养成方法》加藤惠小礼服造型，温柔可人',
    images: [
      { src: 'img/加藤惠小礼服/IMG_3188.jpg', rarity: 'SSR' },
      { src: 'img/加藤惠小礼服/IMG_3232.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3244.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3294.jpg', rarity: 'SR' },
      { src: 'img/加藤惠小礼服/IMG_3298.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3316.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3351.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3384.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3466.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3477.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3496.jpg', rarity: 'R' },
      { src: 'img/加藤惠小礼服/IMG_3510.jpg', rarity: 'R' }
    ]
  },
  {
    id: 'guitar',
    name: '吉他妹妹',
    description: '元气满满的吉他少女，音乐与美的结合',
    images: [
      { src: 'img/吉他妹妹/1.JPG', rarity: 'SSR' },
      { src: 'img/吉他妹妹/2.JPG', rarity: 'SSR' },
      { src: 'img/吉他妹妹/3.JPG', rarity: 'SR' },
      { src: 'img/吉他妹妹/4.JPG', rarity: 'SR' },
      { src: 'img/吉他妹妹/5.JPG', rarity: 'SR' },
      { src: 'img/吉他妹妹/6.JPG', rarity: 'SR' },
      { src: 'img/吉他妹妹/7.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/8.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/9.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/10.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/11.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/12.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/13.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/14.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/15.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/16.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/17.JPG', rarity: 'R' },
      { src: 'img/吉他妹妹/18.JPG', rarity: 'R' }
    ]
  },
  {
    id: 'bunny',
    name: '喜多川兔女郎',
    description: '《青春猪头少年》喜多川海梦兔女郎造型，可爱与性感并存',
    images: [
      { src: 'img/喜多川兔女郎/1.jpg', rarity: 'SSR' },
      { src: 'img/喜多川兔女郎/2.jpg', rarity: 'SR' },
      { src: 'img/喜多川兔女郎/3.jpg', rarity: 'SR' },
      { src: 'img/喜多川兔女郎/4.jpg', rarity: 'SR' },
      { src: 'img/喜多川兔女郎/5.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/6.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/7.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/8.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/9.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/10.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/11.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/12.jpg', rarity: 'R' },
      { src: 'img/喜多川兔女郎/13.jpg', rarity: 'R' }
    ]
  },
  {
    id: 'zombie',
    name: '玉玲珑·僵尸',
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
  {
    id: 'rei',
    name: '绫波丽·校服',
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
  {
    id: 'hutao',
    name: '胡桃·云樱天女',
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
  {
    id: 'garden-snow',
    name: '花园白雪之仪',
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
  }
];

// 稀有度配置（甜美少女风配色）
const RARITY_CONFIG = {
  SSR: { color: '#FFD700', glow: 'rgba(255,215,0,0.5)', label: 'SSR', prob: 3, coinValue: 50, gradient: 'linear-gradient(135deg, #FFD700, #FFA500)' },
  SR:  { color: '#E8A0BF', glow: 'rgba(232,160,191,0.5)', label: 'SR',  prob: 15, coinValue: 20, gradient: 'linear-gradient(135deg, #E8A0BF, #C066FF)' },
  R:   { color: '#89CFF0', glow: 'rgba(137,207,240,0.4)', label: 'R',   prob: 82, coinValue: 5, gradient: 'linear-gradient(135deg, #89CFF0, #A0D2DB)' }
};

// 获取所有卡牌（扁平化，每张图片是一个独立卡牌）
function getAllCards() {
  const cards = [];
  CHARACTERS.forEach(char => {
    char.images.forEach((img, idx) => {
      cards.push({
        characterId: char.id,
        characterName: char.name,
        description: char.description,
        imageIndex: idx,
        src: img.src,
        rarity: img.rarity,
        uid: `${char.id}_${idx}`
      });
    });
  });
  return cards;
}

// 按稀有度获取卡牌池
function getCardsByRarity(rarity) {
  return getAllCards().filter(c => c.rarity === rarity);
}

// 获取角色的所有卡牌
function getCardsByCharacter(charId) {
  return getAllCards().filter(c => c.characterId === charId);
}

// 根据ID获取角色
function getCharacterById(id) {
  return CHARACTERS.find(c => c.id === id);
}

// 获取角色的缩略图（第一张SSR，没有则第一张）
function getCharacterThumb(charId) {
  const char = getCharacterById(charId);
  if (!char) return '';
  const ssr = char.images.find(i => i.rarity === 'SSR');
  return (ssr || char.images[0]).src;
}
