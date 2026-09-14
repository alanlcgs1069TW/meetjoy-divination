/**
 * gene-keys-data.js
 * 基因天命 (Gene Keys) 64 閘門頻率字典與全息天命圖 (Hologenetic Profile) 爻線資料庫
 * 100% 精準對齊 genekeys.com 官方全息天命圖規範與繁體中文術語
 */

const GENE_KEYS_64 = {
  1: { hex: '乾為天', shadow: '枯竭', gift: '原創', siddhi: '美', partner: 2, ring: '火之環' },
  2: { hex: '坤為地', shadow: '迷失', gift: '導引', siddhi: '合一', partner: 1, ring: '水之環' },
  3: { hex: '水雷屯', shadow: '混亂', gift: '創新', siddhi: '純真', partner: 50, ring: '生命之環' },
  4: { hex: '山水蒙', shadow: '不耐', gift: '理解', siddhi: '寬恕', partner: 49, ring: '淨化之環' },
  5: { hex: '水天需', shadow: '焦躁', gift: '耐心', siddhi: '永恆', partner: 35, ring: '光明之環' },
  6: { hex: '天水訟', shadow: '衝突', gift: '外交', siddhi: '和平', partner: 36, ring: '煉金之環' },
  7: { hex: '地水師', shadow: '分歧', gift: '指引', siddhi: '德行', partner: 13, ring: '同盟之環' },
  8: { hex: '水地比', shadow: '平庸', gift: '風格', siddhi: '精緻', partner: 14, ring: '水之環' },
  9: { hex: '風天小畜', shadow: '惰性', gift: '專注', siddhi: '無敵', partner: 16, ring: '光明之環' },
  10: { hex: '天澤履', shadow: '執著', gift: '自然', siddhi: '存在', partner: 15, ring: '人性之環' },
  11: { hex: '地天泰', shadow: '黯淡', gift: '理想', siddhi: '光明', partner: 12, ring: '光明之環' },
  12: { hex: '天地否', shadow: '虛榮', gift: '明辨', siddhi: '純淨', partner: 11, ring: '奧祕之環' },
  13: { hex: '天火同人', shadow: '不和', gift: '聆聽', siddhi: '同理', partner: 7, ring: '淨化之環' },
  14: { hex: '火天大有', shadow: '妥協', gift: '能耐', siddhi: '豐盛', partner: 8, ring: '火之環' },
  15: { hex: '地山謙', shadow: '沈悶', gift: '磁力', siddhi: '綻放', partner: 10, ring: '尋道之環' },
  16: { hex: '雷地豫', shadow: '冷漠', gift: '多藝', siddhi: '精通', partner: 9, ring: '奇蹟之環' },
  17: { hex: '澤雷隨', shadow: '意見', gift: '遠見', siddhi: '全知', partner: 18, ring: '幻象之環' },
  18: { hex: '山風蠱', shadow: '評判', gift: '完整', siddhi: '完美', partner: 17, ring: '物質之環' },
  19: { hex: '地澤臨', shadow: '互累', gift: '通感', siddhi: '捨得', partner: 33, ring: '啟動之環' },
  20: { hex: '風地觀', shadow: '膚淺', gift: '自信', siddhi: '臨在', partner: 34, ring: '生命之環' },
  21: { hex: '火雷噬嗑', shadow: '控制', gift: '權威', siddhi: '勇武', partner: 48, ring: '人性之環' },
  22: { hex: '山火賁', shadow: '失格', gift: '優雅', siddhi: '聖寵', partner: 47, ring: '淨化之環' },
  23: { hex: '山地剝', shadow: '繁雜', gift: '簡約', siddhi: '真萃', partner: 43, ring: '生命之環' },
  24: { hex: '地雷復', shadow: '成癮', gift: '發明', siddhi: '寂靜', partner: 44, ring: '重生之環' },
  25: { hex: '天雷無妄', shadow: '退縮', gift: '接納', siddhi: '博愛', partner: 46, ring: '真愛之環' },
  26: { hex: '山天大畜', shadow: '驕妄', gift: '靈巧', siddhi: '無形', partner: 45, ring: '光明之環' },
  27: { hex: '山雷頤', shadow: '自私', gift: '利他', siddhi: '無私', partner: 28, ring: '生命之環' },
  28: { hex: '澤風大過', shadow: '虛無', gift: '全然', siddhi: '永生', partner: 27, ring: '幻象之環' },
  29: { hex: '坎為水', shadow: '半吊', gift: '承諾', siddhi: '奉獻', partner: 30, ring: '同盟之環' },
  30: { hex: '離為火', shadow: '渴望', gift: '輕盈', siddhi: '狂喜', partner: 29, ring: '淨化之環' },
  31: { hex: '澤山咸', shadow: '自大', gift: '領導', siddhi: '謙遜', partner: 41, ring: '同盟之環' },
  32: { hex: '雷風恆', shadow: '焦慮', gift: '保全', siddhi: '敬畏', partner: 42, ring: '幻象之環' },
  33: { hex: '天山遯', shadow: '遺忘', gift: '正念', siddhi: '開悟', partner: 19, ring: '考驗之環' },
  34: { hex: '雷天大壯', shadow: '強橫', gift: '力量', siddhi: '威嚴', partner: 20, ring: '人性之環' },
  35: { hex: '火地晉', shadow: '飢渴', gift: '冒險', siddhi: '無限', partner: 5, ring: '奇蹟之環' },
  36: { hex: '地火明夷', shadow: '動盪', gift: '人道', siddhi: '慈悲', partner: 6, ring: '煉金之環' },
  37: { hex: '風火家人', shadow: '軟弱', gift: '平等', siddhi: '柔順', partner: 40, ring: '神聖之環' },
  38: { hex: '火澤睽', shadow: '內耗', gift: '堅毅', siddhi: '榮光', partner: 39, ring: '尋道之環' },
  39: { hex: '水山蹇', shadow: '挑釁', gift: '動能', siddhi: '解放', partner: 38, ring: '尋道之環' },
  40: { hex: '雷水解', shadow: '疲憊', gift: '決心', siddhi: '神意', partner: 37, ring: '煉金之環' },
  41: { hex: '山澤損', shadow: '幻想', gift: '預見', siddhi: '源光', partner: 31, ring: '起源之環' },
  42: { hex: '風雷益', shadow: '期待', gift: '超然', siddhi: '慶典', partner: 32, ring: '生命之環' },
  43: { hex: '澤天夬', shadow: '失聰', gift: '洞見', siddhi: '頓悟', partner: 23, ring: '命運之環' },
  44: { hex: '天風姤', shadow: '干擾', gift: '協作', siddhi: '共治', partner: 24, ring: '幻象之環' },
  45: { hex: '澤地萃', shadow: '支配', gift: '協同', siddhi: '同融', partner: 26, ring: '煉金之環' },
  46: { hex: '地風升', shadow: '嚴肅', gift: '喜悅', siddhi: '神醉', partner: 25, ring: '真愛之環' },
  47: { hex: '澤水困', shadow: '壓抑', gift: '轉化', siddhi: '超然', partner: 22, ring: '淨化之環' },
  48: { hex: '水風井', shadow: '不足', gift: '智謀', siddhi: '智慧', partner: 21, ring: '物質之環' },
  49: { hex: '澤火革', shadow: '阻抗', gift: '革新', siddhi: '新生', partner: 4, ring: '同盟之環' },
  50: { hex: '火風鼎', shadow: '墮落', gift: '平衡', siddhi: '和諧', partner: 3, ring: '光明之環' },
  51: { hex: '震為雷', shadow: '驚恐', gift: '首創', siddhi: '覺醒', partner: 57, ring: '啟動之環' },
  52: { hex: '艮為山', shadow: '壓力', gift: '剋制', siddhi: '靜定', partner: 58, ring: '靜定之環' },
  53: { hex: '風山漸', shadow: '生澀', gift: '拓展', siddhi: '登峰', partner: 54, ring: '尋道之環' },
  54: { hex: '雷澤歸妹', shadow: '貪慾', gift: '抱負', siddhi: '飛升', partner: 53, ring: '尋道之環' },
  55: { hex: '雷火豐', shadow: '受害', gift: '自由', siddhi: '解脫', partner: 59, ring: '水之環' },
  56: { hex: '火山旅', shadow: '分神', gift: '豐饒', siddhi: '沉醉', partner: 60, ring: '尋道之環' },
  57: { hex: '巽為風', shadow: '焦慮', gift: '直覺', siddhi: '澄澈', partner: 51, ring: '物質之環' },
  58: { hex: '兌為澤', shadow: '不滿', gift: '生機', siddhi: '喜樂', partner: 52, ring: '靜定之環' },
  59: { hex: '風水渙', shadow: '不誠', gift: '親密', siddhi: '透徹', partner: 55, ring: '結合之環' },
  60: { hex: '水澤節', shadow: '限制', gift: '務實', siddhi: '公正', partner: 56, ring: '考驗之環' },
  61: { hex: '風澤中孚', shadow: '心狂', gift: '靈感', siddhi: '神性', partner: 62, ring: '真愛之環' },
  62: { hex: '雷山小過', shadow: '知障', gift: '精確', siddhi: '無暇', partner: 61, ring: '水之環' },
  63: { hex: '水火既濟', shadow: '懷疑', gift: '求索', siddhi: '真諦', partner: 64, ring: '同盟之環' },
  64: { hex: '火水未濟', shadow: '紛亂', gift: '想像', siddhi: '透亮', partner: 63, ring: '煉金之環' }
};

