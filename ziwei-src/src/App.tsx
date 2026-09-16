import { useState, useMemo, useEffect } from 'react';
import './App.css';
import { createZiweiChart, createTwinChart } from './lib';
import type { ZiweiChart, ZiweiHoroscope } from './lib';
import { lunarToSolarDate, leapMonthOfYear, hourOfTimeIndex } from './lib/engine/native/horoscope';
import { AdvancedNav, type AdvLevel } from './components/AdvancedNav';
import { LangContext } from './contexts/LangContext';
import type { Locale } from './i18n';
import { getActiveCharts, getAllCharts, upsertChart, softDeleteChart, generateId, getLastSyncTime, DEFAULT_CATEGORIES, getCustomCategories, saveCustomCategories } from './lib/storage';
import { supabase } from './lib/supabase';
import { syncCharts } from './lib/sync';
import { getSettings, saveSettings, syncSettings } from './lib/settings';
import type { User } from '@supabase/supabase-js';
import type { SavedChart } from './types/savedChart';
import { AstrolabeChart } from './components/AstrolabeChart';
import { DecadalTimeline } from './components/DecadalTimeline';
import { YearlyTimeline } from './components/YearlyTimeline';
import { ChartList } from './components/ChartList';
import { ChartModal } from './components/ChartModal';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/AuthPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { KnownIssues } from './components/KnownIssues';
import { About } from './components/About';
import { BugReportModal } from './components/BugReportModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';

// Revert the accidental '自己'→'我' rename from the rolled-back migration
;(function revertV2Migration() {
  const V = 'ziwei-migrated-v2';
  if (!localStorage.getItem(V)) return;
  try {
    const raw = localStorage.getItem('ziwei-charts');
    if (raw) {
      const charts = JSON.parse(raw);
      localStorage.setItem('ziwei-charts', JSON.stringify(
        charts.map((c: Record<string, unknown>) => ({ ...c, category: c.category === '我' ? '自己' : c.category }))
      ));
    }
  } catch {}
  localStorage.removeItem(V);
}());

type AppPage = 'list' | 'chart';
type ModalState = null | { mode: 'new'; presetCategory?: string } | { mode: 'edit'; chart: SavedChart };

function dateForDecadal(birthSolarDate: string, ageRangeStart: number): Date {
  const [y, m, d] = birthSolarDate.split('-').map(Number);
  return new Date(y + ageRangeStart + 1, m - 1, d + 1);
}

