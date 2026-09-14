/**
 * 癒見幸福 · 全站排盤統一多層次固定選單列 (MeetJoy Unified Multi-Level Navigation)
 * 核心功能：
 * 1. 統一所有排盤頁面導覽列，修復「缺少數字能量」之問題
 * 2. 呈現學院「五大學系」多層次架構 (陰陽數字 / 東方命理 / 蒼穹星象 / 神聖卜筮 / 能量脈輪)
 * 3. 雙層固定 (Sticky Top)：第 1 層官方品牌與聯絡外連，第 2 層五大學系 10 大排盤系統
 * 4. 自動偵測當前頁面並以香檳金高亮醒目標記
 */

(function () {
  'use strict';

  const DEPARTMENTS = [
    {
      id: 'dept-num',
      name: '🧬 陰陽數字',
      systems: [
        { name: '數字能量', url: '/numerology.html', tag: '雙盤' },
        { name: '人類圖', url: '/human-design.html', tag: '水晶' },
        { name: '撲克命牌', url: '/destiny-cards.html', tag: '命書' }
      ]
    },
    {
      id: 'dept-east',
      name: '⛩️ 東方命理',
      systems: [
        { name: '紫微斗數', url: '/ziwei.html', tag: '十二宮' },
        { name: '四盤小六壬', url: '/xiao-liu-ren.html', tag: '時空' },
        { name: '文王六爻', url: '/liu-yao.html', tag: '卦象' }
      ]
    },
    {
      id: 'dept-astro',
      name: '🏛️ 蒼穹星象',
      systems: [
        { name: '西洋占星', url: '/astrology.html', tag: '星盤' }
      ]
    },
    {
      id: 'dept-divine',
      name: '🔮 神聖卜筮',
      systems: [
        { name: '西洋地占', url: '/geomancy.html', tag: '大地' },
        { name: '基因天命', url: '/gene-keys.html', tag: '全息' }
      ]
    },
    {
      id: 'dept-chakra',
      name: '🧪 能量脈輪',
      systems: [
        { name: '脈輪占星', url: '/chakra-astrology.html', tag: '七曜' }
      ]
    }
  ];

  function getCurrentPath() {
    const p = window.location.pathname.toLowerCase();
    if (p === '/' || p === '/index.html' || p === '') return '/index.html';
    return p;
  }

  function renderUnifiedNav() {
    const current = getCurrentPath();

    // 建立外層導覽容器
    const nav = document.createElement('header');
    nav.id = 'mj_unified_global_header';
    nav.className = 'w-full sticky top-0 z-[9999] shadow-md border-b border-[#C8A97E]/40 font-serif select-none';
    nav.style.backgroundColor = '#1A2319';

    // 第 1 層：官方 Logo、大典標題、外部捷徑
    const topBarHtml = `
      <div class="w-full px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between border-b border-white/10 text-amber-50">
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- 官方 Logo (回官網 meetjoy.net) -->
          <a href="https://meetjoy.net/" title="返回癒見幸福官方首頁" class="block shrink-0 group">
            <img src="https://meetjoy.net/wp-content/uploads/2026/09/meetjoy-official-logo.png" alt="癒見幸福官方 Logo" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C8A97E]/80 shadow-md bg-white object-cover group-hover:scale-105 transition-all">
          </a>
          <!-- 大典標題 (回排盤首頁 app.meetjoy.net) -->
          <a href="https://app.meetjoy.net/" title="返回排盤大典首頁" class="font-black text-sm sm:text-base text-[#F7E7CE] hover:text-white transition flex items-center gap-1.5">
            <span>🔮 癒見幸福 · 魔法神算</span>
          </a>
          <span class="text-[11px] text-amber-200/60 hidden lg:inline">| 魔法占星學院 · 愛倫院長排盤實驗室</span>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold">
          <a href="https://app.meetjoy.net/" class="px-2.5 py-1 rounded-lg text-amber-200 hover:bg-white/10 transition hidden sm:inline-block">
            🌟 排盤總覽
          </a>
          <a href="https://meetjoy.net/" target="_blank" class="px-2 py-1 text-amber-100/90 hover:text-white hover:bg-white/10 rounded-lg transition">
            🏠 官網 ↗
          </a>
          <a href="https://meetjoy.net/booking/" target="_blank" class="px-2.5 py-1 bg-[#C8A97E] hover:bg-[#b8946a] text-stone-900 rounded-lg transition shadow-xs">
            🗓️ 預約諮詢 ↗
          </a>
          <a href="https://line.me/R/ti/p/@548valkv" target="_blank" class="px-2 py-1 bg-[#06C755] hover:bg-[#05b04c] text-white rounded-lg transition shadow-xs hidden sm:inline-block">
            LINE 洽詢
          </a>
        </div>
      </div>
    `;

    // 第 2 層：多層次五大學系排盤選單條
    let deptItemsHtml = '';
    DEPARTMENTS.forEach((dept) => {
      const hasActive = dept.systems.some(s => s.url === current || current.endsWith(s.url));
      const sysLinks = dept.systems.map(s => {
        const isActive = (s.url === current || current.endsWith(s.url));
        if (isActive) {
          return `
            <a href="${s.url}" class="px-2.5 py-1 rounded-lg bg-[#C8A97E] text-stone-900 font-bold shadow-xs whitespace-nowrap text-xs flex items-center gap-1">
              <span>${s.name}</span>
            </a>
          `;
        }
        return `
          <a href="${s.url}" class="px-2.5 py-1 rounded-lg text-amber-100/90 hover:text-white hover:bg-white/10 transition whitespace-nowrap text-xs">
            ${s.name}
          </a>
        `;
      }).join('');

      deptItemsHtml += `
        <div class="flex items-center shrink-0 gap-1 px-2 py-1 rounded-xl ${hasActive ? 'bg-white/10 border border-[#C8A97E]/50' : 'bg-black/20 border border-white/5'}">
          <span class="text-[11px] font-bold text-amber-200/80 mr-0.5 whitespace-nowrap">${dept.name}：</span>
          <div class="flex items-center gap-1">
            ${sysLinks}
          </div>
        </div>
      `;
    });

    const multiLevelBarHtml = `
      <div class="w-full px-2 sm:px-4 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar" style="background-color: #141C13;">
        ${deptItemsHtml}
      </div>
    `;

    nav.innerHTML = topBarHtml + multiLevelBarHtml;

    // 替換既有導覽列
    const existingNav = document.querySelector('nav.mj-global-nav') || 
                        document.querySelector('nav') || 
                        document.getElementById('mj_unified_global_header');

    if (existingNav) {
      existingNav.parentNode.replaceChild(nav, existingNav);
    } else {
      document.body.insertAdjacentElement('afterbegin', nav);
    }
  }

  // DOM 載入時自動初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderUnifiedNav);
  } else {
    renderUnifiedNav();
  }

  window.MeetJoyUnifiedNav = {
    render: renderUnifiedNav
  };
})();
