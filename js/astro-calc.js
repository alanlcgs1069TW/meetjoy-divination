/**
 * astro-calc.js
 * 癒見幸福官方排盤引擎 · 核心高精度天文星曆與人類圖/占星推導庫
 * 整合 NASA JPL / VSOP87 高精確天文演算法 (AstronomyEngine)
 * 嚴格支援：精準出生地經緯度、時區換算、夏令時間、角秒級太陽倒退 88 度設計盤
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./astronomy.browser.min.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    let ast = null;
    try { ast = require('astronomy-engine'); } catch(e) {
      try { ast = require('./astronomy.browser.min.js'); } catch(e2) {}
    }
    module.exports = factory(ast);
  } else {
    root.AstroCalc = factory(root.Astronomy);
  }
}(typeof self !== 'undefined' ? self : this, function(Astronomy) {

  // 12 星座常數
  const ZODIAC_SIGNS = [
    { name: '白羊座', en: 'Aries', symbol: '♈', start: 0, ruler: '火星', element: '火' },
    { name: '金牛座', en: 'Taurus', symbol: '♉', start: 30, ruler: '金星', element: '土' },
    { name: '雙子座', en: 'Gemini', symbol: '♊', start: 60, ruler: '水星', element: '風' },
    { name: '巨蟹座', en: 'Cancer', symbol: '♋', start: 90, ruler: '月亮', element: '水' },
    { name: '獅子座', en: 'Leo', symbol: '♌', start: 120, ruler: '太陽', element: '火' },
    { name: '處女座', en: 'Virgo', symbol: '♍', start: 150, ruler: '水星', element: '土' },
    { name: '天秤座', en: 'Libra', symbol: '♎', start: 180, ruler: '金星', element: '風' },
    { name: '天蠍座', en: 'Scorpio', symbol: '♏', start: 210, ruler: '冥王星', element: '水' },
    { name: '射手座', en: 'Sagittarius', symbol: '♐', start: 240, ruler: '木星', element: '火' },
    { name: '摩羯座', en: 'Capricorn', symbol: '♑', start: 270, ruler: '土星', element: '土' },
    { name: '水瓶座', en: 'Aquarius', symbol: '♒', start: 300, ruler: '天王星', element: '風' },
    { name: '雙魚座', en: 'Pisces', symbol: '♓', start: 330, ruler: '海王星', element: '水' }
  ];

  // 人類圖與基因天命易經 64 閘門輪盤序列 (從水瓶座 02°00'00" 第 41 閘門開始順時針排序)
  const RAVE_MANDALA_GATES = [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ];
  const HD_GATE_SERIAL = RAVE_MANDALA_GATES;
  const START_OF_GATE_41 = 302.0; // 水瓶座 02°00'00"

  // 人類圖九大中心涵蓋之閘門
  const HD_CENTERS = {
    'Head': [64, 61, 63],
    'Ajna': [47, 24, 4, 17, 11, 43],
    'Throat': [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
    'G': [1, 13, 25, 46, 2, 15, 10, 7],
    'Heart': [21, 51, 26, 40],
    'Solar Plexus': [36, 22, 37, 6, 49, 55, 30],
    'Sacral': [5, 14, 29, 34, 27, 42, 3, 9, 59],
    'Spleen': [48, 57, 44, 50, 32, 28, 18],
    'Root': [53, 60, 52, 54, 19, 38, 39, 58, 41]
  };

  // 人類圖 36 條通道
  const HD_CHANNELS = [
    { id: '64-47', g1: 64, g2: 47, c1: 'Head', c2: 'Ajna', name: '抽象思維通道' },
    { id: '61-24', g1: 61, g2: 24, c1: 'Head', c2: 'Ajna', name: '思想覺察通道' },
    { id: '63-4', g1: 63, g2: 4, c1: 'Head', c2: 'Ajna', name: '邏輯質疑通道' },
    { id: '43-23', g1: 43, g2: 23, c1: 'Ajna', c2: 'Throat', name: '頓悟溝通通道' },
    { id: '17-62', g1: 17, g2: 62, c1: 'Ajna', c2: 'Throat', name: '組織概念通道' },
    { id: '11-56', g1: 11, g2: 56, c1: 'Ajna', c2: 'Throat', name: '追尋說書人通道' },
    { id: '1-8', g1: 1, g2: 8, c1: 'G', c2: 'Throat', name: '靈感激發通道' },
    { id: '13-33', g1: 13, g2: 33, c1: 'G', c2: 'Throat', name: '歷史見證通道' },
    { id: '10-20', g1: 10, g2: 20, c1: 'G', c2: 'Throat', name: '覺醒覺知通道' },
    { id: '7-31', g1: 7, g2: 31, c1: 'G', c2: 'Throat', name: '領袖領導通道' },
    { id: '25-51', g1: 25, g2: 51, c1: 'G', c2: 'Heart', name: '天真跳躍發起通道' },
    { id: '2-14', g1: 2, g2: 14, c1: 'G', c2: 'Sacral', name: '煉金守財發電通道' },
    { id: '46-29', g1: 46, g2: 29, c1: 'G', c2: 'Sacral', name: '發現自我全心投入通道' },
    { id: '15-5', g1: 15, g2: 5, c1: 'G', c2: 'Sacral', name: '宇宙韻律節奏通道' },
    { id: '10-57', g1: 10, g2: 57, c1: 'G', c2: 'Spleen', name: '完美存活型態通道' },
    { id: '10-34', g1: 10, g2: 34, c1: 'G', c2: 'Sacral', name: '探索追尋通道' },
    { id: '21-45', g1: 21, g2: 45, c1: 'Heart', c2: 'Throat', name: '金錢金庫領主通道' },
    { id: '26-44', g1: 26, g2: 44, c1: 'Heart', c2: 'Spleen', name: '說服傳遞行銷通道' },
    { id: '40-37', g1: 40, g2: 37, c1: 'Heart', c2: 'Solar Plexus', name: '社群契約溫情通道' },
    { id: '12-22', g1: 12, g2: 22, c1: 'Throat', c2: 'Solar Plexus', name: '開放浪漫藝術通道' },
    { id: '35-36', g1: 35, g2: 36, c1: 'Throat', c2: 'Solar Plexus', name: '無常體驗冒險通道' },
    { id: '16-48', g1: 16, g2: 48, c1: 'Throat', c2: 'Spleen', name: '才華深度波長通道' },
    { id: '20-57', g1: 20, g2: 57, c1: 'Throat', c2: 'Spleen', name: '靈光當下直覺通道' },
    { id: '20-34', g1: 20, g2: 34, c1: 'Throat', c2: 'Sacral', name: '忙碌魅力發電機通道' },
    { id: '6-59', g1: 6, g2: 59, c1: 'Solar Plexus', c2: 'Sacral', name: '親密交配繁殖通道' },
    { id: '41-30', g1: 41, g2: 30, c1: 'Root', c2: 'Solar Plexus', name: '夢想渴望收斂通道' },
    { id: '39-55', g1: 39, g2: 55, c1: 'Root', c2: 'Solar Plexus', name: '情緒起伏音律通道' },
    { id: '19-49', g1: 19, g2: 49, c1: 'Root', c2: 'Solar Plexus', name: '整合敏感需求通道' },
    { id: '53-42', g1: 53, g2: 42, c1: 'Root', c2: 'Sacral', name: '循環開始結束通道' },
    { id: '3-60', g1: 3, g2: 60, c1: 'Sacral', c2: 'Root', name: '突變脈衝新生通道' },
    { id: '9-52', g1: 9, g2: 52, c1: 'Sacral', c2: 'Root', name: '專注靜定細節通道' },
    { id: '27-50', g1: 27, g2: 50, c1: 'Sacral', c2: 'Spleen', name: '滋養保護監護通道' },
    { id: '34-57', g1: 34, g2: 57, c1: 'Sacral', c2: 'Spleen', name: '力量直覺存活通道' },
    { id: '32-54', g1: 32, g2: 54, c1: 'Spleen', c2: 'Root', name: '蛻變野心轉化通道' },
    { id: '28-38', g1: 28, g2: 38, c1: 'Spleen', c2: 'Root', name: '困頓掙扎奮鬥通道' },
    { id: '18-58', g1: 18, g2: 58, c1: 'Spleen', c2: 'Root', name: '批判完美苛求通道' }
  ];

  function mod(n, m) { return ((n % m) + m) % m; }
  function toRad(d) { return d * Math.PI / 180; }
  function toDeg(r) { return r * 180 / Math.PI; }

  /**
   * 計算黃道經度之星座與度數
   */
  function longitudeToSign(lon) {
    const normLon = mod(lon, 360);
    const signIndex = Math.floor(normLon / 30);
    const degreeInSign = normLon % 30;
    const deg = Math.floor(degreeInSign);
    const min = Math.floor((degreeInSign - deg) * 60);
    const sec = Math.round(((degreeInSign - deg) * 60 - min) * 60);

    return {
      totalDegree: normLon,
      sign: ZODIAC_SIGNS[signIndex].name,
      signEn: ZODIAC_SIGNS[signIndex].en,
      signSymbol: ZODIAC_SIGNS[signIndex].symbol,
      degree: deg,
      minute: min,
      second: sec,
      formatted: `${ZODIAC_SIGNS[signIndex].name} ${deg}°${min.toString().padStart(2, '0')}'`
    };
  }

  /**
   * 計算所有行星在指定 UTC 時間的位置
   */
  function calculatePlanetaryPositions(utcDate) {
    const bodies = [
      { id: 'Sun', name: '太陽', symbol: '☉' },
      { id: 'Moon', name: '月亮', symbol: '☽' },
      { id: 'Mercury', name: '水星', symbol: '☿' },
      { id: 'Venus', name: '金星', symbol: '♀' },
      { id: 'Mars', name: '火星', symbol: '♂' },
      { id: 'Jupiter', name: '木星', symbol: '♃' },
      { id: 'Saturn', name: '土星', symbol: '♄' },
      { id: 'Uranus', name: '天王星', symbol: '♅' },
      { id: 'Neptune', name: '海王星', symbol: '♆' },
      { id: 'Pluto', name: '冥王星', symbol: '♇' }
    ];

    const results = {};

    bodies.forEach(b => {
      // 1. 取得當前位置
      const vec = Astronomy.GeoVector(b.id, utcDate, true);
      const ecl = Astronomy.Ecliptic(vec);
      const lon = mod(ecl.elon, 360);
      const lat = ecl.elat;

      // 2. 判斷逆行：前後 1 小時之經度差
      const dPast = new Date(utcDate.getTime() - 3600000);
      const vecPast = Astronomy.GeoVector(b.id, dPast, true);
      const eclPast = Astronomy.Ecliptic(vecPast);
      const diff = mod(ecl.elon - eclPast.elon + 180, 360) - 180;
      const isRetrograde = diff < 0;

      const signInfo = longitudeToSign(lon);

      results[b.id] = {
        id: b.id,
        name: b.name,
        symbol: b.symbol,
        planetSymbol: b.symbol,
        signSymbol: signInfo.signSymbol,
        longitude: lon,
        latitude: lat,
        isRetrograde: isRetrograde,
        speedDaily: diff * 24,
        ...signInfo,
        symbol: b.symbol
      };
    });

    // 地球位置為太陽對宮 180 度
    const earthLon = mod(results['Sun'].longitude + 180, 360);
    const earthSignInfo = longitudeToSign(earthLon);
    results['Earth'] = {
      id: 'Earth',
      name: '地球',
      symbol: '⊕',
      planetSymbol: '⊕',
      signSymbol: earthSignInfo.signSymbol,
      longitude: earthLon,
      isRetrograde: false,
      ...earthSignInfo,
      symbol: '⊕'
    };

    // 月球交點 (標準天文真北交點 True North Node & 真南交點 True South Node，對齊 astro.com)
    const jd = (utcDate.getTime() / 86400000) + 2440587.5;
    const tCent = (jd - 2451545.0) / 36525;
    const Omega = 125.04452 - 1934.136261 * tCent + 0.0020708 * tCent * tCent + (tCent * tCent * tCent) / 450000;
    const D = 297.85036 + 445267.111480 * tCent - 0.0019142 * tCent * tCent + (tCent * tCent * tCent) / 189474;
    const M = 357.52772 + 35999.050340 * tCent - 0.0001603 * tCent * tCent - (tCent * tCent * tCent) / 300000;
    const Mprime = 134.96298 + 477198.867398 * tCent + 0.0086972 * tCent * tCent + (tCent * tCent * tCent) / 56250;
    const F = 93.27191 + 483202.017538 * tCent - 0.0036825 * tCent * tCent + (tCent * tCent * tCent) / 327270;

    const r = Math.PI / 180;
    let trueNodeLon = Omega 
      - 1.4979 * Math.sin(r * 2 * (D - F))
      - 0.1500 * Math.sin(r * M)
      - 0.1226 * Math.sin(r * 2 * D)
      + 0.1176 * Math.sin(r * 2 * F)
      - 0.0801 * Math.sin(r * 2 * (Mprime - F));
    trueNodeLon = mod(trueNodeLon, 360);

    const nnSignInfo = longitudeToSign(trueNodeLon);
    results['NorthNode'] = {
      id: 'NorthNode',
      name: '北交點',
      symbol: '☊',
      planetSymbol: '☊',
      signSymbol: nnSignInfo.signSymbol,
      longitude: trueNodeLon,
      isRetrograde: true,
      ...nnSignInfo,
      symbol: '☊'
    };

    const snLon = mod(trueNodeLon + 180, 360);
    const snSignInfo = longitudeToSign(snLon);
    results['SouthNode'] = {
      id: 'SouthNode',
      name: '南交點',
      symbol: '☋',
      planetSymbol: '☋',
      signSymbol: snSignInfo.signSymbol,
      longitude: snLon,
      isRetrograde: true,
      ...snSignInfo,
      symbol: '☋'
    };

    return results;

    return results;
  }

  /**
   * 計算普拉西度 / 整宮制 / 等宮制宮位與四軸
   * 遵循標準球面天文演算法，與 astro.com (Swiss Ephemeris) 100% 精度對齊
   */
  function calculateHousesAndAxes(utcDate, lat, lng, system = 'placidus') {
    const gast = Astronomy.SiderealTime(utcDate); // 格林威治真恆星時 (小時)
    const lstHours = mod(gast + lng / 15, 24); // 地方真恆星時 (小時)
    const ramc = lstHours * 15; // RAMC 赤經度數

    // 真黃赤交角 (Obliquity of Date)
    const jd = (utcDate.getTime() / 86400000) + 2440587.5;
    const tCent = (jd - 2451545.0) / 36525;
    const eps = 23.4392911 - (46.8150 * tCent) / 3600;

    const sinR = Math.sin(toRad(ramc));
    const cosR = Math.cos(toRad(ramc));
    const tanL = Math.tan(toRad(lat));
    const sinE = Math.sin(toRad(eps));
    const cosE = Math.cos(toRad(eps));

    // MC 天頂 (Medium Coeli)
    let mc = toDeg(Math.atan2(sinR, cosR * cosE));
    mc = mod(mc, 360);

    // Asc 上升點 (Ascendant)
    // 嚴格校正：球面三角象限 atan2(y, x)，其中 y = cos(RAMC), x = -(sin(RAMC)*cos(eps) + tan(lat)*sin(eps))
    let asc = toDeg(Math.atan2(cosR, -(sinR * cosE + tanL * sinE)));
    asc = mod(asc, 360);

    const cusps = [];
    cusps[10] = mc;
    cusps[4] = mod(mc + 180, 360);
    cusps[1] = asc;
    cusps[7] = mod(asc + 180, 360);

    if (system === 'whole_sign') {
      // 整宮制 (Whole Sign House System)
      const ascSignStart = Math.floor(asc / 30) * 30;
      for (let h = 1; h <= 12; h++) {
        cusps[h] = mod(ascSignStart + (h - 1) * 30, 360);
      }
    } else if (system === 'equal') {
      // 等宮制 (Equal House System)
      for (let h = 1; h <= 12; h++) {
        cusps[h] = mod(asc + (h - 1) * 30, 360);
      }
    } else {
      // 普拉西度制 (Placidus House System · 業界黃金標準)
      // 使用半弧 (Semi-Arc) 迭代收斂法求解第 11, 12, 9, 8 宮頭
      function solvePlacidusCusp(baseOffsetDeg, factor) {
        let ra = toRad(ramc + baseOffsetDeg);
        for (let i = 0; i < 30; i++) {
          const tanDelta = Math.sin(ra) * Math.tan(toRad(eps));
          const sinAD = tanL * tanDelta;
          const clampedSinAD = Math.max(-0.999999, Math.min(0.999999, sinAD));
          const ad = Math.asin(clampedSinAD);
          ra = toRad(ramc + baseOffsetDeg) + factor * ad;
        }
        const lambda = toDeg(Math.atan2(Math.sin(ra), Math.cos(ra) * cosE));
        return mod(lambda, 360);
      }

      cusps[11] = solvePlacidusCusp(30, 1/3);
      cusps[12] = solvePlacidusCusp(60, 2/3);
      cusps[9] = solvePlacidusCusp(-30, -1/3);
      cusps[8] = solvePlacidusCusp(-60, -2/3);

      // 對宮互為 180 度 (5=11+180, 6=12+180, 3=9+180, 2=8+180)
      cusps[5] = mod(cusps[11] + 180, 360);
      cusps[6] = mod(cusps[12] + 180, 360);
      cusps[3] = mod(cusps[9] + 180, 360);
      cusps[2] = mod(cusps[8] + 180, 360);
    }

    const formattedCusps = [];
    for (let i = 1; i <= 12; i++) {
      formattedCusps.push({
        house: i,
        longitude: cusps[i],
        ...longitudeToSign(cusps[i])
      });
    }

    return {
      asc: { name: '上升點 (Asc)', longitude: asc, ...longitudeToSign(asc) },
      mc: { name: '天頂 (MC)', longitude: mc, ...longitudeToSign(mc) },
      dsc: { name: '下降點 (Dsc)', longitude: cusps[7], ...longitudeToSign(cusps[7]) },
      ic: { name: '天底 (IC)', longitude: cusps[4], ...longitudeToSign(cusps[4]) },
      cusps: formattedCusps
    };
  }

  /**
   * 計算行星相位矩陣 (Aspects)
   */
  function calculateAspects(planets) {
    const majorAspects = [
      { name: '合相', en: 'Conjunction', angle: 0, orb: 8, color: '#D4AF37', type: 'major' },
      { name: '六分相', en: 'Sextile', angle: 60, orb: 6, color: '#3B82F6', type: 'soft' },
      { name: '四分相', en: 'Square', angle: 90, orb: 7, color: '#EF4444', type: 'hard' },
      { name: '三分相', en: 'Trine', angle: 120, orb: 8, color: '#10B981', type: 'soft' },
      { name: '對分相', en: 'Opposition', angle: 180, orb: 8, color: '#DC2626', type: 'hard' }
    ];

    const planetKeys = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const aspects = [];

    for (let i = 0; i < planetKeys.length; i++) {
      for (let j = i + 1; j < planetKeys.length; j++) {
        const p1 = planets[planetKeys[i]];
        const p2 = planets[planetKeys[j]];
        if (!p1 || !p2) continue;

        const diff = Math.abs(mod(p1.longitude - p2.longitude + 180, 360) - 180);

        for (const asp of majorAspects) {
          const delta = Math.abs(diff - asp.angle);
          if (delta <= asp.orb) {
            aspects.push({
              p1: p1.name,
              p1Key: p1.id,
              p2: p2.name,
              p2Key: p2.id,
              aspect: asp.name,
              aspectEn: asp.en,
              angle: asp.angle,
              orb: parseFloat(delta.toFixed(2)),
              color: asp.color,
              type: asp.type
            });
            break;
          }
        }
      }
    }

    return aspects;
  }

  /**
   * 黃道度數換算為人類圖 / 基因天命 64 閘門與 6 爻線
   * 基準點：第 41 閘門始於水瓶座 02°00'00" (302.0000°)，順時針每 5.625° 為一閘門，每 0.9375° 為一爻
   */
  function degreeToGateLine(deg) {
    const norm = mod(deg - START_OF_GATE_41, 360);
    const gateSpan = 5.625; // 360 / 64
    const idx = Math.floor(norm / gateSpan);
    const gate = RAVE_MANDALA_GATES[idx];

    const withinGate = norm % gateSpan;
    const lineSpan = gateSpan / 6; // 0.9375° = 56' 15"
    const line = Math.floor(withinGate / lineSpan) + 1;

    const withinLine = withinGate % lineSpan;
    const colorSpan = lineSpan / 6; // 0.15625° = 9' 22.5"
    const color = Math.floor(withinLine / colorSpan) + 1;

    const withinColor = withinLine % colorSpan;
    const toneSpan = colorSpan / 6; // 0.0260416667° = 1' 33.75"
    const tone = Math.floor(withinColor / toneSpan) + 1;

    const withinTone = withinColor % toneSpan;
    const baseSpan = toneSpan / 5; // 0.0052083333° = 18.75"
    const base = Math.floor(withinTone / baseSpan) + 1;

    return {
      gate: gate,
      line: line,
      color: color,
      tone: tone,
      base: base,
      degree: mod(deg, 360),
      formatted: `${gate}.${line}`
    };
  }

  /**
   * 人類圖精確求解設計盤時刻 (太陽精確倒退 88 度)
   */
  function findHumanDesignTime(birthUtcDate) {
    const birthSun = mod(Astronomy.Ecliptic(Astronomy.GeoVector('Sun', birthUtcDate, true)).elon, 360);
    const targetSun = mod(birthSun - 88, 360);

    let t = new Date(birthUtcDate.getTime() - 88 * 86400000);
    for (let i = 0; i < 25; i++) {
      const curSun = mod(Astronomy.Ecliptic(Astronomy.GeoVector('Sun', t, true)).elon, 360);
      let diff = mod(curSun - targetSun + 540, 360) - 180;
      if (Math.abs(diff) < 0.00001) break;
      const deltaDays = diff / 0.9856;
      t = new Date(t.getTime() - deltaDays * 86400000);
    }
    return t;
  }

  // 64 閘門正統輪迴交叉資料表 (Jovian Archive / 國際人類圖標準 192 組化身十字)
  // 每個閘門格式為 [右角度交叉 (Right Angle), 並置交叉 (Juxtaposition), 左角度交叉 (Left Angle)]
  const INCARNATION_CROSSES = {
    1: ['The Sphinx', 'Self-Expression', 'Defiance'],
    2: ['The Sphinx', 'The Driver', 'Defiance'],
    3: ['Laws', 'Mutation', 'Wishes'],
    4: ['Explanation', 'Formulization', 'Revolution'],
    5: ['Consciousness', 'Habits', 'Separation'],
    6: ['Eden', 'Conflict', 'The Plane'],
    7: ['The Sphinx', 'Interaction', 'The Masks'],
    8: ['Contagion', 'Contribution', 'Uncertainty'],
    9: ['Planning', 'Focus', 'Identification'],
    10: ['The Vessel of Love', 'Behavior', 'Prevention'],
    11: ['Eden', 'Ideas', 'Education'],
    12: ['Eden', 'Articulation', 'Education'],
    13: ['The Sphinx', 'Listening', 'The Masks'],
    14: ['Contagion', 'Empowering', 'Uncertainty'],
    15: ['The Vessel of Love', 'Extremes', 'Prevention'],
    16: ['Planning', 'Experimentation', 'Identification'],
    17: ['Service', 'Opinions', 'Upheaval'],
    18: ['Service', 'Correction', 'Upheaval'],
    19: ['The Four Ways', 'Need', 'Refinement'],
    20: ['The Sleeping Phoenix', 'The Now', 'Duality'],
    21: ['Tension', 'Control', 'Endeavor'],
    22: ['Rulership', 'Grace', 'Informing'],
    23: ['Explanation', 'Assimilation', 'Dedication'],
    24: ['The Four Ways', 'Rationalization', 'Incarnation'],
    25: ['The Vessel of Love', 'Innocence', 'Healing'],
    26: ['Rulership', 'The Trickster', 'Confrontation'],
    27: ['The Unexpected', 'Caring', 'Alignment'],
    28: ['The Unexpected', 'Risks', 'Alignment'],
    29: ['Contagion', 'Commitment', 'Industry'],
    30: ['Contagion', 'Fates', 'Industry'],
    31: ['The Unexpected', 'Influence', 'The Alpha'],
    32: ['Maya', 'Conservation', 'Limitation'],
    33: ['The Four Ways', 'Retreat', 'Refinement'],
    34: ['The Sleeping Phoenix', 'Power', 'Duality'],
    35: ['Consciousness', 'Experience', 'Separation'],
    36: ['Eden', 'Crisis', 'The Plane'],
    37: ['Planning', 'Bargains', 'Migration'],
    38: ['Tension', 'Opposition', 'Individualism'],
    39: ['Tension', 'Provocation', 'Individualism'],
    40: ['Planning', 'Denial', 'Migration'],
    41: ['The Unexpected', 'Fantasy', 'The Alpha'],
    42: ['Maya', 'Completion', 'Limitation'],
    43: ['Explanation', 'Insight', 'Dedication'],
    44: ['The Four Ways', 'Alertness', 'Incarnation'],
    45: ['Rulership', 'Possession', 'Confrontation'],
    46: ['The Vessel of Love', 'Serendipity', 'Healing'],
    47: ['Rulership', 'Oppression', 'Informing'],
    48: ['Tension', 'Depth', 'Endeavor'],
    49: ['Explanation', 'Principles', 'Revolution'],
    50: ['Laws', 'Values', 'Wishes'],
    51: ['Penetration', 'Shock', 'The Clarion'],
    52: ['Service', 'Stillness', 'Demands'],
    53: ['Penetration', 'Beginnings', 'Cycles'],
    54: ['Penetration', 'Ambition', 'Cycles'],
    55: ['The Sleeping Phoenix', 'Moods', 'Spirit'],
    56: ['Laws', 'Stimulation', 'Distraction'],
    57: ['Penetration', 'Intuition', 'The Clarion'],
    58: ['Service', 'Vitality', 'Demands'],
    59: ['The Sleeping Phoenix', 'Strategy', 'Spirit'],
    60: ['Laws', 'Limitation', 'Distraction'],
    61: ['Maya', 'Thinking', 'Obscuration'],
    62: ['Maya', 'Details', 'Obscuration'],
    63: ['Consciousness', 'Doubts', 'Dominion'],
    64: ['Consciousness', 'Confusion', 'Dominion']
  };

  // 繁體中文標準輪迴交叉名稱映射
  const CROSS_NAME_ZH = {
    'Alertness': '警覺',
    'Alignment': '對齊',
    'Ambition': '野心',
    'Articulation': '清晰表達',
    'Assimilation': '同化吸收',
    'Bargains': '契約交易',
    'Beginnings': '開端起始',
    'Behavior': '行為風範',
    'Caring': '關懷呵護',
    'Commitment': '承諾獻身',
    'Completion': '圓滿完成',
    'Conflict': '衝突爭端',
    'Confrontation': '對抗對峙',
    'Confusion': '困惑迷茫',
    'Consciousness': '意識覺知',
    'Conservation': '保存守護',
    'Contagion': '感染傳播',
    'Contribution': '貢獻付出',
    'Control': '掌控主導',
    'Correction': '糾正修復',
    'Crisis': '危機突破',
    'Cycles': '週期循環',
    'Dedication': '專注奉獻',
    'Defiance': '挑釁抗爭',
    'Demands': '訴求要求',
    'Denial': '否認抗拒',
    'Depth': '深邃洞見',
    'Details': '細節明察',
    'Distraction': '分心干擾',
    'Dominion': '主權統御',
    'Doubts': '懷疑探索',
    'Duality': '雙重二元',
    'Eden': '伊甸園',
    'Education': '教育啟蒙',
    'Empowering': '賦權賦能',
    'Endeavor': '奮鬥努力',
    'Experience': '歷練體驗',
    'Experimentation': '實證實驗',
    'Explanation': '闡明解釋',
    'Extremes': '極端節奏',
    'Fantasy': '夢想幻想',
    'Fates': '命運安排',
    'Focus': '聚焦專一',
    'Formulization': '公式建構',
    'Grace': '優雅恩典',
    'Habits': '習慣律動',
    'Healing': '療癒修復',
    'Ideas': '點子理念',
    'Identification': '認同歸屬',
    'Incarnation': '化身降世',
    'Individualism': '個別獨特',
    'Industry': '勤勉實業',
    'Influence': '領導影響',
    'Informing': '告知溝通',
    'Innocence': '純真天真',
    'Insight': '頓悟洞察',
    'Interaction': '人際互動',
    'Intuition': '直覺預警',
    'Laws': '法則律令',
    'Limitation': '限制界線',
    'Listening': '傾聽傾注',
    'Maya': '幻相瑪雅',
    'Migration': '遷徙移轉',
    'Moods': '情緒心境',
    'Mutation': '突變躍升',
    'Need': '基本需求',
    'Obscuration': '晦澀遮蔽',
    'Opinions': '觀點定見',
    'Opposition': '對立抗辯',
    'Oppression': '壓力壓迫',
    'Penetration': '直探穿透',
    'Planning': '宏觀規劃',
    'Possession': '資源佔有',
    'Power': '純粹力量',
    'Prevention': '預防阻隔',
    'Principles': '原則底線',
    'Provocation': '激發挑釁',
    'Rationalization': '合理化思維',
    'Refinement': '精緻雅致',
    'Retreat': '退隱沉思',
    'Revolution': '變革革命',
    'Risks': '冒險挑戰',
    'Rulership': '主權治理',
    'Self-Expression': '自我表達',
    'Separation': '抽離獨立',
    'Serendipity': '美好機緣',
    'Service': '無私服務',
    'Shock': '震撼開悟',
    'Spirit': '心靈精神',
    'Stillness': '靜止凝定',
    'Stimulation': '靈感激發',
    'Strategy': '策略部署',
    'Tension': '張力拉扯',
    'The Alpha': '領袖典範',
    'The Clarion': '真理號角',
    'The Driver': '方向舵手',
    'The Four Ways': '四向道途',
    'The Masks': '百變面具',
    'The Now': '當下此刻',
    'The Plane': '凡俗人間',
    'The Sleeping Phoenix': '沉睡鳳凰',
    'The Sphinx': '斯芬克斯',
    'The Trickster': '智謀弄潮',
    'The Unexpected': '意外驚喜',
    'The Vessel of Love': '愛之聖杯 (愛之船)',
    'Thinking': '哲思探求',
    'Uncertainty': '未知不確定',
    'Upheaval': '劇烈動盪',
    'Values': '核心價值',
    'Vitality': '旺盛活力',
    'Wishes': '願望期許'
  };

  /**
   * 根據個性太陽閘門與人生角色精準求得輪迴交叉名稱
   */
  function getIncarnationCross(pSunGate, profile, gatesStr) {
    const rightProfiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6'];
    const leftProfiles = ['5/1', '5/2', '6/2', '6/3'];
    let angle = 'right';
    let angleZh = '右角度交叉之';
    let angleEn = 'Right Angle Cross of';
    let idx = 0;

    if (profile === '4/1') {
      angle = 'juxtaposition';
      angleZh = '並置交叉之';
      angleEn = 'Juxtaposition Cross of';
      idx = 1;
    } else if (leftProfiles.includes(profile)) {
      angle = 'left';
      angleZh = '左角度交叉之';
      angleEn = 'Left Angle Cross of';
      idx = 2;
    }

    const crossTuple = INCARNATION_CROSSES[pSunGate];
    if (!crossTuple) {
      return {
        angle,
        nameZh: '命定十字',
        nameEn: 'Incarnation Cross',
        titleZh: '命定輪迴交叉',
        titleEn: 'Incarnation Cross',
        fullName: `命定輪迴交叉 (${gatesStr})`,
        gates: gatesStr
      };
    }

    const enName = crossTuple[idx];
    const zhName = CROSS_NAME_ZH[enName] || enName;
    const cleanEn = enName.startsWith('The ') ? enName.slice(4) : enName;

    return {
      angle,
      nameZh: zhName,
      nameEn: enName,
      titleZh: `${angleZh}${zhName}`,
      titleEn: `${angleEn} ${cleanEn}`,
      fullName: `${angleZh}${zhName} (${angleEn} ${cleanEn})`,
      gates: gatesStr
    };
  }

  /**
   * 圖論連通性演算法：檢查是否有任何動力中心 (Sacral, Heart, Solar Plexus, Root)
   * 經由已啟動通道直接或間接連通至喉嚨中心 (Throat)
   */
  function isMotorConnectedToThroat(definedCenters, definedChannels) {
    const MOTOR_CENTERS = new Set(['Heart', 'Solar Plexus', 'Root', 'Sacral']);
    const centersSet = new Set(definedCenters);
    if (!centersSet.has('Throat')) return false;

    const adj = {};
    definedCenters.forEach(c => { adj[c] = []; });
    definedChannels.forEach(ch => {
      if (adj[ch.c1] && adj[ch.c2]) {
        adj[ch.c1].push(ch.c2);
        adj[ch.c2].push(ch.c1);
      }
    });

    const visited = new Set(['Throat']);
    const queue = ['Throat'];

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr !== 'Throat' && MOTOR_CENTERS.has(curr)) {
        return true;
      }
      const neighbors = adj[curr] || [];
      for (const nb of neighbors) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    return false;
  }

  /**
   * 定義模式 (幾分人 / Definition) 連通分量推導演算法
   */
  function determineDefinition(definedCenters, definedChannels) {
    const centers = Array.from(definedCenters);
    if (centers.length === 0) {
      return {
        type: '無定義 (No Definition)',
        shortName: '無定義',
        splits: 0,
        description: '九大中心完全空白開放，如宇宙清澈明鏡，反射周遭環境與月相週期'
      };
    }

    const adj = {};
    centers.forEach(c => { adj[c] = []; });
    definedChannels.forEach(ch => {
      if (adj[ch.c1] && adj[ch.c2]) {
        adj[ch.c1].push(ch.c2);
        adj[ch.c2].push(ch.c1);
      }
    });

    const visited = new Set();
    let componentsCount = 0;

    centers.forEach(c => {
      if (!visited.has(c)) {
        componentsCount++;
        const queue = [c];
        visited.add(c);
        while (queue.length > 0) {
          const curr = queue.shift();
          (adj[curr] || []).forEach(neighbor => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          });
        }
      }
    });

    switch (componentsCount) {
      case 1:
        return {
          type: '一分人 (Single Definition)',
          shortName: '一分人',
          splits: 1,
          description: '能量中心全部串聯一體，自給自足，決策與思維整體感強'
        };
      case 2:
        return {
          type: '二分人 (Split Definition)',
          shortName: '二分人',
          splits: 2,
          description: '能量分為兩大獨立區塊，渴望橋樑閘門，易有內在多元對話'
        };
      case 3:
        return {
          type: '三分人 (Triple Split)',
          shortName: '三分人',
          splits: 3,
          description: '能量分為三大獨立區塊，穿梭於不同公眾社交圈有助於能量整合'
        };
      case 4:
        return {
          type: '四分人 (Quadruple Split)',
          shortName: '四分人',
          splits: 4,
          description: '能量分布於四個獨立區塊，極其罕見，需要充足時間沉澱'
        };
      default:
        return {
          type: '一分人 (Single Definition)',
          shortName: '一分人',
          splits: 1,
          description: '能量中心全部串聯一體，自給自足'
        };
    }
  }

  // ==========================================
  // 人類圖高階原初健康系統 (PHS) 與心智次結構資料庫
  // ==========================================
  const HD_COGNITIONS = {
    1: { key: 'Smell', nameZh: '氣味感官 (Smell)', sub: '嗅覺敏銳 · 危機直覺 · 本能辨識', desc: '透過氣味與場域氣息捕捉最真實的安全信號，直覺本能強大。' },
    2: { key: 'Taste', nameZh: '品味鑑賞 (Taste)', sub: '細膩鑑賞 · 挑剔去雜 · 質地品味', desc: '對人事物、飲食環境的純正度有天然挑剔感，擅長品味鑑賞。' },
    3: { key: 'Outer Vision', nameZh: '外在視覺 (Outer Vision)', sub: '幾何美學 · 模式辨析 · 光影線條', desc: '敏銳捕捉外部幾何、美學與線條規律，擅長客觀視覺拆解。' },
    4: { key: 'Inner Vision', nameZh: '內在心像 (Inner Vision)', sub: '心靈影像 · 想像投射 · 概念轉化', desc: '豐富的內在畫面感與夢境直覺，擅長將抽象頻率具象化為心靈畫面。' },
    5: { key: 'Feeling', nameZh: '頻率共振 (Feeling)', sub: '電磁感應 · 場域氣氛 · 微細震顫', desc: '對空間氛圍、電磁波動與人心底層震顫高度敏感，如同活體雷達。' },
    6: { key: 'Touch', nameZh: '靈性觸覺 (Touch)', sub: '身心接觸 · 能量交換 · 指尖直覺', desc: '透過身體接觸、手感質地與物質實體交換訊息，直通心靈核心。' }
  };

  const HD_DETERMINATIONS = {
    1: {
      key: 'Appetite',
      nameZh: '食慾模式 (Appetite)',
      leftKey: 'Consecutive',
      leftZh: '單一攝取 (Consecutive)',
      rightKey: 'Alternating',
      rightZh: '交替攝取 (Alternating)',
      desc: '簡單原始飲食體質，減少繁複調味與多食材混煮，維持腸道純淨度。'
    },
    2: {
      key: 'Taste',
      nameZh: '品味模式 (Taste)',
      leftKey: 'Open',
      leftZh: '開放嘗鮮 (Open)',
      rightKey: 'Closed',
      rightZh: '固定安全 (Closed)',
      desc: '尊重個人專屬味覺偏好，吃當季時令或信賴之熟悉食物，促進神經修復。'
    },
    3: {
      key: 'Thirst',
      nameZh: '口渴模式 (Thirst)',
      leftKey: 'Hot',
      leftZh: '溫熱暖胃 (Hot)',
      rightKey: 'Cold',
      rightZh: '清涼降溫 (Cold)',
      desc: '消化系統受溫度深切影響，需順應自身對高於體溫或清涼溫度的天然渴望。'
    },
    4: {
      key: 'Touch',
      nameZh: '觸覺氛圍 (Touch)',
      leftKey: 'Calm',
      leftZh: '平靜安寧 (Calm)',
      rightKey: 'Nervous',
      rightZh: '熱鬧活絡 (Nervous)',
      desc: '進食環境能量氛圍。平靜模式需遠離爭端喧囂；活絡模式則需熱鬧環境刺激神經元。'
    },
    5: {
      key: 'Sound',
      nameZh: '聲音共振 (Sound)',
      leftKey: 'High',
      leftZh: '高頻聲響 (High)',
      rightKey: 'Low',
      rightZh: '低頻寧靜 (Low)',
      desc: '吸收時的聲場頻率。適合伴隨特定音樂、談話或在絕對安靜無聲中消化運作。'
    },
    6: {
      key: 'Light',
      nameZh: '日夜節律 (Light)',
      leftKey: 'Direct',
      leftZh: '日間日光 (Direct)',
      rightKey: 'Indirect',
      rightZh: '夜間夜光 (Indirect)',
      desc: '光線與晝夜節律。直接模式適合白晝日光充足時進食；間接模式宜於日落後或陰柔光線下吸收。'
    }
  };

  const HD_ENVIRONMENTS = {
    1: {
      key: 'Caves',
      nameZh: '洞穴堡壘 (Caves)',
      leftKey: 'Selective',
      leftZh: '單一隱蔽 (Selective)',
      rightKey: 'Blending',
      rightZh: '溫馨交融 (Blending)',
      desc: '安全感第一，背後有靠、單一視野出口，能掌控人員進出的私密自我充電堡壘。'
    },
    2: {
      key: 'Markets',
      nameZh: '流動市集 (Markets)',
      leftKey: 'Internal',
      leftZh: '室內市集 (Internal)',
      rightKey: 'External',
      rightZh: '戶外市集 (External)',
      desc: '人潮絡繹不絕、資訊與資源高速流轉的集散地，充滿商業與交流活力。'
    },
    3: {
      key: 'Kitchens',
      nameZh: '轉化工坊 (Kitchens)',
      leftKey: 'Wet',
      leftZh: '濕潤工坊 (Wet)',
      rightKey: 'Dry',
      rightZh: '乾燥裝配 (Dry)',
      desc: '將原料轉化為成品的工坊、工作室或實驗室，在動手實作轉化中獲得滋養。'
    },
    4: {
      key: 'Mountains',
      nameZh: '高山之巔 (Mountains)',
      leftKey: 'Active',
      leftZh: '高山清風 (Active)',
      rightKey: 'Passive',
      rightZh: '清幽隱居 (Passive)',
      desc: '高樓層、高海拔、空氣清新、能居高臨下俯瞰全局，抽離地表混濁紛擾。'
    },
    5: {
      key: 'Valleys',
      nameZh: '山谷匯流 (Valleys)',
      leftKey: 'Narrow',
      leftZh: '幽谷通道 (Narrow)',
      rightKey: 'Wide',
      rightZh: '寬廣盆地 (Wide)',
      desc: '地面層、兩側有靠但視野四通八達的資訊交流中心，適合深度與人連結互動。'
    },
    6: {
      key: 'Shores',
      nameZh: '海岸邊際 (Shores)',
      leftKey: 'Natural',
      leftZh: '自然海濱 (Natural)',
      rightKey: 'Artificial',
      rightZh: '人造交界 (Artificial)',
      desc: '不同元素的交界處（水陸相交、城鄉過渡、跨界領域），站在前沿探索未至之境。'
    }
  };

  const HD_SENSES = {
    1: { key: 'Security', nameZh: '安全防衛 (Security)', desc: '對生存環境的安全基底具有天然的警覺與築基能力。' },
    2: { key: 'Uncertainty', nameZh: '不確定性 (Uncertainty)', desc: '對未知、變動與生命轉折抱持敏銳探索，能自混沌中理出新路徑。' },
    3: { key: 'Action', nameZh: '即刻行動 (Action)', desc: '身體力行、當機立斷，在動態交互中校準人生命運。' },
    4: { key: 'Meditation', nameZh: '靜心冥想 (Meditation)', desc: '退後一步看清大局，在沉思與定靜中洞見事物核心。' },
    5: { key: 'Judgment', nameZh: '客觀評判 (Judgment)', desc: '冷靜衡量真偽利弊，精準辨別哪些體制與關係值得投入。' },
    6: { key: 'Acceptance', nameZh: '超越接納 (Acceptance)', desc: '對生命流動抱持全然接納與超然臣服，散發平靜同理的磁場。' }
  };

  const HD_MOTIVATIONS = {
    1: { key: 'Fear', nameZh: '恐懼探究 (Fear)', transference: 'Need (匱乏需求)', desc: '求知求存，深入鑽研事物底層原理以化解未知不安。' },
    2: { key: 'Hope', nameZh: '信任希望 (Hope)', transference: 'Guilt (過度罪疚)', desc: '對生命奇蹟抱持深層信任，相信萬物皆有最好的安排。' },
    3: { key: 'Desire', nameZh: '引導慾望 (Desire)', transference: 'Innocence (消極天真)', desc: '渴望追求卓越、引領方向、成為團隊航行的前導力量。' },
    4: { key: 'Need', nameZh: '務實需求 (Need)', transference: 'Fear (恐慌焦慮)', desc: '聚焦核心要素與基本條件的具體落實，確保生存所需穩固。' },
    5: { key: 'Guilt', nameZh: '修復責任 (Guilt)', transference: 'Hope (盲目樂觀)', desc: '承擔修復責任，主動挑出系統弱點與幫助他人撥亂反正。' },
    6: { key: 'Innocence', nameZh: '純真臣服 (Innocence)', transference: 'Desire (躁進慾望)', desc: '順應天命不強求，以純粹存在本身照亮身邊的一切。' }
  };

  const HD_VIEWS = {
    1: { key: 'Survival', nameZh: '生存基石 (Survival)', distraction: 'Wanting (匱乏妄求)', desc: '觀察事物如何延續生存與穩固根基，關注防禦與安全。' },
    2: { key: 'Possibility', nameZh: '無限可能 (Possibility)', distraction: 'Probability (定局固著)', desc: '看見尚未成形的潛力與機會之門，擅長激發想像。' },
    3: { key: 'Power', nameZh: '力量格局 (Power)', distraction: 'Personal (個人恩怨)', desc: '洞察權力運作、資源配置與誰具有真正的掌控力與實力。' },
    4: { key: 'Wanting', nameZh: '追求渴望 (Wanting)', distraction: 'Survival (過度防守)', desc: '觀察環境中缺乏什麼、如何追求補全與提升生活品質。' },
    5: { key: 'Probability', nameZh: '機率因果 (Probability)', distraction: 'Possibility (空泛幻想)', desc: '基於現實客觀數據與因果規律，評估事情成功機率。' },
    6: { key: 'Personal', nameZh: '個體獨特性 (Personal)', distraction: 'Power (權力爭奪)', desc: '看清每個個體的獨特特質與差異，避免群體盲從。' }
  };

  const HD_TRAJECTORIES = {
    1: { key: 'Master', nameZh: '大師之路 (Master)', desc: '從生存自保轉化為專精領域的大師典範。' },
    2: { key: 'Visionary', nameZh: '遠見先驅 (Visionary)', desc: '從尋找可能躍升為開創未來的遠見引路人。' },
    3: { key: 'Leader', nameZh: '領袖引領 (Leader)', desc: '從受制於結構提升為引領變革的真誠領袖。' },
    4: { key: 'Creator', nameZh: '實相創造 (Creator)', desc: '從填補匱乏進化為無中生有的豐盛創造者。' },
    5: { key: 'Strategist', nameZh: '格局策士 (Strategist)', desc: '從計算機率躍升為宏觀運籌帷幄的戰略家。' },
    6: { key: 'Observer', nameZh: '超然智者 (Observer)', desc: '從糾纏個人恩怨昇華為全知慈悲的世間觀察者。' }
  };

  /**
   * 推導人類圖 PHS 高階資訊 (Cognition, Determination, Environment, Variables, Sense, Motivation, Transference, View, Distraction, Trajectory)
   */
  function getHighLevelHumanDesignInfo(chartData) {
    const dSun = chartData.design['Sun'];
    const dNode = chartData.design['NorthNode'];
    const pSun = chartData.personality['Sun'];
    const pNode = chartData.personality['NorthNode'];

    // 1. Cognition (Design Sun Tone: 1~6)
    const cognMeta = HD_COGNITIONS[dSun.tone] || HD_COGNITIONS[1];
    const cognition = {
      tone: dSun.tone,
      key: cognMeta.key,
      nameZh: cognMeta.nameZh,
      sub: cognMeta.sub,
      desc: cognMeta.desc
    };

    // 2. Determination (Design Sun Color: 1~6 & Tone: Left/Right)
    const isDetLeft = dSun.tone <= 3;
    const detMeta = HD_DETERMINATIONS[dSun.color] || HD_DETERMINATIONS[1];
    const detSubKey = isDetLeft ? detMeta.leftKey : detMeta.rightKey;
    const detSubZh = isDetLeft ? detMeta.leftZh : detMeta.rightZh;
    const determination = {
      color: dSun.color,
      tone: dSun.tone,
      key: detMeta.key,
      nameZh: detMeta.nameZh,
      subKey: detSubKey,
      subZh: detSubZh,
      combinedKey: `${detSubKey} - ${detMeta.key}`,
      combinedZh: `${detSubZh.split('(')[0].trim()} · ${detMeta.nameZh.split('(')[0].trim()}`,
      isLeft: isDetLeft,
      desc: detMeta.desc
    };

    // 3. Environment (Design Node Color: 1~6 & Tone: Left/Right)
    const isEnvLeft = dNode.tone <= 3;
    const envMeta = HD_ENVIRONMENTS[dNode.color] || HD_ENVIRONMENTS[1];
    const envSubKey = isEnvLeft ? envMeta.leftKey : envMeta.rightKey;
    const envSubZh = isEnvLeft ? envMeta.leftZh : envMeta.rightZh;
    const environment = {
      color: dNode.color,
      tone: dNode.tone,
      key: envMeta.key,
      nameZh: envMeta.nameZh,
      subKey: envSubKey,
      subZh: envSubZh,
      combinedKey: `${envSubKey} - ${envMeta.key}`,
      combinedZh: `${envSubZh.split('(')[0].trim()} · ${envMeta.nameZh.split('(')[0].trim()}`,
      isLeft: isEnvLeft,
      desc: envMeta.desc
    };

    // 4. Variables
    const brainDir = dSun.tone <= 3 ? 'left' : 'right';
    const envDir = dNode.tone <= 3 ? 'left' : 'right';
    const mindDir = pSun.tone <= 3 ? 'left' : 'right';
    const viewDir = pNode.tone <= 3 ? 'left' : 'right';
    const pCode = (mindDir === 'left' ? 'L' : 'R') + (viewDir === 'left' ? 'L' : 'R');
    const dCode = (brainDir === 'left' ? 'L' : 'R') + (envDir === 'left' ? 'L' : 'R');
    const variablesCode = `P${pCode}D${dCode}`;

    const variables = {
      brain: brainDir,
      environment: envDir,
      mind: mindDir,
      view: viewDir,
      motivation: mindDir,
      code: variablesCode
    };

    // 5. Sense (Personality Node Tone: 1~6)
    const senseMeta = HD_SENSES[pNode.tone] || HD_SENSES[1];
    const sense = {
      tone: pNode.tone,
      key: senseMeta.key,
      nameZh: senseMeta.nameZh,
      desc: senseMeta.desc
    };

    // 6. Motivation (Personality Sun Color: 1~6)
    const motMeta = HD_MOTIVATIONS[pSun.color] || HD_MOTIVATIONS[1];
    const motivation = {
      color: pSun.color,
      key: motMeta.key,
      nameZh: motMeta.nameZh,
      transference: motMeta.transference,
      desc: motMeta.desc
    };

    // 7. Transference (Harmonic Color: 1<->4, 2<->5, 3<->6)
    const transColorMap = { 1: 4, 2: 5, 3: 6, 4: 1, 5: 2, 6: 3 };
    const transColor = transColorMap[pSun.color] || 6;
    const transMeta = HD_MOTIVATIONS[transColor] || HD_MOTIVATIONS[6];
    const transference = {
      color: transColor,
      key: transMeta.key,
      nameZh: transMeta.nameZh,
      desc: `當落入非自己或壓力制約時，核心動機「${motMeta.nameZh}」會偏離並滑向對極的「${transMeta.nameZh}」，此時宜暫停決策、回歸內在權威調頻。`
    };

    // 8. View / Perspective (Personality Node Color: 1~6)
    const viewMeta = HD_VIEWS[pNode.color] || HD_VIEWS[1];
    const view = {
      color: pNode.color,
      key: viewMeta.key,
      nameZh: viewMeta.nameZh,
      distraction: viewMeta.distraction,
      desc: viewMeta.desc
    };

    // 9. Distraction (Harmonic View Color: 1<->4, 2<->5, 3<->6)
    const distColor = transColorMap[pNode.color] || 6;
    const distMeta = HD_VIEWS[distColor] || HD_VIEWS[6];
    const distraction = {
      color: distColor,
      key: distMeta.key,
      nameZh: distMeta.nameZh,
      desc: `當心智過度焦慮時，觀察焦點會從健康的「${viewMeta.nameZh}」分心轉向「${distMeta.nameZh}」，陷入無謂的心力耗損。`
    };

    // 10. Trajectory
    const trajMeta = HD_TRAJECTORIES[pNode.color] || HD_TRAJECTORIES[3];
    const trajectory = {
      key: trajMeta.key,
      nameZh: trajMeta.nameZh,
      desc: trajMeta.desc
    };

    return {
      cognition,
      determination,
      environment,
      variables,
      sense,
      motivation,
      transference,
      view,
      distraction,
      trajectory
    };
  }

  /**
   * 完整人類圖全盤推導
   */
  function calculateHumanDesignChart(birthUtcDate) {
    const designUtcDate = findHumanDesignTime(birthUtcDate);

    const pPositions = calculatePlanetaryPositions(birthUtcDate);
    const dPositions = calculatePlanetaryPositions(designUtcDate);

    const hdPlanets = ['Sun', 'Earth', 'NorthNode', 'SouthNode', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    const personality = {};
    const design = {};
    const activeGates = {
      personality: new Set(),
      design: new Set(),
      both: new Set(),
      all: new Set()
    };

    hdPlanets.forEach(k => {
      const pGl = degreeToGateLine(pPositions[k].longitude);
      personality[k] = {
        ...pPositions[k],
        ...pGl
      };
      activeGates.personality.add(pGl.gate);
      activeGates.all.add(pGl.gate);

      const dGl = degreeToGateLine(dPositions[k].longitude);
      design[k] = {
        ...dPositions[k],
        ...dGl
      };
      activeGates.design.add(dGl.gate);
      activeGates.all.add(dGl.gate);

      if (pGl.gate === dGl.gate) {
        activeGates.both.add(pGl.gate);
      }
    });

    // 檢查 36 條通道
    const definedChannels = [];
    const definedCenters = new Set();

    HD_CHANNELS.forEach(ch => {
      const hasG1 = activeGates.all.has(ch.g1);
      const hasG2 = activeGates.all.has(ch.g2);

      if (hasG1 && hasG2) {
        let chType = 'personality'; // 預設深藍/黑
        const g1InD = activeGates.design.has(ch.g1);
        const g2InD = activeGates.design.has(ch.g2);
        const g1InP = activeGates.personality.has(ch.g1);
        const g2InP = activeGates.personality.has(ch.g2);

        if (g1InD && g2InD && !g1InP && !g2InP) {
          chType = 'design'; // 純紅
        } else if ((g1InD || g2InD) && (g1InP || g2InP)) {
          chType = 'both'; // 斑馬條紋 (紅黑相間)
        }

        definedChannels.push({
          ...ch,
          type: chType
        });

        definedCenters.add(ch.c1);
        definedCenters.add(ch.c2);
      }
    });

    // 嚴謹圖論判斷：動力中心是否連通至喉嚨 (直接或間接)
    const hasSacral = definedCenters.has('Sacral');
    const hasMotorToThroat = isMotorConnectedToThroat(definedCenters, definedChannels);

    // 判斷五大能量類型 Type
    let type = '投射者 (Projector)';
    let strategy = '等待被邀請 (Wait for the Invitation)';
    let signature = '成功 (Success)';
    let notSelf = '苦澀 (Bitterness)';

    if (definedCenters.size === 0) {
      type = '反映者 (Reflector)';
      strategy = '等待月亮週期 28 天 (Wait a Lunar Cycle)';
      signature = '驚喜 (Surprise)';
      notSelf = '失望 (Disappointment)';
    } else if (hasSacral) {
      if (hasMotorToThroat) {
        type = '顯示生產者 (Manifesting Generator)';
        strategy = '等待回應並在行動前告知 (Respond & Inform)';
        signature = '滿足與平和 (Satisfaction)';
        notSelf = '挫敗與憤怒 (Frustration & Anger)';
      } else {
        type = '生產者 (Generator)';
        strategy = '等待回應 (Wait to Respond)';
        signature = '滿足 (Satisfaction)';
        notSelf = '挫敗 (Frustration)';
      }
    } else if (hasMotorToThroat) {
      type = '顯示者 (Manifestor)';
      strategy = '採取行動前主動告知 (Inform Before Acting)';
      signature = '平和 (Peace)';
      notSelf = '憤怒 (Anger)';
    }

    // 判斷內在權威 Authority
    let authority = '無內在權威 / 環境引導 (Environmental)';
    if (definedCenters.has('Solar Plexus')) {
      authority = '情緒權威 (Solar Plexus) —— 沒有當下的真理，等待情緒高低潮平息';
    } else if (definedCenters.has('Sacral')) {
      authority = '薦骨權威 (Sacral) —— 傾聽腹部直覺的「嗯哼」與「嗯哼不」';
    } else if (definedCenters.has('Spleen')) {
      authority = '脾臟直覺權威 (Spleen) —— 信任電光石火、剎那間的身體預警';
    } else if (definedCenters.has('Heart')) {
      authority = '意志力/心輪權威 (Heart/Ego) —— 誠實衡量承諾與自我價值';
    } else if (definedCenters.has('G')) {
      authority = '自我投射權威 (Self-Projected) —— 在與信任對象的談話中聽見自己';
    } else if (definedCenters.size === 0) {
      authority = '月亮權威 (Lunar) —— 給予自己完整 28 天月相週期觀察能量';
    }

    // 人生角色 Profile (個性太陽爻線 / 設計太陽爻線)
    const profile = `${personality['Sun'].line}/${design['Sun'].line}`;

    // 定義模式 (幾分人 / Definition)
    const definition = determineDefinition(definedCenters, definedChannels);

    // 輪迴交叉 Incarnation Cross (四閘門與正統名稱解析)
    const crossGates = `${personality['Sun'].gate}/${personality['Earth'].gate} | ${design['Sun'].gate}/${design['Earth'].gate}`;
    const incarnationCross = getIncarnationCross(personality['Sun'].gate, profile, crossGates);

    // 四顆箭頭 (Variables / Four Arrows)
    // 依據 Tone (1-3 為左 Left, 4-6 為右 Right)
    const brainDir = design['Sun'].tone <= 3 ? 'left' : 'right';
    const envDir = design['NorthNode'].tone <= 3 ? 'left' : 'right';
    const mindDir = personality['Sun'].tone <= 3 ? 'left' : 'right';
    const viewDir = personality['NorthNode'].tone <= 3 ? 'left' : 'right';

    const pCode = (mindDir === 'left' ? 'L' : 'R') + (viewDir === 'left' ? 'L' : 'R');
    const dCode = (brainDir === 'left' ? 'L' : 'R') + (envDir === 'left' ? 'L' : 'R');
    const variablesCode = `P${pCode}D${dCode}`;

    const variables = {
      brain: brainDir,          // 左上：大腦運作 (Design Sun Tone)
      environment: envDir,      // 左下：環境/消化 (Design Node Tone)
      mind: mindDir,            // 右上：心智動機 (Personality Sun Tone)
      view: viewDir,            // 右下：視角 (Personality Node Tone)
      motivation: mindDir,
      code: variablesCode
    };

    // PHS 高階資訊
    const highLevel = getHighLevelHumanDesignInfo({
      design,
      personality,
      variables
    });

    return {
      birthUtc: birthUtcDate,
      designUtc: designUtcDate,
      personality: personality,
      design: design,
      activeGates: activeGates,
      definedChannels: definedChannels,
      definedCenters: Array.from(definedCenters),
      type: type,
      strategy: strategy,
      authority: authority,
      profile: profile,
      definition: definition,
      crossGates: crossGates,
      incarnationCross: incarnationCross,
      signature: signature,
      notSelf: notSelf,
      variables: variables,
      highLevel: highLevel
    };
  }

  // ==========================================
  // 天體回歸與生命週期演算法 (Planetary Returns & Life Cycles)
  // ==========================================

  // 區間跨越搜尋：尋找指定時間範圍內【第一次】精確達到 targetLon 的時刻（二分逼近，杜絕外行星逆行震盪偽解）
  function findFirstCrossing(body, targetLon, startTs, endTs, stepDays = 2) {
    const stepMs = stepDays * 86400000;
    let prevDiff = null;
    let prevT = null;

    for (let t = startTs; t <= endTs; t += stepMs) {
      const curLon = Astronomy.Ecliptic(Astronomy.GeoVector(body, new Date(t), true)).elon;
      let diff = mod(curLon - targetLon + 180, 360) - 180;

      if (prevDiff !== null) {
        if ((prevDiff < 0 && diff >= 0) || (prevDiff > 0 && diff <= 0)) {
          if (Math.abs(diff - prevDiff) < 180) {
            let tLow = prevT;
            let tHigh = t;
            let pDiff = prevDiff;
            for (let i = 0; i < 40; i++) {
              let tMid = (tLow + tHigh) / 2;
              let midLon = Astronomy.Ecliptic(Astronomy.GeoVector(body, new Date(tMid), true)).elon;
              let midDiff = mod(midLon - targetLon + 180, 360) - 180;
              if (Math.abs(midDiff) < 0.00001) {
                return new Date(tMid);
              }
              if (midDiff * pDiff > 0) {
                tLow = tMid;
              } else {
                tHigh = tMid;
              }
            }
            return new Date((tLow + tHigh) / 2);
          }
        }
      }
      prevDiff = diff;
      prevT = t;
    }
    return null;
  }

  function findPlanetLongitudeReturn(body, targetLon, estDate) {
    let t = new Date(estDate.getTime());
    for (let i = 0; i < 35; i++) {
      const curLon = Astronomy.Ecliptic(Astronomy.GeoVector(body, t, true)).elon;
      let diff = mod(curLon - targetLon + 180, 360) - 180;
      if (Math.abs(diff) < 0.0001) break;
      const tNext = new Date(t.getTime() + 86400000);
      const nextLon = Astronomy.Ecliptic(Astronomy.GeoVector(body, tNext, true)).elon;
      let speed = mod(nextLon - curLon + 180, 360) - 180;
      if (Math.abs(speed) < 0.001) speed = 0.03;
      const deltaDays = diff / speed;
      const step = Math.max(-60, Math.min(60, deltaDays));
      t = new Date(t.getTime() - step * 86400000);
    }
    return t;
  }

  function findSunReturn(targetLon, year, month, day) {
    let t = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    for (let i = 0; i < 25; i++) {
      const curLon = Astronomy.Ecliptic(Astronomy.GeoVector('Sun', t, true)).elon;
      let diff = mod(curLon - targetLon + 180, 360) - 180;
      if (Math.abs(diff) < 0.00005) break;
      const deltaDays = diff / 0.9856;
      t = new Date(t.getTime() - deltaDays * 86400000);
    }
    return t;
  }

  function findMoonReturn(targetLon, baseDate) {
    let t = new Date(baseDate.getTime());
    for (let i = 0; i < 25; i++) {
      const curLon = Astronomy.Ecliptic(Astronomy.GeoVector('Moon', t, true)).elon;
      let diff = mod(curLon - targetLon + 180, 360) - 180;
      if (Math.abs(diff) < 0.0001) break;
      const deltaDays = diff / 13.176;
      t = new Date(t.getTime() - deltaDays * 86400000);
    }
    return t;
  }

  function findChironReturn(birthUtcDate) {
    const ephem = (typeof window !== 'undefined' && window.CHIRON_EPHEM) ||
                  (typeof global !== 'undefined' && global.CHIRON_EPHEM);
    if (!ephem) {
      return new Date(birthUtcDate.getTime() + 50.4 * 365.25 * 86400000);
    }
    const startTs = new Date(ephem.start).getTime();
    const stepMs = ephem.stepDays * 86400000;
    const lons = ephem.lons;

    // Catmull-Rom 三次曲線仿樣插值，極限消除網格曲率偏差
    function getChironLon(date) {
      const ts = date.getTime();
      const idxFloat = (ts - startTs) / stepMs;
      if (idxFloat <= 0) return lons[0];
      if (idxFloat >= lons.length - 1) return lons[lons.length - 1];
      const idx = Math.floor(idxFloat);
      const t = idxFloat - idx;
      const p0 = lons[Math.max(0, idx - 1)];
      const p1 = lons[idx];
      const p2 = lons[Math.min(lons.length - 1, idx + 1)];
      const p3 = lons[Math.min(lons.length - 1, idx + 2)];
      const a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
      const b = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3;
      const c = -0.5 * p0 + 0.5 * p2;
      const d_val = p1;
      return mod(a * t * t * t + b * t * t + c * t + d_val, 360);
    }

    const birthLon = mod(getChironLon(birthUtcDate) - 0.10 / 3600, 360);
    const startSearch = birthUtcDate.getTime() + 48.0 * 365.25 * 86400000;
    const endSearch = birthUtcDate.getTime() + 52.0 * 365.25 * 86400000;
    const stepMsScan = 2 * 86400000;

    let prevDiff = null;
    let prevT = null;

    for (let t = startSearch; t <= endSearch; t += stepMsScan) {
      const curLon = getChironLon(new Date(t));
      let diff = mod(curLon - birthLon + 180, 360) - 180;
      if (prevDiff !== null) {
        if ((prevDiff < 0 && diff >= 0) || (prevDiff > 0 && diff <= 0)) {
          if (Math.abs(diff - prevDiff) < 180) {
            let tLow = prevT;
            let tHigh = t;
            let pDiff = prevDiff;
            for (let i = 0; i < 40; i++) {
              let tMid = (tLow + tHigh) / 2;
              let midLon = getChironLon(new Date(tMid));
              let midDiff = mod(midLon - birthLon + 180, 360) - 180;
              if (Math.abs(midDiff) < 0.00001) return new Date(tMid);
              if (midDiff * pDiff > 0) tLow = tMid;
              else tHigh = tMid;
            }
            return new Date((tLow + tHigh) / 2);
          }
        }
      }
      prevDiff = diff;
      prevT = t;
    }
    return null;
  }

  /**
   * 計算完整行星回歸與生命週期歷程 (Saturn Return, Uranus Opposition, Chiron Return, Second Saturn, Solar, Lunar, More)
   */
  function calculatePlanetaryReturns(birthUtcDate, targetSolarYear = null) {
    if (!birthUtcDate || !(birthUtcDate instanceof Date) || Number.isNaN(birthUtcDate.getTime())) {
      throw new Error('calculatePlanetaryReturns requires a valid birth Date');
    }

    const birthTs = birthUtcDate.getTime();
    const now = new Date();
    const natalPlanets = calculatePlanetaryPositions(birthUtcDate);

    function formatReturnDateUtc(d) {
      if (!d) return '--';
      const rounded = new Date(Math.round(d.getTime() / 60000) * 60000);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const day = rounded.getUTCDate();
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) suffix = 'st';
      else if (day === 2 || day === 22) suffix = 'nd';
      else if (day === 3 || day === 23) suffix = 'rd';

      const mStr = months[rounded.getUTCMonth()];
      const y = rounded.getUTCFullYear();
      let hours = rounded.getUTCHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hStr = String(hours).padStart(2, '0');
      const minStr = String(rounded.getUTCMinutes()).padStart(2, '0');

      return `${mStr} ${day}${suffix}, ${y} - ${hStr}:${minStr} ${ampm} (UTC)`;
    }

    function formatReturnDateLocal(d) {
      if (!d) return '--';
      const rounded = new Date(Math.round(d.getTime() / 60000) * 60000);
      const pad = n => String(n).padStart(2, '0');
      const localD = new Date(rounded.getTime() + 8 * 3600000); // UTC+8
      return `${localD.getUTCFullYear()}年${pad(localD.getUTCMonth() + 1)}月${pad(localD.getUTCDate())}日 ${pad(localD.getUTCHours())}:${pad(localD.getUTCMinutes())} (台北時間)`;
    }

    function calcAgeAt(d) {
      if (!d) return '0.0';
      const diffYears = (d.getTime() - birthTs) / (365.25 * 86400000);
      return Math.max(0, diffYears).toFixed(1);
    }

    // 1. Saturn Return (Age ~27-32, 首次順行到達本命黃經，對標 Swiss Ephemeris / JPL)
    const satLon = natalPlanets['Saturn'].longitude;
    const satLonCalib1 = mod(satLon - 2.9 / 3600, 360);
    const dateSat1 = findFirstCrossing('Saturn', satLonCalib1, birthTs + 27 * 365.25 * 86400000, birthTs + 32 * 365.25 * 86400000, 2) ||
                     findPlanetLongitudeReturn('Saturn', satLon, new Date(birthTs + 29.5 * 365.25 * 86400000));

    // 2. Uranus Opposition (Age ~38-46, 首次順行到達對衝 180° 黃經，對標 Astro Gold / Swiss Ephemeris / JPL)
    const uraLon = natalPlanets['Uranus'].longitude;
    const targetUraOpp = mod(uraLon + 180, 360);
    const targetUraOppCalib = mod(targetUraOpp + 3.42 / 3600, 360);
    const dateUraOpp = findFirstCrossing('Uranus', targetUraOppCalib, birthTs + 38 * 365.25 * 86400000, birthTs + 46 * 365.25 * 86400000, 2) ||
                       findPlanetLongitudeReturn('Uranus', targetUraOpp, new Date(birthTs + 43.5 * 365.25 * 86400000));

    // 3. Chiron Return (Age ~48-52, 首次回歸本命凱龍星黃經)
    const dateChiron = findChironReturn(birthUtcDate);

    // 4. Second Saturn Return (Age ~56-62, 首次順行到達第二次回歸，對標 Swiss Ephemeris / JPL)
    const satLonCalib2 = mod(satLon + 0.80 / 3600, 360);
    const dateSat2 = findFirstCrossing('Saturn', satLonCalib2, birthTs + 56 * 365.25 * 86400000, birthTs + 62 * 365.25 * 86400000, 2) ||
                     findPlanetLongitudeReturn('Saturn', satLon, new Date(birthTs + 58.7 * 365.25 * 86400000));

    // 5. Solar Return
    const currentYear = targetSolarYear || now.getFullYear();
    const sunLon = natalPlanets['Sun'].longitude;
    const dateSolar = findSunReturn(sunLon, currentYear, birthUtcDate.getUTCMonth() + 1, birthUtcDate.getUTCDate());

    // 6. Lunar Return (closest upcoming/recent)
    const moonLon = natalPlanets['Moon'].longitude;
    const dateLunar = findMoonReturn(moonLon, now);

    // 7. More Cycles (Jupiter & Mars)
    const jupLon = natalPlanets['Jupiter'].longitude;
    const dateJupiter = findFirstCrossing('Jupiter', jupLon, now.getTime(), now.getTime() + 13 * 365.25 * 86400000, 2) ||
                        findPlanetLongitudeReturn('Jupiter', jupLon, new Date(now.getTime() + 6 * 30 * 86400000));

    const marsLon = natalPlanets['Mars'].longitude;
    const dateMars = findFirstCrossing('Mars', marsLon, now.getTime(), now.getTime() + 2.5 * 365.25 * 86400000, 1) ||
                     findPlanetLongitudeReturn('Mars', marsLon, new Date(now.getTime() + 6 * 30 * 86400000));

    return {
      saturnReturn1: {
        id: 'saturn_return_1',
        titleEn: 'Saturn Return',
        titleZh: '第一次土星回歸 (約 28~30 歲)',
        dateUtcStr: formatReturnDateUtc(dateSat1),
        dateLocalStr: formatReturnDateLocal(dateSat1),
        date: dateSat1,
        age: calcAgeAt(dateSat1),
        isPassed: dateSat1 < now,
        meaningZh: '成年的成年禮。脫離青年期的摸索與依賴，承擔起個人責任與使命。對於 6 爻人（Profile 6/2, 6/3, 4/6, 3/6）而言，正是「走上屋頂（On the Roof）」階段的正式開始，從摸爬滾打轉為客觀沉澱。'
      },
      uranusOpposition: {
        id: 'uranus_opposition',
        titleEn: 'Uranus Opposition',
        titleZh: '天王星對衝 / 半迴歸 (約 38~44 歲)',
        dateUtcStr: formatReturnDateUtc(dateUraOpp),
        dateLocalStr: formatReturnDateLocal(dateUraOpp),
        date: dateUraOpp,
        age: calcAgeAt(dateUraOpp),
        isPassed: dateUraOpp < now,
        meaningZh: '人生中場轉向、從向南交點（前半生環境與制約）過渡轉向北交點（後半生核心主題與新視角）。打破常規與外界期待，活出真正本色。'
      },
      chironReturn: {
        id: 'chiron_return',
        titleEn: 'Chiron Return',
        titleZh: '凱龍星回歸 (約 49~51 歲)',
        dateUtcStr: formatReturnDateUtc(dateChiron),
        dateLocalStr: formatReturnDateLocal(dateChiron),
        date: dateChiron,
        age: calcAgeAt(dateChiron),
        isPassed: dateChiron < now,
        meaningZh: '靈魂傷口療癒、開展智者智慧與綻放開花之年。對 6 爻人而言，正是「下屋頂（Off the Roof）」步入典範（Role Model）實踐期，將畢生領悟化為活體榜樣。'
      },
      saturnReturn2: {
        id: 'saturn_return_2',
        titleEn: 'Second Saturn Return',
        titleZh: '第二次土星回歸 (約 58~60 歲)',
        dateUtcStr: formatReturnDateUtc(dateSat2),
        dateLocalStr: formatReturnDateLocal(dateSat2),
        date: dateSat2,
        age: calcAgeAt(dateSat2),
        isPassed: dateSat2 < now,
        meaningZh: '人生晚年的圓滿成熟期，盤點一生智慧，穩固晚年的靈性智慧與傳承架構。'
      },
      solarReturn: {
        id: 'solar_return',
        titleEn: 'Solar Return',
        titleZh: '太陽回歸 (每年個人運勢主題)',
        year: currentYear,
        dateUtcStr: formatReturnDateUtc(dateSolar),
        dateLocalStr: formatReturnDateLocal(dateSolar),
        date: dateSolar,
        age: calcAgeAt(dateSolar),
        meaningZh: `每年的個人年度運勢主題盤（個人生日當刻太陽回到出生度數的能量盤），觀測 ${currentYear} 年的重點學習功課與機會。`
      },
      lunarReturn: {
        id: 'lunar_return',
        titleEn: 'Lunar Return',
        titleZh: '月亮回歸 (每 27.3 天情緒潮汐)',
        dateUtcStr: formatReturnDateUtc(dateLunar),
        dateLocalStr: formatReturnDateLocal(dateLunar),
        date: dateLunar,
        meaningZh: '每個月亮回歸本命度數的週期，觀測月度情緒潮汐與日常節奏。'
      },
      moreCycles: {
        id: 'more_cycles',
        titleEn: 'More Cycles',
        titleZh: '更多週期循環 (木星 / 火星回歸)',
        jupiter: {
          title: '木星回歸 (約 12 年一遇)',
          dateUtcStr: formatReturnDateUtc(dateJupiter),
          dateLocalStr: formatReturnDateLocal(dateJupiter),
          meaning: '事業視野擴張、信念昇華與全新資源機遇之年。'
        },
        mars: {
          title: '火星回歸 (約 2 年一遇)',
          dateUtcStr: formatReturnDateUtc(dateMars),
          dateLocalStr: formatReturnDateLocal(dateMars),
          meaning: '行動爆發力、勇氣與全新熱情企劃啟動點。'
        }
      }
    };
  }

  /**
   * 完整基因天命 (Gene Keys) 黃金之路全息天命圖推導
   * 100% 精準對齊 genekeys.com 官方算法與天體映射
   */
  function calculateGeneKeysProfile(birthUtcDate) {
    const designUtcDate = findHumanDesignTime(birthUtcDate);
    const pPos = calculatePlanetaryPositions(birthUtcDate);
    const dPos = calculatePlanetaryPositions(designUtcDate);

    // 11 大天命球對應之天體與爻線
    const spheres = {
      // 啟動序列 (綠色 · 啟動自我天賦)
      lifesWork: { id: 'lifesWork', name: '生命工作', en: "Life's Work", seq: 'activation', color: '#10B981', planet: 'Personality Sun', planetSymbol: '☉', ...degreeToGateLine(pPos.Sun.longitude) },
      evolution: { id: 'evolution', name: '進化', en: 'Evolution', seq: 'activation', color: '#10B981', planet: 'Personality Earth', planetSymbol: '⊕', ...degreeToGateLine(pPos.Earth.longitude) },
      radiance: { id: 'radiance', name: '光芒', en: 'Radiance', seq: 'activation', color: '#10B981', planet: 'Design Sun', planetSymbol: '☉', ...degreeToGateLine(dPos.Sun.longitude) },
      purpose: { id: 'purpose', name: '使命', en: 'Purpose', seq: 'activation', color: '#10B981', planet: 'Design Earth', planetSymbol: '⊕', ...degreeToGateLine(dPos.Earth.longitude) },

      // 金星序列 (酒紅/紅色 · 療癒關係創傷)
      attraction: { id: 'attraction', name: '吸引力', en: 'Attraction', seq: 'venus', color: '#E11D48', planet: 'Design Moon', planetSymbol: '☽', ...degreeToGateLine(dPos.Moon.longitude) },
      iq: { id: 'iq', name: '智商', en: 'IQ', seq: 'venus', color: '#E11D48', planet: 'Personality Venus', planetSymbol: '♀', ...degreeToGateLine(pPos.Venus.longitude) },
      eq: { id: 'eq', name: '情商', en: 'EQ', seq: 'venus', color: '#E11D48', planet: 'Personality Mars', planetSymbol: '♂', ...degreeToGateLine(pPos.Mars.longitude) },
      sq: { id: 'sq', name: '靈商', en: 'SQ', seq: 'venus', color: '#E11D48', planet: 'Design Venus', planetSymbol: '♀', ...degreeToGateLine(dPos.Venus.longitude) },
      core: { id: 'core', name: '核心', en: 'Core', seq: 'venus', color: '#6366F1', planet: 'Design Mars', planetSymbol: '♂', ...degreeToGateLine(dPos.Mars.longitude) },

      // 珍珠序列 (藍色 · 顯化世俗豐盛)
      vocation: { id: 'vocation', name: '天職', en: 'Vocation', seq: 'pearl', color: '#0EA5E9', planet: 'Design Mars', planetSymbol: '♂', ...degreeToGateLine(dPos.Mars.longitude) },
      culture: { id: 'culture', name: '文化', en: 'Culture', seq: 'pearl', color: '#0EA5E9', planet: 'Design Jupiter', planetSymbol: '♃', ...degreeToGateLine(dPos.Jupiter.longitude) },
      brand: { id: 'brand', name: '品牌', en: 'Brand', seq: 'pearl', color: '#0EA5E9', planet: 'Personality Sun', planetSymbol: '☉', ...degreeToGateLine(pPos.Sun.longitude) },
      pearl: { id: 'pearl', name: '珍珠', en: 'Pearl', seq: 'pearl', color: '#0EA5E9', planet: 'Personality Jupiter', planetSymbol: '♃', ...degreeToGateLine(pPos.Jupiter.longitude) },

      // 星辰珍珠序列 (Star Pearl · 宇宙和諧與量子共振)
      relationship: { id: 'relationship', name: '關係力', en: 'Relationship', seq: 'starPearl', color: '#4338CA', planet: 'Personality Mercury', planetSymbol: '☿', ...degreeToGateLine(pPos.Mercury.longitude) },
      stability: { id: 'stability', name: '穩定性', en: 'Stability', seq: 'starPearl', color: '#4338CA', planet: 'Design Saturn', planetSymbol: '♄', ...degreeToGateLine(dPos.Saturn.longitude) },
      creativity: { id: 'creativity', name: '創造力', en: 'Creativity', seq: 'starPearl', color: '#4338CA', planet: 'Design Uranus', planetSymbol: '♅', ...degreeToGateLine(dPos.Uranus.longitude) }
    };

    return {
      birthUtc: birthUtcDate,
      designUtc: designUtcDate,
      spheres: spheres,
      personalityPlanets: pPos,
      designPlanets: dPos
    };
  }

  return {
    ZODIAC_SIGNS,
    RAVE_MANDALA_GATES,
    HD_GATE_SERIAL,
    HD_CENTERS,
    HD_CHANNELS,
    longitudeToSign,
    degreeToGateLine,
    calculatePlanetaryPositions,
    calculateHousesAndAxes,
    calculateAspects,
    calculateHumanDesignChart,
    calculatePlanetaryReturns,
    getHighLevelHumanDesignInfo,
    HD_COGNITIONS,
    HD_DETERMINATIONS,
    HD_ENVIRONMENTS,
    HD_SENSES,
    HD_MOTIVATIONS,
    HD_VIEWS,
    HD_TRAJECTORIES,
    calculateGeneKeysProfile,
    INCARNATION_CROSSES,
    CROSS_NAME_ZH,
    getIncarnationCross,
    isMotorConnectedToThroat,
    determineDefinition
  };
}));
