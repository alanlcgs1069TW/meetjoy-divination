/**
 * 癒見幸福 · 全站排盤統一多層次固定選單列 (MeetJoy Unified Two-Tier Navigation)
 * 核心升級（2026-09-16 愛倫院長指示）：
 * 1. 徹底消除單行多 Bubble 擁擠排版，重構為標準「兩層式、有分類」之頂級選單：
 *    - Tier 1（第一層 · 主學系分類）：5 大學系分類按鈕（陰陽數字 / 東方命理 / 蒼穹星象 / 神聖卜筮 / 能量脈輪）
 *    - Tier 2（第二層 · 子項目排盤工具）：即時呈現選中學系之專屬排盤系統，帶有精緻標籤與當前頁面高亮
 * 2. 支援即時點擊/懸停切換分類（零刷新切換 Tier 2 工具），兼具手機端滑動與桌機端尊榮互動
 * 3. 完美兼容 iframe 模式與獨立訪問模式，全站色彩對齊癒見幸福奢華墨綠香檳金品牌語言
 */

(function () {
  'use strict';

  const DEPARTMENTS = [
    {
      id: 'dept-num',
      name: '🧬 陰陽數字',
      fullName: '陰陽數字人類學系',
      icon: '🧬',
      systems: [
        { name: '數字能量', url: '/numerology.html', tag: '雙盤' },
        { name: '人類圖', url: '/human-design.html', tag: '水晶' },
        { name: '撲克命牌', url: '/destiny-cards.html', tag: '命書' }
      ]
    },
    {
      id: 'dept-east',
      name: '⛩️ 東方命理',
      fullName: '東方時空命理學系',
      icon: '⛩️',
      systems: [
        { name: '紫微斗數', url: '/ziwei.html', tag: '十二宮' },
        { name: '四盤小六壬', url: '/xiao-liu-ren.html', tag: '時空' },
        { name: '文王六爻', url: '/liu-yao.html', tag: '卦象' }
      ]
    },
    {
      id: 'dept-astro',
      name: '🏛️ 蒼穹星象',
      fullName: '蒼穹星象天命學系',
      icon: '🏛️',
      systems: [
        { name: '西洋占星', url: '/astrology.html', tag: '星盤' }
      ]
    },
    {
      id: 'dept-divine',
      name: '🔮 神聖卜筮',
      fullName: '神秘神聖卜筮學系',
      icon: '🔮',
      systems: [
        { name: '西洋地占', url: '/geomancy.html', tag: '大地' },
        { name: '基因天命', url: '/gene-keys.html', tag: '全息' }
      ]
    },
    {
      id: 'dept-chakra',
      name: '🧪 能量脈輪',
      fullName: '能量鍊金脈輪學系',
      icon: '🧪',
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

  function findDepartmentByPath(path) {
    for (let i = 0; i < DEPARTMENTS.length; i++) {
      const dept = DEPARTMENTS[i];
      if (dept.systems.some(s => s.url === path || path.endsWith(s.url))) {
        return dept;
      }
    }
    return DEPARTMENTS[0];
  }

  // 注入全域獨立 CSS 樣式，保證排版 100% 獨立純淨不依賴外部框架
  function injectNavStyles() {
    if (document.getElementById('mj_unified_nav_styles')) return;

    const style = document.createElement('style');
    style.id = 'mj_unified_nav_styles';
    style.textContent = `
      #mj_unified_global_header {
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Serif TC", serif, sans-serif;
        box-shadow: 0 6px 20px rgba(0,0,0,0.28);
        border-bottom: 1px solid rgba(200, 169, 126, 0.4);
        user-select: none;
        background: #182622;
      }

      /* 頂層品牌列 */
      #mj_unified_top_bar {
        width: 100%;
        background: linear-gradient(90deg, #131916 0%, #182622 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 8px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
      }

      /* Tier 1: 第一層 · 主學系分類列 */
      .mj-tier1-bar {
        width: 100%;
        background: #182622;
        border-bottom: 1px solid rgba(200, 169, 126, 0.3);
        padding: 6px 12px;
        box-sizing: border-box;
      }
      .mj-tier1-inner {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .mj-tier1-inner::-webkit-scrollbar {
        display: none;
      }

      /* 返回大典按鈕 */
      .mj-hub-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 13px;
        border-radius: 20px;
        background: linear-gradient(135deg, #C8A97E 0%, #dfc298 100%);
        color: #182622 !important;
        font-weight: 800;
        font-size: 12px;
        text-decoration: none;
        white-space: nowrap;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        transition: all 0.2s ease;
      }
      .mj-hub-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(200, 169, 126, 0.4);
      }

      /* 分類 Tab 群組 */
      .mj-dept-tabs {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .mj-dept-tab {
        appearance: none;
        border: 1px solid rgba(200, 169, 126, 0.25);
        background: rgba(255, 255, 255, 0.05);
        color: #EADFC7;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .mj-dept-tab:hover {
        background: rgba(200, 169, 126, 0.18);
        color: #ffffff;
        border-color: rgba(200, 169, 126, 0.5);
      }
      .mj-dept-tab.active {
        background: #C8A97E;
        color: #182622;
        border-color: #C8A97E;
        font-weight: 900;
        box-shadow: 0 2px 8px rgba(200, 169, 126, 0.35);
        transform: translateY(-0.5px);
      }

      /* Tier 2: 第二層 · 子項目排盤工具列 */
      .mj-tier2-bar {
        width: 100%;
        background: #0f1612;
        border-bottom: 1px solid rgba(200, 169, 126, 0.22);
        padding: 6px 12px;
        box-sizing: border-box;
      }
      .mj-tier2-inner {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 10px;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .mj-tier2-inner::-webkit-scrollbar {
        display: none;
      }

      /* 第二層學系標籤指示器 */
      .mj-tier2-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: rgba(200, 169, 126, 0.12);
        border: 1px solid rgba(200, 169, 126, 0.3);
        border-radius: 6px;
        color: #C8A97E;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        flex-shrink: 0;
        letter-spacing: 0.5px;
      }

      /* 排盤系統列表 */
      .mj-systems-list {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        transition: opacity 0.18s ease;
      }
      .mj-sys-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #F7E7CE;
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        transition: all 0.15s ease;
      }
      .mj-sys-pill:hover {
        background: rgba(200, 169, 126, 0.25);
        color: #ffffff;
        border-color: #C8A97E;
        transform: translateY(-1px);
      }
      .mj-sys-pill.current-page {
        background: #C8A97E;
        color: #182622 !important;
        font-weight: 900;
        border-color: #C8A97E;
        box-shadow: 0 2px 8px rgba(200, 169, 126, 0.3);
      }
      .mj-sys-tag {
        font-size: 9.5px;
        padding: 1px 5px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.25);
        color: inherit;
        opacity: 0.85;
      }
      .mj-sys-pill.current-page .mj-sys-tag {
        background: rgba(24, 38, 34, 0.2);
      }

      @media (max-width: 640px) {
        .mj-tier1-bar {
          padding: 5px 8px;
        }
        .mj-dept-tab {
          padding: 5px 10px;
          font-size: 11.5px;
        }
        .mj-tier2-bar {
          padding: 5px 8px;
        }
        .mj-sys-pill {
          padding: 3px 9px;
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderUnifiedNav() {
    injectNavStyles();

    const current = getCurrentPath();
    const isHome = (current === '/' || current === '/index.html' || current === '');
    const isInIframe = (window.self !== window.top) || document.documentElement.classList.contains('in-iframe');

    // 核心防呆：當被 iframe 嵌入時（例如 meetjoy.net/app/），且處於首頁 index.html
    // 外層 WordPress 頁面已自帶頂級品牌標題列，且首頁本身已滿版呈現各大排盤卡片，絕不重複渲染內部導覽列！
    if (isInIframe && isHome) {
      const existingHeader = document.getElementById('mj_unified_global_header');
      if (existingHeader) existingHeader.remove();
      const rawNav = document.querySelector('nav.mj-global-nav') || document.querySelector('nav');
      if (rawNav) rawNav.style.display = 'none';
      return;
    }

    // 建立外層導覽容器
    const nav = document.createElement('header');
    nav.id = 'mj_unified_global_header';

    // 第 0 層：官方 Logo、大典標題、外部捷徑（若在 iframe 內則自動隱藏，避免與外層導覽列重複）
    const topBarHtml = isInIframe ? '' : `
      <div id="mj_unified_top_bar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- 官方 Logo (回官網 meetjoy.net) -->
          <a href="https://meetjoy.net/" title="返回癒見幸福官方首頁" style="display: block; text-decoration: none;">
            <img src="https://meetjoy.net/wp-content/uploads/2026/09/meetjoy-official-logo.png" alt="癒見幸福官方 Logo" style="width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #C8A97E; background: #ffffff; object-fit: cover; display: block;">
          </a>
          <!-- 大典標題 (回排盤首頁 app.meetjoy.net) -->
          <a href="https://app.meetjoy.net/" title="返回排盤大典首頁" style="font-weight: 900; font-size: 15px; color: #F7E7CE; text-decoration: none; display: flex; align-items: center; gap: 5px;">
            <span>🔮 癒見幸福 · 魔法神算</span>
          </a>
          <span style="font-size: 11px; color: rgba(254, 243, 199, 0.5); display: inline-block;">| 魔法占星學院 · 愛倫院長排盤實驗室</span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: bold;">
          <a href="https://app.meetjoy.net/" style="padding: 5px 10px; border-radius: 8px; color: #F7E7CE; text-decoration: none; background: rgba(255,255,255,0.08);">
            🌟 排盤總覽
          </a>
          <a href="https://meetjoy.net/calendar/" target="_blank" style="padding: 5px 10px; border-radius: 8px; color: #F7E7CE; text-decoration: none; background: rgba(255,255,255,0.08);">
            📅 月行事曆 ↗
          </a>
          <a href="https://meetjoy.net/" target="_blank" style="padding: 5px 10px; border-radius: 8px; color: #F7E7CE; text-decoration: none; background: rgba(255,255,255,0.08);">
            🏠 官網 ↗
          </a>
          <a href="https://meetjoy.net/booking/" target="_blank" style="padding: 5px 12px; border-radius: 8px; background: #C8A97E; color: #182622 !important; text-decoration: none;">
            🗓️ 預約諮詢 ↗
          </a>
          <a href="https://line.me/R/ti/p/@548valkv" target="_blank" style="padding: 5px 12px; border-radius: 8px; background: #06C755; color: #ffffff; text-decoration: none;">
            LINE
          </a>
        </div>
      </div>
    `;

    // 若在獨立訪問的首頁（standalone isHome），第 0 層已具備完整功能，兩層式選單在內頁才展開
    let twoTierBarHtml = '';

    if (!isHome) {
      const activeDept = findDepartmentByPath(current);

      // 生成 Tier 1 分類按鈕
      const deptTabsHtml = DEPARTMENTS.map(dept => {
        const isActive = dept.id === activeDept.id;
        return `
          <button type="button" class="mj-dept-tab ${isActive ? 'active' : ''}" data-dept-id="${dept.id}" title="${dept.fullName}">
            <span>${dept.name}</span>
          </button>
        `;
      }).join('');

      // 生成 Tier 2 初始系統子項目
      function generateSystemsHtml(dept) {
        const sysLinks = dept.systems.map(s => {
          const isCurrent = (s.url === current || current.endsWith(s.url));
          return `
            <a href="${s.url}" class="mj-sys-pill ${isCurrent ? 'current-page' : ''}" title="${s.name}">
              <span>${s.name}</span>
              <span class="mj-sys-tag">${s.tag}</span>
            </a>
          `;
        }).join('');

        return `
          <div class="mj-tier2-badge">
            <span>${dept.icon}</span>
            <span>${dept.fullName}</span>
          </div>
          <div class="mj-systems-list">
            ${sysLinks}
          </div>
        `;
      }

      twoTierBarHtml = `
        <!-- Tier 1: 第一層 · 主學系分類列 -->
        <div id="mj_unified_tier1_bar" class="mj-tier1-bar">
          <div class="mj-tier1-inner">
            <a href="/index.html" class="mj-hub-btn" title="返回排盤大典總覽">
              <span>← 🌟 返回排盤大典</span>
            </a>
            <div class="mj-dept-tabs" role="tablist">
              ${deptTabsHtml}
            </div>
          </div>
        </div>

        <!-- Tier 2: 第二層 · 該分類下的排盤子項目列 -->
        <div id="mj_unified_tier2_bar" class="mj-tier2-bar">
          <div class="mj-tier2-inner" id="mj_tier2_container">
            ${generateSystemsHtml(activeDept)}
          </div>
        </div>
      `;
    }

    nav.innerHTML = topBarHtml + twoTierBarHtml;

    // 替換既有導覽列
    const existingNav = document.querySelector('nav.mj-global-nav') || 
                        document.querySelector('nav') || 
                        document.getElementById('mj_unified_global_header');

    if (existingNav) {
      existingNav.parentNode.replaceChild(nav, existingNav);
    } else {
      document.body.insertAdjacentElement('afterbegin', nav);
    }

    // 綁定 Tier 1 點擊切換事件
    if (!isHome) {
      const tabs = nav.querySelectorAll('.mj-dept-tab');
      const tier2Container = nav.querySelector('#mj_tier2_container');

      tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
          e.preventDefault();
          const targetDeptId = this.getAttribute('data-dept-id');
          const targetDept = DEPARTMENTS.find(d => d.id === targetDeptId);
          if (!targetDept || !tier2Container) return;

          // 更新 Tier 1 active 狀態
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          // 動畫切換 Tier 2 內容
          tier2Container.style.opacity = '0.3';
          setTimeout(() => {
            const sysLinks = targetDept.systems.map(s => {
              const isCurrent = (s.url === current || current.endsWith(s.url));
              return `
                <a href="${s.url}" class="mj-sys-pill ${isCurrent ? 'current-page' : ''}" title="${s.name}">
                  <span>${s.name}</span>
                  <span class="mj-sys-tag">${s.tag}</span>
                </a>
              `;
            }).join('');

            tier2Container.innerHTML = `
              <div class="mj-tier2-badge">
                <span>${targetDept.icon}</span>
                <span>${targetDept.fullName}</span>
              </div>
              <div class="mj-systems-list">
                ${sysLinks}
              </div>
            `;
            tier2Container.style.opacity = '1';
          }, 120);
        });
      });
    }
  }

  // DOM 載入時自動初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderUnifiedNav);
  } else {
    renderUnifiedNav();
  }

  window.MeetJoyUnifiedNav = {
    render: renderUnifiedNav,
    departments: DEPARTMENTS
  };
})();
