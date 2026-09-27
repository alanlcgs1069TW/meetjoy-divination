// 進階模式「高階顯示」cheat sheet 用：十二地支的 陰陽 / 五行＋河圖數 / 方位。
// 資料依課堂參考表（2026-09-16）：
// - 陰陽：子寅辰午申戌 +、丑卯巳未酉亥 −
// - 五行數：河圖生成數（亥1 子6、寅3 卯8、巳2 午7、申4 酉9、辰戌5、丑未 0——依用戶指示寫 0 不寫 10）
// - 方位：八方位去掉「偏X」；四正 子北／午南／卯東／酉西，四隅兩支共用一角
//   （2026-09-16 決定卡片只顯示四正，四隅留空；資料仍保留完整八方位）

export interface BranchInfo {
  yinYang: '+' | '−';
  element: string;    // 中文五行
  elementEn: string;  // 英文／拼音模式共用
  number: number;
  dir: string;
  dirEn: string;
}

export const BRANCH_INFO: Record<string, BranchInfo> = {
  '子': { yinYang: '+', element: '水', elementEn: 'Water', number: 6, dir: '北',   dirEn: 'N'  },
  '丑': { yinYang: '−', element: '土', elementEn: 'Earth', number: 0, dir: '東北', dirEn: 'NE' },
  '寅': { yinYang: '+', element: '木', elementEn: 'Wood',  number: 3, dir: '東北', dirEn: 'NE' },
  '卯': { yinYang: '−', element: '木', elementEn: 'Wood',  number: 8, dir: '東',   dirEn: 'E'  },
  '辰': { yinYang: '+', element: '土', elementEn: 'Earth', number: 5, dir: '東南', dirEn: 'SE' },
  '巳': { yinYang: '−', element: '火', elementEn: 'Fire',  number: 2, dir: '東南', dirEn: 'SE' },
  '午': { yinYang: '+', element: '火', elementEn: 'Fire',  number: 7, dir: '南',   dirEn: 'S'  },
  '未': { yinYang: '−', element: '土', elementEn: 'Earth', number: 0, dir: '西南', dirEn: 'SW' },
  '申': { yinYang: '+', element: '金', elementEn: 'Metal', number: 4, dir: '西南', dirEn: 'SW' },
  '酉': { yinYang: '−', element: '金', elementEn: 'Metal', number: 9, dir: '西',   dirEn: 'W'  },
  '戌': { yinYang: '+', element: '土', elementEn: 'Earth', number: 5, dir: '西北', dirEn: 'NW' },
  '亥': { yinYang: '−', element: '水', elementEn: 'Water', number: 1, dir: '西北', dirEn: 'NW' },
};
