import { useMemo } from 'react';
import type { ZiweiChart, ZiweiHoroscope } from '../lib';
import { BRANCH_GRID } from '../i18n';
import { MUTAGEN_TABLE } from '../lib/engine/constants';
import { PalaceCell } from './PalaceCell';
import { CenterInfo } from './CenterInfo';
import { ThreeSideLine } from './ThreeSideLine';
import { FeixingLine } from './FeixingLine';
interface Props {
  chart: ZiweiChart;
  horoscope: ZiweiHoroscope;
  isNatalMode: boolean;
  isYearlyMode: boolean;
  clickedPalaceIdx: number | null;
  onPalaceClick: (idx: number) => void;
  originPalaceIdx: number;
  onReset: () => void;
  multiBirthOrder: 2 | 3 | 4 | null;
  onPrevTime: () => void;
  onNextTime: () => void;
  isRectified: boolean;
  isMinorLimitMode?: boolean;
  onMinorLimitToggle?: () => void;
  childhoodOverride?: [number, number];
  advMode?: boolean;
  onAdvToggle?: () => void;
  advLayers?: { natal: boolean; decadal: boolean; yearly: boolean; monthly: boolean; daily: boolean; hourly: boolean; minorLimit: boolean };
  advFocus?: 'natal' | 'decadal' | 'yearly' | 'monthly' | 'daily' | 'hourly';
  notes?: string;
  onSaveNotes?: (text: string) => void;
  chartId?: string;
  alias?: string;
  onSaveAlias?: (text: string) => void;
  taijiBaseIdx?: number | null; // 立太極改名用（流月/流日 由 App gate 傳 null）
  feixingBaseIdx?: number | null; // 飛化上色用（不 gate 焦點，流月/流日 也上色）
  feixingShow?: boolean;          // 飛化上色 開關（預設關，兩種模式皆由此 toggle 控制）
  onToggleFeixing?: () => void;
  zihuaShow?: boolean;            // 自化(離心/向心)箭頭 開關（兩種模式皆適用）
  onToggleZihua?: () => void;
}

// 立太極宮名
const TJ_ROLE    = ['命','兄','夫','子','財','疾','遷','僕','官','田','福','父'];
const TJ_ROLE_PY = ['Ming','Xiong','Fu-Qi','Zi','Cai','Ji','Qian','Pu','Guan','Tian','Fu-De','Fu-Mu'];
const TJ_BR = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const TJ_NAME2SHORT: Record<string, string> = { 命宮:'命', 兄弟:'兄', 夫妻:'夫', 子女:'子', 財帛:'財', 疾厄:'疾', 遷移:'遷', 交友:'僕', 僕役:'僕', 奴僕:'僕', 官祿:'官', 田宅:'田', 福德:'福', 父母:'父' };
const FX_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