// 11 大天命球各爻線官方專屬標籤 (Line Tags)
const SPHERE_LINE_TAGS = {
  // 生命工作 (Life's Work)
  lifesWork: {
    1: '初爻 · 創造者',
    2: '二爻 · 舞者',
    3: '三爻 · 變革者',
    4: '四爻 · 服務者',
    5: '五爻 · 引導者',
    6: '六爻 · 示範者'
  },
  // 進化 (Evolution)
  evolution: {
    1: '初爻 · 內省與自我賦權',
    2: '二爻 · 熱情 & 關係',
    3: '三爻 · 能量與適應',
    4: '四爻 · 網絡與同理',
    5: '五爻 · 實用引導',
    6: '六爻 · 願景教育'
  },
  // 光芒 (Radiance)
  radiance: {
    1: '初爻 · 孤獨（骨骼）',
    2: '二爻 · 流動（姿態）',
    3: '三爻 · 能量（肌肉）',
    4: '友情 · 四爻',
    5: '五爻 · 影響（聲音）',
    6: '六爻 · 臣服（意識）'
  },
  // 使命 (Purpose - 啟動序列/身體根基)
  purpose: {
    1: '初爻 · 物理根基',
    2: '二爻 · 姿勢流動',
    3: '三爻 · 活力與運動',
    4: '四爻 · 呼吸（韻律）',
    5: '五爻 · 聲音頻率',
    6: '六爻 · 臣服大化'
  },
  // 使命 (Purpose - 金星序列/靈魂關係)
  purpose_venus: {
    1: '初爻 · 骨盆／錨定',
    2: '二爻 · 伴侶／同調',
    3: '三爻 · 逃避者／轉化',
    4: '四爻 · 滋養者/政客',
    5: '五爻 · 領袖／實用',
    6: '六爻 · 隱士／示範'
  },
  // 吸引力 (Attraction)
  attraction: {
    1: '初爻 · 骨盆／安定',
    2: '二爻 · 誘惑／野性邊界',
    3: '三爻 · 情感／承諾',
    4: '四爻 · 凍結／浪漫',
    5: '五爻 · 力量／投射',
    6: '六爻 · 幻滅／慈悲'
  },
  // 智商 (IQ)
  iq: {
    1: '沉思之智 · 初爻',
    2: '二爻 · 靈活之智',
    3: '三爻 · 戰略之智',
    4: '四爻 · 直覺之智',
    5: '五爻 · 實用之智',
    6: '六爻 · 客觀之智'
  },
  // 情商 (EQ)
  eq: {
    1: '初爻 · 激情／壓抑',
    2: '二爻 · 害羞／狂喜',
    3: '三爻 · 愉悅／悲傷',
    4: '四爻 · 仁善／刻薄',
    5: '五爻 · 認同／評判',
    6: '六爻 · 幻滅／超脫'
  },
  // 靈商 (SQ)
  sq: {
    1: '初爻 · 肉體／生理安全',
    2: '二爻 · 自由（野性與邊界）',
    3: '三爻 · 心輪／自我價值',
    4: '四爻 · 喉輪／真誠表達',
    5: '五爻 · 靈性／神聖連繫',
    6: '六爻 · 頂輪／宇宙合一'
  },
  // 核心 (Core / Wound)
  core: {
    1: '初爻 · 壓抑（骨骼）',
    2: '二爻 · 否定（流動）',
    3: '羞恥／幽默 · 三爻',
    4: '四爻 · 拒絕（呼吸）',
    5: '五爻 · 內疚（聲音）',
    6: '六爻 · 分離（意識）'
  },
  vocation: {
    1: '初爻 · 壓抑／大師',
    2: '二爻 · 否定／天才',
    3: '羞恥／幽默 · 三爻',
    4: '四爻 · 拒絕／網絡',
    5: '五爻 · 內疚／領導',
    6: '六爻 · 分離／視野'
  },
  // 文化 (Culture)
  culture: {
    1: '初爻 · 個體原創',
    2: '二爻 · 夥伴協作',
    3: '三爻 · 部族核心',
    4: '四爻 · 網絡',
    5: '五爻 · 社會影響',
    6: '六爻 · 全球系統'
  },
  // 珍珠 (Pearl)
  pearl: {
    1: '初爻 · 簡約質樸',
    2: '二爻 · 賞識',
    3: '三爻 · 歡慶同樂',
    4: '四爻 · 慈善惠濟',
    5: '五爻 · 賦能權威',
    6: '六爻 · 自然流動'
  },
  // 品牌 (Brand)
  brand: {
    1: '初爻 · 原創先行者',
    2: '二爻 · 魅力',
    3: '三爻 · 靈活變革者',
    4: '四爻 · 誠摯服務者',
    5: '五爻 · 宏觀引導者',
    6: '六爻 · 崇高示範者'
  },
  // 天職 (Vocation)
  vocation: {
    1: '初爻 · 壓抑／大師',
    2: '二爻 · 否定／天才',
    3: '擁抱風險 · 三爻',
    4: '四爻 · 拒絕／網絡',
    5: '五爻 · 內疚／領導',
    6: '六爻 · 分離／視野'
  },
  // 關係力 (Relationship / Attunement)
  relationship: {
    1: '初爻 · 誠信／原真',
    2: '二爻 · 響應／流動',
    3: '三爻 · 融匯',
    4: '四爻 · 親和／同理',
    5: '五爻 · 影響／引導',
    6: '六爻 · 願景／昇華'
  },
  // 穩定性 (Stability)
  stability: {
    1: '初爻 · 自律',
    2: '二爻 · 彈性／自如',
    3: '三爻 · 堅毅／扎根',
    4: '四爻 · 網絡／守護',
    5: '五爻 · 系統／持衡',
    6: '六爻 · 永恆／超越'
  },
  // 創造力 (Creativity)
  creativity: {
    1: '初爻 · 原始純力',
    2: '二爻 · 天賦律動',
    3: '鍊金 · 三爻',
    4: '四爻 · 協同交響',
    5: '五爻 · 破局引領',
    6: '六爻 · 神性造化'
  }
};

