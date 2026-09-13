/**
 * generate-hexagram-matrix.js
 * 產生器：64 易經卦象完整六爻二進位矩陣 + Rave Mandala 64 卦順時針輪盤序列
 * 初爻至上爻（bottom-up）、陽爻=1 / 陰爻=0
 * 交叉基準：
 *   1. 八卦底層二進位（bottom-up，對標 Unicode 易經八卦碼位）
 *   2. 文王卦序 64 卦上下卦組成（King Wen Sequence）
 *   3. Rave Mandala 閘門循環順序（gethumandesign 官方文獻：41→19→…→60）
 *   4. 本地 liu-yao.html HEXAGRAM_PALACES（上爻→初爻 top-first 鍵，倒序即初爻→上爻）
 * 規格錨點：輪盤 12 點鐘頂點 = 第 17 閘門（澤雷隨）
 */
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────
// 1. 八卦底層二進位（bottom-up = 初爻→上爻、陽1陰0）
//    key: 卦名; bu: bottom-up; tf: top-first
// ─────────────────────────────────────────────────────────────
const TRIGRAMS = {
  乾: { nature: '天', bu: '111', tf: '111' },
  兌: { nature: '澤', bu: '110', tf: '011' },
  離: { nature: '火', bu: '101', tf: '101' },
  震: { nature: '雷', bu: '100', tf: '001' },
  巽: { nature: '風', bu: '011', tf: '110' },
  坎: { nature: '水', bu: '010', tf: '010' },
  艮: { nature: '山', bu: '001', tf: '100' },
  坤: { nature: '地', bu: '000', tf: '000' }
};

// ─────────────────────────────────────────────────────────────
// 2. 文王卦序 64 卦組成 [卦號, 下卦, 上卦]  （King Wen Sequence）
// ─────────────────────────────────────────────────────────────
const KING_WEN = [
  [1, '乾', '乾'], [2, '坤', '坤'], [3, '震', '坎'], [4, '坎', '艮'], [5, '乾', '坎'], [6, '坎', '乾'], [7, '坎', '坤'], [8, '坤', '坎'],
  [9, '乾', '巽'], [10, '兌', '乾'], [11, '乾', '坤'], [12, '坤', '乾'], [13, '離', '乾'], [14, '乾', '離'], [15, '艮', '坤'], [16, '坤', '震'],
  [17, '震', '兌'], [18, '巽', '艮'], [19, '兌', '坤'], [20, '坤', '巽'], [21, '震', '離'], [22, '離', '艮'], [23, '坤', '艮'], [24, '震', '坤'],
  [25, '震', '乾'], [26, '乾', '艮'], [27, '震', '艮'], [28, '巽', '兌'], [29, '坎', '坎'], [30, '離', '離'], [31, '艮', '兌'], [32, '巽', '震'],
  [33, '艮', '乾'], [34, '乾', '震'], [35, '坤', '離'], [36, '離', '坤'], [37, '離', '巽'], [38, '兌', '離'], [39, '艮', '坎'], [40, '坎', '震'],
  [41, '兌', '艮'], [42, '震', '巽'], [43, '乾', '兌'], [44, '巽', '乾'], [45, '坤', '兌'], [46, '巽', '坤'], [47, '坎', '兌'], [48, '巽', '坎'],
  [49, '離', '兌'], [50, '巽', '離'], [51, '震', '震'], [52, '艮', '艮'], [53, '艮', '巽'], [54, '兌', '震'], [55, '離', '震'], [56, '艮', '離'],
  [57, '巽', '巽'], [58, '兌', '兌'], [59, '坎', '巽'], [60, '兌', '坎'], [61, '兌', '巽'], [62, '艮', '震'], [63, '離', '坎'], [64, '坎', '離']
];

