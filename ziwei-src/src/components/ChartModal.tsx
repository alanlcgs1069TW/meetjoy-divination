import { useState } from 'react';
import type { SavedChart } from '../types/savedChart';
import { TIME_LABELS, TIME_HOURS, BRANCH_PINYIN } from '../i18n';
import { useLang } from '../contexts/LangContext';
import { randomAnonName, RANDOM_NAME_PREFIX } from '../lib/anonName';

interface Props {
  mode: 'new' | 'edit';
  initial?: SavedChart;
  /** 新增模式：預選分類（列表當前選中的 tag，「全部」時為 undefined） */
  presetCategory?: string;
  categories: string[];
  onSave: (data: Omit<SavedChart, 'id' | 'updatedAt' | 'deletedAt'>) => void;
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

export function ChartModal({ mode, initial, presetCategory, categories, onSave, onClose }: Props) {
  const { locale } = useLang();
  const isEn = locale === 'en';
  type UIStrings = { title: string; gender: string; female: string; male: string; name: string; optional: string; category: string; birthday: string; hour: string; confirm: string; cancel: string; advanced: string; random: string; randomHint: string };
  const UI_MAP: Record<string, UIStrings> = {
    'en':    { title: mode === 'new' ? 'New Chart'  : 'Edit Chart', gender: 'Gender', female: '♀ Female', male: '♂ Male', name: 'Name',  optional: 'optional', category: 'Category', birthday: 'Solar Birthday', hour: 'Hour',  confirm: mode === 'new' ? 'Add'  : 'Save', cancel: 'Cancel', advanced: 'Multiple Birth · Beta', random: 'Random', randomHint: 'Randomize gender / birthday / hour and fill a random name' },
    'zh-TW': { title: mode === 'new' ? '新增命盤'  : '編輯命盤',   gender: '性別',   female: '♀ 女',     male: '♂ 男',   name: '姓名', optional: '選填',     category: '分類',     birthday: '陽曆生日',       hour: '時辰', confirm: mode === 'new' ? '確認新增' : '確認修改', cancel: '取消', advanced: '多胞胎功能 · 測試中 Beta', random: '隨機', randomHint: '隨機起盤：隨機填入性別／生日／時辰與姓名（可重複點重骰）' },
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
    if (!y || y < 1900 || y > 2100) return;
    onSave({ name, solarDate: `${y}-${m}-${d}`, timeIndex, gender, multiBirthOrder: multiBirthOrder ?? undefined, category: category || undefined });
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{UI.title}</span>
          <div className="modal-header-actions">
            {mode === 'new' && (
              <button
                type="button"
                className="modal-random-btn"
                onClick={rerollRandom}
                title={UI.randomHint}
              >
                🎲 {UI.random}
              </button>
            )}
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

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
                  {cat}
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
                min={1900} max={2100} className="modal-input-year"
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
      </div>
    </div>
  );
}
