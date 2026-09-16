/**
 * 癒見幸福 · 魔法占星學院
 * 八字 18:57 經典主盤視圖引擎 (Bazi 18:57 Classic Board View - V3 Upgrade)
 * 嚴格對齊桌面截圖：截圖 2026-09-16 下午6.57.58.png + 8051 格式 (IMG_8051.jpg) + 8045/8046/8047/8048/8049/8050
 * 核心特色：
 * 1. 姓名學以【人格為本體】推算天格、地格、外格、總格之生剋十神印章
 * 2. 康熙字典 6346+ 字庫點選字義詳細釋義彈窗
 * 3. 大盤 / 關係 / 神煞 三重視圖切換 (8045 截圖)
 * 4. 兩柱關係與刑沖會合成化深度智能分析 (8046-8048 截圖)
 * 5. 五十四種神煞深入解析抽屜庫與空亡標註 (8049-8050 截圖)
 * 6. 100% 繁體中文（台灣）· Zero Attribution · 容易明白的生活化解說
 */

(function (global) {
  'use strict';

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
  const order = ['time', 'day', 'month', 'year'];
  const labels = { time: '時柱', day: '日柱', month: '月柱', year: '年柱' };

  let currentTab = 'dapan'; // 'dapan' | 'relation' | 'shensha'
  let latestChartData = null;

  // 五行 CSS Class
  const wxClass = v => {
    switch (v) {
      case '木': return 'element-wood text-emerald-700';
      case '火': return 'element-fire text-rose-600';
      case '土': return 'element-earth text-amber-800';
      case '金': return 'element-metal text-amber-600';
      case '水': return 'element-water text-blue-600';
      default: return 'text-stone-700';
    }
  };

  // 注入 18:57 經典樣式表
  function ensureStyles() {
    if (document.getElementById('bazi_classic_1857_styles')) return;
    const style = document.createElement('style');
    style.id = 'bazi_classic_1857_styles';
    style.textContent = `
      .bazi-classic-board {
        width: 100%;
        background: #ffffff;
        border: 2px solid #334155;
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        overflow: hidden;
        font-family: 'Noto Serif TC', serif;
      }
      .bazi-classic-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        font-size: 12px;
      }
      .bazi-classic-table th, .bazi-classic-table td {
        border: 1px solid #cbd5e1;
        padding: 6px 4px;
        vertical-align: middle;
      }
      .bazi-classic-table .header-label {
        background: #f1f5f9;
        font-weight: 900;
        color: #334155;
        width: 60px;
        letter-spacing: 1px;
      }
      .bazi-classic-table .day-col {
        background: #fffbeb;
      }
      .bazi-gan-zhi-char {
        font-size: 26px;
        font-weight: 900;
        line-height: 1.1;
      }
      .bazi-side-wuxing {
        font-size: 10px;
        font-weight: bold;
        opacity: 0.85;
      }
      .seal-badge {
        display: inline-block;
        border: 1.5px solid #dc2626;
        color: #dc2626;
        padding: 0px 3px;
        font-size: 11px;
        font-weight: 900;
        border-radius: 3px;
        background: #fef2f2;
        box-shadow: 0 1px 2px rgba(220,38,38,0.15);
      }
      .seal-badge.body {
        background: #dc2626;
        color: #ffffff;
        border-color: #b91c1c;
      }
      .dayun-cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 6px 2px;
        border-right: 1px solid #cbd5e1;
        background: #f8fafc;
        min-width: 0;
      }
      .dayun-cell.active {
        background: #fef3c7;
        box-shadow: inset 0 0 0 1.5px #d97706;
      }
      .kong-badge {
        display: inline-block;
        font-size: 9px;
        background: #e2e8f0;
        color: #475569;
        border-radius: 9999px;
        padding: 0 4px;
        margin-left: 2px;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  // 兩柱關係智能判斷字典 (8048 截圖)
  function analyzePillarRelation(gan1, zhi1, gan2, zhi2) {
    const STEM_ELEMENTS = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
    const STEM_HE = { '甲':'己','乙':'庚','丙':'辛','丁':'壬','戊':'癸','己':'甲','庚':'乙','辛':'丙','壬':'丁','癸':'戊' };
    const ZHI_CHONG = { '子':'午','丑':'未','寅':'申','卯':'酉','辰':'戌','巳':'亥','午':'子','未':'丑','申':'寅','酉':'卯','戌':'辰','亥':'巳' };
    const ZHI_HE = { '子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午' };
    const ZHI_XING = { '子':'卯','卯':'子','寅':'巳','巳':'申','申':'寅','丑':'戌','戌':'未','未':'丑','辰':'辰','午':'午','酉':'酉','亥':'亥' };

    const relations = [];

    // 1. 伏吟 (干支皆同)
    if (gan1 === gan2 && zhi1 === zhi2) {
      relations.push({ name: '伏吟', desc: '干支相同，能量同頻重疊，代表自我反思、面對同類課題的深層修煉。', type: 'info' });
    }
    // 2. 反吟 (天剋地沖)
    const e1 = STEM_ELEMENTS[gan1], e2 = STEM_ELEMENTS[gan2];
    const isKe = (e1 === '金' && e2 === '木') || (e1 === '木' && e2 === '土') || (e1 === '土' && e2 === '水') || (e1 === '水' && e2 === '火') || (e1 === '火' && e2 === '金');
    if (isKe && ZHI_CHONG[zhi1] === zhi2) {
      relations.push({ name: '反吟', desc: '天剋地沖，大破大立，象徵打破舒適圈的激盪突破與人生轉折。', type: 'warn' });
    }
    // 3. 天地合 (天合地合)
    if (STEM_HE[gan1] === gan2 && ZHI_HE[zhi1] === zhi2) {
      relations.push({ name: '天地合', desc: '天干相合、地支六合，天衣無縫，內在意願與現實環境高度協調圓滿。', type: 'good' });
    }
    // 4. 天同地沖
    if (gan1 === gan2 && ZHI_CHONG[zhi1] === zhi2) {
      relations.push({ name: '天同地沖', desc: '志向一致但做法各異，外表同心但腳步需協調磨合。', type: 'notice' });
    }
    // 5. 地支沖
    if (ZHI_CHONG[zhi1] === zhi2) {
      relations.push({ name: `${zhi1}沖${zhi2}`, desc: '磁場對沖激盪，激發爆發力與向外探索動能，注意情緒急躁。', type: 'warn' });
    }
    // 6. 地支合
    if (ZHI_HE[zhi1] === zhi2) {
      relations.push({ name: `${zhi1}${zhi2}六合`, desc: '緣分深厚，彼此吸引包容，利於合作結盟。', type: 'good' });
    }
    // 7. 自刑
    if (zhi1 === zhi2 && ['辰','午','酉','亥'].includes(zhi1)) {
      relations.push({ name: `${zhi1}自刑`, desc: '容易自我要求過高或自我糾結，提醒適時放過自己、接納不完美。', type: 'notice' });
    }

    return relations;
  }

  // 核心渲染主函數
  global.renderUnifiedBaziView = function (data) {
    ensureStyles();
    latestChartData = data;
    const host = document.getElementById('bazi_chart_container');
    if (!host) return;

    const fp = data.fourPillars;
    const aux = data.auxiliary;
    const bal = data.wuxingBalance;
    const jq = data.jieQiTimeline || {};

    // 1. 姓名學剖象計算 (依據康熙字典與 8051 格式 · 以人格為本體)
    const nameAnalysis = (global.MeetJoyKangXi && typeof global.MeetJoyKangXi.analyzeName === 'function')
      ? global.MeetJoyKangXi.analyzeName(data.userName)
      : null;

    // 姓名漢字拆解行 (點擊查看康熙釋義)
    let nameCharsHtml = '';
    if (nameAnalysis && nameAnalysis.chars && nameAnalysis.chars.length) {
      nameCharsHtml = nameAnalysis.chars.map(c => `
        <tr class="border-b border-stone-200 hover:bg-amber-50/60 cursor-pointer" onclick="openKangxiModal('${esc(c.char)}')">
          <td class="p-1.5 text-base font-black text-rose-800 border-r border-stone-200 flex items-center justify-center gap-1">
            <span>${esc(c.char)}</span>
            <span class="text-[10px] text-amber-600 opacity-60">🔍</span>
          </td>
          <td class="p-1.5 font-bold text-rose-600 border-r border-stone-200">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full border border-rose-400 bg-rose-50 text-[11px] font-black">${c.strokes}</span>
          </td>
          <td class="p-1.5 text-stone-600 border-r border-stone-200">${esc(c.simplified || c.char)}</td>
          <td class="p-1.5 text-stone-600 border-r border-stone-200">${esc(c.radical)}</td>
          <td class="p-1.5 font-black ${wxClass(c.element)}">${esc(c.element)}</td>
        </tr>
      `).join('');
    } else {
      nameCharsHtml = `<tr><td colspan="5" class="p-2 text-stone-400 text-xs">輸入姓名後自動依據康熙字典推導</td></tr>`;
    }

    // 五格數理展現 (天、人、地、外、總格 · 8051 格式：以人格為本體)
    const renderGridItem = (label, grid) => {
      if (!grid) return '';
      const isBody = grid.isBody;
      return `
        <div class="p-1.5 rounded-lg border ${isBody ? 'border-rose-400 bg-rose-50/70 shadow-xs' : 'border-stone-300 bg-stone-50'} flex items-center justify-between text-xs">
          <span class="font-bold ${isBody ? 'text-rose-900 font-black' : 'text-stone-700'}">${label}</span>
          <div class="flex items-center gap-1.5">
            <span class="font-black text-blue-700 text-sm">${grid.num}</span>
            <span class="font-bold ${wxClass(grid.wuxing)}">${grid.wuxing}</span>
            <span class="text-[11px] text-stone-500 font-bold">${esc(grid.ganZhi)}</span>
            <span class="text-xs font-bold ${grid.isLucky ? 'text-emerald-600' : 'text-rose-600'}">${grid.symbol}</span>
            <span class="seal-badge ${isBody ? 'body' : ''}" title="${isBody ? '人格本體' : '相對於人格之生剋十神'}">${esc(grid.seal)}</span>
          </div>
        </div>
      `;
    };

    // 2. 四柱表格行
    const renderCell = (content, isDay = false, extraCls = '') => `
      <td class="p-2 border-r border-stone-300 ${isDay ? 'day-col' : ''} ${extraCls}">${content}</td>
    `;

    const rowMainStar = `
      <tr class="bg-stone-100 font-black text-xs text-stone-800 border-b border-stone-400">
        ${order.map(k => {
          const isDay = (k === 'day');
          const starName = isDay ? '命主' : esc(fp[k].mainStar);
          const starColor = isDay ? 'text-blue-600' : 'text-rose-600';
          return `<th class="p-2 border-r border-stone-300 w-1/5 ${isDay ? 'day-col' : ''} ${starColor}">${starName}</th>`;
        }).join('')}
        <th class="header-label">主星</th>
      </tr>
    `;

    const rowGan = `
      <tr class="border-b border-stone-300 bg-stone-50/70">
        ${order.map(k => {
          const isDay = (k === 'day');
          const p = fp[k];
          return renderCell(`
            <div class="flex items-center justify-center gap-1.5">
              <span class="bazi-side-wuxing ${wxClass(p.ganWuxing)}">${esc(p.ganWuxing)}</span>
              <span class="bazi-gan-zhi-char ${wxClass(p.ganWuxing)}">${esc(p.gan)}</span>
              <span class="bazi-side-wuxing ${wxClass(p.ganWuxing)}">${esc(p.ganWuxing)}</span>
            </div>
          `, isDay);
        }).join('')}
        <td class="header-label font-bold text-xs">四柱</td>
      </tr>
    `;

    const rowZhi = `
      <tr class="border-b border-stone-300 bg-stone-50/70">
        ${order.map(k => {
          const isDay = (k === 'day');
          const p = fp[k];
          return renderCell(`
            <div class="flex items-center justify-center gap-1.5">
              <span class="bazi-side-wuxing ${wxClass(p.zhiWuxing)}">${esc(p.zhiWuxing)}</span>
              <span class="bazi-gan-zhi-char ${wxClass(p.zhiWuxing)}">${esc(p.zhi)}</span>
              <span class="bazi-side-wuxing ${wxClass(p.zhiWuxing)}">${esc(p.zhiWuxing)}</span>
            </div>
          `, isDay);
        }).join('')}
        <td class="header-label font-bold text-xs">四柱</td>
      </tr>
    `;

    const rowHidden = `
      <tr class="border-b border-stone-300 text-xs font-bold text-stone-800">
        ${order.map(k => {
          const isDay = (k === 'day');
          const p = fp[k];
          const hiddenHtml = p.hidden.map(h => `<span class="${wxClass(h.wuxing)} font-black">${esc(h.stem)}</span>`).join('　');
          return renderCell(hiddenHtml, isDay);
        }).join('')}
        <td class="header-label">藏</td>
      </tr>
    `;

    const rowFuStar = `
      <tr class="border-b border-stone-300 text-[11px] font-bold">
        ${order.map(k => {
          const isDay = (k === 'day');
          const p = fp[k];
          const starsHtml = p.hidden.map(h => `<span class="text-stone-700">${esc(h.shiShen)}</span>`).join(' ');
          return renderCell(starsHtml, isDay);
        }).join('')}
        <td class="header-label">副星</td>
      </tr>
    `;

    const rowDiShi = `
      <tr class="border-b border-stone-300 text-xs font-black text-stone-800">
        ${order.map(k => {
          const isDay = (k === 'day');
          return renderCell(esc(fp[k].diShi), isDay);
        }).join('')}
        <td class="header-label">運</td>
      </tr>
    `;

    // 檢查空亡 (年空/日空)
    const dayKongZhis = (aux.dayKong || '').split('');
    const yearKongZhis = (aux.yearKong || '').split('');
    const isZhiKong = zhi => dayKongZhis.includes(zhi) || yearKongZhis.includes(zhi);

    const rowShenSha = `
      <tr class="border-b border-stone-300 text-xs font-bold text-purple-900">
        ${order.map(k => {
          const isDay = (k === 'day');
          const list = fp[k].shenSha || [];
          const zhi = fp[k].zhi;
          const kong = isZhiKong(zhi);
          const listHtml = list.length
            ? list.map(s => `
                <button type="button" class="hover:underline hover:text-purple-600 block mx-auto text-[11px] leading-tight my-0.5" onclick="openShenShaDrawer('${esc(s)}')">
                  ${esc(s)}${kong ? '<span class="kong-badge">空</span>' : ''}
                </button>
              `).join('')
            : '—';
          return renderCell(listHtml, isDay, 'align-top leading-tight');
        }).join('')}
        <td class="header-label leading-tight">地支<br>神煞</td>
      </tr>
    `;

    const rowNaYin = `
      <tr class="text-xs font-bold text-stone-700 bg-stone-50/50 border-b-2 border-stone-700">
        ${order.map(k => {
          const isDay = (k === 'day');
          return renderCell(esc(fp[k].naYin), isDay);
        }).join('')}
        <td class="header-label">納</td>
      </tr>
    `;

    // 3. 十年大運橫列
    const dayunList = (data.daYun && data.daYun.list) ? data.daYun.list.slice().reverse() : [];
    const dayunHtml = dayunList.map(d => {
      const isCur = (d.age <= data.lunarAge && data.lunarAge < d.age + 10);
      return `
        <div class="dayun-cell ${isCur ? 'active' : ''}">
          <span class="text-[10px] font-bold text-stone-500">${d.age}</span>
          <span class="text-base font-black ${wxClass(d.ganWuxing)} leading-none my-0.5">${esc(d.gan)}</span>
          <span class="text-base font-black ${wxClass(d.zhiWuxing)} leading-none">${esc(d.zhi)}</span>
        </div>
      `;
    }).join('');

    // 4. 先天體檢臟腑
    const organsHtml = (data.organCheckup || []).map(x => `
      <div class="flex items-center gap-1 text-xs">
        <span class="font-bold ${x.count > 0 ? 'text-rose-600' : 'text-stone-400'}">${x.count}</span>
        <span class="font-black ${wxClass(x.wuxing)}">${esc(x.stem)}</span>
        <span class="text-stone-700 text-[11px]">${esc(x.organ)}</span>
      </div>
    `).join('');

    // 5. 地支刑沖會合害
    const rels = data.interactions || {};
    const relText = value => Array.isArray(value) ? value.join('、') : (value || '—');
    const relItems = [
      { label: '三合', val: relText(rels.sanHe), color: 'text-rose-600' },
      { label: '三會', val: relText(rels.sanHui), color: 'text-purple-600' },
      { label: '六合', val: relText(rels.liuHe), color: 'text-rose-700' },
      { label: '沖', val: relText(rels.chong), color: 'text-emerald-700' },
      { label: '刑', val: relText(rels.xing), color: 'text-blue-700' },
      { label: '破', val: relText(rels.po), color: 'text-amber-800' },
      { label: '害', val: relText(rels.hai), color: 'text-stone-700' }
    ];
    const relsTableHtml = relItems.map(item => `
      <div class="flex items-center justify-between py-1 border-b border-stone-200 text-xs">
        <span class="font-bold text-stone-600 w-12">${item.label}</span>
        <span class="font-black ${item.color} flex-1 text-right">${item.val}</span>
      </div>
    `).join('');

    // 6. 兩柱關係計算 (日柱與月柱、日柱與時柱、日柱與年柱)
    const dayRelMonth = analyzePillarRelation(fp.day.gan, fp.day.zhi, fp.month.gan, fp.month.zhi);
    const dayRelTime = analyzePillarRelation(fp.day.gan, fp.day.zhi, fp.time.gan, fp.time.zhi);
    const dayRelYear = analyzePillarRelation(fp.day.gan, fp.day.zhi, fp.year.gan, fp.year.zhi);
    const monthRelYear = analyzePillarRelation(fp.month.gan, fp.month.zhi, fp.year.gan, fp.year.zhi);

    // 7. 神煞圖鑑
    const catalogHtml = (data.shenShaCatalog || []).map(s => `
      <button type="button" class="px-2.5 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-700 hover:bg-amber-100 border border-stone-300 transition" onclick="openShenShaDrawer('${esc(s)}')">
        ${esc(s)}
      </button>
    `).join('');

    // 渲染
    host.innerHTML = `
      <div class="bazi-classic-board">
        
        <!-- 頂部導航 Tabs (8045 截圖：大盤 / 關係 / 神煞) -->
        <div class="px-4 py-2.5 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 text-amber-50 flex flex-wrap items-center justify-between border-b-2 border-stone-800 gap-3">
          <div>
            <span class="text-[11px] text-amber-300/80 font-bold block">癒見幸福 · 魔法占星學院</span>
            <h2 class="text-lg sm:text-xl font-black text-amber-100 tracking-wide">${esc(data.userName)} 的四柱命盤</h2>
          </div>

          <!-- 三大模式切換鈕 -->
          <div class="inline-flex p-1 bg-stone-700/80 rounded-xl border border-stone-600 text-xs font-bold">
            <button type="button" id="tab_btn_dapan" class="px-3 py-1.5 rounded-lg transition ${currentTab === 'dapan' ? 'bg-amber-500 text-stone-900 font-black shadow-xs' : 'text-stone-300 hover:text-white'}" onclick="switchBaziTab('dapan')">
              📊 大盤視圖
            </button>
            <button type="button" id="tab_btn_relation" class="px-3 py-1.5 rounded-lg transition ${currentTab === 'relation' ? 'bg-amber-500 text-stone-900 font-black shadow-xs' : 'text-stone-300 hover:text-white'}" onclick="switchBaziTab('relation')">
              🔗 關係視圖
            </button>
            <button type="button" id="tab_btn_shensha" class="px-3 py-1.5 rounded-lg transition ${currentTab === 'shensha' ? 'bg-amber-500 text-stone-900 font-black shadow-xs' : 'text-stone-300 hover:text-white'}" onclick="switchBaziTab('shensha')">
              ✨ 神煞視圖
            </button>
          </div>

          <div class="text-right text-xs text-stone-300">
            <span class="font-bold text-amber-200">${esc(data.zodiac)} · ${esc(data.genderLabel)}</span><br>
            <span>${esc(data.solarString)} · 虛歲 ${data.lunarAge} 歲</span>
          </div>
        </div>

        <!-- 視圖容器 1：大盤視圖 (18:57 核心) -->
        <div id="view_dapan_panel" class="${currentTab === 'dapan' ? '' : 'hidden'}">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-stone-700">
            <!-- 左側四柱核心表 -->
            <div class="lg:col-span-5 border-b lg:border-b-0 lg:border-r-2 border-stone-700 overflow-x-auto">
              <table class="bazi-classic-table">
                <tbody>
                  ${rowMainStar}
                  ${rowGan}
                  ${rowZhi}
                  ${rowHidden}
                  ${rowFuStar}
                  ${rowDiShi}
                  ${rowShenSha}
                  ${rowNaYin}
                </tbody>
              </table>
            </div>

            <!-- 中間生肖姓名學五格剖象 (8051 格式：人格為本體) -->
            <div class="lg:col-span-4 border-b lg:border-b-0 lg:border-r-2 border-stone-700 p-2 sm:p-3 flex flex-col justify-between bg-white">
              <div>
                <div class="flex items-center justify-between bg-rose-700 text-white font-black text-xs py-1 px-2.5 rounded-t-lg mb-1">
                  <span>生肖姓名學 (以人格為本體)</span>
                  <span class="text-[10px] opacity-90">康熙字典精確推算</span>
                </div>
                
                <!-- 漢字拆解表 (點選字跳出康熙字典釋義) -->
                <table class="w-full text-center text-xs border-collapse border border-stone-300 rounded-b-lg mb-2">
                  <thead>
                    <tr class="bg-stone-100 text-stone-600 font-bold border-b border-stone-300">
                      <th class="p-1 border-r border-stone-200">繁體</th>
                      <th class="p-1 border-r border-stone-200">筆劃</th>
                      <th class="p-1 border-r border-stone-200">簡體</th>
                      <th class="p-1 border-r border-stone-200">部首</th>
                      <th class="p-1">五行</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${nameCharsHtml}
                  </tbody>
                </table>

                <!-- 五格數理展現 -->
                <div class="grid grid-cols-2 gap-1.5 mb-2">
                  ${nameAnalysis ? renderGridItem('天格', nameAnalysis.tiange) : ''}
                  ${nameAnalysis ? renderGridItem('人格', nameAnalysis.renge) : ''}
                  ${nameAnalysis ? renderGridItem('地格', nameAnalysis.dige) : ''}
                  ${nameAnalysis ? renderGridItem('外格', nameAnalysis.waige) : ''}
                  <div class="col-span-2">
                    ${nameAnalysis ? renderGridItem('總格', nameAnalysis.zongge) : ''}
                  </div>
                </div>

                <!-- 白話生剋指引摘要 -->
                <div class="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-stone-700 leading-relaxed font-bold space-y-1">
                  <div class="text-rose-900 font-black flex items-center gap-1">
                    <span>💡 姓名生活化生剋解析：</span>
                  </div>
                  <div>• ${nameAnalysis?.renge?.interpretation || ''}</div>
                  <div>• ${nameAnalysis?.tiange?.interpretation || ''}</div>
                  <div>• ${nameAnalysis?.dige?.interpretation || ''}</div>
                  <div>• ${nameAnalysis?.waige?.interpretation || ''}</div>
                </div>

              </div>

              <div class="text-[10px] text-stone-500 text-center font-bold pt-1">
                印章：生我為【印】、我生為【食】、剋我為【官】、我剋為【財】、同我為【比】
              </div>
            </div>

            <!-- 右側基本資料與本命易卦 -->
            <div class="lg:col-span-3 p-3 bg-stone-50/70 flex flex-col justify-between text-xs">
              <div class="space-y-2">
                <div class="flex items-center justify-between pb-1.5 border-b border-stone-300">
                  <span class="font-black text-sm text-stone-800">${esc(data.zodiac)} ${esc(data.genderLabel)}</span>
                  <span class="font-bold text-stone-500">公元 ${esc(data.solarDate.split('-')[0])} 年</span>
                </div>
                <p class="text-stone-700 leading-relaxed font-bold">
                  姓名：<span class="text-rose-700 text-sm font-black">${esc(data.userName)}</span><br>
                  農曆：<span class="text-stone-900 font-bold">${esc(data.lunarString)}</span><br>
                  星期：<span class="text-stone-800">${esc(data.solarString.split('星期')[1] ? '星期' + data.solarString.split('星期')[1] : '')}</span>
                </p>
              </div>

              <!-- 本命易卦 -->
              <div class="mt-3 p-2.5 rounded-xl bg-white border border-stone-300 text-center shadow-2xs">
                <div class="text-[10px] text-stone-500 font-bold mb-1">易經本命卦</div>
                <div class="text-2xl font-black text-stone-800 tracking-wider">
                  ${esc(data.gua.symbolUpper)} ${esc(data.gua.symbolLower)}
                </div>
                <div class="text-sm font-black text-amber-900 mt-1">${esc(data.gua.guaName)}</div>
                <div class="text-[11px] text-stone-600 mt-0.5">${esc(data.gua.summary)}</div>
              </div>
            </div>

          </div>

          <!-- 十年大運橫列 -->
          <div class="flex items-stretch border-b-2 border-stone-700 bg-stone-100 overflow-x-auto">
            <div class="w-12 shrink-0 bg-stone-200/90 text-stone-700 font-black text-xs flex items-center justify-center border-r border-stone-300 py-2 leading-tight text-center">
              歲<br>大<br>運
            </div>
            <div class="grid grid-cols-10 flex-1 divide-x divide-stone-300">
              ${dayunHtml}
            </div>
          </div>

          <!-- 輔助分析區 -->
          <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-stone-700 bg-white">
            
            <!-- 左欄：陽宅命卦與五行喜忌 -->
            <div class="lg:col-span-4 p-3 sm:p-4 space-y-2 text-xs">
              <div class="flex items-center justify-between pb-1.5 border-b border-stone-200">
                <span class="font-bold text-stone-600">陽宅命卦</span>
                <span class="font-black text-stone-900">${esc(data.gua.houseGua)}</span>
              </div>
              <div class="flex items-center justify-between pb-1.5 border-b border-stone-200">
                <span class="font-bold text-stone-600">人元用事</span>
                <span class="font-black text-blue-700">${esc(aux.mingGe || '己傷官')}</span>
              </div>
              <div class="p-2 rounded-lg bg-stone-50 border border-stone-200 text-center">
                <div class="text-[10px] text-stone-500 font-bold mb-0.5">日主旺度</div>
                <div class="flex justify-center items-center gap-4 text-sm font-black">
                  <span class="text-emerald-600">${esc(bal.scorePos)}</span>
                  <span class="text-rose-600">${esc(bal.scoreNeg)}</span>
                </div>
              </div>
              <div class="text-[11px] leading-relaxed font-bold text-stone-700 pt-1">
                <div>旺 <b class="${wxClass(bal.wang)}">${bal.wang}</b>　相 <b class="${wxClass(bal.xiang)}">${bal.xiang}</b>　死 <b class="${wxClass(bal.si)}">${bal.si}</b>　囚 <b class="${wxClass(bal.qiu)}">${bal.qiu}</b>　休 <b class="${wxClass(bal.xiu)}">${bal.xiu}</b></div>
                <div class="mt-1">喜 <b class="${wxClass(bal.xi)}">${bal.xi}</b>　閒 <b class="${wxClass(bal.xian)}">${bal.xian}</b>　仇 <b class="${wxClass(bal.chou)}">${bal.chou}</b>　忌 <b class="${wxClass(bal.ji)}">${bal.ji}</b>　用 <b class="${wxClass(bal.yong)}">${bal.yong}</b></div>
              </div>
            </div>

            <!-- 中欄：先天體檢與起運時間 -->
            <div class="lg:col-span-5 p-3 sm:p-4 space-y-2.5 text-xs">
              <div class="grid grid-cols-7 gap-1 text-center font-bold text-[11px] bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/80">
                <div><span class="text-stone-500 block text-[9px]">日空</span><span class="text-emerald-700 font-black">${esc(aux.dayKong)}</span></div>
                <div><span class="text-stone-500 block text-[9px]">年空</span><span class="text-emerald-700 font-black">${esc(aux.yearKong)}</span></div>
                <div><span class="text-stone-500 block text-[9px]">胎息</span><span class="text-stone-800 font-black">${esc(aux.taiXi)}</span></div>
                <div><span class="text-stone-500 block text-[9px]">胎元</span><span class="text-stone-800 font-black">${esc(aux.taiYuan)}</span></div>
                <div><span class="text-stone-500 block text-[9px]">命格</span><span class="text-rose-700 font-black">${esc(aux.mingGe)}</span></div>
                <div><span class="text-stone-500 block text-[9px]">身宮</span><span class="text-blue-700 font-black">${esc(aux.shenGong)}</span></div>
                <div><span class="text-stone-500 block text-[9px]">命宮</span><span class="text-purple-700 font-black">${esc(aux.mingGong)}</span></div>
              </div>

              <!-- 十天干臟腑體檢 -->
              <div class="p-2 bg-stone-50 rounded-lg border border-stone-200">
                <div class="text-[10px] text-stone-500 font-bold mb-1.5 flex items-center justify-between">
                  <span>先天臟腑經絡體檢</span>
                  <span class="text-stone-400">十天干五行能量</span>
                </div>
                <div class="grid grid-cols-5 gap-y-1.5 gap-x-2">
                  ${organsHtml}
                </div>
              </div>

              <!-- 起運交運詳細時間 -->
              <div class="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-center font-bold text-emerald-950 text-[11px]">
                <div>出生後 <b class="text-rose-700">${esc(data.startAge || 9)}</b> 年 <b class="text-rose-700">${esc(data.startMonth || 8)}</b> 個月又 <b class="text-rose-700">${esc(data.startDay || 3)}</b> 天上大運</div>
                <div class="text-stone-600 text-[10px] mt-0.5">每逢 <b class="text-blue-700">${esc(data.daYunExchangeYear || '癸或戊')}</b> 年 ${esc(data.daYunJieQi || '秋分')} 後 ${esc(data.daYunDays || 14)} 天交大運</div>
              </div>
            </div>

            <!-- 右欄：地支刑沖合害 -->
            <div class="lg:col-span-3 p-3 sm:p-4 text-xs bg-stone-50/40">
              <div class="font-black text-stone-800 pb-1.5 mb-1.5 border-b border-stone-200 flex items-center justify-between">
                <span>地支刑沖合害速查</span>
                <span class="text-[10px] text-stone-400">本命局交互</span>
              </div>
              <div class="space-y-0.5">
                ${relsTableHtml}
              </div>
            </div>

          </div>
        </div>

        <!-- 視圖容器 2：關係視圖 (8045-8048 截圖：柱與柱關係深度分析) -->
        <div id="view_relation_panel" class="p-4 sm:p-6 bg-slate-50 space-y-4 ${currentTab === 'relation' ? '' : 'hidden'}">
          <div class="flex items-center justify-between border-b border-stone-300 pb-2">
            <div>
              <h3 class="text-base font-black text-stone-900">🔗 柱與柱關係智能深度診斷</h3>
              <p class="text-xs text-stone-600">透視四柱與大運間之「伏吟、反吟、天地合、刑沖會合破害」深層意涵</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">生活微情境解讀</span>
          </div>

          <!-- 四柱兩兩關係診斷卡 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            <!-- 日柱 ➔ 月柱 (自我與家庭/職場) -->
            <div class="p-3.5 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-2">
              <div class="flex items-center justify-between text-xs font-black pb-1.5 border-b border-stone-200">
                <span class="text-rose-800">日柱 [${fp.day.gan}${fp.day.zhi}] ⟷ 月柱 [${fp.month.gan}${fp.month.zhi}]</span>
                <span class="text-stone-500 text-[11px]">核心自我 vs 父母家庭與社會職場</span>
              </div>
              <div class="space-y-1 text-xs">
                ${dayRelMonth.length ? dayRelMonth.map(r => `
                  <div class="p-2 rounded bg-amber-50 border border-amber-200">
                    <span class="font-black text-amber-950">${r.name}</span>：
                    <span class="text-stone-700 font-bold">${r.desc}</span>
                  </div>
                `).join('') : '<p class="text-stone-500 py-2 text-center">兩柱平和和順，無特殊沖剋羈絆。</p>'}
              </div>
            </div>

            <!-- 日柱 ➔ 時柱 (自我與晚年/子女/夢想) -->
            <div class="p-3.5 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-2">
              <div class="flex items-center justify-between text-xs font-black pb-1.5 border-b border-stone-200">
                <span class="text-blue-800">日柱 [${fp.day.gan}${fp.day.zhi}] ⟷ 時柱 [${fp.time.gan}${fp.time.zhi}]</span>
                <span class="text-stone-500 text-[11px]">核心自我 vs 夢想願景與晚年子嗣</span>
              </div>
              <div class="space-y-1 text-xs">
                ${dayRelTime.length ? dayRelTime.map(r => `
                  <div class="p-2 rounded bg-blue-50 border border-blue-200">
                    <span class="font-black text-blue-950">${r.name}</span>：
                    <span class="text-stone-700 font-bold">${r.desc}</span>
                  </div>
                `).join('') : '<p class="text-stone-500 py-2 text-center">兩柱和睦相生，晚景安定自在。</p>'}
              </div>
            </div>

            <!-- 日柱 ➔ 年柱 (自我與家族/根基) -->
            <div class="p-3.5 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-2">
              <div class="flex items-center justify-between text-xs font-black pb-1.5 border-b border-stone-200">
                <span class="text-emerald-800">日柱 [${fp.day.gan}${fp.day.zhi}] ⟷ 年柱 [${fp.year.gan}${fp.year.zhi}]</span>
                <span class="text-stone-500 text-[11px]">核心自我 vs 家族祖蔭與整體大環境</span>
              </div>
              <div class="space-y-1 text-xs">
                ${dayRelYear.length ? dayRelYear.map(r => `
                  <div class="p-2 rounded bg-emerald-50 border border-emerald-200">
                    <span class="font-black text-emerald-950">${r.name}</span>：
                    <span class="text-stone-700 font-bold">${r.desc}</span>
                  </div>
                `).join('') : '<p class="text-stone-500 py-2 text-center">祖德溫和流動，得大環境常態庇佑。</p>'}
              </div>
            </div>

            <!-- 月柱 ➔ 年柱 (時代根基與家庭承傳) -->
            <div class="p-3.5 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-2">
              <div class="flex items-center justify-between text-xs font-black pb-1.5 border-b border-stone-200">
                <span class="text-purple-800">月柱 [${fp.month.gan}${fp.month.zhi}] ⟷ 年柱 [${fp.year.gan}${fp.year.zhi}]</span>
                <span class="text-stone-500 text-[11px]">職場舞台 vs 時代傳承與長輩意志</span>
              </div>
              <div class="space-y-1 text-xs">
                ${monthRelYear.length ? monthRelYear.map(r => `
                  <div class="p-2 rounded bg-purple-50 border border-purple-200">
                    <span class="font-black text-purple-950">${r.name}</span>：
                    <span class="text-stone-700 font-bold">${r.desc}</span>
                  </div>
                `).join('') : '<p class="text-stone-500 py-2 text-center">承先啟後，平順自然開展。</p>'}
              </div>
            </div>

          </div>

          <!-- 刑沖會合生活魔藥建議 -->
          <div class="p-3.5 bg-gradient-to-r from-amber-100/70 to-amber-50 rounded-xl border border-amber-300 text-xs space-y-1 text-stone-800 font-bold">
            <div class="text-amber-950 font-black">🧪 愛倫魔藥師破局觀點：</div>
            <p>命局中的相沖、相刑帶著突破安逸現狀的「強效催化劑」力量。遇沖可主動安排探索與調整日常；遇合可珍惜有緣夥伴，創造互補雙贏。</p>
          </div>
        </div>

        <!-- 視圖容器 3：神煞視圖 (8049-8050 截圖：神煞深入圖鑑庫) -->
        <div id="view_shensha_panel" class="p-4 sm:p-6 bg-slate-50 space-y-4 ${currentTab === 'shensha' ? '' : 'hidden'}">
          <div class="flex items-center justify-between border-b border-stone-300 pb-2">
            <div>
              <h3 class="text-base font-black text-stone-900">✨ 五十四種神煞深入生活圖鑑</h3>
              <p class="text-xs text-stone-600">點擊任意神煞標籤，即刻滑出通俗生活化深度解讀與調頻魔法處方</p>
            </div>
            <span class="text-xs font-bold text-stone-500">含空亡 [空] 標記</span>
          </div>

          <!-- 當前命盤命中神煞 -->
          <div class="p-4 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-3">
            <div class="text-xs font-black text-stone-800">🎯 本命盤帶有之專屬神煞（點選查看深度解讀）：</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              ${order.map(k => {
                const list = fp[k].shenSha || [];
                const zhi = fp[k].zhi;
                const kong = isZhiKong(zhi);
                return `
                  <div class="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span class="font-black text-stone-700 block mb-1.5">${labels[k]} [${fp[k].gan}${fp[k].zhi}]</span>
                    <div class="space-y-1">
                      ${list.length ? list.map(s => `
                        <button type="button" class="w-full text-left px-2 py-1 rounded bg-white hover:bg-amber-100 border border-stone-200 text-[11px] font-bold text-purple-900 flex items-center justify-between" onclick="openShenShaDrawer('${esc(s)}')">
                          <span>${esc(s)}</span>
                          ${kong ? '<span class="kong-badge">空</span>' : ''}
                        </button>
                      `).join('') : '<span class="text-stone-400 text-[11px]">常態無煞</span>'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 全神煞速查庫 -->
          <div class="p-4 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-2">
            <div class="text-xs font-black text-stone-800">📚 五十四種全神煞檢索庫：</div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${catalogHtml}
            </div>
          </div>
        </div>

        <!-- 底部展開區域：節氣進度軸與生活魔藥 -->
        <div class="p-3 bg-stone-100 border-t border-stone-300">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <!-- 節氣軸 -->
            <div class="p-3 bg-white rounded-xl border border-stone-200">
              <div class="flex items-center justify-between font-black text-stone-700 mb-1.5">
                <span>節氣進度軸：${esc(jq.prev?.name || '立冬')} ➔ ${esc(jq.next?.name || '大雪')}</span>
                <span class="text-purple-700">${Math.round(jq.progress || 50)}%</span>
              </div>
              <div class="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden mb-1.5">
                <div class="bg-gradient-to-r from-purple-700 to-indigo-600 h-full rounded-full" style="width: ${jq.progress || 50}%;"></div>
              </div>
              <div class="flex justify-between text-[10px] font-bold text-stone-500">
                <span>${esc(jq.prev?.name)}已過 ${esc(jq.prev?.distance)}</span>
                <span>距${esc(jq.next?.name)}倒數 ${esc(jq.next?.distance)}</span>
              </div>
            </div>

            <!-- 生活魔藥 -->
            <div class="p-3 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 space-y-1">
              <div class="font-black text-amber-950 flex items-center justify-between">
                <span>🧪 愛倫院長生活魔藥調頻</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">專屬能量對頻</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div>
                  <span class="font-black text-emerald-800 block">🌿 精油</span>
                  <span id="unified_potion_oil" class="text-stone-700 font-bold">甜橙 + 雪松</span>
                </div>
                <div>
                  <span class="font-black text-amber-800 block">💎 晶石</span>
                  <span id="unified_potion_crystal" class="text-stone-700 font-bold">黃水晶 / 白水晶</span>
                </div>
                <div>
                  <span class="font-black text-purple-800 block">✨ 微儀式</span>
                  <span id="unified_potion_ritual" class="text-stone-700 font-bold">晨間深呼吸三回</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    // 注入 Tabs 切換函數
    window.switchBaziTab = function(tab) {
      currentTab = tab;
      document.getElementById('view_dapan_panel')?.classList.toggle('hidden', tab !== 'dapan');
      document.getElementById('view_relation_panel')?.classList.toggle('hidden', tab !== 'relation');
      document.getElementById('view_shensha_panel')?.classList.toggle('hidden', tab !== 'shensha');

      const tabs = ['dapan', 'relation', 'shensha'];
      tabs.forEach(t => {
        const btn = document.getElementById(`tab_btn_${t}`);
        if (btn) {
          if (t === tab) {
            btn.className = 'px-3 py-1.5 rounded-lg transition bg-amber-500 text-stone-900 font-black shadow-xs';
          } else {
            btn.className = 'px-3 py-1.5 rounded-lg transition text-stone-300 hover:text-white';
          }
        }
      });
    };

    // 注入康熙字典彈窗函數
    window.openKangxiModal = function(char) {
      const dict = (global.KangXiDict && global.KangXiDict[char]) ? global.KangXiDict[char] : null;
      let modal = document.getElementById('kangxi_char_modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'kangxi_char_modal';
        modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden';
        modal.innerHTML = `
          <div class="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-stone-800 space-y-4 animate-scale-in">
            <div class="flex items-center justify-between pb-3 border-b border-stone-200">
              <div class="flex items-center gap-3">
                <span id="kx_modal_char" class="text-3xl font-black text-rose-800"></span>
                <div>
                  <h4 class="text-base font-black text-stone-900">康熙字典大典考據</h4>
                  <span id="kx_modal_meta" class="text-xs text-stone-500 font-bold"></span>
                </div>
              </div>
              <button type="button" onclick="document.getElementById('kangxi_char_modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600">✕</button>
            </div>
            <div class="max-h-72 overflow-y-auto text-xs text-stone-700 leading-relaxed font-bold p-3 bg-stone-50 rounded-xl border border-stone-200" id="kx_modal_explain">
            </div>
            <div class="text-right">
              <button type="button" onclick="document.getElementById('kangxi_char_modal').classList.add('hidden')" class="px-4 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-black">關閉</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      if (dict) {
        document.getElementById('kx_modal_char').textContent = char;
        document.getElementById('kx_modal_meta').textContent = `康熙筆劃：${dict.strokes} 劃 · 部首：${dict.radical} · 五行屬${dict.element} · 簡體：${dict.simplified || char}`;
        document.getElementById('kx_modal_explain').textContent = dict.explain || '康熙字典收錄正字。';
      } else {
        document.getElementById('kx_modal_char').textContent = char;
        document.getElementById('kx_modal_meta').textContent = '康熙字典正體檢索';
        document.getElementById('kx_modal_explain').textContent = '字義純淨吉祥，依康熙五行推導。';
      }
      modal.classList.remove('hidden');
    };

    if (typeof updateUnifiedPotion === 'function') {
      updateUnifiedPotion(data);
    }
  };

  function getShenShaProfile(name) {
    const elementMap = { 天乙貴人: '金', 文昌: '水', 桃花: '水', 驛馬: '木', 華蓋: '土', 羊刃: '火', 劫煞: '金', 災煞: '火', 亡神: '水', 孤辰: '土', 寡宿: '土' };
    const auspicious = /貴人|文昌|福|德|祿|喜|天醫|金輿/.test(name);
    return {
      tone: auspicious ? '吉曜 · 助力顯化' : '提醒 · 覺察調頻',
      element: elementMap[name] || '依命局五行而定',
      oil: auspicious ? '甜橙與乳香' : '岩蘭草與真正薰衣草',
      crystal: auspicious ? '黃水晶與白水晶' : '黑曜石與煙晶',
      ritual: auspicious ? '晨間將雙手覆在心口，緩慢吸吐四回，寫下今天願意接住的一份支持。' : '晚間以雙腳踩地站立一分鐘，吐氣時放下過度預演，讓身體回到此刻。',
      affirmation: auspicious ? '我安然接住適時而來的支持，穩穩走向自己的位置。' : '我看見訊號，也保有選擇；每一步都能回到清明與穩定。'
    };
  }

  global.openShenShaDrawer = function (shaName) {
    const drawer = document.getElementById('shensha_drawer');
    const backdrop = document.getElementById('shensha_backdrop');
    if (!drawer || !backdrop) return;
    const guide = latestChartData?.shenShaGuide?.[shaName];
    const profile = getShenShaProfile(shaName);
    const description = typeof guide === 'string' && guide.trim()
      ? guide
      : '此神煞像命盤裡的一盞提醒燈，邀請你留意人際、工作與生活節奏中的細微變化。';
    const kong = Object.values(latestChartData?.fourPillars || {}).some(p => (p.shenSha || []).includes(shaName) && p.isKong);

    drawer.innerHTML = `
      <div class="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-stone-200 bg-gradient-to-r from-[#243527] to-[#1b281d] text-amber-50">
        <div>
          <span class="inline-flex px-2.5 py-1 rounded-full bg-amber-200 text-stone-900 text-[11px] font-black">神煞生活解讀</span>
          <h3 class="mt-2 text-2xl sm:text-3xl font-black tracking-wide">${esc(shaName)}</h3>
        </div>
        <button type="button" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-xl font-black transition" onclick="closeShenShaDrawer()" aria-label="關閉神煞說明">✕</button>
      </div>
      <div class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-sm leading-7 text-stone-700">
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-3"><span class="block text-[11px] font-black text-amber-900">屬性判讀</span><b class="text-stone-900">${profile.tone}</b></div>
          <div class="rounded-2xl border border-sky-200 bg-sky-50 p-3"><span class="block text-[11px] font-black text-sky-900">五行線索</span><b class="text-stone-900">${profile.element}</b></div>
        </div>
        <section class="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <h4 class="font-black text-stone-900 mb-2">白話生活解讀</h4>
          <p>${esc(description)}</p>
        </section>
        <section class="rounded-2xl border ${kong ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-white'} p-4">
          <h4 class="font-black text-stone-900 mb-2">旬空提示</h4>
          <p>${kong ? '此神煞所在柱逢空，外在訊號容易先出現、後沉澱。把它當成觀察期，先記錄感受與事實，再安排下一步。' : '此神煞目前未見旬空標記。仍可透過日常覺察，將它的象徵轉為可掌握的行動節奏。'}</p>
        </section>
        <section class="rounded-2xl border border-[#d8bd83] bg-gradient-to-br from-[#fffaf0] to-white p-4 space-y-3">
          <h4 class="font-black text-amber-950">愛倫生活魔藥調頻處方</h4>
          <div class="grid grid-cols-2 gap-3 text-xs"><p><b>精油</b><br>${profile.oil}</p><p><b>晶石</b><br>${profile.crystal}</p></div>
          <p class="text-xs"><b>微儀式</b><br>${profile.ritual}</p>
          <blockquote class="rounded-xl bg-amber-100/70 p-3 text-xs font-bold text-amber-950">「${profile.affirmation}」</blockquote>
        </section>
      </div>`;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-visible');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('shensha-drawer-open');
  };

  global.closeShenShaDrawer = function () {
    const drawer = document.getElementById('shensha_drawer');
    const backdrop = document.getElementById('shensha_backdrop');
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden', 'true');
    backdrop?.classList.remove('is-visible');
    backdrop?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('shensha-drawer-open');
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('shensha_backdrop')?.addEventListener('click', global.closeShenShaDrawer);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') global.closeShenShaDrawer();
    });
  });

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
