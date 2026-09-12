/**
 * 癒見幸福 · 魔法占星學院
 * 撲克命牌系統 (Destiny Cards / Cardology 生命之書神聖牌陣演算法引擎)
 * 涵蓋本命牌 (Birth Card)、星座行星統治牌、業力牌 (Karma Cards)、52天行星週期與年度牌陣
 */

const CARD_SUITS = {
  'H': { name: 'Hearts', zh: '紅心', symbol: '♥', color: '#dc2626', element: '水 (情感 / 愛戀 / 人際)', season: '春' },
  'C': { name: 'Clubs', zh: '梅花', symbol: '♣', color: '#1e293b', element: '風/火 (心智 / 學習 / 智慧)', season: '夏' },
  'D': { name: 'Diamonds', zh: '方塊', symbol: '♦', color: '#d97706', element: '土 (價值 / 財富 / 實踐)', season: '秋' },
  'S': { name: 'Spades', zh: '黑桃', symbol: '♠', color: '#0f172a', element: '以太/靈性 (意志 / 靈性 / 終極考驗)', season: '冬' },
  'JOKER': { name: 'Joker', zh: '小丑牌', symbol: '🃏', color: '#9333ea', element: '全知原初 (無限可能)', season: '神聖閏日' }
};

const CARD_RANKS = {
  'A': { val: 1, name: 'Ace', zh: 'A (創始 / 欲望)' },
  '2': { val: 2, name: '2', zh: '2 (連結 / 合作)' },
  '3': { val: 3, name: '3', zh: '3 (表達 / 創造)' },
  '4': { val: 4, name: '4', zh: '4 (穩固 / 基石)' },
  '5': { val: 5, name: '5', zh: '5 (自由 / 冒險)' },
  '6': { val: 6, name: '6', zh: '6 (調和 / 責任)' },
  '7': { val: 7, name: '7', zh: '7 (靈性 / 信仰)' },
  '8': { val: 8, name: '8', zh: '8 (力量 / 掌控)' },
  '9': { val: 9, name: '9', zh: '9 (圓滿 / 奉獻)' },
  '10': { val: 10, name: '10', zh: '10 (成功 / 頂峰)' },
  'J': { val: 11, name: 'Jack', zh: 'J (年輕領袖 / 創造者)' },
  'Q': { val: 12, name: 'Queen', zh: 'Q (滋養女王 / 直覺守護)' },
  'K': { val: 13, name: 'King', zh: 'K (智慧之王 / 終極統御)' }
};

// 解析牌代碼 (如 10S, KH, AC, 2D)
function parseCardCode(code) {
  if (!code || code === 'JOKER') {
    return {
      code: 'JOKER',
      rank: 'Joker',
      suit: 'JOKER',
      zh: '小丑牌 (The Joker)',
      symbol: '🃏',
      color: '#9333ea',
      img: 'c0.gif'
    };
  }
  const suitChar = code.slice(-1);
  const rankChar = code.slice(0, -1);
  const suitMeta = CARD_SUITS[suitChar] || CARD_SUITS['S'];
  const rankMeta = CARD_RANKS[rankChar] || { val: 0, name: rankChar, zh: rankChar };
  
  // 查找圖檔名稱 (c1.gif ~ c52.gif)
  let imgName = 'c1.gif';
  if (typeof DESTINY_CARDS_DATA !== 'undefined' && DESTINY_CARDS_DATA.icards) {
    const found = DESTINY_CARDS_DATA.icards.find(c => c.code === code);
    if (found) imgName = found.img + '.gif';
  }

  return {
    code: code,
    rank: rankChar,
    rankName: rankMeta.name,
    suit: suitChar,
    suitName: suitMeta.name,
    suitZh: suitMeta.zh,
    symbol: suitMeta.symbol,
    color: suitMeta.color,
    element: suitMeta.element,
    zh: `${suitMeta.zh} ${rankChar} (${rankMeta.name} of ${suitMeta.name})`,
    img: imgName
  };
}

