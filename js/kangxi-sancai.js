/**
 * 癒見幸福 · 魔法占星學院
 * 康熙字典生肖姓名學推導引擎 (KangXi SanCai Engine)
 * 100% 繁體中文（台灣）· 依據愛倫院長正統姓名學體系與 8051 / 18:57 格式
 * 核心準則：以【人格為本體】推算天格、地格、外格、總格之生剋十神關係
 */

(function (global) {
  'use strict';

  // 81 數理吉凶表 (true: 吉 ⭕, false: 浮沉/凶 ❌)
  const NUM_LUCK = {
    1: true, 2: false, 3: true, 4: false, 5: true, 6: true, 7: true, 8: true, 9: false, 10: false,
    11: true, 12: false, 13: true, 14: false, 15: true, 16: true, 17: true, 18: true, 19: false, 20: false,
    21: true, 22: false, 23: true, 24: true, 25: true, 26: false, 27: false, 28: false, 29: true, 30: false,
    31: true, 32: true, 33: true, 34: false, 35: true, 36: false, 37: true, 38: false, 39: true, 40: false,
    41: true, 42: false, 43: false, 44: false, 45: true, 46: false, 47: true, 48: true, 49: false, 50: false,
    51: true, 52: true, 53: false, 54: false, 55: false, 56: false, 57: true, 58: true, 59: false, 60: false,
    61: true, 62: false, 63: true, 64: false, 65: true, 66: false, 67: true, 68: true, 69: false, 70: false,
    71: true, 72: false, 73: true, 74: false, 75: false, 76: false, 77: true, 78: false, 79: false, 80: false,
    81: true
  };

  // 尾數對應五行 (1,2木, 3,4火, 5,6土, 7,8金, 9,0水)
  function getNumWuxing(num) {
    const last = num % 10;
    if (last === 1 || last === 2) return '木';
    if (last === 3 || last === 4) return '火';
    if (last === 5 || last === 6) return '土';
    if (last === 7 || last === 8) return '金';
    return '水';
  }

  // 數理對應天干地支（8051 格式，如 8 金辛未、12 木乙亥、13 火丙子、9 水壬申、20 水癸未）
  const NUM_GANZHI = {
    1: '甲子', 2: '乙丑', 3: '丙寅', 4: '丁卯', 5: '戊辰', 6: '己巳', 7: '庚午', 8: '辛未', 9: '壬申', 10: '癸酉',
    11: '甲戌', 12: '乙亥', 13: '丙子', 14: '丁丑', 15: '戊寅', 16: '己卯', 17: '庚辰', 18: '辛巳', 19: '壬午', 20: '癸未',
    21: '甲申', 22: '乙酉', 23: '丙戌', 24: '丁亥', 25: '戊子', 26: '己丑', 27: '庚寅', 28: '辛卯', 29: '壬辰', 30: '癸巳',
    31: '甲午', 32: '乙未', 33: '丙申', 34: '丁酉', 35: '戊戌', 36: '己亥', 37: '庚子', 38: '辛丑', 39: '壬寅', 40: '癸卯',
    41: '甲辰', 42: '乙巳', 43: '丙午', 44: '丁未', 45: '戊申', 46: '己酉', 47: '庚戌', 48: '辛亥', 49: '壬子', 50: '癸丑',
    51: '甲寅', 52: '乙卯', 53: '丙辰', 54: '丁巳', 55: '戊午', 56: '己未', 57: '庚申', 58: '辛酉', 59: '壬戌', 60: '癸亥'
  };

  function getNumGanZhi(num) {
    const mod = ((num - 1) % 60) + 1;
    return NUM_GANZHI[mod] || '甲子';
  }

  /**
   * 核心推算：以【人格為本體】推算與目標格（天格/地格/外格/總格）的生剋關係印章
   * 人格五行 vs 目標格五行：
   * - 剋我者（目標剋人格）➔ 【官】（正官/七殺）
   * - 生我者（目標生人格）➔ 【印】（正印/偏印）
   * - 我生者（人格生目標）➔ 【食】（食神/傷官）
   * - 我剋者（人格剋目標）➔ 【財】（正財/偏財）
   * - 同我者（目標同人格）➔ 【比】（比肩/劫財）
   */
  function calcShiShenByRenge(rengeWuxing, targetWuxing, rengeGan, targetGan) {
    if (!rengeWuxing || !targetWuxing) return '印';
    if (rengeWuxing === targetWuxing) return '比';

    const order = ['木', '火', '土', '金', '水'];
    const rIdx = order.indexOf(rengeWuxing);
    const tIdx = order.indexOf(targetWuxing);
    if (rIdx === -1 || tIdx === -1) return '印';

    // 生我者 (Target 生 RenGe)
    if ((tIdx + 1) % 5 === rIdx) return '印';
    // 我生者 (RenGe 生 Target)
    if ((rIdx + 1) % 5 === tIdx) return '食';
    // 剋我者 (Target 剋 RenGe)
    if ((tIdx + 2) % 5 === rIdx) return '官';
    // 我剋者 (RenGe 剋 Target)
    if ((rIdx + 2) % 5 === tIdx) return '財';

    return '印';
  }

  // 生活化生剋解析文案生成
  function generateShengKeInterpretation(relType, gridName, rengeWuxing, targetWuxing) {
    const titleMap = {
      'tiange': '天格長輩主管運',
      'dige': '地格家庭配偶與潛意識',
      'waige': '外格人際社交機遇',
      'zongge': '總格中晚年終身大局'
    };
    const title = titleMap[gridName] || '格局關係';

    switch (relType) {
      case '印':
        return `【${title} · 生我得印】：${targetWuxing}生${rengeWuxing}。在此領域你自帶豐沛庇佑與滋養，總有貴人與助力在背後撐腰，心態踏實穩定，容易獲得資源傾斜與包容。`;
      case '官':
        return `【${title} · 剋我為官】：${targetWuxing}剋${rengeWuxing}。在此領域外界給予較高標準與責任壓力，雖然自我督促嚴格、挑戰較大，但也是磨練領導魄力與成就大業的必經試煉。`;
      case '食':
        return `【${title} · 我生吐秀】：${rengeWuxing}生${targetWuxing}。你在此領域願意傾注滿腔熱情與才華，照顧他人不遺餘力，付出雖多但能享受創意顯化與人際付出的純粹喜悅。`;
      case '財':
        return `【${title} · 我剋為財】：${rengeWuxing}剋${targetWuxing}。你在此領域展現極強的掌控力、企圖心與價值變現敏銳度，懂得調動資源、主導全局，轉化為實質回報。`;
      case '比':
        return `【${title} · 同我比和】：${targetWuxing}同${rengeWuxing}。彼此同頻共振、勢均力敵，如同並肩作戰的換帖好友或合夥同盟，合作無間但需注意偶爾的意見堅持。`;
      default:
        return `【${title}】：生剋和諧，能量自然流轉。`;
    }
  }

  // 姓名分析主入口
  function analyzeName(fullName) {
    const cleanName = String(fullName || '').trim().replace(/[^\u4e00-\u9fa5]/g, '');
    if (!cleanName) {
      return null;
    }

    const dict = (typeof window !== 'undefined' && window.KangXiDict) ? window.KangXiDict : (typeof global !== 'undefined' && global.KangXiDict ? global.KangXiDict : {});

    // 逐字拆解
    const chars = [];
    for (const ch of cleanName) {
      const entry = dict[ch];
      const strokes = entry ? entry.strokes : (ch.charCodeAt(0) % 15 + 5);
      const elem = entry ? entry.element : getNumWuxing(strokes);
      const radical = entry ? (entry.radical || '—') : '—';
      const simp = entry ? (entry.simplified || ch) : ch;
      const explain = entry ? (entry.explain || '') : '';

      chars.push({
        char: ch,
        strokes: strokes,
        element: elem,
        radical: radical,
        simplified: simp,
        explain: explain
      });
    }

    // 依字數計算五格剖象 (單姓雙名、單姓單名、雙姓雙名)
    let tiangeNum = 0, rengeNum = 0, digeNum = 0, waigeNum = 0, zonggeNum = 0;
    const len = chars.length;

    if (len === 1) {
      const s1 = chars[0].strokes;
      tiangeNum = s1 + 1;
      rengeNum = s1 + 1;
      digeNum = 1 + 1;
      waigeNum = 1 + 1;
      zonggeNum = s1;
    } else if (len === 2) {
      // 單姓單名 (如 史法)
      const s1 = chars[0].strokes;
      const s2 = chars[1].strokes;
      tiangeNum = s1 + 1;
      rengeNum = s1 + s2;
      digeNum = s2 + 1;
      waigeNum = (s1 + 1 > 1) ? 2 : 1;
      zonggeNum = s1 + s2;
    } else if (len === 3) {
      // 單姓雙名 (如 史可法、江丙坤)
      const s1 = chars[0].strokes;
      const s2 = chars[1].strokes;
      const s3 = chars[2].strokes;
      tiangeNum = s1 + 1;
      rengeNum = s1 + s2;
      digeNum = s2 + s3;
      waigeNum = s3 + 1;
      zonggeNum = s1 + s2 + s3;
    } else {
      // 雙姓雙名 (如 司馬相如)
      const s1 = chars[0].strokes;
      const s2 = chars[1].strokes;
      const s3 = chars[2].strokes;
      const s4 = chars[3].strokes;
      tiangeNum = s1 + s2;
      rengeNum = s2 + s3;
      digeNum = s3 + s4;
      waigeNum = s1 + s4;
      zonggeNum = s1 + s2 + s3 + s4;
    }

    // 先建立 人格 (本體)
    const rengeWx = getNumWuxing(rengeNum);
    const rengeGz = getNumGanZhi(rengeNum);
    const rengeIsLucky = NUM_LUCK[rengeNum] !== false;

    const rengeGrid = {
      num: rengeNum,
      wuxing: rengeWx,
      isLucky: rengeIsLucky,
      symbol: rengeIsLucky ? '⭕' : '❌',
      ganZhi: rengeGz,
      seal: '本體',
      isBody: true,
      interpretation: `【人格本體】：五行屬${rengeWx}，數理「${rengeNum}」${rengeIsLucky ? '吉 ⭕' : '需修煉 ❌'}。代表命主核心思維模式與天賦原動力，是整體姓名能量的航標中樞。`
    };

    // 建立其他各格，以【人格為本體】計算生剋十神印章
    function buildTargetGrid(num, gridKey) {
      const wx = getNumWuxing(num);
      const isLucky = NUM_LUCK[num] !== false;
      const gz = getNumGanZhi(num);
      const seal = calcShiShenByRenge(rengeWx, wx, rengeGz.charAt(0), gz.charAt(0));
      return {
        num: num,
        wuxing: wx,
        isLucky: isLucky,
        symbol: isLucky ? '⭕' : '❌',
        ganZhi: gz,
        seal: seal,
        isBody: false,
        interpretation: generateShengKeInterpretation(seal, gridKey, rengeWx, wx)
      };
    }

    const tiangeGrid = buildTargetGrid(tiangeNum, 'tiange');
    const digeGrid = buildTargetGrid(digeNum, 'dige');
    const waigeGrid = buildTargetGrid(waigeNum, 'waige');
    const zonggeGrid = buildTargetGrid(zonggeNum, 'zongge');

    return {
      fullName: cleanName,
      chars: chars,
      tiange: tiangeGrid,
      renge: rengeGrid,
      dige: digeGrid,
      waige: waigeGrid,
      zongge: zonggeGrid,
      sancaiConfig: `${tiangeGrid.wuxing}-${rengeGrid.wuxing}-${digeGrid.wuxing}`,
      summary: `以人格【${rengeGrid.wuxing}】為本體，天格為【${tiangeGrid.seal}】、地格為【${digeGrid.seal}】、外格為【${waigeGrid.seal}】、總格為【${zonggeGrid.seal}】。`
    };
  }

  global.MeetJoyKangXi = {
    analyzeName,
    getNumWuxing,
    getNumGanZhi,
    calcShiShenByRenge
  };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
