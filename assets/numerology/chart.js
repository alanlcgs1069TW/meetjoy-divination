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

  function renderTriangle(root, lifeNumber, flowYear) {
    const sequence = Array.from({ length: 9 }, (_, index) => ((lifeNumber - 1 + index) % 9) + 1);
    const points = trianglePoints();
    root.querySelector('[data-time-triangle]').innerHTML = `<svg viewBox="-20 0 250 182" role="img" aria-label="主命數 ${lifeNumber} 的九年循環三角盤"><path d="M36 160V12L188 160Z"/><path d="M36 160H188"/><text x="18" y="165" style="text-anchor:end">命盤柱</text>${points.map((point, index) => `<g class="${sequence[index] === flowYear ? 'is-current' : ''}${[0, 3, 6].includes(index) ? ' is-vertex' : ''}"><circle cx="${point[0]}" cy="${point[1]}" r="${[0, 3, 6].includes(index) ? 15 : 13}"/><text x="${point[0]}" y="${point[1] + 5}">${sequence[index]}</text></g>`).join('')}</svg><p>數字由太陽盤主命數在左下直角起算、順時針鋪滿三角形；三頂點為同組數（147／258／369）。</p>`;
  }

  function renderChart(root, values) {
    const birthDate = localDate(values.birthDate);
    const referenceDate = localDate(values.referenceDate);
    const birth = parts(birthDate);
    const lunar = values.manualLunar ? { year: Number(values.lunarYear), month: Number(values.lunarMonth), day: Number(values.lunarDay), isLeap: false } : lunarFromDate(birthDate);
    if (!lunar || !lunar.year || lunar.month < 1 || lunar.month > 12 || lunar.day < 1 || lunar.day > 30) throw new Error('無法取得農曆生日。請勾選「手動覆寫農曆生日」後輸入年月日。');

    const solar = buildPlate(birth);
    const moon = buildPlate(lunar);
    const lifeNumber = solar.final || 9;
    const flowYear = flowTrace('year', birth, referenceDate).final;
    const name = values.name.trim() || '個案';
    const lunarTag = lunar.isLeap ? '（閏月）' : '';

    root.querySelector('[data-chart-title]').textContent = `${name}・完整排盤`;
    root.querySelector('[data-date-ribbon]').innerHTML = `<div><span>國曆生日</span><b>${birth.year} / ${pad(birth.month)} / ${pad(birth.day)}</b></div><i>⊹</i><div><span>農曆生日</span><b>${lunar.year} / ${pad(lunar.month)} / ${pad(lunar.day)} ${lunarTag}</b></div><i>⊹</i><div><span>流運日期</span><b>${referenceDate.getFullYear()} / ${pad(referenceDate.getMonth() + 1)} / ${pad(referenceDate.getDate())}</b></div>`;
    showPlate(root, 'solar', solar);
    showPlate(root, 'lunar', moon);
    renderEnergy(root, solar, moon);
    renderConnections(root, solar, moon);
    renderGifts(root, solar, moon);
    renderFlows(root, birth, referenceDate);
    root.querySelector('[data-life-number]').textContent = lifeNumber;
    renderCycleLists(root, birth, values.birthTime, referenceDate, lifeNumber);
    renderTriangle(root, lifeNumber, flowYear);
    root.querySelector('[data-chart-result]').hidden = false;
    root.querySelector('[data-chart-empty]').hidden = true;
  }

  function initialize(root) {
    const form = root.querySelector('[data-chart-form]');
    const error = root.querySelector('[data-chart-error]');
    const manual = form.elements.manualLunar;
    const manualFields = root.querySelector('.sun-chart__lunar-fields');
    const lunarAuto = root.querySelector('[data-lunar-auto]');
    form.elements.referenceDate.value = toInputDate(new Date());
    form.elements.birthDate.value = '1990-01-01';
    form.elements.birthTime.value = '12:00';

    const showAutoLunar = () => {
      const value = form.elements.birthDate.value;
      if (!value) {
        lunarAuto.hidden = true;
        return;
      }
      const lunar = lunarFromDate(localDate(value));
      if (!lunar || !lunar.month) {
        lunarAuto.hidden = true;
        return;
      }
      lunarAuto.textContent = `對應農曆生日：${lunar.year} 年 ${lunar.month} 月 ${lunar.day} 日${lunar.isLeap ? '（閏月）' : ''}`;
      form.elements.lunarYear.value = lunar.year;
      form.elements.lunarMonth.value = lunar.month;
      form.elements.lunarDay.value = lunar.day;
      lunarAuto.hidden = false;
    };

    form.elements.birthDate.addEventListener('change', showAutoLunar);
    form.elements.birthDate.addEventListener('input', showAutoLunar);
    showAutoLunar();
    manual.addEventListener('change', () => { manualFields.hidden = !manual.checked; });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      error.textContent = '';
      if (!form.elements.birthDate.value || !form.elements.referenceDate.value) {
        error.textContent = '請先填寫國曆生日與流運日期。';
        return;
      }
      try {
        renderChart(root, Object.fromEntries(new FormData(form).entries()));
      } catch (exception) {
        error.textContent = exception.message || '排盤時發生錯誤，請檢查輸入資料。';
      }
    });
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
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-sun-chart]').forEach(initialize));
})();