// 全息天命圖各序列標準幾何端點座標 (基於 960x760 視圖百分比)
// 1. 完整全譜 (Wholeness · 11 Spheres 神聖幾何曼陀羅)
const SACRED_MANDALA_COORDS = {
  // 啟動序列 (菱形四極頂點)
  lifesWork:  { x: 50.0, y: 12.0, labelAlign: 'top-right' },
  evolution:  { x: 82.0, y: 49.0, labelAlign: 'right' },
  radiance:   { x: 18.0, y: 49.0, labelAlign: 'left' },
  purpose:    { x: 50.0, y: 88.0, labelAlign: 'bottom-right' },

  // 金星序列 (聖杯心型天梯)
  attraction: { x: 50.0, y: 70.0, labelAlign: 'right' },
  iq:         { x: 33.0, y: 61.0, labelAlign: 'left' },
  eq:         { x: 67.0, y: 61.0, labelAlign: 'right' },
  sq:         { x: 50.0, y: 49.0, labelAlign: 'top-right' }, // 正幾何中心
  core:       { x: 33.0, y: 37.0, labelAlign: 'left' },

  // 珍珠序列 (等腰三角與中心珍珠)
  culture:    { x: 67.0, y: 37.0, labelAlign: 'right' },
  pearl:      { x: 50.0, y: 26.0, labelAlign: 'top-right' }
};

// 2. 啟動序列專屬幾何端點 (大正菱形 · 四大天才端點)
const ACTIVATION_SEQUENCE_COORDS = {
  lifesWork:  { x: 50.0, y: 14.0, labelAlign: 'top-right' },
  evolution:  { x: 82.0, y: 50.0, labelAlign: 'right' },
  purpose:    { x: 50.0, y: 86.0, labelAlign: 'bottom-right' },
  radiance:   { x: 18.0, y: 50.0, labelAlign: 'left' }
};

// 3. 金星序列專屬幾何端點 (心靈聖杯 · 六大愛的端點)
const VENUS_SEQUENCE_COORDS = {
  purpose:    { x: 50.0, y: 86.0, labelAlign: 'bottom-right' },
  attraction: { x: 50.0, y: 68.0, labelAlign: 'right' },
  iq:         { x: 28.0, y: 52.0, labelAlign: 'left' },
  eq:         { x: 72.0, y: 52.0, labelAlign: 'right' },
  sq:         { x: 50.0, y: 36.0, labelAlign: 'right' },
  core:       { x: 32.0, y: 18.0, labelAlign: 'left' }
};

// 4. 珍珠序列專屬幾何端點 (大等邊正三角形 + 正中心珍珠)
const PEARL_SEQUENCE_COORDS = {
  brand:      { x: 50.0, y: 18.0, labelAlign: 'top-right' },
  vocation:   { x: 25.0, y: 68.0, labelAlign: 'left' },
  culture:    { x: 75.0, y: 68.0, labelAlign: 'right' },
  pearl:      { x: 50.0, y: 48.0, labelAlign: 'right' }
};

// 5. 星辰珍珠專屬神聖六角幾何端點 (正六邊形 + 正中心珍珠)
const STAR_PEARL_COORDS = {
  brand:        { x: 50.0, y: 16.0, labelAlign: 'top-right' },
  relationship: { x: 78.0, y: 33.0, labelAlign: 'right' },
  culture:      { x: 78.0, y: 67.0, labelAlign: 'right' },
  stability:    { x: 50.0, y: 84.0, labelAlign: 'bottom-right' },
  vocation:     { x: 22.0, y: 67.0, labelAlign: 'left' },
  creativity:   { x: 22.0, y: 33.0, labelAlign: 'left' },
  pearl:        { x: 50.0, y: 50.0, labelAlign: 'right' }
};

// 全息通道路徑連線 (Pathways) - 完整全譜（對標桌面截圖：3 綠 + 5 紅 + 6 藍 = 14 條神聖通道）
const GOLDEN_PATHWAYS = [
  // 1. 啟動序列綠線 (The Activation Sequence · 精確 3 條挑戰顯化通道)
  { from: 'lifesWork', to: 'evolution', color: '#10B981', seq: 'activation', name: '挑戰通道' },
  { from: 'evolution', to: 'radiance', color: '#10B981', seq: 'activation', name: '光芒突破通道' },
  { from: 'radiance', to: 'purpose', color: '#10B981', seq: 'activation', name: '扎根天命通道' },

  // 2. 金星序列紅線 (The Venus Sequence · 精確 5 條心靈聖杯階梯)
  { from: 'purpose', to: 'attraction', color: '#E11D48', seq: 'venus', name: '業力吸引力通道' },
  { from: 'attraction', to: 'iq', color: '#E11D48', seq: 'venus', name: '心智轉化通道' },
  { from: 'iq', to: 'eq', color: '#E11D48', seq: 'venus', name: '心智情緒整合通道' },
  { from: 'eq', to: 'sq', color: '#E11D48', seq: 'venus', name: '心輪開啟通道' },
  { from: 'sq', to: 'core', color: '#E11D48', seq: 'venus', name: '核心創傷通道' },

  // 3. 珍珠序列藍線 (The Pearl Sequence · 外圍大三角 3 條 + 中心珍珠輻射 3 條 = 6 條)
  { from: 'core', to: 'culture', color: '#0EA5E9', seq: 'pearl', name: '天職創造力通道' },
  { from: 'culture', to: 'lifesWork', color: '#0EA5E9', seq: 'pearl', name: '品牌文化通道' },
  { from: 'lifesWork', to: 'core', color: '#0EA5E9', seq: 'pearl', name: '天職品牌通道' },
  { from: 'pearl', to: 'lifesWork', color: '#0EA5E9', seq: 'pearl', name: '珍珠品牌中軸通道' },
  { from: 'pearl', to: 'core', color: '#0EA5E9', seq: 'pearl', name: '珍珠天職通道' },
  { from: 'pearl', to: 'culture', color: '#0EA5E9', seq: 'pearl', name: '珍珠文化通道' }
];