const KING_WEN_NAMES = [
  '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
  '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
  '澤雷隨', '山風蠱', '地澤臨', '風地觀', '火雷噬嗑', '山火賁', '山地剝', '地雷復',
  '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恆',
  '天山遯', '雷天大壯', '火地晉', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
  '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
  '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤歸妹', '雷火豐', '火山旅',
  '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既濟', '火水未濟'
];

// ─────────────────────────────────────────────────────────────
// 3. Rave Mandala 閘門循環順序（卦號 1:1 = 閘門編號）
//    官方文獻起始：Gate 41（摩羯座終點、水瓶座 0° 前）→ 順時針繞行
// ─────────────────────────────────────────────────────────────
const RAVE_MANDALA_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

// 規格錨點：12 點鐘頂點 = 第 17 閘門（澤雷隨）
const MANDALA_ANCHOR_GATE = 17;
const SEGMENTS = 64;
const SLICE_DEG = 360 / SEGMENTS; // 5.625°

// 旋轉序列使錨點閘門置於 index 0（維持循環相對順序）
function rotateToAnchor(order, anchor) {
  const idx = order.indexOf(anchor);
  if (idx < 0) throw new Error('anchor gate not found in Rave Mandala order');
  return order.slice(idx).concat(order.slice(0, idx));
}

const RAVE_MANDALA_WHEEL_ORDER = rotateToAnchor(RAVE_MANDALA_ORDER, MANDALA_ANCHOR_GATE);

// ─────────────────────────────────────────────────────────────
// 4. 建立 64 卦矩陣
// ─────────────────────────────────────────────────────────────
function buildHexagramMatrix() {
  const matrix = {};
  for (let i = 0; i < 64; i++) {
    const [num, lo, up] = KING_WEN[i];
    const bu = TRIGRAMS[lo].bu + TRIGRAMS[up].bu;   // 初爻→上爻
    const tf = TRIGRAMS[up].tf + TRIGRAMS[lo].tf;   // 上爻→初爻（與 liu-yao.html 鍵一致）
    const lines = bu.split('').map(Number);         // [初,二,三,四,五,上]
    const lineLabels = ['初', '二', '三', '四', '五', '上'];
    matrix[num] = {
      number: num,
      name: KING_WEN_NAMES[i],
      lower: lo,
      upper: up,
      binary: bu,
      binaryTopFirst: tf,
      lines,
      lineLabels,
      yangCount: lines.filter(l => l === 1).length,
      yinCount: lines.filter(l => l === 0).length
    };
  }
  // 瑞士起司防禦：64 卦 6-bit 序列必須全相異 → 雙射覆蓋 2^6=64 全部組合
  const buSet = new Set(Object.values(matrix).map(h => h.binary));
  if (buSet.size !== 64) {
    throw new Error(`六爻二進位矩陣自檢失敗：僅 ${buSet.size}/64 相異（存在重複卦象）`);
  }
  return matrix;
}

function buildWheel(matrix) {
  return RAVE_MANDALA_WHEEL_ORDER.map((gate, pos) => {
    const hex = matrix[gate];
    return {
      position: pos,                 // 0 = 12 點鐘頂點，順時針遞增
      gate,
      hexagram: gate,                // 閘門編號 = 卦號 1:1
      name: hex.name,
      lower: hex.lower,
      upper: hex.upper,
      binary: hex.binary,            // 初爻→上爻
      lines: hex.lines,
      angleFromTopDeg: (pos * SLICE_DEG).toFixed(4) * 1, // 自 12 點起順時針角度
      sliceDeg: SLICE_DEG
    };
  });
}

// ─────────────────────────────────────────────────────────────
// 5. 輸出字串組裝
// ─────────────────────────────────────────────────────────────
function jsonBlock(name, obj) {
  return `// ${name}
const ${name} = ${JSON.stringify(obj, null, 2)};

`;
}

