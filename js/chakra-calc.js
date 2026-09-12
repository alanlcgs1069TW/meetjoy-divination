/**
 * 癒見幸福 · 魔法占星學院
 * 脈輪占星系統 (Chakra Astrology System · 七曜七脈輪生命能量全息演算法引擎)
 * 整合七大脈輪 (Chakras)、七大本命宮位神聖金字塔 (7 Sacred Houses)、神聖大三角 (Grand Trine)、108年大運週期與八方風水生活魔藥
 * 遵循 Zero Attribution 鐵律：100% 繁體中文，自創系統
 */

const CHAKRA_ASTROLOGY_DATA = {
  // 7 顆行星環（若週三下午則 Mercury 替換為 Rahu）
  PLANET_CIRCLE: ['Sun', 'Mercury', 'Saturn', 'Mars', 'Venus', 'Moon', 'Jupiter'],
  PLANET_CIRCLE_RAHU: ['Sun', 'Rahu', 'Saturn', 'Mars', 'Venus', 'Moon', 'Jupiter'],

  // 大運行星順序與年限（總計 108 年）
  MAJOR_PERIODS: [
    { name: 'Sun', zh: '太陽', years: 6, element: '活炭烈火 (Heat)', gender: '陽性', nature: '煞星 (Malefic)', direction: '東北方 (Northeast)', dirZh: '東北 (NE)', degree: 45 },
    { name: 'Moon', zh: '太陰 (月亮)', years: 15, element: '岩石沃土 (Earth)', gender: '陰性', nature: '吉星 (Benefic)', direction: '東方 (East)', dirZh: '正東 (E)', degree: 90 },
    { name: 'Mars', zh: '火星', years: 8, element: '和煦微風 (Air)', gender: '陽性', nature: '煞星 (Malefic)', direction: '東南方 (Southeast)', dirZh: '東南 (SE)', degree: 135 },
    { name: 'Mercury', zh: '水星', years: 17, element: '甘露清泉 (Water)', gender: '陽性', nature: '吉星 (Benefic)', direction: '南方 (South)', dirZh: '正南 (S)', degree: 180 },
    { name: 'Saturn', zh: '土星', years: 10, element: '淬礪烈火 (Heat)', gender: '陰性', nature: '煞星 (Malefic)', direction: '西南方 (Southwest)', dirZh: '西南 (SW)', degree: 225 },
    { name: 'Jupiter', zh: '木星', years: 19, element: '廣袤原野 (Earth)', gender: '陽性', nature: '吉星 (Benefic)', direction: '西方 (West)', dirZh: '正西 (W)', degree: 270 },
    { name: 'Rahu', zh: '羅睺 (暗月)', years: 12, element: '狂烈暴風 (Air)', gender: '陰性', nature: '煞星 (Malefic)', direction: '西北方 (Northwest)', dirZh: '西北 (NW)', degree: 315 },
    { name: 'Venus', zh: '金星', years: 21, element: '豐沛混水 (Water)', gender: '陰性', nature: '吉星 (Benefic)', direction: '北方 (North)', dirZh: '正北 (N)', degree: 0 }
  ],

  // 宮位與脈輪對應資訊 (House 1 海底輪 ～ House 7 頂輪 嚴格對應)
  HOUSES: {
    1: {
      number: 1,
      name: 'Root / Impermanence',
      zhName: '無常宮',
      chakra: '海底輪 (Root Chakra · Muladhara)',
      chakraColor: '#ef4444', // 紅色
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      keywords: '肉身扎根 · 安定信任 · 物質定錨',
      description: '代表生命基石、肉身扎根與物質現實的起伏轉折。此宮如大地承載一切無常流轉，教導靈魂在變動世界中穩固生長、扎根大地，將考驗化為滋養與定力。',
      potion: '雪松精油 (Cedarwood) ＋ 橡樹花精，強韌身體邊界，釋放生存焦慮與沉重負擔，穩固接地。'
    },
    2: {
      number: 2,
      name: 'Sacral / Extremity',
      zhName: '極端宮',
      chakra: '臍輪 (Sacral Chakra · Svadhisthana)',
      chakraColor: '#f97316', // 暖橘
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      keywords: '情感流動 · 創造轉化 · 淬礪涅槃',
      description: '象徵深層情緒、親密關係與創造力的大起大落。傳統被視為「大成或大敗」的淬礪之宮，早期往往面臨劇烈轉折或情感考驗，一旦安度磨難，將轉化為極強大的生命韌性與創造爆發力。',
      potion: '甜橙精油 (Sweet Orange) ＋ 酸蘋果花精，淨化深層情感創傷，點燃生命對喜悅與創造的熱情。'
    },
    3: {
      number: 3,
      name: 'Solar Plexus / Fame',
      zhName: '名望宮',
      chakra: '太陽神經叢 (Solar Plexus · Manipura)',
      chakraColor: '#eab308', // 明黃/金黃
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      keywords: '自信意志 · 行動力 · 大眾美譽',
      description: '象徵個人意志、自信魄力與公眾聲譽的展現。具備堅韌奮鬥、不屈不撓的白手起家特質，將內在太陽般的個人力量向外輻射，贏得大眾敬仰與實質成就。',
      potion: '佛手柑 (Bergamot) ＋ 鐵線蓮花精，消除內在神經緊繃與自我懷疑，激發落地行動與堅定自信。'
    },
    4: {
      number: 4,
      name: 'Heart / Wealth',
      zhName: '財富宮',
      chakra: '心輪 (Heart Chakra · Anahata)',
      chakraColor: '#10b981', // 翠綠
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      keywords: '心靈富足 · 慈悲流通 · 吸引豐盛',
      description: '代表「帶來真正滿足感與愛的源泉」。不單指物質金錢，更代表從敞開的心輪所流淌的精神豐盛與慷慨大度，以慈悲與愛共鳴外界，自然吸引豐盛來到。',
      potion: '大馬士革玫瑰 (Rose) ＋ 龍膽花精，敞開心胸化解匱乏焦慮，在無條件奉獻與愛中感受內在豐盛。'
    },
    5: {
      number: 5,
      name: 'Throat / Kingly Position',
      zhName: '君王宮',
      chakra: '喉輪 (Throat Chakra · Vishuddha)',
      chakraColor: '#0ea5e9', // 湛藍
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      keywords: '真實表達 · 權柄智慧 · 王者風範',
      description: '象徵君王般的莊嚴自尊、宏觀格局與真理之聲。無論身處何境皆能發出真實有力的言論，以智慧宏觀的調度能力與威嚴溝通引領他人，建立崇高聲望。',
      potion: '洋甘菊精油 (Chamomile) ＋ 落葉松花精，暢通真誠溝通之門，自信發聲，確立內在王者威嚴。'
    },
    6: {
      number: 6,
      name: 'Third Eye / Sickly',
      zhName: '病符宮',
      chakra: '眉心輪 (Third Eye Chakra · Ajna)',
      chakraColor: '#3b82f6', // 靛藍
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      keywords: '洞見真相 · 照破盲點 · 智慧療癒',
      description: '代表看清困厄與生命盲點的第三眼洞見。傳統被視為病符與阻力的修煉場，實為透過清明智慧照破世俗執著，將身心阻礙轉化為深刻的戰略洞察力與精神解脫。',
      potion: '迷迭香 (Rosemary) ＋ 白栗花精，澄淨思緒雜音，照破盲點執念，強化直覺洞察與戰略決斷。'
    },
    7: {
      number: 7,
      name: 'Crown / Leader',
      zhName: '領袖宮',
      chakra: '頂輪 (Crown Chakra · Sahasrara)',
      chakraColor: '#9333ea', // 紫色
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      keywords: '靈性動機 · 崇高天命 · 願景合一',
      description: '代表靈魂深處最純粹的「動機與宏願」。落入此宮的星曜賦予你強烈的心念力量與感染力，是連結宇宙神聖智慧、引領他人前行的精神燈塔。',
      potion: '乳香精油 (Frankincense) ＋ 水飛薊花精，開啟頂輪天線，在繁雜事務中堅守初衷與天命宏願。'
    }
  },

  // 星期與本命星對照
  WEEKDAY_MAP: [
    { day: 0, planet: 'Sun', zh: '太陽', dayZh: '星期日' },
    { day: 1, planet: 'Moon', zh: '太陰 (月亮)', dayZh: '星期一' },
    { day: 2, planet: 'Mars', zh: '火星', dayZh: '星期二' },
    { day: 3, planet: 'Mercury', zh: '水星', dayZh: '星期三 (上午 00:00~12:00)' },
    { day: 3, planet: 'Rahu', zh: '羅睺', dayZh: '星期三 (下午 12:00~24:00)' },
    { day: 4, planet: 'Jupiter', zh: '木星', dayZh: '星期四' },
    { day: 5, planet: 'Venus', zh: '金星', dayZh: '星期五' },
    { day: 6, planet: 'Saturn', zh: '土星', dayZh: '星期六' }
  ],

  // 行星吉凶交感能量矩陣 (Planetary Relationships)
  RELATIONSHIPS: {
    friends: [
      ['Sun', 'Jupiter'], ['Moon', 'Mercury'], ['Mars', 'Venus'], ['Saturn', 'Rahu']
    ],
    positiveElements: [
      ['Sun', 'Saturn'], ['Moon', 'Jupiter'], ['Mars', 'Rahu'], ['Mercury', 'Venus']
    ],
    enemies: [
      ['Sun', 'Mars'], ['Moon', 'Jupiter'], ['Venus', 'Saturn'], ['Mercury', 'Rahu']
    ],
    negativeElements: [
      ['Sun', 'Mercury'], ['Moon', 'Mars'], ['Venus', 'Saturn'], ['Jupiter', 'Rahu']
    ]
  },

  // 三刑凶煞組合 (Hostile Combinations)
  HOSTILE_COMBOS: {
    'Sun': { combo: 'Sun - Mercury - Rahu (太陽－水星－羅睺)', alertAges: [30, 38] },
    'Moon': { combo: 'Moon - Saturn - Venus (月亮－土星－金星)', alertAges: [46] },
    'Mars': { combo: 'Mars - Jupiter - Sun (火星－木星－太陽)', alertAges: [38, 46] },
    'Mercury': { combo: 'Mercury - Rahu - Moon (水星－羅睺－月亮)', alertAges: [46, 54] },
    'Saturn': { combo: 'Saturn - Venus - Mars (土星－金星－火星)', alertAges: [46, 54] },
    'Jupiter': { combo: 'Jupiter - Sun - Mercury (木星－太陽－水星)', alertAges: [54] },
    'Rahu': { combo: 'Rahu - Moon - Saturn (羅睺－月亮－土星)', alertAges: [46] },
    'Venus': { combo: 'Venus - Mars - Jupiter (金星－火星－木星)', alertAges: [46] }
  }
};

