import { useState, useEffect, useRef } from 'react';
import type { ZiweiChart } from '../lib';
import { lunarToArabic, stemBranchPinyin } from '../i18n';
import {
  monthlyGanZhiPair, dailyGanZhi, dailySolar, hourlyGanZhi, hourOfTimeIndex,
  todayLunar, leapMonthOfYear, solarToLunarParts, lunarToSolarDate, monthGanZhiSplit, monthGanZhiRows,
} from '../lib/engine/native/horoscope';
import { useLang } from '../contexts/LangContext';

/** Advanced 模式層級（由 App 依選取狀態推導）*/
export type AdvLevel = 'natal' | 'decadal' | 'yearly' | 'monthly' | 'daily' | 'hourly';

const LUNAR_MONTHS = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const LUNAR_MONTHS_EN = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
// 時辰：0–11 = 子–亥，12 = 晚子時（23:00–24:00，排盤視為隔日早子）
const HOUR_NAMES    = ['早子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','晚子'];
const HOUR_NAMES_EN = ['E.Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai','L.Zi'];
const HOUR_RANGES   = ['00-01','01-03','03-05','05-07','07-09','09-11','11-13',
                       '13-15','15-17','17-19','19-21','21-23','23-24'];

const LUNAR_DAYS = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十',
];

interface Props {
  chart: ZiweiChart;
  selectedPalaceIdx: number | null;
  setSelectedPalaceIdx: (i: number | null) => void;
  selectedYear: number | null;
  setSelectedYear: (y: number | null) => void;
  selectedMonth: number | null;
  setSelectedMonth: (m: number | null) => void;
  selectedMonthLeap: boolean;
  setSelectedMonthLeap: (b: boolean) => void;
  selectedDay: number | null;
  setSelectedDay: (d: number | null) => void;
  selectedHour: number | null;
  setSelectedHour: (h: number | null) => void;
  /** 切換焦點層（顯示哪 3 層運線）；點 chip / 選項時呼叫 */
  onFocus?: (lvl: AdvLevel) => void;
}

type Level = 'monthly' | 'daily' | 'hourly';

