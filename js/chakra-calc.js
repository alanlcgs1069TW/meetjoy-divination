/**
 * 癒見幸福 · 魔法占星學院
 * 脈輪占星系統 (Chakra Astrology System · 七曜七脈輪生命能量全息演算法引擎)
 * 整合七大脈輪 (Chakras)、七大本命宮位神聖金字塔 (7 Sacred Houses)、108年大運週期與八方風水
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

  // 宮位與脈輪對應資訊
  HOUSES: {
    7: {
      number: 7,
      name: 'Leader',
      zhName: '領袖宮',
      chakra: '頂輪 (Crown Chakra · Sahasrara)',
      chakraColor: '#9333ea', // 紫色
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      keywords: '靈性動機 · 崇高天命 · 願景領袖',
      description: '代表靈魂深處最純粹的「動機與宏願」。落入此宮的星曜賦予你強烈的心念力量與感染力，是引領他人前行的燈塔。',
      potion: '乳香精油 (Frankincense) ＋ 水飛薊花精，開啟頂輪天線，在繁雜事務中堅守初衷。'
    },
    5: {
      number: 5,
      name: 'Kingly Position',
      zhName: '君王宮',
      chakra: '眉心輪 (Third Eye Chakra · Ajna)',
      chakraColor: '#3b82f6', // 靛藍
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      keywords: '洞見格局 · 崇高地位 · 權柄智慧',
      description: '象徵王者風範與遠見卓識。無論客觀財富多寡，內在皆擁有君王般的莊嚴自尊與宏觀調度能力，能得眾人敬仰。',
      potion: '迷迭香 (Rosemary) ＋ 白栗花精，澄淨思緒雜音，強化直覺洞察與戰略決斷。'
    },
    4: {
      number: 4,
      name: 'Wealth',
      zhName: '財富宮',
      chakra: '喉輪 (Throat Chakra · Vishuddha)',
      chakraColor: '#0ea5e9', // 湛藍
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      keywords: '心靈富足 · 表達流通 · 吸引豐盛',
      description: '代表「帶來真正滿足感的源泉」。不單指物質金錢，更代表名譽與精神豐盛的流通，慷慨大度，目標高遠。',
      potion: '洋甘菊精油 (Chamomile) ＋ 落葉松花精，暢通真誠溝通之門，自信顯化豐盛。'
    },
    3: {
      number: 3,
      name: 'Fame',
      zhName: '名望宮',
      chakra: '心輪 (Heart Chakra · Anahata)',
      chakraColor: '#10b981', // 翠綠
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      keywords: '白手起家 · 大眾美譽 · 慈悲成就',
      description: '象徵外界對你的評價與公眾聲譽。具備堅韌奮鬥、不屈不撓的白手起家特質，能透過真誠的心靈共鳴贏得大眾愛戴。',
      potion: '大馬士革玫瑰 (Rose) ＋ 龍膽花精，化解名利焦慮，在奉獻中感受無條件被愛的平靜。'
    },
    1: {
      number: 1,
      name: 'Impermanence',
      zhName: '無常宮',
      chakra: '太陽神經叢 (Solar Plexus · Manipura)',
      chakraColor: '#eab308', // 明黃/金黃
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      keywords: '生命始基 · 轉折流動 · 自我錨定',
      description: '代表生命中的流變、起伏與適應力。此宮如同潮汐般變化莫測，教導靈魂在無常世界中找到內在不動的定盤星。',
      potion: '佛手柑 (Bergamot) ＋ 鐵線蓮花精，消除內在神經緊繃，激發落地行動與堅定自信。'
    },
    2: {
      number: 2,
      name: 'Extremity',
      zhName: '極端宮',
      chakra: '臍輪 (Sacral Chakra · Svadhisthana)',
      chakraColor: '#f97316', // 暖橘
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      keywords: '巨變考驗 · 逆境涅槃 · 非凡轉化',
      description: '傳統被視為「大成或大敗」的淬礪之宮。早期往往面臨劇烈轉折或考驗，一旦安度磨難，將轉化為極強大的生命韌性。',
      potion: '甜橙精油 (Sweet Orange) ＋ 酸蘋果花精，淨化深層創傷，點燃生命對喜悅與創造的熱情。'
    },
    6: {
      number: 6,
      name: 'Sickly',
      zhName: '病符宮',
      chakra: '海底輪 (Root Chakra · Muladhara)',
      chakraColor: '#ef4444', // 深紅
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      keywords: '肉身扎根 · 磨難排毒 · 實體考驗',
      description: '代表物質肉身與現實阻力的修煉場。容易引起身體疲勞或瑣碎干擾，提醒個案重視扎根、保養氣血，將考驗化為滋養。',
      potion: '雪松 (Cedarwood) ＋ 橡樹花精，強韌身體邊界，釋放承載過度的重擔，穩固接地。'
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
 * 核心計算函數
 * @param {number} year 西元年
 * @param {number} month 月份 (1~12)
 * @param {number} day 日 (1~31)
 * @param {boolean} isWedPm 星期三下午出生 (是否啟用羅睺 Rahu)
 * @param {number} targetAge 查詢年齡 (可選，預設依當前年份計算)
 */
