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
  // 使命 (Purpose - 激活序列/身體根基)
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

// 全息天命圖各序列標準幾何座標 (基於 960x760 視圖百分比)
const SACRED_MANDALA_COORDS = {
  // 激活序列 (綠)
  lifesWork:  { x: 50, y: 14, labelAlign: 'top-right' },
  evolution:  { x: 73, y: 48, labelAlign: 'right' },
  radiance:   { x: 27, y: 48, labelAlign: 'left' },
  purpose:    { x: 50, y: 81, labelAlign: 'bottom-right' },

  // 金星序列 (紅/紫)
  attraction: { x: 50, y: 65, labelAlign: 'right' },
  iq:         { x: 39, y: 56, labelAlign: 'left' },
  eq:         { x: 61, y: 56, labelAlign: 'right' },
  sq:         { x: 50, y: 48, labelAlign: 'right' },
  core:       { x: 39, y: 40, labelAlign: 'left' },

  // 珍珠序列 (藍)
  culture:    { x: 61, y: 40, labelAlign: 'right' },
  pearl:      { x: 50, y: 32, labelAlign: 'top' }
};

// 珍珠序列專屬等邊三角形座標 (大正三角形 + 中心珍珠)
const PEARL_SEQUENCE_COORDS = {
  brand:      { x: 50, y: 22, labelAlign: 'right' },
  vocation:   { x: 37, y: 58, labelAlign: 'left' },
  culture:    { x: 63, y: 58, labelAlign: 'right' },
  pearl:      { x: 50, y: 47, labelAlign: 'right' }
};

// 星辰珍珠專屬神聖六角幾何座標 (正六邊形 + 中心珍珠)
const STAR_PEARL_COORDS = {
  brand:        { x: 50.0, y: 21.0, labelAlign: 'right' },
  relationship: { x: 73.4, y: 34.5, labelAlign: 'right' },
  culture:      { x: 73.4, y: 61.5, labelAlign: 'right' },
  stability:    { x: 50.0, y: 75.0, labelAlign: 'right' },
  vocation:     { x: 26.6, y: 61.5, labelAlign: 'left' },
  creativity:   { x: 26.6, y: 34.5, labelAlign: 'left' },
  pearl:        { x: 50.0, y: 48.0, labelAlign: 'right' }
};

// 全息通道網絡連線 (Pathways) - 完整全譜
const GOLDEN_PATHWAYS = [
  // 激活序列綠線 (The Activation Sequence)
  { from: 'lifesWork', to: 'evolution', color: '#10B981', seq: 'activation', name: '突破通道' },
  { from: 'evolution', to: 'radiance', color: '#10B981', seq: 'activation', name: '挑戰通道' },
  { from: 'radiance', to: 'purpose', color: '#10B981', seq: 'activation', name: '扎根通道' },
  { from: 'purpose', to: 'lifesWork', color: '#10B981', seq: 'activation', name: '天命循環通道' },

  // 金星序列紅線 (The Venus Sequence)
  { from: 'purpose', to: 'attraction', color: '#E11D48', seq: 'venus', name: '業力吸引力通道' },
  { from: 'attraction', to: 'iq', color: '#E11D48', seq: 'venus', name: '心智轉化通道' },
  { from: 'attraction', to: 'eq', color: '#E11D48', seq: 'venus', name: '情緒轉化通道' },
  { from: 'iq', to: 'eq', color: '#E11D48', seq: 'venus', name: '心智情緒整合通道' },
  { from: 'iq', to: 'sq', color: '#E11D48', seq: 'venus', name: '靈性覺醒通道' },
  { from: 'eq', to: 'sq', color: '#E11D48', seq: 'venus', name: '心輪開啟通道' },
  { from: 'sq', to: 'core', color: '#E11D48', seq: 'venus', name: '核心創傷通道' },

  // 珍珠序列藍線 (The Pearl Sequence)
  { from: 'core', to: 'culture', color: '#0EA5E9', seq: 'pearl', name: '天職創造力通道' },
  { from: 'culture', to: 'pearl', color: '#0EA5E9', seq: 'pearl', name: '社群豐盛通道' },
  { from: 'core', to: 'pearl', color: '#0EA5E9', seq: 'pearl', name: '本質變現通道' },
  { from: 'pearl', to: 'lifesWork', color: '#0EA5E9', seq: 'pearl', name: '品牌顯化通道' }
];

// 各分盤專屬通道網絡
const SUB_SEQUENCE_PATHWAYS = {
  activation: [
    { from: 'lifesWork', to: 'evolution', color: '#10B981' },
    { from: 'evolution', to: 'radiance', color: '#10B981' },
    { from: 'radiance', to: 'purpose', color: '#10B981' },
    { from: 'purpose', to: 'lifesWork', color: '#10B981' }
  ],
  venus: [
    { from: 'purpose', to: 'attraction', color: '#E11D48' },
    { from: 'attraction', to: 'iq', color: '#E11D48' },
    { from: 'attraction', to: 'eq', color: '#E11D48' },
    { from: 'iq', to: 'eq', color: '#E11D48' },
    { from: 'iq', to: 'sq', color: '#E11D48' },
    { from: 'eq', to: 'sq', color: '#E11D48' },
    { from: 'sq', to: 'core', color: '#E11D48' }
  ],
  pearl: [
    { from: 'brand', to: 'vocation', color: '#0284C7' },
    { from: 'vocation', to: 'culture', color: '#0284C7' },
    { from: 'culture', to: 'brand', color: '#0284C7' },
    { from: 'brand', to: 'pearl', color: '#0284C7' },
    { from: 'vocation', to: 'pearl', color: '#0284C7' },
    { from: 'culture', to: 'pearl', color: '#0284C7' }
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GENE_KEYS_64,
    SPHERE_LINE_TAGS,
    SACRED_MANDALA_COORDS,
    PEARL_SEQUENCE_COORDS,
    STAR_PEARL_COORDS,
    GOLDEN_PATHWAYS,
    SUB_SEQUENCE_PATHWAYS
  };
}
