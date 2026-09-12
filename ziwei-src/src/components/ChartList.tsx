import { useState, useRef, useEffect } from 'react';
import type { SavedChart } from '../types/savedChart';
import { TIME_LABELS, TIME_HOURS, BRANCH_PINYIN, SUPPORTED_LOCALES } from '../i18n';
import type { Locale } from '../i18n';
import { DEFAULT_CATEGORIES } from '../lib/storage';
import { useLang } from '../contexts/LangContext';

const ACTIVE_CAT_KEY = 'ziwei-active-cat';
// 「無標籤」篩選用的哨兵值：篩出未設分類的命盤。
// 用底線包夾避免與自訂分類撞名（自訂分類上限 10 顯示寬度，且不會有人取這個名字）。
const UNTAGGED = '__untagged__';

const CAT_LABELS: Record<string, Record<string, string>> = {
  '自己': { 'zh-TW': '自己', 'zh-CN': '自己', 'en': 'Me' },
  '家人': { 'zh-TW': '家人', 'zh-CN': '家人', 'en': 'Family' },
  '朋友': { 'zh-TW': '朋友', 'zh-CN': '朋友', 'en': 'Friends' },
  '客戶': { 'zh-TW': '客戶', 'zh-CN': '客户', 'en': 'Clients' },
  '名人': { 'zh-TW': '名人', 'zh-CN': '名人', 'en': 'Celebrities' },
};
function catLabel(cat: string, locale: string): string {
  return CAT_LABELS[cat]?.[locale] ?? cat;
}

// 自訂分類字數限制：顯示寬度 ≤10（全形 CJK = 2、半形英數 = 1）。
// ⇒ 純中文最多 5 字、純英文最多 10 字母（兩端點同為 10 寬）；混合按寬度算。
const MAX_CAT_WIDTH = 10;
function isFullWidth(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (
    (code >= 0x1100 && code <= 0x115F) ||  // Hangul Jamo
    (code >= 0x2E80 && code <= 0xA4CF) ||  // CJK 部首…注音…彝
    (code >= 0xAC00 && code <= 0xD7A3) ||  // Hangul 音節
    (code >= 0xF900 && code <= 0xFAFF) ||  // CJK 相容表意
    (code >= 0xFF00 && code <= 0xFF60) ||  // 全形 ASCII
    (code >= 0xFFE0 && code <= 0xFFE6) ||  // 全形符號
    (code >= 0x1F300 && code <= 0x1FAFF) || // emoji（視為全形）
    (code >= 0x20000 && code <= 0x3FFFD)    // CJK 擴充 B+
  );
}
function clampWidth(str: string): string {
  let w = 0, out = '';
  for (const ch of str) {            // 以 code point 逐字（正確處理 surrogate pair）
    const nw = w + (isFullWidth(ch) ? 2 : 1);
    if (nw > MAX_CAT_WIDTH) break;
    w = nw; out += ch;
  }
  return out;
}

interface Props {
  charts: SavedChart[];
  categories: string[];
  onCategoriesChange: (cats: string[]) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onView: (chart: SavedChart) => void;
  onEdit: (chart: SavedChart) => void;
  onDelete: (id: string) => void;
  onAddNew: (presetCategory?: string) => void;
  onOpenSidebar: () => void;
  isLoggedIn?: boolean;
}

function GenderIcon({ gender }: { gender: 'male' | 'female' }) {
  return (
    <span className={`chart-gender-icon ${gender}`}>
      {gender === 'female' ? '♀' : '♂'}
    </span>
  );
}

function timeLabel(timeIndex: number, locale: Locale, showPinyin: boolean): string {
  const zh = TIME_LABELS[timeIndex] ?? '？';
  const pinyin = BRANCH_PINYIN[zh] ?? '';
  const hours = TIME_HOURS[timeIndex] ?? '';
  if (locale === 'en') return `${pinyin}${hours ? '  ' + hours : ''}`;
  const pinyinPart = showPinyin && pinyin ? '　' + pinyin : '';
  return `${zh}時${pinyinPart}${hours ? '　' + hours : ''}`;
}

