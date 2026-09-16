/**
 * 癒見幸福 · 魔法占星學院
 * 八字排盤大典核心推導引擎 (MeetJoy BaZi Engine)
 * 100% 繁體中文（台灣）· 依據愛倫院長正統東方命理體系
 */

(function (global) {
  'use strict';

  // 1. 簡繁字典轉換表（確保 100% 繁體中文，消除任何簡體字）
  const SIMP_TO_TRAD = {
    '劫财': '劫財',
    '正财': '正財',
    '偏财': '偏財',
    '伤官': '傷官',
    '七杀': '七殺',
    '财': '財',
    '伤': '傷',
    '杀': '殺',
    '枭': '梟',
    '养': '養',
    '带': '帶',
    '长生': '長生',
    '绝': '絕',
    '临官': '臨官',
    '帝旺': '帝旺',
    '归禄': '歸祿',
    '禄': '祿',
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
    '狗': '狗',
    '冲': '沖',
    '贵': '貴',
    '医': '醫',
    '华': '華',
    '阴': '陰',
    '阳': '陽',
    '气': '氣',
    '历': '曆',
    '关': '關',
    '门': '門',
    '会': '會',
    '灾': '災',
    '煞': '煞',
    '长': '長'
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

    // 金匱 (申子辰見卯，寅午戌見酉，巳酉丑見子，亥卯未見午)
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

    // 將星 (申子辰見子，寅午戌見午，巳酉丑見酉，亥卯未見卯)
    const jiangXingMap = {
      '申': '子', '子': '子', '辰': '子',
      '寅': '午', '午': '午', '戌': '午',
      '巳': '酉', '酉': '酉', '丑': '酉',
      '亥': '卯', '卯': '卯', '未': '卯'
    };
    const targetJiangXing = jiangXingMap[dayZhi] || jiangXingMap[yearZhi];
    if (targetJiangXing) {
      if (yearZhi === targetJiangXing) res.year.push('將星');
      if (monthZhi === targetJiangXing) res.month.push('將星');
      if (dayZhi === targetJiangXing) res.day.push('將星');
      if (timeZhi === targetJiangXing) res.time.push('將星');
    }

    // 祿神 (甲寅乙卯丙戊巳，丁己午庚申，辛酉壬亥癸子)
    const luShenMap = {
      '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
      '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
    };
    const targetLu = luShenMap[dayGan];
    if (targetLu) {
      if (yearZhi === targetLu) res.year.push('祿神');
      if (monthZhi === targetLu) res.month.push('祿神');
      if (dayZhi === targetLu) res.day.push('祿神');
      if (timeZhi === targetLu) res.time.push('祿神');
    }

    // 羊刃 (祿前一位)
    const yangRenMap = {
      '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午',
      '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑'
    };
    const targetYangRen = yangRenMap[dayGan];
    if (targetYangRen) {
      if (yearZhi === targetYangRen) res.year.push('羊刃');
      if (monthZhi === targetYangRen) res.month.push('羊刃');
      if (dayZhi === targetYangRen) res.day.push('羊刃');
      if (timeZhi === targetYangRen) res.time.push('羊刃');
    }

    // 紅鸞與天喜 (年支起算)
    const hongLuanMap = {
      '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌',
      '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
    };
    const tianXiMap = {
      '子': '酉', '丑': '申', '寅': '未', '卯': '午', '辰': '巳', '巳': '辰',
      '午': '卯', '未': '寅', '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    };
    const targetHongLuan = hongLuanMap[yearZhi];
    const targetTianXi = tianXiMap[yearZhi];
    ['year', 'month', 'day', 'time'].forEach((col, idx) => {
      const z = [yearZhi, monthZhi, dayZhi, timeZhi][idx];
      if (z === targetHongLuan) res[col].push('紅鸞');
      if (z === targetTianXi) res[col].push('天喜');
    });

    // 孤辰與寡宿 (方合推算)
    const guChenMap = {
      '亥': '寅', '子': '寅', '丑': '寅',
      '寅': '巳', '卯': '巳', '辰': '巳',
      '巳': '申', '午': '申', '未': '申',
      '申': '亥', '酉': '亥', '戌': '亥'
    };
    const guaSuMap = {
      '亥': '戌', '子': '戌', '丑': '戌',
      '寅': '丑', '卯': '丑', '辰': '丑',
      '巳': '辰', '午': '辰', '未': '辰',
      '申': '未', '酉': '未', '戌': '未'
    };
    const targetGuChen = guChenMap[yearZhi];
    const targetGuaSu = guaSuMap[yearZhi];
    ['year', 'month', 'day', 'time'].forEach((col, idx) => {
      const z = [yearZhi, monthZhi, dayZhi, timeZhi][idx];
      if (z === targetGuChen) res[col].push('孤辰');
      if (z === targetGuaSu) res[col].push('寡宿');
    });

    // 十靈日
    const shiLingDays = ['甲辰', '乙丑', '丙辰', '丁酉', '戊辰', '己丑', '庚戌', '辛亥', '壬寅', '癸亥'];
    const currentDayGZ = `${dayGan}${dayZhi}`;
    if (shiLingDays.includes(currentDayGZ)) {
      res.day.push('十靈');
    }

    // 天德、月德、天德合、月德合 (依月令推)
    if (monthZhi === '丑') {
      res.month.push('天德合', '月德合', '天狗');
    } else if (monthZhi === '寅') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '卯') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '辰') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '巳') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '午') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '未') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '申') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '酉') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '戌') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '亥') {
      res.month.push('天德', '月德');
    } else if (monthZhi === '子') {
      res.month.push('天德', '月德');
    }

    // 天乙貴人
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

    // 文昌貴人
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

    // 驛馬
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

    // 桃花 / 咸池
    const taoHuaMap = {
      '申': '酉', '子': '酉', '辰': '酉',
      '寅': '卯', '午': '卯', '戌': '卯',
      '巳': '午', '酉': '午', '丑': '午',
      '亥': '子', '卯': '子', '未': '子'
    };
    const targetTaoHua = taoHuaMap[dayZhi] || taoHuaMap[yearZhi];
    if (targetTaoHua) {
      if (yearZhi === targetTaoHua) res.year.push('咸池');
      if (monthZhi === targetTaoHua) res.month.push('咸池');
      if (dayZhi === targetTaoHua) res.day.push('咸池');
      if (timeZhi === targetTaoHua) res.time.push('咸池');
    }

    // 華蓋
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

    // 國印貴人
    const guoYinMap = {
      '甲': '戌', '乙': '亥', '丙': '丑', '丁': '寅', '戊': '丑',
      '己': '寅', '庚': '辰', '辛': '巳', '壬': '未', '癸': '申'
    };
    const targetGuoYin = guoYinMap[dayGan];
    if (targetGuoYin) {
      if (yearZhi === targetGuoYin) res.year.push('國印');
      if (monthZhi === targetGuoYin) res.month.push('國印');
      if (dayZhi === targetGuoYin) res.day.push('國印');
      if (timeZhi === targetGuoYin) res.time.push('國印');
    }

    // 天醫 (月令前一位)
    const tianYiMedMap = {
      '寅': '丑', '卯': '寅', '辰': '卯', '巳': '辰', '午': '巳', '未': '午',
      '申': '未', '酉': '申', '戌': '酉', '亥': '戌', '子': '亥', '丑': '子'
    };
    const targetMed = tianYiMedMap[monthZhi];
    if (targetMed) {
      if (yearZhi === targetMed) res.year.push('天醫');
      if (dayZhi === targetMed) res.day.push('天醫');
      if (timeZhi === targetMed) res.time.push('天醫');
    }

    // 去除各柱重複神煞
    res.year = Array.from(new Set(res.year));
    res.month = Array.from(new Set(res.month));
    res.day = Array.from(new Set(res.day));
    res.time = Array.from(new Set(res.time));

    return res;
  }

  // 6. 地支會合刑沖破害速查表推導
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
    if (guaNum === 5) guaNum = isMale ? 2 : 8;

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

    return {
      houseGua: `${houseGua.group} ${houseGua.symbol} ${houseGua.name}`,
      guaUpper: '巽',
      symbolUpper: '☴',
      guaLower: houseGua.name,
      symbolLower: houseGua.symbol,
      guaName: houseGua.name === '坎' ? '風水渙' : `風${houseGua.name}卦`
    };
  }

  // 9. 姓名學三才五格計算（純繁體）
  const KANGXI_STROKES = {
    '史': 5, '可': 5, '法': 9, '愛': 13, '倫': 10, '楊': 13, '里': 7, '中': 4,
    '陳': 16, '林': 8, '黃': 12, '張': 11, '李': 7, '王': 4, '吳': 7, '劉': 15,
    '蔡': 17, '許': 11, '鄭': 19, '謝': 17, '郭': 15, '洪': 10, '曾': 12,
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
    const code = char.charCodeAt(0);
    return (code % 15) + 3;
  }

  function getStrokeWuXing(num) {
    const last = num % 10;
    if (last === 1 || last === 2) return '木';
    if (last === 3 || last === 4) return '火';
    if (last === 5 || last === 6) return '土';
    if (last === 7 || last === 8) return '金';
    return '水';
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
      const s1 = charList[0].strokes;
      const s2 = charList[1].strokes;
      const s3 = charList[2].strokes;
      tianGe = s1 + 1;
      renGe = s1 + s2;
      diGe = s2 + s3;
      zongGe = s1 + s2 + s3;
      waiGe = zongGe - renGe + 1;
    }

    const geCheck = (num) => {
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

  // 視覺盤專用資料：節氣刻度、柱與柱的關係、生活化神煞圖鑑說明
  const SHEN_SHA_GUIDE = {
    '天乙貴人': '遇難呈祥的頂級貴人星。出門在外或推動專案時，常有長輩或關鍵主管在暗中替你排除阻礙。主動把想法講清楚，貴人就在你身邊。',
    '太極貴人': '自帶探究生命底層規律的靈慧悟性。在玄學、心理學或深層策略思考上容易一點就通，心境始終能回歸沉著安穩。',
    '天德': '日月普照的化煞吉星。即便遇到人際誤會或突發風波，也能逢凶化吉，以仁慈包容的態度換得他人信賴。',
    '月德': '母性慈暉與溫暖修復力。利於家庭和睦、團隊凝聚與女長輩的真心提攜，是一顆撫平心靈焦躁的定心丸。',
    '天德合': '化解官非與爭吵的和事佬氣場。行事低調謙和，遇到利益爭端常有人主動出面調停，大事化小小事化無。',
    '月德合': '善結善緣的親和力。在社交場合容易讓人卸下心防，人脈網絡往往以極為自然的步調綿密鋪展。',
    '文昌': '智慧之光與邏輯創作天賦。能把複雜專業轉化為接地氣的文字或簡報，在學習考試與產品發想上極具說服力。',
    '文曲': '文藝風雅與口才魅力。擅長美學營造、情緒表達與生動的故事敘述，自帶圈粉的感染力。',
    '國印': '握有實權與印鑑之吉星。做事有公信力、嚴謹靠譜，容易在體制或組織中接管核心管理權力。',
    '學堂': '終身學習的求知引擎。對新事物總是保有孩童般的好奇心，能迅速在陌生領域建立專業結構。',
    '詞館': '出口成章的表達天才。公關發言、談判演講或專案匯報時條理分明，能精準直擊人心痛點。',
    '金輿': '古代王公貴族坐乘的華車。代表物質生活具備富足餘裕，出門有體面的座駕與舒適的出行體驗。',
    '金匱': '財帛豐隆的掌櫃聚寶盆。自帶積蓄財富與打理資產的定力，不易隨波逐流亂花錢，越存底氣越足。',
    '祿神': '立足天地的自尊底氣。靠著紮實專業與行動力吃穿不愁，是現代職場中最強悍的實力派靠山。',
    '羊刃': '特種部隊般的極致推進力。敢衝敢闖、無懼險阻；只要把鋒芒轉化為開疆闢土的執行力，就是破局利器。',
    '飛刃': '偶爾浮動的小心急。提醒你在專案進入最後關頭時放慢節奏，檢查細節，別讓小失誤擾亂大局。',
    '驛馬': '自帶遠行與跳躍動能。適合在移動中拓展視野、跨國界或跨領域發展，空間換個視角，靈感隨之噴湧。',
    '桃花': '天然的人格吸引力。把魅力放在同理傾聽與真誠互動上，不僅能迎來好人緣，更能轉化為強大事業推力。',
    '咸池': '對美學與感官體驗的極高講究。穿著品味獨具一格，把這份敏銳投射在藝術與生活風格上會非常迷人。',
    '紅鸞': '金玉良緣與喜慶吉星。容易在輕鬆日常中吸引頻率對齊的靈魂伴侶，在合作關係中也是帶來喜悅的吉祥物。',
    '天喜': '傳遞喜悅與笑聲的開心果。自帶化解尷尬氣氛的魔法，身邊的人只要看見你笑，焦慮就會被驅散一半。',
    '天廚': '人間美食家與福祿星。天生懂吃、懂生活，容易因美食結交跨界摯友，一生生活有滋有味。',
    '福星': '知足常樂的天生好心態。即便生活遇到顛簸，也能迅速轉念看見禮物，福氣往往隨之而至。',
    '將星': '統御全局的將領威嚴。在危急時刻具備定海神針般的判斷力，容易成為團隊核心支柱。',
    '華蓋': '哲人與藝術家的靈魂高地。需要定期安靜獨處，在書房或冥想角沉澱雜訊，將靈感淬煉為傳世之作。',
    '孤辰': '獨立自主的精神邊界。不喜隨波逐流攀附人際，在無人打擾的深度專注中能創造驚人成果。',
    '寡宿': '沉靜內斂的心靈密室。對外界喧囂保持一份清醒，善於在夜深人靜時與真實的自己對話。',
    '亡神': '深謀遠慮的策士思維。善於察覺他人看不見的破綻與細節，適合從事高智商策略或審查規劃。',
    '劫煞': '逆境重生的戰鬥意志。遇到突發變故反而激發內在潛能，能在絕境中殺出一條血路。',
    '災煞': '生活偶爾亮起的黃燈警示。提醒你出門注意安全、避免疲勞駕駛，凡事留有備案就是最好的護身符。',
    '天羅': '內心自我設定的框架。提醒你別過度內耗鑽牛角尖，把視角拉到三年後看當下，一切都微不足道。',
    '地網': '現實條件的暫時約束。提醒你現在是蹲低蓄力的時刻，等待時機成熟就能一躍而起。',
    '披麻': '提醒多關心長輩健康的身心雷達。定期一通電話、一次問候，都是溫暖人心的力量。',
    '弔客': '對環境氣場的敏感雷達。避免出入陰暗負能過重的場所，隨身攜帶淨化精油保護氣場。',
    '喪門': '提醒你適時放手舊有的包袱。告別不再滋養你的生活習慣，才能迎接嶄新的生命篇章。',
    '血刃': '提醒日常避免粗心磕碰的提示燈。切菜、運動時保持專注呼吸，把心定在當下。',
    '十靈': '直覺極為靈敏的第七感。做夢或靈光乍現時常常預知未來走向，適合從事身心靈與創意策劃。',
    '魁罡': '性格堅毅、雷厲風行的鐵血帥才。做事講求效率與原則，只要多一份溫柔聆聽，便能凝聚大眾。',
    '陰陽差錯': '溝通時多說一句確認的提醒。在親密關係中別假設對方一定懂，把愛意直白講出來更甜蜜。',
    '童子': '純真無邪的赤子之心。對世界保留一份童話般的想像力，眼神清澈，具備天然的心靈療癒力。',
    '天醫': '自帶療癒他人的天命力量。適合從事身心療癒、醫療護理或芳香療法，一句話就能溫暖病苦之心。',
    '天赦': '上天赦免過錯的大慈悲吉星。一生常有柳暗花明的奇蹟，只要心存正念行善，萬事都能峰迴路轉。',
    '天官': '體制提拔與職位升遷之貴人。在公職或企業中做事合規合矩，容易獲得高層賞識。',
    '天福': '隨遇而安的無形福佑。在緊要關頭總能化險為夷，是心底無私天地寬的最佳寫照。',
    '天巫': '對宇宙玄奧與身心頻率的解碼天賦。在命理卜筮與能量調頻領域擁有極高的穿透力。',
    '德秀': '外貌清秀、氣質溫潤的文雅之星。言行舉止散發得體教養，容易給人留下極佳的第一印象。',
    '三奇': '乙丙丁或甲戊庚之奇才格局。思維異於常人，敢走別人不敢走的道路，能成就劃時代的創舉。',
    '拱祿': '暗中匯聚財帛的隱形金庫。財不外露、低調富足，生活品質遠比表面看起來更加優雅。',
    '拱貴': '暗藏關鍵人脈的隱形守護。在緊要關頭總會有重量級大人物在幕後為你鋪路。',
    '暗祿': '不為人知的意外進帳。常常在無意之間獲得分紅、遺產或驚喜回饋，天道酬勤。',
    '孤鸞': '在親密關係中渴望保有自我空間的標籤。學會伴侶間的留白與互相成全，關係會越陳越香。',
    '學士': '學者般的求證精神。對知識講究源頭與邏輯，能把古老智慧轉化為現代實用的知識體系。',
    '天狗': '月令相涉的小磕絆。提醒在口舌互動上多一分寬容，不與認知不同的人爭論高低。',
    '長生': '如初生嬰兒般源源不絕的生機活力。永遠對生活充滿希望與好奇，重啟人生的韌性極強。'
  };

  const SHEN_SHA_CATALOG = Object.keys(SHEN_SHA_GUIDE);

  // 10. 二十四節氣時間軸精算（依八字月令「節」精確計算，完全對齊截圖 IMG_8045.PNG）
  function buildJieQiTimeline(solar) {
    try {
      const lunar = solar.getLunar();
      // 八字月令以「節」定界（如立冬～大雪），故使用 getPrevJie / getNextJie
      const prev = lunar.getPrevJie(false) || lunar.getPrevJieQi(false);
      const next = lunar.getNextJie(false) || lunar.getNextJieQi(false);
      const prevSolar = prev && prev.getSolar();
      const nextSolar = next && next.getSolar();
      const start = prevSolar ? new Date(prevSolar.getYear(), prevSolar.getMonth() - 1, prevSolar.getDay(), prevSolar.getHour(), prevSolar.getMinute(), prevSolar.getSecond()).getTime() : 0;
      const end = nextSolar ? new Date(nextSolar.getYear(), nextSolar.getMonth() - 1, nextSolar.getDay(), nextSolar.getHour(), nextSolar.getMinute(), nextSolar.getSecond()).getTime() : 0;
      const now = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay(), solar.getHour(), solar.getMinute(), solar.getSecond()).getTime();
      const unit = 3600000;
      const phrase = h => `${Math.max(0, Math.floor(h / 24))}天 ${Math.max(0, Math.floor(h % 24))}小時`;
      return {
        prev: prev ? { name: toTrad(prev.getName()), time: prevSolar.toYmdHms(), distance: phrase((now - start) / unit) } : null,
        next: next ? { name: toTrad(next.getName()), time: nextSolar.toYmdHms(), distance: phrase((end - now) / unit) } : null,
        progress: start && end ? Math.max(3, Math.min(97, ((now - start) / (end - start)) * 100)) : 50
      };
    } catch (e) {
      console.warn('JieQi timeline calculation fallback:', e);
      return {
        prev: { name: '立春', time: '--', distance: '0天' },
        next: { name: '驚蟄', time: '--', distance: '0天' },
        progress: 50
      };
    }
  }

  // 11. 兩柱關係智能診斷與四柱內部關係線
  function buildPillarRelations(pillars) {
    const pairs = [
      ['time', 'day', '時柱', '日柱'],
      ['day', 'month', '日柱', '月柱'],
      ['month', 'year', '月柱', '年柱'],
      ['time', 'month', '時柱', '月柱'],
      ['day', 'year', '日柱', '年柱'],
      ['time', 'year', '時柱', '年柱']
    ];

    const ganHe = ['甲己', '乙庚', '丙辛', '丁壬', '戊癸'];
    const ganKe = ['甲戊', '乙己', '丙庚', '丁辛', '戊壬', '己癸', '庚甲', '辛乙', '壬丙', '癸丁'];
    const ganSheng = ['甲丙', '乙丁', '丙戊', '丁己', '戊庚', '己辛', '庚壬', '辛癸', '壬甲', '癸乙'];
    const chong = ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'];
    const liuHe = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'];
    const xing = ['子卯', '卯子', '寅巳', '巳申', '申寅', '丑戌', '戌未', '未丑', '辰辰', '午午', '酉酉', '亥亥'];
    const hai = ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'];
    const po = ['子酉', '丑辰', '寅亥', '卯午', '巳申', '未戌'];
    const anHe = ['寅丑', '午亥', '卯申'];

    const rows = [];
    const inDeckRelations = [];
    const notesByPillar = { time: [], day: [], month: [], year: [] };

    pairs.forEach(([a, b, aName, bName]) => {
      const x = pillars[a], y = pillars[b];
      const g = `${x.gan}${y.gan}`;
      const gSorted = g.split('').sort().join('');
      const z = `${x.zhi}${y.zhi}`;
      const zSorted = z.split('').sort().join('');

      let type = '', label = '', tone = 'gold';

      if (x.gan === y.gan && x.zhi === y.zhi) {
        type = '伏吟';
        label = `${aName}與${bName}天干地支完全相同。情緒與內心感受容易在特定時刻被放大，適合留白沉澱，避免在同一件事上重複鑽牛角尖。`;
        tone = 'violet';
        notesByPillar[a].push(`伏吟 ${bName}`);
        notesByPillar[b].push(`伏吟 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '伏吟', tone: 'violet' });
      } else if (chong.includes(zSorted) && (chong.includes(gSorted) || ganKe.includes(g) || ganKe.includes(y.gan + x.gan))) {
        type = '天剋地沖 (反吟)';
        label = `${aName}與${bName}天地同翻。如同生活環境或思考模式的劇烈轉折期，先訂好底線規則，把衝突轉化為打破天花板的動力。`;
        tone = 'red';
        notesByPillar[a].push(`同沖 ${bName}`);
        notesByPillar[b].push(`同沖 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '反吟', tone: 'red' });
      } else if (ganHe.includes(gSorted) && liuHe.includes(zSorted)) {
        type = '天地合';
        label = `${aName}與${bName}干支雙合。外在理念相契合、內在日常又極具默契，是雙向奔赴的極佳共鳴組合。`;
        tone = 'green';
        notesByPillar[a].push(`天地合 ${bName}`);
        notesByPillar[b].push(`天地合 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '六合', tone: 'green' });
      } else if (chong.includes(zSorted)) {
        type = '地支六沖';
        label = `${aName}（${x.zhi}）與${bName}（${y.zhi}）相沖。宇宙按下震動模式，提醒你在生活步調上給彼此空間，換個視角思考就能順利通關。`;
        tone = 'red';
        notesByPillar[a].push(`沖 ${bName}`);
        notesByPillar[b].push(`沖 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '六沖', tone: 'red' });
      } else if (liuHe.includes(zSorted)) {
        type = '地支六合';
        label = `${aName}（${x.zhi}）與${bName}（${y.zhi}）六合。相處自然、心照不宣，能自發形成合作默契。`;
        tone = 'green';
        notesByPillar[a].push(`六合 ${bName}`);
        notesByPillar[b].push(`六合 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '六合', tone: 'green' });
      } else if (x.zhi === y.zhi && ['辰', '午', '酉', '亥'].includes(x.zhi)) {
        type = '地支自刑';
        label = `${aName}與${bName}同逢${x.zhi}自刑。夜深人靜時容易內耗腦補小劇場，多喝杯洋甘菊茶，放下對完美的執念。`;
        tone = 'violet';
        notesByPillar[a].push(`自刑 ${bName}`);
        notesByPillar[b].push(`自刑 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '自刑', tone: 'violet' });
      } else if (xing.includes(z) || xing.includes(y.zhi + x.zhi)) {
        type = '地支相刑';
        label = `${aName}（${x.zhi}）與${bName}（${y.zhi}）相刑。在細節處容易各有堅持，試著放下爭論對錯，就事論事最輕鬆。`;
        tone = 'red';
        notesByPillar[a].push(`同刑 ${bName}`);
        notesByPillar[b].push(`同刑 ${aName}`);
        inDeckRelations.push({ from: a, to: b, fromZhi: x.zhi, toZhi: y.zhi, type: '相刑', tone: 'red' });
      } else if (hai.includes(zSorted)) {
        type = '地支相害';
        label = `${aName}（${x.zhi}）與${bName}（${y.zhi}）相害。容易在無意間忽略對方的感受，凡事多一句主動告知，便能避免猜忌。`;
        tone = 'gold';
        notesByPillar[a].push(`害 ${bName}`);
        notesByPillar[b].push(`害 ${aName}`);
      } else if (po.includes(zSorted)) {
        type = '地支相破';
        label = `${aName}（${x.zhi}）與${bName}（${y.zhi}）相破。計畫容易受到突發小插曲干擾，保持彈性就是最好的心態解藥。`;
        tone = 'gold';
        notesByPillar[a].push(`破 ${bName}`);
        notesByPillar[b].push(`破 ${aName}`);
      } else if (anHe.includes(zSorted)) {
        type = '地支暗合';
        label = `${aName}（${x.zhi}）與${bName}（${y.zhi}）暗合。私下有深層的情感連結或默契支援，不用多說也能互相撐腰。`;
        tone = 'green';
        notesByPillar[a].push(`暗合 ${bName}`);
        notesByPillar[b].push(`暗合 ${aName}`);
      } else if (ganHe.includes(gSorted)) {
        type = '天干五合';
        label = `${aName}天干${x.gan}與${bName}天干${y.gan}相合。思維溝通頻率容易同頻共振，討論願景時充滿火花。`;
        tone = 'green';
        notesByPillar[a].push(`天干合 ${bName}`);
        notesByPillar[b].push(`天干合 ${aName}`);
      }

      if (type) {
        rows.push({ from: a, to: b, fromName: aName, toName: bName, type, label, tone, gan: g, zhi: z });
      }
    });

    // 檢查地支半合 / 三合
    const sanHeGroups = [
      { name: '金局', chars: ['巳', '酉', '丑'], wuxing: '金' },
      { name: '水局', chars: ['申', '子', '辰'], wuxing: '水' },
      { name: '木局', chars: ['亥', '卯', '未'], wuxing: '木' },
      { name: '火局', chars: ['寅', '午', '戌'], wuxing: '火' }
    ];

    sanHeGroups.forEach(grp => {
      const matchIndices = [];
      ['time', 'day', 'month', 'year'].forEach((k) => {
        if (grp.chars.includes(pillars[k].zhi)) matchIndices.push({ key: k, zhi: pillars[k].zhi });
      });
      if (matchIndices.length >= 2) {
        const fromItem = matchIndices[0];
        const toItem = matchIndices[matchIndices.length - 1];
        const isFull = matchIndices.length >= 3;
        const typeName = isFull ? `三合${grp.name}成化` : `半合${grp.name}成化`;
        inDeckRelations.push({
          from: fromItem.key,
          to: toItem.key,
          fromZhi: fromItem.zhi,
          toZhi: toItem.zhi,
          type: typeName,
          tone: 'gold'
        });
      }
    });

    return {
      relations: rows,
      inDeckRelations,
      notesByPillar
    };
  }

  // 12. 八字主排盤總入口
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
    const zodiac = lunar.getYearShengXiao();

    // 四柱干支
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
            ganWuxing: STEM_WU_XING[dyGZ.charAt(0)],
            zhiWuxing: BRANCH_WU_XING[dyGZ.charAt(1)],
            shiShen: toTrad(dyRaw[i].getShiShenGan?.() || '')
          });
        }
      }
    } catch (e) {
      console.warn('DaYun calculation fallback:', e);
    }

    // 陽宅命卦
    const gua = calculateGua(lunar.getYear(), gender);

    // 姓名三才五格
    const sancai = calculateNameSancai(userName);

    // 四柱物件構建
    const fourPillars = {
      time: {
        title: '時柱',
        mainStar: tShiShenGan,
        gan: tGan,
        zhi: tZhi,
        ganWuxing: STEM_WU_XING[tGan],
        zhiWuxing: BRANCH_WU_XING[tZhi],
        hidden: tHidden.map((h, i) => ({ stem: h, shiShen: tShiShenZhi[i], wuxing: STEM_WU_XING[h] })),
        diShi: tDiShi,
        shenSha: shenSha.time,
        naYin: tNaYin,
        isKong: (dayKong.includes(tZhi) || yearKong.includes(tZhi))
      },
      day: {
        title: '日柱',
        mainStar: dShiShenGan,
        gan: dGan,
        zhi: dZhi,
        ganWuxing: STEM_WU_XING[dGan],
        zhiWuxing: BRANCH_WU_XING[dZhi],
        hidden: dHidden.map((h, i) => ({ stem: h, shiShen: dShiShenZhi[i], wuxing: STEM_WU_XING[h] })),
        diShi: dDiShi,
        shenSha: shenSha.day,
        naYin: dNaYin,
        isKong: (dayKong.includes(dZhi) || yearKong.includes(dZhi))
      },
      month: {
        title: '月柱',
        mainStar: mShiShenGan,
        gan: mGan,
        zhi: mZhi,
        ganWuxing: STEM_WU_XING[mGan],
        zhiWuxing: BRANCH_WU_XING[mZhi],
        hidden: mHidden.map((h, i) => ({ stem: h, shiShen: mShiShenZhi[i], wuxing: STEM_WU_XING[h] })),
        diShi: mDiShi,
        shenSha: shenSha.month,
        naYin: mNaYin,
        isKong: (dayKong.includes(mZhi) || yearKong.includes(mZhi))
      },
      year: {
        title: '年柱',
        mainStar: yShiShenGan,
        gan: yGan,
        zhi: yZhi,
        ganWuxing: STEM_WU_XING[yGan],
        zhiWuxing: BRANCH_WU_XING[yZhi],
        hidden: yHidden.map((h, i) => ({ stem: h, shiShen: yShiShenZhi[i], wuxing: STEM_WU_XING[h] })),
        diShi: yDiShi,
        shenSha: shenSha.year,
        naYin: yNaYin,
        isKong: (dayKong.includes(yZhi) || yearKong.includes(yZhi))
      }
    };

    // 兩柱關係診斷與柱內標籤
    const relationsPack = buildPillarRelations(fourPillars);
    Object.keys(relationsPack.notesByPillar).forEach(k => {
      fourPillars[k].pillarNotes = Array.from(new Set(relationsPack.notesByPillar[k]));
    });

    // 節氣時間軸
    const jieQiTimeline = buildJieQiTimeline(solar);

    // 地支刑沖會合害速查
    const interactions = calculateZhiInteractions(tZhi, dZhi, mZhi, yZhi);

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
      lunarAge: new Date().getFullYear() - year + 1,
      fourPillars,
      jieQiTimeline,
      pillarRelations: relationsPack.relations,
      inDeckRelations: relationsPack.inDeckRelations,
      shenShaGuide: SHEN_SHA_GUIDE,
      shenShaCatalog: SHEN_SHA_CATALOG,
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
        startDesc: `出生後 ${yun.getStartYear()} 年 ${yun.getStartMonth()} 個月又 ${yun.getStartDay()} 天上大運`,
        exchangeDesc: `每逢 ${yGan === '癸' ? '癸或戊年' : '干支交替年'} 小寒後 3 天交大運`,
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
    toTrad,
    SHEN_SHA_GUIDE,
    SHEN_SHA_CATALOG
  };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
