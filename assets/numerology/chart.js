(() => {
  'use strict';

  const lines = [
    { digits: [1, 2, 3], label: '學習／藝術線' },
    { digits: [4, 5, 6], label: '組織線' },
    { digits: [7, 8, 9], label: '貴人線' },
    { digits: [1, 4, 7], label: '身／生產線' },
    { digits: [2, 5, 8], label: '心／情感線' },
    { digits: [3, 6, 9], label: '靈／靈性線' },
    { digits: [1, 5, 9], label: '事業線' },
    { digits: [3, 5, 7], label: '人緣線' }
  ];

  const threeCycleRanges = {
    1: ['0–26 歲', '27–53 歲', '54 歲起'],
    2: ['0–25 歲', '26–52 歲', '53 歲起'],
    3: ['0–33 歲', '34–60 歲', '61 歲起'],
    4: ['0–32 歲', '33–59 歲', '60 歲起'],
    5: ['0–31 歲', '32–58 歲', '59 歲起'],
    6: ['0–30 歲', '31–57 歲', '58 歲起'],
    7: ['0–29 歲', '30–56 歲', '57 歲起'],
    8: ['0–28 歲', '29–55 歲', '56 歲起'],
    9: ['0–27 歲', '28–54 歲', '55 歲起']
  };

  const pad = (number) => String(number).padStart(2, '0');
  const digitSum = (value) => String(value).replace(/\D/g, '').split('').reduce((total, digit) => total + Number(digit), 0);
  const reduce = (value) => {
    let number = Number(value);
    while (number > 9) number = digitSum(number);
    return number;
  };
  const escapeHtml = (text) => String(text).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));

  function localDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12);
  }

  function toInputDate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parts(date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  function dateDigits(dateParts) {
    return `${dateParts.year}${pad(dateParts.month)}${pad(dateParts.day)}`;
  }

  function trace(digits) {
    const steps = [];
    let total = digitSum(digits);
    steps.push(total);
    while (total > 9) {
      total = digitSum(total);
      steps.push(total);
    }
    return { digits: String(digits), sum: steps[0], steps, final: total };
  }

  function buildPlate(input) {
    const chartTrace = trace(dateDigits(input));
    const allDigits = `${dateDigits(input)}${chartTrace.steps.join('')}`;
    const counts = Object.fromEntries(Array.from({ length: 10 }, (_, index) => [index, 0]));
    allDigits.split('').forEach((digit) => { counts[digit] += 1; });
    return { ...chartTrace, counts, allDigits };
  }

  function lunarFromDate(date) {
    try {
      const formatter = new Intl.DateTimeFormat('en-u-ca-chinese-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' });
      const values = Object.fromEntries(formatter.formatToParts(date).filter((part) => ['relatedYear', 'year', 'month', 'day'].includes(part.type)).map((part) => [part.type, part.value]));
      const year = Number((values.relatedYear || values.year || '').match(/\d+/)?.[0]);
      const month = Number((values.month || '').match(/\d+/)?.[0]);
      const day = Number((values.day || '').match(/\d+/)?.[0]);
      if (year && month && day) return { year, month, day, isLeap: /bis/i.test(values.month || '') };
    } catch (error) {
      // A manual lunar-date field remains available if the browser does not support this calendar.
    }
    return null;
  }

  function displayTrace(chartTrace) {
    return `${chartTrace.digits.slice(0, 4)} / ${chartTrace.digits.slice(4, 6)} / ${chartTrace.digits.slice(6, 8)} ＝ ${chartTrace.steps.join(' → ')}`;
  }

  function lineState(counts, digits) {
    const values = digits.map((digit) => counts[digit]);
    if (values.every((value) => value > 0)) return '顯性';
    if (values.every((value) => value === 0)) return '隱性';
    return '未成線';
  }

  function annualCycleYear(birth, reference) {
    const beforeBirthday = reference.getMonth() + 1 < birth.month || (reference.getMonth() + 1 === birth.month && reference.getDate() < birth.day);
    return reference.getFullYear() - (beforeBirthday ? 1 : 0);
  }

  function flowTrace(kind, birth, reference) {
    const ref = parts(reference);
    let digits;
    if (kind === 'year') digits = `${annualCycleYear(birth, reference)}${pad(birth.month)}${pad(birth.day)}`;
    if (kind === 'month') digits = `${birth.year}${pad(ref.month)}${pad(birth.day)}`;
    if (kind === 'day') digits = `${birth.year}${pad(birth.month)}${pad(ref.day)}`;
    return trace(digits);
  }

  function currentAge(birth, reference) {
    let age = reference.getFullYear() - birth.year;
    if (reference.getMonth() + 1 < birth.month || (reference.getMonth() + 1 === birth.month && reference.getDate() < birth.day)) age -= 1;
    return age;
  }

  function threeCycles(birth, lifeNumber) {
    return [
      { name: '老年', value: reduce(digitSum(birth.year)), range: threeCycleRanges[lifeNumber][2] },
      { name: '壯年', value: reduce(digitSum(birth.day)), range: threeCycleRanges[lifeNumber][1] },
      { name: '青年', value: reduce(digitSum(birth.month)), range: threeCycleRanges[lifeNumber][0] }
    ];
  }

  function fiveStages(birth, time) {
    const hour = time ? Number(time.split(':')[0]) : 0;
    const minute = time ? Number(time.split(':')[1]) : 0;
    const steps = [digitSum(birth.year)];
    steps.push(steps[0] + birth.month);
    steps.push(steps[1] + birth.day);
    steps.push(steps[2] + hour);
    steps.push(steps[3] + minute);
    return [
      { name: '老年數', range: '61 歲起', raw: steps[0], value: reduce(steps[0]) },
      { name: '中年數', range: '41–60 歲', raw: steps[1], value: reduce(steps[1]) },
      { name: '青年數', range: '21–40 歲', raw: steps[2], value: reduce(steps[2]) },
      { name: '青少年數', range: '11–20 歲', raw: steps[3], value: reduce(steps[3]) },
      { name: '幼年數', range: '0–10 歲', raw: steps[4], value: reduce(steps[4]) }
    ];
  }

  function gridMarkup(counts) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => `<div class="sun-chart__cell ${counts[digit] ? 'is-filled' : 'is-empty'}"><strong>${digit}</strong><span>${counts[digit] || '—'}</span></div>`).join('');
  }

  function showPlate(root, key, plate) {
    root.querySelector(`[data-${key}-grid]`).innerHTML = gridMarkup(plate.counts);
    root.querySelector(`[data-${key}-zero]`).innerHTML = `<strong>0</strong><span>${plate.counts[0] || '—'}</span>`;
    root.querySelector(`[data-${key}-formula]`).textContent = displayTrace(plate);
  }

  function heavenDigits(plate) {
    const digits = new Set();
    const first = String(plate.steps[0]);
    if (first.length > 1) first.split('').forEach((digit) => digits.add(Number(digit)));
    return digits;
  }

  function renderEnergy(root, solar, lunar) {
    const mainDigits = [...new Set([solar.final, lunar.final])];
    const postHeaven = new Set([...heavenDigits(solar), ...heavenDigits(lunar)]);
    const counts = {};
    for (let digit = 0; digit <= 9; digit += 1) counts[digit] = solar.counts[digit] + lunar.counts[digit];
    const mainEntries = mainDigits.map((digit) => ({ digit, count: counts[digit] })).sort((a, b) => b.count - a.count || a.digit - b.digit);
    const otherEntries = Array.from({ length: 10 }, (_, index) => index).filter((digit) => !mainDigits.includes(digit)).map((digit) => ({ digit, count: counts[digit] })).sort((a, b) => b.count - a.count || a.digit - b.digit);

    let mainRank = 1;
    mainEntries.forEach((item, index) => {
      if (index > 0 && item.count !== mainEntries[index - 1].count) mainRank += 1;
      item.rank = mainRank;
    });
    let otherRank = (mainEntries.length ? mainRank : 0) + 1;
    otherEntries.forEach((item, index) => {
      if (index > 0 && item.count !== otherEntries[index - 1].count) otherRank += 1;
      item.rank = otherRank;
    });

    const entries = [...mainEntries, ...otherEntries];
    root.querySelector('[data-energy-order]').innerHTML = entries.map((item) => {
      const isMain = mainDigits.includes(item.digit);
      const struck = !isMain && !postHeaven.has(item.digit) && item.count > 0 && item.count <= 2;
      return `<div class="sun-chart__energy-item ${isMain ? 'is-main' : ''} ${struck ? 'is-struck' : ''} ${item.count === 0 ? 'is-empty-rank' : ''}"><span>${item.rank}</span><b>${item.digit}</b><em>${item.count} 格</em></div>`;
    }).join('');
    const missing = Array.from({ length: 10 }, (_, index) => index).filter((digit) => counts[digit] === 0);
    root.querySelector('[data-missing-numbers]').innerHTML = missing.length ? missing.map((digit) => `<b>${digit}</b>`).join('') : '<span>雙盤皆有顯現</span>';
  }

  const gifts = [
    { name: '創造力', items: [1, 3, { line: 0 }] },
    { name: '美感力', items: [2, 3, { line: 0 }] },
    { name: '溝通力', items: [2, 3, 7] },
    { name: '執行力', items: [4, 8, 9, { line: 3 }] },
    { name: '應變力', items: [1, 2, 3, 5, 8] },
    { name: '親和力', items: [2, 6, { line: 7 }] },
    { name: '分析力', items: [1, 3, 7] },
    { name: '適應力', items: [2, 5, 6, 8] },
    { name: '向心力', items: [4, 6, 9, { line: 4 }, { line: 5 }] },
    { name: '領導力', items: [1, 8, { line: 6 }] },
    { name: '業務力', items: [1, 2, 3, 6, 8, { line: 7 }] },
    { name: '企劃力', items: [3, 4, 7] },
    { name: '團隊力', items: [2, 4, 6, { line: 1 }, { line: 2 }, { line: 7 }] },
    { name: '挑戰力', items: [1, 5, 8, 9] },
    { name: '解決力', items: [1, 4, 7, 8, { line: 3 }, { line: 6 }] },
    { name: '堅定力', items: [1, 4, 7, 9] },
    { name: '共情力', items: [2, 5, 6, { line: 4 }] },
    { name: '觀察力', items: [2, 5, 7, 8] }
  ];

  function renderConnections(root, solar, lunar) {
    root.querySelector('[data-connections]').innerHTML = lines.map((line) => {
      const solarState = lineState(solar.counts, line.digits);
      const lunarState = lineState(lunar.counts, line.digits);
      const score = Number(solarState !== '未成線') + Number(lunarState !== '未成線');
      return `<div class="sun-chart__connection"><div><b>${line.digits.join('')}</b><span>${line.label}</span></div><p><i class="${solarState === '顯性' ? 'is-active' : ''}">日 ${solarState}</i><i class="${lunarState === '顯性' ? 'is-active' : ''}">月 ${lunarState}</i><strong>${score}</strong></p></div>`;
    }).join('');
  }

  function mainWeight(digit, solarFinal, lunarFinal, counts) {
    if (solarFinal === lunarFinal && digit === solarFinal) return 5;
    const mains = [...new Set([solarFinal, lunarFinal])];
    if (!mains.includes(digit)) return 1;
    const sorted = mains.slice().sort((a, b) => counts[b] - counts[a]);
    const position = sorted.indexOf(digit) + 1;
    if (position === 1) return 4;
    if (position === 2) return 3;
    return 1;
  }

  function renderGifts(root, solar, lunar) {
    const lineScore = (line) => {
      const solarState = lineState(solar.counts, line.digits);
      const lunarState = lineState(lunar.counts, line.digits);
      return Number(solarState !== '未成線') + Number(lunarState !== '未成線');
    };
    const counts = {};
    for (let digit = 0; digit <= 9; digit += 1) counts[digit] = solar.counts[digit] + lunar.counts[digit];
    const mains = [...new Set([solar.final, lunar.final])];
    const same = solar.final === lunar.final;
    const scored = gifts.map((gift, index) => {
      const parts = gift.items.map((item) => {
        if (typeof item === 'object') {
          const line = lines[item.line];
          return { digit: line.digits.join(''), label: '連線', points: lineScore(line) };
        }
        const count = counts[item];
        if (!mains.includes(item)) return { digit: item, label: '數字', points: count };
        const weight = same ? 5 : mainWeight(item, solar.final, lunar.final, counts);
        const label = same ? '內外主命・×5' : weight === 4 ? '主命・第一層' : weight === 3 ? '主命・第二層' : '主命';
        return { digit: item, label, points: weight * count + (count === 1 ? 2 : 0) };
      });
      return { id: index + 1, ...gift, total: parts.reduce((sum, part) => sum + part.points, 0), parts };
    });
    const ranked = scored.slice().sort((a, b) => b.total - a.total);
    ranked.forEach((gift, index) => {
      gift.rank = index > 0 && gift.total === ranked[index - 1].total ? ranked[index - 1].rank : index + 1;
    });
    root.querySelector('[data-gifts]').innerHTML = scored.map((gift) => `<article class="sun-chart__gift ${gift.rank <= 3 ? 'is-top' : ''}"><p><span>#${gift.rank}</span>${gift.rank <= 3 ? '<b class="sun-chart__crown">♛</b>' : ''}<h3>${gift.id}.${gift.name}</h3><b>${gift.total}</b></p><div>${gift.parts.map((part) => `<i title="${escapeHtml(part.label)}"><em>${part.digit}</em>${part.points}</i>`).join('')}</div></article>`).join('');
  }

  function renderFlows(root, birth, reference) {
    const labels = { year: ['流年', '生日週年制'], month: ['流月', '以流運月份推算'], day: ['流日', '以流運日期推算'] };
    root.querySelector('[data-time-flows]').innerHTML = ['year', 'month', 'day'].map((kind) => {
      const item = flowTrace(kind, birth, reference);
      return `<article class="sun-chart__flow"><div><span>${labels[kind][0]}</span><small>${labels[kind][1]}</small></div><p>${displayTrace(item)}</p><b>${item.final}</b></article>`;
    }).join('');
  }

  function renderCycleLists(root, birth, time, reference, lifeNumber) {
    const age = currentAge(birth, reference);
    const cycles = threeCycles(birth, lifeNumber);
    const activeThree = cycles.findIndex((cycle) => {
      const numbers = cycle.range.match(/\d+/g).map(Number);
      return numbers.length === 1 ? age >= numbers[0] : age >= numbers[0] && age <= numbers[1];
    });
    root.querySelector('[data-three-cycles]').innerHTML = cycles.map((cycle, index) => `<div class="sun-chart__cycle-row ${index === activeThree ? 'is-current' : ''}"><span>${cycle.name}</span><b>${cycle.value}</b><small>${cycle.range}</small></div>`).join('');
    root.querySelector('[data-five-stages]').innerHTML = fiveStages(birth, time).map((stage) => `<div class="sun-chart__cycle-row"><span>${stage.name}</span><b>${stage.value}</b><small>${stage.range}</small></div>`).join('');
  }

  function trianglePoints() {
    const A = [36, 12], B = [36, 160], C = [188, 160];
    const third = (from, to) => [from[0] + (to[0] - from[0]) / 3, from[1] + (to[1] - from[1]) / 3];
    const twoThird = (from, to) => [from[0] + (to[0] - from[0]) * 2 / 3, from[1] + (to[1] - from[1]) * 2 / 3];
    return [
      B,
      third(B, A),
      twoThird(B, A),
      A,
      third(A, C),
      twoThird(A, C),
      C,
      third(C, B),
      twoThird(C, B)
    ];
  }

  const NINE_STARS_DEFS = [
    { word: '名', title: '名望聲譽', desc: '立命顯揚 · 威信立心' },
    { word: '財', title: '正偏財祿', desc: '資源豐盛 · 物質豐盛' },
    { word: '官', title: '官祿威權', desc: '責任承擔 · 升遷掌印' },
    { word: '利', title: '獲利順遂', desc: '成果轉化 · 亨通回報' },
    { word: '交', title: '人際社交', desc: '合作連結 · 人脈擴展' },
    { word: '敗', title: '波折考驗', desc: '沉著轉機 · 逆境鍛造' },
    { word: '衰', title: '能量沉潛', desc: '內修調息 · 養精蓄銳' },
    { word: '煞', title: '制化化煞', desc: '破局化解 · 斬斷內耗' },
    { word: '絕', title: '歸零重生', desc: '蛻變涅槃 · 蓄勢新生' }
  ];

  function renderTriangle(root, lifeNumber, flowYear) {
    const sequence = Array.from({ length: 9 }, (_, index) => ((lifeNumber - 1 + index) % 9) + 1);
    const starWords = ['名', '財', '官', '利', '交', '敗', '衰', '煞', '絕'];
    const points = trianglePoints();
    root.querySelector('[data-time-triangle]').innerHTML = `<svg viewBox="-25 -5 260 200" role="img" aria-label="主命數 ${lifeNumber} 的九年循環三角盤"><path d="M36 160V12L188 160Z"/><path d="M36 160H188"/><text x="18" y="165" style="text-anchor:end">命盤柱</text>${points.map((point, index) => `<g class="${sequence[index] === flowYear ? 'is-current' : ''}${[0, 3, 6].includes(index) ? ' is-vertex' : ''}"><circle cx="${point[0]}" cy="${point[1]}" r="${[0, 3, 6].includes(index) ? 15 : 13}"/><text x="${point[0]}" y="${point[1] + 4}">${sequence[index]}</text><text x="${point[0]}" y="${point[1] + 24}" font-size="9" font-weight="bold" fill="#be5b3f">${starWords[index]}</text></g>`).join('')}</svg><p>數字由太陽盤主命數在左下直角「名」起算、順時針鋪滿三角形（名財官利交敗衰煞絕）；三頂點為同組數（147／258／369）。</p>`;
  }

  function renderNineStars(root, lifeNumber, flowYear) {
    const grid = root.querySelector('[data-nine-stars-grid]');
    const flowVal = root.querySelector('[data-flow-year-val]');
    if (!grid) return;
    if (flowVal) flowVal.textContent = `${flowYear} 數`;

    const base = Number(lifeNumber) || 9;
    const itemsHtml = NINE_STARS_DEFS.map((star, idx) => {
      // 每個字下面也從主命數開始寫數字依序在每個字的下面
      const num = ((base - 1 + idx) % 9) + 1;
      const isCurrentFlow = (num === flowYear);
      return `
        <div class="sun-chart__nine-star-item ${isCurrentFlow ? 'is-flow-current' : ''}">
          ${isCurrentFlow ? '<span class="sun-chart__nine-star-badge">當前流年</span>' : ''}
          <div class="sun-chart__nine-star-word">${star.word}</div>
          <div class="sun-chart__nine-star-num">${num}</div>
          <div class="sun-chart__nine-star-tag">${star.title}</div>
          <div class="sun-chart__nine-star-desc">${star.desc}</div>
        </div>
      `;
    }).join('');
    grid.innerHTML = itemsHtml;
  }

  const COMMUNICATION_GAPS = {
    0: {
      title: '鏡像同頻 · 惺惺相惜',
      desc: '雙方主修數相同。如同凝視鏡子中的自己，直覺與價值觀高度共鳴，無話不談。但在面對歧見時，容易執著於相同的盲點，互不相讓。',
      rx: '承認對方的固執正是自己性格的投射；爭執時按下 15 分鐘暫停鍵，各自深呼吸留白。'
    },
    1: {
      title: '齒輪相嵌 · 步調微調',
      desc: '相差 1 數。步調一動一靜，具有極佳的接力推進動能。日常相處易因快慢節奏差異產生微小焦慮（一人急於推進，另一人還在確認細節）。',
      rx: '走得快的一方多給對方三分鐘餘裕，慢的一方給予一句明確確認；彼此是協作齒輪，不是田徑賽跑。'
    },
    2: {
      title: '柔韌互補 · 感性理性',
      desc: '相差 2 數。一方注重感受氛圍與情緒流動，另一方聚焦客觀事實與邏輯條理。容易出現「一人在談心情，另一人卻在講大道理」的落差。',
      rx: '先接住情緒波浪（「我知道你辛苦了」），再進入客觀討論步驟；溫暖是最好的理性催化劑。'
    },
    3: {
      title: '靈感跳躍 · 務實築底',
      desc: '相差 3 數。一人天馬行空充滿創意奇想，另一人謹慎嚴密講究落地執行。容易互相覺得對方「過於理想化」或「過於僵化保守」。',
      rx: '跳躍者負責描繪星空願景，穩健者負責鋪設安全軌道；各自在擅長領域充分發揮，互不挑剔。'
    },
    4: {
      title: '自由破界 · 安全守成',
      desc: '相差 4 數。一方渴望突破常規探索未知，另一方重視安穩秩序與既定邊界。日常生活中容易因生活習慣或財務規劃的彈性產生拉鋸。',
      rx: '共同確立不可動搖的「安全底線」（如家庭備用金、基礎承諾），底線之外完全放手給予自由發揮。'
    },
    5: {
      title: '遠方探索 · 當下守護',
      desc: '相差 5 數。一方心思常在遠方的變革與擴張，另一方專注於營造當下的溫馨港灣。需要平衡「追求目標」與「陪伴日常」。',
      rx: '每月安排一次輕旅行滿足探索慾望，每週保留一個無科技干擾的寧靜夜晚專注交流。'
    },
    6: {
      title: '理想品質 · 隨性包容',
      desc: '相差 6 數。一方對細節與秩序有高標準要求，另一方隨遇而安不拘小節。容易把「生活細節的提醒」誤讀為「對感情的挑剔」。',
      rx: '戒除以「為你好」之名的微觀挑剔；將完美的標準留給專業作品，將寬厚溫柔留給親密伴侶。'
    },
    7: {
      title: '深度探尋 · 現實落實',
      desc: '相差 7 數。一方探求靈魂、意義與精神層面，另一方聚焦柴米油鹽與具體產出。精神層次容易產生代溝，但結合起來無比完整。',
      rx: '將崇高的靈性理念翻譯成一杯熱茶與踏實的擁抱；生活微細節就是最好的靈修殿堂。'
    },
    8: {
      title: '極致張力 · 乾坤互曜',
      desc: '相差 8 數（如 1 數與 9 數）。極致的起點與終點相遇，擁有強大的磁場張力。目標一致時能成就非凡合作，缺乏共識時容易兩極對立。',
      rx: '清楚劃分主客場勢力範圍；在對方的專業主場完全尊重，在自己的領域全力承擔信任。'
    }
  };

  function calculateMidpoint(birthA, timeA, birthB, timeB) {
    const [yA, mA, dA] = birthA.split('-').map(Number);
    const [hA, minA] = (timeA || '12:00').split(':').map(Number);
    const dateA = new Date(Date.UTC(yA, mA - 1, dA, hA, minA));

    const [yB, mB, dB] = birthB.split('-').map(Number);
    const [hB, minB] = (timeB || '12:00').split(':').map(Number);
    const dateB = new Date(Date.UTC(yB, mB - 1, dB, hB, minB));

    const midMs = Math.round((dateA.getTime() + dateB.getTime()) / 2);
    const midDate = new Date(midMs);
    const midY = midDate.getUTCFullYear();
    const midM = midDate.getUTCMonth() + 1;
    const midD = midDate.getUTCDate();
    const midH = midDate.getUTCHours();
    const midMin = midDate.getUTCMinutes();

    return {
      dateStr: `${midY}-${pad(midM)}-${pad(midD)}`,
      timeStr: `${pad(midH)}:${pad(midMin)}`,
      parts: { year: midY, month: midM, day: midD },
      dateObj: new Date(midY, midM - 1, midD, midH, midMin)
    };
  }

  function renderSynastryComplementary(root, plateA, plateB, combinedCounts, nameA, nameB) {
    const matrixWrap = root.querySelector('[data-synastry-matrix-wrap]');
    if (!matrixWrap) return;

    // 計算 8 條線的互補狀態
    const compResults = lines.map((line) => {
      const stateA = lineState(plateA.counts, line.digits);
      const stateB = lineState(plateB.counts, line.digits);
      const stateComb = lineState(combinedCounts, line.digits);

      const isAActive = (stateA === '顯性');
      const isBActive = (stateB === '顯性');
      const isCombActive = (stateComb === '顯性');

      let statusType = 'normal';
      let tagText = '未成線';
      let tagClass = 'is-missing';

      if (!isAActive && !isBActive && isCombActive) {
        statusType = 'activated';
        tagText = '✦ 互補接通黃金連線';
        tagClass = 'is-gold';
      } else if (isAActive && isBActive) {
        statusType = 'shared';
        tagText = '雙方共享連線';
        tagClass = 'is-shared';
      } else if (isAActive) {
        tagText = `${nameA} 既有帶入`;
        tagClass = 'is-shared';
      } else if (isBActive) {
        tagText = `${nameB} 既有帶入`;
        tagClass = 'is-shared';
      } else {
        tagText = '雙方隱性盲點';
        tagClass = 'is-missing';
      }

      return { line, stateA, stateB, stateComb, statusType, tagText, tagClass };
    });

    const activatedCount = compResults.filter(r => r.statusType === 'activated').length;

    matrixWrap.innerHTML = `
      <div class="sun-chart__matrix-section">
        <div class="sun-chart__matrix-header">
          <p class="sun-chart__panel-kicker">SYNASTRY NINE-GRID MATRIX · 九宮格連線互補矩陣</p>
          <h3>雙人九宮格數位交織 ＆ 合體共鳴矩陣</h3>
          <p>將雙方出生年月日與主命數數字彙整，檢驗個人既有天賦，以及<strong>兩人相遇後合力接通的全新黃金連線（互補成就）</strong>。</p>
        </div>

        <div class="sun-chart__three-grids">
          <!-- 甲方九宮格 -->
          <div class="sun-chart__grid-card">
            <div class="sun-chart__grid-card-title">${escapeHtml(nameA)}</div>
            <div class="sun-chart__grid-card-sub">個人太陽九宮格</div>
            <div class="sun-chart__nine-grid">${gridMarkup(plateA.counts)}</div>
          </div>

          <!-- 乙方九宮格 -->
          <div class="sun-chart__grid-card">
            <div class="sun-chart__grid-card-title">${escapeHtml(nameB)}</div>
            <div class="sun-chart__grid-card-sub">個人太陽九宮格</div>
            <div class="sun-chart__nine-grid">${gridMarkup(plateB.counts)}</div>
          </div>

          <!-- 合體共鳴九宮格 -->
          <div class="sun-chart__grid-card is-combined">
            <div class="sun-chart__grid-card-title">✨ ${escapeHtml(nameA)} ＋ ${escapeHtml(nameB)}</div>
            <div class="sun-chart__grid-card-sub font-bold text-[#be5b3f]">合體共鳴九宮格（新增 ${activatedCount} 條互補連線）</div>
            <div class="sun-chart__nine-grid">${gridMarkup(combinedCounts)}</div>
          </div>
        </div>

        <!-- 連線互補狀態清單 -->
        <div class="sun-chart__complementary-list">
          ${compResults.map(item => `
            <div class="sun-chart__comp-item ${item.statusType === 'activated' ? 'is-activated' : ''}">
              <div>
                <b class="text-[#be5b3f] mr-2">${item.line.digits.join('')}</b>
                <span class="font-bold text-slate-800 mr-2">${item.line.label}</span>
                <span class="text-xs text-slate-500 hidden sm:inline">(${nameA}: ${item.stateA} | ${nameB}: ${item.stateB})</span>
              </div>
              <span class="sun-chart__comp-badge ${item.tagClass}">${item.tagText}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    matrixWrap.hidden = false;
  }

  function renderSynastryGap(root, solarA, solarB, nameA, nameB) {
    const gapWrap = root.querySelector('[data-synastry-gap-wrap]');
    if (!gapWrap) return;

    const gap = Math.abs(solarA.final - solarB.final);
    const gapData = COMMUNICATION_GAPS[gap] || COMMUNICATION_GAPS[0];

    gapWrap.innerHTML = `
      <div class="sun-chart__gap-section">
        <div class="sun-chart__gap-card">
          <p class="sun-chart__panel-kicker">COMMUNICATION GAP NUMBER · 溝通落差數</p>
          <h3>|${escapeHtml(nameA)} ${solarA.final} 數 － ${escapeHtml(nameB)} ${solarB.final} 數| ＝ 落差 ${gap} 數</h3>
          <div class="sun-chart__gap-kpi">
            <div class="sun-chart__gap-number">${gap}</div>
            <div class="sun-chart__gap-formula">
              <div>溝通落差格局：<strong>${gapData.title}</strong></div>
              <small class="text-slate-500">主修數相減絕對值，揭示日常溝通盲區</small>
            </div>
          </div>
          <p class="sun-chart__gap-desc">${gapData.desc}</p>
        </div>

        <div class="sun-chart__gap-card">
          <p class="sun-chart__panel-kicker">ALAN'S MAGIC PRESCRIPTION · 愛倫院長生活魔藥處方</p>
          <h3 class="text-lg text-[#be5b3f]">融化心防的通關密語與相處微儀式</h3>
          <div class="sun-chart__magic-prescription">
            <p class="mb-2"><strong>🌿 相處避雷微調：</strong></p>
            <p class="mb-3">${gapData.rx}</p>
            <p class="text-xs text-slate-500 border-t border-slate-200/60 pt-2 mt-2">
              <strong>🪄 院長心法：</strong>關係的真正魅力在於「差異的調和」。每一次溝通落差，都是兩顆靈魂互相照亮盲區、拓展全新智慧視野的神聖修煉場。
            </p>
          </div>
        </div>
      </div>
    `;
    gapWrap.hidden = false;
  }

  function renderChart(root, values) {
    const isSynastry = (values.chartMode === 'synastry');
    const referenceDate = localDate(isSynastry ? (values.referenceDateDual || values.referenceDate) : values.referenceDate);

    let birthDate, birth, birthTimeStr, lunar, lifeNumber, name, lunarTag;
    let solar, moon, flowYear;

    const bannerWrap = root.querySelector('[data-synastry-banner-wrap]');
    const gapWrap = root.querySelector('[data-synastry-gap-wrap]');
    const matrixWrap = root.querySelector('[data-synastry-matrix-wrap]');
    const sunTitle = root.querySelector('[data-plate-sun-title]');
    const moonTitle = root.querySelector('[data-plate-moon-title]');

    if (isSynastry) {
      // 雙人關係合盤：以中點日期時間重新生成完整盤式
      const nameA = values.nameA?.trim() || '甲方';
      const nameB = values.nameB?.trim() || '乙方';
      const birthDateA = values.birthDateA || '1988-08-18';
      const birthTimeA = values.birthTimeA || '12:00';
      const birthDateB = values.birthDateB || '1990-01-27';
      const birthTimeB = values.birthTimeB || '11:36';

      // 1. 計算甲方與乙方個人盤以供互補矩陣與落差數分析
      const dateObjA = localDate(birthDateA);
      const dateObjB = localDate(birthDateB);
      const plateA = buildPlate(parts(dateObjA));
      const plateB = buildPlate(parts(dateObjB));

      // 2. 精確計算時間中點 (Midpoint Date & Time)
      const midpoint = calculateMidpoint(birthDateA, birthTimeA, birthDateB, birthTimeB);
      birthDate = midpoint.dateObj;
      birth = midpoint.parts;
      birthTimeStr = midpoint.timeStr;
      lunar = lunarFromDate(birthDate);
      if (!lunar) lunar = { year: birth.year, month: birth.month, day: birth.day, isLeap: false };

      solar = buildPlate(birth);
      moon = buildPlate(lunar);
      lifeNumber = solar.final || 9;
      flowYear = flowTrace('year', birth, referenceDate).final;
      name = `${nameA} & ${nameB}`;
      lunarTag = lunar.isLeap ? '（閏月）' : '';

      // 合體共鳴九宮格數字彙整
      const combinedCounts = {};
      for (let d = 0; d <= 9; d++) {
        combinedCounts[d] = plateA.counts[d] + plateB.counts[d];
      }

      // 呈現中點橫幅
      if (bannerWrap) {
        bannerWrap.innerHTML = `
          <div class="sun-chart__synastry-banner">
            <div class="sun-chart__synastry-banner-top">
              <h3><span>💞 雙方關係能量中點排盤</span></h3>
              <span class="sun-chart__mid-badge">關係共同主命數：${lifeNumber} 數</span>
            </div>
            <p class="sun-chart__synastry-banner-desc">
              非單純數字相加，而是以雙方精確生辰時間戳記淬煉出之<strong>「時間中點日期時間（Relationship Midpoint）」</strong>重新排定。此盤象徵這段關係作為一個獨立能量生命體走向世間時，共同展現的外顯氣質、默契感受與流年週期。
            </p>
            <div class="sun-chart__midpoint-details">
              <div><span>關係西元中點：</span>${birth.year} 年 ${pad(birth.month)} 月 ${pad(birth.day)} 日 ${birthTimeStr} (24H 制)</div>
              <div><span>中點農曆對照：</span>${lunar.year} 年 ${pad(lunar.month)} 月 ${pad(lunar.day)} 日 ${lunarTag}</div>
              <div><span>推算流年：</span>${referenceDate.getFullYear()} 年（流年 ${flowYear} 數）</div>
            </div>
          </div>
        `;
        bannerWrap.hidden = false;
      }

      // 呈現溝通落差數
      renderSynastryGap(root, plateA, plateB, nameA, nameB);

      // 呈現九宮格連線互補矩陣
      renderSynastryComplementary(root, plateA, plateB, combinedCounts, nameA, nameB);

      // 修改盤式標題
      if (sunTitle) sunTitle.textContent = '關係外顯盤 (中點太陽盤)';
      if (moonTitle) moonTitle.textContent = '關係默契盤 (中點月亮盤)';
      root.querySelector('[data-chart-title]').textContent = `${name}・雙人關係中點完整排盤`;

    } else {
      // 個人雙盤模式
      birthDate = localDate(values.birthDate);
      birth = parts(birthDate);
      birthTimeStr = values.birthTime || '12:00';
      lunar = values.manualLunar ? { year: Number(values.lunarYear), month: Number(values.lunarMonth), day: Number(values.lunarDay), isLeap: false } : lunarFromDate(birthDate);
      if (!lunar || !lunar.year || lunar.month < 1 || lunar.month > 12 || lunar.day < 1 || lunar.day > 30) throw new Error('無法取得農曆生日。請勾選「手動覆寫農曆生日」後輸入年月日。');

      solar = buildPlate(birth);
      moon = buildPlate(lunar);
      lifeNumber = solar.final || 9;
      flowYear = flowTrace('year', birth, referenceDate).final;
      name = values.name.trim() || '個案';
      lunarTag = lunar.isLeap ? '（閏月）' : '';

      if (bannerWrap) bannerWrap.hidden = true;
      if (gapWrap) gapWrap.hidden = true;
      if (matrixWrap) matrixWrap.hidden = true;
      if (sunTitle) sunTitle.textContent = '太陽盤';
      if (moonTitle) moonTitle.textContent = '月亮盤';
      root.querySelector('[data-chart-title]').textContent = `${name}・完整排盤`;
    }

    root.querySelector('[data-date-ribbon]').innerHTML = `<div><span>${isSynastry ? '關係中點公曆' : '國曆生日'}</span><b>${birth.year} / ${pad(birth.month)} / ${pad(birth.day)} ${birthTimeStr}</b></div><i>⊹</i><div><span>${isSynastry ? '關係中點農曆' : '農曆生日'}</span><b>${lunar.year} / ${pad(lunar.month)} / ${pad(lunar.day)} ${lunarTag}</b></div><i>⊹</i><div><span>流運日期</span><b>${referenceDate.getFullYear()} / ${pad(referenceDate.getMonth() + 1)} / ${pad(referenceDate.getDate())}</b></div>`;
    showPlate(root, 'solar', solar);
    showPlate(root, 'lunar', moon);
    renderEnergy(root, solar, moon);
    renderConnections(root, solar, moon);
    renderGifts(root, solar, moon);
    renderFlows(root, birth, referenceDate);
    root.querySelector('[data-life-number]').textContent = lifeNumber;
    renderCycleLists(root, birth, birthTimeStr, referenceDate, lifeNumber);
    renderTriangle(root, lifeNumber, flowYear);
    renderNineStars(root, lifeNumber, flowYear);
    root.querySelector('[data-chart-result]').hidden = false;
    root.querySelector('[data-chart-empty]').hidden = true;
  }

  function initialize(root) {
    const form = root.querySelector('[data-chart-form]');
    const error = root.querySelector('[data-chart-error]');
    const manual = form.elements.manualLunar;
    const manualFields = root.querySelector('.sun-chart__lunar-fields');
    const lunarAuto = root.querySelector('[data-lunar-auto]');
    const lunarAutoA = root.querySelector('[data-lunar-auto-a]');
    const lunarAutoB = root.querySelector('[data-lunar-auto-b]');

    const modeBtns = root.querySelectorAll('[data-mode-btn]');
    const singleFields = root.querySelector('[data-single-fields]');
    const dualFields = root.querySelector('[data-dual-fields]');
    const submitBtn = root.querySelector('[data-submit-btn]');
    const sampleDualBtn = root.querySelector('[data-sample-dual]');

    // 預設日期與時間 (24小時制)
    const todayStr = toInputDate(new Date());
    form.elements.referenceDate.value = todayStr;
    if (form.elements.referenceDateDual) form.elements.referenceDateDual.value = todayStr;
    form.elements.birthDate.value = '1990-01-01';
    form.elements.birthTime.value = '12:00';

    // 模式切換邏輯
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const mode = btn.dataset.modeBtn;
        form.elements.chartMode.value = mode;

        if (mode === 'synastry') {
          singleFields.classList.add('hidden');
          dualFields.classList.remove('hidden');
          populateQuickProfiles();
          submitBtn.textContent = '展開雙人關係中點合盤';
        } else {
          singleFields.classList.remove('hidden');
          dualFields.classList.add('hidden');
          submitBtn.textContent = '展開命盤';
        }
      });
    });

    // 示範合盤載入
    if (sampleDualBtn) {
      sampleDualBtn.addEventListener('click', () => {
        form.elements.nameA.value = '愛倫院長';
        form.elements.birthDateA.value = '1988-08-18';
        form.elements.birthTimeA.value = '12:00';

        form.elements.nameB.value = '靈魂伴侶';
        form.elements.birthDateB.value = '1990-01-27';
        form.elements.birthTimeB.value = '11:36';

        showAutoLunarA();
        showAutoLunarB();
      });
    }

    const showAutoLunar = () => {
      const value = form.elements.birthDate.value;
      if (!value) { lunarAuto.hidden = true; return; }
      const lunar = lunarFromDate(localDate(value));
      if (!lunar || !lunar.month) { lunarAuto.hidden = true; return; }
      lunarAuto.textContent = `對應農曆生日：${lunar.year} 年 ${lunar.month} 月 ${lunar.day} 日${lunar.isLeap ? '（閏月）' : ''}`;
      form.elements.lunarYear.value = lunar.year;
      form.elements.lunarMonth.value = lunar.month;
      form.elements.lunarDay.value = lunar.day;
      lunarAuto.hidden = false;
    };

    const showAutoLunarA = () => {
      if (!lunarAutoA || !form.elements.birthDateA) return;
      const val = form.elements.birthDateA.value;
      if (!val) { lunarAutoA.hidden = true; return; }
      const l = lunarFromDate(localDate(val));
      if (l && l.month) {
        lunarAutoA.textContent = `農曆：${l.year}年${l.month}月${l.day}日${l.isLeap ? '(閏)' : ''}`;
        lunarAutoA.hidden = false;
      }
    };

    const showAutoLunarB = () => {
      if (!lunarAutoB || !form.elements.birthDateB) return;
      const val = form.elements.birthDateB.value;
      if (!val) { lunarAutoB.hidden = true; return; }
      const l = lunarFromDate(localDate(val));
      if (l && l.month) {
        lunarAutoB.textContent = `農曆：${l.year}年${l.month}月${l.day}日${l.isLeap ? '(閏)' : ''}`;
        lunarAutoB.hidden = false;
      }
    };

    form.elements.birthDate.addEventListener('change', showAutoLunar);
    form.elements.birthDate.addEventListener('input', showAutoLunar);
    showAutoLunar();

    if (form.elements.birthDateA) {
      form.elements.birthDateA.addEventListener('change', showAutoLunarA);
      form.elements.birthDateA.addEventListener('input', showAutoLunarA);
      showAutoLunarA();
    }
    if (form.elements.birthDateB) {
      form.elements.birthDateB.addEventListener('change', showAutoLunarB);
      form.elements.birthDateB.addEventListener('input', showAutoLunarB);
      showAutoLunarB();
    }

    manual.addEventListener('change', () => { manualFields.hidden = !manual.checked; });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      error.textContent = '';
      const mode = form.elements.chartMode.value;

      if (mode === 'synastry') {
        if (!form.elements.birthDateA.value || !form.elements.birthDateB.value) {
          error.textContent = '請先填寫甲方與乙方的國曆生日。';
          return;
        }
      } else {
        if (!form.elements.birthDate.value || !form.elements.referenceDate.value) {
          error.textContent = '請先填寫國曆生日與流運日期。';
          return;
        }
      }

      try {
        renderChart(root, Object.fromEntries(new FormData(form).entries()));
      } catch (exception) {
        error.textContent = exception.message || '排盤時發生錯誤，請檢查輸入資料。';
      }
    });

    // 填充合盤甲方與乙方專屬快速載入下拉選單
    const populateQuickProfiles = () => {
      if (!window.MeetJoyProfiles) return;
      const getList = window.MeetJoyProfiles.getAll ? window.MeetJoyProfiles.getAll() : (window.MeetJoyProfiles.getProfiles ? window.MeetJoyProfiles.getProfiles() : []);
      const profiles = Array.isArray(getList) ? getList : [];
      const selA = root.querySelector('[data-quick-profile-a]');
      const selB = root.querySelector('[data-quick-profile-b]');

      const renderOptions = (label) => {
        if (!profiles || profiles.length === 0) {
          return `<option value="">-- 目前無已存命盤 (相容紫微斗數) --</option>`;
        }
        return `<option value="">-- 📁 選擇已存命盤帶入${label} (${profiles.length} 位) --</option>` +
          profiles.map(p => {
            const catTag = p.category ? `[${p.category}] ` : '';
            return `<option value="${p.id}">${catTag}${p.name} · ${p.birthDate} ${p.birthTime || '12:00'}</option>`;
          }).join('');
      };

      if (selA) {
        const curValA = selA.value;
        selA.innerHTML = renderOptions('甲方');
        if (curValA && profiles.some(p => p.id === curValA)) selA.value = curValA;
        selA.onchange = () => {
          const pid = selA.value;
          if (!pid) return;
          const target = profiles.find(p => p.id === pid);
          if (target) {
            form.elements.nameA.value = target.name || '甲方';
            form.elements.birthDateA.value = target.birthDate;
            form.elements.birthTimeA.value = target.birthTime || '12:00';
            showAutoLunarA();
            if (window.MeetJoyProfiles.showToast) {
              window.MeetJoyProfiles.showToast(`✨ 已成功載入「${target.name}」至合盤甲方！`);
            }
            try {
              renderChart(root, Object.fromEntries(new FormData(form).entries()));
            } catch (e) {
              console.warn(e);
            }
          }
        };
      }

      if (selB) {
        const curValB = selB.value;
        selB.innerHTML = renderOptions('乙方');
        if (curValB && profiles.some(p => p.id === curValB)) selB.value = curValB;
        selB.onchange = () => {
          const pid = selB.value;
          if (!pid) return;
          const target = profiles.find(p => p.id === pid);
          if (target) {
            form.elements.nameB.value = target.name || '乙方';
            form.elements.birthDateB.value = target.birthDate;
            form.elements.birthTimeB.value = target.birthTime || '12:00';
            showAutoLunarB();
            if (window.MeetJoyProfiles.showToast) {
              window.MeetJoyProfiles.showToast(`✨ 已成功載入「${target.name}」至合盤乙方！`);
            }
            try {
              renderChart(root, Object.fromEntries(new FormData(form).entries()));
            } catch (e) {
              console.warn(e);
            }
          }
        };
      }
    };

    // 掛載全站通用命盤檔案庫 (MeetJoyProfiles)
    if (window.MeetJoyProfiles) {
      MeetJoyProfiles.mount('#universal_profile_bar', {
        getCurrentData: () => {
          const mode = form.elements.chartMode.value;
          if (mode === 'synastry') {
            const nameA = form.elements.nameA.value || '甲方';
            const nameB = form.elements.nameB.value || '乙方';
            const bA = form.elements.birthDateA.value;
            const tA = form.elements.birthTimeA.value || '12:00';
            const bB = form.elements.birthDateB.value;
            const tB = form.elements.birthTimeB.value || '12:00';
            const mid = calculateMidpoint(bA, tA, bB, tB);
            return {
              name: `${nameA} & ${nameB} (中點合盤)`,
              birthDate: mid.birthDate,
              birthTime: mid.birthTime,
              category: '合盤'
            };
          }
          return {
            name: form.elements.name.value || '數字盤',
            birthDate: form.elements.birthDate.value,
            birthTime: form.elements.birthTime.value || '12:00',
            category: '自己'
          };
        },
        onSelect: (p) => {
          const mode = form.elements.chartMode.value;
          if (mode === 'synastry') {
            if (p.name) form.elements.nameA.value = p.name;
            if (p.birthDate) form.elements.birthDateA.value = p.birthDate;
            if (p.birthTime) form.elements.birthTimeA.value = p.birthTime;
            showAutoLunarA();
          } else {
            if (p.name) form.elements.name.value = p.name;
            if (p.birthDate) form.elements.birthDate.value = p.birthDate;
            if (p.birthTime) form.elements.birthTime.value = p.birthTime;
            showAutoLunar();
          }
          // 選取後立即自動重新起盤展示
          try {
            renderChart(root, Object.fromEntries(new FormData(form).entries()));
          } catch (e) {
            console.warn(e);
          }
        }
      });

      // 初始化合盤甲方與乙方選單並監聽命盤庫變更
      populateQuickProfiles();
      window.addEventListener('mj-profiles-changed', populateQuickProfiles);
      window.addEventListener('mj-auth-changed', populateQuickProfiles);
    }

    root.querySelector('[data-print-chart]').addEventListener('click', () => {
      if (window.MeetJoyPDF && typeof window.MeetJoyPDF.exportPDF === 'function') {
        const title = root.querySelector('[data-chart-title]')?.textContent || '數字能量排盤報告';
        window.MeetJoyPDF.exportPDF({ title });
      } else {
        window.print();
      }
    });

    root.querySelector('[data-copy-summary]').addEventListener('click', async (event) => {
      const title = root.querySelector('[data-chart-title]').textContent;
      const date = root.querySelector('[data-date-ribbon]').innerText.replace(/\n/g, '；');
      const flows = [...root.querySelectorAll('.sun-chart__flow')].map((flow) => flow.innerText.replace(/\n/g, '：')).join('\n');
      const text = `${title}\n${date}\n${flows}`;
      try {
        await navigator.clipboard.writeText(text);
        event.currentTarget.textContent = '已複製';
        window.setTimeout(() => { event.currentTarget.textContent = '複製摘要'; }, 1500);
      } catch (exception) {
        error.textContent = '瀏覽器未允許複製，請改用列印／另存 PDF。';
      }
    });

    // 頁面預設自動排盤渲染一次，確保初次進入不留白
    try {
      renderChart(root, Object.fromEntries(new FormData(form).entries()));
    } catch (e) {
      console.warn('[Numerology] Auto-init render failed:', e);
    }
  }

  const startNumerologyApp = () => document.querySelectorAll('[data-sun-chart]').forEach(initialize);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startNumerologyApp);
  } else {
    startNumerologyApp();
  }
})();