function formatSyncTime(ts: number | null): string {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function adjustSolarDate(solarDate: string, offsetDays: number): string {
  const [y, m, d] = solarDate.split('-').map(Number);
  const date = new Date(y, m - 1, d + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function App() {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalState, setModalState]   = useState<ModalState>(null);
  const [showAuth, setShowAuth]           = useState(false);
  const [showPrivacy, setShowPrivacy]     = useState(false);
  const [showKnownIssues, setShowKnownIssues] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(
    () => window.location.hash.includes('type=recovery')
  );

  // ── Auth (Supabase session) ──────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen to auth changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setShowResetPassword(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    try {
      // 1. 清除紫微斗數所有本地 storage
      localStorage.removeItem('ziwei-user');
      localStorage.removeItem('ziwei-charts');
      localStorage.removeItem('ziwei-current-chart');
      localStorage.removeItem('ziwei-last-sync');

      // 2. 清除通用庫與會員資料
      localStorage.removeItem('mj_member_user');
      localStorage.removeItem('mj_universal_profiles');
      localStorage.removeItem('mj_current_admin_email');

      // 3. 清除所有相關 key (mj_, sb-, ziwei-)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('mj_') || k.startsWith('sb-') || k.startsWith('ziwei-'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // 4. 清除 sessionStorage
      sessionStorage.clear();

      // 5. 派發事件
      window.dispatchEvent(new CustomEvent('mj-auth-changed', { detail: null }));
      window.dispatchEvent(new CustomEvent('mj-profiles-changed'));
      window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated'));
    } catch (e) {
      console.warn('Logout cleanup error:', e);
    }

    // 6. 徹底清理 URL query 並重新載入乾淨頁面
    try {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
      setTimeout(() => {
        window.location.href = cleanUrl;
      }, 80);
    } catch {
      setTimeout(() => {
        window.location.reload();
      }, 80);
    }
  }

  // ── Dynamic zh-mode font sizing based on viewport ─────────────────────────
  useEffect(() => {
    const setDynamicFontSizes = () => {
      // Palace grid is 4 columns; each cell ≈ vw/4
      const cellW = window.innerWidth / 4;
      const root  = document.documentElement;

      // zh vertical mode
      const zhStar  = Math.min(Math.max(cellW * 0.145, 9),  20);
      const zhSmall = Math.min(Math.max(cellW * 0.120, 8),  16);
      const zhTiny  = Math.min(Math.max(cellW * 0.095, 7),  13);
      root.style.setProperty('--fs-zh-star',  `${zhStar.toFixed(1)}px`);
      root.style.setProperty('--fs-zh-small', `${zhSmall.toFixed(1)}px`);
      root.style.setProperty('--fs-zh-tiny',  `${zhTiny.toFixed(1)}px`);

      // pinyin mode (horizontal pinyin text — slightly smaller than zh)
      const pyStar  = Math.min(Math.max(cellW * 0.120, 8),  18);
      const pySmall = Math.min(Math.max(cellW * 0.095, 7),  15);
      root.style.setProperty('--fs-py-star',  `${pyStar.toFixed(1)}px`);
      root.style.setProperty('--fs-py-small', `${pySmall.toFixed(1)}px`);

      // en mode (English names — multi-word)
      const enStar   = Math.min(Math.max(cellW * 0.100, 8),  13);
      const enSmall  = Math.min(Math.max(cellW * 0.082, 7),  11);
      const enPalace = Math.min(Math.max(cellW * 0.095, 8),  13); // palace name in en locale
      root.style.setProperty('--fs-en-star',   `${enStar.toFixed(1)}px`);
      root.style.setProperty('--fs-en-small',  `${enSmall.toFixed(1)}px`);
      root.style.setProperty('--fs-en-palace', `${enPalace.toFixed(1)}px`);
    };
    setDynamicFontSizes();
    window.addEventListener('resize', setDynamicFontSizes);
    return () => window.removeEventListener('resize', setDynamicFontSizes);
  }, []);

  // ── Sync ─────────────────────────────────────────────────────────────────────
  const [syncLoading, setSyncLoading]   = useState(false);
  const [syncError, setSyncError]       = useState('');
  const [lastSync, setLastSync]         = useState<number | null>(() => getLastSyncTime());

  async function handleSync() {
    if (!navigator.onLine) {
      setSyncError(locale === 'en' ? 'Offline — data saved locally' : '無網路，資料已存本機');
      return;
    }
    setSyncLoading(true);
    setSyncError('');
    try {
      await syncCharts();
      // 盤面預設一併同步；伺服器版本較新時要回寫畫面狀態
      const s = await syncSettings();
      setDefaultFeixing(s.defaultFeixing);
      setDefaultZihua(s.defaultZihua);
      const ts = getLastSyncTime();
      setLastSync(ts);
      setSavedCharts(getActiveCharts());
      setCustomCategories(getCustomCategories());
    } catch (err) {
      setSyncError(locale === 'en' ? 'Sync failed — data saved locally' : '同步失敗，資料已存本機');
    } finally {
      setSyncLoading(false);
    }
  }

  const [savedCharts, setSavedCharts] = useState<SavedChart[]>(() => {
    let list = getActiveCharts();
    if (list.length === 0) {
      const demo: SavedChart = {
        id: generateId(),
        name: '癒見幸福 · 示範命盤',
        solarDate: '1990-05-18',
        timeIndex: 6, // 午時
        gender: 'male',
        category: '自己',
        updatedAt: Date.now(),
      };
      upsertChart(demo);
      list = [demo];
    }
    return list;
  });

  function refreshCharts() {
    setSavedCharts(getActiveCharts());
  }

  // 監聽全站通用命盤庫變更事件（如跨分頁、其他工具或頂部通用 Bar 異動）
  useEffect(() => {
    function handleProfileSync() {
      refreshCharts();
    }
    window.addEventListener('mj-profiles-changed', handleProfileSync);
    window.addEventListener('meetjoy_profiles_updated', handleProfileSync);
    window.addEventListener('storage', handleProfileSync);
    return () => {
      window.removeEventListener('mj-profiles-changed', handleProfileSync);
      window.removeEventListener('meetjoy_profiles_updated', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, []);

  // ── Categories ───────────────────────────────────────────────────────────────
  const [customCategories, setCustomCategories] = useState<string[]>(() => getCustomCategories());

  // Auto-discover categories from chart data (handles charts synced from other devices
  // whose categories aren't in this device's localStorage yet)
  const allCategories = useMemo(() => {
    const fromCharts = savedCharts
      .map(c => c.category)
      .filter((cat): cat is string => !!cat && !DEFAULT_CATEGORIES.includes(cat));
    const merged = [...new Set([...customCategories, ...fromCharts])];
    return [...DEFAULT_CATEGORIES, ...merged];
  }, [savedCharts, customCategories]);

  function handleCategoriesChange(newAll: string[]) {
    const custom = newAll.filter(c => !DEFAULT_CATEGORIES.includes(c));
    setCustomCategories(custom);
    saveCustomCategories(custom);
  }

  function handleRenameCategory(oldName: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName || DEFAULT_CATEGORIES.includes(trimmed)) return;
    for (const chart of getAllCharts()) {
      if (chart.category === oldName) {
        upsertChart({ ...chart, category: trimmed, updatedAt: Date.now() });
      }
    }
    const newCustom = customCategories.map(c => c === oldName ? trimmed : c);
    setCustomCategories(newCustom);
    saveCustomCategories(newCustom);
    refreshCharts();
  }

  function handleSaveChart(data: Omit<SavedChart, 'id' | 'updatedAt' | 'deletedAt'>) {
    const id = modalState?.mode === 'edit' ? modalState.chart.id : generateId();
    // 自己 唯一性：清除其他命盤的「自己」分類
    if (data.category === '自己') {
      const prev = savedCharts.find(c => c.category === '自己' && c.id !== id);
      if (prev) upsertChart({ ...prev, category: undefined, updatedAt: Date.now() });
    }
    upsertChart({ ...data, id, updatedAt: Date.now() });
    refreshCharts();
    setModalState(null);

    // 同步儲存至全站通用生辰庫 mj_universal_profiles
    try {
      const rawUniv = localStorage.getItem('mj_universal_profiles');
      let univ = rawUniv ? JSON.parse(rawUniv) : [];
      if (Array.isArray(univ)) {
        univ = univ.filter((p: any) => p.id !== id);
        univ.push({
          id,
          name: data.name || '未命名',
          birthDate: data.solarDate,
          timeIndex: data.timeIndex,
          gender: data.gender,
          category: data.category || '自己',
          notes: data.notes || '',
          updatedAt: Date.now()
        });
        localStorage.setItem('mj_universal_profiles', JSON.stringify(univ));
      }
      window.dispatchEvent(new CustomEvent('mj-profiles-changed'));
    } catch (e) {
      console.warn('[Ziwei] Auto sync to universal profiles failed:', e);
    }
  }

  function handleDeleteChart(id: string) {
    const target = savedCharts.find(c => c.id === id);
    softDeleteChart(id);
    refreshCharts();

    // 徹底從通用生辰庫 mj_universal_profiles 刪除
    try {
      const rawUniv = localStorage.getItem('mj_universal_profiles');
      let univLeft: any[] = [];
      if (rawUniv) {
        const univ = JSON.parse(rawUniv);
        if (Array.isArray(univ)) {
          const tName = target ? (target.name || '').trim() : '';
          const tDate = target ? target.solarDate.replace(/-0?/g, '-') : '';
          univLeft = univ.filter((p: any) => {
            if (p.id === id) return false;
            if (tName && tDate) {
              const pName = (p.name || '').trim();
              const pDate = (p.birthDate || '').replace(/-0?/g, '-');
              if (pName === tName && pDate === tDate) return false;
            }
            return true;
          });
          localStorage.setItem('mj_universal_profiles', JSON.stringify(univLeft));
        }
      }

      // 取得紫微有效剩餘清單
      const activeLeft = getActiveCharts().map(c => ({
        id: c.id,
        name: c.name,
        birthDate: c.solarDate,
        timeIndex: c.timeIndex,
        gender: c.gender,
        category: c.category || '自己',
        notes: c.notes || '',
        updatedAt: c.updatedAt
      }));

      // 同步覆蓋雲端 KV 備份
      const rawUser = localStorage.getItem('mj_member_user') || localStorage.getItem('ziwei-user');
      if (rawUser) {
        const userObj = JSON.parse(rawUser);
        if (userObj && (userObj.email || userObj.id)) {
          fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userObj.email,
              user_id: userObj.id,
              profiles: activeLeft,
              action: 'replace'
            })
          }).catch(err => console.warn('[Ziwei] Cloud delete sync failed:', err));
        }
      }

      // 派發全域同步事件
      window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: { id, deleted: true, count: activeLeft.length } }));
      window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated', { detail: { id, deleted: true, count: activeLeft.length } }));
    } catch (e) {
      console.warn('[Ziwei] Delete cross-sync failed:', e);
    }
  }

  // ── Chart view state ─────────────────────────────────────────────────────────
  const SESSION_KEY = 'ziwei-current-chart';

  function buildChart(saved: SavedChart): ZiweiChart {
    const base = createZiweiChart({
      solarDate: saved.solarDate,
      timeIndex: saved.timeIndex,
      gender: saved.gender,
      name: saved.name,
    });
    const order = saved.multiBirthOrder ?? null;
    return order ? createTwinChart(base, order) : base;
  }

  const [chart, setChart] = useState<ZiweiChart | null>(() => {
    const id = sessionStorage.getItem(SESSION_KEY);
    const active = getActiveCharts();
    const saved = (id ? active.find(c => c.id === id) : active[0]) ?? null;
    if (!saved) return null;
    try { return buildChart(saved); } catch { return null; }
  });
  const [multiBirthOrder, setMultiBirthOrder] = useState<2 | 3 | 4 | null>(() => {
    const id = sessionStorage.getItem(SESSION_KEY);
    const active = getActiveCharts();
    const saved = (id ? active.find(c => c.id === id) : active[0]) ?? null;
    return saved?.multiBirthOrder ?? null;
  });
  const [selectedPalaceIdx, setSelectedPalaceIdx] = useState<number | null>(null);
  const [selectedYear, setSelectedYear]           = useState<number | null>(null);
  const [clickedPalaceIdx, setClickedPalaceIdx]   = useState<number | null>(null);
  const [isMinorLimitMode, setIsMinorLimitMode]   = useState(false);
  // ── Advanced 模式（流月/流日）────────────────────────────────────────────────
  const [advMode, setAdvMode]         = useState(false);
  // 盤面預設（設定選單可改）：飛化預設關、自化預設開。
  // localStorage 為主要來源；登入後按「備份同步」會與雲端雙向合併（見 lib/settings.ts）
  const [defaultFeixing, setDefaultFeixing] = useState(() => getSettings().defaultFeixing);
  const [defaultZihua, setDefaultZihua]     = useState(() => getSettings().defaultZihua);
  const [showFeixing, setShowFeixing] = useState(defaultFeixing); // 飛化上色 開關（兩種模式皆由此 toggle 控制）
  const [showZihua, setShowZihua]     = useState(defaultZihua); // 自化(離心/向心)箭頭 開關（兩種模式皆適用）
  // 設定選單改預設：持久化 + 立即套用到當前盤（盤內 toggle 仍可臨時蓋過、不回寫預設）
  function handleDefaultFeixingChange(on: boolean) {
    saveSettings({ ...getSettings(), defaultFeixing: on });
    setDefaultFeixing(on);
    setShowFeixing(on);
  }
  function handleDefaultZihuaChange(on: boolean) {
    saveSettings({ ...getSettings(), defaultZihua: on });
    setDefaultZihua(on);
    setShowZihua(on);
  }
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // 農曆月序數 1–12
  const [selectedMonthLeap, setSelectedMonthLeap] = useState(false);       // 該月是否為閏月
  const [selectedDay, setSelectedDay]     = useState<number | null>(null); // 農曆日 1–30
  const [selectedHour, setSelectedHour]   = useState<number | null>(null); // 時辰 index 0–11；12 = 晚子時
  // advLevel = 最深選擇（決定 queryDate / 命盤位置）
  const advLevel: AdvLevel = !advMode ? 'natal'
    : selectedHour != null ? 'hourly'
    : selectedDay != null ? 'daily'
    : selectedMonth != null ? 'monthly'
    : selectedYear != null ? 'yearly'
    : selectedPalaceIdx != null ? 'decadal'
    : 'natal';

  // 焦點層：使用者可在 大限/流年/流月/流日 間切換「要顯示哪 3 層運線」，不影響 queryDate。
  // 預設 = 最深選擇；切換焦點時保留所有選擇。
  const [focusLevel, setFocusLevel] = useState<AdvLevel | null>(null);
  const LEVEL_RANK: Record<AdvLevel, number> = { natal: 0, decadal: 1, yearly: 2, monthly: 3, daily: 4, hourly: 5 };
  // 焦點不可比最深選擇更深；null 或超過則跟隨最深
  const effectiveFocus: AdvLevel =
    (!advMode || focusLevel == null || LEVEL_RANK[focusLevel] > LEVEL_RANK[advLevel])
      ? advLevel : focusLevel;

  // 定盤：current saved data + override time index + date offset
  const [currentSaved, setCurrentSaved] = useState<SavedChart | null>(() => {
    const id = sessionStorage.getItem(SESSION_KEY);
    const active = getActiveCharts();
    return (id ? active.find(c => c.id === id) : active[0]) ?? null;
  });
  const [rectTimeIndex, setRectTimeIndex] = useState<number | null>(null);
  const [rectDateOffset, setRectDateOffset] = useState(0);

  // Rebuild chart when rectTimeIndex or rectDateOffset changes
  const displayChart = useMemo<ZiweiChart | null>(() => {
    const noChange = rectTimeIndex === null && rectDateOffset === 0;
    if (noChange || !currentSaved) return chart;
    try {
      const solarDate = rectDateOffset !== 0
        ? adjustSolarDate(currentSaved.solarDate, rectDateOffset)
        : currentSaved.solarDate;
      const timeIndex = rectTimeIndex !== null ? rectTimeIndex : currentSaved.timeIndex;
      return buildChart({ ...currentSaved, solarDate, timeIndex });
    } catch { return chart; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, currentSaved, rectTimeIndex, rectDateOffset]);

  function handlePrevTime() {
    const base = rectTimeIndex !== null ? rectTimeIndex : (currentSaved?.timeIndex ?? 0);
    const next = ((base - 1) + 13) % 13;
    setRectTimeIndex(next);
    if (base === 0) setRectDateOffset(o => o - 1); // 早子時 → 前一天晚子時
  }
  function handleNextTime() {
    const base = rectTimeIndex !== null ? rectTimeIndex : (currentSaved?.timeIndex ?? 0);
    const next = (base + 1) % 13;
    setRectTimeIndex(next);
    if (base === 12) setRectDateOffset(o => o + 1); // 晚子時 → 次日早子時
  }

  // 預設進入「命盤資料庫」列表頁面
  const [page, setPage] = useState<AppPage>('list');

  function handleViewChart(saved: SavedChart) {
    try {
      const c = buildChart(saved);
      setChart(c);
      setMultiBirthOrder(saved.multiBirthOrder ?? null);
      setCurrentSaved(saved);
      setRectTimeIndex(null);
      setRectDateOffset(0);
      setSelectedPalaceIdx(null);
      setSelectedYear(null);
      setClickedPalaceIdx(null);
      setShowFeixing(defaultFeixing); // 開盤以預設值起始（盤內 toggle 為臨時狀態）
      setShowZihua(defaultZihua);
      sessionStorage.setItem(SESSION_KEY, saved.id);
      setPage('chart');
      history.pushState({ page: 'chart', chartId: saved.id }, '');
    } catch (e) {
      console.error('Chart error:', e);
    }
  }

  function handleSaveNotes(text: string) {
    if (!currentSaved) return;
    const next: SavedChart = { ...currentSaved, notes: text || undefined, updatedAt: Date.now() };
    upsertChart(next);
    setCurrentSaved(next);
    setSavedCharts(getActiveCharts());
  }

  function handleSaveAlias(text: string) {
    if (!currentSaved) return;
    const next: SavedChart = { ...currentSaved, alias: text || undefined, updatedAt: Date.now() };
    upsertChart(next);
    setCurrentSaved(next);
    setSavedCharts(getActiveCharts());
  }

  function handleBackToList() {
    sessionStorage.removeItem(SESSION_KEY);
    setPage('list');
    setChart(null);
    setMultiBirthOrder(null);
    setCurrentSaved(null);
    setRectTimeIndex(null);
    setRectDateOffset(0);
    setSelectedPalaceIdx(null);
    setSelectedYear(null);
    setClickedPalaceIdx(null);
    setFocusLevel(null);
    clearMonthDay();
  }

  // 換年後若 selectedMonthLeap 對該年不成立（該年無此閏月）→ 清掉旗標，避免錯誤顯示「閏」
  useEffect(() => {
    if (selectedMonthLeap && selectedYear != null && selectedMonth != null
        && leapMonthOfYear(selectedYear) !== selectedMonth) {
      setSelectedMonthLeap(false);
    }
  }, [selectedYear, selectedMonth, selectedMonthLeap]);

  useEffect(() => {
    // Mark initial list state so forward navigation can detect it
    if (!history.state?.page) history.replaceState({ page: 'list' }, '');

    function onPopState(e: PopStateEvent) {
      if (e.state?.page === 'chart' && page === 'list') {
        // Forward: restore chart from history state
        const chartId = e.state?.chartId as string | undefined;
        const saved = chartId ? getActiveCharts().find(c => c.id === chartId) : null;
        if (saved) {
          try {
            const c = buildChart(saved);
            setChart(c);
            setMultiBirthOrder(saved.multiBirthOrder ?? null);
            setCurrentSaved(saved);
            setRectTimeIndex(null);
            setRectDateOffset(0);
            setSelectedPalaceIdx(null);
            setSelectedYear(null);
            setClickedPalaceIdx(null);
            sessionStorage.setItem(SESSION_KEY, saved.id);
            setPage('chart');
          } catch (e) { console.error('Forward nav error:', e); }
        }
      } else if (page === 'chart') {
        handleBackToList();
      }
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [page]);

  // ── Lang ─────────────────────────────────────────────────────────────────────
  const [locale, setLocaleState] = useState<Locale>(
    () => (localStorage.getItem('ziwei-locale') as Locale) || 'zh-TW'
  );
  const [showPinyin, setShowPinyin] = useState<boolean>(
    () => localStorage.getItem('ziwei-pinyin') === 'true'
  );

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem('ziwei-locale', l);
  }
  function togglePinyin() {
    setShowPinyin(prev => {
      const next = !prev;
      localStorage.setItem('ziwei-pinyin', String(next));
      return next;
    });
  }

  // ── Horoscope ────────────────────────────────────────────────────────────────
  // -1 = 童限 sentinel；null = 本命盤
  const isNatalMode = advMode ? advLevel === 'natal' : (selectedPalaceIdx === null && selectedYear === null);

  // Advanced 模式 3 層滑動視窗：哪些 overlay 層要疊（undefined = 非 Advanced，沿用 legacy）
  // 以焦點為中心的 3 層滑動視窗（夾在 本命↔流日 之間）；視窗內的「運線祿羊陀＋四化」一起顯示。
  // 本命(0)→大限(1)→流年(2)→流月(3)→流日(4)；start = clamp(焦點-1, 0, 2)，視窗 = {start..start+2}。
  const advLayers = advMode ? (() => {
    // 本命焦點（什麼都沒選）：只顯示本命（生年四化），無任何運線 overlay
    if (effectiveFocus === 'natal') {
      return { natal: true, decadal: false, yearly: false, monthly: false, daily: false, hourly: false, minorLimit: false };
    }
    // 3 層焦點視窗：焦點層即「最深顯示層」，往上補兩層較粗的層（焦點 + 上方兩層）。
    //   焦點流月 → 大限/年/月；焦點流日 → 年/月/日。
    // 焦點不往更深延伸：在流日狀態按「流月」即回到乾淨的流月盤（不再疊流日）。
    const fr = LEVEL_RANK[effectiveFocus];
    const start = Math.max(fr - 2, 0);
    const inWin = (r: number) => r >= start && r <= fr;
    return {
      // 生年四化只在焦點視窗涵蓋本命層時顯示（焦點＝本命/大限）。
      // 四化標記一律最多三層，否則同一顆星最多會掛到 4 個 badge，宮格擠爆且難讀。
      // 註：本命祿存/擎羊/陀羅是本命星曜，不受此 gate 影響，任何焦點下都在盤上。
      natal:   inWin(0),
      decadal: inWin(1),
      yearly:  inWin(2),
      monthly: inWin(3),
      daily:   inWin(4),
      hourly:  inWin(5),
      // 小限：opt-in 第四層，與焦點無關，只要有流年脈絡即可（按「限」才顯示）
      minorLimit: selectedYear != null,
    };
  })() : undefined;

  const queryDate = useMemo<Date>(() => {
    const c = displayChart ?? chart;
    if (!c) return new Date();
    if (advMode) {
      const year = selectedYear ?? new Date().getFullYear();
      const sm = selectedMonth != null ? (selectedMonthLeap ? -selectedMonth : selectedMonth) : null; // 負數=閏月
      // 防護：閏月旗標可能因換年而失效（該年無此閏月）、或農曆日不存在（小月無卅）。
      // 依序退讓：原月(可能閏) → 非閏同序數；日：原日 → 29 → 1。任一成立即用。
      const safeLunar = (m: number, d: number): Date => {
        for (const mm of [m, Math.abs(m)]) {
          for (const dd of [d, 29, 1]) {
            try { return lunarToSolarDate(year, mm, dd); } catch { /* try next */ }
          }
        }
        return new Date(year, 6, 1);
      };
      // 流時：先取該流日，再把時辰寫進 Date 的小時；晚子時(12) 依排盤規則改用「隔日早子」
      if (advLevel === 'hourly' && sm != null && selectedDay && selectedHour != null) {
        const base = safeLunar(sm, selectedDay);
        if (selectedHour === 12) {
          const next = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
          next.setHours(0);
          return next;
        }
        base.setHours(hourOfTimeIndex(selectedHour));
        return base;
      }
      if (advLevel === 'daily' && sm != null && selectedDay)
        return safeLunar(sm, selectedDay);
      if (advLevel === 'monthly' && sm != null)
        return safeLunar(sm, 1);
      if (advLevel === 'yearly' && selectedYear !== null)
        return new Date(selectedYear, 6, 1);
      if (advLevel === 'decadal' && selectedPalaceIdx !== null && selectedPalaceIdx !== -1)
        return dateForDecadal(c.birthInfo.solarDate, c.palaces[selectedPalaceIdx].decadal.range[0]);
      if (advLevel === 'decadal' && selectedPalaceIdx === -1)
        return new Date(parseInt(c.birthInfo.solarDate.split('-')[0]), 6, 1);
      return new Date(); // 本命
    }
    if (selectedYear !== null) {
      // 流年 queryDate 用 7/1（確保農曆年正確），大限年差由 lunarBirthYear 閉包處理
      return new Date(selectedYear, 6, 1);
    }
    // -1 = 童限 sentinel：queryDate 用出生年，讓 getCurrentDecadal 正確偵測童限
    if (selectedPalaceIdx === -1) {
      const birthYear = parseInt(c.birthInfo.solarDate.split('-')[0]);
      return new Date(birthYear, 6, 1);
    }
    if (selectedPalaceIdx !== null) {
      const palace = c.palaces[selectedPalaceIdx];
      return dateForDecadal(c.birthInfo.solarDate, palace.decadal.range[0]);
    }
    // natal mode：用今天，避免用出生日期誤判童限
    return new Date();
  }, [displayChart, chart, selectedPalaceIdx, selectedYear, advMode, advLevel, selectedMonth, selectedMonthLeap, selectedDay, selectedHour]);

  const horoscope = useMemo<ZiweiHoroscope | null>(() => {
    const c = displayChart ?? chart;
    if (!c) return null;
    return c.horoscope(queryDate);
  }, [displayChart, chart, queryDate]);

  const originPalaceIdx: number = horoscope
    ? (clickedPalaceIdx !== null
        ? clickedPalaceIdx
        : advMode
          ? (effectiveFocus === 'hourly'  ? horoscope.hourly.palaceIndex
            : effectiveFocus === 'daily'   ? horoscope.daily.palaceIndex
            : effectiveFocus === 'monthly' ? horoscope.monthly.palaceIndex
            : effectiveFocus === 'yearly'  ? horoscope.yearly.palaceIndex
            : effectiveFocus === 'decadal' ? horoscope.decadal.palaceIndex
            : 0)
        : (selectedPalaceIdx !== null && selectedYear === null)
          ? horoscope.decadal.palaceIndex
          : horoscope.yearly.palaceIndex)
    : 0;

  function clearMonthDay() { setSelectedMonth(null); setSelectedMonthLeap(false); setSelectedDay(null); setSelectedHour(null); }
  function handleDecadalSelect(palaceIdx: number | null) {
    // Advanced 模式下點「目前這一格大限」有兩段行為（點其他格 = 導航過去並清掉更深層）：
    //   1. 還有更深的選擇(流年/月/日/時) → 只把焦點收回大限，選擇全保留
    //   2. 沒有更深選擇 → 取消大限選擇，回本命盤（與非進階模式一致；
    //      少了這段就完全沒有回本命盤的路，是先前的缺口）
    // 前提：本來就有選東西。否則從乾淨的本命盤點大限會誤入兩段式，
    // 只設了 focusLevel 卻沒設 selectedPalaceIdx，被 effectiveFocus 夾回 natal → 點了沒反應。
    const hasSelection = selectedPalaceIdx != null || selectedYear != null
      || selectedMonth != null || selectedDay != null || selectedHour != null;
    if (advMode && palaceIdx !== null && horoscope && hasSelection) {
      const activeIdx = selectedPalaceIdx ?? horoscope.decadal.palaceIndex;
      if (palaceIdx === activeIdx) {
        // 第一下：焦點收回大限，流年/月/日/時的選擇全保留（可再點 chip 跳回去）
        if (effectiveFocus !== 'decadal') {
          setFocusLevel('decadal');
          setClickedPalaceIdx(null);
          return;
        }
        // 第二下：焦點已在大限 → 全部取消，回本命盤（往下走幾層都是 2 下到底）
        palaceIdx = null;
      }
    }
    setSelectedPalaceIdx(palaceIdx);
    setSelectedYear(null);
    clearMonthDay();
    setClickedPalaceIdx(null);
    setIsMinorLimitMode(false);
    if (advMode) setFocusLevel(palaceIdx === null ? null : 'decadal');
  }
  function handleYearSelect(year: number | null) {
    // 同 handleDecadalSelect 的兩段行為：第一下收回流年焦點(保留月/日/時)，第二下取消流年退回大限層
    if (advMode && year !== null && year === selectedYear) {
      if (effectiveFocus !== 'yearly') {
        setFocusLevel('yearly');
        setClickedPalaceIdx(null);
        return;
      }
      year = null;
    }
    clearMonthDay();
    // 直接從本命盤選流年（未明確選大限）→ deselect 流年時回到推算的大限
    if (year === null && selectedPalaceIdx === null && horoscope) {
      const inferredIdx = horoscope.decadal.isChildhood ? -1 : horoscope.decadal.palaceIndex;
      setSelectedPalaceIdx(inferredIdx);
    }
    setSelectedYear(year);
    setClickedPalaceIdx(null);
    setIsMinorLimitMode(false);
    if (advMode) setFocusLevel(year === null ? 'decadal' : 'yearly');
  }
  function handlePalaceClick(idx: number) {
    setClickedPalaceIdx(prev => prev === idx ? null : idx);
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  const syncStatusLabel = syncLoading
    ? (locale === 'en' ? 'Syncing...' : '同步中...')
    : syncError
      ? `⚠ ${syncError}`
      : lastSync
        ? (locale === 'en' ? `Last sync ${formatSyncTime(lastSync)}` : `上次同步 ${formatSyncTime(lastSync)}`)
        : '';

  return (
    <LangContext.Provider value={{ locale, showPinyin, setLocale, togglePinyin }}>
      <div className={`app${page === 'chart' ? ' page-chart' : ''}`} data-show-pinyin={String(showPinyin)} data-locale={locale}>

        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            auth={{ isLoggedIn: !!user, email: user?.email }}
            onClose={() => setSidebarOpen(false)}
            onLoginClick={() => setShowAuth(true)}
            onLogout={handleLogout}
            onSyncClick={handleSync}
            onPrivacyClick={() => setShowPrivacy(true)}
            onKnownIssuesClick={() => setShowKnownIssues(true)}
            onAboutClick={() => setShowAbout(true)}
            onBugReportClick={() => setShowBugReport(true)}
            syncStatus={syncStatusLabel}
            defaultFeixing={defaultFeixing}
            defaultZihua={defaultZihua}
            onDefaultFeixingChange={handleDefaultFeixingChange}
            onDefaultZihuaChange={handleDefaultZihuaChange}
          />
        )}

        {/* Auth modal */}
        {showAuth && (
          <AuthPage onClose={() => setShowAuth(false)} />
        )}

        {/* Privacy Policy modal */}
        {showPrivacy && (
          <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
        )}

        {/* Known Issues modal */}
        {showKnownIssues && (
          <KnownIssues onClose={() => setShowKnownIssues(false)} />
        )}

        {/* About modal */}
        {showAbout && (
          <About onClose={() => setShowAbout(false)} />
        )}

        {showBugReport && (
          <BugReportModal
            userEmail={user?.email}
            onClose={() => setShowBugReport(false)}
          />
        )}

        {/* Reset password modal (triggered by email link) */}
        {showResetPassword && (
          <ResetPasswordModal onDone={() => setShowResetPassword(false)} />
        )}

        {/* Chart modal */}
        {modalState !== null && (
          <ChartModal
            mode={modalState.mode}
            initial={modalState.mode === 'edit' ? modalState.chart : undefined}
            presetCategory={modalState.mode === 'new' ? modalState.presetCategory : undefined}
            categories={allCategories}
            onSave={handleSaveChart}
            onClose={() => setModalState(null)}
          />
        )}

        {/* List page */}
        {page === 'list' && (
          <ChartList
            charts={savedCharts}
            categories={allCategories}
            onCategoriesChange={handleCategoriesChange}
            onRenameCategory={handleRenameCategory}
            onView={handleViewChart}
            onEdit={c => setModalState({ mode: 'edit', chart: c })}
            onDelete={handleDeleteChart}
            onAddNew={presetCategory => setModalState({ mode: 'new', presetCategory })}
            onOpenSidebar={() => setSidebarOpen(true)}
            isLoggedIn={!!user}
          />
        )}

        {/* Chart page */}
        {page === 'chart' && chart && horoscope && (
          <div className="chart-page">
            <AstrolabeChart
              chart={displayChart ?? chart}
              horoscope={horoscope}
              isNatalMode={isNatalMode}
              isYearlyMode={selectedYear !== null}
              isMinorLimitMode={isMinorLimitMode && (selectedYear !== null)}
              onMinorLimitToggle={() => setIsMinorLimitMode(v => !v)}
              clickedPalaceIdx={clickedPalaceIdx}
              onPalaceClick={handlePalaceClick}
              originPalaceIdx={originPalaceIdx}
              onReset={handleBackToList}
              multiBirthOrder={multiBirthOrder}
              onPrevTime={handlePrevTime}
              onNextTime={handleNextTime}
              isRectified={rectDateOffset !== 0 || (rectTimeIndex !== null && rectTimeIndex !== currentSaved?.timeIndex)}
              advMode={advMode}
              onAdvToggle={() => { setAdvMode(v => !v); setFocusLevel(null); setClickedPalaceIdx(null); }}
              advLayers={advLayers}
              advFocus={advMode ? effectiveFocus : undefined}
              notes={currentSaved?.notes}
              onSaveNotes={currentSaved ? handleSaveNotes : undefined}
              chartId={currentSaved?.id}
              alias={currentSaved?.alias}
              onSaveAlias={currentSaved ? handleSaveAlias : undefined}
              taijiBaseIdx={(effectiveFocus === 'monthly' || effectiveFocus === 'daily' || effectiveFocus === 'hourly') ? null : clickedPalaceIdx}
              feixingBaseIdx={clickedPalaceIdx}
              feixingShow={showFeixing}
              onToggleFeixing={() => setShowFeixing(v => !v)}
              zihuaShow={showZihua}
              onToggleZihua={() => setShowZihua(v => !v)}
              childhoodOverride={
                !advMode && selectedPalaceIdx === -1
                  ? [1, Math.min(...((displayChart ?? chart)?.palaces.map(p => p.decadal.range[0]) ?? [1])) - 1] as [number, number]
                  : undefined
              }
            />
            <>
              <DecadalTimeline
                chart={displayChart ?? chart}
                horoscope={horoscope}
                selectedPalaceIdx={selectedPalaceIdx}
                isNatalMode={isNatalMode}
                onSelect={handleDecadalSelect}
                advMode={advMode}
              />
              <YearlyTimeline
                chart={displayChart ?? chart}
                horoscope={horoscope}
                selectedYear={selectedYear}
                onSelect={handleYearSelect}
                advMode={advMode}
                isChildhood={selectedPalaceIdx === -1 ? true : undefined}
                decadalRange={
                  selectedPalaceIdx === -1
                    ? [1, Math.min(...((displayChart ?? chart)?.palaces.map(p => p.decadal.range[0]) ?? [1])) - 1] as [number, number]
                    : selectedPalaceIdx !== null
                      ? ((displayChart ?? chart)?.palaces.find(p => p.index === selectedPalaceIdx)?.decadal.range as [number, number] | undefined)
                      : undefined
                }
              />
              {advMode && (
                <AdvancedNav
                  chart={displayChart ?? chart}
                  selectedPalaceIdx={selectedPalaceIdx}
                  setSelectedPalaceIdx={setSelectedPalaceIdx}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedMonthLeap={selectedMonthLeap}
                  setSelectedMonthLeap={setSelectedMonthLeap}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  selectedHour={selectedHour}
                  setSelectedHour={setSelectedHour}
                  onFocus={setFocusLevel}
                />
              )}
            </>
          </div>
        )}
      </div>
    </LangContext.Provider>
  );
}

export default App;