function calculateMahabote(year, month, day, isWedPm = false, targetAge = null) {
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
  // 4月15日以前 (含) 使用第 1 工作盤: Year - 639
  // 4月16日以後 (含) 使用第 2 工作盤: Year - 638
  const isBeforeNewYear = (month < 4) || (month === 4 && day <= 15);
  const burmeseYear = isBeforeNewYear ? (year - 639) : (year - 638);
  const remainder = burmeseYear % 7; // 0, 1, 2, 3, 4, 5, 6

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
  const planetCircle = isWedPm ? MAHABOTE_DATA.PLANET_CIRCLE_RAHU : MAHABOTE_DATA.PLANET_CIRCLE;
  const startIndex = planetCircle.indexOf(firstHousePlanet);

  // 宮位順序：1 (無常), 2 (極端), 3 (名望), 4 (財富), 5 (君王), 6 (病符), 7 (領袖)
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
    const pMeta = MAHABOTE_DATA.MAJOR_PERIODS.find(p => p.name === pName);
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
  const minorBeforeMeta = MAHABOTE_DATA.MAJOR_PERIODS.find(p => p.name === majorOrder[minorIdxBefore]);
  const minorAfterMeta = MAHABOTE_DATA.MAJOR_PERIODS.find(p => p.name === majorOrder[minorIdxAfter]);

  // 8. 三刑凶煞預警 (Hostile Combinations)
  const hostileInfo = MAHABOTE_DATA.HOSTILE_COMBOS[birthPlanet] || { combo: '無特殊三煞組合', alertAges: [] };
  const isHostileAge = hostileInfo.alertAges.includes(currentAge);

  // 9. 本命星詳情與八方風水
  const birthPlanetMeta = MAHABOTE_DATA.MAJOR_PERIODS.find(p => p.name === birthPlanet);
  const natalHouseInfo = MAHABOTE_DATA.HOUSES[natalHouse];

  return {
    input: { year, month, day, isWedPm, currentAge },
    burmese: {
      chartType: isBeforeNewYear ? 1 : 2,
      chartDesc: isBeforeNewYear ? '第 1 工作盤 (1月1日～4月15日 出生)' : '第 2 工作盤 (4月16日～12月31日 出生)',
      burmeseYear: burmeseYear,
      remainder: remainder,
      firstHousePlanet: firstHousePlanet,
      firstHousePlanetZh: MAHABOTE_DATA.MAJOR_PERIODS.find(p => p.name === firstHousePlanet)?.zh || firstHousePlanet
    },
    birthPlanet: {
      name: birthPlanet,
      zh: birthPlanetMeta.zh,
      weekdayZh: MAHABOTE_DATA.WEEKDAY_MAP.find(w => w.planet === birthPlanet)?.dayZh || '',
      meta: birthPlanetMeta
    },
    natalHouse: {
      number: natalHouse,
      info: natalHouseInfo
    },
    houses: housePlacements,
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

// 原創別名
const calculateChakraAstrology = calculateMahabote;
const CHAKRA_ASTROLOGY_DATA = MAHABOTE_DATA;

// 支援瀏覽器全域與 Node.js 匯出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    calculateChakraAstrology, 
    CHAKRA_ASTROLOGY_DATA,
    calculateMahabote, 
    MAHABOTE_DATA 
  };
}