// 根據月日取得星座 Sun Sign (0~11)
function getSunSign(month, day) {
  const signs = [
    { name: '摩羯座 (Capricorn)', start: [1, 1], end: [1, 19], idx: 9, ruler: 'Saturn' },
    { name: '水瓶座 (Aquarius)', start: [1, 20], end: [2, 18], idx: 10, ruler: 'Uranus' },
    { name: '雙魚座 (Pisces)', start: [2, 19], end: [3, 20], idx: 11, ruler: 'Neptune' },
    { name: '牡羊座 (Aries)', start: [3, 21], end: [4, 19], idx: 0, ruler: 'Mars' },
    { name: '金牛座 (Taurus)', start: [4, 20], end: [5, 20], idx: 1, ruler: 'Venus' },
    { name: '雙子座 (Gemini)', start: [5, 21], end: [6, 21], idx: 2, ruler: 'Mercury' },
    { name: '巨蟹座 (Cancer)', start: [6, 22], end: [7, 22], idx: 3, ruler: 'Moon' },
    { name: '獅子座 (Leo)', start: [7, 23], end: [8, 22], idx: 4, ruler: 'Sun' },
    { name: '處女座 (Virgo)', start: [8, 23], end: [9, 22], idx: 5, ruler: 'Mercury' },
    { name: '天秤座 (Libra)', start: [9, 23], end: [10, 23], idx: 6, ruler: 'Venus' },
    { name: '天蠍座 (Scorpio)', start: [10, 24], end: [11, 22], idx: 7, ruler: 'Mars/Pluto' },
    { name: '射手座 (Sagittarius)', start: [11, 23], end: [12, 21], idx: 8, ruler: 'Jupiter' },
    { name: '摩羯座 (Capricorn)', start: [12, 22], end: [12, 31], idx: 9, ruler: 'Saturn' }
  ];

  for (const s of signs) {
    if (month === s.start[0] && day >= s.start[1] && month === s.end[0] && day <= s.end[1]) {
      return s;
    }
  }
  return signs[0];
}

