/**
 * 癒見幸福 · 魔法占星學院
 * 線上占卜大典「沉浸流動模式」 (Flowing Zen Mode Controller)
 * 參考 Stargazer's Oracle 核心流動設計：
 * 1. 心念聚焦 (Focus / Input)
 * 2. 散牌混洗 (Fluid Shuffle · 桌面散牌物理長按混洗)
 * 3. 拱弧展牌 (Card Fan Arc · 孔雀開屏扇形極座標展開與直覺抽牌)
 * 4. 3D 翻牌與生活魔藥解讀 (Reveal & Elixir Reading)
 * 完美相容 偉特塔羅 (78張) / 紫微斗數牌卡 (70張) / 雷諾曼 (36張)
 * 100% 繁體中文（台灣）· Zero Attribution
 */

(function (global) {
  'use strict';

  // 流動模式專屬牌陣定義
  const FLOWING_SPREADS = {
    tarot: [
      { key: 'single', name: '🎯 單張神諭 (今日指引與即刻處方)', count: 1, labels: ['當前核心指引'] },
      { key: 'two', name: '⚖️ 兩張牌 (日常問卜 · 核心與建議)', count: 2, labels: ['1. 當前核心狀況', '2. 破局行動建言'] },
      { key: 'timeline', name: '⏳ 三張牌 (時間之流 · 過去/現在/未來)', count: 3, labels: ['1. 源頭過去', '2. 當前核心', '3. 潛在走向'] },
      { key: 'four_elements', name: '🔮 四要素平衡 (火/水/風/土)', count: 4, labels: ['1. 行動意志 (火)', '2. 情緒感知 (水)', '3. 思維理智 (風)', '4. 物質落地 (土)'] },
      { key: 'five_cards', name: '✨ 五張牌 (局勢全景深度透視)', count: 5, labels: ['1. 過去起因', '2. 外部環境', '3. 核心焦點', '4. 考驗障礙', '5. 最終趨勢'] }
    ],
    ziwei: [
      { key: 'single', name: '🎯 單星神諭 (今日主導星宿能量)', count: 1, labels: ['今日星宿指引'] },
      { key: 'two', name: '☯️ 主輔雙星 (本質與助力雙盤催化)', count: 2, labels: ['1. 本命主星 (內在心態)', '2. 催化輔星 (外部助力)'] },
      { key: 'three_decks', name: '🌟 三組牌陣 (主星 + 輔星 + 長生星)', count: 3, labels: ['1. 主星牌 (核心運勢)', '2. 輔星牌 (環境催化)', '3. 長生牌 (時序旺衰)'] }
    ],
    lenormand: [
      { key: 'single', name: '🌱 單張微運 (今日生活核心象徵)', count: 1, labels: ['今日象徵'] },
      { key: 'two', name: '🌿 兩張牌 (日常問卜 · 鏡像串連)', count: 2, labels: ['1. 起因關鍵', '2. 走向建議'] },
      { key: 'three_cards', name: '✨ 三張牌 (起因 ➔ 現況 ➔ 走向)', count: 3, labels: ['1. 起因源頭', '2. 當前關鍵', '3. 發展走向'] },
      { key: 'five_cards', name: '🎴 五張牌 (過去 ➔ 影響 ➔ 核心 ➔ 考驗 ➔ 結果)', count: 5, labels: ['1. 過去背景', '2. 外部影響', '3. 核心焦點', '4. 課題考驗', '5. 最終趨勢'] },
      { key: 'nine_box', name: '🏛️ 九宮格 (3x3 Box Spread · 大局透視)', count: 9, labels: [
        '1. 過去思維', '2. 當前環境', '3. 未來指引',
        '4. 過去感受', '5. 核心命門', '6. 未來走向',
        '7. 過去行動', '8. 外在考驗', '9. 最終啟示'
      ]}
    ]
  };

  class FlowingDivination {
    constructor(container) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      this.system = 'lenor'; // 'tarot' | 'ziwei' | 'lenormand'
      this.step = 'focus'; // 'focus' | 'shuffle' | 'fan' | 'reveal'
      this.spread = null;
      this.question = '';
      this.deck = [];
      this.selectedCards = []; // [{ card, isReversed, role, indexInFan }]
      this.isDraggingShuffle = false;
      this.shuffleProgress = 0;
      this.allFlipped = false;
    }

    init(system = 'lenormand', spreadKey = null) {
      this.system = system;
      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;
      this.spread = (spreadKey && spreads.find(s => s.key === spreadKey)) ? spreads.find(s => s.key === spreadKey) : spreads[1] || spreads[0];
      this.step = 'focus';
      this.selectedCards = [];
      this.render();
    }

    setSystem(system) {
      this.system = system;
      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;
      this.spread = spreads[1] || spreads[0];
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
        // 雷諾曼
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

      switch (this.step) {
        case 'focus':
          this.renderFocusStep(wrapper);
          break;
        case 'shuffle':
          this.renderShuffleStep(wrapper);
          break;
        case 'fan':
          this.renderFanStep(wrapper);
          break;
        case 'reveal':
          this.renderRevealStep(wrapper);
          break;
      }

      this.container.appendChild(wrapper);
    }

    // ─── 階段 1：問題輸入與牌陣聚焦 ───
    renderFocusStep(wrapper) {
      const spreads = FLOWING_SPREADS[this.system] || FLOWING_SPREADS.lenormand;

      const card = document.createElement('div');
      card.className = 'w-full max-w-2xl bg-[#FFFDF9] border border-[#E5DAC6] rounded-3xl p-6 sm:p-10 shadow-sm text-stone-800 flex flex-col items-center text-center mt-2 sm:mt-6';

      // 牌系切換小按鈕
      const systemButtonsHtml = `
        <div class="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/80 mb-6 text-xs font-black">
          <button type="button" class="flowing-sys-btn px-3.5 py-1.5 rounded-xl transition ${this.system === 'tarot' ? 'bg-[#182622] text-[#F7E7CE] shadow-xs' : 'text-stone-600 hover:text-stone-900'}" data-sys="tarot">
            🎴 韋特塔羅 (78張)
          </button>
          <button type="button" class="flowing-sys-btn px-3.5 py-1.5 rounded-xl transition ${this.system === 'ziwei' ? 'bg-[#182622] text-[#F7E7CE] shadow-xs' : 'text-stone-600 hover:text-stone-900'}" data-sys="ziwei">
            🔮 紫微斗數 (70張)
          </button>
          <button type="button" class="flowing-sys-btn px-3.5 py-1.5 rounded-xl transition ${this.system === 'lenormand' ? 'bg-[#182622] text-[#F7E7CE] shadow-xs' : 'text-stone-600 hover:text-stone-900'}" data-sys="lenormand">
            🌿 法式雷諾曼 (36張)
          </button>
        </div>
      `;

      // 牌陣選擇按鈕列
      const spreadOptionsHtml = spreads.map(s => {
        const isSel = s.key === this.spread.key;
        return `
          <button type="button" class="flowing-spread-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border transition whitespace-nowrap ${isSel ? 'bg-[#C8A97E] text-[#182622] border-[#C8A97E] shadow-xs' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}" data-spread-key="${s.key}">
            ${s.name}
          </button>
        `;
      }).join('');

      card.innerHTML = `
        ${systemButtonsHtml}

        <span class="text-[11px] font-mono tracking-widest uppercase text-stone-400 font-bold mb-2">
          ${this.spread.name.split('(')[0]} · ${this.spread.count} 張牌
        </span>
        <h2 class="text-2xl sm:text-4xl font-serif font-black text-[#1F261C] mb-4">
          請於心田中默想您的問題
        </h2>
        <p class="text-stone-500 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg">
          放緩呼吸，將注意力集中在您此刻最想釐清的情境或對象上。您也可以直接點擊開始抽牌，以靈感共振宇宙神諭。
        </p>

        <!-- 牌陣切換列 -->
        <div class="w-full flex items-center justify-center gap-2 flex-wrap mb-6">
          ${spreadOptionsHtml}
        </div>

        <!-- 輸入框 -->
        <div class="w-full relative mb-6">
          <textarea id="flowing_question_input" rows="3" maxlength="200" placeholder="我想詢問的是......（可不填，直接開啟凝神抽牌）" class="w-full p-4 rounded-2xl border border-stone-200 bg-[#FAF7F0] focus:bg-white focus:border-[#C8A97E] focus:outline-none text-stone-800 text-sm font-serif leading-relaxed resize-none transition shadow-inner">${this.question}</textarea>
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
      this.render();
    }

    // ─── 階段 2：散牌混洗 (Fluid Shuffle) ───
    renderShuffleStep(wrapper) {
      const shuffleArea = document.createElement('div');
      shuffleArea.className = 'w-full flex flex-col items-center relative py-6';

      shuffleArea.innerHTML = `
        <div class="text-center mb-4">
          <span class="text-xs font-serif text-[#C8A97E] font-black tracking-widest uppercase">SHUFFLE · 靈感洗牌</span>
          <h3 class="text-xl sm:text-2xl font-serif font-black text-[#1F261C] mt-1">
            請在牌桌中心滑動或長按洗牌
          </h3>
          <p class="text-xs text-stone-500 mt-1">凝神專注，當您感受到能量已經就緒，即可點擊收牌。</p>
        </div>

        <!-- 散牌舞台 -->
        <div id="flowing_shuffle_stage" class="relative w-full max-w-[680px] h-[340px] sm:h-[420px] rounded-3xl bg-radial from-amber-50/70 via-stone-100/40 to-transparent border border-[#E5DAC6]/60 flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing">
          <!-- 中心呼吸光圈波紋 -->
          <div class="absolute w-28 h-28 rounded-full border-2 border-[#C8A97E]/40 animate-ping pointer-events-none opacity-40"></div>
          <div class="absolute w-20 h-20 rounded-full bg-[#C8A97E]/15 flex items-center justify-center pointer-events-none border border-[#C8A97E]/50 text-2xl shadow-inner">
            <span>✨</span>
          </div>

          <!-- 散落卡牌群 -->
          <div id="flowing_scattered_cards" class="absolute inset-0 w-full h-full pointer-events-none"></div>
        </div>

        <!-- 底部收牌按鈕 -->
        <div class="mt-6 flex items-center gap-3">
          <button type="button" id="btn_flowing_collect" class="px-8 py-3 rounded-full bg-[#182622] hover:bg-[#253a34] text-[#F7E7CE] border border-[#C8A97E] font-black text-sm transition-all shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer">
            <span>洗好了，收牌 ➔</span>
          </button>
          <button type="button" id="btn_flowing_back_focus" class="px-5 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-bold text-xs transition cursor-pointer">
            返回重設
          </button>
        </div>
      `;

      wrapper.appendChild(shuffleArea);

      // 動態生成散牌 DOM
      const cardWrap = shuffleArea.querySelector('#flowing_scattered_cards');
      const totalCards = Math.min(this.deck.length, 36); // 展示前 36 張以保證 60fps 流暢度

      for (let i = 0; i < totalCards; i++) {
        const el = document.createElement('div');
        el.className = `absolute rounded-xl shadow-md border border-[#C8A97E]/60 ${this.deck[i].cardBackClass} transition-transform duration-300`;
        el.style.width = '52px';
        el.style.height = '82px';

        // 隨機分佈在中心半徑 140px 的圓盤內
        const angle = Math.random() * Math.PI * 2;
        const r = 30 + Math.random() * 125;
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

      // 洗牌互動：監聽 pointerdown / move / up
      const stage = shuffleArea.querySelector('#flowing_shuffle_stage');
      let startX = 0, startY = 0;

      const onPointerMove = (e) => {
        if (!this.isDraggingShuffle) return;
        const deltaX = (e.clientX || (e.touches && e.touches[0].clientX)) - startX;
        const deltaY = (e.clientY || (e.touches && e.touches[0].clientY)) - startY;

        const cards = cardWrap.children;
        for (let i = 0; i < cards.length; i++) {
          const cardEl = cards[i];
          const bx = parseFloat(cardEl.getAttribute('data-base-x'));
          const by = parseFloat(cardEl.getAttribute('data-base-y'));
          const brot = parseFloat(cardEl.getAttribute('data-base-rot'));

          // 產生渦流旋轉擾動
          const lag = (i % 5 + 1) * 0.15;
          const nx = bx + deltaX * lag;
          const ny = by + deltaY * lag;
          const nrot = brot + deltaX * 0.3;

          cardEl.style.transform = `translate(${deltaX * lag}px, ${deltaY * lag}px) rotate(${nrot}deg)`;
        }
      };

      stage.addEventListener('pointerdown', (e) => {
        this.isDraggingShuffle = true;
        startX = e.clientX;
        startY = e.clientY;
      });

      window.addEventListener('pointermove', onPointerMove);

      const onPointerUp = () => {
        if (!this.isDraggingShuffle) return;
        this.isDraggingShuffle = false;
        // 回彈
        const cards = cardWrap.children;
        for (let i = 0; i < cards.length; i++) {
          const brot = cards[i].getAttribute('data-base-rot');
          cards[i].style.transform = `translate(0px, 0px) rotate(${brot}deg)`;
        }
      };

      window.addEventListener('pointerup', onPointerUp);

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

      // 頂部目標卡槽（Slot）
      const slotsHtml = Array.from({ length: targetCount }).map((_, idx) => {
        const cardDrawn = this.selectedCards[idx];
        const roleLabel = this.spread.labels[idx] || `第 ${idx + 1} 張`;

        if (cardDrawn) {
          return `
            <div class="flowing-slot filled flex flex-col items-center gap-1.5" data-slot-idx="${idx}">
              <div class="w-14 h-22 sm:w-18 sm:h-28 rounded-xl border-2 border-[#C8A97E] shadow-md ${cardDrawn.card.cardBackClass} relative overflow-hidden transition-all scale-105">
                <div class="absolute inset-0 bg-amber-400/10 animate-pulse"></div>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-[#182622] bg-[#EADFC7] px-2 py-0.5 rounded-full whitespace-nowrap">${roleLabel}</span>
            </div>
          `;
        } else {
          return `
            <div class="flowing-slot empty flex flex-col items-center gap-1.5 opacity-80" data-slot-idx="${idx}">
              <div class="w-14 h-22 sm:w-18 sm:h-28 rounded-xl border-2 border-dashed border-stone-300 bg-stone-100/60 flex items-center justify-center text-stone-400 text-xs font-mono">
                <span>${idx + 1}</span>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-stone-500 whitespace-nowrap">${roleLabel}</span>
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
              <span>✨ 自動選牌</span>
            </button>
            <button type="button" id="btn_flowing_reshuffle" class="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold border border-stone-300 transition cursor-pointer">
              <span>重新洗牌</span>
            </button>
          </div>
        </div>

        <!-- 頂部卡槽列 -->
        <div class="w-full flex items-center justify-center gap-3 sm:gap-6 my-2 px-2 overflow-x-auto no-scrollbar">
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

      // 生成扇形展開牌列 (Card Arc Fan)
      const fanContainer = fanArea.querySelector('#flowing_arc_fan');
      const deckCount = Math.min(this.deck.length, 36);
      const isMobile = window.innerWidth < 640;
      const radius = isMobile ? 260 : 340;
      const totalAngle = isMobile ? 80 : 96; // 總張角
      const startAngle = -totalAngle / 2;
      const stepAngle = totalAngle / (deckCount - 1);

      for (let i = 0; i < deckCount; i++) {
        // 如果該張已被抽走，則不顯示或留空
        const isPicked = this.selectedCards.some(sc => sc.indexInFan === i);
        if (isPicked) continue;

        const card = this.deck[i];
        const angle = startAngle + i * stepAngle;

        const cardBtn = document.createElement('button');
        cardBtn.type = 'button';
        cardBtn.className = `flowing-fan-card absolute pointer-events-auto rounded-xl shadow-lg border border-[#C8A97E] ${card.cardBackClass} cursor-pointer transition-all duration-200`;
        cardBtn.style.width = isMobile ? '46px' : '56px';
        cardBtn.style.height = isMobile ? '72px' : '88px';
        cardBtn.style.left = '50%';
        cardBtn.style.top = '0';
        cardBtn.style.transformOrigin = `50% ${radius}px`;
        cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        cardBtn.setAttribute('data-fan-index', i);
        cardBtn.setAttribute('data-card-id', card.id);

        // Hover / Active 向上浮起效果
        cardBtn.addEventListener('mouseenter', () => {
          cardBtn.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(-24px) scale(1.06)`;
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

    // ─── 階段 4：3D 翻牌與生活魔藥解讀 ───
    renderRevealStep(wrapper) {
      const revealArea = document.createElement('div');
      revealArea.className = 'w-full flex flex-col items-center relative py-4';

      const targetCount = this.spread.count;

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

        <!-- 牌面展示區 -->
        <div id="flowing_cards_grid" class="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10"></div>

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

      // 動態渲染可翻轉卡牌
      const grid = revealArea.querySelector('#flowing_cards_grid');
      const isMobile = window.innerWidth < 640;

      this.selectedCards.forEach((item, idx) => {
        const { card, isReversed, role } = item;
        const cardCol = document.createElement('div');
        cardCol.className = 'flex flex-col items-center gap-2.5';

        // 尺寸計算
        const cardWidth = isMobile ? '100px' : (targetCount > 4 ? '110px' : '136px');
        const cardHeight = isMobile ? '160px' : (targetCount > 4 ? '176px' : '216px');

        // 生成正面內容 HTML
        const db = window.MeetJoyDivination || {};
        const isLenormand = card.system === 'lenormand';
        const isTarot = card.system === 'tarot';
        const hasImg = !!card.image;

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

        const roleBadge = `<span class="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 whitespace-nowrap shadow-2xs">${role}</span>`;
        const nameBadge = `<span class="text-xs sm:text-sm font-serif font-black text-[#1F261C] mt-1">${card.name} ${!isLenormand ? (isReversed ? '<span class=\"text-[10px] text-rose-700\">(逆)</span>' : '<span class=\"text-[10px] text-emerald-700\">(正)</span>') : ''}</span>`;

        cardCol.innerHTML = `
          ${roleBadge}
          <div class="card-scene cursor-pointer" style="width: ${cardWidth}; height: ${cardHeight};" data-card-idx="${idx}">
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
          ${nameBadge}
        `;

        // 單卡翻牌事件
        const sceneEl = cardCol.querySelector('.card-scene');
        const innerEl = cardCol.querySelector('.card-inner');
        sceneEl.addEventListener('click', () => {
          innerEl.classList.toggle('flipped');
          this.checkAndRenderPotionSummary(revealArea);
        });

        grid.appendChild(cardCol);
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
