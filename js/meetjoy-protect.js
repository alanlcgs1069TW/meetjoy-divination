/**
 * 癒見幸福 · 網頁版權防複製保護模組 (MeetJoy Copy Protection)
 * 建立時間：2026-09-17
 * 核心準則：除系統管理者（愛倫院長、管理員名單）外，其他帳號與一般訪客全面禁止選取、複製、剪下、右鍵選單。
 * 豁免條款：表單輸入框（input, textarea, select, contenteditable）允許正常打字、選取、複製與貼上。
 */
(function () {
  'use strict';

  const ADMIN_EMAILS = [
    'alanlc@gmail.com',
    'alanlcgs@gmail.com',
    'shenolawrenc@gmail.com',
    'admin@meetjoy.net'
  ];

  function isAdministrator() {
    try {
      // 1. 檢查 MeetJoyAuth 全域物件
      if (window.MeetJoyAuth && typeof window.MeetJoyAuth.getUser === 'function') {
        const u = window.MeetJoyAuth.getUser();
        if (u) {
          if (u.isAdmin || u.role === 'administrator' || u.role === 'admin' || u.role === 'instructor') return true;
          const email = (u.email || '').toLowerCase().trim();
          if (ADMIN_EMAILS.includes(email)) return true;
        }
      }

      // 2. 檢查 MeetJoyProfiles 全域物件
      if (window.MeetJoyProfiles && typeof window.MeetJoyProfiles.isCurrentUserAdmin === 'function') {
        if (window.MeetJoyProfiles.isCurrentUserAdmin()) return true;
      }

      // 3. 檢查 localStorage / sessionStorage 快取
      const cachedAdmin = (localStorage.getItem('mj_current_admin_email') || '').toLowerCase().trim();
      if (ADMIN_EMAILS.includes(cachedAdmin)) return true;

      const rawUser = localStorage.getItem('meetjoy_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed.isAdmin || parsed.role === 'administrator' || parsed.role === 'admin') return true;
        const e = (parsed.email || '').toLowerCase().trim();
        if (ADMIN_EMAILS.includes(e)) return true;
      }
    } catch (e) {
      // 靜默容錯
    }
    return false;
  }

  // 判定是否為可互動之元件（豁免區域：表單、按鈕、卡牌、牌桌、手勢舞台）
  function isInteractiveElement(el) {
    if (!el) return false;
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (['input', 'textarea', 'select', 'button', 'a', 'svg', 'path', 'img', 'canvas'].includes(tag)) return true;
    if (el.isContentEditable) return true;

    // 豁免占卜核心互動節點（卡牌、牌桌、扇形展牌舞台、幻燈片彈窗等）
    if (el.closest && el.closest([
      'input',
      'textarea',
      'select',
      'button',
      'a',
      '[role="button"]',
      '.card-scene',
      '.card-deal-in',
      '.flowing-card-unit',
      '.flowing-slot',
      '.card-inner',
      '.card-face',
      '#flowing_shuffle_stage',
      '#flowing_arc_fan',
      '#flowing_cards_stage',
      '#card_stage',
      '#card_slideshow_modal',
      '.ziwei-twelve-board',
      '.celtic-cross-wrapper',
      '[contenteditable="true"]'
    ].join(','))) {
      return true;
    }
    return false;
  }

  function showProtectionToast(msg) {
    if (window.MeetJoyProfiles && typeof window.MeetJoyProfiles.showToast === 'function') {
      window.MeetJoyProfiles.showToast(msg);
      return;
    }
    let toast = document.getElementById('mj_protect_toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mj_protect_toast';
      toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(43,56,40,0.96);color:#FDE68A;padding:10px 22px;border-radius:12px;font-size:13px;font-weight:bold;box-shadow:0 10px 25px rgba(0,0,0,0.35);z-index:999999;pointer-events:none;transition:opacity 0.25s ease-in-out;backdrop-filter:blur(8px);border:1px solid rgba(200,169,126,0.5);text-align:center;letter-spacing:0.5px;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2400);
  }

  function handleCopy(e) {
    if (isAdministrator()) return;
    if (isInteractiveElement(e.target)) return;
    e.preventDefault();
    showProtectionToast('✨ 癒見幸福智慧財產受版權保護，排盤大典內容禁止複製。');
  }

  function handleCut(e) {
    if (isAdministrator()) return;
    if (isInteractiveElement(e.target)) return;
    e.preventDefault();
    showProtectionToast('✨ 癒見幸福智慧財產受版權保護，禁止剪下。');
  }

  function handleContextMenu(e) {
    if (isAdministrator()) return;
    if (isInteractiveElement(e.target)) return;
    // 觸控長按手勢 (Touch) 絕對不予阻斷，防止 WebKit/Safari 強制派發 touchcancel 扼殺長按
    if (e.pointerType === 'touch') return;
    e.preventDefault();
  }

  function handleSelectStart(e) {
    if (isAdministrator()) return;
    if (isInteractiveElement(e.target)) return;
    e.preventDefault();
  }

  function handleKeyDown(e) {
    if (isAdministrator()) return;
    if (isInteractiveElement(e.target)) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = (e.key || '').toLowerCase();

    // 阻斷 Ctrl/Cmd + C (複製), X (剪下), A (全選), U (查看原始碼), S (儲存)
    if (isCtrlOrCmd && ['c', 'x', 'a', 'u', 's'].includes(key)) {
      e.preventDefault();
      if (key === 'c' || key === 'x') {
        showProtectionToast('✨ 癒見幸福智慧財產受版權保護，禁止使用快捷鍵複製。');
      }
    }

    // 阻斷 F12 / Cmd+Option+I (開發者工具)
    if (e.key === 'F12' || (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))) {
      e.preventDefault();
    }
  }

  function applyProtectionStyle() {
    let style = document.getElementById('mj_protect_styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'mj_protect_styles';
      document.head.appendChild(style);
    }

    if (isAdministrator()) {
      style.textContent = '';
      if (document.body) document.body.classList.remove('mj-copy-protected');
      console.log('[MeetJoy Protect] 👑 管理員身分已驗證，放行複製、剪下與選取。');
    } else {
      style.textContent = `
        body.mj-copy-protected,
        body.mj-copy-protected *:not(input):not(textarea):not(select):not([contenteditable="true"]) {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        input, textarea, select, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
      if (document.body) document.body.classList.add('mj-copy-protected');
    }
  }

  function setupEventListeners() {
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('keydown', handleKeyDown, true);
  }

  function updateState() {
    applyProtectionStyle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateState();
      setupEventListeners();
    });
  } else {
    updateState();
    setupEventListeners();
  }

  window.addEventListener('mj-auth-changed', updateState);
  window.addEventListener('mj-profiles-changed', updateState);
  window.addEventListener('storage', updateState);

  window.MeetJoyProtect = {
    isAdministrator,
    updateState
  };
})();
