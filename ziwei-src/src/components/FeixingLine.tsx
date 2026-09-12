import { useLayoutEffect, useRef, useState } from 'react';
import { BRANCH_GRID } from '../i18n';
import { MUTAGEN_TABLE } from '../lib/engine/constants';
import type { ZiweiPalace } from '../lib';
import { HUA_COLORS as HCOL } from '../lib/huaColors';

// 離心/向心自化（參考業界排版）
// - 離心（宮干化本宮星）：貼「外側邊」中央、箭頭指向外（背離盤心）
// - 向心（宮干化對宮星）：貼「內側 border」、箭頭指向對宮（穿過盤心）
// 顏色依四化：見 lib/huaColors.ts（三處共用，勿在此另寫一份）

interface Props {
  palaces: ZiweiPalace[];
}

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];


// 離心「向外」角度（0=朝上，順時針）：左右欄→水平、上下中→垂直（角落走水平，落在中段空白處）
function outAngleOf(row: number, col: number): number {
  if (col === 0) return 270; // 左欄 → 左
  if (col === 3) return 90;  // 右欄 → 右
  if (row === 0) return 0;   // 上中 → 上
  if (row === 3) return 180; // 下中 → 下
  return 0;
}

const R_OUT = 11.3;   // 離心：外側邊
const IN_HALF = 2.4;  // 向心：箭身中心離內 border 交點多遠（讓 tail 落在 border）
const SPACING = 3.1;  // 同宮多箭頭間距(%)（丁位/丙位等多化收緊）

export function FeixingLine({ palaces }: Props) {
  // 命盤格為非正方（手機更明顯）→ 量測長寬比，讓向心對角箭頭在像素上真正指向對宮
  const ref = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1); // = 高/寬
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); if (r.width > 0) setAspect(r.height / r.width); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const starBranch: Record<string, string> = {};
  palaces.forEach(p => {
    [...(p.majorStars ?? []), ...(p.minorStars ?? [])].forEach(s => { starBranch[s.name] = p.earthlyBranch; });
  });

  const arrows: React.ReactNode[] = [];
  let key = 0;
  // 粗桿 + 實心箭頭，預設指上；固定像素方形 viewBox → 不變形
  const arrow = (left: number, top: number, angle: number, color: string) => (
    <svg key={key++} className="fx-arrow" width="17" height="17" viewBox="0 0 16 16"
      style={{ left: `${left}%`, top: `${top}%`, transform: `translate(-50%,-50%) rotate(${angle}deg)` }}>
      <line x1="8" y1="14.2" x2="8" y2="6.4" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M2.4,7.4 L8,1.4 L13.6,7.4 Z" fill={color} />
    </svg>
  );

  // %向量(dx,dy)在像素上的角度（0=上、順時針）；dy 乘長寬比校正
  const pxAngle = (dx: number, dy: number) => Math.atan2(dx, -(dy * aspect)) * 180 / Math.PI;

  palaces.forEach(p => {
    const si = STEMS.indexOf(p.heavenlyStem);
    const pos = BRANCH_GRID[p.earthlyBranch];
    if (si < 0 || !pos) return;
    const [row, col] = pos;
    const cx = (col + 0.5) * 25, cy = (row + 0.5) * 25;
    const opp = BRANCHES[(BRANCHES.indexOf(p.earthlyBranch) + 6) % 12];

    // 離心：外側邊、指向外
    const outA = outAngleOf(row, col);
    const rad = outA * Math.PI / 180;
    const oux = Math.sin(rad), ouy = -Math.cos(rad);   // 向外單位向量(%)
    const otx = -ouy, oty = oux;                        // 沿邊切線
    // 向心：朝盤心/對宮（對宮與本宮以盤心對稱，故 = 朝盤心方向）
    const tcx = 50 - cx, tcy = 50 - cy;                 // 朝盤心向量(%)
    const tlen = Math.hypot(tcx, tcy) || 1;
    const iux = tcx / tlen, iuy = tcy / tlen;           // 朝盤心單位向量(%)
    const inAngle = pxAngle(tcx, tcy);                  // 像素校正後角度
    const itx = -iuy, ity = iux;                        // 垂直於朝心方向（多箭頭錯位用）
    // 朝盤心射線與「內側 border」的交點＝箭頭 tail 起點
    const tB = Math.min(12.5 / Math.abs(tcx || 1e-9), 12.5 / Math.abs(tcy || 1e-9));
    const bX = cx + tcx * tB, bY = cy + tcy * tB;

    const outs: string[] = [];
    const ins: string[] = [];
    MUTAGEN_TABLE[si].forEach((star, k) => {
      const b = starBranch[star];
      if (b === p.earthlyBranch) outs.push(HCOL[k]);
      else if (b === opp)        ins.push(HCOL[k]);
    });

    // 離心（外側邊，沿邊置中排開）
    const obx = cx + oux * R_OUT, oby = cy + ouy * R_OUT;
    outs.forEach((color, i) => {
      const off = (i - (outs.length - 1) / 2) * SPACING;
      arrows.push(arrow(obx + otx * off, oby + oty * off, outA, color));
    });
    // 向心（tail 貼內 border 交點、箭身往盤心延伸）
    // 邊宮：沿邊(垂直於朝心)排開，落在該宮寬邊內；角宮：朝心射線是對角、切線沿共用邊界會跑進鄰宮，
    // 故角宮改沿射線「前後」排開（都留在該角落）。
    const isCorner = (row === 0 || row === 3) && (col === 0 || col === 3);
    ins.forEach((color, i) => {
      const k = i - (ins.length - 1) / 2;
      const x = isCorner ? bX + iux * (IN_HALF + k * SPACING) : bX + iux * IN_HALF + itx * k * SPACING;
      const y = isCorner ? bY + iuy * (IN_HALF + k * SPACING) : bY + iuy * IN_HALF + ity * k * SPACING;
      arrows.push(arrow(x, y, inAngle, color));
    });
  });

  return <div className="feixing-arrows" ref={ref}>{arrows}</div>;
}
