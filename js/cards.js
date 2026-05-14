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
  },
  {
    id: 'katixiya',
    name: '卡提希娅',
    description: '限定UP角色·卡提希娅，神秘优雅的异世界少女',
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
  {
    id: 'bunny-02',
    name: '02·兔女郎',
    description: '《DARLING in the FRANXX》02兔女郎造型，魅惑与可爱并存',
    images: [
      { src: 'img/兔女郎合集/02兔女郎/2J0A7957.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7959.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7963.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7966.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7977.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7979.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7981.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A7995.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8001.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8004.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8007.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8010.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8019.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8022.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8023.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/02兔女郎/2J0A8031.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-miku',
    name: '初音·兔女郎',
    description: '初音未来兔女郎造型，电音女王的性感演绎',
    images: [
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7403.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7404.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7407.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7414.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7416.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7418.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7421.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7426.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7427.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7428.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7432.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7434.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7441.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/初音兔女郎/2J0A7442.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-kato',
    name: '加藤惠·兔女郎',
    description: '《路人女主的养成方法》加藤惠兔女郎造型，低调的魅惑',
    images: [
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7786.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7789.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7791.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7792.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7798.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7799.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7802.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7803.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7804.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7817.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7819.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7820.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7823.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7824.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7842.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/加藤惠兔女郎/2J0A7844.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-scathach',
    name: '斯卡哈·兔女郎',
    description: '《Fate/Grand Order》斯卡哈兔女郎造型，影之女王的魅影',
    images: [
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7870.JPG', rarity: 'SSR' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7871.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7874.JPG', rarity: 'SR' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7878.JPG', rarity: 'SR' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7880.JPG', rarity: 'SR' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7886.JPG', rarity: 'SR' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7894.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7900.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7904.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7906.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7909.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7910.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7913.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7915.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7921.JPG', rarity: 'R' },
      { src: 'img/兔女郎合集/斯卡哈兔女郎/2J0A7927.JPG', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-atago',
    name: '爱宕·兔女郎',
    description: '《碧蓝航线》爱宕兔女郎造型，温柔姐姐的甜蜜诱惑',
    images: [
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0444.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0457.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0479.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0486.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0489.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0496.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0508.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0521.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0524.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0531.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/爱宕兔女郎/3YSY0543.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-shinobu',
    name: '蝴蝶忍·兔女郎',
    description: '《鬼灭之刃》蝴蝶忍兔女郎造型，温柔中藏着致命毒刃',
    images: [
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7452.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7457.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7458.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7466.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7473.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7475.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7476.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7477.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7479.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7480.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7482.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7483.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7491.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7494.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7495.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/蝴蝶忍兔女郎/2J0A7498.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-ahri',
    name: '阿狸·兔女郎',
    description: '《英雄联盟》阿狸兔女郎造型，九尾妖狐的魅惑之夜',
    images: [
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7542.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7543.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7545.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7549.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7551.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7553.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7554.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7564.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7567.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7570.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7572.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7574.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7588.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7589.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7590.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7591.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7593.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7599.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7602.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/阿狸兔女郎/2J0A7603.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-mai',
    name: '麻衣·兔女郎',
    description: '《青春猪头少年》樱岛麻衣兔女郎造型，学姐的经典魅力',
    images: [
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7710.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7712.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7713.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7715.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7721.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7725.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7729.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7731.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7733.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7735.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7736.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7738.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7742.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7755.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7761.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/麻衣兔女郎/2J0A7766.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
  },
  {
    id: 'bunny-lancer',
    name: '黑枪呆·兔女郎',
    description: '《Fate》阿尔托莉雅·潘德拉贡兔女郎造型，王者的午夜盛宴',
    images: [
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7511.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7512.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7513.jpg', rarity: 'SSR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7516.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7517.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7524.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7615.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7618.jpg', rarity: 'SR' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7621 (1).jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7621 (2).jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7623.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7629.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7632.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7634.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7641.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7643.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7647.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7651.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7662.jpg', rarity: 'R' },
      { src: 'img/兔女郎合集/黑枪呆兔女郎/2J0A7663.jpg', rarity: 'R' }
    ],
    pool: 'bunny'
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

// 获取属于某个卡池的角色
function getCharactersByPool(poolId) {
  if (poolId === 'standard') return CHARACTERS.filter(c => !c.pool);
  return CHARACTERS.filter(c => c.pool === poolId);
}

// 从指定卡池获取指定稀有度的卡牌
function getCardsByRarityInPool(rarity, poolId) {
  const chars = getCharactersByPool(poolId);
  const cards = [];
  chars.forEach(char => {
    char.images.forEach((img, idx) => {
      if (img.rarity === rarity) {
        cards.push({
          characterId: char.id,
          characterName: char.name,
          description: char.description,
          imageIndex: idx,
          src: img.src,
          rarity: img.rarity,
          uid: `${char.id}_${idx}`
        });
      }
    });
  });
  return cards;
}

// 卡池配置
const POOL_CONFIG = {
  standard: {
    id: 'standard',
    name: '混池',
    subtitle: '常驻卡池',
    description: '包含所有常驻角色，经典永不落幕',
    type: 'permanent',
    cost: 1,
    pityLimit: 90,
    softPityStart: 60,
    softPityRate: 6,
    rateUpCharId: null,
    rateUpFraction: 0,
    bgImage: null
  },
  limited: {
    id: 'limited',
    name: '卡提希娅限定池',
    subtitle: '限时UP',
    description: '限定角色卡提希娅概率UP！错过不再有',
    type: 'limited',
    cost: 1,
    pityLimit: 80,
    softPityStart: 50,
    softPityRate: 7,
    rateUpCharId: 'katixiya',
    rateUpFraction: 0.5,
    bgImage: 'img/卡提希娅/DSC_8497.jpg',
    startDate: '2026-05-14',
    endDate: '2026-05-28'
  },
  bunny: {
    id: 'bunny',
    name: '兔女郎池',
    subtitle: '常驻·轮换UP',
    description: '兔女郎系列专属卡池，每期轮换UP角色',
    type: 'permanent',
    cost: 1,
    pityLimit: 90,
    softPityStart: 60,
    softPityRate: 6,
    rateUpCharId: 'bunny-mai',
    rateUpFraction: 2/3,
    bgImage: null,
    rotationOrder: ['bunny-mai', 'bunny-ahri', 'bunny-shinobu', 'bunny-scathach', 'bunny-kato', 'bunny-miku', 'bunny-02', 'bunny-atago', 'bunny-lancer']
  }
};
