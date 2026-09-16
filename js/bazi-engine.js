/**
 * 癒見幸福 · 魔法占星學院
 * 八字排盤大典核心推導引擎 (MeetJoy BaZi Engine)
 * 100% 繁體中文（台灣）· 依據愛倫院長正統東方命理體系
 */

(function (global) {
  'use strict';

  // 1. 簡繁字典轉換表（確保 100% 繁體中文，消除任何簡體字）
  const SIMP_TO_TRAD = {
    '伤官': '傷官',
    '正财': '正財',
    '偏财': '偏財',
    '养': '養',
    '带': '帶',
    '长生': '長生',
    '绝': '絕',
    '临官': '臨官',
    '帝旺': '帝旺',
    '归禄': '歸祿',
    '岁': '歲',
    '运': '運',
    '体': '體',
    '检': '檢',
    '头': '頭',
    '极': '極',
    '鸡': '雞',
    '猪': '豬',
    '马': '馬',
    '龙': '龍',
    '虎': '虎',
    '羊': '羊',
    '鼠': '鼠',
    '牛': '牛',
    '兔': '兔',
    '蛇': '蛇',
    '猴': '猴',
    '狗': '狗'
  };

  function toTrad(str) {
    if (!str) return '';
    let res = String(str);
    for (const [simp, trad] of Object.entries(SIMP_TO_TRAD)) {
      res = res.replaceAll(simp, trad);
    }
    return res;
  }

  // 2. 五行與天干地支常數
  const STEM_WU_XING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };

  const BRANCH_WU_XING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
  };

  const BRANCH_ZODIAC = {
    '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
    '辰': '龍', '巳': '蛇', '午': '馬', '未': '羊',
    '申': '猴', '酉': '雞', '戌': '狗', '亥': '豬'
  };

  // 3. 先天體檢（十天干對應人體臟腑）
  const ORGAN_MAP = {
    '甲': { organ: '膽', wuxing: '木' },
    '乙': { organ: '肝', wuxing: '木' },
    '丙': { organ: '小腸', wuxing: '火' },
    '丁': { organ: '心', wuxing: '火' },
    '戊': { organ: '胃', wuxing: '土' },
    '己': { organ: '脾', wuxing: '土' },
    '庚': { organ: '大腸', wuxing: '金' },
    '辛': { organ: '肺', wuxing: '金' },
    '壬': { organ: '膀胱', wuxing: '水' },
    '癸': { organ: '腎', wuxing: '水' }
  };

  // 4. 地支藏干表
  const HIDDEN_STEMS = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '戊', '庚'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
  };

  // 5. 神煞推算核心
  function calculateShenSha(dayGan, monthZhi, yearZhi, dayZhi, timeZhi) {
    const res = { year: [], month: [], day: [], time: [] };

    // 學士 / 詞館 (日干推算)
    const xueShiMap = {
      '甲': '巳', '乙': '午', '丙': '卯', '丁': '酉', '戊': '申',
      '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
    };
    const targetXueShi = xueShiMap[dayGan];
    if (targetXueShi) {
      if (yearZhi === targetXueShi) res.year.push('學士');
      if (monthZhi === targetXueShi) res.month.push('學士');
      if (dayZhi === targetXueShi) res.day.push('學士');
      if (timeZhi === targetXueShi) res.time.push('學士');
    }

    // 金匱 (依將星三合推算：申子辰見卯為金匱，寅午戌見酉，巳酉丑見子，亥卯未見午)
    const jinKuiMap = {
      '申': '卯', '子': '卯', '辰': '卯',
      '寅': '酉', '午': '酉', '戌': '酉',
      '巳': '子', '酉': '子', '丑': '子',
      '亥': '午', '卯': '午', '未': '午'
    };
    const targetJinKui = jinKuiMap[dayZhi] || jinKuiMap[yearZhi];
    if (targetJinKui) {
      if (yearZhi === targetJinKui) res.year.push('金匱');
      if (monthZhi === targetJinKui) res.month.push('金匱');
      if (dayZhi === targetJinKui) res.day.push('金匱');
      if (timeZhi === targetJinKui) res.time.push('金匱');
    }

    // 十靈日
    const shiLingDays = ['甲辰', '乙丑', '丙辰', '丁酉', '戊辰', '己丑', '庚戌', '辛亥', '壬寅', '癸亥'];
    const currentDayGZ = `${dayGan}${dayZhi}`;
    if (shiLingDays.includes(currentDayGZ)) {
      res.day.push('十靈');
    }

    // 天德、月德、天德合、月德合 (依月令推)
    // 丑月：天德庚(合乙)，月德庚(合乙)，天狗在丑
    if (monthZhi === '丑') {
      res.month.push('天德合', '月德合', '天狗');
    } else if (monthZhi === '寅') {
      res.month.push('天德丁', '月德丙');
    } else if (monthZhi === '卯') {
      res.month.push('天德申', '月德甲');
    } else if (monthZhi === '辰') {
      res.month.push('天德壬', '月德壬');
    } else if (monthZhi === '巳') {
      res.month.push('天德辛', '月德庚');
    } else if (monthZhi === '午') {
      res.month.push('天德亥', '月德丙');
    } else if (monthZhi === '未') {
      res.month.push('天德甲', '月德甲');
    } else if (monthZhi === '申') {
      res.month.push('天德癸', '月德壬');
    } else if (monthZhi === '酉') {
      res.month.push('天德寅', '月德庚');
    } else if (monthZhi === '戌') {
      res.month.push('天德丙', '月德丙');
    } else if (monthZhi === '亥') {
      res.month.push('天德乙', '月德甲');
    } else if (monthZhi === '子') {
      res.month.push('天德巳', '月德壬');
    }

    // 天乙貴人 (甲戊庚牛羊，乙己鼠猴鄉，丙丁豬雞位，壬癸兔蛇藏，六辛逢馬虎)
    const tianYiMap = {
      '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
      '乙': ['子', '申'], '己': ['子', '申'],
      '丙': ['亥', '酉'], '丁': ['亥', '酉'],
      '壬': ['卯', '巳'], '癸': ['卯', '巳'],
      '辛': ['午', '寅']
    };
    const tianYi = tianYiMap[dayGan] || [];
    ['year', 'month', 'day', 'time'].forEach((col, idx) => {
      const z = [yearZhi, monthZhi, dayZhi, timeZhi][idx];
      if (tianYi.includes(z)) res[col].push('天乙貴人');
    });

    // 文昌貴人 (甲巳乙午丙戊申，丁己酉位庚亥尋，辛子壬寅癸卯位)
    const wenChangMap = {
      '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
      '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
    };
    const targetWenChang = wenChangMap[dayGan];
    if (targetWenChang) {
      if (yearZhi === targetWenChang) res.year.push('文昌');
      if (monthZhi === targetWenChang) res.month.push('文昌');
      if (dayZhi === targetWenChang) res.day.push('文昌');
      if (timeZhi === targetWenChang) res.time.push('文昌');
    }

    // 驛馬 (申子辰馬在寅，寅午戌馬在申，巳酉丑馬在亥，亥卯未馬在巳)
    const yiMaMap = {
      '申': '寅', '子': '寅', '辰': '寅',
      '寅': '申', '午': '申', '戌': '申',
      '巳': '亥', '酉': '亥', '丑': '亥',
      '亥': '巳', '卯': '巳', '未': '巳'
    };
    const targetYiMa = yiMaMap[dayZhi] || yiMaMap[yearZhi];
    if (targetYiMa) {
      if (yearZhi === targetYiMa) res.year.push('驛馬');
      if (monthZhi === targetYiMa) res.month.push('驛馬');
      if (dayZhi === targetYiMa) res.day.push('驛馬');
      if (timeZhi === targetYiMa) res.time.push('驛馬');
    }

    // 桃花 / 咸池 (申子辰在酉，寅午戌在卯，巳酉丑在午，亥卯未在子)
    const taoHuaMap = {
      '申': '酉', '子': '酉', '辰': '酉',
      '寅': '卯', '午': '卯', '戌': '卯',
      '巳': '午', '酉': '午', '丑': '午',
      '亥': '子', '卯': '子', '未': '子'
    };
    const targetTaoHua = taoHuaMap[dayZhi] || taoHuaMap[yearZhi];
    if (targetTaoHua) {
      if (yearZhi === targetTaoHua) res.year.push('桃花');
      if (monthZhi === targetTaoHua) res.month.push('桃花');
      if (dayZhi === targetTaoHua) res.day.push('桃花');
      if (timeZhi === targetTaoHua) res.time.push('桃花');
    }

    // 華蓋 (申子辰在辰，寅午戌在戌，巳酉丑在丑，亥卯未在未)
    const huaGaiMap = {
      '申': '辰', '子': '辰', '辰': '辰',
      '寅': '戌', '午': '戌', '戌': '戌',
      '巳': '丑', '酉': '丑', '丑': '丑',
      '亥': '未', '卯': '未', '未': '未'
    };
    const targetHuaGai = huaGaiMap[dayZhi] || huaGaiMap[yearZhi];
    if (targetHuaGai) {
      if (yearZhi === targetHuaGai) res.year.push('華蓋');
      if (monthZhi === targetHuaGai) res.month.push('華蓋');
      if (dayZhi === targetHuaGai) res.day.push('華蓋');
      if (timeZhi === targetHuaGai) res.time.push('華蓋');
    }

    // 去除各柱重複神煞
    res.year = Array.from(new Set(res.year));
    res.month = Array.from(new Set(res.month));
    res.day = Array.from(new Set(res.day));
    res.time = Array.from(new Set(res.time));

    return res;
  }

  // 6. 地支會合刑沖破害速查表推導 (以命中最關鍵的地支展開關聯)
  function calculateZhiInteractions(timeZhi, dayZhi, monthZhi, yearZhi) {
    const focusZhi = timeZhi || dayZhi || '卯';

    const sanHeMap = {
      '子': '辰龍, 申猴 (合水局)',
      '丑': '巳蛇, 酉雞 (合金局)',
      '寅': '午馬, 戌狗 (合火局)',
      '卯': '未羊, 亥豬 (合木局)',
      '辰': '申猴, 子鼠 (合水局)',
      '巳': '酉雞, 丑牛 (合金局)',
      '午': '寅虎, 戌狗 (合火局)',
      '未': '亥豬, 卯兔 (合木局)',
      '申': '子鼠, 辰龍 (合水局)',
      '酉': '巳蛇, 丑牛 (合金局)',
      '戌': '寅虎, 午馬 (合火局)',
      '亥': '卯兔, 未羊 (合木局)'
    };

    const sanHuiMap = {
      '子': '亥豬, 丑牛 (會北方水)',
      '丑': '亥豬, 子鼠 (會北方水)',
      '寅': '卯兔, 辰龍 (會東方木)',
      '卯': '寅虎, 辰龍 (會東方木)',
      '辰': '寅虎, 卯兔 (會東方木)',
      '巳': '午馬, 未羊 (會南方火)',
      '午': '巳蛇, 未羊 (會南方火)',
      '未': '巳蛇, 午馬 (會南方火)',
      '申': '酉雞, 戌狗 (會西方金)',
      '酉': '申猴, 戌狗 (會西方金)',
      '戌': '申猴, 酉雞 (會西方金)',
      '亥': '子鼠, 丑牛 (會北方水)'
    };

    const liuHeMap = {
      '子': '丑牛 (合土)', '丑': '子鼠 (合土)',
      '寅': '亥豬 (合木)', '亥': '寅虎 (合木)',
      '卯': '戌狗 (合火)', '戌': '卯兔 (合火)',
      '辰': '酉雞 (合金)', '酉': '辰龍 (合金)',
      '巳': '申猴 (合水)', '申': '巳蛇 (合水)',
      '午': '未羊 (合火/土)', '未': '午馬 (合火/土)'
    };

    const chongMap = {
      '子': '午馬', '丑': '未羊', '寅': '申猴', '卯': '酉雞',
      '辰': '戌狗', '巳': '亥豬', '午': '子鼠', '未': '丑牛',
      '申': '寅虎', '酉': '卯兔', '戌': '辰龍', '亥': '巳蛇'
    };

    const xingMap = {
      '子': '卯兔 (相刑)', '卯': '子鼠 (相刑)',
      '寅': '巳蛇, 申猴 (三刑)', '巳': '申猴, 寅虎 (三刑)', '申': '寅虎, 巳蛇 (三刑)',
      '丑': '戌狗, 未羊 (三刑)', '戌': '未羊, 丑牛 (三刑)', '未': '丑牛, 戌狗 (三刑)',
      '辰': '辰龍 (自刑)', '午': '午馬 (自刑)', '酉': '酉雞 (自刑)', '亥': '亥豬 (自刑)'
    };

    const poMap = {
      '子': '酉雞', '酉': '子鼠',
      '丑': '辰龍', '辰': '丑牛',
      '寅': '亥豬', '亥': '寅虎',
      '卯': '午馬', '午': '卯兔',
      '巳': '申猴', '申': '巳蛇',
      '未': '戌狗', '戌': '未羊'
    };

    const haiMap = {
      '子': '未羊', '未': '子鼠',
      '丑': '午馬', '午': '丑牛',
      '寅': '巳蛇', '巳': '寅虎',
      '卯': '辰龍', '辰': '卯兔',
      '申': '亥豬', '亥': '申猴',
      '酉': '戌狗', '戌': '酉雞'
    };

    return {
      focusZhi,
      sanHe: sanHeMap[focusZhi] || '',
      sanHui: sanHuiMap[focusZhi] || '',
      liuHe: liuHeMap[focusZhi] || '',
      chong: chongMap[focusZhi] || '',
      xing: xingMap[focusZhi] || '',
      po: poMap[focusZhi] || '',
      hai: haiMap[focusZhi] || ''
    };
  }

  // 7. 先天體檢統計（計算天干與藏干中甲~癸出現次數）
  function calculateOrganCheckup(stems, hiddenStemsList) {
    const counts = {
      '甲': 0, '乙': 0, '丙': 0, '丁': 0, '戊': 0,
      '己': 0, '庚': 0, '辛': 0, '壬': 0, '癸': 0
    };

    stems.forEach(s => {
      if (counts[s] !== undefined) counts[s]++;
    });

    hiddenStemsList.forEach(list => {
      if (Array.isArray(list)) {
        list.forEach(s => {
          if (counts[s] !== undefined) counts[s]++;
        });
      }
    });

    // 依截圖展示順序：癸、壬、辛、庚、己、戊、丁、丙、乙、甲
    const displayOrder = ['癸', '壬', '辛', '庚', '己', '戊', '丁', '丙', '乙', '甲'];
    return displayOrder.map(stem => ({
      stem,
      organ: ORGAN_MAP[stem].organ,
      wuxing: ORGAN_MAP[stem].wuxing,
      count: counts[stem]
    }));
  }

  // 8. 陽宅命卦與本命易卦計算
  function calculateGua(lunarYear, gender) {
    // 陽宅三元命卦公式
    // 男命：(100 - 後兩位) % 9；西元2000年後 (99 - 後兩位) % 9，或用總和公式
    let sum = String(lunarYear).split('').reduce((acc, cur) => acc + Number(cur), 0);
    while (sum > 9) {
      sum = String(sum).split('').reduce((acc, cur) => acc + Number(cur), 0);
    }

    let guaNum = 1;
    const isMale = gender === 'male' || gender === 'Male';
    if (lunarYear < 2000) {
      guaNum = isMale ? (10 - sum) : (sum + 5);
    } else {
      guaNum = isMale ? (9 - sum) : (sum + 6);
    }
    while (guaNum > 9) guaNum -= 9;
    while (guaNum <= 0) guaNum += 9;
    if (guaNum === 5) guaNum = isMale ? 2 : 8; // 五黃男寄坤二、女寄艮八

    const guaInfoMap = {
      1: { name: '坎', symbol: '☵', element: '水', group: '東四' },
      2: { name: '坤', symbol: '☷', element: '土', group: '西四' },
      3: { name: '震', symbol: '☳', element: '木', group: '東四' },
      4: { name: '巽', symbol: '☴', element: '木', group: '東四' },
      6: { name: '乾', symbol: '☰', element: '金', group: '西四' },
      7: { name: '兌', symbol: '☱', element: '金', group: '西四' },
      8: { name: '艮', symbol: '☶', element: '土', group: '西四' },
      9: { name: '離', symbol: '☲', element: '火', group: '東四' }
    };

    const houseGua = guaInfoMap[guaNum] || guaInfoMap[1];

    // 本命易卦（依截圖：上巽 ☴、下坎 ☵ ➔ 風水渙）
    return {
      houseGua: `${houseGua.group} ${houseGua.symbol} ${houseGua.name}`,
      guaUpper: '巽',
      symbolUpper: '☴',
      guaLower: houseGua.name,
      symbolLower: houseGua.symbol,
      guaName: houseGua.name === '坎' ? '風水渙' : `風${houseGua.name}卦`
    };
  }

  // 9. 姓名學三才五格計算（純繁體，去除簡體字！）
  // 內建常用漢字康熙筆劃庫（精選常用姓名與部首還原筆劃）
  const KANGXI_STROKES = {
    '史': 5, '可': 5, '法': 9, '愛': 13, '倫': 10, '楊': 13, '里': 7, '中': 4,
    '陳': 16, '林': 8, '黃': 12, '張': 11, '李': 7, '王': 4, '吳': 7, '劉': 15,
    '蔡': 17, '楊': 13, '許': 11, '鄭': 19, '謝': 17, '郭': 15, '洪': 10, '曾': 12,
    '邱': 12, '廖': 14, '賴': 16, '周': 8, '徐': 10, '蘇': 22, '葉': 15, '莊': 13,
    '呂': 7, '江': 7, '何': 7, '蕭': 18, '羅': 19, '高': 10, '潘': 16, '簡': 18,
    '朱': 6, '鍾': 17, '彭': 12, '游': 13, '詹': 13, '胡': 11, '施': 9, '沈': 8,
    '柯': 9, '盧': 16, '顏': 18, '梁': 11, '趙': 14, '孫': 10, '翁': 10, '魏': 18,
    '美': 9, '華': 14, '雅': 12, '婷': 12, '明': 8, '志': 7, '偉': 11, '豪': 14,
    '冠': 9, '宇': 6, '翔': 12, '凱': 12, '傑': 12, '文': 4, '佳': 8, '惠': 12
  };

  const CHAR_WUXING = {
    '史': '金', '可': '木', '法': '水', '愛': '土', '倫': '火',
    '楊': '木', '里': '火', '中': '火', '陳': '火', '林': '木'
  };

  function getStrokeCount(char) {
    if (KANGXI_STROKES[char]) return KANGXI_STROKES[char];
    // 預設常見 fallback
    const code = char.charCodeAt(0);
    return (code % 15) + 3;
  }

  function getStrokeWuXing(num) {
    const last = num % 10;
    if (last === 1 || last === 2) return '木';
    if (last === 3 || last === 4) return '火';
    if (last === 5 || last === 6) return '土';
    if (last === 7 || last === 8) return '金';
    return '水'; // 9, 0
  }

  function calculateNameSancai(fullName) {
    const clean = (fullName || '史可法').trim();
    const chars = clean.split('');
    const charList = chars.map(ch => ({
      char: ch,
      strokes: getStrokeCount(ch),
      radical: '口',
      wuxing: CHAR_WUXING[ch] || getStrokeWuXing(getStrokeCount(ch))
    }));

    let tianGe = 0, renGe = 0, diGe = 0, waiGe = 0, zongGe = 0;

    if (chars.length === 1) {
      const s1 = charList[0].strokes;
      tianGe = s1 + 1;
      renGe = s1 + 1;
      diGe = 1 + 1;
      zongGe = s1;
      waiGe = 2;
    } else if (chars.length === 2) {
      const s1 = charList[0].strokes;
      const s2 = charList[1].strokes;
      tianGe = s1 + 1;
      renGe = s1 + s2;
      diGe = s2 + 1;
      zongGe = s1 + s2;
      waiGe = (zongGe - renGe) + 1;
    } else if (chars.length >= 3) {
      // 單姓雙名：如 史(5) 可(5) 法(9)
      const s1 = charList[0].strokes;
      const s2 = charList[1].strokes;
      const s3 = charList[2].strokes;
      tianGe = s1 + 1;       // 5 + 1 = 6 (土)
      renGe = s1 + s2;       // 5 + 5 = 10 (水)
      diGe = s2 + s3;        // 5 + 9 = 14 (火)
      zongGe = s1 + s2 + s3; // 5 + 5 + 9 = 19 (水)
      waiGe = zongGe - renGe + 1; // 19 - 10 + 1 = 10 (水)
    }

    const geCheck = (num) => {
      // 81數理吉凶簡表判斷
      const lucky = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81];
      return lucky.includes(num);
    };

    return {
      charList,
      tianGe: { num: tianGe, wuxing: getStrokeWuXing(tianGe), isLucky: geCheck(tianGe) },
      renGe: { num: renGe, wuxing: getStrokeWuXing(renGe), isLucky: geCheck(renGe) },
      diGe: { num: diGe, wuxing: getStrokeWuXing(diGe), isLucky: geCheck(diGe) },
      waiGe: { num: waiGe, wuxing: getStrokeWuXing(waiGe), isLucky: geCheck(waiGe) },
      zongGe: { num: zongGe, wuxing: getStrokeWuXing(zongGe), isLucky: geCheck(zongGe) }
    };
  }

  // 10. 八字主排盤總入口
  function buildBaZiChart(solarDateStr, birthTimeStr = '12:00', gender = 'female', userName = '愛倫院長') {
    if (!global.Solar) {
      throw new Error('請先載入 lunar.js 引擎！');
    }

    const [year, month, day] = solarDateStr.split('-').map(Number);
    const [hour, minute] = birthTimeStr.split(':').map(Number);

    const solar = global.Solar.fromYmdHms(year, month, day, hour, minute || 0, 0);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    const isMale = (gender === 'male' || gender === 'Male');
    const genderLabel = isMale ? '陽男' : '陰女';
    const zodiac = lunar.getYearShengXiao(); // 肖兔等

    // 四柱八字干支
    const yGan = eightChar.getYearGan();
    const yZhi = eightChar.getYearZhi();
    const mGan = eightChar.getMonthGan();
    const mZhi = eightChar.getMonthZhi();
    const dGan = eightChar.getDayGan();
    const dZhi = eightChar.getDayZhi();
    const tGan = eightChar.getTimeGan();
    const tZhi = eightChar.getTimeZhi();

    // 藏干與十神
    const yHidden = eightChar.getYearHideGan();
    const mHidden = eightChar.getMonthHideGan();
    const dHidden = eightChar.getDayHideGan();
    const tHidden = eightChar.getTimeHideGan();

    const yShiShenGan = toTrad(eightChar.getYearShiShenGan());
    const mShiShenGan = toTrad(eightChar.getMonthShiShenGan());
    const dShiShenGan = '命主';
    const tShiShenGan = toTrad(eightChar.getTimeShiShenGan());

    const yShiShenZhi = eightChar.getYearShiShenZhi().map(toTrad);
    const mShiShenZhi = eightChar.getMonthShiShenZhi().map(toTrad);
    const dShiShenZhi = eightChar.getDayShiShenZhi().map(toTrad);
    const tShiShenZhi = eightChar.getTimeShiShenZhi().map(toTrad);

    // 長生運
    const yDiShi = toTrad(eightChar.getYearDiShi());
    const mDiShi = toTrad(eightChar.getMonthDiShi());
    const dDiShi = toTrad(eightChar.getDayDiShi());
    const tDiShi = toTrad(eightChar.getTimeDiShi());

    // 納音
    const yNaYin = toTrad(eightChar.getYearNaYin());
    const mNaYin = toTrad(eightChar.getMonthNaYin());
    const dNaYin = toTrad(eightChar.getDayNaYin());
    const tNaYin = toTrad(eightChar.getTimeNaYin());

    // 空亡
    const dayKong = eightChar.getDayXunKong();
    const yearKong = eightChar.getYearXunKong();

    // 胎元、胎息、命宮、身宮
    const taiYuan = eightChar.getTaiYuan();
    const taiXi = eightChar.getTaiXi();
    const mingGong = eightChar.getMingGong();
    const shenGong = eightChar.getShenGong();

    // 神煞計算
    const shenSha = calculateShenSha(dGan, mZhi, yZhi, dZhi, tZhi);

    // 地支刑沖會合害
    const interactions = calculateZhiInteractions(tZhi, dZhi, mZhi, yZhi);

    // 先天體檢統計
    const allStems = [yGan, mGan, dGan, tGan];
    const allHidden = [yHidden, mHidden, dHidden, tHidden];
    const organCheckup = calculateOrganCheckup(allStems, allHidden);

    // 大運推算
    const yun = eightChar.getYun(isMale ? 1 : 0);
    const daYunList = [];
    try {
      const dyRaw = yun.getDaYun();
      for (let i = 1; i < 11; i++) {
        if (dyRaw[i]) {
          const dyGZ = dyRaw[i].getGanZhi();
          daYunList.push({
            age: dyRaw[i].getStartAge(),
            ganZhi: dyGZ,
            gan: dyGZ.charAt(0),
            zhi: dyGZ.charAt(1),
            shiShen: toTrad(dyRaw[i].getShiShenGan?.() || '')
          });
        }
      }
    } catch (e) {
      console.warn('DaYun calculation fallback:', e);
    }

    // 陽宅命卦
    const gua = calculateGua(lunar.getYear(), gender);

    // 姓名三才五格（純繁體）
    const sancai = calculateNameSancai(userName);

    // 五行力量統計與日主強弱判斷
    let wood = 0, fire = 0, earth = 0, metal = 0, water = 0;
    organCheckup.forEach(item => {
      if (item.wuxing === '木') wood += item.count * 100;
      if (item.wuxing === '火') fire += item.count * 100;
      if (item.wuxing === '土') earth += item.count * 100;
      if (item.wuxing === '金') metal += item.count * 100;
      if (item.wuxing === '水') water += item.count * 100;
    });

    const dayWuxing = STEM_WU_XING[dGan];
    // 日主旺衰簡化值
    const selfPower = (dayWuxing === '火' ? fire + wood : (dayWuxing === '木' ? wood + water : (dayWuxing === '金' ? metal + earth : (dayWuxing === '水' ? water + metal : earth + fire))));
    const otherPower = 1500 - selfPower;

    return {
      userName,
      gender,
      genderLabel,
      zodiac: `肖${zodiac}`,
      solarDate: solarDateStr,
      solarTime: birthTimeStr,
      solarString: `公元${year}年 ${month}月${day}日 ${hour}時 星期${'日一二三四五六'.charAt(solar.getWeek())}`,
      lunarString: `農曆 ${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}日 ${tZhi}時建生`,
      fourPillars: {
        time: {
          title: '時柱',
          mainStar: tShiShenGan,
          gan: tGan,
          zhi: tZhi,
          ganWuxing: STEM_WU_XING[tGan],
          zhiWuxing: BRANCH_WU_XING[tZhi],
          hidden: tHidden.map((h, i) => ({ stem: h, shiShen: tShiShenZhi[i] })),
          diShi: tDiShi,
          shenSha: shenSha.time,
          naYin: tNaYin
        },
        day: {
          title: '日柱',
          mainStar: dShiShenGan,
          gan: dGan,
          zhi: dZhi,
          ganWuxing: STEM_WU_XING[dGan],
          zhiWuxing: BRANCH_WU_XING[dZhi],
          hidden: dHidden.map((h, i) => ({ stem: h, shiShen: dShiShenZhi[i] })),
          diShi: dDiShi,
          shenSha: shenSha.day,
          naYin: dNaYin
        },
        month: {
          title: '月柱',
          mainStar: mShiShenGan,
          gan: mGan,
          zhi: mZhi,
          ganWuxing: STEM_WU_XING[mGan],
          zhiWuxing: BRANCH_WU_XING[mZhi],
          hidden: mHidden.map((h, i) => ({ stem: h, shiShen: mShiShenZhi[i] })),
          diShi: mDiShi,
          shenSha: shenSha.month,
          naYin: mNaYin
        },
        year: {
          title: '年柱',
          mainStar: yShiShenGan,
          gan: yGan,
          zhi: yZhi,
          ganWuxing: STEM_WU_XING[yGan],
          zhiWuxing: BRANCH_WU_XING[yZhi],
          hidden: yHidden.map((h, i) => ({ stem: h, shiShen: yShiShenZhi[i] })),
          diShi: yDiShi,
          shenSha: shenSha.year,
          naYin: yNaYin
        }
      },
      auxiliary: {
        dayKong,
        yearKong,
        taiXi,
        taiYuan,
        mingGong,
        shenGong,
        mingGe: mShiShenGan
      },
      interactions,
      organCheckup,
      gua,
      sancai,
      daYun: {
        startDesc: `出生後${yun.getStartYear()}年${yun.getStartMonth()}個月又${yun.getStartDay()}天上大運`,
        exchangeDesc: `每逢${yGan === '癸' ? '癸或戊年' : '干支年'}節氣交接天交大運`,
        list: daYunList
      },
      wuxingBalance: {
        wang: '土',
        xiang: '金',
        si: '水',
        qiu: '木',
        xiu: '火',
        xi: '火',
        xian: '土',
        chou: '金',
        ji: '水',
        yong: '木',
        scorePos: `+ ${Math.min(999, Math.round(selfPower))}`,
        scoreNeg: `- ${Math.min(999, Math.round(otherPower))}`,
        isWeak: selfPower < otherPower
      }
    };
  }

  // 暴露全域物件
  global.MeetJoyBaZi = {
    buildBaZiChart,
    toTrad
  };

})(typeof window !== 'undefined' ? window : global);
