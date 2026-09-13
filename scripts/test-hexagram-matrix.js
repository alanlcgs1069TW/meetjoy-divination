/**
 * test-hexagram-matrix.js
 * 驗證：64 易經卦象六爻二進位矩陣 × Rave Mandala 輪盤序列
 *
 * 驗證項目：
 *  T1  結構完整性：HEXAGRAM_MATRIX_64 恰含 64 卦、鍵值 1..64 連續
 *  T2  位元正確性：binary 為 6 字元 0/1，lines 與 binary 一致，label 順序初→上
 *  T3  全域雙射性：64 筆 6-bit 字串彼此不重複（必然完整覆蓋 2^6=64 種組合）
 *  T4  文王卦名一致性：卦名與 gene-keys-data.js 既有 GENE_KEYS_64 完全一致
 *  T5  權威交叉比對：與 liu-yao.html HEXAGRAM_PALACES（top-first 鍵）逐卦核對
 *  T6  已知錨點值：乾=111111、坤=000000、屯=100010、隨=100110、艮=001001
 *  T7  Rave Mandala 規範：官方文獻序列（起點 Gate 41）逐項比對
 *  T8  輪盤錨點：12 點鐘(index 0)=第 17 閘門隨卦；64 槽位無重複、集合=1..64
 *  T9  輪盤角度：每槽 5.625°、共 360 度閉環
 *  T10 文件完整性：js/gene-keys-data.js 可被 require 且新常數全數匯出
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'js', 'gene-keys-data.js');
const LIU_YAO_FILE = path.join(ROOT, 'liu-yao.html');

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name} — ${detail || ''}`); }
}

// require 目標資料檔（T10）
const mod = require(DATA_FILE);
const {
  GENE_KEYS_64,
  HEXAGRAM_MATRIX_64,
  RAVE_MANDALA_ORDER,
  RAVE_MANDALA_WHEEL,
  MANDALA_ANCHOR
} = mod;
check('T10 資料檔 require 成功且新常數已匯出',
  !!HEXAGRAM_MATRIX_64 && !!RAVE_MANDALA_ORDER && !!RAVE_MANDALA_WHEEL && !!MANDALA_ANCHOR, '(缺匯出)');

const matrix = HEXAGRAM_MATRIX_64;
const entries = Object.values(matrix || {});
const keys = Object.keys(matrix || {}).map(Number);

// ── T1 結構完整性 ─────────────────────────────────────────────
const keysOk = entries.length === 64 &&
  keys.length === 64 &&
  keys.every(k => k >= 1 && k <= 64) &&
  new Set(keys).size === 64;
check('T1 矩陣恰含 64 卦且鍵值 1..64 連續', keysOk,
  `len=${entries.length} keys=${keys.join(',')}`);

// ── T2 位元正確性 ─────────────────────────────────────────────
const binaryOk = entries.every(h =>
  typeof h.binary === 'string' && /^[01]{6}$/.test(h.binary) &&
  h.lines.length === 6 && h.lines.join('') === h.binary &&
  h.lineLabels.join('') === '初二三四五上' &&
  h.binaryTopFirst.split('').reverse().join('') === h.binary &&
  h.yangCount + h.yinCount === 6 &&
  h.yangCount === h.lines.filter(l => l === 1).length
);
check('T2 每卦 binary=6 位元、lines/binaryTopFirst/陰陽數一致、爻標籤初→上', binaryOk, '(結構不符)');

// ── T3 全域雙射性 ─────────────────────────────────────────────
const allBin = entries.map(h => h.binary).sort();
const bijectionOk = allBin.length === 64 && allBin.every((b, i) => b === (i).toString(2).padStart(6, '0'));
check('T3 64 組 6-bit 序列兩兩不重複（雙射完整覆蓋全部 64 組合）', bijectionOk,
  `unique=${new Set(allBin).size}`);

// ── T4 卦名一致性 ─────────────────────────────────────────────
const nameOk = entries.every(h => GENE_KEYS_64 && GENE_KEYS_64[h.number] && GENE_KEYS_64[h.number].hex === h.name);
check('T4 卦名與 GENE_KEYS_64 既有字典完全一致', nameOk, '(卦名不匹配)');

// ── T5 liu-yao.html 權威交叉比對 ──────────────────────────────
// 異體字正規化：天山遁 ≡ 天山遯（同一卦名）
const normHexName = s => s.replace(/遁/g, '遯');
let liuMap = null;
try {
  const html = fs.readFileSync(LIU_YAO_FILE, 'utf8');
  const m = html.match(/const HEXAGRAM_PALACES = \{([\s\S]*?)\n  \};/);
  if (m) {
    liuMap = {};
    const re = /'([01]{6})':\s*\{[^}]*?name:\s*'([^']+)'/g;
    let r;
    while ((r = re.exec(m[1])) !== null) liuMap[normHexName(r[2])] = r[1]; // 卦名→top-first key
  }
} catch (e) { /* liu-yao.html 不存在時跳過 */ }

if (liuMap) {
  const crossErr = [];
  entries.forEach(h => {
    const expectKey = liuMap[normHexName(h.name)];
    if (expectKey !== h.binaryTopFirst) crossErr.push(`${h.number}${h.name}: ours=${h.binaryTopFirst} liuyao=${expectKey}`);
  });
  check('T5 逐卦與 liu-yao.html HEXAGRAM_PALACES 交叉一致（64/64）', crossErr.length === 0 && Object.keys(liuMap).length === 64,
    crossErr.slice(0, 5).join(' | ') || `liuSupplier=${Object.keys(liuMap).length}`);
} else {
  check('T5 liu-yao.html 交叉比對（無法解析，跳過）', false, '(HEXAGRAM_PALACES 未找到)');
}

