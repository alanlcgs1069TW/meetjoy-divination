import re

html_content = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>癒見幸福 · 線上占卜大典 (塔羅牌 · 紫微牌卡 · 雷諾曼卡 · 浮世繪和風神諭)</title>
  
  <!-- 品牌標籤與字體 -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Noto+Serif+TC:wght@400;600;700;900&display=swap" rel="stylesheet">
  
  <!-- 卡牌資料庫與全站導航 -->
  <script src="./js/ziwei-cards-complete.js"></script>
  <script src="./js/divination-cards.js"></script>
  <script src="./js/meetjoy-nav.js"></script>

  <style>
    body { font-family: 'Noto Serif TC', serif; }
    .font-cinzel { font-family: 'Cinzel', serif; }
    
    /* 3D 卡牌翻轉容器 */
    .card-scene {
      perspective: 1200px;
    }
    .card-inner {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .card-inner.flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25);
    }
    .card-back {
      background: radial-gradient(circle at 50% 50%, #1e293b, #090d16);
      border: 2px solid #c8a97e;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .card-back::after {
      content: '';
      position: absolute;
      inset: 6px;
      border: 1px dashed rgba(200, 169, 126, 0.4);
      border-radius: 10px;
      pointer-events: none;
    }
    .card-front {
      background: #ffffff;
      transform: rotateY(180deg);
      border: 2px solid #c8a97e;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
    }
    .card-reversed {
      transform: rotate(180deg);
    }

    /* 浮世繪木版畫風格 (Ukiyo-e Edition) */
    .theme-ukiyoe .card-front {
      background: #FAF6ED;
      border: 3px double #8C2D19;
      box-shadow: 0 12px 28px -6px rgba(140, 45, 25, 0.25);
    }
    .theme-ukiyoe .card-back {
      background: radial-gradient(circle at 50% 50%, #1E3A5F, #0D1B2A);
      border: 3px double #C8A97E;
    }
    .hanko-stamp {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: 2px solid #b91c1c;
      color: #b91c1c;
      font-size: 11px;
      font-weight: 900;
      border-radius: 4px;
      background: #fff1f2;
      transform: rotate(-4deg);
      box-shadow: 0 1px 2px rgba(185, 28, 28, 0.2);
    }

    /* 洗牌動畫 */
    @keyframes shuffleDeck {
      0% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-15px) rotate(-4deg) translateX(-10px); }
      50% { transform: translateY(10px) rotate(4deg) translateX(10px); }
      75% { transform: translateY(-5px) rotate(-2deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
    .shuffling {
      animation: shuffleDeck 0.6s ease-in-out infinite;
    }

    /* 凱爾特十字專屬排版 */
    .celtic-cross-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      align-items: center;
      max-width: 960px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .celtic-cross-container {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body class="bg-[#F6F2EA] text-[#2E3829] min-h-screen flex flex-col items-center p-0 m-0 theme-ukiyoe" id="main_body">

  <!-- 全站通用頂部導航 -->
  <header id="meetjoy_nav_container" class="w-full sticky top-0 z-50 shadow-md"></header>

  <!-- 主體容器 -->
  <main class="w-full max-w-6xl px-3 sm:px-6 py-6 sm:py-8 flex flex-col items-center flex-1">
    
    <!-- 標題橫幅 -->
    <div class="w-full text-center mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E3829] text-amber-200 text-xs font-bold mb-2 shadow-xs">
        <span>✨ 癒見幸福 · 魔法占星學院</span>
        <span class="opacity-40">|</span>
        <span>心靈牌卡調頻大典</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-black text-[#1F261C] mb-2 tracking-wide font-cinzel">
        線上占卜大典
      </h1>
      <p class="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
        沉澱思緒，連結當下直覺。結合經典偉特塔羅牌、紫微斗數全套星曜實體牌卡、與歐洲經典雷諾曼卡，融入江戶浮世繪日式古典意象，為你指引日常迷津、調配專屬能量處方。
      </p>
    </div>

    <!-- 三大占卜系統主切換 Tabs -->
    <div class="w-full max-w-2xl flex items-center p-1.5 bg-stone-200/90 rounded-2xl mb-6 shadow-inner border border-stone-300">
      <button type="button" id="tab_tarot" class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition bg-[#2E3829] text-amber-100 shadow-md">
        🌟 經典塔羅 (78張)
      </button>
      <button type="button" id="tab_ziwei" class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition hover:bg-white/60 text-stone-700">
        🔮 紫微牌卡 (70張全套)
      </button>
      <button type="button" id="tab_lenormand" class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition hover:bg-white/60 text-stone-700">
        🌿 經典雷諾曼 (36張)
      </button>
    </div>

    <!-- 操作控制面板 (牌陣選擇、風格切換與洗牌抽牌) -->
    <div class="w-full bg-white/95 backdrop-blur-md border-2 border-[#C8A97E]/70 rounded-3xl p-4 sm:p-6 mb-6 shadow-md">
      <div class="flex flex-wrap items-center justify-between gap-4">
        
        <!-- 牌陣選擇器 -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-stone-700 whitespace-nowrap">選擇牌陣：</label>
          <select id="spread_select" class="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-black text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]">
            <!-- 動態注入選項 -->
          </select>
        </div>

        <!-- 風格切換與動作按鈕組 -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- 浮世繪風格開關 -->
          <button type="button" id="btn_toggle_theme" class="px-3 py-2 rounded-xl text-xs font-black border transition bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 shadow-2xs">
            <span>🌊 浮世繪木版畫風格</span>
          </button>

          <button type="button" id="btn_shuffle" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-black border border-stone-300 transition flex items-center gap-1.5 shadow-xs">
            <span>🌀 靜心洗牌</span>
          </button>
          <button type="button" id="btn_draw_all" class="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md">
            <span>✨ 一鍵全部翻開</span>
          </button>
        </div>

      </div>

      <!-- 提示說明 -->
      <div class="mt-3 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 font-bold">
        <span id="spread_hint">💡 心中默念你的問題或想洞悉的領域，點擊下方卡牌進行翻牌。</span>
        <span class="text-amber-800" id="spread_badge_tip">支援逐張點擊翻牌 ➔</span>
      </div>
    </div>

    <!-- 卡牌抽牌舞台 (Card Spread Stage) -->
    <div id="card_stage" class="w-full mb-8">
      <!-- 動態排開卡牌網格 -->
    </div>

    <!-- 解讀展示面板 (Interpretation Result Panel) -->
    <div id="result_panel" class="w-full bg-white rounded-3xl border-2 border-stone-800 shadow-xl p-5 sm:p-8 hidden">
      <div class="flex items-center justify-between pb-3 mb-5 border-b-2 border-stone-800">
        <div class="flex items-center gap-2">
          <span class="text-xl">📜</span>
          <h2 class="text-xl sm:text-2xl font-black text-stone-900" id="result_title">占卜解讀報告</h2>
        </div>
        <button type="button" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="text-xs text-stone-500 hover:text-amber-700 font-bold">
          ↑ 回頂部重新抽牌
        </button>
      </div>

      <!-- 個別卡牌解讀列表 -->
      <div id="cards_interpretation_list" class="space-y-4 mb-6">
        <!-- 動態注入各牌解析 -->
      </div>

      <!-- 愛倫院長整體魔法魔藥建言 -->
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-stone-50 to-white border border-amber-300/80 shadow-2xs space-y-2">
        <div class="flex items-center gap-2 text-xs font-black text-amber-950">
          <span>🧪 愛倫院長生活魔藥調頻指引</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">整體綜合透視</span>
        </div>
        <p id="spread_overall_potion" class="text-xs sm:text-sm text-stone-700 leading-relaxed font-bold pt-1">
          點擊上方卡牌翻開後，此處將自動整合當前能量流向，提供專屬的植物香氣、晶石頻率與日常落地微儀式。
        </p>
      </div>
    </div>

  </main>

  <!-- 底部版權 -->
  <footer class="w-full py-6 text-center text-xs text-stone-500 font-bold border-t border-stone-200 bg-white/50">
    <p>© 2026 癒見幸福療身心靈推廣中心 · 魔法占星學院 · 愛倫院長精神導師</p>
  </footer>

  <!-- 占卜主控制器程式 -->
  <script>
    (function () {
      'use strict';

      let currentSystem = 'tarot'; // 'tarot' | 'ziwei' | 'lenormand'
      let currentSpreadKey = 'timeline';
      let isUkiyoeTheme = true;
      let drawnCards = [];
      let isShuffling = false;

      // 牌陣完整設定 (符合用戶所有要求)
      const SPREADS = {
        tarot: [
          { key: 'timeline', name: '⏳ 時間之流牌陣 (過去 · 現在 · 未來)', count: 3, labels: ['1. 源頭過去', '2. 當前核心', '3. 潛在走向'], layout: 'grid' },
          { key: 'celtic_cross', name: '✝️ 凱爾特十字牌陣 (十張全方位透視大牌陣)', count: 10, labels: [
            '1. 當前現狀核心', '2. 交叉挑戰阻礙', '3. 潛意識深層根基', '4. 近期過去源頭',
            '5. 顯意識目標理想', '6. 近期發展趨勢', '7. 自身態度力量', '8. 外在環境他人',
            '9. 內在希望恐懼', '10. 最終神諭結果'
          ], layout: 'celtic' },
          { key: 'single', name: '🎯 單張指引 (今日靈感與即刻處方)', count: 1, labels: ['當前核心指引'], layout: 'grid' },
          { key: 'triangle', name: '🔺 聖三角抉擇 (核心 · 障礙 · 破局)', count: 3, labels: ['核心實況', '阻礙挑戰', '破局建言'], layout: 'grid' }
        ],
        ziwei: [
          { key: 'three_decks', name: '🌟 三組牌各一張牌陣 (主星 + 輔星 + 長生星 · 講義正統)', count: 3, labels: ['1. 主星牌 (核心運勢)', '2. 輔星牌 (外部助力/催化)', '3. 長生牌 (氣數旺衰/時間預測)'], layout: 'three_decks' },
          { key: 'san_fang_si_zheng', name: '🏛️ 三方四正牌陣 (命宮 · 遷移 · 官祿 · 財帛)', count: 4, labels: ['命宮 (自處心態)', '遷移宮 (外在人際)', '官祿宮 (事業工作)', '財帛宮 (資產金流)'], layout: 'san_fang' },
          { key: 'twelve_palaces', name: '🌌 十二宮全方位大牌陣 (十二人生大局輪盤)', count: 12, labels: [
            '1. 命宮', '2. 兄弟宮', '3. 夫妻宮', '4. 子女宮', '5. 財帛宮', '6. 疾厄宮',
            '7. 遷移宮', '8. 僕役宮', '9. 官祿宮', '10. 田宅宮', '11. 福德宮', '12. 父母宮'
          ], layout: 'twelve' }
        ],
        lenormand: [
          { key: 'three_cards', name: '🌿 三張牌牌陣 (起因 ➔ 現況 ➔ 走向)', count: 3, labels: ['1. 起因源頭', '2. 當前關鍵', '3. 發展走向'], layout: 'grid' },
          { key: 'five_cards', name: '✨ 五張牌牌陣 (過去 ➔ 影響 ➔ 核心 ➔ 考驗 ➔ 結果)', count: 5, labels: ['1. 過去背景', '2. 外部影響', '3. 核心焦點', '4. 課題考驗', '5. 最終趨勢'], layout: 'grid' },
          { key: 'nine_box', name: '🎴 九張牌九宮格牌陣 (3x3 Box Spread · 大局透視)', count: 9, labels: [
            '1. 過去思想', '2. 當前核心環境', '3. 未來指引',
            '4. 過去感受', '5. 當前關鍵命門', '6. 未來走向',
            '7. 過去行動', '8. 當前外在阻力', '9. 最終啟示'
          ], layout: 'nine_box' },
          { key: 'single', name: '🌱 單張日運指引 (日常核心微事件)', count: 1, labels: ['今日核心象徵'], layout: 'grid' }
        ]
      };

      // 初始化頁面
      function init() {
        setupSystemTabs();
        setupSpreadOptions();
        setupActions();
        resetAndDraw();
      }

      // 切換系統 Tabs
      function setupSystemTabs() {
        const tabs = [
          { id: 'tab_tarot', key: 'tarot' },
          { id: 'tab_ziwei', key: 'ziwei' },
          { id: 'tab_lenormand', key: 'lenormand' }
        ];

        tabs.forEach(t => {
          const btn = document.getElementById(t.id);
          if (!btn) return;
          btn.addEventListener('click', () => {
            currentSystem = t.key;
            tabs.forEach(o => {
              const b = document.getElementById(o.id);
              if (o.key === currentSystem) {
                b.className = 'flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition bg-[#2E3829] text-amber-100 shadow-md';
              } else {
                b.className = 'flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition hover:bg-white/60 text-stone-700';
              }
            });
            setupSpreadOptions();
            resetAndDraw();
          });
        });
      }

      // 更新牌陣下拉選單
      function setupSpreadOptions() {
        const select = document.getElementById('spread_select');
        if (!select) return;
        const list = SPREADS[currentSystem] || [];
        select.innerHTML = list.map(s => `<option value="${s.key}">${s.name}</option>`).join('');
        currentSpreadKey = list[0]?.key || 'timeline';

        select.onchange = (e) => {
          currentSpreadKey = e.target.value;
          resetAndDraw();
        };
      }

      // 取得目前牌陣設定
      function getCurrentSpread() {
        const list = SPREADS[currentSystem] || [];
        return list.find(s => s.key === currentSpreadKey) || list[0];
      }

      // 洗牌抽牌主流程
      function resetAndDraw() {
        const spread = getCurrentSpread();
        drawnCards = [];

        if (currentSystem === 'ziwei') {
          // 紫微牌卡分組抽取邏輯 (支援三組牌各一張)
          const zwDb = window.MeetJoyZiweiCards;
          if (spread.key === 'three_decks' && zwDb) {
            // 第1張抽主星牌 (39組)
            const majorList = [...zwDb.getGroup('major')].sort(() => Math.random() - 0.5);
            const mCard = majorList[0];
            const mRev = Math.random() > 0.5;

            // 第2張抽輔星牌 (19組)
            const assistList = [...zwDb.getGroup('assistant')].sort(() => Math.random() - 0.5);
            const aCard = assistList[0];
            const aRev = Math.random() > 0.5;

            // 第3張抽長生牌 (12組)
            const lifeList = [...zwDb.getGroup('life')].sort(() => Math.random() - 0.5);
            const lCard = lifeList[0];
            const lRev = Math.random() > 0.5;

            drawnCards = [
              { card: mCard, positionLabel: spread.labels[0], isReversed: mRev, isFlipped: false, cardType: 'major' },
              { card: aCard, positionLabel: spread.labels[1], isReversed: aRev, isFlipped: false, cardType: 'assistant' },
              { card: lCard, positionLabel: spread.labels[2], isReversed: lRev, isFlipped: false, cardType: 'life' }
            ];
          } else if (zwDb) {
            // 三方四正 (4張) 或 十二宮 (12張)
            const pool = [...zwDb.cards].sort(() => Math.random() - 0.5);
            for (let i = 0; i < spread.count; i++) {
              const c = pool[i % pool.length];
              drawnCards.push({
                card: c,
                positionLabel: spread.labels[i],
                isReversed: Math.random() > 0.5,
                isFlipped: false,
                cardType: c.group
              });
            }
          }
        } else {
          // 塔羅或雷諾曼
          const db = window.MeetJoyDivination || {};
          let deck = (currentSystem === 'tarot') ? [...(db.TAROT_CARDS || [])] : [...(db.LENORMAND_CARDS || [])];
          deck.sort(() => Math.random() - 0.5);

          for (let i = 0; i < spread.count; i++) {
            const c = deck[i % deck.length];
            const isRev = (currentSystem === 'tarot') ? (Math.random() > 0.5) : false;
            drawnCards.push({
              card: c,
              positionLabel: spread.labels[i] || `位置 ${i + 1}`,
              isReversed: isRev,
              isFlipped: false
            });
          }
        }

        renderStage();
        document.getElementById('result_panel').classList.add('hidden');
      }

      // 渲染舞台卡牌
      function renderStage() {
        const stage = document.getElementById('card_stage');
        if (!stage) return;

        const spread = getCurrentSpread();
        const layout = spread.layout || 'grid';

        if (layout === 'celtic') {
          // 凱爾特十字專屬排版
          stage.innerHTML = renderCelticCrossLayout();
        } else if (layout === 'nine_box') {
          // 九宮格 3x3 排版
          stage.innerHTML = renderNineBoxLayout();
        } else if (layout === 'twelve') {
          // 十二宮網格排版
          stage.innerHTML = renderTwelvePalacesLayout();
        } else {
          // 標準網格排版 (1, 3, 4, 5 張)
          stage.innerHTML = renderStandardGridLayout();
        }
      }

      // 標準網格
      function renderStandardGridLayout() {
        const count = drawnCards.length;
        let gridCols = 'grid-cols-1 max-w-xs mx-auto';
        if (count === 3) gridCols = 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto';
        if (count === 4) gridCols = 'grid-cols-2 sm:grid-cols-4 max-w-5xl mx-auto';
        if (count === 5) gridCols = 'grid-cols-2 sm:grid-cols-5 max-w-5xl mx-auto';

        return `
          <div class="grid ${gridCols} gap-4 sm:gap-6">
            ${drawnCards.map((item, idx) => renderCardHtml(item, idx)).join('')}
          </div>
        `;
      }

      // 九宮格 3x3
      function renderNineBoxLayout() {
        return `
          <div class="max-w-4xl mx-auto space-y-2">
            <div class="text-center text-xs font-bold text-stone-500 mb-2">
              🎴 雷諾曼九宮格大局（橫列：過去 · 現在 · 未來 ｜ 直欄：思想 · 核心 · 走向）
            </div>
            <div class="grid grid-cols-3 gap-3 sm:gap-4">
              ${drawnCards.map((item, idx) => renderCardHtml(item, idx, 'sm')).join('')}
            </div>
          </div>
        `;
      }

      // 十二宮排版
      function renderTwelvePalacesLayout() {
        return `
          <div class="max-w-5xl mx-auto space-y-2">
            <div class="text-center text-xs font-bold text-stone-500 mb-2">
              🌌 紫微斗數十二宮命運大牌陣（點擊各宮卡牌逐張翻開，全面透視人生十二領域）
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              ${drawnCards.map((item, idx) => renderCardHtml(item, idx, 'xs')).join('')}
            </div>
          </div>
        `;
      }

      // 凱爾特十字排版
      function renderCelticCrossLayout() {
        return `
          <div class="celtic-cross-container">
            <!-- 左側十字圈 (6張) -->
            <div class="p-4 bg-white/80 rounded-2xl border border-stone-200 shadow-xs">
              <div class="text-center text-xs font-black text-stone-700 mb-3">✝️ 核心十字神殿 (位置 1 ~ 6)</div>
              <div class="grid grid-cols-3 gap-2.5">
                <div class="flex items-center justify-center"></div>
                <div>${renderCardHtml(drawnCards[4], 4, 'xs')}</div> <!-- 5. 顯意識 -->
                <div class="flex items-center justify-center"></div>

                <div>${renderCardHtml(drawnCards[3], 3, 'xs')}</div> <!-- 4. 過去 -->
                <div class="relative">
                  ${renderCardHtml(drawnCards[0], 0, 'xs')} <!-- 1. 現狀 -->
                  <div class="mt-2">${renderCardHtml(drawnCards[1], 1, 'xs')}</div> <!-- 2. 挑戰 -->
                </div>
                <div>${renderCardHtml(drawnCards[5], 5, 'xs')}</div> <!-- 6. 未來 -->

                <div class="flex items-center justify-center"></div>
                <div>${renderCardHtml(drawnCards[2], 2, 'xs')}</div> <!-- 3. 潛意識 -->
                <div class="flex items-center justify-center"></div>
              </div>
            </div>

            <!-- 右側權杖柱 (4張：7 ~ 10) -->
            <div class="p-4 bg-white/80 rounded-2xl border border-stone-200 shadow-xs flex flex-col gap-2.5">
              <div class="text-center text-xs font-black text-stone-700 mb-1">🏛️ 靈魂權杖之階 (7 ~ 10)</div>
              ${renderCardHtml(drawnCards[9], 9, 'xs')} <!-- 10. 結果 -->
              ${renderCardHtml(drawnCards[8], 8, 'xs')} <!-- 9. 希望/恐懼 -->
              ${renderCardHtml(drawnCards[7], 7, 'xs')} <!-- 8. 外在環境 -->
              ${renderCardHtml(drawnCards[6], 6, 'xs')} <!-- 7. 自身態度 -->
            </div>
          </div>
        `;
      }

      // 單張卡牌 HTML 產生器
      function renderCardHtml(item, idx, size = 'md') {
        if (!item) return '';
        const c = item.card;
        const isZiwei = (currentSystem === 'ziwei');
        const hasImg = isZiwei && c.image;

        let wCls = 'w-48 sm:w-52 h-72 sm:h-80';
        if (size === 'sm') wCls = 'w-full h-56 sm:h-64';
        if (size === 'xs') wCls = 'w-full h-48 sm:h-52';

        return `
          <div class="flex flex-col items-center">
            <span class="text-[11px] font-black text-stone-700 mb-1.5 px-2.5 py-0.5 rounded-full bg-stone-200/90 whitespace-nowrap shadow-2xs">
              ${item.positionLabel}
            </span>
            
            <div class="card-scene ${wCls} cursor-pointer" onclick="flipCard(${idx})">
              <div class="card-inner ${item.isFlipped ? 'flipped' : ''}" id="card_inner_${idx}">
                
                <!-- 卡背 -->
                <div class="card-face card-back group hover:border-amber-400 transition" style="${hasImg && c.backImage ? `background-image: url('${c.backImage}'); background-size: cover; background-position: center;` : ''}">
                  ${!(hasImg && c.backImage) ? `
                    <div class="w-12 h-12 rounded-full border border-amber-300/40 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                      <span class="text-xl text-amber-200">✦</span>
                    </div>
                    <span class="text-[11px] font-black text-amber-100 font-cinzel tracking-wider">MEETJOY</span>
                    <span class="text-[9px] text-amber-200/70 mt-0.5">點擊翻開</span>
                  ` : ''}
                </div>

                <!-- 卡面 -->
                <div class="card-face card-front ${item.isReversed ? 'card-reversed' : ''}">
                  
                  ${hasImg ? `
                    <!-- 實體紫微牌卡圖案展示 -->
                    <div class="w-full h-full rounded-xl overflow-hidden relative flex flex-col justify-between p-1 bg-stone-900">
                      <img src="${c.image}" alt="${c.name}" class="w-full h-full object-cover rounded-lg" onerror="this.style.display='none'">
                      <div class="absolute bottom-1 left-1 right-1 bg-black/75 backdrop-blur-xs rounded-md p-1 text-center text-white">
                        <span class="text-xs font-black block">${c.name}</span>
                        <span class="text-[9px] text-amber-300 font-bold">${item.isReversed ? '倒牌 逆位' : '正牌 正向'}</span>
                      </div>
                    </div>
                  ` : `
                    <!-- 塔羅與雷諾曼浮世繪風骨卡面 -->
                    <div class="flex items-center justify-between text-[11px] font-bold text-stone-500 border-b border-stone-200 pb-1">
                      <span class="text-[10px]">${currentSystem === 'lenormand' ? c.pips : (c.element || '星曜')}</span>
                      <div class="flex items-center gap-1">
                        <span class="hanko-stamp">${c.hanko || '浮世'}</span>
                        ${item.isReversed ? '<span class="px-1 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-black">逆位</span>' : '<span class="text-emerald-700 text-[9px] font-black">正位</span>'}
                      </div>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center text-center my-1">
                      <div class="text-3xl mb-1">${c.symbol || '🎴'}</div>
                      <h3 class="text-sm sm:text-base font-black text-stone-900 leading-tight">${c.name}</h3>
                      <span class="text-[10px] text-amber-800 font-bold mt-0.5">${c.ukiyoName || ''}</span>
                    </div>

                    <div class="text-[9px] text-stone-400 text-center pt-1 border-t border-stone-200/80">
                      癒見幸福 · 浮世神諭
                    </div>
                  `}

                </div>

              </div>
            </div>

          </div>
        `;
      }

      // 翻牌
      window.flipCard = function (idx) {
        if (!drawnCards[idx]) return;
        drawnCards[idx].isFlipped = true;
        const inner = document.getElementById(`card_inner_${idx}`);
        if (inner) inner.classList.add('flipped');

        // 檢查是否全部翻開
        const allFlipped = drawnCards.every(c => c.isFlipped);
        if (allFlipped) {
          setTimeout(renderInterpretation, 600);
        }
      };

      // 設置動作監聽
      function setupActions() {
        document.getElementById('btn_draw_all')?.addEventListener('click', () => {
          drawnCards.forEach((c, idx) => {
            c.isFlipped = true;
            const inner = document.getElementById(`card_inner_${idx}`);
            if (inner) inner.classList.add('flipped');
          });
          setTimeout(renderInterpretation, 600);
        });

        document.getElementById('btn_shuffle')?.addEventListener('click', () => {
          if (isShuffling) return;
          isShuffling = true;
          const stage = document.getElementById('card_stage');
          if (stage) stage.classList.add('shuffling');

          setTimeout(() => {
            if (stage) stage.classList.remove('shuffling');
            isShuffling = false;
            resetAndDraw();
          }, 600);
        });

        // 風格切換按鈕
        document.getElementById('btn_toggle_theme')?.addEventListener('click', () => {
          isUkiyoeTheme = !isUkiyoeTheme;
          document.getElementById('main_body')?.classList.toggle('theme-ukiyoe', isUkiyoeTheme);
          const btn = document.getElementById('btn_toggle_theme');
          if (btn) {
            btn.innerHTML = isUkiyoeTheme ? '<span>🌊 浮世繪木版畫風格</span>' : '<span>🔮 現代典雅風格</span>';
          }
        });
      }

      // 渲染詳細解讀結果
      function renderInterpretation() {
        const panel = document.getElementById('result_panel');
        const list = document.getElementById('cards_interpretation_list');
        const overallPotion = document.getElementById('spread_overall_potion');
        if (!panel || !list) return;

        list.innerHTML = drawnCards.map(item => {
          const c = item.card;
          const isRev = item.isReversed;
          let meaningText = '';
          let potionText = c.potion || '以沉穩深呼吸定錨當下，點燃自信與安然。';
          let dimsHtml = '';

          if (currentSystem === 'tarot') {
            meaningText = isRev ? c.reversed : c.upright;
          } else if (currentSystem === 'ziwei') {
            meaningText = isRev ? c.reversed : c.upright;
            if (c.dimensions) {
              const d = c.dimensions;
              dimsHtml = `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs border-t border-stone-200">
                  ${d.personality ? `<div class="p-2 rounded bg-white border border-stone-200"><b class="text-stone-800">【個性】：</b>${isRev ? d.personality.reversed : d.personality.upright}</div>` : ''}
                  ${d.career ? `<div class="p-2 rounded bg-white border border-stone-200"><b class="text-stone-800">【工作】：</b>${isRev ? d.career.reversed : d.career.upright}</div>` : ''}
                  ${d.love ? `<div class="p-2 rounded bg-white border border-stone-200"><b class="text-stone-800">【感情】：</b>${isRev ? d.love.reversed : d.love.upright}</div>` : ''}
                  ${d.wealth ? `<div class="p-2 rounded bg-white border border-stone-200"><b class="text-stone-800">【財運】：</b>${isRev ? d.wealth.reversed : d.wealth.upright}</div>` : ''}
                  ${d.timing ? `<div class="p-2 rounded bg-amber-50 border border-amber-200 col-span-2"><b class="text-amber-950">【時間與週期】：</b>${d.timing} (${d.energy})</div>` : ''}
                </div>
              `;
            }
          } else if (currentSystem === 'lenormand') {
            meaningText = c.desc;
          }

          return `
            <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-md bg-[#2E3829] text-amber-100 text-xs font-black">${item.positionLabel}</span>
                  <h3 class="text-base sm:text-lg font-black text-stone-900">${c.name}</h3>
                  ${c.ukiyoName ? `<span class="text-xs text-amber-800 font-bold bg-amber-100/70 px-2 py-0.5 rounded">${c.ukiyoName}</span>` : ''}
                </div>
                ${isRev ? '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black">倒牌 · 逆位思考</span>' : '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">正牌 · 順流引領</span>'}
              </div>

              <p class="text-xs sm:text-sm text-stone-700 leading-relaxed font-bold">
                ${meaningText}
              </p>

              ${dimsHtml}

              <div class="pt-2 border-t border-stone-200/80 flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                <span>🧪 愛倫生活魔藥調頻：</span>
                <span class="text-stone-600">${potionText}</span>
              </div>
            </div>
          `;
        }).join('');

        // 綜合魔藥建言
        if (currentSystem === 'tarot') {
          overallPotion.textContent = '今日能量提醒：保持彈性與接納，以浮世和風之澄澈心智覺察周遭訊息。推薦以真正薰衣草與甜橙精油擴香，佩戴白水晶，維持心輪敞開與能量場的純淨通透。';
        } else if (currentSystem === 'ziwei') {
          overallPotion.textContent = '紫微斗數星曜能量正引領著你的生活節奏。主星定核心方向，輔星明辨外在助阻，長生星照見時機氣數。順隨週期前行，必能化煞為權、富貴自足。';
        } else {
          overallPotion.textContent = '雷諾曼神諭符號傳遞出具體的行動指引：注重日常微小細節，落實具體溝通，將注意力放在可掌控的事物上，必然迎來明朗進展。';
        }

        panel.classList.remove('hidden');
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // 頁面加載完成時執行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

    })();
  </script>
</body>
</html>
"""

with open('100_Todo/projects/meetjoy-divination/divination.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Updated divination.html successfully!')
