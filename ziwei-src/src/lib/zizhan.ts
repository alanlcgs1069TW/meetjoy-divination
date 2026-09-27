// 紫占（紫微占卜）：報兩個數字起一張盤。
//
// 生日／時辰在系統裡是 `solarDate` 字串 + `timeIndex`（0–11 子–亥、12 晚子），不是單一數字；
// 這裡定義一個可逆的「時辰格」整數 slot 來做亂數：
//   slot = 自 1970-01-01 起的天數 × 13 + timeIndex（1970 前為負，無妨）
//   N    = 均勻亂數 ∈ [100-01-01, 9999-12-31 − 報數餘量] + 數字1 + 數字2     ← 報數摻入
//   生日 = 第 floor(N/13) 天、時辰 = N mod 13、性別 = N 奇偶
// 同兩個數字每次仍得不同盤（要的是亂數，數字只是摻入）。
// 範圍：占卜盤不分過去未來（參考做法可退回 882 年）。下限取 100 而非 1，是因 JS `new Date(y, m, d)`
// 會把 0–99 當 19xx，引擎多處用它算歲數，兩位數年份會靜默算錯。天數用 UTC 算，避免時區／DST 差 1。

export const ZIZHAN_CATEGORY = '紫占';
export const ZIZHAN_MIN = 1;
export const ZIZHAN_MAX = 999;
export const ZIZHAN_YEAR_MIN = 100;
export const ZIZHAN_YEAR_MAX = 9999;

const SLOTS_PER_DAY = 13;
const MS_PER_DAY = 86_400_000;

export function slotOf(year: number, month: number, day: number, timeIndex: number): number {
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);   // 不用 Date.UTC：它把 0–99 年當 19xx
  return Math.floor(d.getTime() / MS_PER_DAY) * SLOTS_PER_DAY + timeIndex;
}

export function dateOfSlot(slot: number): { solarDate: string; timeIndex: number } {
  const dayNum = Math.floor(slot / SLOTS_PER_DAY);
  const d = new Date(dayNum * MS_PER_DAY);
  return {
    solarDate: `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`,
    timeIndex: slot - dayNum * SLOTS_PER_DAY,
  };
}

// [0, maxExclusive) 均勻整數；拒絕取樣避免 modulo 偏差；無 crypto 時退回 Math.random
function randomInt(maxExclusive: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive;
    for (;;) {
      crypto.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % maxExclusive;
    }
  }
  return Math.floor(Math.random() * maxExclusive);
}

export function isValidZizhanNumber(n: number): boolean {
  return Number.isInteger(n) && n >= ZIZHAN_MIN && n <= ZIZHAN_MAX;
}

export function generateZizhanBirth(n1: number, n2: number): {
  solarDate: string; timeIndex: number; gender: 'male' | 'female';
} {
  const from = slotOf(ZIZHAN_YEAR_MIN, 1, 1, 0);
  const to   = slotOf(ZIZHAN_YEAR_MAX, 12, 31, 12) - 2 * ZIZHAN_MAX;   // 預留報數上限，N 永不超過 9999
  const n = from + randomInt(to - from + 1) + n1 + n2;
  // n 可能為負（1970 前），`%` 會得 -1／-0，用 `& 1` 取奇偶
  return { ...dateOfSlot(n), gender: (n & 1) === 0 ? 'male' : 'female' };
}

/** 預設名：依建盤當下語言決定，之後不隨語言變（名字是資料） */
export function zizhanName(n1: number, n2: number, locale: string): string {
  return locale === 'en' ? `Divination (${n1}, ${n2})` : `紫占“${n1}，${n2}”`;
}

/** 名字是否為紫占預設名（隱藏模式視同已匿名，不換代號） */
export function isZizhanName(name?: string): boolean {
  return !!name && (name.startsWith('紫占') || name.startsWith('Divination'));
}