// 各分盤專屬通道網絡 (對標截圖各分盤線條)
const SUB_SEQUENCE_PATHWAYS = {
  activation: [
    { from: 'lifesWork', to: 'evolution', color: '#10B981', name: '挑戰通道' },
    { from: 'evolution', to: 'radiance', color: '#10B981', name: '光芒突破通道' },
    { from: 'radiance', to: 'purpose', color: '#10B981', name: '扎根天命通道' }
  ],
  venus: [
    { from: 'purpose', to: 'attraction', color: '#E11D48', name: '業力吸引力通道' },
    { from: 'attraction', to: 'iq', color: '#E11D48', name: '心智轉化通道' },
    { from: 'iq', to: 'eq', color: '#E11D48', name: '心智情緒整合通道' },
    { from: 'eq', to: 'sq', color: '#E11D48', name: '心輪開啟通道' },
    { from: 'sq', to: 'core', color: '#E11D48', name: '核心創傷通道' }
  ],
  pearl: [
    { from: 'brand', to: 'culture', color: '#0284C7', name: '品牌文化通道' },
    { from: 'culture', to: 'vocation', color: '#0284C7', name: '天職創造力通道' },
    { from: 'vocation', to: 'brand', color: '#0284C7', name: '天職品牌通道' },
    { from: 'pearl', to: 'brand', color: '#0284C7', name: '珍珠品牌中軸通道' },
    { from: 'pearl', to: 'vocation', color: '#0284C7', name: '珍珠天職通道' },
    { from: 'pearl', to: 'culture', color: '#0284C7', name: '珍珠文化通道' }
  ],
  starPearl: [
    // 正六邊形邊界
    { from: 'brand', to: 'relationship', color: '#2563EB' },
    { from: 'relationship', to: 'culture', color: '#2563EB' },
    { from: 'culture', to: 'stability', color: '#2563EB' },
    { from: 'stability', to: 'vocation', color: '#2563EB' },
    { from: 'vocation', to: 'creativity', color: '#2563EB' },
    { from: 'creativity', to: 'brand', color: '#2563EB' },
    // 內部六芒星連線
    { from: 'brand', to: 'culture', color: '#2563EB' },
    { from: 'culture', to: 'vocation', color: '#2563EB' },
    { from: 'vocation', to: 'brand', color: '#2563EB' },
    { from: 'relationship', to: 'stability', color: '#2563EB' },
    { from: 'stability', to: 'creativity', color: '#2563EB' },
    { from: 'creativity', to: 'relationship', color: '#2563EB' },
    // 中心輻射連線
    { from: 'pearl', to: 'brand', color: '#2563EB' },
    { from: 'pearl', to: 'relationship', color: '#2563EB' },
    { from: 'pearl', to: 'culture', color: '#2563EB' },
    { from: 'pearl', to: 'stability', color: '#2563EB' },
    { from: 'pearl', to: 'vocation', color: '#2563EB' },
    { from: 'pearl', to: 'creativity', color: '#2563EB' }
  ]
};
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// 64 易經卦象六爻二進位矩陣 × Rave Mandala 順時針輪盤序列
// 初爻→上爻（bottom-up）· 陽爻=1 / 陰爻=0 · 閘門編號 = 卦號 1:1
// Rave Mandala 錨點：輪盤 12 點鐘頂點 = 第 10 閘門（天澤履）
// 產生器：scripts/generate-hexagram-matrix.js（不可手動修改）
// ════════════════════════════════════════════════════════════════