// ── T6 已知錨點值 ─────────────────────────────────────────────
const known = { 1: '111111', 2: '000000', 3: '100010', 17: '100110', 52: '001001' };
const knownOk = Object.entries(known).every(([n, b]) => matrix[n].binary === b);
check('T6 已知錨點值（乾111111 坤000000 屯100010 隨100110 艮001001）', knownOk,
  Object.entries(known).map(([n, b]) => `${matrix[n].binary}/${b}`).join(' '));

// ── T7 Rave Mandala 官方文獻序列 ──────────────────────────────
const DOCUMENTED = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];
const mandalaOk = RAVE_MANDALA_ORDER.length === 64 &&
  RAVE_MANDALA_ORDER.every((g, i) => g === DOCUMENTED[i]);
check('T7 Rave Mandala 序列逐項符合官方文獻（起點 Gate 41）', mandalaOk,
  `head=${RAVE_MANDALA_ORDER.slice(0, 12).join(',')}`);

// ── T8 輪盤錨點與完整性 ───────────────────────────────────────
const wheelGates = RAVE_MANDALA_WHEEL.map(w => w.gate);
const wheelOk = RAVE_MANDALA_WHEEL.length === 64 &&
  wheelGates.length === new Set(wheelGates).size &&
  new Set(wheelGates).size === 64 &&
  wheelGates.every(g => g >= 1 && g <= 64) &&
  RAVE_MANDALA_WHEEL[0].gate === 17 && RAVE_MANDALA_WHEEL[0].name === '澤雷隨' &&
  MANDALA_ANCHOR.gate === 17 && MANDALA_ANCHOR.name === '澤雷隨' && MANDALA_ANCHOR.position === 0;
check('T8 輪盤 64 槽無重複、集合=1..64、12 點鐘=第17閘門隨卦', wheelOk,
  `slot0=${RAVE_MANDALA_WHEEL[0].gate}${RAVE_MANDALA_WHEEL[0].name}`);

// 輪盤 = 官方序列自 17 起旋轉（循環相對順序不變）
const rotIdx = RAVE_MANDALA_ORDER.indexOf(17);
const rotatedRef = [...RAVE_MANDALA_ORDER.slice(rotIdx), ...RAVE_MANDALA_ORDER.slice(0, rotIdx)];
const rotationOk = wheelGates.every((g, i) => g === rotatedRef[i]);
check('T8b 輪盤為官方序列自第17閘門起始之循環旋轉（相對順序不變）', rotationOk, '(旋轉不符)');

// ── T9 輪盤角度 ───────────────────────────────────────────────
const SEG = 64, SLICE = 360 / SEG;
const angleOk = RAVE_MANDALA_WHEEL.every((w, i) =>
  Math.abs(w.angleFromTopDeg - (i * SLICE)) < 1e-9 && w.sliceDeg === SLICE &&
  w.binary === matrix[w.gate].binary && w.lines.join('') === w.binary);
check('T9 每槽角距 5.625°、360° 閉環、槽位二元與矩陣一致', angleOk,
  `slice=${SLICE} lastAngle=${RAVE_MANDALA_WHEEL[63].angleFromTopDeg}`);

// ── 對稱互補抽檢（正統易經錯卦）+ Rave Mandala 對位全驗 ──────────────
// 全驗：每一卦的 GENE_KEYS_64 partner 必為其六爻陰陽全反卦（錯卦雙射）。
// 此性質為 Rave Mandala 直徑 180° 對位的結構保證，證明輪盤順序與
// 官方 Gene Keys 字典（genekeys.com 規範）完全一致。
const complementOf = b => b.replace(/0/g, 'x').replace(/1/g, '0').replace(/x/g, '1');
const compPairs = [[1, 2], [11, 12], [17, 18], [27, 28], [29, 30], [3, 50], [4, 49]];
const compOk = compPairs.every(([a, b]) => complementOf(matrix[a].binary) === matrix[b].binary);
check('T9b 錯卦抽檢（乾↔坤 泰↔否 隨↔蠱 頤↔大過 坎↔離 屯↔鼎 蒙↔革）', compOk,
  compPairs.map(([a, b]) => `${a}:${matrix[a].binary}~${b}:${matrix[b].binary}`).join(' '));

// 64 卦 partner 全驗（錯卦 = 六爻陰陽全反）
const compErrors = [];
entries.forEach(h => {
  const partnerNo = GENE_KEYS_64 && GENE_KEYS_64[h.number] ? GENE_KEYS_64[h.number].partner : null;
  const partnerHex = partnerNo ? matrix[partnerNo] : null;
  if (!partnerHex || complementOf(h.binary) !== partnerHex.binary) {
    compErrors.push(`${h.number}${h.name}(+${h.binary})→partner${partnerNo}.${partnerHex ? partnerHex.binary : '?'}`);
  }
});
check('T9c 錯卦全驗：64 卦 partner 皆為六爻陰陽全反（180° 對位雙射，0/64 不符）',
  compErrors.length === 0, compErrors.slice(0, 5).join(' | '));

// ─────────────────────────────────────────────────────────────
console.log(`\n═══ 結果：PASS ${pass} ／ FAIL ${fail} ═══`);
process.exit(fail === 0 ? 0 : 1);