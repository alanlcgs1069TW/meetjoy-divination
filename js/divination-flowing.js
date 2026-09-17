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
      { key: 'single', name: '🎯 單張神諭 (今日指引與即刻處方)', count: 1, labels: ['當前核心指引'], layout: 'single' },
      { key: 'two', name: '⚖️ 兩張牌 (日常問卜 · 核心與建議)', count: 2, labels: ['1. 當前核心狀況', '2. 破局行動建言'], layout: 'grid' }
    ],
    ziwei: [
      { key: 'three_decks', name: '🌟 三組牌各一張牌陣 (主星 + 輔星 + 長生星)', count: 3, labels: ['1. 主星牌 (核心運勢)', '2. 輔星牌 (環境催化)', '3. 長生牌 (時序旺衰)'], layout: 'time_stream' },
      { key: 'two', name: '☯️ 主輔雙星 (本質與助力雙盤催化)', count: 2, labels: ['1. 本命主星 (內在心態)', '2. 催化輔星 (外部助力)'], layout: 'grid' },
      { key: 'single', name: '🎯 單星神諭 (今日主導星宿能量)', count: 1, labels: ['今日星宿指引'], layout: 'single' }
    ],
    lenormand: [
      { key: 'timeline', name: '⏳ 時間之流牌陣 (起因 ➔ 當前 ➔ 走向 · ☀️🌙⭐)', count: 3, labels: ['1. 起因源頭', '2. 當前關鍵', '3. 發展走向'], layout: 'time_stream' },
      { key: 'triangle', name: '🔺 聖三角抉擇牌陣 (起因 · 核心 · 破局 · 正三角拱照)', count: 3, labels: ['1. 起因源頭', '2. 當前核心課題', '3. 破局建言'], layout: 'triangle' },
      { key: 'two_choices', name: '⚖️ 二擇一抉擇牌陣 (現況 ➔ 途徑A vs 途徑B · V字雙翼)', count: 5, labels: ['1. 當事人現況', '2. 選擇A當前狀況', '3. 選擇A未來發展', '4. 選擇B當前狀況', '5. 選擇B未來發展'], layout: 'two_choices' },
      { key: 'three_choices', name: '🔱 三擇一抉擇牌陣 (現況 · 阻礙 · 環境 ➔ A/B/C 三叉戟發展)', count: 9, labels: [
        '1. 當前現況', '2. 潛在阻礙', '3. 外在環境',
        '4. 選擇A狀況', '5. 選擇A之後發展',
        '6. 選擇B狀況', '7. 選擇B之後發展',
        '8. 選擇C狀況', '9. 選擇C之後發展'
      ], layout: 'three_choices' },
      { key: 'nine_box', name: '🎴 九張牌九宮格牌陣 (3x3 Box Spread · 大局透視)', count: 9, labels: [
        '1. 過去思維', '2. 當前環境', '3. 未來指引',
        '4. 過去感受', '5. 核心命門', '6. 未來走向',
        '7. 過去行動', '8. 外在考驗', '9. 最終啟示'
      ], layout: 'nine_box' },
      { key: 'five_cards', name: '✨ 五張牌牌陣 (過去 ➔ 影響 ➔ 核心 ➔ 考驗 ➔ 結果)', count: 5, labels: ['1. 過去背景', '2. 外部影響', '3. 核心焦點', '4. 課題考驗', '5. 最終趨勢'], layout: 'five_cards' },
      { key: 'grand_tableau', name: '🌟 大藍圖全覽大牌陣 (Grand Tableau · 36張全套 8x4+4 沙龍正統)', count: 36, labels: Array.from({length: 36}, (_, i) => `第 ${i + 1} 宮位`), layout: 'grand_tableau' },
      { key: 'single', name: '🌱 單張微運 (今日生活核心象徵)', count: 1, labels: ['今日核心象徵'], layout: 'single' },
      { key: 'two', name: '🌿 兩張牌 (日常問卜 · 鏡像串連)', count: 2, labels: ['1. 起因關鍵', '2. 走向建議'], layout: 'grid' }
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
        let list = [];
        if (window.ZIWEI_CARDS_COMPLETE) {
          list = [
            ...(window.ZIWEI_CARDS_COMPLETE.main || []),
            ...(window.ZIWEI_CARDS_COMPLETE.aux || []),
            ...(window.ZIWEI_CARDS_COMPLETE.life || [])
          ];
        }
        return list.map(c => ({
          ...c,
          system: 'ziwei',
          isReversed: c.group === 'aux' ? false : (Math.random() > 0.7),
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

      const wrapper = document.createElement('div');
      wrapper.className = 'flowing-zen-wrapper w-full max-w-5xl mx-auto flex flex-col items-center select-none';

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
      shuffleArea.className = 'w-full flex flex-col items-center relative py-4';

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
      let lastX = 0, lastY = 0;

      // 流體物理洗牌互動：手勢滑動時擾動周圍卡牌
      const applyFluidDistortion = (clientX, clientY) => {
        const rect = stage.getBoundingClientRect();
        const stageCenterX = rect.left + rect.width / 2;
        const stageCenterY = rect.top + rect.height / 2;
        const pointerRelX = clientX - stageCenterX;
        const pointerRelY = clientY - stageCenterY;

        const deltaX = clientX - lastX;
        const deltaY = clientY - lastY;
        lastX = clientX;
        lastY = clientY;

        const cards = cardWrap.children;
        for (let i = 0; i < cards.length; i++) {
          const cardEl = cards[i];
          const bx = parseFloat(cardEl.getAttribute('data-base-x'));
          const by = parseFloat(cardEl.getAttribute('data-base-y'));
          const brot = parseFloat(cardEl.getAttribute('data-base-rot'));

          // 計算卡牌相對於手指的距離
          const dx = bx - pointerRelX;
          const dy = by - pointerRelY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            // 距離越近，擾動力越強
            const force = (1 - dist / 130) * 28;
            const angleFromPointer = Math.atan2(dy, dx);
            const pushX = Math.cos(angleFromPointer) * force + deltaX * 0.4;
            const pushY = Math.sin(angleFromPointer) * force + deltaY * 0.4;
            const swirlRot = brot + (deltaX - deltaY) * 0.5;

            cardEl.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${swirlRot}deg) scale(1.05)`;
          } else {
            // 輕微渦流擾動
            cardEl.style.transform = `translate(${deltaX * 0.1}px, ${deltaY * 0.1}px) rotate(${brot}deg)`;
          }
        }
      };

      // Pointer / Mouse 事件
      stage.addEventListener('pointerdown', (e) => {
        isInteracting = true;
        lastX = e.clientX;
        lastY = e.clientY;
        if (stage.setPointerCapture) {
          try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });

      const onPointerMove = (e) => {
        if (!isInteracting) return;
        applyFluidDistortion(e.clientX, e.clientY);
      };

      const onPointerUp = () => {
        if (!isInteracting) return;
        isInteracting = false;
        // 平滑回彈至基底位置
        const cards = cardWrap.children;
        for (let i = 0; i < cards.length; i++) {
          const brot = cards[i].getAttribute('data-base-rot');
          cards[i].style.transform = `translate(0px, 0px) rotate(${brot}deg) scale(1)`;
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      // 行動端 Touch 事件相容強化
      stage.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          isInteracting = true;
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        }
      }, { passive: true });

      stage.addEventListener('touchmove', (e) => {
        if (!isInteracting || !e.touches || !e.touches[0]) return;
        if (e.cancelable) e.preventDefault();
        applyFluidDistortion(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: false });

      stage.addEventListener('touchend', onPointerUp);

      // 自動旋轉洗牌按鈕
      const autoShuffleBtn = shuffleArea.querySelector('#btn_flowing_auto_shuffle');
      if (autoShuffleBtn) {
        autoShuffleBtn.addEventListener('click', () => {
          if (this.isAutoShuffling) return;
          this.isAutoShuffling = true;
          autoShuffleBtn.classList.add('opacity-50');

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
      fanArea.className = 'w-full flex flex-col items-center relative py-4 min-h-[580px] sm:min-h-[640px] justify-between';

      const targetCount = this.spread.count;
      const currentSelectedCount = this.selectedCards.length;
      const isGrandTableau = this.spread.key === 'grand_tableau';

      // 頂部目標卡槽（Slot）—— 固定寬高防止手機端高度塌陷
      const slotsHtml = Array.from({ length: targetCount }).map((_, idx) => {
        const cardDrawn = this.selectedCards[idx];
        const roleLabel = this.spread.labels[idx] || `第 ${idx + 1} 張`;

        if (cardDrawn) {
          return `
            <div class="flowing-slot filled flex flex-col items-center gap-1.5 shrink-0" data-slot-idx="${idx}">
              <div style="width: 56px; height: 86px; min-height: 86px;" class="rounded-xl border-2 border-[#C8A97E] shadow-md ${cardDrawn.card.cardBackClass} relative overflow-hidden transition-all scale-105 shrink-0 sm:!w-[70px] sm:!h-[105px] sm:!min-h-[105px]">
                <div class="absolute inset-0 bg-amber-400/10 animate-pulse"></div>
              </div>
              <span class="text-[9px] sm:text-xs font-bold text-[#182622] bg-[#EADFC7] px-2 py-0.5 rounded-full whitespace-nowrap">${roleLabel}</span>
            </div>
          `;
        } else {
          return `
            <div class="flowing-slot empty flex flex-col items-center gap-1.5 opacity-80 shrink-0" data-slot-idx="${idx}">
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
          <h3 class="text-xl sm:text-2xl font-serif font-black text-[#1F261C] mt-1">
            憑直覺抽出 ${targetCount} 張（已選 ${currentSelectedCount} / ${targetCount}）
          </h3>
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

        <!-- 底部拱弧扇形展牌舞台 -->
        <div class="relative w-full max-w-[820px] h-[260px] sm:h-[320px] mt-4 flex items-end justify-center overflow-hidden">
          <div id="flowing_arc_fan" class="absolute bottom-[-180px] sm:bottom-[-220px] w-[500px] h-[500px] sm:w-[640px] sm:h-[640px] rounded-full pointer-events-none">
            <!-- 扇形卡牌動態插入於此 -->
          </div>
        </div>
      `;

      wrapper.appendChild(fanArea);

      // 動態生成孔雀開屏極座標扇形卡牌
      const fanContainer = fanArea.querySelector('#flowing_arc_fan');
      const totalDisplay = Math.min(this.deck.length, 36);
      const startDeg = -52;
      const endDeg = 52;
      const stepDeg = (endDeg - startDeg) / (totalDisplay - 1);

      for (let i = 0; i < totalDisplay; i++) {
        const card = this.deck[i];
        const angle = startDeg + i * stepDeg;

        const cardBtn = document.createElement('div');
        cardBtn.className = `absolute left-1/2 bottom-1/2 w-14 h-24 sm:w-16 sm:h-28 rounded-xl shadow-lg border border-[#C8A97E] ${card.cardBackClass} cursor-pointer pointer-events-auto transition-all duration-200 origin-bottom`;
        cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        cardBtn.setAttribute('data-fan-index', i);
        cardBtn.setAttribute('data-card-id', card.id);

        // Hover / Active 向上浮起效果
        cardBtn.addEventListener('mouseenter', () => {
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-24px) scale(1.08)`;
          cardBtn.style.zIndex = '50';
          cardBtn.style.boxShadow = '0 12px 24px rgba(200, 169, 126, 0.6)';
        });
        cardBtn.addEventListener('mouseleave', () => {
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg)`;
          cardBtn.style.zIndex = `${i}`;
          cardBtn.style.boxShadow = '';
        });

        // 點擊抽牌
        cardBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.pickCard(i, card);
        });

        fanContainer.appendChild(cardBtn);
      }

      // 自動選牌按鈕
      fanArea.querySelector('#btn_flowing_auto_pick').addEventListener('click', () => {
        this.autoPickRemaining();
      });

      fanArea.querySelector('#btn_flowing_reshuffle').addEventListener('click', () => {
        this.startShuffleStage();
      });
    }

    // 抽出一張牌
    pickCard(fanIndex, card) {
      if (this.selectedCards.length >= this.spread.count) return;

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
        setTimeout(() => {
          this.step = 'reveal';
          this.allFlipped = false;
          this.render();
        }, 400);
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
      for (let i = 0; i < needed; i++) {
        if (availableIndices.length === 0) break;
        const rIdx = Math.floor(Math.random() * availableIndices.length);
        const fanIndex = availableIndices.splice(rIdx, 1)[0];
        const card = this.deck[fanIndex];
        const slotIdx = this.selectedCards.length;
        const role = this.spread.labels[slotIdx] || `第 ${slotIdx + 1} 張`;

        this.selectedCards.push({
          card,
          isReversed: card.isReversed,
          role,
          indexInFan: fanIndex
        });
      }

      setTimeout(() => {
        this.step = 'reveal';
        this.allFlipped = false;
        this.render();
      }, 350);
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
            <button type="button" id="btn_flowing_redraw" class="px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold transition cursor-pointer">
              🔄 再抽一次
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

      // 綁定所有卡牌翻轉事件
      revealArea.querySelectorAll('.card-scene').forEach(sceneEl => {
        const innerEl = sceneEl.querySelector('.card-inner');
        sceneEl.addEventListener('click', () => {
          innerEl.classList.toggle('flipped');
          this.checkAndRenderPotionSummary(revealArea);
        });
      });

      // 全部翻開按鈕
      revealArea.querySelector('#btn_flowing_flip_all').addEventListener('click', () => {
        revealArea.querySelectorAll('.card-inner').forEach(el => el.classList.add('flipped'));
        this.checkAndRenderPotionSummary(revealArea);
      });

      // 重新抽取
      revealArea.querySelector('#btn_flowing_redraw').addEventListener('click', () => {
        this.startShuffleStage();
      });
    }

    // 依牌陣佈局產出翻牌區結構 HTML
    renderRevealLayoutHtml(layout) {
      if (layout === 'triangle' && this.selectedCards.length >= 3) {
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
      } else if (layout === 'grand_tableau' && this.selectedCards.length >= 36) {
        // 雷諾曼大藍圖 (8x4 + 4)
        return `
          <div class="w-full max-w-[1300px] mx-auto p-2 sm:p-5 rounded-3xl bg-[#0F1715] border-2 border-[#C8A97E]/70 shadow-2xl overflow-x-auto">
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
      } else {
        // 預設靈活網格
        return `
          <div class="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            ${this.selectedCards.map((_, idx) => this.renderFlipCardSingleHtml(idx)).join('')}
          </div>
        `;
      }
    }

    // 渲染單個翻牌卡片的 3D Flip DOM
    renderFlipCardSingleHtml(idx, size = 'default') {
      const item = this.selectedCards[idx];
      if (!item) return '';

      const { card, isReversed, role } = item;
      const db = window.MeetJoyDivination || {};
      const isLenormand = card.system === 'lenormand';
      const isTarot = card.system === 'tarot';
      const hasImg = !!card.image;

      const isTableau = size === 'tableau';
      const isMan = card.id === 'l_28' || String(card.name).includes('男人') || String(card.name).includes('紳士');
      const isWoman = card.id === 'l_29' || String(card.name).includes('女人') || String(card.name).includes('淑女');

      const isMobile = window.innerWidth < 640;
      let cardWidth = isMobile ? '100px' : '136px';
      let cardHeight = isMobile ? '160px' : '216px';

      if (isTableau) {
        cardWidth = '100%';
        cardHeight = 'auto';
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

      return `
        <div class="flex flex-col items-center gap-1.5 ${specialGlow}">
          ${!isTableau ? `<span class="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 whitespace-nowrap shadow-2xs">${role}</span>` : ''}
          <div class="card-scene cursor-pointer ${isTableau ? 'w-full aspect-[1/1.54]' : ''}" style="${!isTableau ? `width: ${cardWidth}; height: ${cardHeight};` : ''}" data-card-idx="${idx}">
            <div class="card-inner w-full h-full relative" style="transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);">
              <!-- 卡背 -->
              <div class="card-face card-back absolute inset-0 rounded-xl border-2 border-[#C8A97E] ${card.cardBackClass} flex items-center justify-center shadow-md">
                ${card.backImage ? `<img src="${card.backImage.includes('?') ? card.backImage : card.backImage + '?v=2026'}" alt="牌背" class="card-back-image" onerror="this.remove()">` : ''}
                <div class="w-8 h-8 rounded-full border border-[#C8A97E]/40 flex items-center justify-center text-amber-200/60 text-xs relative z-10">✦</div>
              </div>
              <!-- 卡面 -->
              <div class="card-face card-front absolute inset-0 rounded-xl shadow-lg ${isLenormand ? 'p-0 bg-[#FDFBF7] border border-[#C5A059]' : 'p-1 bg-stone-900 border-2 border-[#C8A97E]/80'}" style="transform: rotateY(180deg); backface-visibility: hidden;">
                ${frontContentHtml}
              </div>
            </div>
          </div>
          <span class="text-xs font-serif font-black text-[#1F261C] mt-0.5 text-center">${card.name} ${!isLenormand ? (isReversed ? '<span class=\"text-[10px] text-rose-700\">(逆)</span>' : '<span class=\"text-[10px] text-emerald-700\">(正)</span>') : ''}</span>
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
