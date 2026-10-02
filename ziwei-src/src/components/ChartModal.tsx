import { useState, useRef, useEffect } from 'react';
import type { SavedChart } from '../types/savedChart';
import { TIME_LABELS, TIME_HOURS, BRANCH_PINYIN } from '../i18n';
import { useLang } from '../contexts/LangContext';
import { randomAnonName, RANDOM_NAME_PREFIX } from '../lib/anonName';
import { catLabel } from '../lib/storage';
import { isValidZizhanNumber, ZIZHAN_MIN, ZIZHAN_MAX } from '../lib/zizhan';

interface Props {
  mode: 'new' | 'edit';
  initial?: SavedChart;
  /** 新增模式：預選分類（列表當前選中的 tag，「全部」時為 undefined） */
  presetCategory?: string;
  categories: string[];
  onSave: (data: Omit<SavedChart, 'id' | 'updatedAt' | 'deletedAt'>) => void;
  /** 紫占：報兩個數字 → 由 App 亂數起盤、入庫、直接開盤（新增模式才有） */
  onCreateZizhan?: (n1: number, n2: number) => void;
  onClose: () => void;
}

function randomDefaults() {
  const today = new Date();
  const minMs = new Date(1950, 0, 1).getTime();
  const rand = new Date(minMs + Math.random() * (today.getTime() - minMs));
  return {
    year: rand.getFullYear(),
    month: rand.getMonth() + 1,
    day: rand.getDate(),
    timeIndex: Math.floor(Math.random() * 13),
    gender: Math.random() < 0.5 ? 'male' : 'female' as 'male' | 'female',
  };
}

// 隨機起盤的姓名：用匿名迷因代號邏輯（不產生像真名的字串），前綴「隨機-」標明來源
function randomName(): string {
  return `${RANDOM_NAME_PREFIX}${randomAnonName()}`;
}