function buildDataFile(hexMatrix, wheel) {
  let out = '';
  out += '// ════════════════════════════════════════════════════════════════\n';
  out += '// 64 易經卦象六爻二進位矩陣 × Rave Mandala 順時針輪盤序列\n';
  out += '// 初爻→上爻（bottom-up）· 陽爻=1 / 陰爻=0 · 閘門編號 = 卦號 1:1\n';
  out += '// Rave Mandala 錨點：輪盤 12 點鐘頂點 = 第 17 閘門（澤雷隨）\n';
  out += '// 產生器：scripts/generate-hexagram-matrix.js（不可手動修改）\n';
  out += '// ════════════════════════════════════════════════════════════════\n\n';
  out += jsonBlock('HEXAGRAM_MATRIX_64', hexMatrix);
  out += jsonBlock('RAVE_MANDALA_ORDER', RAVE_MANDALA_ORDER);
  out += jsonBlock('RAVE_MANDALA_WHEEL', wheel);
  out += jsonBlock('MANDALA_ANCHOR', {
    position: 0,
    gate: MANDALA_ANCHOR_GATE,
    hexagram: MANDALA_ANCHOR_GATE,
    name: hexMatrix[MANDALA_ANCHOR_GATE].name,
    binary: hexMatrix[MANDALA_ANCHOR_GATE].binary,
    at: '12點鐘頂點',
    direction: 'clockwise',
    sliceDeg: SLICE_DEG
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// 6. 主流程：寫入 js/gene-keys-data.js（保留既有常數與匯出）
// ─────────────────────────────────────────────────────────────
const DATA_PATH = path.join(__dirname, '..', 'js', 'gene-keys-data.js');
const current = fs.readFileSync(DATA_PATH, 'utf8');

const hexMatrix = buildHexagramMatrix();
const wheel = buildWheel(hexMatrix);
const insertBlock = buildDataFile(hexMatrix, wheel);

// 若已存在先前產生的 HEXAGRAM_MATRIX_64 區塊，先安全清理
let cleanCurrent = current;
if (cleanCurrent.includes('const HEXAGRAM_MATRIX_64')) {
  cleanCurrent = cleanCurrent.replace(/\n\/\/ 64 易經卦象六爻二進位矩陣[\s\S]*?(?=\n\s*if \(typeof module)/, '');
  cleanCurrent = cleanCurrent.replace(/,\s*HEXAGRAM_MATRIX_64[\s\S]*?(?=\n\s*\};)/, '');
}

// 既有匯出區塊：在其前方插入新常數，並將新常數追加至 module.exports
const exportsRegex = /(\/\/ 各分盤專屬通道網絡[\s\S]*?)(\n\s*if \(typeof module)/;
if (!exportsRegex.test(cleanCurrent)) {
  throw new Error('找不到 gene-keys-data.js 的既有匯出插入點');
}

// 只做「插入常數 + 擴充 module.exports」的最小改動
const exportsObjRegex = /module\.exports = \{([\s\S]*?)\n  \};/;
if (!cleanCurrent.match(exportsObjRegex)) throw new Error('找不到 module.exports 區塊');

const updated = cleanCurrent
  .replace(exportsRegex, (m, before, after) => before + '\n' + insertBlock + after)
  .replace(exportsObjRegex, (m, inner) => 'module.exports = {' + inner.replace(/,\s*$/, '') + ',\n    HEXAGRAM_MATRIX_64,\n    RAVE_MANDALA_ORDER,\n    RAVE_MANDALA_WHEEL,\n    MANDALA_ANCHOR\n  };');

fs.writeFileSync(DATA_PATH, updated, 'utf8');
console.log(`✅ 已寫入 ${DATA_PATH}`);
console.log(`   HEXAGRAM_MATRIX_64: ${Object.keys(hexMatrix).length} 卦`);
console.log(`   RAVE_MANDALA_ORDER: ${RAVE_MANDALA_ORDER.length} 閘門（起點 41）`);
console.log(`   RAVE_MANDALA_WHEEL: ${wheel.length} 槽位（12 點 = 隨卦 ${MANDALA_ANCHOR_GATE}）`);