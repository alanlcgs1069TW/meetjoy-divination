/**
 * 癒見幸福 · 魔法占星學院
 * 八字 18:57 經典主盤視圖引擎 (Bazi 18:57 Classic Board View)
 * 嚴格對齊桌面截圖：截圖 2026-09-16 下午6.57.58.png + 8051 格式 (IMG_8051.jpg)
 * 100% 繁體中文（台灣）· Zero Attribution · 杜絕 AI 文案腔
 */

(function (global) {
  'use strict';

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
  const order = ['time', 'day', 'month', 'year'];
  const labels = { time: '時柱', day: '日柱', month: '月柱', year: '年柱' };

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
      .bazi-detail-drawer {
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  // 核心渲染主函數
  global.renderUnifiedBaziView = function (data) {
    ensureStyles();
    const host = document.getElementById('bazi_chart_container');
    if (!host) return;

    const fp = data.fourPillars;
    const aux = data.auxiliary;
    const bal = data.wuxingBalance;
    const jq = data.jieQiTimeline || {};

    // 1. 姓名學剖象計算 (依據康熙字典與 8051 格式)
    const nameAnalysis = (global.MeetJoyKangXi && typeof global.MeetJoyKangXi.analyzeName === 'function')
      ? global.MeetJoyKangXi.analyzeName(data.userName, fp.day.gan)
      : null;

    // 姓名漢字拆解行
    let nameCharsHtml = '';
    if (nameAnalysis && nameAnalysis.chars && nameAnalysis.chars.length) {
      nameCharsHtml = nameAnalysis.chars.map(c => `
        <tr class="border-b border-stone-200">
          <td class="p-1.5 text-base font-black text-rose-800 border-r border-stone-200">${esc(c.char)}</td>
          <td class="p-1.5 font-bold text-rose-600 border-r border-stone-200">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full border border-rose-400 bg-rose-50 text-[11px] font-black">${c.strokes}</span>
          </td>
          <td class="p-1.5 text-stone-600 border-r border-stone-200">${esc(c.char)}</td>
          <td class="p-1.5 text-stone-600 border-r border-stone-200">${esc(c.radical)}</td>
          <td class="p-1.5 font-black ${wxClass(c.element)}">${esc(c.element)}</td>
        </tr>
      `).join('');
    } else {
      nameCharsHtml = `<tr><td colspan="5" class="p-2 text-stone-400 text-xs">輸入姓名後自動依據康熙字典推導</td></tr>`;
    }

    // 五格數理展現 (天、人、地、外、總格 · 含 8051 格式十神印章)
    const renderGridItem = (label, grid) => {
      if (!grid) return '';
      return `
        <div class="p-1.5 rounded-lg border border-stone-300 bg-stone-50 flex items-center justify-between text-xs">
          <span class="font-bold text-stone-700">${label}</span>
          <div class="flex items-center gap-1.5">
            <span class="font-black text-blue-700 text-sm">${grid.num}</span>
            <span class="font-bold ${wxClass(grid.wuxing)}">${grid.wuxing}</span>
            <span class="text-xs font-bold ${grid.isLucky ? 'text-emerald-600' : 'text-rose-600'}">${grid.symbol}</span>
            <span class="seal-badge" title="十神印章">${esc(grid.seal)}</span>
          </div>
        </div>
      `;
    };

    // 2. 四柱表格構建 (時、日、月、年 順序，天干與地支獨立分行垂直對齊 · 18:57 截圖)
    const renderCell = (content, isDay = false, extraCls = '') => `
      <td class="p-2 border-r border-stone-300 ${isDay ? 'day-col' : ''} ${extraCls}">${content}</td>
    `;

    // Row 1: 主星
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

    // Row 2: 四柱天干 (獨立大字橫列，配兩側五行小字)
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

    // Row 3: 四柱地支 (獨立大字橫列，與天干嚴格垂直對齊)
    const rowZhi = `
      <tr class="border-b-2 border-stone-700 bg-stone-50/70">
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

    // Row 4: 藏干
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

    // Row 5: 副星 (對應十神)
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

    // Row 6: 運 (長生十二運)
    const rowDiShi = `
      <tr class="border-b border-stone-300 text-xs font-black text-stone-800">
        ${order.map(k => {
          const isDay = (k === 'day');
          return renderCell(esc(fp[k].diShi), isDay);
        }).join('')}
        <td class="header-label">運</td>
      </tr>
    `;

    // Row 7: 地支神煞 (紫色排版)
    const rowShenSha = `
      <tr class="border-b border-stone-300 text-xs font-bold text-purple-900">
        ${order.map(k => {
          const isDay = (k === 'day');
          const list = fp[k].shenSha || [];
          const listHtml = list.length
            ? list.map(s => `<button type="button" class="hover:underline hover:text-purple-600 block mx-auto text-[11px]" onclick="openShenShaDrawer('${esc(s)}')">${esc(s)}</button>`).join('')
            : '—';
          return renderCell(listHtml, isDay, 'align-top leading-tight');
        }).join('')}
        <td class="header-label leading-tight">地支<br>神煞</td>
      </tr>
    `;

    // Row 8: 納音
    const rowNaYin = `
      <tr class="text-xs font-bold text-stone-700 bg-stone-50/50 border-b-2 border-stone-700">
        ${order.map(k => {
          const isDay = (k === 'day');
          return renderCell(esc(fp[k].naYin), isDay);
        }).join('')}
        <td class="header-label">納</td>
      </tr>
    `;

    // 3. 十年大運橫列 (歲數在頂，天干地支垂直對齊 · 18:57 截圖)
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

    // 4. 先天體檢十天干臟腑
    const organsHtml = (data.organCheckup || []).map(x => `
      <div class="flex items-center gap-1 text-xs">
        <span class="font-bold ${x.count > 0 ? 'text-rose-600' : 'text-stone-400'}">${x.count}</span>
        <span class="font-black ${wxClass(x.wuxing)}">${esc(x.stem)}</span>
        <span class="text-stone-700 text-[11px]">${esc(x.organ)}</span>
      </div>
    `).join('');

    // 5. 地支刑沖會合害列表 (三合、三會、六合、沖、刑、破、害 · 18:57 截圖)
    const rels = data.interactions || {};
    const relItems = [
      { label: '三合', val: (rels.sanHe || []).join('、') || '—', color: 'text-rose-600' },
      { label: '三會', val: (rels.sanHui || []).join('、') || '—', color: 'text-purple-600' },
      { label: '六合', val: (rels.liuHe || []).join('、') || '—', color: 'text-rose-700' },
      { label: '沖', val: (rels.chong || []).join('、') || '—', color: 'text-emerald-700' },
      { label: '刑', val: (rels.xing || []).join('、') || '—', color: 'text-blue-700' },
      { label: '破', val: (rels.po || []).join('、') || '—', color: 'text-amber-800' },
      { label: '害', val: (rels.hai || []).join('、') || '—', color: 'text-stone-700' }
    ];
    const relsTableHtml = relItems.map(item => `
      <div class="flex items-center justify-between py-1 border-b border-stone-200 text-xs">
        <span class="font-bold text-stone-600 w-12">${item.label}</span>
        <span class="font-black ${item.color} flex-1 text-right">${item.val}</span>
      </div>
    `).join('');

    // 6. 神煞圖鑑晶片 (54種)
    const catalogHtml = (data.shenShaCatalog || []).map(s => `
      <button type="button" class="px-2.5 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-700 hover:bg-amber-100 border border-stone-300 transition" onclick="openShenShaDrawer('${esc(s)}')">
        ${esc(s)}
      </button>
    `).join('');

    // 渲染至 host 容器
    host.innerHTML = `
      <div class="bazi-classic-board">
        
        <!-- 頂部：命盤名稱與公農曆概要 -->
        <div class="px-4 py-3 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 text-amber-50 flex flex-wrap items-center justify-between border-b-2 border-stone-800">
          <div>
            <span class="text-[11px] text-amber-300/80 font-bold block">癒見幸福 · 魔法占星學院</span>
            <h2 class="text-xl sm:text-2xl font-black text-amber-100 tracking-wide">${esc(data.userName)} 的四柱命盤</h2>
          </div>
          <div class="text-right text-xs text-stone-300">
            <span class="font-bold text-amber-200">${esc(data.zodiac)} · ${esc(data.genderLabel)}</span><br>
            <span>${esc(data.solarString)} · 虛歲 ${data.lunarAge} 歲</span>
          </div>
        </div>

        <!-- 主體網格：左四柱 + 中姓名學 + 右生辰易卦 (18:57 截圖核心) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-stone-700">
          
          <!-- 1. 左側四柱核心表 (佔 5 欄) -->
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

          <!-- 2. 中間生肖姓名學五格剖象 (佔 4 欄 · 18:57 + 8051 格式) -->
          <div class="lg:col-span-4 border-b lg:border-b-0 lg:border-r-2 border-stone-700 p-2 sm:p-3 flex flex-col justify-between bg-white">
            <div>
              <div class="flex items-center justify-between bg-rose-700 text-white font-black text-xs py-1 px-2.5 rounded-t-lg mb-1">
                <span>生肖姓名學</span>
                <span class="text-[10px] opacity-90">康熙字典精確推算</span>
              </div>
              
              <!-- 漢字拆解表 -->
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
              <div class="grid grid-cols-2 gap-1.5 mb-1">
                ${nameAnalysis ? renderGridItem('天格', nameAnalysis.tiange) : ''}
                ${nameAnalysis ? renderGridItem('人格', nameAnalysis.renge) : ''}
                ${nameAnalysis ? renderGridItem('地格', nameAnalysis.dige) : ''}
                ${nameAnalysis ? renderGridItem('外格', nameAnalysis.waige) : ''}
                <div class="col-span-2">
                  ${nameAnalysis ? renderGridItem('總格', nameAnalysis.zongge) : ''}
                </div>
              </div>
            </div>

            <div class="text-[10px] text-stone-500 text-center font-bold pt-1">
              印章標記：十神互動格局（官/印/食/財/比）
            </div>
          </div>

          <!-- 3. 右側個人生辰與本命易卦 (佔 3 欄 · 18:57 截圖) -->
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

            <!-- 本命易卦展示 -->
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

        <!-- 中層：十年大運橫列 (天干在上一排、地支在下一排垂直對齊 · 18:57 截圖) -->
        <div class="flex items-stretch border-b-2 border-stone-700 bg-stone-100 overflow-x-auto">
          <div class="w-12 shrink-0 bg-stone-200/90 text-stone-700 font-black text-xs flex items-center justify-center border-r border-stone-300 py-2 leading-tight text-center">
            歲<br>大<br>運
          </div>
          <div class="grid grid-cols-10 flex-1 divide-x divide-stone-300">
            ${dayunHtml}
          </div>
        </div>

        <!-- 下層：輔助分析區 (左命局能量 + 中先天體檢 + 右刑沖會合 · 18:57 截圖) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-stone-700 bg-white">
          
          <!-- 左欄：陽宅命卦與五行旺相休囚死 (佔 4 欄) -->
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

          <!-- 中欄：先天體檢與起運時間 (佔 5 欄) -->
          <div class="lg:col-span-5 p-3 sm:p-4 space-y-2.5 text-xs">
            <!-- 日空 年空 胎息 胎元 命格 身宮 命宮 -->
            <div class="grid grid-cols-7 gap-1 text-center font-bold text-[11px] bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/80">
              <div><span class="text-stone-500 block text-[9px]">日空</span><span class="text-emerald-700 font-black">${esc(aux.dayKong)}</span></div>
              <div><span class="text-stone-500 block text-[9px]">年空</span><span class="text-emerald-700 font-black">${esc(aux.yearKong)}</span></div>
              <div><span class="text-stone-500 block text-[9px]">胎息</span><span class="text-stone-800 font-black">${esc(aux.taiXi)}</span></div>
              <div><span class="text-stone-500 block text-[9px]">胎元</span><span class="text-stone-800 font-black">${esc(aux.taiYuan)}</span></div>
              <div><span class="text-stone-500 block text-[9px]">命格</span><span class="text-rose-700 font-black">${esc(aux.mingGe)}</span></div>
              <div><span class="text-stone-500 block text-[9px]">身宮</span><span class="text-blue-700 font-black">${esc(aux.shenGong)}</span></div>
              <div><span class="text-stone-500 block text-[9px]">命宮</span><span class="text-purple-700 font-black">${esc(aux.mingGong)}</span></div>
            </div>

            <!-- 十天干臟腑體檢 (3癸腎 0壬膀胱 2辛肺...) -->
            <div class="p-2 bg-stone-50 rounded-lg border border-stone-200">
              <div class="text-[10px] text-stone-500 font-bold mb-1.5 flex items-center justify-between">
                <span>先天臟腑經絡體檢</span>
                <span class="text-stone-400">十天干五行能量</span>
              </div>
              <div class="grid grid-cols-5 gap-y-1.5 gap-x-2">
                ${organsHtml}
              </div>
            </div>

            <!-- 起運與交大運精算說明 -->
            <div class="p-2 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-bold leading-relaxed border border-stone-200">
              <div>📅 ${esc(data.daYun.startDesc)}</div>
              <div>⚡ ${esc(data.daYun.exchangeDesc)}</div>
            </div>
          </div>

          <!-- 右欄：地支刑沖會合速查 (佔 3 欄) -->
          <div class="lg:col-span-3 p-3 sm:p-4 text-xs bg-stone-50/40">
            <div class="text-xs font-black text-stone-700 pb-1.5 mb-1.5 border-b border-stone-300">
              地支刑沖會合害
            </div>
            ${relsTableHtml}
          </div>

        </div>

        <!-- 延伸面板：二十四節氣軸 + 刑沖連線 + 神煞圖鑑 + 愛倫生活魔藥 -->
        <details class="border-t-2 border-stone-700 bg-stone-50 p-4 sm:p-5" open>
          <summary class="font-black text-stone-800 text-sm cursor-pointer hover:text-amber-700 transition flex items-center justify-between">
            <span>🔮 深度透視：節氣時間軸 · 刑沖連線 · 54種神煞圖鑑 · 愛倫生活魔藥</span>
            <span class="text-xs text-stone-500 font-normal">點擊展開/收合</span>
          </summary>
          
          <div class="mt-4 space-y-5 pt-3 border-t border-stone-200">
            
            <!-- 1. 二十四節氣進度軸 (立冬～大雪八字月令「節」精確計算) -->
            <div class="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <div class="flex items-center justify-between text-xs font-black text-stone-700 mb-2">
                <span>節氣進度軸：${esc(jq.prev?.name || '前一節氣')} ➔ ${esc(jq.next?.name || '下一節氣')}</span>
                <span class="text-purple-700">${Math.round(jq.progress || 50)}%</span>
              </div>
              <div class="w-full bg-stone-200 rounded-full h-3 overflow-hidden relative mb-2">
                <div class="bg-gradient-to-r from-purple-700 to-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${jq.progress || 50}%;"></div>
              </div>
              <div class="flex justify-between text-[11px] font-bold text-stone-500">
                <span>${esc(jq.prev?.name)}已過 ${esc(jq.prev?.distance)}</span>
                <span>距${esc(jq.next?.name)}倒數 ${esc(jq.next?.distance)}</span>
              </div>
            </div>

            <!-- 2. 愛倫院長生活魔藥處方 -->
            <div class="p-3.5 bg-gradient-to-br from-amber-50/80 to-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
              <div class="flex items-center gap-2 text-xs font-black text-amber-950">
                <span>🧪 愛倫院長生活魔藥調頻處方</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">專屬能量對頻</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div class="p-2.5 rounded-lg bg-white border border-amber-100">
                  <div class="font-black text-emerald-800 mb-1">🌿 植物精油</div>
                  <p id="unified_potion_oil" class="text-stone-700 leading-relaxed font-bold">載入中...</p>
                </div>
                <div class="p-2.5 rounded-lg bg-white border border-amber-100">
                  <div class="font-black text-amber-800 mb-1">💎 晶石礦石</div>
                  <p id="unified_potion_crystal" class="text-stone-700 leading-relaxed font-bold">載入中...</p>
                </div>
                <div class="p-2.5 rounded-lg bg-white border border-amber-100">
                  <div class="font-black text-purple-800 mb-1">✨ 落地微儀式</div>
                  <p id="unified_potion_ritual" class="text-stone-700 leading-relaxed font-bold">載入中...</p>
                </div>
              </div>
            </div>

            <!-- 3. 五十四種神煞圖鑑檢索庫 -->
            <div class="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div class="text-xs font-black text-stone-800 flex items-center justify-between">
                <span>📜 五十四種神煞生活圖鑑庫 (點選即刻彈出生活化解讀)</span>
                <span class="text-[10px] text-stone-400">點擊任意標籤查閱</span>
              </div>
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${catalogHtml}
              </div>
            </div>

          </div>
        </details>

      </div>
    `;

    // 觸發生活魔藥更新
    if (typeof updateUnifiedPotion === 'function') {
      updateUnifiedPotion(data);
    }
  };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