export function AstrolabeChart({ chart, horoscope, isNatalMode, isYearlyMode, clickedPalaceIdx, onPalaceClick, originPalaceIdx, onReset, multiBirthOrder, onPrevTime, onNextTime, isRectified, isMinorLimitMode, onMinorLimitToggle, childhoodOverride, advMode, onAdvToggle, advLayers, advFocus, notes, onSaveNotes, chartId, alias, onSaveAlias, taijiBaseIdx, feixingBaseIdx, feixingShow = true, onToggleFeixing, zihuaShow = true, onToggleZihua }: Props) {
  const minorLimitAgesMap = useMemo(() => {
    const map: Record<number, number[]> = {};
    chart.palaces.forEach(p => { map[p.index] = p.ages; });
    return map;
  }, [chart]);

  // 點選宮 → 立太極（各宮改名「◯之△」）：一般/進階模式皆可（流月/流日 由 App gate 傳 null）
  const taijiBase = taijiBaseIdx != null ? chart.palaces.find(p => p.index === taijiBaseIdx) : undefined;

  // 立太極前綴 = 太極基準宮在「最上層 active 運限」的角色宮名（流年 > 大限 > 本命）。
  // 流月/流日 不參與（焦點在流月/流日時 taijiBaseIdx 已由 App gate 成 null）。
  // 只取角色字（命/兄/…/父），不加「流／大」層前綴；「之△」後綴為相對太極的幾何位置，與層無關。
  const tjShowYearly  = advLayers ? advLayers.yearly  : isYearlyMode;
  const tjShowDecadal = advLayers ? advLayers.decadal : !isNatalMode;
  const taijiPrefix: { zh: string; en: string } | undefined = (() => {
    if (!taijiBase) return undefined;
    let off: number;
    if (tjShowYearly)       off = ((taijiBase.index - horoscope.yearly.palaceIndex)  % 12 + 12) % 12;
    else if (tjShowDecadal) off = ((taijiBase.index - horoscope.decadal.palaceIndex) % 12 + 12) % 12;
    else {
      const short = TJ_NAME2SHORT[taijiBase.name] ?? taijiBase.name.slice(0, 1);
      const r = TJ_ROLE.indexOf(short);
      if (r < 0) return { zh: short, en: short };
      off = r;
    }
    return { zh: TJ_ROLE[off], en: TJ_ROLE_PY[off] };
  })();

  const taijiNameOf = (palace: typeof chart.palaces[number]): { zh: string; en: string } | undefined => {
    if (!taijiBase || !taijiPrefix) return undefined;
    const rel = (((TJ_BR.indexOf(taijiBase.earthlyBranch) - TJ_BR.indexOf(palace.earthlyBranch)) % 12) + 12) % 12;
    return {
      zh: taijiPrefix.zh + '之' + TJ_ROLE[rel],
      en: taijiPrefix.en + '·' + TJ_ROLE_PY[rel],
    };
  };

  // 飛化上色：點選宮宮干四化 → 星名 → 0祿1權2科3忌。兩種模式皆由「飛化」toggle 控制（預設關）。
  // 不受流月/流日焦點 gate（只替星耀上色、不覆蓋宮名，與立太極改名解耦）。
  const feixingBase = (feixingBaseIdx != null && feixingShow) ? chart.palaces.find(p => p.index === feixingBaseIdx) : undefined;
  const feixingHuaMap: Record<string, number> = {};
  if (feixingBase) {
    const si = FX_STEMS.indexOf(feixingBase.heavenlyStem);
    if (si >= 0) MUTAGEN_TABLE[si].forEach((star, k) => { feixingHuaMap[star] = k; });
  }

  return (
    <div className="chart-wrapper">
      <div className="chart-grid">
        {chart.palaces.map(palace => {
          const pos = BRANCH_GRID[palace.earthlyBranch];
          if (!pos) return null;
          const tj = taijiNameOf(palace);
          return (
            <PalaceCell
              key={palace.index}
              palace={palace}
              horoscope={horoscope}
              isNatalMode={isNatalMode}
              isYearlyMode={isYearlyMode}
              style={{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }}
              isClicked={clickedPalaceIdx === palace.index}
              onClick={() => onPalaceClick(palace.index)}
              minorLimitAges={isNatalMode ? (minorLimitAgesMap[palace.index] ?? []) : []}
              isMinorLimitMode={isMinorLimitMode}
              onMinorLimitToggle={onMinorLimitToggle}
              advLayers={advLayers}
              advFocus={advFocus}
              taijiName={tj?.zh}
              taijiNameEn={tj?.en}
              feixingHua={feixingHuaMap}
            />
          );
        })}

        <div className="center-cell" style={{ gridRow: '2/4', gridColumn: '2/4' }}>
          <CenterInfo chart={chart} horoscope={horoscope} isNatalMode={isNatalMode} onReset={onReset} multiBirthOrder={multiBirthOrder} onPrevTime={onPrevTime} onNextTime={onNextTime} isRectified={isRectified} childhoodOverride={childhoodOverride} advMode={advMode} onAdvToggle={onAdvToggle} notes={notes} onSaveNotes={onSaveNotes} chartId={chartId} alias={alias} onSaveAlias={onSaveAlias} feixingShow={feixingShow} onToggleFeixing={onToggleFeixing} zihuaShow={zihuaShow} onToggleZihua={onToggleZihua} />
        </div>

        {/* 三方四正：永遠可用（點宮即顯示） */}
        {(!isNatalMode || clickedPalaceIdx !== null) && (
          <ThreeSideLine palaces={chart.palaces} originPalaceIdx={originPalaceIdx} />
        )}
        {/* 離心/向心自化箭頭：兩種模式皆由「自化」toggle 控制（不再限進階） */}
        {zihuaShow && (
          <FeixingLine palaces={chart.palaces} />
        )}
      </div>
    </div>
  );
}
