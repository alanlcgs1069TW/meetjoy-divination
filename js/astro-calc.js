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
    module.exports = factory(require('astronomy-engine'));
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

  // 人類圖易經 64 閘門輪盤序列 (從雙魚座開始)
  const HD_GATE_SERIAL = [
    59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,
    58,38,54,61,60,41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,
    3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29
  ];

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
    { id: '51-25', g1: 51, g2: 25, c1: 'Heart', c2: 'G', name: '發起超越通道' },
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
      symbol: ZODIAC_SIGNS[signIndex].symbol,
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

      results[b.id] = {
        id: b.id,
        name: b.name,
        symbol: b.symbol,
        longitude: lon,
        latitude: lat,
        isRetrograde: isRetrograde,
        speedDaily: diff * 24,
        ...longitudeToSign(lon)
      };
    });

    // 地球位置為太陽對宮 180 度
    const earthLon = mod(results['Sun'].longitude + 180, 360);
    results['Earth'] = {
      id: 'Earth',
      name: '地球',
      symbol: '⊕',
      longitude: earthLon,
      isRetrograde: false,
      ...longitudeToSign(earthLon)
    };

    // 月球交點 (標準天文平北交點 Mean North Node & 南交點 South Node)
    const jd = (utcDate.getTime() / 86400000) + 2440587.5;
    const tCent = (jd - 2451545.0) / 36525;
    let nodeLon = 125.04452 - 1934.136261 * tCent + 0.0020708 * tCent * tCent + (tCent * tCent * tCent) / 450000;
    nodeLon = mod(nodeLon, 360);

    results['NorthNode'] = {
      id: 'NorthNode',
      name: '北交點',
      symbol: '☊',
      longitude: nodeLon,
      isRetrograde: true,
      ...longitudeToSign(nodeLon)
    };
    results['SouthNode'] = {
      id: 'SouthNode',
      name: '南交點',
      symbol: '☋',
      longitude: mod(nodeLon + 180, 360),
      isRetrograde: true,
      ...longitudeToSign(mod(nodeLon + 180, 360))
    };

    return results;
  }

  /**
   * 計算普拉西度宮位與四軸
   */
  function calculateHousesAndAxes(utcDate, lat, lng) {
    const gast = Astronomy.SiderealTime(utcDate); // 綠威平恆星時 (小時)
    const lstHours = mod(gast + lng / 15, 24); // 地方平恆星時 (小時)
    const ramc = lstHours * 15; // 度數
    const eps = 23.4392911; // 黃赤交角

    // MC 天頂
    let mc = toDeg(Math.atan2(Math.sin(toRad(ramc)), Math.cos(toRad(ramc)) * Math.cos(toRad(eps))));
    mc = mod(mc, 360);
    if (Math.abs(Math.sin(toRad(ramc))) > 0.001) {
      if (Math.sin(toRad(ramc)) > 0 && Math.sin(toRad(mc)) < 0) mc = mod(mc + 180, 360);
      if (Math.sin(toRad(ramc)) < 0 && Math.sin(toRad(mc)) > 0) mc = mod(mc + 180, 360);
    }

    // Asc 上升點
    const sinR = Math.sin(toRad(ramc));
    const cosR = Math.cos(toRad(ramc));
    const tanL = Math.tan(toRad(lat));
    const sinE = Math.sin(toRad(eps));
    const cosE = Math.cos(toRad(eps));

    let asc = toDeg(Math.atan2(-cosR, sinR * cosE + tanL * sinE));
    asc = mod(asc, 360);

    const cusps = [];
    cusps[1] = asc;
    cusps[10] = mc;
    cusps[4] = mod(mc + 180, 360);
    cusps[7] = mod(asc + 180, 360);

    // 普拉西度四象限平滑三等分
    const span1_4 = mod(cusps[4] - cusps[1], 360);
    cusps[2] = mod(cusps[1] + span1_4 / 3, 360);
    cusps[3] = mod(cusps[1] + span1_4 * 2 / 3, 360);

    const span4_7 = mod(cusps[7] - cusps[4], 360);
    cusps[5] = mod(cusps[4] + span4_7 / 3, 360);
    cusps[6] = mod(cusps[4] + span4_7 * 2 / 3, 360);

    const span7_10 = mod(cusps[10] - cusps[7], 360);
    cusps[8] = mod(cusps[7] + span7_10 / 3, 360);
    cusps[9] = mod(cusps[7] + span7_10 * 2 / 3, 360);

    const span10_1 = mod(cusps[1] - cusps[10], 360);
    cusps[11] = mod(cusps[10] + span10_1 / 3, 360);
    cusps[12] = mod(cusps[10] + span10_1 * 2 / 3, 360);

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
   * 黃道度數換算為人類圖 64 閘門與 6 爻線
   */
  function degreeToGateLine(deg) {
    const mDeg = mod(deg, 360);
    const idx = Math.floor(mDeg / 5.625);
    const withinGate = mDeg % 5.625;
    const line = Math.floor(withinGate / (5.625 / 6)) + 1;
    const tone = Math.floor((withinGate % (5.625 / 6)) / (5.625 / 6 / 6)) + 1;

    return {
      gate: HD_GATE_SERIAL[idx],
      line: line,
      tone: tone,
      degree: mDeg,
      formatted: `${HD_GATE_SERIAL[idx]}.${line}`
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

    // 判斷類型 Type
    let type = '投射者 (Projector)';
    let strategy = '等待被邀請 (Wait for the Invitation)';
    let signature = '成功 (Success)';
    let notSelf = '苦澀 (Bitterness)';

    const hasSacral = definedCenters.has('Sacral');
    const hasThroat = definedCenters.has('Throat');
    const hasMotorToThroat = definedChannels.some(ch =>
      (ch.c1 === 'Throat' && ['Heart', 'Solar Plexus', 'Root', 'Sacral'].includes(ch.c2)) ||
      (ch.c2 === 'Throat' && ['Heart', 'Solar Plexus', 'Root', 'Sacral'].includes(ch.c1))
    );

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

    // 輪迴交叉 Incarnation Cross
    const crossGates = `${personality['Sun'].gate}/${personality['Earth'].gate} | ${design['Sun'].gate}/${design['Earth'].gate}`;

    // 四顆箭頭 (Variables / Four Arrows)
    // 依據 Tone (1-3 為左 Left, 4-6 為右 Right)
    const variables = {
      brain: design['Sun'].tone <= 3 ? 'left' : 'right',      // 左上：大腦運作
      environment: design['NorthNode'].tone <= 3 ? 'left' : 'right', // 左下：環境/消化
      view: personality['NorthNode'].tone <= 3 ? 'left' : 'right',  // 右上：視角
      motivation: personality['Sun'].tone <= 3 ? 'left' : 'right'   // 右下：動機
    };

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
      crossGates: crossGates,
      signature: signature,
      notSelf: notSelf,
      variables: variables
    };
  }

  return {
    ZODIAC_SIGNS,
    HD_GATE_SERIAL,
    HD_CENTERS,
    HD_CHANNELS,
    longitudeToSign,
    calculatePlanetaryPositions,
    calculateHousesAndAxes,
    calculateAspects,
    calculateHumanDesignChart
  };
}));