/**
 * 核心排盤計算函數
 * @param {number} year 西元年
 * @param {number} month 月份 (1~12)
 * @param {number} day 日 (1~31)
 * @param {boolean} isWedPm 星期三下午出生 (是否啟用羅睺 Rahu)
 * @param {number} targetAge 查詢年齡 (可選，預設依當前年份計算)
 */
function calculateChakraAstrology(year, month, day, isWedPm = false, targetAge = null) {
  // 1. 計算出生日星期
  const bDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const weekday = bDate.getUTCDay();

  // 確定本命星 (Birth Planet)
  let birthPlanet = 'Sun';
  if (weekday === 0) birthPlanet = 'Sun';
  else if (weekday === 1) birthPlanet = 'Moon';
  else if (weekday === 2) birthPlanet = 'Mars';
  else if (weekday === 3) birthPlanet = isWedPm ? 'Rahu' : 'Mercury';
  else if (weekday === 4) birthPlanet = 'Jupiter';
  else if (weekday === 5) birthPlanet = 'Venus';
  else if (weekday === 6) birthPlanet = 'Saturn';

  // 2. 判斷天命神聖紀年與天命餘數 (Sacred Era & Remainder)
  // 4月15日以前 (含) 使用第 1 盤: Year - 639
  // 4月16日以後 (含) 使用第 2 盤: Year - 638
  const isBeforeNewYear = (month < 4) || (month === 4 && day <= 15);
  const sacredYear = isBeforeNewYear ? (year - 639) : (year - 638);
  const remainder = ((sacredYear % 7) + 7) % 7; // 0, 1, 2, 3, 4, 5, 6

  // 3. 餘數決定第 1 宮守護星 (1st House Planet)
  const remainderToPlanet = {
    1: 'Sun',
    2: 'Moon',
    3: 'Mars',
    4: 'Mercury',
    5: 'Jupiter',
    6: 'Venus',
    0: 'Saturn'
  };
  const firstHousePlanet = remainderToPlanet[remainder];

  // 4. 依七曜旋轉環填入 7 個宮位
  const planetCircle = isWedPm ? CHAKRA_ASTROLOGY_DATA.PLANET_CIRCLE_RAHU : CHAKRA_ASTROLOGY_DATA.PLANET_CIRCLE;
  const startIndex = planetCircle.indexOf(firstHousePlanet);

  // 宮位順序：1 (海底輪 · 無常), 2 (臍輪 · 極端), 3 (太陽神經叢 · 名望), 4 (心輪 · 財富), 5 (喉輪 · 君王), 6 (眉心輪 · 病符), 7 (頂輪 · 領袖)
  const housePlacements = {
    1: planetCircle[startIndex % 7],
    2: planetCircle[(startIndex + 1) % 7],
    3: planetCircle[(startIndex + 2) % 7],
    4: planetCircle[(startIndex + 3) % 7],
    5: planetCircle[(startIndex + 4) % 7],
    6: planetCircle[(startIndex + 5) % 7],
    7: planetCircle[(startIndex + 6) % 7]
  };

  // 5. 找出本命星落入哪一個宮位 (Natal House)
  let natalHouse = 1;
  for (let h = 1; h <= 7; h++) {
    if (housePlacements[h] === birthPlanet) {
      natalHouse = h;
      break;
    }
  }

  // 6. 計算年齡與大運流年
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  let currentAge = targetAge !== null ? targetAge : (currentYear - year);
  if (currentAge < 0) currentAge = 0;

  // 構建 108 年大運週期時間軸
  const majorPeriodsList = [];
  const majorOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Saturn', 'Jupiter', 'Rahu', 'Venus'];
  const startMajorIdx = majorOrder.indexOf(birthPlanet);

  let accumulatedAge = 0;
  let currentMajorPeriod = null;

  for (let i = 0; i < 8; i++) {
    const pName = majorOrder[(startMajorIdx + i) % 8];
    const pMeta = CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(p => p.name === pName);
    const startAge = accumulatedAge;
    const endAge = accumulatedAge + pMeta.years - 1;
    const startYr = year + startAge;
    const endYr = year + endAge;

    const item = {
      planet: pName,
      zh: pMeta.zh,
      years: pMeta.years,
      startAge: startAge,
      endAge: endAge,
      startYear: startYr,
      endYear: endYr,
      element: pMeta.element,
      isCurrent: (currentAge >= startAge && currentAge <= endAge)
    };

    if (item.isCurrent) {
      currentMajorPeriod = item;
    }
    majorPeriodsList.push(item);
    accumulatedAge += pMeta.years;
  }

  // 7. 計算小運 (Minor Periods)
  // 生日前與生日後小運星
  const minorIdxBefore = (startMajorIdx + (currentAge > 0 ? currentAge - 1 : 0)) % 8;
  const minorIdxAfter = (startMajorIdx + currentAge) % 8;
  const minorBeforeMeta = CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(p => p.name === majorOrder[minorIdxBefore]);
  const minorAfterMeta = CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(p => p.name === majorOrder[minorIdxAfter]);

  // 8. 三刑凶煞預警 (Hostile Combinations)
  const hostileInfo = CHAKRA_ASTROLOGY_DATA.HOSTILE_COMBOS[birthPlanet] || { combo: '無特殊三煞組合', alertAges: [] };
  const isHostileAge = hostileInfo.alertAges.includes(currentAge);

  // 9. 神聖大三角 (Grand Trine) 與 次三角 (Minor Trine) 分析
  // 主大三角：7 (頂輪 · 領袖宮) ＋ 4 (心輪 · 財富宮) ＋ 1 (海底輪 · 無常宮)
  const gtPlanets = [housePlacements[7], housePlacements[4], housePlacements[1]];
  const gtZh = gtPlanets.map(p => CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(m => m.name === p)?.zh || p);

  // 次三角：1 (海底輪 · 無常宮) ＋ 2 (臍輪 · 極端宮) ＋ 3 (太陽神經叢 · 名望宮)
  const mtPlanets = [housePlacements[1], housePlacements[2], housePlacements[3]];
  const mtZh = mtPlanets.map(p => CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(m => m.name === p)?.zh || p);

  // 世俗意志與王者顯化軸：3 (太陽神經叢 · 名望宮) ＋ 5 (喉輪 · 君王宮) ＋ 6 (眉心輪 · 病符宮)
  const worldlyPlanets = [housePlacements[3], housePlacements[5], housePlacements[6]];
  const worldlyZh = worldlyPlanets.map(p => CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(m => m.name === p)?.zh || p);

  // 創造與情感轉化樞紐：2 (臍輪 · 極端宮)
  const pivotPlanet = housePlacements[2];
  const pivotZh = CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(m => m.name === pivotPlanet)?.zh || pivotPlanet;

  // 檢查大三角交感能量
  const checkCompatibility = (p1, p2) => {
    const isPair = (pair) => (pair[0] === p1 && pair[1] === p2) || (pair[0] === p2 && pair[1] === p1);
    if (CHAKRA_ASTROLOGY_DATA.RELATIONSHIPS.friends.some(isPair)) return { type: 'friend', text: '天賦友朋 (極吉助益)' };
    if (CHAKRA_ASTROLOGY_DATA.RELATIONSHIPS.positiveElements.some(isPair)) return { type: 'positive', text: '相生正元素 (和諧順遂)' };
    if (CHAKRA_ASTROLOGY_DATA.RELATIONSHIPS.enemies.some(isPair)) return { type: 'enemy', text: '宿命宿敵 (深刻磨礪)' };
    if (CHAKRA_ASTROLOGY_DATA.RELATIONSHIPS.negativeElements.some(isPair)) return { type: 'negative', text: '相剋負元素 (淬礪考驗)' };
    return { type: 'neutral', text: '中立常態 (自力調和)' };
  };

  const gtRel1 = checkCompatibility(gtPlanets[0], gtPlanets[1]);
  const gtRel2 = checkCompatibility(gtPlanets[1], gtPlanets[2]);
  const gtRel3 = checkCompatibility(gtPlanets[0], gtPlanets[2]);

  const grandTrineHarmonious = (gtRel1.type === 'friend' || gtRel1.type === 'positive') ||
                               (gtRel2.type === 'friend' || gtRel2.type === 'positive') ||
                               (gtRel3.type === 'friend' || gtRel3.type === 'positive');

  // 10. 本命星詳情與八方風水
  const birthPlanetMeta = CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(p => p.name === birthPlanet);
  const natalHouseInfo = CHAKRA_ASTROLOGY_DATA.HOUSES[natalHouse];

  return {
    input: { year, month, day, isWedPm, currentAge },
    sacred: {
      chartType: isBeforeNewYear ? 1 : 2,
      chartDesc: isBeforeNewYear ? '第 1 脈輪神聖盤 (1月1日～4月15日 出生)' : '第 2 脈輪神聖盤 (4月16日～12月31日 出生)',
      sacredYear: sacredYear,
      remainder: remainder,
      firstHousePlanet: firstHousePlanet,
      firstHousePlanetZh: CHAKRA_ASTROLOGY_DATA.MAJOR_PERIODS.find(p => p.name === firstHousePlanet)?.zh || firstHousePlanet
    },
    birthPlanet: {
      name: birthPlanet,
      zh: birthPlanetMeta.zh,
      weekdayZh: CHAKRA_ASTROLOGY_DATA.WEEKDAY_MAP.find(w => w.planet === birthPlanet)?.dayZh || '',
      meta: birthPlanetMeta
    },
    natalHouse: {
      number: natalHouse,
      info: natalHouseInfo
    },
    houses: housePlacements,
    grandTrine: {
      houses: [7, 4, 1],
      planets: gtPlanets,
      planetsZh: gtZh,
      chakras: ['頂輪', '心輪', '海底輪'],
      isHarmonious: grandTrineHarmonious,
      relationships: [
        { pair: `${gtZh[0]} ⇄ ${gtZh[1]}`, ...gtRel1 },
        { pair: `${gtZh[1]} ⇄ ${gtZh[2]}`, ...gtRel2 },
        { pair: `${gtZh[0]} ⇄ ${gtZh[2]}`, ...gtRel3 }
      ],
      description: grandTrineHarmonious
        ? '天地中軸神聖大三角能量運轉和諧順暢，靈性願景能貫通心輪慈悲並穩固扎根大地，生命能量平衡綻放。'
        : '天地中軸神聖大三角蘊含淬礪考驗，宜透過靜心調頻、落實生活魔藥，促進頂輪靈感與海底輪扎根之和諧流動。'
    },
    minorTrine: {
      houses: [1, 2, 3],
      planets: mtPlanets,
      planetsZh: mtZh,
      chakras: ['海底輪', '臍輪', '太陽神經叢'],
      description: '下三輪大地基石三角以海底輪為支點，調和肉身安全感、情感創造力與個人意志行動，奠定穩固不拔之生命根基。'
    },
    worldlyAxis: {
      houses: [3, 5, 6],
      planets: worldlyPlanets,
      planetsZh: worldlyZh,
      chakras: ['太陽神經叢', '喉輪', '眉心輪'],
      description: '世俗顯化王者全息軸連通太陽神經叢、喉輪與眉心輪三大中心，主宰自信意志行動、王者真實發聲與宏觀戰略洞察。'
    },
    pivotCenter: {
      house: 2,
      planet: pivotPlanet,
      planetZh: pivotZh,
      chakra: '臍輪',
      description: '臍輪極端宮為生命創造與情感轉化之核心樞紐，調和親密關係與生命熱情，將逆境考驗淬礪為非凡爆發力。'
    },
    majorPeriods: {
      list: majorPeriodsList,
      current: currentMajorPeriod
    },
    minorPeriods: {
      before: {
        planet: minorBeforeMeta.name,
        zh: minorBeforeMeta.zh,
        age: currentAge > 0 ? currentAge - 1 : 0
      },
      after: {
        planet: minorAfterMeta.name,
        zh: minorAfterMeta.zh,
        age: currentAge
      }
    },
    hostile: {
      combo: hostileInfo.combo,
      alertAges: hostileInfo.alertAges,
      isCurrentAlert: isHostileAge
    }
  };
}

// 支援瀏覽器全域與 Node.js 匯出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    calculateChakraAstrology, 
    CHAKRA_ASTROLOGY_DATA
  };
}
