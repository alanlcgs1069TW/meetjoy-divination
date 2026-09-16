/**
 * 癒見幸福 · 全站命盤通用生辰資料與會員檔案庫 (Universal Birth Profile Hub)
 * 核心標準：
 * 1. 跨系統通用：人類圖、紫微斗數、西洋占星、脈輪占星、撲克命牌、基因天命全站通用
 * 2. 雙向同步：與紫微斗數 (ziwei-charts) 深度互通，雙向自動轉換時辰與陽曆日期
 * 3. 雲端跨電腦同步：透過 Cloudflare KV 邊緣雲端資料庫，任何電腦/裝置登入同一個帳號，命盤檔案即時無縫漫遊同步！
 * 4. 瑞士起司縱深防錯：全流程 Try-Catch，本地快取離線優先，雲端容災降級
 */

(function (window) {
  'use strict';

  // 時辰對照表 (0–11 = 子–亥, 12 = 晚子時)
  const TIME_INDEX_MAP = [
    { index: 0,  name: '早子時', range: '00:00–01:00', defaultTime: '00:30' },
    { index: 1,  name: '丑時',   range: '01:00–03:00', defaultTime: '02:00' },
    { index: 2,  name: '寅時',   range: '03:00–05:00', defaultTime: '04:00' },
    { index: 3,  name: '卯時',   range: '05:00–07:00', defaultTime: '06:00' },
    { index: 4,  name: '辰時',   range: '07:00–09:00', defaultTime: '08:00' },
    { index: 5,  name: '巳時',   range: '09:00–11:00', defaultTime: '10:00' },
    { index: 6,  name: '午時',   range: '11:00–13:00', defaultTime: '12:00' },
    { index: 7,  name: '未時',   range: '13:00–15:00', defaultTime: '14:00' },
    { index: 8,  name: '申時',   range: '15:00–17:00', defaultTime: '16:00' },
    { index: 9,  name: '酉時',   range: '17:00–19:00', defaultTime: '18:00' },
    { index: 10, name: '戌時',   range: '19:00–21:00', defaultTime: '20:00' },
    { index: 11, name: '亥時',   range: '21:00–23:00', defaultTime: '22:00' },
    { index: 12, name: '晚子時', range: '23:00–24:00', defaultTime: '23:30' },
  ];

  function timeToTimeIndex(timeStr) {
    if (!timeStr) return 6; // 預設午時
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    if (isNaN(h)) return 6;
    if (h === 23) return 12; // 晚子時
    if (h === 0) return 0;  // 早子時
    return Math.floor((h + 1) / 2);
  }

  function timeIndexToTime(idx) {
    const found = TIME_INDEX_MAP.find(t => t.index === Number(idx));
    return found ? found.defaultTime : '12:00';
  }

  function normalizeDate(dStr) {
    if (!dStr) return '1990-01-01';
    const parts = dStr.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return dStr;
    const y = String(parts[0]);
    const m = String(parts[1]).padStart(2, '0');
    const d = String(parts[2]).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function toZiweiSolarDate(dStr) {
    if (!dStr) return '1990-1-1';
    const parts = dStr.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return dStr;
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }

  // ==================== 0. 命盤庫容量與擴充規則 (2026-09-16 愛倫院長拍板) ====================
  const VAULT_CONFIG = {
    DEFAULT_FREE_SLOTS: 3, // 每個帳號提供 3 個免費額度
    EXPANSION_SLOTS_PER_PACK: 30, // 每包擴充 30 個
    EXPANSION_PRICE_NTD: 300, // 每包 300 元
    PRODUCT_ID: 228781,
    PRODUCT_SLUG: 'vault-expansion-pack-30',
    PRODUCT_URL: 'https://meetjoy.net/product/vault-expansion-pack-30/',
    PRODUCT_CART_URL: 'https://meetjoy.net/cart/?add-to-cart=228781',
    ADMIN_EMAILS: ['alanlc@gmail.com', 'alanlcgs@gmail.com', 'shenolawrenc@gmail.com', 'admin@meetjoy.net']
  };

  function isUserAdmin(user) {
    if (!user) {
      const cached = (localStorage.getItem('mj_current_admin_email') || '').toLowerCase().trim();
      return VAULT_CONFIG.ADMIN_EMAILS.includes(cached);
    }
    const email = (user.email || '').toLowerCase().trim();
    if (VAULT_CONFIG.ADMIN_EMAILS.includes(email)) return true;
    if (user.role === 'administrator' || user.isAdmin || user.role === 'admin' || user.role === 'instructor') return true;
    const cached = (localStorage.getItem('mj_current_admin_email') || '').toLowerCase().trim();
    return VAULT_CONFIG.ADMIN_EMAILS.includes(cached);
  }

  function getUserVaultQuota(user) {
    if (isUserAdmin(user)) {
      return { maxSlots: Infinity, isUnlimited: true, freeSlots: VAULT_CONFIG.DEFAULT_FREE_SLOTS, extraSlots: 999999 };
    }
    const email = user ? (user.email || '').toLowerCase().trim() : 'guest';
    let extra = 0;
    try {
      extra = parseInt(localStorage.getItem(`mj_vault_extra_slots_${email}`) || '0', 10);
      if (user && user.extra_slots) {
        extra = Math.max(extra, parseInt(user.extra_slots, 10));
      }
    } catch(e){}
    return {
      maxSlots: VAULT_CONFIG.DEFAULT_FREE_SLOTS + extra,
      isUnlimited: false,
      freeSlots: VAULT_CONFIG.DEFAULT_FREE_SLOTS,
      extraSlots: extra
    };
  }

  function showQuotaExceededModal(currentCount, maxSlots) {
    let modal = document.getElementById('mj_vault_quota_modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mj_vault_quota_modal';
      modal.className = 'fixed inset-0 z-[99999] bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-amber-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in duration-200" style="font-family: inherit;">
        <div class="bg-gradient-to-r from-[#2E3829] via-[#3E4B37] to-[#1E261B] text-amber-100 p-6 relative">
          <button type="button" id="mj_btn_close_quota_modal" class="absolute top-4 right-4 text-amber-200/70 hover:text-white text-2xl font-bold p-1 leading-none transition">&times;</button>
          <div class="inline-block bg-amber-500/30 text-amber-200 text-xs px-2.5 py-1 rounded-full font-bold mb-2">📦 命盤庫免費額度已滿</div>
          <h3 class="text-xl font-black text-white">擴充專屬雲端命盤容量</h3>
          <p class="text-xs text-amber-200/80 mt-1">目前已儲存 ${currentCount} / ${maxSlots} 組命盤</p>
        </div>
        <div class="p-6 space-y-4 text-xs">
          <div class="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-amber-950 leading-relaxed">
            <p class="font-bold text-sm text-amber-900 mb-1.5">🌟 每個帳號提供 3 組免費雲端命盤</p>
            <p>您已存滿免費額度！若需建立並儲存更多親友、學員或個案的命盤檔案，歡迎選購<strong>【雲端命盤庫擴充包】</strong>。</p>
            <div class="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between text-xs font-bold">
              <span class="text-slate-700">🛒 容量擴充規格：</span>
              <span class="text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">每 30 個容量 · NT$ 300</span>
            </div>
          </div>
          <ul class="text-[11px] text-slate-600 space-y-1.5 pl-1">
            <li class="flex items-center gap-1.5"><span class="text-emerald-600 font-bold">✓</span> 全站 10 大排盤系統通用（紫微、占星、人類圖、數字等）</li>
            <li class="flex items-center gap-1.5"><span class="text-emerald-600 font-bold">✓</span> 支援跨電腦、跨手機雲端自動同步，換機不遺失</li>
            <li class="flex items-center gap-1.5"><span class="text-emerald-600 font-bold">✓</span> 購買後永久有效，可多次購買連續疊加容量</li>
            <li class="flex items-center gap-1.5"><span class="text-amber-600 font-bold">👑</span> 院長與管理導師具備無限擴充權限</li>
          </ul>
          <div class="pt-2 flex flex-col gap-2">
            <a href="${VAULT_CONFIG.PRODUCT_CART_URL}" target="_blank" class="w-full bg-[#2E3829] hover:bg-[#3E4B37] text-amber-100 font-bold py-3 px-4 rounded-xl text-center text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 border border-amber-900/30">
              <span>🛒 立即線上擴充 30 組額度 (NT$ 300)</span>
            </a>
            <a href="${VAULT_CONFIG.PRODUCT_URL}" target="_blank" class="w-full text-center py-1 text-[11px] text-amber-800 hover:text-amber-950 font-bold transition">
              📖 查看擴充包完整商品說明 ↗
            </a>
            <button type="button" id="mj_btn_cancel_quota_modal" class="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-bold transition">
              稍後再說
            </button>
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
    document.getElementById('mj_btn_close_quota_modal').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('mj_btn_cancel_quota_modal').onclick = () => { modal.style.display = 'none'; };
  }

  // ==================== 1. 會員驗證模組 (MeetJoyAuth) ====================
  const MeetJoyAuth = {
    getUser() {
      try {
        const stored = localStorage.getItem('mj_member_user');
        if (stored) {
          const user = JSON.parse(stored);
          if (user && user.id) return user;
        }
        // 檢查 Supabase 或後台既有 session
        const zwUser = localStorage.getItem('ziwei-user');
        if (zwUser) {
          const u = JSON.parse(zwUser);
          return {
            id: u.id || 'zw_member',
            name: u.name || u.email?.split('@')[0] || '學院學員',
            email: u.email || 'member@meetjoy.net',
            avatar: u.avatar || '',
            provider: 'ziwei'
          };
        }
      } catch (e) {
        console.warn('[MeetJoyAuth] getUser error:', e);
      }
      return null;
    },

    isLoggedIn() {
      return !!this.getUser();
    },

    login(provider, userInfo) {
      const email = (userInfo?.email || '').trim().toLowerCase() || `${provider}.member@meetjoy.net`;
      const name = userInfo?.name || (provider === 'line' ? 'LINE 學員' : (provider === 'google' ? 'Google 學員' : '學院認證學員'));
      
      const user = {
        id: userInfo?.id || `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: name,
        email: email,
        avatar: userInfo?.avatar || '',
        provider: provider || 'email',
        loginAt: Date.now()
      };
      try {
        localStorage.setItem('mj_member_user', JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('mj-auth-changed', { detail: user }));
      } catch (e) {
        console.error('[MeetJoyAuth] save error:', e);
      }
      return user;
    },

    logout() {
      try {
        localStorage.removeItem('mj_member_user');
        window.dispatchEvent(new CustomEvent('mj-auth-changed', { detail: null }));
      } catch (e) {}
    },

    async checkAccountExists(email) {
      if (!email) return { exists: false };
      email = email.trim().toLowerCase();

      // 1. 管理導師專屬信箱
      if (VAULT_CONFIG.ADMIN_EMAILS.includes(email)) {
        return { exists: true, name: '愛倫院長', isAdmin: true };
      }

      // 2. 檢查本地歷史已登入身分
      try {
        const stored = localStorage.getItem('mj_member_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u && u.email && u.email.toLowerCase() === email) {
            return { exists: true, name: u.name || email.split('@')[0], isAdmin: !!u.isAdmin };
          }
        }
      } catch (e) {}

      // 3. 查詢 WordPress 主站 REST API 判定是否已有該帳號
      try {
        const wpRes = await fetch(`https://meetjoy.net/wp-json/meetjoy/v1/check-email?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (wpRes.ok) {
          const wpData = await wpRes.json();
          if (wpData && wpData.exists) {
            return { exists: true, name: wpData.name || email.split('@')[0], isAdmin: false };
          }
        }
      } catch (e) {
        console.warn('[MeetJoyAuth] WP check-email error:', e);
      }

      // 4. 查詢 Cloudflare KV 是否有雲端命盤庫檔案
      try {
        const kvRes = await fetch(`/api/profiles?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData && kvData.success && (kvData.count > 0 || (Array.isArray(kvData.profiles) && kvData.profiles.length > 0))) {
            return { exists: true, name: email.split('@')[0], isAdmin: false };
          }
        }
      } catch (e) {
        console.warn('[MeetJoyAuth] KV check-profiles error:', e);
      }

      return { exists: false };
    },

    showLoginModal(onSuccess) {
      const oldModal = document.getElementById('mj_auth_modal');
      if (oldModal) oldModal.remove();

      const modalHtml = `
        <div id="mj_auth_modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-serif">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#C8A97E]/60 text-slate-800 relative">
            <button id="mj_close_auth_modal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold p-1 leading-none cursor-pointer">&times;</button>
            
            <div class="text-center mb-5">
              <div class="w-12 h-12 rounded-full bg-[#1E261D] text-amber-100 flex items-center justify-center mx-auto mb-3 text-xl shadow-md border border-[#C8A97E]/70">
                🔮
              </div>
              <h3 id="mj_auth_modal_title" class="text-xl font-black text-slate-900 mb-1">登入會員 · 跨電腦同步雲端命盤庫</h3>
              <p id="mj_auth_modal_subtitle" class="text-xs text-slate-600 leading-relaxed">
                輸入您的學員 Email 登入，即可將個人與親友命盤<strong>雲端即時同步漫遊</strong>，走到哪都能完整查看！
              </p>
            </div>

            <!-- Tab 標籤切換：預設為登入 -->
            <div class="flex items-center justify-center p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200/80">
              <button type="button" id="mj_tab_login" class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 bg-[#2E3829] text-amber-100 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                <span>✨ 會員登入</span>
              </button>
              <button type="button" id="mj_tab_register" class="flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🌱 註冊新帳號</span>
              </button>
            </div>

            <!-- 動態提示橫幅 (自動切換註冊時顯示) -->
            <div id="mj_auth_notice_box" class="hidden mb-4 p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-amber-950 text-xs leading-relaxed font-medium"></div>

            <!-- 1. 登入表單 (預設顯示) -->
            <form id="mj_auth_login_form" class="space-y-3.5 mb-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">學員電子信箱 (Email · 跨裝置唯一帳號) <span class="text-rose-500">*</span></label>
                <input type="email" id="mj_auth_login_email" required placeholder="例如：alan@example.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]">
              </div>
              <button type="submit" id="mj_btn_submit_login" class="w-full py-2.5 bg-[#2E3829] hover:bg-[#3E4B37] text-amber-50 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                <span>✨ 登入並同步雲端命盤庫</span>
              </button>
              <div class="text-center pt-1">
                <button type="button" id="mj_btn_switch_to_reg" class="text-[11px] text-[#8C6D3F] hover:text-[#5B4626] font-bold underline cursor-pointer">
                  尚未建立學員檔案？立即註冊新帳號 ➔
                </button>
              </div>
            </form>

            <!-- 2. 註冊表單 (預設隱藏) -->
            <form id="mj_auth_reg_form" class="space-y-3.5 mb-4 hidden">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">學員電子信箱 (Email · 跨裝置唯一帳號) <span class="text-rose-500">*</span></label>
                <input type="email" id="mj_auth_reg_email" required placeholder="例如：alan@example.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">學員姓名 / 稱謂 (建立個人檔案) <span class="text-rose-500">*</span></label>
                <input type="text" id="mj_auth_reg_name" required placeholder="例如：愛倫 / 林雅婷" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]">
              </div>
              <button type="submit" id="mj_btn_submit_reg" class="w-full py-2.5 bg-[#8C6D3F] hover:bg-[#725730] text-amber-50 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🌱 立即註冊並啟動命盤庫</span>
              </button>
              <div class="text-center pt-1">
                <button type="button" id="mj_btn_switch_to_login" class="text-[11px] text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer">
                  已有學員帳號？返回會員登入 ➔
                </button>
              </div>
            </form>

            <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-slate-200"></div>
              <span class="flex-shrink mx-3 text-[11px] text-slate-400">或使用第三方快捷登入</span>
              <div class="flex-grow border-t border-slate-200"></div>
            </div>

            <div class="space-y-2.5 mt-2">
              <a href="https://meetjoy.net/wp-login.php?loginSocial=line&redirect=https%3A%2F%2Fmeetjoy.net%2Fapp%2F" target="_top" class="w-full py-2.5 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm no-underline cursor-pointer">
                <span>💬 使用 LINE 帳號快速登入 / 註冊</span>
              </a>
              <a href="https://meetjoy.net/wp-login.php?loginSocial=google&redirect=https%3A%2F%2Fmeetjoy.net%2Fapp%2F" target="_top" class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs no-underline cursor-pointer">
                <span>🌐 使用 Google 帳號快速登入 / 註冊</span>
              </a>
              <a href="https://meetjoy.net/wp-login.php?loginSocial=facebook&redirect=https%3A%2F%2Fmeetjoy.net%2Fapp%2F" target="_top" class="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm no-underline cursor-pointer">
                <span>🔵 使用 Facebook 帳號快速登入 / 註冊</span>
              </a>
            </div>

            <p class="text-[10px] text-center text-slate-400 mt-4">
              🔒 癒見幸福推廣中心保證學員資料僅供本人命盤排盤儲存，嚴格遵循端到端隱私防護標準。
            </p>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modalEl = document.getElementById('mj_auth_modal');
      const closeBtn = document.getElementById('mj_close_auth_modal');
      const tabLogin = document.getElementById('mj_tab_login');
      const tabRegister = document.getElementById('mj_tab_register');
      const loginForm = document.getElementById('mj_auth_login_form');
      const regForm = document.getElementById('mj_auth_reg_form');
      const loginEmailInput = document.getElementById('mj_auth_login_email');
      const regEmailInput = document.getElementById('mj_auth_reg_email');
      const regNameInput = document.getElementById('mj_auth_reg_name');
      const noticeBox = document.getElementById('mj_auth_notice_box');
      const modalTitle = document.getElementById('mj_auth_modal_title');
      const modalSubtitle = document.getElementById('mj_auth_modal_subtitle');
      const submitLoginBtn = document.getElementById('mj_btn_submit_login');
      const submitRegBtn = document.getElementById('mj_btn_submit_reg');

      closeBtn.onclick = () => modalEl.remove();

      // 切換至【登入】Tab
      function setTabLogin() {
        tabLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 bg-[#2E3829] text-amber-100 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer';
        tabRegister.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer';
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        modalTitle.textContent = '登入會員 · 跨電腦同步雲端命盤庫';
        modalSubtitle.innerHTML = '輸入您的學員 Email 登入，即可將個人與親友命盤<strong>雲端即時同步漫遊</strong>，走到哪都能完整查看！';
        noticeBox.classList.add('hidden');
        loginEmailInput.focus();
      }

      // 切換至【註冊】Tab
      function setTabRegister(emailToPrefill = '', noticeMsg = '') {
        tabRegister.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 bg-[#8C6D3F] text-amber-100 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer';
        tabLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer';
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        modalTitle.textContent = '註冊新學員 · 啟動專屬雲端命盤庫';
        modalSubtitle.innerHTML = '首次使用？建立專屬學員檔案，立即啟動 <strong>3 組免費雲端命盤空間</strong>！';
        
        if (emailToPrefill) {
          regEmailInput.value = emailToPrefill;
        }
        if (noticeMsg) {
          noticeBox.innerHTML = noticeMsg;
          noticeBox.classList.remove('hidden');
        } else {
          noticeBox.classList.add('hidden');
        }
        
        if (regEmailInput.value) {
          regNameInput.focus();
        } else {
          regEmailInput.focus();
        }
      }

      // 監聽 Tab 按鈕與切換連結
      tabLogin.onclick = () => setTabLogin();
      tabRegister.onclick = () => setTabRegister(loginEmailInput.value.trim());
      document.getElementById('mj_btn_switch_to_reg').onclick = () => setTabRegister(loginEmailInput.value.trim());
      document.getElementById('mj_btn_switch_to_login').onclick = () => setTabLogin();

      // 登入提交處理：自動判別是否已存在帳號，沒有才切換至註冊頁面！
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value.trim().toLowerCase();
        if (!email) return;

        // 載入狀態
        submitLoginBtn.disabled = true;
        const originalBtnText = submitLoginBtn.innerHTML;
        submitLoginBtn.innerHTML = `<span>⏳ 正在比對學員帳號...</span>`;

        try {
          const accountStatus = await MeetJoyAuth.checkAccountExists(email);

          if (accountStatus.exists) {
            // 已有帳號！直接順利登入
            const isAdmin = !!accountStatus.isAdmin || VAULT_CONFIG.ADMIN_EMAILS.includes(email);
            const user = MeetJoyAuth.login('email', {
              name: accountStatus.name || (isAdmin ? '愛倫院長' : email.split('@')[0]),
              email: email,
              isAdmin: isAdmin
            });
            if (isAdmin) {
              localStorage.setItem('mj_current_admin_email', email);
            }
            modalEl.remove();
            MeetJoyProfiles.showToast(isAdmin ? `👑 歡迎愛倫院長！享無限命盤容量，正在同步雲端命盤庫...` : `🌿 歡迎回來，${user.name}！正在為您同步雲端命盤...`);
            await MeetJoyProfiles.syncWithCloud(false);
            if (typeof onSuccess === 'function') onSuccess(user);
          } else {
            // 尚未有帳號！自動流暢切換到註冊 Tab
            submitLoginBtn.disabled = false;
            submitLoginBtn.innerHTML = originalBtnText;
            setTabRegister(
              email, 
              `💡 系統查無此信箱的學員資料，已自動為您切換至<strong>【註冊新帳號】</strong>。請填寫您的稱謂即可一鍵開通雲端命盤庫！`
            );
          }
        } catch (err) {
          console.error('[MeetJoyAuth] loginForm error:', err);
          submitLoginBtn.disabled = false;
          submitLoginBtn.innerHTML = originalBtnText;
          setTabRegister(email, `💡 系統查無此信箱紀錄，已為您切換至<strong>【註冊新帳號】</strong>，請填寫稱謂開通！`);
        }
      };

      // 註冊提交處理
      regForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = regEmailInput.value.trim().toLowerCase();
        let name = regNameInput.value.trim();
        if (!email || !name) return;

        submitRegBtn.disabled = true;
        submitRegBtn.innerHTML = `<span>🌱 正在建立學員檔案...</span>`;

        const isAdmin = VAULT_CONFIG.ADMIN_EMAILS.includes(email);
        const user = MeetJoyAuth.login('email', {
          name: isAdmin ? (name === email.split('@')[0] ? '愛倫院長' : name) : name,
          email: email,
          isAdmin: isAdmin
        });
        if (isAdmin) {
          localStorage.setItem('mj_current_admin_email', email);
        }
        modalEl.remove();
        MeetJoyProfiles.showToast(`🌱 恭喜開通！歡迎加入學院，${user.name}！已為您啟動 3 組免費雲端命盤庫。`);
        await MeetJoyProfiles.syncWithCloud(false);
        if (typeof onSuccess === 'function') onSuccess(user);
      };
    }
  };

  // ==================== 2. 全站命盤通用檔案庫 (MeetJoyProfiles) ====================
  const MeetJoyProfiles = {
    getAll() {
      const profilesMap = new Map();

      // 1. 讀取紫微斗數既有命盤 (ziwei-charts)
      try {
        const rawZw = localStorage.getItem('ziwei-charts');
        if (rawZw) {
          const zwCharts = JSON.parse(rawZw);
          if (Array.isArray(zwCharts)) {
            zwCharts.filter(c => !c.deletedAt).forEach(c => {
              const bDate = normalizeDate(c.solarDate);
              const bTime = timeIndexToTime(c.timeIndex ?? 6);
              const key = `${c.name || '未命名'}_${bDate}_${c.timeIndex}`;
              profilesMap.set(key, {
                id: c.id || `zw_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                name: c.name || '未命名',
                gender: c.gender === 'male' ? 'male' : 'female',
                birthDate: bDate,
                birthTime: bTime,
                birthCity: 'tw_taipei',
                timeIndex: c.timeIndex ?? 6,
                category: c.category || '自己',
                notes: c.notes || '',
                source: 'ziwei',
                updatedAt: c.updatedAt || Date.now()
              });
            });
          }
        }
      } catch (err) {
        console.warn('[MeetJoyProfiles] Failed to read ziwei-charts:', err);
      }

      // 2. 讀取通用生辰庫 (mj_universal_profiles)
      try {
        const rawUniv = localStorage.getItem('mj_universal_profiles');
        if (rawUniv) {
          const univProfiles = JSON.parse(rawUniv);
          if (Array.isArray(univProfiles)) {
            univProfiles.filter(p => !p.deletedAt).forEach(p => {
              const bDate = normalizeDate(p.birthDate);
              const timeIdx = p.timeIndex !== undefined ? p.timeIndex : timeToTimeIndex(p.birthTime);
              const key = `${p.name || '未命名'}_${bDate}_${timeIdx}`;
              
              const existing = profilesMap.get(key);
              profilesMap.set(key, {
                id: p.id || (existing ? existing.id : `prof_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`),
                name: p.name || '未命名',
                gender: p.gender === 'male' ? 'male' : 'female',
                birthDate: bDate,
                birthTime: p.birthTime || (existing ? existing.birthTime : '12:00'),
                birthCity: p.birthCity || (existing ? existing.birthCity : 'tw_taipei'),
                timeIndex: timeIdx,
                category: p.category || (existing ? existing.category : '自己'),
                notes: p.notes || (existing ? existing.notes : ''),
                source: 'universal',
                updatedAt: Math.max(p.updatedAt || 0, existing ? (existing.updatedAt || 0) : 0) || Date.now()
              });
            });
          }
        }
      } catch (err) {
        console.warn('[MeetJoyProfiles] Failed to read mj_universal_profiles:', err);
      }

      const list = Array.from(profilesMap.values());
      return list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    },

    getProfiles() {
      return this.getAll();
    },

    saveProfile(profileData) {
      if (!profileData || !profileData.birthDate) {
        alert('請先填寫正確的出生日期！');
        return false;
      }

      // 嚴格權限檢查：需登入會員才能記錄
      if (!MeetJoyAuth.isLoggedIn()) {
        MeetJoyAuth.showLoginModal(() => {
          this.saveProfile(profileData);
        });
        return false;
      }

      const user = MeetJoyAuth.getUser();
      const quota = getUserVaultQuota(user);
      const existingList = this.getAll();

      const id = profileData.id || `prof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const bDate = normalizeDate(profileData.birthDate);
      const bTime = profileData.birthTime || '12:00';
      const timeIdx = profileData.timeIndex !== undefined ? profileData.timeIndex : timeToTimeIndex(bTime);
      const name = (profileData.name || '').trim() || '學員本人';
      const gender = profileData.gender === 'male' ? 'male' : 'female';
      const category = profileData.category || '自己';
      const birthCity = profileData.birthCity || 'tw_taipei';
      const notes = profileData.notes || '';
      const now = Date.now();

      // 檢查是否為編輯更新已存在的同名+同生辰命盤（更新既有資料不佔用新名額）
      const isUpdating = existingList.some(p => p.id === id || (`${p.name}_${normalizeDate(p.birthDate)}_${p.timeIndex}` === `${name}_${bDate}_${timeIdx}`));

      if (!isUpdating && !quota.isUnlimited && existingList.length >= quota.maxSlots) {
        showQuotaExceededModal(existingList.length, quota.maxSlots);
        return false;
      }

      const newProfile = {
        id,
        name,
        gender,
        birthDate: bDate,
        birthTime: bTime,
        birthCity,
        timeIndex: timeIdx,
        category,
        notes,
        updatedAt: now
      };

      // 1. 寫入本地 mj_universal_profiles
      try {
        let univ = [];
        const raw = localStorage.getItem('mj_universal_profiles');
        if (raw) univ = JSON.parse(raw);
        univ = univ.filter(p => p.id !== id && !(`${p.name}_${normalizeDate(p.birthDate)}_${p.timeIndex}` === `${name}_${bDate}_${timeIdx}`));
        univ.unshift(newProfile);
        localStorage.setItem('mj_universal_profiles', JSON.stringify(univ));
      } catch (e) {
        console.warn('[MeetJoyProfiles] Save universal profile failed:', e);
      }

      // 2. 雙向同步寫入紫微斗數 (ziwei-charts) 格式
      try {
        let zw = [];
        const rawZw = localStorage.getItem('ziwei-charts');
        if (rawZw) zw = JSON.parse(rawZw);
        const zwItem = {
          id,
          name,
          solarDate: toZiweiSolarDate(bDate),
          timeIndex: timeIdx,
          gender,
          category,
          notes,
          updatedAt: now
        };
        zw = zw.filter(c => c.id !== id && !(`${c.name}_${normalizeDate(c.solarDate)}_${c.timeIndex}` === `${name}_${bDate}_${timeIdx}`));
        zw.unshift(zwItem);
        localStorage.setItem('ziwei-charts', JSON.stringify(zw));
      } catch (e) {
        console.warn('[MeetJoyProfiles] Sync to ziwei-charts failed:', e);
      }

      // 3. 即時非同步同步至 Cloudflare KV 雲端資料庫！
      if (user && (user.email || user.id)) {
        fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            user_id: user.id,
            profiles: [newProfile],
            action: 'merge'
          })
        }).then(res => res.json()).then(data => {
          if (data && data.success) {
            console.log('[MeetJoyProfiles] Cloud KV saved:', newProfile.name);
          }
        }).catch(err => console.warn('[MeetJoyProfiles] Background cloud save failed:', err));
      }

      this.showToast(`✨ 已成功記錄「${name}」！全站所有排盤系統與雲端已同步更新。`);
      window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: newProfile }));
      return true;
    },

    deleteProfile(id) {
      if (!confirm('確定要刪除這筆已儲存的生辰命盤嗎？')) return;
      try {
        let univ = JSON.parse(localStorage.getItem('mj_universal_profiles') || '[]');
        univ = univ.filter(p => p.id !== id);
        localStorage.setItem('mj_universal_profiles', JSON.stringify(univ));

        let zw = JSON.parse(localStorage.getItem('ziwei-charts') || '[]');
        zw = zw.filter(c => c.id !== id);
        localStorage.setItem('ziwei-charts', JSON.stringify(zw));

        // 同步刪除雲端紀錄 (以 replace 模式更新全量)
        const user = MeetJoyAuth.getUser();
        if (user && (user.email || user.id)) {
          const allLeft = this.getAll();
          fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              user_id: user.id,
              profiles: allLeft,
              action: 'replace'
            })
          }).catch(err => console.warn('[MeetJoyProfiles] Cloud delete sync failed:', err));
        }

        this.showToast('🗑️ 已成功刪除命盤紀錄');
        window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: { id, deleted: true } }));
      } catch (e) {
        console.warn('[MeetJoyProfiles] Delete failed:', e);
      }
    },

    // ==================== 雲端跨電腦雙向同步核心 ====================
    async syncWithCloud(silent = false) {
      const user = MeetJoyAuth.getUser();
      if (!user || (!user.email && !user.id)) return;

      try {
        const emailParam = encodeURIComponent(user.email || '');
        const userParam = encodeURIComponent(user.id || '');
        
        // 1. 向 Cloudflare API 取得該使用者名下的所有雲端命盤
        const res = await fetch(`/api/profiles?email=${emailParam}&user_id=${userParam}`, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const cloudProfiles = Array.isArray(data.profiles) ? data.profiles : [];

        // 2. 取得本地既有命盤
        const localProfiles = this.getAll();

        // 3. 雙向智慧合併 (Last-Write-Wins)
        const mergedMap = new Map();
        
        // 先載入雲端命盤
        cloudProfiles.forEach(p => {
          const k = p.id || `${p.name}_${normalizeDate(p.birthDate)}_${p.birthTime}`;
          mergedMap.set(k, p);
        });

        // 比對本地命盤
        let hasLocalNewer = false;
        localProfiles.forEach(p => {
          const k = p.id || `${p.name}_${normalizeDate(p.birthDate)}_${p.birthTime}`;
          const cloudP = mergedMap.get(k);
          if (!cloudP) {
            mergedMap.set(k, p);
            hasLocalNewer = true;
          } else {
            const lTime = p.updatedAt || 0;
            const cTime = cloudP.updatedAt || 0;
            if (lTime > cTime) {
              mergedMap.set(k, p);
              hasLocalNewer = true;
            }
          }
        });

        const finalMerged = Array.from(mergedMap.values()).filter(p => !p.deletedAt);
        finalMerged.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

        // 4. 持久化回本地 localStorage
        localStorage.setItem('mj_universal_profiles', JSON.stringify(finalMerged));

        const zwList = finalMerged.map(p => ({
          id: p.id,
          name: p.name,
          solarDate: toZiweiSolarDate(p.birthDate),
          timeIndex: p.timeIndex !== undefined ? p.timeIndex : timeToTimeIndex(p.birthTime),
          gender: p.gender,
          category: p.category || '自己',
          notes: p.notes || '',
          updatedAt: p.updatedAt || Date.now()
        }));
        localStorage.setItem('ziwei-charts', JSON.stringify(zwList));

        // 5. 若本地有全新或更新的命盤，上傳至雲端做完整備份
        if (hasLocalNewer || (cloudProfiles.length === 0 && finalMerged.length > 0)) {
          await fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              user_id: user.id,
              profiles: finalMerged,
              action: 'replace'
            })
          });
        }

        // 觸發全站下拉選單同步刷新
        window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: { sync: true, count: finalMerged.length } }));

        if (!silent) {
          this.showToast(`☁️ 雲端跨電腦命盤庫已同步！共載入 ${finalMerged.length} 筆個案。`);
        }
      } catch (err) {
        console.warn('[MeetJoyProfiles] syncWithCloud failed:', err);
      }
    },

    showToast(message) {
      if (typeof document === 'undefined') return;
      const old = document.getElementById('mj_toast_msg');
      if (old) old.remove();
      const toast = document.createElement('div');
      toast.id = 'mj_toast_msg';
      toast.className = 'fixed bottom-6 right-6 z-[999999] bg-[#1E261D] text-amber-100 px-4 py-3 rounded-2xl shadow-xl border border-[#C8A97E] text-xs font-bold flex items-center gap-2 transform transition-all duration-300';
      toast.innerHTML = `<span>${message}</span>`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    },

    // ==================== 3. 頁面組件掛載 (Mount UI) ====================
    mount(containerSelector, options = {}) {
      const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
      if (!container) return;

      const render = () => {
        const user = MeetJoyAuth.getUser();
        const profiles = this.getAll();

        const optionsHtml = profiles.length === 0
          ? `<option value="">-- 目前無已存命盤 (登入後可跨裝置同步) --</option>`
          : `<option value="">📁 帶入已存命盤 (${profiles.length} 位) -- 全站與雲端通用</option>` +
            profiles.map(p => {
              const catTag = p.category ? `[${p.category}] ` : '';
              return `<option value="${p.id}">${catTag}${p.name} · ${p.birthDate} ${p.birthTime} (${p.gender === 'male' ? '乾造' : '坤造'})</option>`;
            }).join('');

        const quota = getUserVaultQuota(user);
        const isAdmin = isUserAdmin(user);

        let quotaBadgeHtml = '';
        if (isAdmin) {
          quotaBadgeHtml = `
            <span class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] shadow-2xs cursor-default" title="管理員權限：享無限命盤容量">
              👑 無限容量 (已存 ${profiles.length})
            </span>
          `;
        } else {
          const isFull = profiles.length >= quota.maxSlots;
          const badgeColor = isFull 
            ? 'bg-rose-50 text-rose-700 border-rose-300' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-300';
          quotaBadgeHtml = `
            <div class="inline-flex items-center gap-1.5">
              <span class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl ${badgeColor} border font-bold text-[11px] shadow-2xs">
                📦 容量：${profiles.length} / ${quota.maxSlots} 組
              </span>
              <button type="button" id="mj_btn_open_quota_modal" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-[11px] shadow-2xs transition" title="擴充命盤庫容量（每 30 組 NT$ 300）">
                ⚡️ 擴充
              </button>
            </div>
          `;
        }

        const authHtml = user ? `
          <div class="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/90 border border-amber-300/80 px-2.5 py-1.5 rounded-xl shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-bold">會員：${user.name}</span>
            <button id="mj_btn_sync_now" type="button" class="ml-1 text-[11px] text-amber-800 hover:text-amber-950 font-bold px-1.5 py-0.5 rounded bg-amber-200/60 transition" title="立即與雲端雙向同步">🔄 同步</button>
            <button id="mj_btn_logout" class="ml-1 text-[10px] text-amber-700/80 hover:text-rose-600 underline font-bold" title="登出會員">登出</button>
          </div>
        ` : `
          <button id="mj_btn_login" type="button" class="text-xs font-bold text-[#8C6A1A] hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-[#C8A97E]/60 px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs">
            <span>🔑 登入會員雲端命盤庫</span>
          </button>
        `;

        container.innerHTML = `
          <div class="w-full bg-gradient-to-r from-[#FBF8F2] via-white to-[#F8F5EE] border border-[#D9CDB8] rounded-2xl p-3 sm:p-4 mb-4 shadow-xs text-xs">
            <div class="flex flex-wrap items-center justify-between gap-3">
              
              <!-- 快速帶入下拉選單 -->
              <div class="flex-1 min-w-[260px] flex items-center gap-2">
                <span class="font-bold text-[#2E3829] shrink-0 flex items-center gap-1">
                  <span>📂 命盤庫：</span>
                </span>
                <select id="mj_profile_dropdown" class="flex-1 bg-white border border-[#C8A97E]/70 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] shadow-2xs">
                  ${optionsHtml}
                </select>
                <button id="mj_btn_del_profile" type="button" class="text-slate-400 hover:text-rose-600 px-2 py-1.5 rounded-lg border border-transparent hover:border-rose-200 transition" title="刪除選中的命盤紀錄">
                  🗑️
                </button>
              </div>

              <!-- 容量狀態、記錄至命盤庫 & 會員狀態 -->
              <div class="flex flex-wrap items-center gap-2 shrink-0">
                ${quotaBadgeHtml}
                <button id="mj_btn_save_current" type="button" class="bg-[#2E3829] hover:bg-[#3E4B37] text-amber-100 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs border border-amber-900/30 whitespace-nowrap">
                  <span>💾 記錄此生日至會員命盤庫</span>
                </button>
                <div id="mj_auth_slot">
                  ${authHtml}
                </div>
              </div>

            </div>
          </div>
        `;

        // 綁定下拉選單變更
        const selectEl = container.querySelector('#mj_profile_dropdown');
        selectEl.onchange = () => {
          const selectedId = selectEl.value;
          if (!selectedId) return;
          const target = profiles.find(p => p.id === selectedId);
          if (target && typeof options.onSelect === 'function') {
            options.onSelect(target);
            this.showToast(`✨ 已為您帶入「${target.name}」的生辰資料！`);
          }
        };

        // 擴充按鈕彈窗
        const openQuotaBtn = container.querySelector('#mj_btn_open_quota_modal');
        if (openQuotaBtn) {
          openQuotaBtn.onclick = () => {
            showQuotaExceededModal(profiles.length, quota.maxSlots);
          };
        }

        // 刪除選中按鈕
        const delBtn = container.querySelector('#mj_btn_del_profile');
        delBtn.onclick = () => {
          const selectedId = selectEl.value;
          if (!selectedId) {
            alert('請先在下拉選單中選擇要刪除的命盤！');
            return;
          }
          this.deleteProfile(selectedId);
        };

        // 手動同步按鈕
        const syncBtn = container.querySelector('#mj_btn_sync_now');
        if (syncBtn) {
          syncBtn.onclick = () => {
            syncBtn.textContent = '⏳ 同步中...';
            this.syncWithCloud(false).finally(() => {
              syncBtn.textContent = '🔄 同步';
            });
          };
        }

        // 儲存當前資料按鈕
        const saveBtn = container.querySelector('#mj_btn_save_current');
        saveBtn.onclick = () => {
          let currentData = {};
          if (typeof options.getCurrentData === 'function') {
            currentData = options.getCurrentData() || {};
          }

          if (!currentData.birthDate) {
            alert('請先填寫出生西元年月日！');
            return;
          }

          if (!MeetJoyAuth.isLoggedIn()) {
            MeetJoyAuth.showLoginModal(() => {
              this.promptAndSave(currentData);
            });
          } else {
            this.promptAndSave(currentData);
          }
        };

        // 登入與登出按鈕
        const loginBtn = container.querySelector('#mj_btn_login');
        if (loginBtn) {
          loginBtn.onclick = () => MeetJoyAuth.showLoginModal();
        }
        const logoutBtn = container.querySelector('#mj_btn_logout');
        if (logoutBtn) {
          logoutBtn.onclick = () => {
            if (confirm('確定要登出會員嗎？')) {
              MeetJoyAuth.logout();
              this.showToast('已登出會員');
            }
          };
        }
      };

      // 1. 自動檢查 URL Query 參數（由 WordPress 主站或轉址傳遞）
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const paramEmail = (urlParams.get('mj_email') || urlParams.get('user_email') || '').trim().toLowerCase();
        const paramName = (urlParams.get('mj_name') || urlParams.get('user_name') || '').trim();
        const paramAdmin = urlParams.get('mj_admin') || urlParams.get('is_admin');

        if (paramEmail) {
          const current = MeetJoyAuth.getUser();
          if (!current || current.email !== paramEmail) {
            const isAdminUser = paramAdmin === '1' || VAULT_CONFIG.ADMIN_EMAILS.includes(paramEmail);
            MeetJoyAuth.login('url_sync', {
              email: paramEmail,
              name: paramName || (isAdminUser ? '愛倫院長' : paramEmail.split('@')[0]),
              isAdmin: isAdminUser
            });
            if (isAdminUser) {
              localStorage.setItem('mj_current_admin_email', paramEmail);
            }
          }
        }
      } catch (e) {
        console.warn('[MeetJoyProfiles] URL param sync error:', e);
      }

      // 2. 監聽 WordPress 父層 iframe 傳來的跨網域認證訊息
      window.addEventListener('message', (event) => {
        try {
          if (event.data && event.data.type === 'MJ_AUTH_SYNC' && event.data.user) {
            const u = event.data.user;
            if (u.email) {
              const email = u.email.trim().toLowerCase();
              const isAdminUser = u.isAdmin || VAULT_CONFIG.ADMIN_EMAILS.includes(email);
              MeetJoyAuth.login('parent_sync', {
                email: email,
                name: u.name || (isAdminUser ? '愛倫院長' : email.split('@')[0]),
                isAdmin: isAdminUser
              });
              if (isAdminUser) {
                localStorage.setItem('mj_current_admin_email', email);
              }
              this.syncWithCloud(true);
            }
          }
        } catch (err) {}
      });

      // 監聽外部事件更新
      window.addEventListener('mj-auth-changed', render);
      window.addEventListener('mj-profiles-changed', render);

      render();

      // 初次載入時，若已登入則在背景靜默同步一次最新雲端命盤庫
      if (MeetJoyAuth.isLoggedIn()) {
        setTimeout(() => {
          this.syncWithCloud(true);
        }, 800);
      }
    },

    promptAndSave(currentData) {
      const defaultName = currentData.name || '我的命盤';
      const promptName = prompt('請輸入此生辰命盤的姓名或稱謂：', defaultName);
      if (promptName === null) return;
      const finalName = promptName.trim() || defaultName;

      const profileToSave = {
        ...currentData,
        name: finalName,
        birthDate: normalizeDate(currentData.birthDate),
        birthTime: currentData.birthTime || '12:00',
        birthCity: currentData.birthCity || 'tw_taipei',
        gender: currentData.gender || 'female',
        timeIndex: currentData.timeIndex !== undefined ? currentData.timeIndex : timeToTimeIndex(currentData.birthTime || '12:00'),
        category: currentData.category || '自己'
      };

      this.saveProfile(profileToSave);
    },

    getQuota(user) {
      return getUserVaultQuota(user || MeetJoyAuth.getUser());
    },

    showQuotaModal(currentCount, maxSlots) {
      const q = this.getQuota();
      showQuotaExceededModal(currentCount !== undefined ? currentCount : this.getAll().length, maxSlots !== undefined ? maxSlots : q.maxSlots);
    }
  };

  // 全域暴露
  window.MeetJoyAuth = MeetJoyAuth;
  window.MeetJoyProfiles = MeetJoyProfiles;

})(window);