// HEXAGRAM_MATRIX_64
const HEXAGRAM_MATRIX_64 = {
  "1": {
    "number": 1,
    "name": "乾為天",
    "lower": "乾",
    "upper": "乾",
    "binary": "111111",
    "binaryTopFirst": "111111",
    "lines": [
      1,
      1,
      1,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 6,
    "yinCount": 0
  },
  "2": {
    "number": 2,
    "name": "坤為地",
    "lower": "坤",
    "upper": "坤",
    "binary": "000000",
    "binaryTopFirst": "000000",
    "lines": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 0,
    "yinCount": 6
  },
  "3": {
    "number": 3,
    "name": "水雷屯",
    "lower": "震",
    "upper": "坎",
    "binary": "100010",
    "binaryTopFirst": "010001",
    "lines": [
      1,
      0,
      0,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "4": {
    "number": 4,
    "name": "山水蒙",
    "lower": "坎",
    "upper": "艮",
    "binary": "010001",
    "binaryTopFirst": "100010",
    "lines": [
      0,
      1,
      0,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "5": {
    "number": 5,
    "name": "水天需",
    "lower": "乾",
    "upper": "坎",
    "binary": "111010",
    "binaryTopFirst": "010111",
    "lines": [
      1,
      1,
      1,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "6": {
    "number": 6,
    "name": "天水訟",
    "lower": "坎",
    "upper": "乾",
    "binary": "010111",
    "binaryTopFirst": "111010",
    "lines": [
      0,
      1,
      0,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "7": {
    "number": 7,
    "name": "地水師",
    "lower": "坎",
    "upper": "坤",
    "binary": "010000",
    "binaryTopFirst": "000010",
    "lines": [
      0,
      1,
      0,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 1,
    "yinCount": 5
  },
  "8": {
    "number": 8,
    "name": "水地比",
    "lower": "坤",
    "upper": "坎",
    "binary": "000010",
    "binaryTopFirst": "010000",
    "lines": [
      0,
      0,
      0,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 1,
    "yinCount": 5
  },
  "9": {
    "number": 9,
    "name": "風天小畜",
    "lower": "乾",
    "upper": "巽",
    "binary": "111011",
    "binaryTopFirst": "110111",
    "lines": [
      1,
      1,
      1,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 5,
    "yinCount": 1
  },
  "10": {
    "number": 10,
    "name": "天澤履",
    "lower": "兌",
    "upper": "乾",
    "binary": "110111",
    "binaryTopFirst": "111011",
    "lines": [
      1,
      1,
      0,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 5,
    "yinCount": 1
  },
  "11": {
    "number": 11,
    "name": "地天泰",
    "lower": "乾",
    "upper": "坤",
    "binary": "111000",
    "binaryTopFirst": "000111",
    "lines": [
      1,
      1,
      1,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "12": {
    "number": 12,
    "name": "天地否",
    "lower": "坤",
    "upper": "乾",
    "binary": "000111",
    "binaryTopFirst": "111000",
    "lines": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "13": {
    "number": 13,
    "name": "天火同人",
    "lower": "離",
    "upper": "乾",
    "binary": "101111",
    "binaryTopFirst": "111101",
    "lines": [
      1,
      0,
      1,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 5,
    "yinCount": 1
  },
  "14": {
    "number": 14,
    "name": "火天大有",
    "lower": "乾",
    "upper": "離",
    "binary": "111101",
    "binaryTopFirst": "101111",
    "lines": [
      1,
      1,
      1,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 5,
    "yinCount": 1
  },
  "15": {
    "number": 15,
    "name": "地山謙",
    "lower": "艮",
    "upper": "坤",
    "binary": "001000",
    "binaryTopFirst": "000100",
    "lines": [
      0,
      0,
      1,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 1,
    "yinCount": 5
  },
  "16": {
    "number": 16,
    "name": "雷地豫",
    "lower": "坤",
    "upper": "震",
    "binary": "000100",
    "binaryTopFirst": "001000",
    "lines": [
      0,
      0,
      0,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 1,
    "yinCount": 5
  },
  "17": {
    "number": 17,
    "name": "澤雷隨",
    "lower": "震",
    "upper": "兌",
    "binary": "100110",
    "binaryTopFirst": "011001",
    "lines": [
      1,
      0,
      0,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "18": {
    "number": 18,
    "name": "山風蠱",
    "lower": "巽",
    "upper": "艮",
    "binary": "011001",
    "binaryTopFirst": "100110",
    "lines": [
      0,
      1,
      1,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "19": {
    "number": 19,
    "name": "地澤臨",
    "lower": "兌",
    "upper": "坤",
    "binary": "110000",
    "binaryTopFirst": "000011",
    "lines": [
      1,
      1,
      0,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "20": {
    "number": 20,
    "name": "風地觀",
    "lower": "坤",
    "upper": "巽",
    "binary": "000011",
    "binaryTopFirst": "110000",
    "lines": [
      0,
      0,
      0,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "21": {
    "number": 21,
    "name": "火雷噬嗑",
    "lower": "震",
    "upper": "離",
    "binary": "100101",
    "binaryTopFirst": "101001",
    "lines": [
      1,
      0,
      0,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "22": {
    "number": 22,
    "name": "山火賁",
    "lower": "離",
    "upper": "艮",
    "binary": "101001",
    "binaryTopFirst": "100101",
    "lines": [
      1,
      0,
      1,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "23": {
    "number": 23,
    "name": "山地剝",
    "lower": "坤",
    "upper": "艮",
    "binary": "000001",
    "binaryTopFirst": "100000",
    "lines": [
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 1,
    "yinCount": 5
  },
  "24": {
    "number": 24,
    "name": "地雷復",
    "lower": "震",
    "upper": "坤",
    "binary": "100000",
    "binaryTopFirst": "000001",
    "lines": [
      1,
      0,
      0,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 1,
    "yinCount": 5
  },
  "25": {
    "number": 25,
    "name": "天雷無妄",
    "lower": "震",
    "upper": "乾",
    "binary": "100111",
    "binaryTopFirst": "111001",
    "lines": [
      1,
      0,
      0,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "26": {
    "number": 26,
    "name": "山天大畜",
    "lower": "乾",
    "upper": "艮",
    "binary": "111001",
    "binaryTopFirst": "100111",
    "lines": [
      1,
      1,
      1,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "27": {
    "number": 27,
    "name": "山雷頤",
    "lower": "震",
    "upper": "艮",
    "binary": "100001",
    "binaryTopFirst": "100001",
    "lines": [
      1,
      0,
      0,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "28": {
    "number": 28,
    "name": "澤風大過",
    "lower": "巽",
    "upper": "兌",
    "binary": "011110",
    "binaryTopFirst": "011110",
    "lines": [
      0,
      1,
      1,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "29": {
    "number": 29,
    "name": "坎為水",
    "lower": "坎",
    "upper": "坎",
    "binary": "010010",
    "binaryTopFirst": "010010",
    "lines": [
      0,
      1,
      0,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "30": {
    "number": 30,
    "name": "離為火",
    "lower": "離",
    "upper": "離",
    "binary": "101101",
    "binaryTopFirst": "101101",
    "lines": [
      1,
      0,
      1,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "31": {
    "number": 31,
    "name": "澤山咸",
    "lower": "艮",
    "upper": "兌",
    "binary": "001110",
    "binaryTopFirst": "011100",
    "lines": [
      0,
      0,
      1,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "32": {
    "number": 32,
    "name": "雷風恆",
    "lower": "巽",
    "upper": "震",
    "binary": "011100",
    "binaryTopFirst": "001110",
    "lines": [
      0,
      1,
      1,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "33": {
    "number": 33,
    "name": "天山遯",
    "lower": "艮",
    "upper": "乾",
    "binary": "001111",
    "binaryTopFirst": "111100",
    "lines": [
      0,
      0,
      1,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "34": {
    "number": 34,
    "name": "雷天大壯",
    "lower": "乾",
    "upper": "震",
    "binary": "111100",
    "binaryTopFirst": "001111",
    "lines": [
      1,
      1,
      1,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "35": {
    "number": 35,
    "name": "火地晉",
    "lower": "坤",
    "upper": "離",
    "binary": "000101",
    "binaryTopFirst": "101000",
    "lines": [
      0,
      0,
      0,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "36": {
    "number": 36,
    "name": "地火明夷",
    "lower": "離",
    "upper": "坤",
    "binary": "101000",
    "binaryTopFirst": "000101",
    "lines": [
      1,
      0,
      1,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "37": {
    "number": 37,
    "name": "風火家人",
    "lower": "離",
    "upper": "巽",
    "binary": "101011",
    "binaryTopFirst": "110101",
    "lines": [
      1,
      0,
      1,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "38": {
    "number": 38,
    "name": "火澤睽",
    "lower": "兌",
    "upper": "離",
    "binary": "110101",
    "binaryTopFirst": "101011",
    "lines": [
      1,
      1,
      0,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "39": {
    "number": 39,
    "name": "水山蹇",
    "lower": "艮",
    "upper": "坎",
    "binary": "001010",
    "binaryTopFirst": "010100",
    "lines": [
      0,
      0,
      1,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "40": {
    "number": 40,
    "name": "雷水解",
    "lower": "坎",
    "upper": "震",
    "binary": "010100",
    "binaryTopFirst": "001010",
    "lines": [
      0,
      1,
      0,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "41": {
    "number": 41,
    "name": "山澤損",
    "lower": "兌",
    "upper": "艮",
    "binary": "110001",
    "binaryTopFirst": "100011",
    "lines": [
      1,
      1,
      0,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "42": {
    "number": 42,
    "name": "風雷益",
    "lower": "震",
    "upper": "巽",
    "binary": "100011",
    "binaryTopFirst": "110001",
    "lines": [
      1,
      0,
      0,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "43": {
    "number": 43,
    "name": "澤天夬",
    "lower": "乾",
    "upper": "兌",
    "binary": "111110",
    "binaryTopFirst": "011111",
    "lines": [
      1,
      1,
      1,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 5,
    "yinCount": 1
  },
  "44": {
    "number": 44,
    "name": "天風姤",
    "lower": "巽",
    "upper": "乾",
    "binary": "011111",
    "binaryTopFirst": "111110",
    "lines": [
      0,
      1,
      1,
      1,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 5,
    "yinCount": 1
  },
  "45": {
    "number": 45,
    "name": "澤地萃",
    "lower": "坤",
    "upper": "兌",
    "binary": "000110",
    "binaryTopFirst": "011000",
    "lines": [
      0,
      0,
      0,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "46": {
    "number": 46,
    "name": "地風升",
    "lower": "巽",
    "upper": "坤",
    "binary": "011000",
    "binaryTopFirst": "000110",
    "lines": [
      0,
      1,
      1,
      0,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "47": {
    "number": 47,
    "name": "澤水困",
    "lower": "坎",
    "upper": "兌",
    "binary": "010110",
    "binaryTopFirst": "011010",
    "lines": [
      0,
      1,
      0,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "48": {
    "number": 48,
    "name": "水風井",
    "lower": "巽",
    "upper": "坎",
    "binary": "011010",
    "binaryTopFirst": "010110",
    "lines": [
      0,
      1,
      1,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "49": {
    "number": 49,
    "name": "澤火革",
    "lower": "離",
    "upper": "兌",
    "binary": "101110",
    "binaryTopFirst": "011101",
    "lines": [
      1,
      0,
      1,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "50": {
    "number": 50,
    "name": "火風鼎",
    "lower": "巽",
    "upper": "離",
    "binary": "011101",
    "binaryTopFirst": "101110",
    "lines": [
      0,
      1,
      1,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "51": {
    "number": 51,
    "name": "震為雷",
    "lower": "震",
    "upper": "震",
    "binary": "100100",
    "binaryTopFirst": "001001",
    "lines": [
      1,
      0,
      0,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "52": {
    "number": 52,
    "name": "艮為山",
    "lower": "艮",
    "upper": "艮",
    "binary": "001001",
    "binaryTopFirst": "100100",
    "lines": [
      0,
      0,
      1,
      0,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "53": {
    "number": 53,
    "name": "風山漸",
    "lower": "艮",
    "upper": "巽",
    "binary": "001011",
    "binaryTopFirst": "110100",
    "lines": [
      0,
      0,
      1,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "54": {
    "number": 54,
    "name": "雷澤歸妹",
    "lower": "兌",
    "upper": "震",
    "binary": "110100",
    "binaryTopFirst": "001011",
    "lines": [
      1,
      1,
      0,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "55": {
    "number": 55,
    "name": "雷火豐",
    "lower": "離",
    "upper": "震",
    "binary": "101100",
    "binaryTopFirst": "001101",
    "lines": [
      1,
      0,
      1,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "56": {
    "number": 56,
    "name": "火山旅",
    "lower": "艮",
    "upper": "離",
    "binary": "001101",
    "binaryTopFirst": "101100",
    "lines": [
      0,
      0,
      1,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "57": {
    "number": 57,
    "name": "巽為風",
    "lower": "巽",
    "upper": "巽",
    "binary": "011011",
    "binaryTopFirst": "110110",
    "lines": [
      0,
      1,
      1,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "58": {
    "number": 58,
    "name": "兌為澤",
    "lower": "兌",
    "upper": "兌",
    "binary": "110110",
    "binaryTopFirst": "011011",
    "lines": [
      1,
      1,
      0,
      1,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "59": {
    "number": 59,
    "name": "風水渙",
    "lower": "坎",
    "upper": "巽",
    "binary": "010011",
    "binaryTopFirst": "110010",
    "lines": [
      0,
      1,
      0,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "60": {
    "number": 60,
    "name": "水澤節",
    "lower": "兌",
    "upper": "坎",
    "binary": "110010",
    "binaryTopFirst": "010011",
    "lines": [
      1,
      1,
      0,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "61": {
    "number": 61,
    "name": "風澤中孚",
    "lower": "兌",
    "upper": "巽",
    "binary": "110011",
    "binaryTopFirst": "110011",
    "lines": [
      1,
      1,
      0,
      0,
      1,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 4,
    "yinCount": 2
  },
  "62": {
    "number": 62,
    "name": "雷山小過",
    "lower": "艮",
    "upper": "震",
    "binary": "001100",
    "binaryTopFirst": "001100",
    "lines": [
      0,
      0,
      1,
      1,
      0,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 2,
    "yinCount": 4
  },
  "63": {
    "number": 63,
    "name": "水火既濟",
    "lower": "離",
    "upper": "坎",
    "binary": "101010",
    "binaryTopFirst": "010101",
    "lines": [
      1,
      0,
      1,
      0,
      1,
      0
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  },
  "64": {
    "number": 64,
    "name": "火水未濟",
    "lower": "坎",
    "upper": "離",
    "binary": "010101",
    "binaryTopFirst": "101010",
    "lines": [
      0,
      1,
      0,
      1,
      0,
      1
    ],
    "lineLabels": [
      "初",
      "二",
      "三",
      "四",
      "五",
      "上"
    ],
    "yangCount": 3,
    "yinCount": 3
  }
};

// RAVE_MANDALA_ORDER
const RAVE_MANDALA_ORDER = [
  41,
  19,
  13,
  49,
  30,
  55,
  37,
  63,
  22,
  36,
  25,
  17,
  21,
  51,
  42,
  3,
  27,
  24,
  2,
  23,
  8,
  20,
  16,
  35,
  45,
  12,
  15,
  52,
  39,
  53,
  62,
  56,
  31,
  33,
  7,
  4,
  29,
  59,
  40,
  64,
  47,
  6,
  46,
  18,
  48,
  57,
  32,
  50,
  28,
  44,
  1,
  43,
  14,
  34,
  9,
  5,
  26,
  11,
  10,
  58,
  38,
  54,
  61,
  60
];

// RAVE_MANDALA_WHEEL
const RAVE_MANDALA_WHEEL = [
  {
    "position": 0,
    "gate": 10,
    "hexagram": 10,
    "name": "天澤履",
    "lower": "兌",
    "upper": "乾",
    "binary": "110111",
    "lines": [
      1,
      1,
      0,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 0,
    "sliceDeg": 5.625
  },
  {
    "position": 1,
    "gate": 11,
    "hexagram": 11,
    "name": "地天泰",
    "lower": "乾",
    "upper": "坤",
    "binary": "111000",
    "lines": [
      1,
      1,
      1,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 5.625,
    "sliceDeg": 5.625
  },
  {
    "position": 2,
    "gate": 26,
    "hexagram": 26,
    "name": "山天大畜",
    "lower": "乾",
    "upper": "艮",
    "binary": "111001",
    "lines": [
      1,
      1,
      1,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 11.25,
    "sliceDeg": 5.625
  },
  {
    "position": 3,
    "gate": 5,
    "hexagram": 5,
    "name": "水天需",
    "lower": "乾",
    "upper": "坎",
    "binary": "111010",
    "lines": [
      1,
      1,
      1,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 16.875,
    "sliceDeg": 5.625
  },
  {
    "position": 4,
    "gate": 9,
    "hexagram": 9,
    "name": "風天小畜",
    "lower": "乾",
    "upper": "巽",
    "binary": "111011",
    "lines": [
      1,
      1,
      1,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 22.5,
    "sliceDeg": 5.625
  },
  {
    "position": 5,
    "gate": 34,
    "hexagram": 34,
    "name": "雷天大壯",
    "lower": "乾",
    "upper": "震",
    "binary": "111100",
    "lines": [
      1,
      1,
      1,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 28.125,
    "sliceDeg": 5.625
  },
  {
    "position": 6,
    "gate": 14,
    "hexagram": 14,
    "name": "火天大有",
    "lower": "乾",
    "upper": "離",
    "binary": "111101",
    "lines": [
      1,
      1,
      1,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 33.75,
    "sliceDeg": 5.625
  },
  {
    "position": 7,
    "gate": 43,
    "hexagram": 43,
    "name": "澤天夬",
    "lower": "乾",
    "upper": "兌",
    "binary": "111110",
    "lines": [
      1,
      1,
      1,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 39.375,
    "sliceDeg": 5.625
  },
  {
    "position": 8,
    "gate": 1,
    "hexagram": 1,
    "name": "乾為天",
    "lower": "乾",
    "upper": "乾",
    "binary": "111111",
    "lines": [
      1,
      1,
      1,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 45,
    "sliceDeg": 5.625
  },
  {
    "position": 9,
    "gate": 44,
    "hexagram": 44,
    "name": "天風姤",
    "lower": "巽",
    "upper": "乾",
    "binary": "011111",
    "lines": [
      0,
      1,
      1,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 50.625,
    "sliceDeg": 5.625
  },
  {
    "position": 10,
    "gate": 28,
    "hexagram": 28,
    "name": "澤風大過",
    "lower": "巽",
    "upper": "兌",
    "binary": "011110",
    "lines": [
      0,
      1,
      1,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 56.25,
    "sliceDeg": 5.625
  },
  {
    "position": 11,
    "gate": 50,
    "hexagram": 50,
    "name": "火風鼎",
    "lower": "巽",
    "upper": "離",
    "binary": "011101",
    "lines": [
      0,
      1,
      1,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 61.875,
    "sliceDeg": 5.625
  },
  {
    "position": 12,
    "gate": 32,
    "hexagram": 32,
    "name": "雷風恆",
    "lower": "巽",
    "upper": "震",
    "binary": "011100",
    "lines": [
      0,
      1,
      1,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 67.5,
    "sliceDeg": 5.625
  },
  {
    "position": 13,
    "gate": 57,
    "hexagram": 57,
    "name": "巽為風",
    "lower": "巽",
    "upper": "巽",
    "binary": "011011",
    "lines": [
      0,
      1,
      1,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 73.125,
    "sliceDeg": 5.625
  },
  {
    "position": 14,
    "gate": 48,
    "hexagram": 48,
    "name": "水風井",
    "lower": "巽",
    "upper": "坎",
    "binary": "011010",
    "lines": [
      0,
      1,
      1,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 78.75,
    "sliceDeg": 5.625
  },
  {
    "position": 15,
    "gate": 18,
    "hexagram": 18,
    "name": "山風蠱",
    "lower": "巽",
    "upper": "艮",
    "binary": "011001",
    "lines": [
      0,
      1,
      1,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 84.375,
    "sliceDeg": 5.625
  },
  {
    "position": 16,
    "gate": 46,
    "hexagram": 46,
    "name": "地風升",
    "lower": "巽",
    "upper": "坤",
    "binary": "011000",
    "lines": [
      0,
      1,
      1,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 90,
    "sliceDeg": 5.625
  },
  {
    "position": 17,
    "gate": 6,
    "hexagram": 6,
    "name": "天水訟",
    "lower": "坎",
    "upper": "乾",
    "binary": "010111",
    "lines": [
      0,
      1,
      0,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 95.625,
    "sliceDeg": 5.625
  },
  {
    "position": 18,
    "gate": 47,
    "hexagram": 47,
    "name": "澤水困",
    "lower": "坎",
    "upper": "兌",
    "binary": "010110",
    "lines": [
      0,
      1,
      0,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 101.25,
    "sliceDeg": 5.625
  },
  {
    "position": 19,
    "gate": 64,
    "hexagram": 64,
    "name": "火水未濟",
    "lower": "坎",
    "upper": "離",
    "binary": "010101",
    "lines": [
      0,
      1,
      0,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 106.875,
    "sliceDeg": 5.625
  },
  {
    "position": 20,
    "gate": 40,
    "hexagram": 40,
    "name": "雷水解",
    "lower": "坎",
    "upper": "震",
    "binary": "010100",
    "lines": [
      0,
      1,
      0,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 112.5,
    "sliceDeg": 5.625
  },
  {
    "position": 21,
    "gate": 59,
    "hexagram": 59,
    "name": "風水渙",
    "lower": "坎",
    "upper": "巽",
    "binary": "010011",
    "lines": [
      0,
      1,
      0,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 118.125,
    "sliceDeg": 5.625
  },
  {
    "position": 22,
    "gate": 29,
    "hexagram": 29,
    "name": "坎為水",
    "lower": "坎",
    "upper": "坎",
    "binary": "010010",
    "lines": [
      0,
      1,
      0,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 123.75,
    "sliceDeg": 5.625
  },
  {
    "position": 23,
    "gate": 4,
    "hexagram": 4,
    "name": "山水蒙",
    "lower": "坎",
    "upper": "艮",
    "binary": "010001",
    "lines": [
      0,
      1,
      0,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 129.375,
    "sliceDeg": 5.625
  },
  {
    "position": 24,
    "gate": 7,
    "hexagram": 7,
    "name": "地水師",
    "lower": "坎",
    "upper": "坤",
    "binary": "010000",
    "lines": [
      0,
      1,
      0,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 135,
    "sliceDeg": 5.625
  },
  {
    "position": 25,
    "gate": 33,
    "hexagram": 33,
    "name": "天山遯",
    "lower": "艮",
    "upper": "乾",
    "binary": "001111",
    "lines": [
      0,
      0,
      1,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 140.625,
    "sliceDeg": 5.625
  },
  {
    "position": 26,
    "gate": 31,
    "hexagram": 31,
    "name": "澤山咸",
    "lower": "艮",
    "upper": "兌",
    "binary": "001110",
    "lines": [
      0,
      0,
      1,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 146.25,
    "sliceDeg": 5.625
  },
  {
    "position": 27,
    "gate": 56,
    "hexagram": 56,
    "name": "火山旅",
    "lower": "艮",
    "upper": "離",
    "binary": "001101",
    "lines": [
      0,
      0,
      1,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 151.875,
    "sliceDeg": 5.625
  },
  {
    "position": 28,
    "gate": 62,
    "hexagram": 62,
    "name": "雷山小過",
    "lower": "艮",
    "upper": "震",
    "binary": "001100",
    "lines": [
      0,
      0,
      1,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 157.5,
    "sliceDeg": 5.625
  },
  {
    "position": 29,
    "gate": 53,
    "hexagram": 53,
    "name": "風山漸",
    "lower": "艮",
    "upper": "巽",
    "binary": "001011",
    "lines": [
      0,
      0,
      1,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 163.125,
    "sliceDeg": 5.625
  },
  {
    "position": 30,
    "gate": 39,
    "hexagram": 39,
    "name": "水山蹇",
    "lower": "艮",
    "upper": "坎",
    "binary": "001010",
    "lines": [
      0,
      0,
      1,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 168.75,
    "sliceDeg": 5.625
  },
  {
    "position": 31,
    "gate": 52,
    "hexagram": 52,
    "name": "艮為山",
    "lower": "艮",
    "upper": "艮",
    "binary": "001001",
    "lines": [
      0,
      0,
      1,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 174.375,
    "sliceDeg": 5.625
  },
  {
    "position": 32,
    "gate": 15,
    "hexagram": 15,
    "name": "地山謙",
    "lower": "艮",
    "upper": "坤",
    "binary": "001000",
    "lines": [
      0,
      0,
      1,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 180,
    "sliceDeg": 5.625
  },
  {
    "position": 33,
    "gate": 12,
    "hexagram": 12,
    "name": "天地否",
    "lower": "坤",
    "upper": "乾",
    "binary": "000111",
    "lines": [
      0,
      0,
      0,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 185.625,
    "sliceDeg": 5.625
  },
  {
    "position": 34,
    "gate": 45,
    "hexagram": 45,
    "name": "澤地萃",
    "lower": "坤",
    "upper": "兌",
    "binary": "000110",
    "lines": [
      0,
      0,
      0,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 191.25,
    "sliceDeg": 5.625
  },
  {
    "position": 35,
    "gate": 35,
    "hexagram": 35,
    "name": "火地晉",
    "lower": "坤",
    "upper": "離",
    "binary": "000101",
    "lines": [
      0,
      0,
      0,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 196.875,
    "sliceDeg": 5.625
  },
  {
    "position": 36,
    "gate": 16,
    "hexagram": 16,
    "name": "雷地豫",
    "lower": "坤",
    "upper": "震",
    "binary": "000100",
    "lines": [
      0,
      0,
      0,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 202.5,
    "sliceDeg": 5.625
  },
  {
    "position": 37,
    "gate": 20,
    "hexagram": 20,
    "name": "風地觀",
    "lower": "坤",
    "upper": "巽",
    "binary": "000011",
    "lines": [
      0,
      0,
      0,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 208.125,
    "sliceDeg": 5.625
  },
  {
    "position": 38,
    "gate": 8,
    "hexagram": 8,
    "name": "水地比",
    "lower": "坤",
    "upper": "坎",
    "binary": "000010",
    "lines": [
      0,
      0,
      0,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 213.75,
    "sliceDeg": 5.625
  },
  {
    "position": 39,
    "gate": 23,
    "hexagram": 23,
    "name": "山地剝",
    "lower": "坤",
    "upper": "艮",
    "binary": "000001",
    "lines": [
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 219.375,
    "sliceDeg": 5.625
  },
  {
    "position": 40,
    "gate": 2,
    "hexagram": 2,
    "name": "坤為地",
    "lower": "坤",
    "upper": "坤",
    "binary": "000000",
    "lines": [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 225,
    "sliceDeg": 5.625
  },
  {
    "position": 41,
    "gate": 24,
    "hexagram": 24,
    "name": "地雷復",
    "lower": "震",
    "upper": "坤",
    "binary": "100000",
    "lines": [
      1,
      0,
      0,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 230.625,
    "sliceDeg": 5.625
  },
  {
    "position": 42,
    "gate": 27,
    "hexagram": 27,
    "name": "山雷頤",
    "lower": "震",
    "upper": "艮",
    "binary": "100001",
    "lines": [
      1,
      0,
      0,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 236.25,
    "sliceDeg": 5.625
  },
  {
    "position": 43,
    "gate": 3,
    "hexagram": 3,
    "name": "水雷屯",
    "lower": "震",
    "upper": "坎",
    "binary": "100010",
    "lines": [
      1,
      0,
      0,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 241.875,
    "sliceDeg": 5.625
  },
  {
    "position": 44,
    "gate": 42,
    "hexagram": 42,
    "name": "風雷益",
    "lower": "震",
    "upper": "巽",
    "binary": "100011",
    "lines": [
      1,
      0,
      0,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 247.5,
    "sliceDeg": 5.625
  },
  {
    "position": 45,
    "gate": 51,
    "hexagram": 51,
    "name": "震為雷",
    "lower": "震",
    "upper": "震",
    "binary": "100100",
    "lines": [
      1,
      0,
      0,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 253.125,
    "sliceDeg": 5.625
  },
  {
    "position": 46,
    "gate": 21,
    "hexagram": 21,
    "name": "火雷噬嗑",
    "lower": "震",
    "upper": "離",
    "binary": "100101",
    "lines": [
      1,
      0,
      0,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 258.75,
    "sliceDeg": 5.625
  },
  {
    "position": 47,
    "gate": 17,
    "hexagram": 17,
    "name": "澤雷隨",
    "lower": "震",
    "upper": "兌",
    "binary": "100110",
    "lines": [
      1,
      0,
      0,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 264.375,
    "sliceDeg": 5.625
  },
  {
    "position": 48,
    "gate": 25,
    "hexagram": 25,
    "name": "天雷無妄",
    "lower": "震",
    "upper": "乾",
    "binary": "100111",
    "lines": [
      1,
      0,
      0,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 270,
    "sliceDeg": 5.625
  },
  {
    "position": 49,
    "gate": 36,
    "hexagram": 36,
    "name": "地火明夷",
    "lower": "離",
    "upper": "坤",
    "binary": "101000",
    "lines": [
      1,
      0,
      1,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 275.625,
    "sliceDeg": 5.625
  },
  {
    "position": 50,
    "gate": 22,
    "hexagram": 22,
    "name": "山火賁",
    "lower": "離",
    "upper": "艮",
    "binary": "101001",
    "lines": [
      1,
      0,
      1,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 281.25,
    "sliceDeg": 5.625
  },
  {
    "position": 51,
    "gate": 63,
    "hexagram": 63,
    "name": "水火既濟",
    "lower": "離",
    "upper": "坎",
    "binary": "101010",
    "lines": [
      1,
      0,
      1,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 286.875,
    "sliceDeg": 5.625
  },
  {
    "position": 52,
    "gate": 37,
    "hexagram": 37,
    "name": "風火家人",
    "lower": "離",
    "upper": "巽",
    "binary": "101011",
    "lines": [
      1,
      0,
      1,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 292.5,
    "sliceDeg": 5.625
  },
  {
    "position": 53,
    "gate": 55,
    "hexagram": 55,
    "name": "雷火豐",
    "lower": "離",
    "upper": "震",
    "binary": "101100",
    "lines": [
      1,
      0,
      1,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 298.125,
    "sliceDeg": 5.625
  },
  {
    "position": 54,
    "gate": 30,
    "hexagram": 30,
    "name": "離為火",
    "lower": "離",
    "upper": "離",
    "binary": "101101",
    "lines": [
      1,
      0,
      1,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 303.75,
    "sliceDeg": 5.625
  },
  {
    "position": 55,
    "gate": 49,
    "hexagram": 49,
    "name": "澤火革",
    "lower": "離",
    "upper": "兌",
    "binary": "101110",
    "lines": [
      1,
      0,
      1,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 309.375,
    "sliceDeg": 5.625
  },
  {
    "position": 56,
    "gate": 13,
    "hexagram": 13,
    "name": "天火同人",
    "lower": "離",
    "upper": "乾",
    "binary": "101111",
    "lines": [
      1,
      0,
      1,
      1,
      1,
      1
    ],
    "angleFromTopDeg": 315,
    "sliceDeg": 5.625
  },
  {
    "position": 57,
    "gate": 19,
    "hexagram": 19,
    "name": "地澤臨",
    "lower": "兌",
    "upper": "坤",
    "binary": "110000",
    "lines": [
      1,
      1,
      0,
      0,
      0,
      0
    ],
    "angleFromTopDeg": 320.625,
    "sliceDeg": 5.625
  },
  {
    "position": 58,
    "gate": 41,
    "hexagram": 41,
    "name": "山澤損",
    "lower": "兌",
    "upper": "艮",
    "binary": "110001",
    "lines": [
      1,
      1,
      0,
      0,
      0,
      1
    ],
    "angleFromTopDeg": 326.25,
    "sliceDeg": 5.625
  },
  {
    "position": 59,
    "gate": 60,
    "hexagram": 60,
    "name": "水澤節",
    "lower": "兌",
    "upper": "坎",
    "binary": "110010",
    "lines": [
      1,
      1,
      0,
      0,
      1,
      0
    ],
    "angleFromTopDeg": 331.875,
    "sliceDeg": 5.625
  },
  {
    "position": 60,
    "gate": 61,
    "hexagram": 61,
    "name": "風澤中孚",
    "lower": "兌",
    "upper": "巽",
    "binary": "110011",
    "lines": [
      1,
      1,
      0,
      0,
      1,
      1
    ],
    "angleFromTopDeg": 337.5,
    "sliceDeg": 5.625
  },
  {
    "position": 61,
    "gate": 54,
    "hexagram": 54,
    "name": "雷澤歸妹",
    "lower": "兌",
    "upper": "震",
    "binary": "110100",
    "lines": [
      1,
      1,
      0,
      1,
      0,
      0
    ],
    "angleFromTopDeg": 343.125,
    "sliceDeg": 5.625
  },
  {
    "position": 62,
    "gate": 38,
    "hexagram": 38,
    "name": "火澤睽",
    "lower": "兌",
    "upper": "離",
    "binary": "110101",
    "lines": [
      1,
      1,
      0,
      1,
      0,
      1
    ],
    "angleFromTopDeg": 348.75,
    "sliceDeg": 5.625
  },
  {
    "position": 63,
    "gate": 58,
    "hexagram": 58,
    "name": "兌為澤",
    "lower": "兌",
    "upper": "兌",
    "binary": "110110",
    "lines": [
      1,
      1,
      0,
      1,
      1,
      0
    ],
    "angleFromTopDeg": 354.375,
    "sliceDeg": 5.625
  }
];

// MANDALA_ANCHOR
const MANDALA_ANCHOR = {
  "position": 0,
  "gate": 10,
  "hexagram": 10,
  "name": "天澤履",
  "binary": "110111",
  "at": "12點鐘頂點",
  "direction": "clockwise",
  "sliceDeg": 5.625
};













if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GENE_KEYS_64,
    SPHERE_LINE_TAGS,
    SACRED_MANDALA_COORDS,
    ACTIVATION_SEQUENCE_COORDS,
    VENUS_SEQUENCE_COORDS,
    PEARL_SEQUENCE_COORDS,
    STAR_PEARL_COORDS,
    GOLDEN_PATHWAYS,
    SUB_SEQUENCE_PATHWAYS,
    HEXAGRAM_MATRIX_64,
    RAVE_MANDALA_ORDER,
    RAVE_MANDALA_WHEEL,
    MANDALA_ANCHOR
  };
}