export function ChartModal({ mode, initial, presetCategory, categories, onSave, onCreateZizhan, onClose }: Props) {
  const { locale } = useLang();
  const isEn = locale === 'en';
  type UIStrings = { title: string; gender: string; female: string; male: string; name: string; optional: string; category: string; birthday: string; hour: string; confirm: string; cancel: string; advanced: string; zizhan: string; menuRandom: string; menuZizhan: string; randomHint: string; zizhanTitle: string; zizhanHint: string; zizhanGo: string; back: string };
  const UI_MAP: Record<string, UIStrings> = {
    'en':    { title: mode === 'new' ? 'New Chart'  : 'Edit Chart', gender: 'Gender', female: '♀ Female', male: '♂ Male', name: 'Name',  optional: 'optional', category: 'Category', birthday: 'Solar Birthday', hour: 'Hour',  confirm: mode === 'new' ? 'Generate Chart ➔'  : 'Save', cancel: 'Cancel', advanced: 'Multiple Birth · Beta', zizhan: 'Divination', menuRandom: '🎲 Random chart', menuZizhan: '🔮 Enter numbers', randomHint: 'Randomize gender / birthday / hour and fill a random name', zizhanTitle: 'Zi Wei Divination', zizhanHint: `Hold your question in mind, then give two numbers (${ZIZHAN_MIN}–${ZIZHAN_MAX}). The chart is cast at random from them and opens right away.`, zizhanGo: 'Cast', back: 'Back' },
    'zh-TW': { title: mode === 'new' ? '新增排盤'  : '編輯命盤',   gender: '性別',   female: '♀ 女',     male: '♂ 男',   name: '姓名', optional: '選填',     category: '分類',     birthday: '陽曆生日',       hour: '時辰', confirm: mode === 'new' ? '立即排盤 ➔' : '確認修改', cancel: '取消', advanced: '多胞胎功能 · 測試中 Beta', zizhan: '紫占', menuRandom: '🎲 系統隨機', menuZizhan: '🔮 輸入數字', randomHint: '隨機起盤：隨機填入性別／生日／時辰與姓名（可重複點重骰）', zizhanTitle: '紫微占卜', zizhanHint: `心中默想問題，報兩個 ${ZIZHAN_MIN}–${ZIZHAN_MAX} 的數字，系統以此亂數起盤並直接開盤。`, zizhanGo: '起盤', back: '返回' },
    'zh-CN': { title: mode === 'new' ? '新增排盘'  : '编辑命盘',   gender: '性别',   female: '♀ 女',     male: '♂ 男',   name: '姓名', optional: '选填',     category: '分类',     birthday: '阳历生日',       hour: '时辰', confirm: mode === 'new' ? '立即排盘 ➔' : '确认修改', cancel: '取消', advanced: '多胞胎功能 · 测试中 Beta', zizhan: '紫占', menuRandom: '🎲 系统随机', menuZizhan: '🔮 输入数字', randomHint: '随机起盘：随机填入性别／生日／时辰与姓名（可重复点重骰）', zizhanTitle: '紫微占卜', zizhanHint: `心中默想问题，报两个 ${ZIZHAN_MIN}–${ZIZHAN_MAX} 的数字，系统以此乱数起盘并直接开盘。`, zizhanGo: '起盘', back: '返回' },
  };
  const UI = UI_MAP[locale] ?? UI_MAP['zh-TW'];

  const [name, setName]       = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? presetCategory ?? '');
  const def = useState(() => initial ? null : randomDefaults())[0];
  const [year, setYear]       = useState(() =>
    initial ? String(initial.solarDate.split('-')[0]) : String(def!.year)
  );
  const [month, setMonth]     = useState(() =>
    initial ? String(Number(initial.solarDate.split('-')[1])) : String(def!.month)
  );
  const [day, setDay]         = useState(() =>
    initial ? String(Number(initial.solarDate.split('-')[2])) : String(def!.day)
  );
  const [timeIndex, setTimeIndex] = useState(() =>
    initial ? initial.timeIndex : def!.timeIndex
  );
  const [gender, setGender]   = useState<'male' | 'female'>(() =>
    initial ? initial.gender : def!.gender
  );
  const [multiBirthOrder, setMultiBirthOrder] = useState<2 | 3 | 4 | null>(
    initial?.multiBirthOrder ?? null
  );
  const [showAdvanced, setShowAdvanced] = useState(!!initial?.multiBirthOrder);

  // 隨機起盤：重骰性別/生日/時辰 + 填隨機姓名（可重複點）
  function rerollRandom() {
    const d = randomDefaults();
    setYear(String(d.year));
    setMonth(String(d.month));
    setDay(String(d.day));
    setTimeIndex(d.timeIndex);
    setGender(d.gender);
    setName(randomName());
  }

  // 🔮 紫占鈕：點開選單（系統隨機／紫微占卜）；紫微占卜 → 換成報數面板
  const [menuOpen, setMenuOpen] = useState(false);
  const [zizhanOpen, setZizhanOpen] = useState(false);
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);
  const num1 = parseInt(n1, 10), num2 = parseInt(n2, 10);
  const zizhanValid = isValidZizhanNumber(num1) && isValidZizhanNumber(num2);
  function handleZizhanSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (zizhanValid) onCreateZizhan?.(num1, num2);
  }

  function handleRangeInvalid(e: React.InvalidEvent<HTMLInputElement>) {
    const v = e.currentTarget.validity;
    if (v.rangeOverflow || v.rangeUnderflow) e.currentTarget.setCustomValidity('Out of range');
  }
  function resetValidity(e: React.ChangeEvent<HTMLInputElement>) {
    e.currentTarget.setCustomValidity('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const y = parseInt(year, 10);
    const m = Math.min(12, Math.max(1, parseInt(month, 10) || 1));
    const d = Math.min(31, Math.max(1, parseInt(day, 10) || 1));
    if (!y || y < 100 || y > 9999) return;   // 100–9999：紫占盤生日可落任何年代；<100 會被 JS Date 當 19xx
    const sm = String(m).padStart(2, '0');
    const sd = String(d).padStart(2, '0');
    onSave({ name, solarDate: `${y}-${sm}-${sd}`, timeIndex, gender, multiBirthOrder: multiBirthOrder ?? undefined, category: category || undefined });
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{zizhanOpen ? UI.zizhanTitle : UI.title}</span>
          <div className="modal-header-actions">
            {mode === 'new' && !zizhanOpen && (
              <div className="modal-random-wrap" ref={menuRef}>
                <button
                  type="button"
                  className={`modal-random-btn${menuOpen ? ' active' : ''}`}
                  onClick={() => setMenuOpen(p => !p)}
                >
                  🔮 {UI.zizhan}
                </button>
                {menuOpen && (
                  <div className="modal-random-menu">
                    <button type="button" className="modal-random-item" title={UI.randomHint}
                      onClick={() => { setMenuOpen(false); rerollRandom(); }}>
                      {UI.menuRandom}
                    </button>
                    {onCreateZizhan && (
                      <button type="button" className="modal-random-item"
                        onClick={() => { setMenuOpen(false); setZizhanOpen(true); }}>
                        {UI.menuZizhan}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {zizhanOpen ? (
        <form className="modal-zizhan" onSubmit={handleZizhanSubmit}>
          <p className="modal-zizhan-hint">{UI.zizhanHint}</p>
          <div className="modal-zizhan-row">
            <input
              type="number" inputMode="numeric" autoFocus
              min={ZIZHAN_MIN} max={ZIZHAN_MAX} step={1}
              value={n1} onChange={e => setN1(e.target.value)}
              placeholder="1"
            />
            <span className="modal-zizhan-sep">{isEn ? ',' : '，'}</span>
            <input
              type="number" inputMode="numeric"
              min={ZIZHAN_MIN} max={ZIZHAN_MAX} step={1}
              value={n2} onChange={e => setN2(e.target.value)}
              placeholder="2"
            />
          </div>
          <button type="submit" className="btn-confirm" disabled={!zizhanValid}>{UI.zizhanGo}</button>
          <button type="button" className="btn-cancel" onClick={() => setZizhanOpen(false)}>{UI.back}</button>
        </form>
        ) : (
        <form onSubmit={handleSubmit}>
          {/* Gender */}
          <div className="modal-field">
            <label>{UI.gender}</label>
            <div className="gender-select">
              <button
                type="button"
                className={`gender-btn female${gender === 'female' ? ' selected' : ''}`}
                onClick={() => setGender('female')}
              >
                {UI.female}
              </button>
              <button
                type="button"
                className={`gender-btn male${gender === 'male' ? ' selected' : ''}`}
                onClick={() => setGender('male')}
              >
                {UI.male}
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="modal-field">
            <label>{UI.name} <span className="modal-optional">({UI.optional})</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isEn ? 'Enter name' : '請輸入姓名'}
              className="modal-input"
            />
          </div>

          {/* Category */}
          <div className="modal-field">
            <label>{UI.category} <span className="modal-optional">({UI.optional})</span></label>
            <div className="category-select">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`category-btn${category === cat ? ' selected' : ''}`}
                  onClick={() => setCategory(prev => prev === cat ? '' : cat)}
                >
                  {catLabel(cat, locale)}
                </button>
              ))}
            </div>
          </div>

          {/* Solar date */}
          <div className="modal-field">
            <label>{UI.birthday}</label>
            <div className="modal-date-row">
              <input
                type="number" value={year}
                onChange={e => { resetValidity(e); setYear(e.target.value); }}
                onInvalid={handleRangeInvalid}
                min={100} max={9999} className="modal-input-year"
              />
              <span className="modal-date-sep">{isEn ? '/' : '年'}</span>
              <input
                type="number" value={month}
                onChange={e => { resetValidity(e); setMonth(e.target.value); }}
                onInvalid={handleRangeInvalid}
                min={1} max={12} className="modal-input-md"
              />
              <span className="modal-date-sep">{isEn ? '/' : '月'}</span>
              <input
                type="number" value={day}
                onChange={e => { resetValidity(e); setDay(e.target.value); }}
                onInvalid={handleRangeInvalid}
                min={1} max={31} className="modal-input-md"
              />
              {!isEn && <span className="modal-date-sep">日</span>}
            </div>
          </div>

          {/* Time */}
          <div className="modal-field">
            <label>{UI.hour}</label>
            <select
              value={timeIndex}
              onChange={e => setTimeIndex(+e.target.value)}
              className="modal-input"
            >
              {TIME_LABELS.map((t, i) => (
                <option key={i} value={i}>
                  {isEn
                    ? `${BRANCH_PINYIN[t] ?? t} Hr  ${TIME_HOURS[i]}`
                    : `${t}時 ${BRANCH_PINYIN[t] ?? ''}　${TIME_HOURS[i]}`
                  }
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-confirm">{UI.confirm}</button>
          <button type="button" className="btn-cancel" onClick={onClose}>{UI.cancel}</button>

          {/* Hidden advanced: multi-birth */}
          <div className="modal-advanced-toggle" onClick={() => setShowAdvanced(p => !p)}>
            {UI.advanced}
          </div>
          {showAdvanced && (
            <div className="modal-field modal-advanced-section">
              <label>
                {isEn ? 'Multiple birth order' : '同時辰多胞胎胎次'}
              </label>
              <div className="birth-order-select">
                {([2, 3, 4] as const).map((order, i) => (
                  <button
                    key={order}
                    type="button"
                    className={`birth-order-btn${multiBirthOrder === order ? ' selected' : ''}`}
                    onClick={() => setMultiBirthOrder(prev => prev === order ? null : order)}
                  >
                    {isEn
                      ? (['Twin 2', 'Triplet 3', 'Quadruplet 4'] as const)[i]
                      : '第' + ['二','三','四'][i] + '胎'}
                  </button>
                ))}
              </div>
              {multiBirthOrder && (
                <div className="modal-twin-hint">
                  {isEn
                    ? `Uses eldest's ${['Reflection','Sibling','Friends'][multiBirthOrder - 2]} Palace as Self Palace`
                    : `以同時辰老大之${['遷移','兄弟','僕役'][multiBirthOrder - 2]}宮為命宮`}
                </div>
              )}
            </div>
          )}
        </form>
        )}
      </div>
    </div>
  );
}
