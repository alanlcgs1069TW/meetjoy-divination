/**
 * 癒見幸福 · 魔法占星學院
 * 線上占卜大典「沉浸流動模式」 (Flowing Zen Mode Controller)
 * 參考 Stargazer's Oracle 核心流動設計：
 * 1. 心念聚焦 (Focus / Input)
 * 2. 散牌混洗 (Fluid Shuffle · 桌面散牌物理長按/滑動漩渦混洗 + 一鍵自動混洗)
 * 3. 拱弧展牌 (Card Fan Arc · 孔雀開屏扇形極座標展開與直覺抽牌)
 * 4. 3D 翻牌與生活魔藥解讀 (Reveal & Elixir Reading · 支援聖三角、時間之流、二擇一、三擇一、雷諾曼大藍圖等專屬佈局)
 * 完美相容 偉特塔羅 (78張) / 紫微斗數牌卡 (70張) / 雷諾曼 (36張)
 * 100% 繁體中文（台灣）· Zero Attribution
 */

(function (global) {
  'use strict';

  // 流動模式專屬牌陣定義 (與經典工坊模式 100% 同步)
  const FLOWING_SPREADS = {
    tarot: [
      { key: 'timeline', name: '⏳ 時間之流牌陣 (過去 · 現在 · 未來 · ☀️🌙⭐)', count: 3, labels: ['1. 源頭過去', '2. 當前核心', '3. 潛在走向'], layout: 'time_stream' },
      { key: 'triangle', name: '🔺 聖三角抉擇牌陣 (起因 · 核心 · 破局 · 正三角拱照)', count: 3, labels: ['1. 起因源頭', '2. 當前核心課題', '3. 破局建言'], layout: 'triangle' },
      { key: 'two_choices', name: '⚖️ 二擇一抉擇牌陣 (現況 ➔ 途徑A vs 途徑B · V字雙翼)', count: 5, labels: ['1. 當事人現況', '2. 選擇A當前狀況', '3. 選擇A未來發展', '4. 選擇B當前狀況', '5. 選擇B未來發展'], layout: 'two_choices' },
      { key: 'three_choices', name: '🔱 三擇一抉擇牌陣 (現況 · 阻礙 · 環境 ➔ A/B/C 三叉戟發展)', count: 9, labels: [
        '1. 當前現況', '2. 潛在阻礙', '3. 外在環境',
        '4. 選擇A狀況', '5. 選擇A之後發展',
        '6. 選擇B狀況', '7. 選擇B之後發展',
        '8. 選擇C狀況', '9. 選擇C之後發展'
      ], layout: 'three_choices' },
      { key: 'four_elements', name: '🔮 四要素平衡牌陣 (火 · 水 · 風 · 土 四方圓滿)', count: 4, labels: ['1. 行動意志 (火)', '2. 情緒感知 (水)', '3. 思維理智 (風)', '4. 物質落地 (土)'], layout: 'four_elements' },
      { key: 'celtic_cross', name: '✝️ 凱爾特十字牌陣 (十張全方位透視大牌陣)', count: 10, labels: [
        '1. 當前現狀核心', '2. 交叉挑戰阻礙', '3. 潛意識深層根基', '4. 近期過去源頭',
        '5. 顯意識目標理想', '6. 近期發展趨勢', '7. 自身態度力量', '8. 外在環境他人',
        '9. 內在希望恐懼', '10. 最終神諭結果'
      ], layout: 'celtic' },
      { key: 'single', name: '🎯 單張指引 (今日靈感與即刻處方)', count: 1, labels: ['當前核心指引'], layout: 'single' }
    ],
    ziwei: [
      { key: 'three_decks', name: '🌟 三組牌各一張牌陣 (主星 + 輔星 + 長生星 · 講義正統)', count: 3, labels: ['1. 主星牌 (核心運勢)', '2. 輔星牌 (外部助力/催化)', '3. 長生牌 (氣數旺衰/時間預測)'], layout: 'three_decks' },
      { key: 'san_fang_si_zheng', name: '🏛️ 三方四正牌陣 (命宮 · 遷移 · 官祿 · 財帛 雙星 + 十二長生)', count: 9, labels: [
        '命宮 · 主星 (自處心態)', '命宮 · 輔星 (自我催化)',
        '遷移宮 · 主星 (外在格局)', '遷移宮 · 輔星 (人際機遇)',
        '官祿宮 · 主星 (事業工作)', '官祿宮 · 輔星 (職場助力)',
        '財帛宮 · 主星 (金流資產)', '財帛宮 · 輔星 (進財管道)',
        '十二長生 · 氣數時輪'
      ], layout: 'san_fang' },
      { key: 'twelve_palaces', name: '🌌 十二宮全方位大牌陣 (十二宮各主輔雙星 + 天盤中庭身宮與長生)', count: 26, labels: [
        '命宮 · 主星', '命宮 · 輔星',
        '兄弟宮 · 主星', '兄弟宮 · 輔星',
        '夫妻宮 · 主星', '夫妻宮 · 輔星',
        '子女宮 · 主星', '子女宮 · 輔星',
        '財帛宮 · 主星', '財帛宮 · 輔星',
        '疾厄宮 · 主星', '疾厄宮 · 輔星',
        '遷移宮 · 主星', '遷移宮 · 輔星',
        '僕役宮 · 主星', '僕役宮 · 輔星',
        '官祿宮 · 主星', '官祿宮 · 輔星',
        '田宅宮 · 主星', '田宅宮 · 輔星',
        '福德宮 · 主星', '福德宮 · 輔星',
        '父母宮 · 主星', '父母宮 · 輔星',
        '天盤中庭 · 身宮 (行動意志)',
        '天盤中庭 · 十二長生 (氣數時序)'
      ], layout: 'twelve' }
    ],
    lenormand: [
      { key: 'three_cards', name: '📜 三張牌敘事牌陣 (過去 ➔ 當前 ➔ 未來 · 三張橫向)', count: 3, labels: ['1. 過去源起 (Past)', '2. 當前核心 (Present)', '3. 未來走向 (Future)'], layout: 'three_cards' },
      { key: 'five_cards', name: '✨ 五張牌線性牌陣 (背景 ➔ 影響 ➔ 核心 ➔ 考驗 ➔ 結果 · 五張橫向)', count: 5, labels: ['1. 過去背景', '2. 外部影響', '3. 核心焦點', '4. 課題考驗', '5. 最終趨勢'], layout: 'five_cards' },
      { key: 'nine_box', name: '🎴 九張牌九宮格牌陣 (3x3 Box Spread · 九張3*3大局透視)', count: 9, labels: [
        '1. 過去思維', '2. 當前環境', '3. 未來指引',
        '4. 過去感受', '5. 核心命門', '6. 未來走向',
        '7. 過去行動', '8. 外在考驗', '9. 最終啟示'
      ], layout: 'nine_box' },
      { key: 'cross_five', name: '✝️ 十字牌陣 (核心 · 上下左右五方位 · 十字形五張)', count: 5, labels: [
        '1. 當前核心 (中心)', '2. 過去源頭 (左翼)', '3. 未來發展 (右翼)', '4. 顯意識助力 (上方)', '5. 潛在根基考驗 (下方)'
      ], layout: 'cross_five' },
      { key: 'grand_tableau', name: '🌟 大藍圖全覽大牌陣 (Grand Tableau · 36張全套 8x4+4 沙龍正統)', count: 36, labels: Array.from({length: 36}, (_, i) => `第 ${i + 1} 宮位`), layout: 'grand_tableau' }
    ]
  };

  class FlowingDivination {
    constructor(container) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      this.system = 'lenormand'; // 'tarot' | 'ziwei' | 'lenormand'
      this.step = 'focus'; // 'focus' | 'shuffle' | 'fan' | 'reveal'
      this.spread = null;
      this.question = '';
      this.deck = [];
      this.selectedCards = []; // [{ card, isReversed, role, indexInFan }]
      this.isDraggingShuffle = false;
      this.shuffleProgress = 0;
      this.allFlipped = false;
      this.isAutoShuffling = false;
    }

    init(system = 'lenormand', spreadKey = null) {
      this.system = system;
      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;
      this.spread = (spreadKey && spreads.find(s => s.key === spreadKey)) ? spreads.find(s => s.key === spreadKey) : spreads[0];
      this.step = 'focus';
      this.selectedCards = [];
      this.render();
    }

    setSystem(system) {
      this.system = system;
      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;
      this.spread = spreads[0];
      this.selectedCards = [];
      this.step = 'focus';
      this.render();
    }

    setSpread(spreadKey) {
      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;
      const found = spreads.find(s => s.key === spreadKey);
      if (found) {
        this.spread = found;
        this.selectedCards = [];
        this.step = 'focus';
        this.render();
      }
    }

    // 取得完整洗牌牌庫
    getFullDeck() {
      const db = window.MeetJoyDivination || {};
      if (this.system === 'tarot') {
        const list = (db.TAROT_CARDS && db.TAROT_CARDS.length) ? [...db.TAROT_CARDS] : [];
        return list.map(c => ({
          ...c,
          system: 'tarot',
          isReversed: Math.random() > 0.65,
          cardBackClass: 'tarot-back'
        }));
      } else if (this.system === 'ziwei') {
        const zwDb = window.MeetJoyZiweiCards;
        const list = (zwDb && zwDb.cards && zwDb.cards.length) ? [...zwDb.cards] : [];
        return list.map(c => ({
          ...c,
          system: 'ziwei',
          isReversed: c.group === 'assistant' ? false : (Math.random() > 0.7),
          cardBackClass: 'ziwei-card-back'
        }));
      } else {
        // 雷諾曼 36 張
        const list = (db.LENORMAND_CARDS && db.LENORMAND_CARDS.length) ? [...db.LENORMAND_CARDS] : [];
        return list.map(c => ({
          ...c,
          system: 'lenormand',
          isReversed: false,
          cardBackClass: 'lenormand-back'
        }));
      }
    }

    // 渲染主控制器
    render() {
      if (!this.container) return;
      this.container.innerHTML = '';

      // 沉浸模式下，在抽牌完成 (reveal) 之前隱藏底部版權列，保持視覺極致純淨無白條無邊框
      const mainFooter = document.getElementById('main_footer');
      if (mainFooter) {
        if (this.step === 'reveal') {
          mainFooter.style.display = 'block';
        } else {
          mainFooter.style.display = 'none';
        }
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'flowing-zen-wrapper w-full max-w-5xl mx-auto flex flex-col items-center select-none pb-16 min-h-[calc(100dvh-180px)]';

      if (this.step === 'focus') {
        this.renderFocusStep(wrapper);
      } else if (this.step === 'shuffle') {
        this.renderShuffleStep(wrapper);
      } else if (this.step === 'fan') {
        this.renderFanStep(wrapper);
      } else if (this.step === 'reveal') {
        this.renderRevealStep(wrapper);
      }

      this.container.appendChild(wrapper);
    }

    // ─── 階段 1：心念聚焦 (Focus / Input) ───
    renderFocusStep(wrapper) {
      const card = document.createElement('div');
      card.className = 'w-full max-w-2xl bg-white/95 backdrop-blur-md border-2 border-[#C8A97E]/70 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center my-6';

      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;

      card.innerHTML = `
        <div class="text-center mb-6">
          <span class="text-xs font-serif text-[#C8A97E] font-black tracking-widest uppercase">FOCUS · 心念定錨</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-black text-[#1F261C] mt-1">
            沉浸心念，連結宇宙神諭
          </h2>
          <p class="text-xs text-stone-500 mt-1">請靜心調頻，在心中默念或寫下此刻困惑，神諭將為您映照破局解答。</p>
        </div>

        <!-- 系統選擇按鈕 -->
        <div class="flex items-center gap-2 p-1 bg-stone-100 rounded-xl mb-4 border border-stone-200 w-full max-w-md">
          <button type="button" class="flowing-sys-btn flex-1 py-1.5 rounded-lg text-xs font-black transition ${this.system === 'tarot' ? 'bg-[#2E3829] text-amber-100 shadow-xs' : 'text-stone-600 hover:text-stone-900'}" data-sys="tarot">
            🌟 經典塔羅
          </button>
          <button type="button" class="flowing-sys-btn flex-1 py-1.5 rounded-lg text-xs font-black transition ${this.system === 'ziwei' ? 'bg-[#2E3829] text-amber-100 shadow-xs' : 'text-stone-600 hover:text-stone-900'}" data-sys="ziwei">
            🔮 紫微牌卡
          </button>
          <button type="button" class="flowing-sys-btn flex-1 py-1.5 rounded-lg text-xs font-black transition ${this.system === 'lenormand' ? 'bg-[#2E3829] text-amber-100 shadow-xs' : 'text-stone-600 hover:text-stone-900'}" data-sys="lenormand">
            🌿 經典雷諾曼
          </button>
        </div>

        <!-- 牌陣選擇按鈕列表 -->
        <div class="w-full flex flex-wrap items-center justify-center gap-2 mb-6">
          ${spreads.map(s => `
            <button type="button" class="flowing-spread-btn px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${this.spread.key === s.key ? 'bg-[#182622] text-[#F7E7CE] border-[#C8A97E] shadow-xs' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'}" data-spread-key="${s.key}">
              ${s.name}
            </button>
          `).join('')}
        </div>

        <!-- 輸入框 -->
        <div class="w-full relative mb-6">
          <textarea id="flowing_question_input" rows="3" maxlength="200" placeholder="我想詢問的是……（可不填，直接開啟凝神抽牌）" class="w-full p-4 rounded-2xl border border-stone-200 bg-[#FAF7F0] focus:bg-white focus:border-[#C8A97E] focus:outline-none text-stone-800 text-sm font-serif leading-relaxed resize-none transition shadow-inner">${this.question}</textarea>
          <div class="text-right text-[10px] text-stone-400 font-mono mt-1">
            <span id="flowing_char_count">${this.question.length}</span> / 200
          </div>
        </div>

        <!-- 開始抽牌按鈕 -->
        <div class="flex items-center gap-3">
          <button type="button" id="btn_flowing_start" class="px-8 py-3 rounded-full bg-[#182622] hover:bg-[#253a34] text-[#F7E7CE] border border-[#C8A97E] font-black text-sm transition-all shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer">
            <span>開始凝神洗牌 ➔</span>
          </button>
        </div>
      `;

      wrapper.appendChild(card);

      // 事件綁定
      const textarea = card.querySelector('#flowing_question_input');
      const charCount = card.querySelector('#flowing_char_count');
      textarea.addEventListener('input', (e) => {
        this.question = e.target.value;
        if (charCount) charCount.textContent = this.question.length;
      });

      card.querySelectorAll('.flowing-sys-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.setSystem(btn.getAttribute('data-sys'));
        });
      });

      card.querySelectorAll('.flowing-spread-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.setSpread(btn.getAttribute('data-spread-key'));
        });
      });

      card.querySelector('#btn_flowing_start').addEventListener('click', (e) => {
        e.preventDefault();
        this.startShuffleStage();
      });
    }

    // 進入洗牌階段
    startShuffleStage() {
      this.deck = this.getFullDeck();
      // 隨機打亂
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
      this.step = 'shuffle';
      this.shuffleProgress = 0;
      this.isAutoShuffling = false;
      this.render();
    }

    // ─── 階段 2：散牌混洗 (Fluid Shuffle · 桌面散牌物理長按/滑動 + 自動混洗) ───
    renderShuffleStep(wrapper) {
      const shuffleArea = document.createElement('div');
      shuffleArea.className = 'w-full flex flex-col items-center relative py-4 pb-12';

      shuffleArea.innerHTML = `
        <div class="text-center mb-3">
          <span class="text-xs font-serif text-[#C8A97E] font-black tracking-widest uppercase">SHUFFLE · 靈感洗牌</span>
          <h3 class="text-xl sm:text-2xl font-serif font-black text-[#1F261C] mt-1">
            請在牌桌中心滑動或長按洗牌
          </h3>
          <p class="text-xs text-stone-500 mt-1">手指在桌面轉圈撥牌，或點擊「自動旋轉洗牌」，感受到能量就緒即可收牌。</p>
        </div>

        <!-- 輔助控制按鈕 -->
        <div class="flex items-center gap-2 mb-3">
          <button type="button" id="btn_flowing_auto_shuffle" class="px-4 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 transition shadow-2xs flex items-center gap-1.5 cursor-pointer">
            <span class="text-sm">🌀</span>
            <span>自動旋轉洗牌</span>
          </button>
        </div>

        <!-- 散牌舞台 (具備 touch-action: none 防止瀏覽器搶奪滑動手勢) -->
        <div id="flowing_shuffle_stage" style="touch-action: none;" class="relative w-full max-w-[680px] h-[340px] sm:h-[420px] rounded-3xl bg-radial from-amber-50/70 via-stone-100/40 to-transparent border border-[#E5DAC6]/60 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-inner">
          <!-- 中心呼吸光圈波紋 -->
          <div class="absolute w-28 h-28 rounded-full border-2 border-[#C8A97E]/40 animate-ping pointer-events-none opacity-40"></div>
          <div class="absolute w-20 h-20 rounded-full bg-[#C8A97E]/15 flex items-center justify-center pointer-events-none border border-[#C8A97E]/50 text-2xl shadow-inner">
            <span>✨</span>
          </div>

          <!-- 散落卡牌群 -->
          <div id="flowing_scattered_cards" class="absolute inset-0 w-full h-full pointer-events-none"></div>
        </div>

        <!-- 底部收牌按鈕 -->
        <div class="mt-5 flex items-center gap-3">
          <button type="button" id="btn_flowing_collect" class="px-8 py-3 rounded-full bg-[#182622] hover:bg-[#253a34] text-[#F7E7CE] border border-[#C8A97E] font-black text-sm transition-all shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer">
            <span>洗好了，展開牌弧 ➔</span>
          </button>
          <button type="button" id="btn_flowing_back_focus" class="px-5 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-bold text-xs transition cursor-pointer">
            返回重設
          </button>
        </div>
      `;

      wrapper.appendChild(shuffleArea);

      // 動態生成散牌 DOM
      const cardWrap = shuffleArea.querySelector('#flowing_scattered_cards');
      const totalCards = Math.min(this.deck.length, 36); // 展示 36 張確保 60fps

      for (let i = 0; i < totalCards; i++) {
        const el = document.createElement('div');
        el.className = `absolute rounded-xl shadow-md border border-[#C8A97E]/60 ${this.deck[i].cardBackClass} transition-transform duration-300`;
        el.style.width = '52px';
        el.style.height = '82px';

        // 隨機分佈在中心半徑 135px 的圓盤內
        const angle = Math.random() * Math.PI * 2;
        const r = 25 + Math.random() * 125;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const rot = (Math.random() - 0.5) * 60;

        el.style.left = `calc(50% + ${x}px - 26px)`;
        el.style.top = `calc(50% + ${y}px - 41px)`;
        el.style.transform = `rotate(${rot}deg)`;
        el.setAttribute('data-base-x', x);
        el.setAttribute('data-base-y', y);
        el.setAttribute('data-base-rot', rot);

        cardWrap.appendChild(el);
      }

      const stage = shuffleArea.querySelector('#flowing_shuffle_stage');
      let isInteracting = false;
      let pressStartTime = 0;
      let pressStartX = 0, pressStartY = 0;
      let currentPointerX = 0, currentPointerY = 0;
      let lastMoveX = 0, lastMoveY = 0;
      let dragDeltaX = 0, dragDeltaY = 0;
      let shuffleRafId = null;
      let lastSlideAudioTime = 0;
      const cards = cardWrap.children;

      // 持續渦流洗牌循環（長按按住不動或拖曳時每影格持續計算）
      const continuousShuffleLoop = () => {
        if (!isInteracting) return;
        const now = performance.now();
        const elapsed = now - pressStartTime;

        // 連續滑牌洗牌聲：長按時每 135ms 自動觸發一次，營造真實沙沙洗牌聲浪
        if (now - lastSlideAudioTime > 135) {
          lastSlideAudioTime = now;
          window.MeetJoyAudio?.playSlide();
        }

        const rect = stage.getBoundingClientRect();
        const stageCenterX = rect.left + rect.width / 2;
        const stageCenterY = rect.top + rect.height / 2;
        const ptrX = currentPointerX - stageCenterX;
        const ptrY = currentPointerY - stageCenterY;

        // 隨時間推移的旋轉渦流角速度與波動相位
        const timePhase = elapsed * 0.0035;

        for (let i = 0; i < cards.length; i++) {
          const cardEl = cards[i];
          const bx = parseFloat(cardEl.getAttribute('data-base-x'));
          const by = parseFloat(cardEl.getAttribute('data-base-y'));
          const brot = parseFloat(cardEl.getAttribute('data-base-rot'));

          // 卡牌相對於手指/游標的距離
          const dx = bx - ptrX;
          const dy = by - ptrY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // 基礎動態波動位移
          const wave = Math.sin(timePhase * 3.5 + i * 0.5) * 8;
          const orbitAngle = timePhase * 2 + (i / cards.length) * Math.PI * 2;
          const orbitR = 7 + (i % 3) * 3;
          const orbitX = Math.cos(orbitAngle) * orbitR;
          const orbitY = Math.sin(orbitAngle) * orbitR;

          // 手勢拖動的即時加成 (dragDeltaX/Y)
          const dragX = dragDeltaX * 0.35;
          const dragY = dragDeltaY * 0.35;

          // 距離手指越近，渦流擾動力越強
          if (dist < 140) {
            const touchForce = (1 - dist / 140) * 25;
            const touchAngle = Math.atan2(dy, dx);
            const pushX = Math.cos(touchAngle) * touchForce;
            const pushY = Math.sin(touchAngle) * touchForce;
            const swirl = brot + Math.sin(timePhase * 4 + i) * 22;

            cardEl.style.transform = `translate(${orbitX + pushX + dragX}px, ${orbitY + pushY + dragY + wave}px) rotate(${swirl}deg) scale(1.08)`;
          } else {
            const swirl = brot + Math.sin(timePhase * 2 + i) * 7;
            cardEl.style.transform = `translate(${orbitX + dragX * 0.08}px, ${orbitY + dragY * 0.08 + wave * 0.4}px) rotate(${swirl}deg) scale(1.02)`;
          }
        }

        // 拖動速度平滑衰減
        dragDeltaX *= 0.82;
        dragDeltaY *= 0.82;

        shuffleRafId = requestAnimationFrame(continuousShuffleLoop);
      };

      // 水波擴散脈衝（短按 Tap 牌桌觸發）
      const triggerRipplePulse = (clientX, clientY) => {
        window.MeetJoyAudio?.playSlide();
        const rect = stage.getBoundingClientRect();
        const stageCenterX = rect.left + rect.width / 2;
        const stageCenterY = rect.top + rect.height / 2;
        const ptrX = clientX - stageCenterX;
        const ptrY = clientY - stageCenterY;

        for (let i = 0; i < cards.length; i++) {
          const cardEl = cards[i];
          const bx = parseFloat(cardEl.getAttribute('data-base-x'));
          const by = parseFloat(cardEl.getAttribute('data-base-y'));
          const brot = parseFloat(cardEl.getAttribute('data-base-rot'));

          const dx = bx - ptrX;
          const dy = by - ptrY;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const pushDistance = Math.max(0, 180 - dist) * 0.3;
          const angle = Math.atan2(dy, dx);

          const pushX = Math.cos(angle) * pushDistance;
          const pushY = Math.sin(angle) * pushDistance;

          cardEl.style.transition = 'transform 0.22s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
          cardEl.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${brot + (Math.random() - 0.5) * 20}deg) scale(1.07)`;

          // 彈性質感恢復
          setTimeout(() => {
            cardEl.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
            cardEl.style.transform = `translate(0px, 0px) rotate(${brot}deg) scale(1)`;
          }, 230);
        }
      };

      const startInteraction = (clientX, clientY) => {
        if (this.isAutoShuffling) return;
        isInteracting = true;
        pressStartTime = performance.now();
        pressStartX = clientX;
        pressStartY = clientY;
        currentPointerX = clientX;
        currentPointerY = clientY;
        lastMoveX = clientX;
        lastMoveY = clientY;
        dragDeltaX = 0;
        dragDeltaY = 0;

        // 移除卡牌的 CSS transition 避免拖動與持續動畫卡頓
        for (let i = 0; i < cards.length; i++) {
          cards[i].style.transition = 'none';
        }

        if (shuffleRafId) cancelAnimationFrame(shuffleRafId);
        shuffleRafId = requestAnimationFrame(continuousShuffleLoop);
      };

      const moveInteraction = (clientX, clientY) => {
        if (!isInteracting) return;
        dragDeltaX = clientX - lastMoveX;
        dragDeltaY = clientY - lastMoveY;
        lastMoveX = clientX;
        lastMoveY = clientY;
        currentPointerX = clientX;
        currentPointerY = clientY;
      };

      const endInteraction = (clientX, clientY) => {
        if (!isInteracting) return;
        isInteracting = false;
        if (shuffleRafId) {
          cancelAnimationFrame(shuffleRafId);
          shuffleRafId = null;
        }

        const pressDuration = performance.now() - pressStartTime;
        const totalDist = Math.sqrt(Math.pow(clientX - pressStartX, 2) + Math.pow(clientY - pressStartY, 2));

        if (pressDuration < 250 && totalDist < 14) {
          // 判定為短按 Tap 牌桌！觸發水波震盪
          triggerRipplePulse(clientX, clientY);
          return;
        }

        // 長按或滑動結束：所有卡牌平滑回彈至基底位置，並賦予微小隨機洗牌角度
        for (let i = 0; i < cards.length; i++) {
          const cardEl = cards[i];
          const newRot = (Math.random() - 0.5) * 60;
          cardEl.setAttribute('data-base-rot', newRot);
          cardEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
          cardEl.style.transform = `translate(0px, 0px) rotate(${newRot}deg) scale(1)`;
        }
      };

      // Pointer / Mouse 事件監聽
      stage.addEventListener('pointerdown', (e) => {
        startInteraction(e.clientX, e.clientY);
        if (stage.setPointerCapture) {
          try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });

      const onPointerMove = (e) => {
        moveInteraction(e.clientX, e.clientY);
      };

      const onPointerUp = (e) => {
        endInteraction(e.clientX, e.clientY);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      // 行動端 Touch 事件相容強化
      stage.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          startInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (!isInteracting || !e.touches || !e.touches[0]) return;
        if (e.cancelable) e.preventDefault();
        moveInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false });

      stage.addEventListener('touchend', (e) => {
        const clientX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : lastMoveX;
        const clientY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : lastMoveY;
        endInteraction(clientX, clientY);
      });

      // 自動旋轉洗牌按鈕
      const autoShuffleBtn = shuffleArea.querySelector('#btn_flowing_auto_shuffle');
      if (autoShuffleBtn) {
        autoShuffleBtn.addEventListener('click', () => {
          if (this.isAutoShuffling) return;
          this.isAutoShuffling = true;
          autoShuffleBtn.classList.add('opacity-50');
          window.MeetJoyAudio?.playShuffle();

          const cards = cardWrap.children;

          // 階段 1：向中心旋聚 (0 ~ 400ms)
          for (let i = 0; i < cards.length; i++) {
            cards[i].style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            cards[i].style.transform = `translate(0px, 0px) rotate(${i * 10}deg) scale(0.85)`;
            cards[i].style.left = 'calc(50% - 26px)';
            cards[i].style.top = 'calc(50% - 41px)';
          }

          // 階段 2：高速旋風渦流 (400 ~ 900ms)
          setTimeout(() => {
            for (let i = 0; i < cards.length; i++) {
              cards[i].style.transition = 'all 0.5s ease-in-out';
              const a = (i / cards.length) * Math.PI * 2;
              const r = 80;
              const tx = Math.cos(a) * r;
              const ty = Math.sin(a) * r;
              cards[i].style.transform = `translate(${tx}px, ${ty}px) rotate(${360 + i * 20}deg) scale(1)`;
            }
          }, 420);

          // 階段 3：散開到全新隨機位置 (950 ~ 1400ms)
          setTimeout(() => {
            for (let i = 0; i < cards.length; i++) {
              cards[i].style.transition = 'all 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
              const angle = Math.random() * Math.PI * 2;
              const r = 25 + Math.random() * 125;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              const rot = (Math.random() - 0.5) * 60;

              cards[i].style.left = `calc(50% + ${x}px - 26px)`;
              cards[i].style.top = `calc(50% + ${y}px - 41px)`;
              cards[i].style.transform = `rotate(${rot}deg)`;
              cards[i].setAttribute('data-base-x', x);
              cards[i].setAttribute('data-base-y', y);
              cards[i].setAttribute('data-base-rot', rot);
            }
            this.isAutoShuffling = false;
            autoShuffleBtn.classList.remove('opacity-50');
          }, 950);
        });
      }

      // 收牌按鈕
      shuffleArea.querySelector('#btn_flowing_collect').addEventListener('click', () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.MeetJoyAudio?.playSlide();

        // 播放聚攏收牌動畫
        const cards = cardWrap.children;
        for (let i = 0; i < cards.length; i++) {
          cards[i].style.transition = 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
          cards[i].style.left = 'calc(50% - 26px)';
          cards[i].style.top = 'calc(50% - 41px)';
          cards[i].style.transform = `translateY(${i * -0.6}px) rotate(0deg)`;
        }

        setTimeout(() => {
          this.step = 'fan';
          this.render();
        }, 500);
      });

      shuffleArea.querySelector('#btn_flowing_back_focus').addEventListener('click', () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        this.step = 'focus';
        this.render();
      });
    }

    // ─── 階段 3：拱弧展牌 (Card Fan Arc) 與直覺抽牌 ───
    renderFanStep(wrapper) {
      const fanArea = document.createElement('div');
      fanArea.className = 'w-full flex flex-col items-center relative py-4 pb-12 min-h-[580px] sm:min-h-[640px] justify-between';

      const targetCount = this.spread.count;
      const currentSelectedCount = this.selectedCards.length;
      const isGrandTableau = this.spread.key === 'grand_tableau';

      // 頂部目標卡槽（Slot）—— 固定寬高防止手機端高度塌陷
      const slotsHtml = Array.from({ length: targetCount }).map((_, idx) => {
        const cardDrawn = this.selectedCards[idx];
        const roleLabel = this.spread.labels[idx] || `第 ${idx + 1} 張`;

        if (cardDrawn) {
          return `
            <div id="flowing_slot_${idx}" class="flowing-slot filled flex flex-col items-center gap-1.5 shrink-0" data-slot-idx="${idx}">
              <div style="width: 56px; height: 86px; min-height: 86px;" class="rounded-xl border-2 border-[#C8A97E] shadow-md ${cardDrawn.card.cardBackClass} relative overflow-hidden transition-all scale-105 shrink-0 sm:!w-[70px] sm:!h-[105px] sm:!min-h-[105px]">
                <div class="absolute inset-0 bg-amber-400/10 animate-pulse"></div>
              </div>
              <span class="text-[9px] sm:text-xs font-bold text-[#182622] bg-[#EADFC7] px-2 py-0.5 rounded-full whitespace-nowrap">${roleLabel}</span>
            </div>
          `;
        } else {
          return `
            <div id="flowing_slot_${idx}" class="flowing-slot empty flex flex-col items-center gap-1.5 opacity-80 shrink-0" data-slot-idx="${idx}">
              <div style="width: 56px; height: 86px; min-height: 86px;" class="rounded-xl border-2 border-dashed border-stone-300 bg-stone-100/80 flex items-center justify-center text-stone-400 text-xs font-mono shrink-0 shadow-xs sm:!w-[70px] sm:!h-[105px] sm:!min-h-[105px]">
                <span>${idx + 1}</span>
              </div>
              <span class="text-[9px] sm:text-xs font-bold text-stone-500 whitespace-nowrap">${roleLabel}</span>
            </div>
          `;
        }
      }).join('');

      fanArea.innerHTML = `
        <div class="text-center mb-2">
          <span class="text-xs font-serif text-[#C8A97E] font-black tracking-widest uppercase">${this.spread.name.split('(')[0]}</span>
          <h3 id="flowing_fan_title" class="text-xl sm:text-2xl font-serif font-black text-[#1F261C] mt-1">
            憑直覺抽出 ${targetCount} 張（已選 <span id="flowing_selected_num">${currentSelectedCount}</span> / ${targetCount}）
          </h3>
          <p class="text-xs text-stone-500 mt-1">點選扇面任一張卡牌抽牌，或點擊「自動選牌」由宇宙直覺引導。</p>
          <div class="mt-2 flex items-center justify-center gap-2">
            <button type="button" id="btn_flowing_auto_pick" class="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-[#C8A97E] hover:text-[#182622] text-stone-700 text-xs font-black border border-stone-300 transition flex items-center gap-1 cursor-pointer">
              <span>✨ ${isGrandTableau ? '一鍵全開 36 張大盤' : '自動選牌'}</span>
            </button>
            <button type="button" id="btn_flowing_reshuffle" class="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold border border-stone-300 transition cursor-pointer">
              <span>重新洗牌</span>
            </button>
          </div>
        </div>

        <!-- 頂部卡槽列 (橫向捲動支援) -->
        <div class="w-full flex items-center ${targetCount > 5 ? 'justify-start' : 'justify-center'} gap-3 sm:gap-5 my-2 px-3 overflow-x-auto no-scrollbar py-2">
          ${slotsHtml}
        </div>

        <!-- 底部拱弧扇形展牌舞台 (採用極座標法向展開，卡牌向外推展，徹底杜絕圓心重疊遮蔽) -->
        <div class="relative w-full max-w-[840px] h-[320px] sm:h-[370px] mt-2 flex items-end justify-center overflow-hidden">
          <div id="flowing_arc_fan" class="absolute bottom-[-30px] sm:bottom-[-20px] left-1/2 -translate-x-1/2 w-[580px] h-[340px] sm:w-[720px] sm:h-[390px] pointer-events-none">
            <!-- 扇形卡牌動態插入於此 -->
          </div>
        </div>
      `;

      wrapper.appendChild(fanArea);

      // 動態生成孔雀開屏極座標扇形卡牌
      const fanContainer = fanArea.querySelector('#flowing_arc_fan');
      const totalDisplay = Math.min(this.deck.length, 36);
      const startDeg = -55;
      const endDeg = 55;
      const stepDeg = totalDisplay > 1 ? (endDeg - startDeg) / (totalDisplay - 1) : 0;
      const isMobile = window.innerWidth < 640;
      const fanRadius = isMobile ? 155 : 200;

      // 檢查某張牌是否已經在已選清單中（重新渲染時保持狀態）
      const alreadyPickedIndices = new Set(this.selectedCards.map(s => s.indexInFan));

      // 抽牌處理函數（原地視覺飛升，無需整頁重繪）
      const handleCardPick = (fanIndex, card, cardBtn) => {
        if (this.selectedCards.length >= this.spread.count) return;
        if (cardBtn.getAttribute('data-picked') === 'true') return;

        // 標記抽牌
        cardBtn.setAttribute('data-picked', 'true');
        cardBtn.style.pointerEvents = 'none';

        window.MeetJoyAudio?.playDeal();

        // 飛離動效：卡牌向上縮小淡出，營造飛入上方卡槽的感覺
        const currentAngle = parseFloat(cardBtn.getAttribute('data-angle')) || 0;
        cardBtn.style.transition = 'transform 0.4s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.35s ease';
        cardBtn.style.transform = `translateX(-50%) rotate(${currentAngle}deg) translateY(-${fanRadius + 85}px) scale(0.55)`;
        cardBtn.style.opacity = '0.15';
        cardBtn.style.filter = 'grayscale(0.6)';

        const slotIdx = this.selectedCards.length;
        const role = this.spread.labels[slotIdx] || `第 ${slotIdx + 1} 張`;

        this.selectedCards.push({
          card,
          isReversed: card.isReversed,
          role,
          indexInFan: fanIndex
        });

        // 原地更新頂部 Slot 卡槽
        const slotEl = fanArea.querySelector(`#flowing_slot_${slotIdx}`);
        if (slotEl) {
          slotEl.className = 'flowing-slot filled flex flex-col items-center gap-1.5 shrink-0 transition-transform scale-110';
          slotEl.innerHTML = `
            <div style="width: 56px; height: 86px; min-height: 86px;" class="rounded-xl border-2 border-[#C8A97E] shadow-lg ${card.cardBackClass} relative overflow-hidden transition-all shrink-0 sm:!w-[70px] sm:!h-[105px] sm:!min-h-[105px]">
              <div class="absolute inset-0 bg-amber-400/20 animate-pulse"></div>
            </div>
            <span class="text-[9px] sm:text-xs font-bold text-[#182622] bg-[#EADFC7] px-2 py-0.5 rounded-full whitespace-nowrap">${role}</span>
          `;
          setTimeout(() => {
            if (slotEl) slotEl.classList.remove('scale-110');
          }, 250);
        }

        // 更新頂部已選數量
        const countEl = fanArea.querySelector('#flowing_selected_num');
        if (countEl) countEl.textContent = this.selectedCards.length;

        // 若已抽滿，封鎖點擊並在 450ms 後平滑進入翻牌階段
        if (this.selectedCards.length >= this.spread.count) {
          fanContainer.querySelectorAll('[data-fan-index]').forEach(el => {
            el.style.pointerEvents = 'none';
          });
          this.finalizeCardsForSystem();
          setTimeout(() => {
            this.step = 'reveal';
            this.allFlipped = false;
            this.render();
          }, 450);
        }
      };

      for (let i = 0; i < totalDisplay; i++) {
        const card = this.deck[i];
        const angle = startDeg + i * stepDeg;
        const isPicked = alreadyPickedIndices.has(i);

        const cardBtn = document.createElement('div');
        cardBtn.className = `absolute left-1/2 bottom-0 w-13 h-22 sm:w-16 sm:h-28 rounded-xl shadow-md border border-[#C8A97E] ${card.cardBackClass} cursor-pointer pointer-events-auto transition-transform duration-200 select-none`;
        cardBtn.style.transformOrigin = 'center bottom';
        cardBtn.setAttribute('data-fan-index', i);
        cardBtn.setAttribute('data-card-id', card.id);
        cardBtn.setAttribute('data-angle', angle);

        if (isPicked) {
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${fanRadius + 85}px) scale(0.55)`;
          cardBtn.style.opacity = '0.15';
          cardBtn.style.pointerEvents = 'none';
          cardBtn.setAttribute('data-picked', 'true');
        } else {
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${fanRadius}px)`;
          cardBtn.style.zIndex = `${i + 1}`;
        }

        // 行動端與桌面端雙模相容：Zero-Latency Tap 偵測
        let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
        let isTapTriggered = false;

        cardBtn.addEventListener('pointerdown', (e) => {
          if (cardBtn.getAttribute('data-picked') === 'true') return;
          isTapTriggered = false;
          touchStartX = e.clientX;
          touchStartY = e.clientY;
          touchStartTime = performance.now();
          // 即刻視覺反饋：卡牌沿法向向外躍出並拔高層級
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${fanRadius + 24}px) scale(1.08)`;
          cardBtn.style.zIndex = '100';
          cardBtn.style.boxShadow = '0 14px 28px rgba(200, 169, 126, 0.7)';
        });

        cardBtn.addEventListener('pointerup', (e) => {
          if (cardBtn.getAttribute('data-picked') === 'true') return;
          const dx = Math.abs(e.clientX - touchStartX);
          const dy = Math.abs(e.clientY - touchStartY);
          const dt = performance.now() - touchStartTime;

          // 若手指位移小於 14px 且時間小於 500ms，判定為精準點選抽牌！
          if (dx < 14 && dy < 14 && dt < 500) {
            isTapTriggered = true;
            e.preventDefault();
            e.stopPropagation();
            handleCardPick(i, card, cardBtn);
          } else {
            // 滑動手勢結束，恢復原位
            cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${fanRadius}px)`;
            cardBtn.style.zIndex = `${i + 1}`;
            cardBtn.style.boxShadow = '';
          }
        });

        // 原生 Click 作為次級防禦
        cardBtn.addEventListener('click', (e) => {
          if (isTapTriggered) return;
          e.preventDefault();
          handleCardPick(i, card, cardBtn);
        });

        // 桌面 Hover 效果（僅非觸控滑鼠浮起）
        cardBtn.addEventListener('mouseenter', () => {
          if (cardBtn.getAttribute('data-picked') === 'true') return;
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${fanRadius + 20}px) scale(1.06)`;
          cardBtn.style.zIndex = '90';
          cardBtn.style.boxShadow = '0 12px 24px rgba(200, 169, 126, 0.6)';
        });

        cardBtn.addEventListener('mouseleave', () => {
          if (cardBtn.getAttribute('data-picked') === 'true') return;
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-${fanRadius}px)`;
          cardBtn.style.zIndex = `${i + 1}`;
          cardBtn.style.boxShadow = '';
        });

        fanContainer.appendChild(cardBtn);
      }

      // 自動選牌按鈕
      fanArea.querySelector('#btn_flowing_auto_pick').addEventListener('click', () => {
        window.MeetJoyAudio?.playShuffle();
        this.autoPickRemaining();
      });

      fanArea.querySelector('#btn_flowing_reshuffle').addEventListener('click', () => {
        window.MeetJoyAudio?.playShuffle();
        this.startShuffleStage();
      });
    }

    // 抽出一張牌（供外部調用）
    pickCard(fanIndex, card) {
      if (this.selectedCards.length >= this.spread.count) return;

      window.MeetJoyAudio?.playDeal();

      const slotIdx = this.selectedCards.length;
      const role = this.spread.labels[slotIdx] || `第 ${slotIdx + 1} 張`;

      this.selectedCards.push({
        card,
        isReversed: card.isReversed,
        role,
        indexInFan: fanIndex
      });

      // 如果已抽滿，自動進入翻牌階段
      if (this.selectedCards.length >= this.spread.count) {
        this.finalizeCardsForSystem();
        setTimeout(() => {
          this.step = 'reveal';
          this.allFlipped = false;
          this.render();
        }, 450);
      } else {
        this.render();
      }
    }

    // 自動選齊剩餘卡牌
    autoPickRemaining() {
      const needed = this.spread.count - this.selectedCards.length;
      if (needed <= 0) return;

      const usedIndices = new Set(this.selectedCards.map(s => s.indexInFan));
      const deckCount = Math.min(this.deck.length, 36);
      const availableIndices = [];

      for (let i = 0; i < deckCount; i++) {
        if (!usedIndices.has(i)) availableIndices.push(i);
      }

      // 隨機選取
      while (this.selectedCards.length < this.spread.count) {
        let card = null;
        let fanIndex = -1;
        if (availableIndices.length > 0) {
          const rIdx = Math.floor(Math.random() * availableIndices.length);
          fanIndex = availableIndices.splice(rIdx, 1)[0];
          card = this.deck[fanIndex];
        } else {
          // 若超過扇形展示數量 (如 26 張全景大天盤)，直接從卡庫選取未使用的卡
          const usedCardIds = new Set(this.selectedCards.map(s => s.card.id));
          const unusedDeckCards = this.deck.filter(c => !usedCardIds.has(c.id));
          if (unusedDeckCards.length > 0) {
            card = unusedDeckCards[Math.floor(Math.random() * unusedDeckCards.length)];
          } else {
            card = this.deck[Math.floor(Math.random() * this.deck.length)];
          }
        }
        const slotIdx = this.selectedCards.length;
        const role = this.spread.labels[slotIdx] || `第 ${slotIdx + 1} 張`;

        this.selectedCards.push({
          card,
          isReversed: card.isReversed,
          role,
          indexInFan: fanIndex
        });
      }

      this.finalizeCardsForSystem();
      setTimeout(() => {
        this.step = 'reveal';
        this.allFlipped = false;
        this.render();
      }, 350);
    }

    // 紫微斗數專屬宮位與主輔星映射校準 (與經典工坊模式 100% 同步)
    finalizeCardsForSystem() {
      if (this.system === 'ziwei') {
        const zwDb = window.MeetJoyZiweiCards;
        if (zwDb) {
          const majorList = [...zwDb.getGroup('major')].sort(() => Math.random() - 0.5);
          const assistList = [...zwDb.getGroup('assistant')].sort(() => Math.random() - 0.5);
          const lifeList = [...zwDb.getGroup('life')].sort(() => Math.random() - 0.5);

          if (this.spread.key === 'three_decks') {
            this.selectedCards = [
              { card: { ...majorList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[0], palace: '命運核心', cardType: 'major' },
              { card: { ...assistList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[1], palace: '外部助力', cardType: 'assistant' },
              { card: { ...lifeList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[2], palace: '長生時序', cardType: 'life' }
            ];
          } else if (this.spread.key === 'san_fang_si_zheng') {
            this.selectedCards = [
              { card: { ...majorList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[0], palace: '命宮', cardType: 'major' },
              { card: { ...assistList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[1], palace: '命宮', cardType: 'assistant' },
              { card: { ...majorList[1], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[2], palace: '遷移宮', cardType: 'major' },
              { card: { ...assistList[1], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[3], palace: '遷移宮', cardType: 'assistant' },
              { card: { ...majorList[2], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[4], palace: '官祿宮', cardType: 'major' },
              { card: { ...assistList[2], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[5], palace: '官祿宮', cardType: 'assistant' },
              { card: { ...majorList[3], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[6], palace: '財帛宮', cardType: 'major' },
              { card: { ...assistList[3], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[7], palace: '財帛宮', cardType: 'assistant' },
              { card: { ...lifeList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' }, isReversed: Math.random() > 0.5, role: this.spread.labels[8], palace: '時輪', cardType: 'life' }
            ];
          } else if (this.spread.key === 'twelve_palaces') {
            const palaceNames = ['命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮', '遷移宮', '僕役宮', '官祿宮', '田宅宮', '福德宮', '父母宮'];
            const res = [];
            for (let i = 0; i < 12; i++) {
              res.push({
                card: { ...majorList[i], system: 'ziwei', cardBackClass: 'ziwei-card-back' },
                isReversed: Math.random() > 0.5,
                role: `${palaceNames[i]} · 主星`,
                palace: palaceNames[i],
                cardType: 'major'
              });
              res.push({
                card: { ...assistList[i], system: 'ziwei', cardBackClass: 'ziwei-card-back' },
                isReversed: Math.random() > 0.5,
                role: `${palaceNames[i]} · 輔星`,
                palace: palaceNames[i],
                cardType: 'assistant'
              });
            }
            res.push({
              card: { ...majorList[12], system: 'ziwei', cardBackClass: 'ziwei-card-back' },
              isReversed: Math.random() > 0.5,
              role: '天盤中庭 · 身宮 (行動意志)',
              palace: '身宮',
              cardType: 'major'
            });
            res.push({
              card: { ...lifeList[0], system: 'ziwei', cardBackClass: 'ziwei-card-back' },
              isReversed: Math.random() > 0.5,
              role: '天盤中庭 · 十二長生 (氣數時序)',
              palace: '時輪',
              cardType: 'life'
            });
            this.selectedCards = res;
          }
        }
      }
    }

    // ─── 階段 4：3D 翻牌與生活魔藥解讀 (支援各牌陣專屬佈局) ───
    renderRevealStep(wrapper) {
      const revealArea = document.createElement('div');
      revealArea.className = 'w-full flex flex-col items-center relative py-4';

      const layout = this.spread.layout || 'grid';

      revealArea.innerHTML = `
        <div class="text-center mb-6">
          <span class="text-xs font-serif text-[#C8A97E] font-black tracking-widest uppercase">DIVINATION RESULT · 神諭顯化</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-black text-[#1F261C] mt-1">
            ${this.question ? `「${this.question}」` : '占卜神諭結果'}
          </h2>
          <p class="text-xs text-stone-500 mt-1">點擊下方個別卡牌逐一翻開，或點擊「全部翻開」領取生活魔藥解讀。</p>
          <div class="mt-3 flex items-center justify-center gap-3">
            <button type="button" id="btn_flowing_flip_all" class="px-5 py-2 rounded-full bg-[#C8A97E] hover:bg-[#dfc298] text-[#182622] font-black text-xs transition shadow-xs cursor-pointer">
              ✨ 全部翻開
            </button>
            <button type="button" id="btn_flowing_slideshow" class="px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black transition flex items-center gap-1 cursor-pointer" title="全螢幕逐張放大幻燈片欣賞">
              <span>🔍 放大幻燈片</span>
            </button>
            <button type="button" id="btn_flowing_redraw" class="px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold transition cursor-pointer">
              🔄 再抽一次
            </button>
            <button type="button" id="btn_flowing_reset_focus" class="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-xs font-bold transition cursor-pointer">
              ⚙️ 更換牌陣
            </button>
          </div>
        </div>

        <!-- 牌面展示區 (依牌陣專屬渲染) -->
        <div id="flowing_cards_stage" class="w-full mb-10"></div>

        <!-- 生活魔藥調頻總處方區 -->
        <div id="flowing_potion_summary" class="w-full max-w-3xl bg-gradient-to-br from-[#182622] via-[#23352F] to-[#182622] border-2 border-[#C8A97E]/70 rounded-3xl p-6 sm:p-8 text-[#F7E7CE] shadow-xl relative overflow-hidden hidden">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 rounded-full bg-[#C8A97E] text-[#182622] text-xs font-black">🧪 愛倫院長生活魔藥總結</span>
            <span class="text-xs text-amber-200/70 font-mono">MeetJoy Atelier</span>
          </div>
          <div id="flowing_potion_content" class="text-sm leading-relaxed text-stone-200 font-serif"></div>
          
          <div class="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <button type="button" id="btn_copy_flowing_prompt" class="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer">
              <span>📋 複製 AI 深度解讀提示詞</span>
            </button>
            <button type="button" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="text-xs text-amber-300 font-bold hover:underline">
              ↑ 回到頂部
            </button>
          </div>
        </div>
      `;

      wrapper.appendChild(revealArea);

      const stage = revealArea.querySelector('#flowing_cards_stage');
      stage.innerHTML = this.renderRevealLayoutHtml(layout);

      // 綁定所有卡牌單元翻轉與點圖放大事件（覆蓋卡面、標籤、卡名等整塊區域）
      const cardUnits = revealArea.querySelectorAll('.flowing-card-unit, .card-scene');
      const boundIndices = new Set();

      cardUnits.forEach(targetEl => {
        const cardIdx = parseInt(targetEl.getAttribute('data-card-idx'), 10);
        if (isNaN(cardIdx) || boundIndices.has(cardIdx)) return;
        boundIndices.add(cardIdx);

        targetEl.addEventListener('click', (e) => {
          const innerEl = targetEl.querySelector('.card-inner') || (targetEl.classList.contains('card-scene') ? targetEl.querySelector('.card-inner') : null);
          if (innerEl && innerEl.classList.contains('flipped')) {
            // 已翻開的卡牌，點擊直接打開全螢幕大圖幻燈片！
            if (typeof window.openSlideshow === 'function') {
              window.openSlideshow(cardIdx);
            }
          } else if (innerEl) {
            // 未翻開的卡牌，點擊翻開
            window.MeetJoyAudio?.playFlip();
            innerEl.classList.add('flipped');
            targetEl.classList.add('is-flipped');
            this.checkAndRenderPotionSummary(revealArea);
          }
        });
      });

      // 全部翻開按鈕
      revealArea.querySelector('#btn_flowing_flip_all').addEventListener('click', () => {
        window.MeetJoyAudio?.playFlip();
        revealArea.querySelectorAll('.card-inner').forEach(el => el.classList.add('flipped'));
        this.checkAndRenderPotionSummary(revealArea);
      });

      // 放大幻燈片按鈕
      revealArea.querySelector('#btn_flowing_slideshow')?.addEventListener('click', () => {
        if (typeof window.openSlideshow === 'function') {
          window.openSlideshow(0);
        }
      });

      // 重新抽取
      revealArea.querySelector('#btn_flowing_redraw').addEventListener('click', () => {
        window.MeetJoyAudio?.playShuffle();
        this.startShuffleStage();
      });

      // 更換牌陣或系統
      revealArea.querySelector('#btn_flowing_reset_focus')?.addEventListener('click', () => {
        this.step = 'focus';
        this.selectedCards = [];
        this.render();
      });
    }

    // 依牌陣佈局產出翻牌區結構 HTML (與經典工坊模式 100% 同步)
    renderRevealLayoutHtml(layout) {
      if (layout === 'celtic' && this.selectedCards.length >= 10) {
        // 經典凱爾特十字牌陣 (左側六卡十字顯象 · 右階四階靈魂之杖)
        return `
          <div class="celtic-cross-wrapper">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-amber-200 text-xs font-bold mb-3 shadow-2xs">
              <span>✝️ 經典凱爾特十字牌陣 · 萬物全相透視神殿</span>
              <span class="opacity-50">|</span>
              <span class="text-[11px] text-stone-300">左側六卡十字顯象 · 右階四階靈魂之杖</span>
            </div>

            <div class="celtic-spread-stage">
              <!-- 左側神聖十字 (3 列 x 3 欄) -->
              <div class="celtic-cross-grid">
                <!-- Row 1: Top (Card 5: 顯意識目標) -->
                <div class="celtic-cell"></div>
                <div class="celtic-cell">
                  ${this.renderFlipCardSingleHtml(4, 'celtic')}
                </div>
                <div class="celtic-cell"></div>

                <!-- Row 2: Card 4 (過去源頭), Center (Card 1 現狀 + Card 2 挑戰橫跨), Card 6 (近期未來) -->
                <div class="celtic-cell">
                  ${this.renderFlipCardSingleHtml(3, 'celtic')}
                </div>
                <div class="celtic-center-cell">
                  <!-- 核心立牌 (位置 1) -->
                  <div class="celtic-slot-base">
                    ${this.renderFlipCardSingleHtml(0, 'celtic')}
                  </div>
                  <!-- 交叉橫牌 (位置 2 · 尺寸絕對相同 · 90度正向疊加) -->
                  <div class="celtic-slot-crossing">
                    ${this.renderFlipCardSingleHtml(1, 'celtic')}
                  </div>
                </div>
                <div class="celtic-cell">
                  ${this.renderFlipCardSingleHtml(5, 'celtic')}
                </div>

                <!-- Row 3: Bottom (Card 3: 潛意識根基) -->
                <div class="celtic-cell"></div>
                <div class="celtic-cell">
                  ${this.renderFlipCardSingleHtml(2, 'celtic')}
                </div>
                <div class="celtic-cell"></div>
              </div>

              <!-- 右側權杖之柱 (位置 10, 9, 8, 7 由上至下四階縱向) -->
              <div class="celtic-staff-column">
                <div class="celtic-staff-cell">${this.renderFlipCardSingleHtml(9, 'celtic')}</div>
                <div class="celtic-staff-cell">${this.renderFlipCardSingleHtml(8, 'celtic')}</div>
                <div class="celtic-staff-cell">${this.renderFlipCardSingleHtml(7, 'celtic')}</div>
                <div class="celtic-staff-cell">${this.renderFlipCardSingleHtml(6, 'celtic')}</div>
              </div>
            </div>
            
            <p class="text-[11px] text-stone-500 font-bold mt-2.5">
              💡 提示：點選卡牌逐張翻開（中央卡 1 與交叉卡 2 皆可點擊），或點上方「全部翻開」查閱完整解讀
            </p>
          </div>
        `;
      } else if (layout === 'san_fang' && this.selectedCards.length >= 9) {
        // 紫微三方四正專屬牌陣 (翡翠深綠底 × 金邊標籤 × 十二長生時輪角)
        return `
          <div class="sanfang-board">
            <!-- 十二長生時輪（手機版置頂通欄 · 桌面版右上角神諭角） -->
            <div class="relative sm:absolute sm:top-6 sm:right-6 w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center bg-black/50 p-2 sm:p-2.5 mb-3 sm:mb-0 rounded-2xl border border-amber-400/50 backdrop-blur-xs shadow-md z-20">
              <div class="flex items-center gap-1.5 sm:mb-1.5">
                <span class="sanfang-life-badge text-xs">十二長生</span>
                <span class="px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black">時輪</span>
                <span class="sm:hidden text-[10px] text-amber-200/80 font-bold ml-1">氣數時序</span>
              </div>
              <div class="w-14 sm:w-20">
                ${this.renderFlipCardSingleHtml(8, 'sanfang')}
              </div>
            </div>

            <!-- 主佈局：菱形四正神殿 -->
            <div class="flex flex-col items-center justify-between min-h-[560px] sm:min-h-[640px] relative py-2">
              
              <!-- 上方：遷移宮 (主星 + 輔星) -->
              <div class="flex flex-col items-center z-10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="sanfang-banner text-xs sm:text-sm">遷移宮</span>
                  <span class="text-amber-200/90 text-[11px] sm:text-xs font-bold">外在人際 · 機遇格局</span>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="flex flex-col items-center">
                    <span class="text-[10px] font-bold text-amber-200 mb-0.5">主星</span>
                    <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(2, 'sanfang')}</div>
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-[10px] font-bold text-amber-200 mb-0.5">輔星</span>
                    <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(3, 'sanfang')}</div>
                  </div>
                </div>
              </div>

              <!-- 中排：左側官祿宮 ⟷ 中央交會紋章 ⟷ 右側財帛宮 -->
              <div class="w-full flex items-center justify-between px-2 sm:px-6 my-4 z-10">
                
                <!-- 左：官祿宮 -->
                <div class="flex flex-col items-center">
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <span class="sanfang-banner text-[11px] sm:text-xs">官祿宮</span>
                    <span class="text-amber-200/80 text-[10px] hidden sm:inline font-bold">事業基石</span>
                  </div>
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="flex flex-col items-center">
                      <span class="text-[10px] font-bold text-amber-200 mb-0.5">主星</span>
                      <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(4, 'sanfang')}</div>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-[10px] font-bold text-amber-200 mb-0.5">輔星</span>
                      <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(5, 'sanfang')}</div>
                    </div>
                  </div>
                </div>

                <!-- 中央四正交匯神聖幾何星盤光環 -->
                <div class="hidden sm:flex flex-col items-center justify-center pointer-events-none opacity-80">
                  <div class="relative w-28 h-28 rounded-full border border-amber-300/40 flex items-center justify-center">
                    <div class="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/30 animate-spin-slow"></div>
                    <div class="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/60 flex items-center justify-center text-center p-1 shadow-inner">
                      <span class="text-xs font-black text-amber-200 font-cinzel tracking-widest leading-tight">三方<br>四正</span>
                    </div>
                  </div>
                </div>

                <!-- 右：財帛宮 -->
                <div class="flex flex-col items-center">
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <span class="sanfang-banner text-[11px] sm:text-xs">財帛宮</span>
                    <span class="text-amber-200/80 text-[10px] hidden sm:inline font-bold">金流資產</span>
                  </div>
                  <div class="flex items-center gap-1.5 sm:gap-2">
                    <div class="flex flex-col items-center">
                      <span class="text-[10px] font-bold text-amber-200 mb-0.5">主星</span>
                      <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(6, 'sanfang')}</div>
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-[10px] font-bold text-amber-200 mb-0.5">輔星</span>
                      <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(7, 'sanfang')}</div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- 下方：命宮 (主星 + 輔星) -->
              <div class="flex flex-col items-center z-10">
                <div class="flex items-center gap-2 sm:gap-3 mb-1.5">
                  <div class="flex flex-col items-center">
                    <span class="text-[10px] font-bold text-amber-200 mb-0.5">主星</span>
                    <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(0, 'sanfang')}</div>
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-[10px] font-bold text-amber-200 mb-0.5">輔星</span>
                    <div class="w-14 sm:w-20">${this.renderFlipCardSingleHtml(1, 'sanfang')}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="sanfang-banner text-xs sm:text-sm border-amber-300 text-amber-200">命宮</span>
                  <span class="text-amber-200/90 text-[11px] sm:text-xs font-bold">核心本質 · 自我基調</span>
                </div>
              </div>

            </div>
          </div>
        `;
      } else if (layout === 'twelve' && this.selectedCards.length >= 26) {
        // 紫微十二宮全景大天盤 (4x4 迴廊十二宮雙星 + 中庭身宮與長生)
        const gridCells = [
          { branch: '巳', palaceIdx: 6, row: 1, col: 1 },
          { branch: '午', palaceIdx: 5, row: 1, col: 2 },
          { branch: '未', palaceIdx: 4, row: 1, col: 3 },
          { branch: '申', palaceIdx: 3, row: 1, col: 4 },
          { branch: '辰', palaceIdx: 7, row: 2, col: 1 },
          { branch: '酉', palaceIdx: 2, row: 2, col: 4 },
          { branch: '卯', palaceIdx: 8, row: 3, col: 1 },
          { branch: '戌', palaceIdx: 1, row: 3, col: 4 },
          { branch: '寅', palaceIdx: 9, row: 4, col: 1 },
          { branch: '丑', palaceIdx: 10, row: 4, col: 2 },
          { branch: '子', palaceIdx: 11, row: 4, col: 3 },
          { branch: '亥', palaceIdx: 0, row: 4, col: 4 }
        ];
        const palaceNames = ['命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮', '遷移宮', '僕役宮', '官祿宮', '田宅宮', '福德宮', '父母宮'];

        return `
          <div class="w-full max-w-[1360px] mx-auto space-y-3">
            <div class="flex flex-wrap items-center justify-between px-3 text-xs font-bold text-stone-600 gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-[#2E3829] text-amber-200 font-black text-xs">🌌 正統紫微斗數全景大天盤</span>
                <span class="text-stone-700 hidden sm:inline">4x4 迴廊十二宮雙星合參（各宮主星+輔星共 24 張）＋ 天盤中庭身宮與長生時序（2張）</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="sm:hidden text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-400/40">👉 可左右滑動</span>
                <span class="court-pill-shen">身宮</span>
                <span class="court-pill-life">十二長生</span>
              </div>
            </div>

            <div class="w-full overflow-x-auto pb-2 -mx-1 px-1">
              <div class="ziwei-twelve-board min-w-[680px] lg:min-w-0">
                <!-- 周邊 12 宮位格 -->
                ${gridCells.map(c => {
                  const pIdx = c.palaceIdx;
                  const pName = palaceNames[pIdx];
                  const isMingGong = (pIdx === 0);
                  const mCardIdx = pIdx * 2;
                  const aCardIdx = pIdx * 2 + 1;

                  return `
                    <div class="ziwei-palace-cell ${isMingGong ? 'ring-2 ring-amber-400 bg-[#2b3a2f]' : ''}" style="grid-row: ${c.row}; grid-column: ${c.col};">
                      <div class="w-full flex items-center justify-between pb-1 mb-1 border-b border-[#C8A97E]/40 px-1">
                        <span class="text-xs font-black ${isMingGong ? 'text-amber-300' : 'text-amber-100'}">${pName}</span>
                        <span class="text-[10px] text-amber-300/80 font-bold">${c.branch}位</span>
                      </div>
                      <div class="w-full grid grid-cols-2 gap-1 my-auto">
                        <div class="flex flex-col items-center">
                          <span class="text-[9px] font-bold text-amber-200/90 mb-0.5">主星</span>
                          <div class="w-full">${this.renderFlipCardSingleHtml(mCardIdx, 'twelve')}</div>
                        </div>
                        <div class="flex flex-col items-center">
                          <span class="text-[9px] font-bold text-amber-200/90 mb-0.5">輔星</span>
                          <div class="w-full">${this.renderFlipCardSingleHtml(aCardIdx, 'twelve')}</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}

                <!-- 天盤中庭 (身宮主宰 + 十二長生時輪) -->
                <div class="ziwei-center-court">
                  <div class="text-center mb-2">
                    <span class="text-xs font-black text-amber-300 tracking-wider font-cinzel">CELESTIAL COURT</span>
                    <h4 class="text-sm font-black text-amber-100">天盤中庭 · 命盤太極樞紐</h4>
                  </div>
                  <div class="w-full max-w-[280px] grid grid-cols-2 gap-3 items-center justify-center">
                    <div class="flex flex-col items-center p-2 rounded-xl bg-black/40 border border-orange-500/50">
                      <span class="court-pill-shen mb-1">身宮 (行動主宰)</span>
                      <div class="w-14 sm:w-16">${this.renderFlipCardSingleHtml(24, 'twelve-court')}</div>
                    </div>
                    <div class="flex flex-col items-center p-2 rounded-xl bg-black/40 border border-amber-500/50">
                      <span class="court-pill-life mb-1">十二長生時輪</span>
                      <div class="w-14 sm:w-16">${this.renderFlipCardSingleHtml(25, 'twelve-court')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (layout === 'four_elements' && this.selectedCards.length >= 4) {
        // 四要素平衡牌陣 (火 · 水 · 風 · 土 四象限)
        const elementBadges = [
          { name: '🔥 行動意志 (火要素)', color: 'border-rose-400 bg-rose-50 text-rose-800' },
          { name: '💧 情緒感知 (水要素)', color: 'border-blue-400 bg-blue-50 text-blue-800' },
          { name: '🌬️ 思維理智 (風要素)', color: 'border-amber-400 bg-amber-50 text-amber-800' },
          { name: '🌱 物質落地 (土要素)', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' }
        ];
        return `
          <div class="max-w-4xl mx-auto space-y-4">
            <div class="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-black text-amber-950 shadow-2xs text-center">
              <span>🔮 四要素平衡牌陣 · 火/水/風/土 四方能量場</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 sm:p-6 rounded-3xl bg-stone-900/5 border border-stone-300/70 shadow-inner">
              ${[0, 1, 2, 3].map(idx => `
                <div class="flex flex-col items-center p-3 rounded-2xl border ${elementBadges[idx].color} bg-white/70 shadow-xs">
                  <span class="text-xs font-black mb-2">${elementBadges[idx].name}</span>
                  <div class="w-full max-w-[180px]">
                    ${this.renderFlipCardSingleHtml(idx)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (layout === 'cross_five' && this.selectedCards.length >= 5) {
        // 雷諾曼十字牌陣 (十字形五張 · 核心、上下左右五方位)
        return `
          <div class="max-w-xl sm:max-w-2xl mx-auto space-y-3">
            <div class="text-center text-xs font-black text-amber-900 bg-amber-50/90 py-2 px-4 rounded-xl border border-amber-200/80 shadow-2xs">
              ✝️ 雷諾曼十字牌陣 · 五方位全息透視 (中央核心 · 左因右果 · 上天啟下根基)
            </div>

            <div class="grid grid-cols-3 gap-2.5 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-stone-900/5 border border-stone-300/70 shadow-inner">
              <!-- Row 1: Top (Card 4, idx 3) -->
              <div class="flex flex-col items-center justify-center"></div>
              <div class="flex flex-col items-center justify-center">
                <div class="mb-1 text-center"><span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">↑ 顯意識 · 助力</span></div>
                ${this.renderFlipCardSingleHtml(3, 'nine_box')}
              </div>
              <div class="flex flex-col items-center justify-center"></div>

              <!-- Row 2: Left (Card 2, idx 1), Center (Card 1, idx 0), Right (Card 3, idx 2) -->
              <div class="flex flex-col items-center justify-center">
                <div class="mb-1 text-center"><span class="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-black">← 過去因由</span></div>
                ${this.renderFlipCardSingleHtml(1, 'nine_box')}
              </div>
              <div class="flex flex-col items-center justify-center ring-2 ring-amber-400 rounded-2xl bg-amber-400/10 p-1 sm:p-1.5 shadow-md">
                <div class="mb-1 text-center"><span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black shadow-md tracking-wider">★ 當前核心</span></div>
                ${this.renderFlipCardSingleHtml(0, 'nine_box')}
              </div>
              <div class="flex flex-col items-center justify-center">
                <div class="mb-1 text-center"><span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black border border-purple-200">→ 未來趨勢</span></div>
                ${this.renderFlipCardSingleHtml(2, 'nine_box')}
              </div>

              <!-- Row 3: Bottom (Card 5, idx 4) -->
              <div class="flex flex-col items-center justify-center"></div>
              <div class="flex flex-col items-center justify-center">
                <div class="mb-1 text-center"><span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200">↓ 潛在根基</span></div>
                ${this.renderFlipCardSingleHtml(4, 'nine_box')}
              </div>
              <div class="flex flex-col items-center justify-center"></div>
            </div>

            <div class="flex flex-wrap items-center justify-between text-[11px] font-bold text-stone-500 px-2 gap-1">
              <span>💡 橫軸透視：左側起因源起 ➔ 中央核心現況 ➔ 右側走向趨勢</span>
              <span>縱軸透視：上方顯意識目標與外部助力 ⟷ 下方潛意識深層與阻礙課題</span>
            </div>
          </div>
        `;
      } else if (layout === 'five_cards' && this.selectedCards.length >= 5) {
        // 雷諾曼五張牌線性牌陣 (五張橫向 · 1x5)
        return `
          <div class="max-w-5xl mx-auto space-y-3">
            <div class="text-center text-xs font-black text-amber-900 bg-amber-50/90 py-2 px-4 rounded-xl border border-amber-200/80 shadow-2xs">
              ✨ 雷諾曼五張牌陣 · 橫向線性透視 (過去背景 ➔ 外部影響 ➔ 核心焦點 ➔ 課題考驗 ➔ 最終趨勢)
            </div>

            <div class="w-full overflow-x-auto pb-2">
              <div class="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-stone-900/5 border border-stone-300/70 min-w-[540px] sm:min-w-0">
                ${[0, 1, 2, 3, 4].map(idx => {
                  const isCenter = (idx === 2);
                  return `
                    <div class="relative flex flex-col items-center ${isCenter ? 'ring-2 ring-amber-400 rounded-2xl bg-amber-400/10 p-1 shadow-md' : ''}">
                      ${isCenter ? '<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20"><span class="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black shadow-md">★ 核心焦點</span></div>' : ''}
                      ${this.renderFlipCardSingleHtml(idx, 'five')}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      } else if ((layout === 'three_cards' || layout === 'three_decks') && this.selectedCards.length >= 3) {
        // 三張橫向牌陣 (雷諾曼三張橫向 或 紫微三組牌各一張)
        const isZiwei = this.system === 'ziwei';
        return `
          <div class="max-w-4xl mx-auto space-y-3">
            <div class="grid grid-cols-3 text-center text-xs font-black text-amber-900 bg-amber-50/90 py-2 px-3 rounded-xl border border-amber-200/80 shadow-2xs">
              <div class="flex items-center justify-center gap-1"><span>${isZiwei ? '👑' : '⏳'}</span><span>${isZiwei ? '主星牌 (核心運勢)' : '過去源起 (Past)'}</span></div>
              <div class="flex items-center justify-center gap-1 text-amber-950 font-black"><span>${isZiwei ? '⚡' : '🌟'}</span><span>${isZiwei ? '輔星牌 (外部助力)' : '當前核心 (Present)'}</span></div>
              <div class="flex items-center justify-center gap-1"><span>${isZiwei ? '⏳' : '🚀'}</span><span>${isZiwei ? '長生星 (時序旺衰)' : '未來走向 (Future)'}</span></div>
            </div>

            <div class="grid grid-cols-3 gap-3 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-stone-900/5 border border-stone-300/70 shadow-inner">
              ${[0, 1, 2].map(idx => this.renderFlipCardSingleHtml(idx, 'three')).join('')}
            </div>
          </div>
        `;
      } else if (layout === 'triangle' && this.selectedCards.length >= 3) {
        // 聖三角牌陣 (頂1 底2)
        return `
          <div class="max-w-4xl mx-auto space-y-4">
            <div class="relative p-4 sm:p-8 rounded-3xl bg-stone-900/5 border border-stone-300/70 shadow-inner flex flex-col items-center gap-6 sm:gap-8 overflow-hidden">
              <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
                <polygon points="200,30 60,260 340,260" fill="none" stroke="#C8A97E" stroke-width="1.8" stroke-dasharray="6 4" />
              </svg>
              <!-- 頂端第 2 張 (核心課題) -->
              <div class="relative flex flex-col items-center z-10">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-black mb-2 shadow-md">
                  <span>★ 頂點核心課題 (焦點神諭)</span>
                </div>
                ${this.renderFlipCardSingleHtml(1)}
              </div>
              <!-- 底層左 1 右 3 -->
              <div class="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12 z-10">
                <div class="flex flex-col items-center">
                  ${this.renderFlipCardSingleHtml(0)}
                </div>
                <div class="flex flex-col items-center">
                  ${this.renderFlipCardSingleHtml(2)}
                </div>
              </div>
            </div>
          </div>
        `;
      } else if ((layout === 'time_stream' || layout === 'timeline') && this.selectedCards.length >= 3) {
        // 時間之流牌陣 (日月星 3 張水平)
        const emblems = [
          { symbol: '☀️', title: '太陽 · 過去源起', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
          { symbol: '🌙', title: '月亮 · 當前核心', bg: 'bg-indigo-100 text-indigo-950 border-indigo-300' },
          { symbol: '⭐', title: '星辰 · 未來走向', bg: 'bg-purple-100 text-purple-950 border-purple-300' }
        ];
        return `
          <div class="max-w-5xl mx-auto space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6 rounded-3xl bg-stone-900/5 border border-stone-300/70 shadow-inner items-start">
              ${[0, 1, 2].map(idx => `
                <div class="flex flex-col items-center">
                  <div class="flex items-center gap-1.5 mb-2 px-3 py-0.5 rounded-full border ${emblems[idx].bg} shadow-xs">
                    <span>${emblems[idx].symbol}</span>
                    <span class="text-xs font-black font-serif">${emblems[idx].title}</span>
                  </div>
                  ${this.renderFlipCardSingleHtml(idx)}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (layout === 'two_choices' && this.selectedCards.length >= 5) {
        // 二擇一牌陣 (V 字雙翼：左2 右2 底1)
        return `
          <div class="max-w-5xl mx-auto space-y-4">
            <div class="p-4 sm:p-6 rounded-3xl bg-stone-900/5 border border-stone-300/70 shadow-inner flex flex-col items-center gap-4">
              <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
                <!-- 途徑 A -->
                <div class="flex flex-col items-center p-3 rounded-2xl bg-amber-500/5 border border-amber-300/60">
                  <div class="px-3 py-0.5 rounded-full bg-amber-600 text-white text-xs font-black mb-3">【途徑 A 分枝】</div>
                  <div class="flex flex-col items-center gap-3">
                    ${this.renderFlipCardSingleHtml(2)}
                    ${this.renderFlipCardSingleHtml(1)}
                  </div>
                </div>
                <!-- 途徑 B -->
                <div class="flex flex-col items-center p-3 rounded-2xl bg-blue-500/5 border border-blue-300/60">
                  <div class="px-3 py-0.5 rounded-full bg-slate-700 text-blue-100 text-xs font-black mb-3">【途徑 B 分枝】</div>
                  <div class="flex flex-col items-center gap-3">
                    ${this.renderFlipCardSingleHtml(4)}
                    ${this.renderFlipCardSingleHtml(3)}
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center mt-2 pt-4 border-t border-stone-300/80 w-full">
                <div class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#182622] text-[#F7E7CE] text-xs font-black mb-2">
                  <span>① 當事人當前本體現況</span>
                </div>
                ${this.renderFlipCardSingleHtml(0)}
              </div>
            </div>
          </div>
        `;
      } else if (layout === 'three_choices' && this.selectedCards.length >= 9) {
        // 三擇一牌陣 (三叉戟佈局)
        return `
          <div class="max-w-6xl mx-auto space-y-4">
            <div class="p-4 sm:p-6 rounded-3xl bg-stone-900/5 border border-stone-300/70 shadow-inner flex flex-col items-center gap-6">
              <div class="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <!-- 選項 A -->
                <div class="flex flex-col items-center p-3 rounded-2xl bg-amber-500/5 border border-amber-300/60">
                  <div class="px-3 py-0.5 rounded-full bg-amber-600 text-white text-xs font-black mb-2">【選項 A】</div>
                  <div class="flex flex-col items-center gap-2">
                    ${this.renderFlipCardSingleHtml(4)}
                    ${this.renderFlipCardSingleHtml(3)}
                  </div>
                </div>
                <!-- 選項 B -->
                <div class="flex flex-col items-center p-3 rounded-2xl bg-indigo-500/5 border border-indigo-300/60">
                  <div class="px-3 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black mb-2">【選項 B】</div>
                  <div class="flex flex-col items-center gap-2">
                    ${this.renderFlipCardSingleHtml(6)}
                    ${this.renderFlipCardSingleHtml(5)}
                  </div>
                </div>
                <!-- 選項 C -->
                <div class="flex flex-col items-center p-3 rounded-2xl bg-emerald-500/5 border border-emerald-300/60">
                  <div class="px-3 py-0.5 rounded-full bg-emerald-700 text-white text-xs font-black mb-2">【選項 C】</div>
                  <div class="flex flex-col items-center gap-2">
                    ${this.renderFlipCardSingleHtml(8)}
                    ${this.renderFlipCardSingleHtml(7)}
                  </div>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-stone-300/70 w-full">
                ${this.renderFlipCardSingleHtml(0)}
                ${this.renderFlipCardSingleHtml(1)}
              </div>
              <div class="flex flex-col items-center pt-2">
                ${this.renderFlipCardSingleHtml(2)}
              </div>
            </div>
          </div>
        `;
      } else if (layout === 'nine_box' && this.selectedCards.length >= 9) {
        // 雷諾曼專屬九宮格 (3x3 Box Spread · 九張3*3大局透視)
        return `
          <div class="w-full max-w-xl sm:max-w-2xl mx-auto space-y-3">
            <div class="grid grid-cols-3 text-center text-xs font-black text-amber-900 bg-amber-50/90 py-2 px-3 rounded-xl border border-amber-200/80 shadow-2xs">
              <div class="flex items-center justify-center gap-1"><span>⏳</span><span>過去源起 (Past)</span></div>
              <div class="flex items-center justify-center gap-1 text-amber-950 font-black"><span>🌟</span><span>當前核心 (Present)</span></div>
              <div class="flex items-center justify-center gap-1"><span>🚀</span><span>未來走向 (Future)</span></div>
            </div>

            <div class="grid grid-cols-3 gap-2.5 sm:gap-3.5 p-2.5 sm:p-4 rounded-2xl bg-stone-900/5 border border-stone-300/70 shadow-inner">
              ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => {
                const isCenter = (idx === 4);
                return `
                  <div class="relative flex flex-col items-center justify-center ${isCenter ? 'ring-2 ring-amber-400 rounded-2xl bg-amber-400/10 p-1 sm:p-1.5 shadow-md' : ''}">
                    ${isCenter ? '<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20"><span class="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black shadow-md tracking-wider">★ 核心命門</span></div>' : ''}
                    ${this.renderFlipCardSingleHtml(idx, 'nine_box')}
                  </div>
                `;
              }).join('')}
            </div>

            <div class="flex flex-wrap items-center justify-between text-[11px] font-bold text-stone-500 px-2 gap-1">
              <span>💡 橫向透視：上層思維意向 ｜ 中層核心現實 ｜ 下層物質行動</span>
              <span>縱向脈絡：左欄過去因由 ➔ 中欄核心焦點 ➔ 右欄未來趨勢</span>
            </div>
          </div>
        `;
      } else if (layout === 'grand_tableau' && this.selectedCards.length >= 36) {
        // 雷諾曼大藍圖 (8x4 + 4)
        return `
          <div class="w-full max-w-[1300px] mx-auto p-2 sm:p-5 rounded-3xl bg-[#0F1715] border-2 border-[#C8A97E]/70 shadow-2xl overflow-x-auto">
            <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#182622] rounded-2xl border border-[#C8A97E]/60 text-[#F7E7CE] shadow-md mb-3 min-w-[760px]">
              <div class="flex items-center gap-2">
                <span class="text-sm font-black font-serif">🌟 雷諾曼大藍圖全覽神殿 (Grand Tableau · 8×4 + 4)</span>
                <span class="text-[11px] text-amber-200/70 hidden sm:inline">36 宮位全相投影 · 命運全方位綜觀</span>
              </div>
              <div class="flex items-center gap-3 text-xs">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-400 bg-blue-900/60 text-blue-200 font-bold">
                  <span class="w-2 h-2 rounded-full bg-blue-400"></span> 男人 (28 號主角)
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-pink-400 bg-pink-900/60 text-pink-200 font-bold">
                  <span class="w-2 h-2 rounded-full bg-pink-400"></span> 女人 (29 號主角)
                </span>
              </div>
            </div>
            <div class="space-y-3 min-w-[760px]">
              ${[0, 1, 2, 3].map(rowIdx => `
                <div class="grid grid-cols-8 gap-1.5 sm:gap-2">
                  ${Array.from({ length: 8 }).map((_, colIdx) => {
                    const idx = rowIdx * 8 + colIdx;
                    return this.renderFlipCardSingleHtml(idx, 'tableau');
                  }).join('')}
                </div>
              `).join('')}
              <div class="grid grid-cols-8 gap-1.5 sm:gap-2 pt-2">
                <div class="col-span-2"></div>
                ${[32, 33, 34, 35].map(idx => this.renderFlipCardSingleHtml(idx, 'tableau')).join('')}
                <div class="col-span-2"></div>
              </div>
            </div>
          </div>
        `;
      } else if (layout === 'single' && this.selectedCards.length >= 1) {
        // 單張神諭指引
        return `
          <div class="max-w-md mx-auto flex flex-col items-center p-2">
            <div class="text-center text-xs font-black text-amber-900 bg-amber-50/90 py-2 px-6 rounded-xl border border-amber-200/80 shadow-2xs mb-4">
              🎯 今日核心神諭指引 (Core Oracle Focus)
            </div>
            <div class="w-52 sm:w-60">
              ${this.renderFlipCardSingleHtml(0, 'single')}
            </div>
          </div>
        `;
      } else {
        // 預設靈活網格
        return `
          <div class="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            ${this.selectedCards.map((_, idx) => this.renderFlipCardSingleHtml(idx)).join('')}
          </div>
        `;
      }
    }

    // 渲染單個翻牌卡片的 3D Flip DOM (支援凱爾特十字、紫微三方四正、十二宮天盤、九宮格等尺寸)
    renderFlipCardSingleHtml(idx, size = 'default') {
      const item = this.selectedCards[idx];
      if (!item) return '';

      const { card, isReversed, role } = item;
      const db = window.MeetJoyDivination || {};
      const isLenormand = card.system === 'lenormand';
      const isTarot = card.system === 'tarot';
      const isZiwei = card.system === 'ziwei';
      const hasImg = !!card.image;

      const isTableau = size === 'tableau';
      const isNineBox = size === 'nine_box';
      const isCrossFive = size === 'cross_five';
      const isCeltic = size === 'celtic';
      const isSanFang = size === 'sanfang';
      const isTwelve = size === 'twelve';
      const isTwelveCourt = size === 'twelve-court';
      const isThree = size === 'three';
      const isFive = size === 'five';
      const isSingle = size === 'single';

      const isMan = card.id === 'l_28' || String(card.name).includes('男人') || String(card.name).includes('紳士');
      const isWoman = card.id === 'l_29' || String(card.name).includes('女人') || String(card.name).includes('淑女');

      const cardAspect = isTarot ? 'aspect-[1/1.52]' : (isZiwei ? 'aspect-[1/1.83]' : 'aspect-[1/1.54]');

      let cardSceneClass = '';
      let cardSceneStyle = '';

      if (isCeltic) {
        cardSceneClass = 'w-full h-full';
        cardSceneStyle = 'width: var(--c-w, 78px); height: var(--c-h, 120px);';
      } else if (isSanFang || isTwelve || isTwelveCourt) {
        cardSceneClass = `w-full ${cardAspect}`;
      } else if (isTableau || isNineBox || isCrossFive) {
        cardSceneClass = `w-full ${cardAspect}`;
      } else if (isFive) {
        cardSceneClass = `w-full max-w-[130px] sm:max-w-[170px] ${cardAspect}`;
      } else if (isThree) {
        cardSceneClass = `w-full max-w-[175px] sm:max-w-[210px] ${cardAspect}`;
      } else if (isSingle) {
        cardSceneClass = `w-52 sm:w-60 ${cardAspect}`;
      } else {
        const isMobile = window.innerWidth < 640;
        cardSceneStyle = `width: ${isMobile ? '100px' : '136px'}; height: ${isMobile ? '160px' : '216px'};`;
      }

      let frontContentHtml = '';
      if (hasImg) {
        frontContentHtml = `
          <div class="w-full h-full rounded-xl overflow-hidden relative flex flex-col justify-between bg-stone-950">
            <img src="${card.image.includes('?') ? card.image : card.image + '?v=2026'}" alt="${card.name}" class="${isTarot ? 'tarot-card-image' : 'ziwei-card-image'} ${isReversed ? 'card-art-reversed' : ''} w-full h-full object-cover rounded-lg">
          </div>
        `;
      } else if (isLenormand && db.renderLenormandCardFace) {
        frontContentHtml = `
          <div class="w-full h-full rounded-xl overflow-hidden relative">
            ${db.renderLenormandCardFace(card)}
          </div>
        `;
      } else if (db.renderUkiyoeArt) {
        frontContentHtml = `
          <div class="w-full h-full rounded-xl overflow-hidden relative">
            ${db.renderUkiyoeArt(card, card.system)}
          </div>
        `;
      } else {
        frontContentHtml = `
          <div class="w-full h-full flex flex-col justify-between p-2 bg-[#FAF6ED] rounded-xl border border-[#C8A97E] relative overflow-hidden">
            <span class="text-[10px] font-mono font-bold text-stone-600">${card.name}</span>
            <div class="my-auto flex flex-col items-center ${isReversed ? 'rotate-180' : ''}">
              <span class="text-3xl">${card.symbol || '🎴'}</span>
              <span class="text-xs font-black text-stone-800 mt-1">${card.name}</span>
            </div>
            <span class="text-[10px] font-black text-center ${isReversed ? 'text-amber-800 bg-amber-100' : 'text-emerald-800 bg-emerald-100'} rounded py-0.5">${isReversed ? '逆位' : '正位'}</span>
          </div>
        `;
      }

      const specialGlow = isMan ? 'ring-3 ring-blue-500 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.8)]' : (isWoman ? 'ring-3 ring-pink-500 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.8)]' : '');

      const showRoleTag = !isTableau && !isCeltic && !isTwelve && !isSanFang;
      const showBottomText = !isCeltic && !isTwelve && !isTableau;
      const celticBadge = isCeltic ? `
        <div class="celtic-pos-badge" title="${role || ''}">
          ${idx + 1}
        </div>
      ` : '';
      const tableauBadge = isTableau ? `
        <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span class="px-1.5 py-0.2 rounded-full ${idx >= 32 ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-900/90 border border-stone-600 text-stone-300 font-mono'} text-[8px] shadow-xs whitespace-nowrap">
            ${idx >= 32 ? `★ ${idx + 1}` : `H${idx + 1}`}
          </span>
        </div>
      ` : '';

      return `
        <div class="flowing-card-unit flex flex-col items-center gap-1.5 w-full ${specialGlow} relative cursor-pointer select-none group" data-card-idx="${idx}" title="點擊翻牌，已翻開點擊可放大檢視">
          ${showRoleTag && role ? `<span class="text-[10px] sm:text-[11px] font-bold text-stone-700 bg-stone-100 px-2 sm:px-2.5 py-0.5 rounded-full border border-stone-200 whitespace-nowrap shadow-2xs">${role}</span>` : ''}
          ${celticBadge}
          ${tableauBadge}
          <div class="card-scene ${cardSceneClass}" style="${cardSceneStyle}" data-card-idx="${idx}">
            <div class="card-inner w-full h-full relative" style="transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);">
              <!-- 卡背 -->
              <div class="card-face card-back absolute inset-0 rounded-xl border-2 border-[#C8A97E] ${card.cardBackClass} flex items-center justify-center shadow-md group-hover:border-amber-400 transition">
                ${isLenormand ? `
                  <div class="relative flex flex-col items-center justify-center p-2 text-center pointer-events-none select-none">
                    <div class="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-amber-300/60 bg-black/40 flex items-center justify-center mb-0.5 shadow-md">
                      <span class="text-xs sm:text-base text-amber-200">⚜️</span>
                    </div>
                    <span class="text-[8px] sm:text-[9px] font-black text-amber-100 font-cinzel tracking-wider">LENORMAND</span>
                  </div>
                ` : `
                  ${card.backImage ? `<img src="${card.backImage.includes('?') ? card.backImage : card.backImage + '?v=2026'}" alt="牌背" class="card-back-image" onerror="this.remove()">` : ''}
                  <div class="w-8 h-8 rounded-full border border-[#C8A97E]/40 flex items-center justify-center text-amber-200/60 text-xs relative z-10">${isTarot ? '✦' : '鶴'}</div>
                `}
              </div>
              <!-- 卡面 -->
              <div class="card-face card-front absolute inset-0 rounded-xl shadow-lg cursor-zoom-in ${isLenormand ? 'p-0 bg-[#FDFBF7] border border-[#C5A059]' : 'p-1 bg-stone-900 border-2 border-[#C8A97E]/80'}" style="transform: rotateY(180deg); backface-visibility: hidden;">
                ${frontContentHtml}
                <!-- 放大幻燈片提示徽章 -->
                <div class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 flex items-center justify-center text-[10px] text-amber-200 opacity-0 group-hover:opacity-100 transition shadow-xs pointer-events-none">
                  🔍
                </div>
              </div>
            </div>
          </div>
          ${showBottomText ? `
            <span class="text-xs font-serif font-black ${isTwelveCourt ? 'text-amber-100' : 'text-[#1F261C]'} mt-0.5 text-center group-hover:text-amber-700 transition">${card.name} ${!isLenormand ? (isReversed ? '<span class=\"text-[10px] text-rose-700\">(逆)</span>' : '<span class=\"text-[10px] text-emerald-700\">(正)</span>') : ''}</span>
          ` : ''}
        </div>
      `;
    }

    // 檢查若有翻開卡牌，即刻展現愛倫生活魔藥總結
    checkAndRenderPotionSummary(revealArea) {
      const summaryBox = revealArea.querySelector('#flowing_potion_summary');
      const contentBox = revealArea.querySelector('#flowing_potion_content');
      if (!summaryBox || !contentBox) return;

      summaryBox.classList.remove('hidden');

      let summaryHtml = '<div class="space-y-3">';
      this.selectedCards.forEach((item, idx) => {
        const { card, isReversed, role } = item;
        const text = isReversed ? (card.reversed || card.upright) : card.upright;
        const potion = card.potion || '雪松精油 + 白水晶，穩定心神接地氣。';

        summaryHtml += `
          <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-amber-300 font-mono">[${role}]</span>
              <span class="text-sm font-black text-white">${card.name} (${isReversed ? '逆位' : '正位'})</span>
            </div>
            <p class="text-xs text-stone-300 leading-relaxed">${text || '啟發心念轉化，聚焦生活實踐。'}</p>
            <div class="mt-2 text-[11px] text-amber-200/90 flex items-center gap-1.5">
              <span>🌿 生活魔藥處方：</span>
              <span class="font-bold">${potion}</span>
            </div>
          </div>
        `;
      });
      summaryHtml += '</div>';

      contentBox.innerHTML = summaryHtml;

      // 綁定複製 Prompt
      const copyBtn = revealArea.querySelector('#btn_copy_flowing_prompt');
      if (copyBtn) {
        copyBtn.onclick = () => {
          let promptText = `【癒見幸福 · 魔法占星學院排盤解讀】\n`;
          if (this.question) promptText += `問卜核心：${this.question}\n`;
          promptText += `使用牌陣：${this.spread.name}\n\n`;
          this.selectedCards.forEach((item, idx) => {
            promptText += `${item.role}：${item.card.name} (${item.isReversed ? '逆位' : '正位'})\n- 關鍵意象：${item.isReversed ? item.card.reversed : item.card.upright}\n- 生活處方：${item.card.potion || '天然草本調頻'}\n\n`;
          });
          promptText += `請以「生活魔藥師愛倫」的幽默溫暖語調，先給答案再解釋，為我深度解析此局勢的底層心理動力與下一步可行方案。`;

          navigator.clipboard.writeText(promptText).then(() => {
            copyBtn.innerHTML = '<span>✅ 已複製到剪貼簿！</span>';
            setTimeout(() => {
              copyBtn.innerHTML = '<span>📋 複製 AI 深度解讀提示詞</span>';
            }, 2000);
          });
        };
      }
    }
  }

  global.FlowingDivination = FlowingDivination;

})(typeof window !== 'undefined' ? window : this);