export function AdvancedNav({
  chart, setSelectedPalaceIdx,
  selectedYear, setSelectedYear,
  selectedMonth, setSelectedMonth,
  selectedMonthLeap, setSelectedMonthLeap,
  selectedDay, setSelectedDay,
  selectedHour, setSelectedHour,
  onFocus,
}: Props) {
  const { locale, showPinyin } = useLang();
  const en = locale === 'en' || showPinyin;
  // 干支 → 顯示字串：en/拼音模式轉拼音(含 soft-hyphen),中文模式維持原字。支援「X/Y」對。
  const gz = (s: string) => !en ? s : s.split('/').map(p => p.length >= 2 ? stemBranchPinyin(p[0], p[1]) : p).join('/');
  const lunarBirthYear = parseInt(lunarToArabic(chart.birthInfo.lunarDate).split('-')[0]);
  const decades = [...chart.palaces].filter(p => p.decadal?.range).sort((a, b) => a.decadal.range[0] - b.decadal.range[0]);

  const today = todayLunar();
  const ganZhiYear = selectedYear ?? today.year;
  const leapM = leapMonthOfYear(ganZhiYear);
  const monthEntries: { m: number; leap: boolean }[] = [];
  for (let m = 1; m <= 12; m++) { monthEntries.push({ m, leap: false }); if (m === leapM) monthEntries.push({ m, leap: true }); }
  const signed = (m: number, leap: boolean) => (leap ? -m : m);
  const smSel = selectedMonth != null ? signed(selectedMonth, selectedMonthLeap) : null;
  const monthLabel = (m: number, leap: boolean) => (leap ? (en ? 'L' : '閏') : '') + (en ? LUNAR_MONTHS_EN[m - 1] : LUNAR_MONTHS[m - 1]);
  // chip 專用：閏月省掉「月」字（閏六月 → 閏六）。「閏」已表明是月份，省下的字寬對 chip 很關鍵。
  // 選單內維持完整寫法（空間夠，且與其他月份並排時對齊較整齊）。
  const monthChipLabel = (m: number, leap: boolean) => (!leap || en)
    ? monthLabel(m, leap)
    : '閏' + LUNAR_MONTHS[m - 1].replace('月', '');
  // 流年干支（供選單 header 顯示，方便用戶知道目前在哪個流年/流月）
  const YEAR_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const YEAR_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const yearGZof = (y: number) => YEAR_STEMS[((y - 4) % 10 + 10) % 10] + YEAR_BRANCHES[((y - 4) % 12 + 12) % 12];

  // 該農曆月的天數（小月 29、大月 30）——流日步進上限
  function daysInMonth(): number {
    if (smSel == null) return 30;
    try { lunarToSolarDate(ganZhiYear, smSel, 30); return 30; } catch { return 29; }
  }
  // 左右箭頭：在本層合法範圍內前後移動一格（夾住不跨流年），並切焦點到該層
  function stepMonth(d: number) {
    if (selectedMonth == null) return;
    const i = monthEntries.findIndex(e => e.m === selectedMonth && e.leap === selectedMonthLeap);
    const n = Math.min(Math.max(i + d, 0), monthEntries.length - 1);
    if (n === i) return;
    setSelectedMonth(monthEntries[n].m); setSelectedMonthLeap(monthEntries[n].leap);
    setSelectedDay(null); setSelectedHour(null); onFocus?.('monthly');
  }
  function stepDay(d: number) {
    if (selectedDay == null) return;
    const n = Math.min(Math.max(selectedDay + d, 1), daysInMonth());
    if (n === selectedDay) return;
    setSelectedDay(n); setSelectedHour(null); onFocus?.('daily');
  }
  function stepHour(d: number) {
    if (selectedHour == null) return;
    const n = Math.min(Math.max(selectedHour + d, 0), 12);
    if (n === selectedHour) return;
    setSelectedHour(n); onFocus?.('hourly');
  }

  const [picker, setPicker] = useState<Level | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (picker) activeRef.current?.scrollIntoView({ block: 'center' }); }, [picker]);

  // 目前選取對應的國曆日（自繪月曆預設聚焦；未選到任何月/日就用今天）
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const currentSolar = (() => {
    try {
      if (selectedMonth != null && smSel != null) return fmt(lunarToSolarDate(ganZhiYear, smSel, selectedDay ?? 1));
    } catch { /* ignore */ }
    return fmt(new Date());
  })();
  // 自繪月曆顯示中的年月（開窗時對齊目前選取）
  const [calY, setCalY] = useState(() => parseInt(currentSolar.split('-')[0]));
  const [calM, setCalM] = useState(() => parseInt(currentSolar.split('-')[1]));
  useEffect(() => {
    if (dateOpen) { const [y, m] = currentSolar.split('-').map(Number); setCalY(y); setCalM(m); }
  }, [dateOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  function shiftYear(delta: number) { setCalY(calY + delta); }
  function shiftMonth(delta: number) {
    let y = calY, m = calM + delta;
    if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
    setCalY(y); setCalM(m);
  }
  function goDay(d: number) { pickSolarDate(`${calY}-${calM}-${d}`); } // grid / 日輸入 → 跳轉

  // 視窗量測：popup 尺寸相對螢幕，避免外溢（dvh + JS 實量雙保險）
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const f = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const popStyle = { maxHeight: Math.round(vp.h * 0.9), maxWidth: Math.min(360, Math.round(vp.w * 0.94)) };
  const todayStr = fmt(new Date());
  const [selY, selM, selD] = currentSolar.split('-').map(Number);
  const calFirstDow = new Date(calY, calM - 1, 1).getDay();
  const calDays = new Date(calY, calM, 0).getDate();
  const calCells: (number | null)[] = [...Array(calFirstDow).fill(null), ...Array.from({ length: calDays }, (_, i) => i + 1)];
  const WEEK = en ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['日', '一', '二', '三', '四', '五', '六'];
  function pickSolarDate(v: string) {
    if (!v) return;
    const [Y, M, D] = v.split('-').map(Number);
    const p = solarToLunarParts(new Date(Y, M - 1, D));
    const age = p.year - lunarBirthYear; // 大限看實歲（農曆年−農曆生年，無 +1）
    const dec = decades.find(x => age >= x.decadal.range[0] && age <= x.decadal.range[1]);
    if (dec) setSelectedPalaceIdx(dec.index);
    setSelectedYear(p.year);
    setSelectedMonth(p.month);
    setSelectedMonthLeap(p.isLeap);
    setSelectedDay(p.day);
    setSelectedHour(null);
    onFocus?.('daily');
    setDateOpen(false);
  }

  // chip 值拆兩段：名稱段＝只切焦點（不開選單），干支段＝開選單。
  // 標籤拿掉後本來失去「只切焦點」的動作，用這個分區補回來，且不多佔寬度。
  const monthChip = selectedMonth != null
    ? { name: monthChipLabel(selectedMonth, selectedMonthLeap), gz: gz(monthlyGanZhiPair(ganZhiYear, smSel!)) }
    : null;
  // 標籤已移除，內容自帶單位字（六月／廿四日／未時）才看得出是哪一層
  const dayChip = (selectedDay != null && smSel != null)
    ? { name: en ? 'D' + selectedDay : LUNAR_DAYS[selectedDay - 1] + '日', gz: gz(dailyGanZhi(ganZhiYear, smSel, selectedDay)) }
    : null;

  // 流時干支：晚子時(12) 依排盤規則改用「隔日早子」，與 App 的 queryDate 同一套處理
  function hourGZ(ti: number): string {
    if (smSel == null || selectedDay == null) return '';
    try {
      const base = lunarToSolarDate(ganZhiYear, smSel, selectedDay);
      if (ti === 12) {
        const next = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
        return hourlyGanZhi(next, 0);
      }
      base.setHours(hourOfTimeIndex(ti));
      return hourlyGanZhi(base, ti);
    } catch { return ''; }
  }
  const hourChip = selectedHour != null
    ? { name: en ? HOUR_NAMES_EN[selectedHour] + 'h' : HOUR_NAMES[selectedHour] + '時', gz: gz(hourGZ(selectedHour)) }
    : null;
  // 此刻的時辰 index（23 時為晚子）
  const nowHourIdx = (() => { const h = new Date().getHours(); return h === 23 ? 12 : Math.floor((h + 1) / 2) % 12; })();

  // 防呆：尚未選流年就開流月/流日 → 預設「今年今月[今日]」（含今年所屬大限，
  // 確保流年落在時間軸內、正確高亮）。已選流年則保留、只補月/日。
  function openMonthly() {
    if (selectedYear == null) goThisMonth();                    // 今年今月
    else if (selectedMonth == null) { setSelectedMonth(1); setSelectedMonthLeap(false); }
    onFocus?.('monthly');   // 點流月 chip = 切焦點到流月
    setPicker('monthly');
  }
  function openDaily() {
    if (selectedYear == null) goToday();                        // 今年今月今日
    else {
      if (selectedMonth == null) { setSelectedMonth(1); setSelectedMonthLeap(false); }
      if (selectedDay == null) setSelectedDay(1);
    }
    onFocus?.('daily');     // 點流日 chip = 切焦點到流日（含「再按回到流日」）
    setPicker('daily');
  }
  function openHourly() {
    if (selectedYear == null) goToday();                        // 今年今月今日
    else {
      if (selectedMonth == null) { setSelectedMonth(1); setSelectedMonthLeap(false); }
      if (selectedDay == null) setSelectedDay(1);
    }
    if (selectedHour == null) setSelectedHour(0);               // 預設早子
    onFocus?.('hourly');
    setPicker('hourly');
  }
  // 「此刻」：今日 + 當下時辰
  function goNow() {
    goToday();
    setSelectedHour(nowHourIdx);
    onFocus?.('hourly');
  }
  function goToday() {
    const age = today.year - lunarBirthYear; // 大限看實歲（農曆年−農曆生年，無 +1）
    const dec = decades.find(p => age >= p.decadal.range[0] && age <= p.decadal.range[1]);
    if (dec) setSelectedPalaceIdx(dec.index);
    setSelectedYear(today.year);
    setSelectedMonth(today.month);
    setSelectedMonthLeap(today.isLeap);
    setSelectedDay(today.day);
    setSelectedHour(null);
    onFocus?.('daily');
  }
  // 「本月」：只到流月層（清掉流日、聚焦流月），與「選一般月份」行為一致；
  // 不可呼叫 goToday()，否則會帶出流日層、焦點跳到流日（無單純流月盤）。
  function goThisMonth() {
    const age = today.year - lunarBirthYear; // 大限看實歲（農曆年−農曆生年，無 +1）
    const dec = decades.find(p => age >= p.decadal.range[0] && age <= p.decadal.range[1]);
    if (dec) setSelectedPalaceIdx(dec.index);
    setSelectedYear(today.year);
    setSelectedMonth(today.month);
    setSelectedMonthLeap(today.isLeap);
    setSelectedDay(null);
    setSelectedHour(null);
    onFocus?.('monthly');
  }

  type Opt = {
    id: string; label: string; sub?: string; rows?: { gz: string; range: string }[];
    active: boolean; realtime: boolean; leap?: boolean;
    markStart?: { gz: string; jieqi: string }; markEnd?: string;
    onSelect: () => void;
  };
  function options(level: Level): Opt[] {
    if (level === 'monthly') return monthEntries.map(({ m, leap }) => ({
      id: `m${m}${leap ? 'L' : ''}`, label: monthLabel(m, leap),
      rows: monthGanZhiRows(ganZhiYear, signed(m, leap)).map(r => ({ gz: gz(r.gz), range: r.range })), // #3 干支分行(不顯示節氣)
      active: selectedMonth === m && selectedMonthLeap === leap,
      realtime: selectedYear === today.year && m === today.month && leap === today.isLeap, leap,
      onSelect: () => { setSelectedMonth(m); setSelectedMonthLeap(leap); setSelectedDay(null); setSelectedHour(null); onFocus?.('monthly'); }, // 選月→回月層
    }));
    if (level === 'hourly') return HOUR_NAMES.map((name, i) => ({
      id: `h${i}`, label: en ? HOUR_NAMES_EN[i] : name,
      sub: `${gz(hourGZ(i))} · ${HOUR_RANGES[i]}`,
      active: selectedHour === i,
      realtime: selectedYear === today.year && selectedMonth === today.month
        && selectedMonthLeap === today.isLeap && selectedDay === today.day && i === nowHourIdx,
      // 晚子時：排盤規則視為隔日早子（實際日期仍是當天）
      markStart: i === 12 ? { gz: en ? 'next day' : '隔日', jieqi: '' } : undefined,
      onSelect: () => { setSelectedHour(i); onFocus?.('hourly'); },
    }));
    // 流日：標出換干「起點」(→新干 + 節氣) 與「終點」(前一日 = 舊干末日)
    const split = smSel != null ? monthGanZhiSplit(ganZhiYear, smSel) : null;
    return LUNAR_DAYS.map((d, i) => {
      const gzStr = smSel != null ? dailyGanZhi(ganZhiYear, smSel, i + 1) : '';
      return { gzStr, d, i };
    }).filter(x => !(x.i + 1 === 30 && x.gzStr === '')).map(({ gzStr, d, i }) => ({
      id: `r${i + 1}`, label: en ? String(i + 1) : d,
      sub: `${gz(gzStr)} · ${smSel != null ? dailySolar(ganZhiYear, smSel, i + 1) : ''}`,
      active: selectedDay === i + 1,
      realtime: selectedYear === today.year && selectedMonth === today.month && selectedMonthLeap === today.isLeap && i + 1 === today.day,
      markStart: split && split.transitionDay === i + 1
        ? { gz: gz(split.after), jieqi: split.jieqi ? (en ? split.jieqi.py : split.jieqi.zh) : '' } : undefined,
      markEnd: split && split.transitionDay - 1 === i + 1 ? gz(split.before) : undefined,
      onSelect: () => { setSelectedDay(i + 1); setSelectedHour(null); onFocus?.('daily'); },
    }));
  }

  return (
    <>
      <div className="adv-chip-row">
        <button className="adv-chip-today" onClick={() => setDateOpen(true)}
          title={en ? 'Pick date & hour' : '選日期／時辰'}>🕐</button>
        {/* chip 不放「流月/流日/流時」標籤：內容本身即可辨識（月份名／農曆日／時辰名），
            未選取時才用佔位字說明是哪一層。省下的寬度讓干支在手機也顯示得完整。 */}
        {/* 每個 chip：◀ 前一格 ｜ 名稱(只切焦點) 干支(開選單) ｜ 後一格 ▶。
            未選取時不出箭頭（無可步進的基準），整顆 chip 就是「開選單」。 */}
        <div className={`adv-chip adv-chip-month${selectedMonth != null ? ' adv-chip-on adv-chip-monthly' : ''}`}>
          {selectedMonth != null && (
            <button className="adv-chip-step" onClick={() => stepMonth(-1)} aria-label="prev month">◀</button>
          )}
          {monthChip ? (
            <>
              <button className="adv-chip-name" onClick={() => onFocus?.('monthly')}
                title={en ? 'Focus this layer' : '聚焦此層'}>{monthChip.name}</button>
              <button className="adv-chip-gz" onClick={openMonthly}
                title={en ? 'Pick another' : '換一個'}>{monthChip.gz}</button>
            </>
          ) : (
            <button className="adv-chip-open" onClick={openMonthly}>
              <span className="adv-chip-v">{en ? 'Month —' : '選流月'}</span>
            </button>
          )}
          {selectedMonth != null && (
            <button className="adv-chip-step" onClick={() => stepMonth(1)} aria-label="next month">▶</button>
          )}
        </div>
        <div className={`adv-chip adv-chip-day${selectedDay != null ? ' adv-chip-on adv-chip-daily' : ''}`}>
          {selectedDay != null && (
            <button className="adv-chip-step" onClick={() => stepDay(-1)} aria-label="prev day">◀</button>
          )}
          {dayChip ? (
            <>
              <button className="adv-chip-name" onClick={() => onFocus?.('daily')}
                title={en ? 'Focus this layer' : '聚焦此層'}>{dayChip.name}</button>
              <button className="adv-chip-gz" onClick={openDaily}
                title={en ? 'Pick another' : '換一個'}>{dayChip.gz}</button>
            </>
          ) : (
            <button className="adv-chip-open" onClick={openDaily}>
              <span className="adv-chip-v">{en ? 'Day —' : '選流日'}</span>
            </button>
          )}
          {selectedDay != null && (
            <button className="adv-chip-step" onClick={() => stepDay(1)} aria-label="next day">▶</button>
          )}
        </div>
        <div className={`adv-chip adv-chip-hour${selectedHour != null ? ' adv-chip-on adv-chip-hourly' : ''}`}>
          {selectedHour != null && (
            <button className="adv-chip-step" onClick={() => stepHour(-1)} aria-label="prev hour">◀</button>
          )}
          {hourChip ? (
            <>
              <button className="adv-chip-name" onClick={() => onFocus?.('hourly')}
                title={en ? 'Focus this layer' : '聚焦此層'}>{hourChip.name}</button>
              <button className="adv-chip-gz" onClick={openHourly}
                title={en ? 'Pick another' : '換一個'}>{hourChip.gz}</button>
            </>
          ) : (
            <button className="adv-chip-open" onClick={openHourly}>
              <span className="adv-chip-v">{en ? 'Hour —' : '選流時'}</span>
            </button>
          )}
          {selectedHour != null && (
            <button className="adv-chip-step" onClick={() => stepHour(1)} aria-label="next hour">▶</button>
          )}
        </div>
      </div>

      {dateOpen && (
        <div className="adv-sheet-backdrop adv-date-backdrop" onClick={() => setDateOpen(false)}>
          <div className="adv-date-pop" style={popStyle} onClick={e => e.stopPropagation()}>
            <div className="adv-sheet-head">
              <span className="adv-sheet-title">{en ? 'Select date & hour' : '選擇日期／時辰'}</span>
              <button className="adv-sheet-close" onClick={() => setDateOpen(false)} aria-label="close">✕</button>
            </div>

            {/* 直接輸入：年 / 月 / 日（可打字、tab、快速跳遠）*/}
            <div className="adv-cal-inputs">
              <label>{en ? 'Y' : '年'}<input type="number" value={calY}
                onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setCalY(v); }} /></label>
              <label>{en ? 'M' : '月'}<input type="number" min={1} max={12} value={calM}
                onChange={e => { let v = parseInt(e.target.value); if (!isNaN(v)) { v = Math.min(12, Math.max(1, v)); setCalM(v); } } } /></label>
              <label>{en ? 'D' : '日'}<input type="number" min={1} max={31} defaultValue={selD}
                key={`${calY}-${calM}`}
                onKeyDown={e => { if (e.key === 'Enter') { const v = parseInt((e.target as HTMLInputElement).value); if (v >= 1 && v <= calDays) goDay(v); } }}
                onBlur={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= calDays) goDay(v); }} /></label>
            </div>

            <div className="adv-cal">
              <div className="adv-cal-nav">
                <button className="adv-cal-arrow" onClick={() => shiftYear(-1)} aria-label="prev year">«</button>
                <button className="adv-cal-arrow" onClick={() => shiftMonth(-1)} aria-label="prev">‹</button>
                <span className="adv-cal-title">{en ? `${calY}-${String(calM).padStart(2, '0')}` : `${calY} 年 ${calM} 月`}</span>
                <button className="adv-cal-arrow" onClick={() => shiftMonth(1)} aria-label="next">›</button>
                <button className="adv-cal-arrow" onClick={() => shiftYear(1)} aria-label="next year">»</button>
              </div>
              <div className="adv-cal-grid">
                {WEEK.map((w, i) => <span key={`w${i}`} className="adv-cal-wd">{w}</span>)}
                {calCells.map((d, i) => d == null
                  ? <span key={`b${i}`} className="adv-cal-blank" />
                  : (() => {
                    const ds = `${calY}-${String(calM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const isSel = d === selD && calM === selM && calY === selY;
                    const isToday = ds === todayStr;
                    return (
                      <button
                        key={`d${i}`}
                        className={`adv-cal-day${isSel ? ' adv-cal-sel' : ''}${isToday ? ' adv-cal-today' : ''}`}
                        onClick={() => goDay(d)}
                      >{d}</button>
                    );
                  })()
                )}
              </div>
            </div>

            {/* 時辰列：套用在目前選取的日期上；選了就關窗（與點日期同一套「選完即關」） */}
            <div className="adv-cal-hours">
              <button className={`adv-cal-hour${selectedHour == null ? ' adv-cal-hour-on' : ''}`}
                title={en ? 'No hour (day layer only)' : '不指定時辰（只到流日層）'}
                onClick={() => { setSelectedHour(null); onFocus?.('daily'); setDateOpen(false); }}>
                {en ? '—' : '無'}
              </button>
              {HOUR_NAMES.map((n, i) => (
                <button key={i}
                  className={`adv-cal-hour${selectedHour === i ? ' adv-cal-hour-on' : ''}${i === 12 ? ' adv-cal-hour-late' : ''}`}
                  title={HOUR_RANGES[i] + (i === 12 ? (en ? ' (next day)' : '（排盤視為隔日）') : '')}
                  onClick={() => { setSelectedHour(i); onFocus?.('hourly'); setDateOpen(false); }}>
                  {en ? HOUR_NAMES_EN[i] : n}
                </button>
              ))}
            </div>

            <div className="adv-cal-btnrow">
              <button className="adv-cal-todaybtn" onClick={() => { goToday(); setDateOpen(false); }}>
                {en ? 'Today' : '今天'}
              </button>
              <button className="adv-cal-todaybtn" onClick={() => { goNow(); setDateOpen(false); }}>
                {en ? 'Now' : '此刻'}
              </button>
            </div>
          </div>
        </div>
      )}

      {picker && (
        <div className="adv-sheet-backdrop" onClick={() => setPicker(null)}>
          <div className="adv-sheet" onClick={e => e.stopPropagation()}>
            <div className="adv-sheet-head">
              <span className="adv-sheet-title">
                {en ? 'Select ' : '選'}{picker === 'monthly' ? (en ? 'Month' : '流月') : picker === 'daily' ? (en ? 'Day' : '流日') : (en ? 'Hour' : '流時')}
                <span className="adv-sheet-ctx"> · {ganZhiYear} {gz(yearGZof(ganZhiYear))}{picker !== 'monthly' && selectedMonth != null ? ` ${monthLabel(selectedMonth, selectedMonthLeap)}` : ''}{picker === 'hourly' && selectedDay != null ? ` ${en ? String(selectedDay) : LUNAR_DAYS[selectedDay - 1]}` : ''}</span>
              </span>
              <button className="adv-sheet-today" onClick={() => { picker === 'monthly' ? goThisMonth() : picker === 'daily' ? goToday() : goNow(); setPicker(null); }}>
                {picker === 'monthly' ? (en ? 'This month' : '本月') : picker === 'daily' ? (en ? 'Today' : '今日') : (en ? 'Now' : '此刻')}
              </button>
              <button className="adv-sheet-close" onClick={() => setPicker(null)} aria-label="close">✕</button>
            </div>
            <div className={`adv-sheet-grid adv-sheet-grid-${picker}`}>
              {options(picker).map(o => (
                <button
                  key={o.id}
                  ref={o.active ? activeRef : undefined}
                  className={`adv-opt${o.active ? ` adv-opt-active adv-active-${picker}` : ''}${o.realtime ? ' adv-opt-now' : ''}${o.leap ? ' adv-leap-cell' : ''}${o.markStart ? ' adv-opt-switch' : ''}${o.markEnd ? ' adv-opt-switchend' : ''}`}
                  onClick={() => { o.onSelect(); setPicker(null); }}
                >
                  <span className="adv-opt-labelrow">
                    <span className="adv-opt-label">{o.label}</span>
                    {o.markStart && (
                      <span className="adv-opt-mark" title={en ? `month stem → ${o.markStart.gz}` : `此日起換月干 ${o.markStart.gz}`}>
                        →{o.markStart.gz}{o.markStart.jieqi ? ` ${o.markStart.jieqi}` : ''}
                      </span>
                    )}
                    {o.markEnd && (
                      <span className="adv-opt-mark adv-opt-mark-end" title={en ? `last day of ${o.markEnd}` : `${o.markEnd} 末日`}>
                        {o.markEnd}{en ? ' end' : ' 止'}
                      </span>
                    )}
                  </span>
                  {o.rows
                    ? o.rows.map((r, ri) => <span key={ri} className="adv-opt-sub">{r.gz} · {r.range}</span>)
                    : <span className="adv-opt-sub">{o.sub}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