const TWIN_LABELS: Record<Locale, string[]> = {
  'zh-TW': ['第二胎 Twin 2', '第三胎 Triplet 3', '第四胎 Quadruplet 4'],
  'zh-CN': ['第二胎 Twin 2', '第三胎 Triplet 3', '第四胎 Quadruplet 4'],
  'en':    ['Twin 2',        'Triplet 3',         'Quadruplet 4'],
};

export function ChartList({ charts, categories, onCategoriesChange, onRenameCategory, onView, onEdit, onDelete, onAddNew, onOpenSidebar, isLoggedIn = false }: Props) {
  const { locale, setLocale, showPinyin } = useLang();

  type UIStrings = { title: string; search: string; edit: string; delete: string; confirmDelete: string; noResults: string; empty: string; allTab: string; untaggedTab: string; unnamed: string; catPlaceholder: string; addChart: string; customCat: string };
  const UI_BY_LOCALE: Record<string, UIStrings> = {
    'en':    { title: 'Charts',      search: 'Search by name or date...', edit: 'Edit',  delete: 'Delete', confirmDelete: 'Confirm?',  noResults: 'No results found',    empty: 'No charts yet — use ＋ to add',  allTab: 'All',  untaggedTab: 'Untagged',  unnamed: '(Unnamed)',   catPlaceholder: 'Category name', addChart: 'New Chart', customCat: 'Custom' },
    'zh-TW': { title: '命盤資料庫', search: '搜尋名字或日期',            edit: '編輯', delete: '刪除',  confirmDelete: '確認刪除',  noResults: '找不到符合的命盤',  empty: '尚無命盤，點右上角 ＋ 新增', allTab: '全部', untaggedTab: '無標籤', unnamed: '（無名稱）', catPlaceholder: '分類名稱',    addChart: '新增命盤', customCat: '自訂' },
    'zh-CN': { title: '命盘资料库', search: '搜寻名字或日期',            edit: '编辑', delete: '删除',  confirmDelete: '确认删除',  noResults: '找不到符合的命盘',  empty: '尚无命盘，点右上角 ＋ 新增', allTab: '全部', untaggedTab: '无标签', unnamed: '（无名称）', catPlaceholder: '分类名称',    addChart: '新增命盘', customCat: '自定义' },
  };
  const UI = UI_BY_LOCALE[locale] ?? UI_BY_LOCALE['zh-TW'];

  const [query, setQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // 分類列預設收合成一行（手機），按「⋯」展開全部；橫向捲動在手機上不好操作，故用展開而非捲動
  const [tabsExpanded, setTabsExpanded] = useState(false);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localeMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (!localeMenuRef.current?.contains(e.target as Node)) setLocaleMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [localeMenuOpen]);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_CAT_KEY) ?? 'all';
  });
  const [privacyMode, setPrivacyMode] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const newCatInputRef = useRef<HTMLInputElement>(null);

  // Rename state
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const editingCatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingCategory) newCatInputRef.current?.focus();
  }, [addingCategory]);

  useEffect(() => {
    if (editingCat) editingCatInputRef.current?.focus();
  }, [editingCat]);

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    localStorage.setItem(ACTIVE_CAT_KEY, cat);
    setConfirmDeleteId(null);
  }

  const MAX_CUSTOM_CATS = 7;
  const customCatCount = categories.filter(c => !DEFAULT_CATEGORIES.includes(c)).length;

  function handleAddCategory() {
    const trimmed = newCatName.trim();
    if (trimmed && !categories.includes(trimmed) && customCatCount < MAX_CUSTOM_CATS) {
      onCategoriesChange([...categories, trimmed]);
      selectCategory(trimmed);
    }
    setNewCatName('');
    setAddingCategory(false);
  }

  function handleDeleteCategory(cat: string) {
    onCategoriesChange(categories.filter(c => c !== cat));
    if (activeCategory === cat) selectCategory('all');
  }

  function startEditingCat(cat: string) {
    setEditingCat(cat);
    setEditingCatName(cat);
  }

  function commitEditingCat() {
    if (editingCat && editingCatName.trim() && editingCatName.trim() !== editingCat) {
      onRenameCategory(editingCat, editingCatName.trim());
      if (activeCategory === editingCat) selectCategory(editingCatName.trim());
    }
    setEditingCat(null);
    setEditingCatName('');
  }

  function handleDelete(id: string) {
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  }

  const validTab = activeCategory === 'all' || activeCategory === UNTAGGED || categories.includes(activeCategory);
  // 「無標籤」tab：僅在真的有未分類命盤時顯示（或正選在該 tab，避免選著選著消失）
  const hasUntagged = charts.some(c => !c.category);
  const showUntaggedTab = hasUntagged || activeCategory === UNTAGGED;
  const filtered = charts
    .filter(c => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.solarDate.includes(query);
      const matchesCategory = !validTab || activeCategory === 'all'
        || (activeCategory === UNTAGGED ? !c.category : c.category === activeCategory);
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => (a.category === '自己' ? -1 : b.category === '自己' ? 1 : 0));

  const activeCategoryLabel = activeCategory === 'all' ? UI.allTab
    : activeCategory === UNTAGGED ? UI.untaggedTab
    : catLabel(activeCategory, locale);

  return (
    <div className="chart-list-page">
      {/* 標題列＋分類＋搜尋合成一個 sticky 區塊：捲動命盤時固定在頂，隨時可切分類/搜尋 */}
      <div className="chart-list-top">
      {/* Header */}
      <div className="chart-list-header">
        {!privacyMode && (
          <button className="btn-hamburger" onClick={onOpenSidebar}>☰</button>
        )}
        <h1 className="chart-list-title">
          {privacyMode ? activeCategoryLabel : UI.title}
        </h1>
        {!privacyMode && (
          // 「無標籤」tab 下新增 → 不預選分類（本來就是要建無分類的盤）
          <button className="btn-add-chart" onClick={() => onAddNew(validTab && activeCategory !== 'all' && activeCategory !== UNTAGGED ? activeCategory : undefined)} title={UI.addChart}>＋</button>
        )}
        {!privacyMode && (
          <div className="locale-menu-wrap" ref={localeMenuRef}>
            <button className="btn-locale" onClick={() => setLocaleMenuOpen(p => !p)} title="語言 Language">🌐</button>
            {localeMenuOpen && (
              <div className="locale-menu">
                {SUPPORTED_LOCALES.map(l => (
                  <button
                    key={l.code}
                    className={`locale-menu-item${locale === l.code ? ' active' : ''}`}
                    onClick={() => { setLocale(l.code); setLocaleMenuOpen(false); }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          className={`btn-privacy${privacyMode ? ' active' : ''}`}
          onClick={() => setPrivacyMode(p => !p)}
          title={privacyMode ? 'Exit privacy' : 'Privacy mode'}
        >
          {privacyMode ? '🔓' : '🔒'}
        </button>
      </div>

      {/* Category tabs */}
      {!privacyMode && (
        <div className={`category-tabs-row${tabsExpanded ? ' expanded' : ''}`}>
          <div className="category-tabs-list">
          <button
            className={`category-tab${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => selectCategory('all')}
          >
            {UI.allTab}
          </button>
          {categories.map(cat => {
            const isCustom = !DEFAULT_CATEGORIES.includes(cat);
            if (isCustom && editingCat === cat) {
              return (
                <div key={cat} className="category-tab-input-wrap">
                  <input
                    ref={editingCatInputRef}
                    className="category-tab-input"
                    value={editingCatName}
                    onChange={e => setEditingCatName(clampWidth(e.target.value))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitEditingCat();
                      if (e.key === 'Escape') { setEditingCat(null); setEditingCatName(''); }
                    }}
                    onBlur={commitEditingCat}
                    maxLength={10}
                  />
                </div>
              );
            }
            return (
              <button
                key={cat}
                className={`category-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => selectCategory(cat)}
                onDoubleClick={isCustom ? () => startEditingCat(cat) : undefined}
              >
                {catLabel(cat, locale)}
                {isCustom && (
                  <span
                    className="category-tab-delete"
                    onClick={e => { e.stopPropagation(); handleDeleteCategory(cat); }}
                  >×</span>
                )}
              </button>
            );
          })}
          {showUntaggedTab && (
            <button
              className={`category-tab category-tab-untagged${activeCategory === UNTAGGED ? ' active' : ''}`}
              onClick={() => selectCategory(UNTAGGED)}
            >
              {UI.untaggedTab}
            </button>
          )}
          {customCatCount < MAX_CUSTOM_CATS && (
            addingCategory ? (
              <div className="category-tab-input-wrap">
                <input
                  ref={newCatInputRef}
                  className="category-tab-input"
                  value={newCatName}
                  onChange={e => setNewCatName(clampWidth(e.target.value))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddCategory();
                    if (e.key === 'Escape') { setAddingCategory(false); setNewCatName(''); }
                  }}
                  onBlur={handleAddCategory}
                  placeholder={UI.catPlaceholder}
                  maxLength={10}
                />
              </div>
            ) : (
              <button className="category-tab-add" onClick={() => setAddingCategory(true)}>＋</button>
            )
          )}
          <span className="category-count">{UI.customCat} {customCatCount}/{MAX_CUSTOM_CATS}</span>
          </div>
          <button
            className="category-tabs-more"
            onClick={() => setTabsExpanded(v => !v)}
            title={tabsExpanded ? '收合分類' : '展開全部分類'}
            aria-expanded={tabsExpanded}
          >{tabsExpanded ? '⌃' : '⋯'}</button>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setConfirmDeleteId(null); }}
          placeholder={UI.search}
          className="search-input"
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>✕</button>
        )}
      </div>
      </div>

      {/* List */}
      <div className="chart-items">
        {filtered.length === 0 && (
          <div className="chart-empty">
            {query ? UI.noResults : UI.empty}
          </div>
        )}
        {!isLoggedIn && !query && (
          <div className="chart-local-notice">
            {locale === 'en'
              ? 'Your data stays on this device. Sign up to back it up to the cloud.'
              : locale === 'zh-CN'
                ? '资料仅储存于本设备。注册登入后可备份至云端。'
                : '資料僅儲存於本裝置。註冊登入後可備份至雲端。'}
          </div>
        )}
        {filtered.map(c => (
          <div key={c.id} className="chart-item">
            <div className="chart-item-main" onClick={() => onView(c)}>
              <GenderIcon gender={c.gender} />
              <div className="chart-item-info">
                <div className="chart-item-name">
                  {c.name || UI.unnamed}
                  {c.multiBirthOrder && (
                    <span className="twin2-badge">{TWIN_LABELS[locale][c.multiBirthOrder - 2]}</span>
                  )}
                  {activeCategory === 'all' && c.category && (
                    <span className="category-badge">{catLabel(c.category, locale)}</span>
                  )}
                </div>
                <div className="chart-item-date">{c.solarDate}　{timeLabel(c.timeIndex, locale, showPinyin)}</div>
              </div>
            </div>
            {!privacyMode && (
              <div className="chart-item-actions">
                <button className="btn-edit" onClick={e => { e.stopPropagation(); onEdit(c); }}>{UI.edit}</button>
                <button
                  className={`btn-delete${confirmDeleteId === c.id ? ' confirm' : ''}`}
                  onClick={e => { e.stopPropagation(); handleDelete(c.id); }}
                >
                  {confirmDeleteId === c.id ? UI.confirmDelete : UI.delete}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
