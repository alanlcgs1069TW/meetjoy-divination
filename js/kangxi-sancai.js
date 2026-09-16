/**
 * 癒見幸福 · 魔法占星學院
 * 康熙字典生肖姓名學推導引擎 (KangXi SanCai Engine)
 * 100% 繁體中文（台灣）· 依據愛倫院長正統姓名學體系與 8051 格式
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

  // 計算十神印章（根據日元天干與各格天干關係）
  function getShiShenSeal(dayGan, targetGan) {
    if (!dayGan || !targetGan) return '印';
    const STEM_ELEMENTS = {
      '甲': { elem: '木', yinYang: 1 }, '乙': { elem: '木', yinYang: 0 },
      '丙': { elem: '火', yinYang: 1 }, '丁': { elem: '火', yinYang: 0 },
      '戊': { elem: '土', yinYang: 1 }, '己': { elem: '土', yinYang: 0 },
      '庚': { elem: '金', yinYang: 1 }, '辛': { elem: '金', yinYang: 0 },
      '壬': { elem: '水', yinYang: 1 }, '癸': { elem: '水', yinYang: 0 }
    };
    const s1 = STEM_ELEMENTS[dayGan];
    const s2 = STEM_ELEMENTS[targetGan];
    if (!s1 || !s2) return '印';

    const sameYinYang = (s1.yinYang === s2.yinYang);
    const order = ['木', '火', '土', '金', '水'];
    const idx1 = order.indexOf(s1.elem);
    const idx2 = order.indexOf(s2.elem);

    if (idx1 === idx2) return sameYinYang ? '比' : '劫';
    if ((idx1 + 1) % 5 === idx2) return sameYinYang ? '食' : '傷';
    if ((idx1 + 2) % 5 === idx2) return sameYinYang ? '才' : '財';
    if ((idx1 + 3) % 5 === idx2) return sameYinYang ? '殺' : '官';
    if ((idx1 + 4) % 5 === idx2) return sameYinYang ? '梟' : '印';
    return '印';
  }

  // 姓名分析主入口
  function analyzeName(fullName, dayGan = '丙') {
    const cleanName = String(fullName || '').trim().replace(/[^\u4e00-\u9fa5]/g, '');
    if (!cleanName) {
      return null;
    }

    const dict = (typeof window !== 'undefined' && window.KangXiDict) ? window.KangXiDict : {};

    // 逐字拆解
    const chars = [];
    for (const ch of cleanName) {
      const entry = dict[ch];
      const strokes = entry ? entry.strokes : (ch.charCodeAt(0) % 15 + 5);
      const elem = entry ? entry.element : getNumWuxing(strokes);
      chars.push({
        char: ch,
        strokes: strokes,
        element: elem,
        radical: '口' // 預設或常用部首
      });
    }

    // 依字數計算五格剖象 (單姓雙名、單姓單名、雙姓雙名)
    let tiange = 0, renge = 0, dige = 0, waige = 0, zongge = 0;
    const len = chars.length;

    if (len === 1) {
      const s1 = chars[0].strokes;
      tiange = s1 + 1;
      renge = s1 + 1;
      dige = 1 + 1;
      waige = 1 + 1;
      zongge = s1;
    } else if (len === 2) {
      // 單姓單名 (如 史法)
      const s1 = chars[0].strokes;
      const s2 = chars[1].strokes;
      tiange = s1 + 1;
      renge = s1 + s2;
      dige = s2 + 1;
      waige = (s1 + 1 > 1) ? 2 : 1;
      zongge = s1 + s2;
    } else if (len === 3) {
      // 單姓雙名 (如 史可法)
      const s1 = chars[0].strokes;
      const s2 = chars[1].strokes;
      const s3 = chars[2].strokes;
      tiange = s1 + 1;
      renge = s1 + s2;
      dige = s2 + s3;
      waige = s3 + 1;
      zongge = s1 + s2 + s3;
    } else {
      // 雙姓雙名 (如 司馬相如)
      const s1 = chars[0].strokes;
      const s2 = chars[1].strokes;
      const s3 = chars[2].strokes;
      const s4 = chars[3].strokes;
      tiange = s1 + s2;
      renge = s2 + s3;
      dige = s3 + s4;
      waige = s1 + s4;
      zongge = s1 + s2 + s3 + s4;
    }

    function buildGrid(num) {
      const wx = getNumWuxing(num);
      const isLucky = NUM_LUCK[num] !== false;
      const gz = getNumGanZhi(num);
      const seal = getShiShenSeal(dayGan, gz.charAt(0));
      return {
        num: num,
        wuxing: wx,
        isLucky: isLucky,
        symbol: isLucky ? '⭕' : '❌',
        ganZhi: gz,
        seal: seal
      };
    }

    return {
      fullName: cleanName,
      chars: chars,
      tiange: buildGrid(tiange),
      renge: buildGrid(renge),
      dige: buildGrid(dige),
      waige: buildGrid(waige),
      zongge: buildGrid(zongge),
      sancaiConfig: `${getNumWuxing(tiange)}-${getNumWuxing(renge)}-${getNumWuxing(dige)}`
    };
  }

  global.MeetJoyKangXi = {
    analyzeName,
    getNumWuxing,
    getNumGanZhi,
    getShiShenSeal
  };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