// 核心計算主函數
function calculateDestinyCard(year, month, day, targetAge = null) {
  if (month === 12 && day === 31) {
    // 12月31日是獨特的小丑牌 (The Joker)
    const jokerCard = parseCardCode('JOKER');
    return {
      isJoker: true,
      birthCard: jokerCard,
      sunSign: getSunSign(month, day),
      planetaryRuler: jokerCard,
      karmaCards: { first: jokerCard, second: jokerCard },
      periods: []
    };
  }

  // 1. 本命牌 (Birth Card) 計算公式: 55 - (2*M + D)
  const daysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const dayOfYear = (month > 1 ? daysInMonth[month - 1] : 0) + day;
  
  let bcardCode = 'KS';
  if (typeof DESTINY_CARDS_DATA !== 'undefined' && DESTINY_CARDS_DATA.bcards) {
    bcardCode = DESTINY_CARDS_DATA.bcards[dayOfYear - 1] || 'KS';
  } else {
    // 數學公式後備
    let cardVal = 55 - (2 * month + day);
    if (cardVal <= 0) cardVal += 52;
    // 依序映射
    const allCards = [
      'AH','2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH',
      'AC','2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC',
      'AD','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD',
      'AS','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS'
    ];
    bcardCode = allCards[cardVal - 1] || 'KS';
  }

  const birthCard = parseCardCode(bcardCode);

  // 2. 星座與行星統治牌 (Planetary Ruling Card)
  const sunSign = getSunSign(month, day);
  let rulingCardCode = bcardCode;
  if (typeof DESTINY_CARDS_DATA !== 'undefined' && DESTINY_CARDS_DATA.psignnum) {
    const bcardIdx = DESTINY_CARDS_DATA.icards.findIndex(c => c.code === bcardCode);
    if (bcardIdx >= 0 && DESTINY_CARDS_DATA.psignnum[bcardIdx]) {
      const pList = DESTINY_CARDS_DATA.psignnum[bcardIdx];
      // 依據星座取得對應之統治牌
      const signIdxIn8 = sunSign.idx % 8;
      rulingCardCode = pList[signIdxIn8] || bcardCode;
    }
  }
  const rulingCard = parseCardCode(rulingCardCode);

  // 3. 業力牌 (Karma Cards)
  let karmaFirstCode = bcardCode;
  let karmaSecondCode = bcardCode;
  if (typeof DESTINY_CARDS_DATA !== 'undefined' && DESTINY_CARDS_DATA.karma_map) {
    const kPair = DESTINY_CARDS_DATA.karma_map[bcardCode];
    if (kPair) {
      karmaFirstCode = kPair.first;
      karmaSecondCode = kPair.second;
    }
  }
  const karmaFirst = parseCardCode(karmaFirstCode);
  const karmaSecond = parseCardCode(karmaSecondCode);

  // 4. 計算年齡與流年 52 天行星週期
  const now = new Date();
  const currentYear = now.getFullYear();
  let age = targetAge !== null ? targetAge : (currentYear - year);
  if (age < 0) age = 0;
  if (age > 90) age = 90;

  // 取得該年齡之太陽牌陣 (Plate)
  let plateKey = 'plate00';
  let quadNum = age;
  if (quadNum > 45) quadNum -= 45;
  plateKey = quadNum < 10 ? `plate0${quadNum}` : `plate${quadNum}`;

  let plateCards = DESTINY_CARDS_DATA.plates[plateKey] || DESTINY_CARDS_DATA.plates['plate00'];
  let bcPos = plateCards.indexOf(bcardCode);
  if (bcPos === -1) bcPos = 0;

  // 52 天 7 行星週期牌推算
  const planetNames = [
    { key: 'Mercury', zh: '水星牌 (Mercury)', theme: '智慧思維 · 溝通表達 · 商業靈感', days: 52 },
    { key: 'Venus', zh: '金星牌 (Venus)', theme: '愛情人際 · 美學藝術 · 情感滋養', days: 52 },
    { key: 'Mars', zh: '火星牌 (Mars)', theme: '魄力行動 · 競爭勇氣 · 熱情動能', days: 52 },
    { key: 'Jupiter', zh: '木星牌 (Jupiter)', theme: '貴人豐盛 · 精神擴展 · 財富加持', days: 52 },
    { key: 'Saturn', zh: '土星牌 (Saturn)', theme: '責任紀律 · 磨礪考驗 · 健康修整', days: 52 },
    { key: 'Uranus', zh: '天王星牌 (Uranus)', theme: '意外突變 · 創新突破 · 靈性獨立', days: 52 },
    { key: 'Neptune', zh: '海王星牌 (Neptune)', theme: '靈性直覺 · 遠大夢想 · 慈悲包容', days: 52 }
  ];

  // 計算每個週期的起訖日期
  const birthThisYear = new Date(currentYear, month - 1, day);
  const periods = [];

  for (let p = 0; p < 7; p++) {
    const cardPos = (bcPos + (p + 1)) % 52;
    const cardCode = plateCards[cardPos];
    const pCard = parseCardCode(cardCode);

    const startD = new Date(birthThisYear.getTime() + p * 52 * 86400000);
    const endD = new Date(birthThisYear.getTime() + (p + 1) * 52 * 86400000 - 86400000);
    const startStr = `${startD.getMonth() + 1}月${startD.getDate()}日`;
    const endStr = `${endD.getMonth() + 1}月${endD.getDate()}日`;

    const isNow = (now >= startD && now <= endD);

    periods.push({
      planet: planetNames[p].key,
      planetZh: planetNames[p].zh,
      theme: planetNames[p].theme,
      dateRange: `${startStr} ～ ${endStr}`,
      isCurrentPeriod: isNow,
      card: pCard
    });
  }

  // 年度關鍵四牌
  // 長期牌 (Long Range Card): pos+0 (在當前盤的位置對照靈魂盤)
  const soulCards = DESTINY_CARDS_DATA.plates['platesp'];
  const lifeCards = DESTINY_CARDS_DATA.plates['plate00'];
  
  const soulCard = parseCardCode(soulCards[bcPos] || 'AH');
  const lifeCard = parseCardCode(lifeCards[bcPos] || 'AH');
  const plutoCard = parseCardCode(plateCards[(bcPos + 8) % 52]);
  const resultCard = parseCardCode(plateCards[(bcPos + 9) % 52]);
  const environmentCard = parseCardCode(plateCards[(bcPos + 51) % 52]);

  return {
    input: { year, month, day, age },
    birthCard: birthCard,
    sunSign: sunSign,
    planetaryRuler: rulingCard,
    karmaCards: {
      first: karmaFirst,
      second: karmaSecond
    },
    yearlyCards: {
      plateName: `太陽第 ${quadNum} 號牌陣 (Age ${age})`,
      soulCard: soulCard,
      lifeCard: lifeCard,
      plutoCard: plutoCard,
      resultCard: resultCard,
      environmentCard: environmentCard
    },
    periods: periods
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateDestinyCard, parseCardCode, CARD_SUITS, CARD_RANKS };
}
