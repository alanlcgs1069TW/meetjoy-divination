export interface SavedChart {
  id: string;
  name: string;
  solarDate: string;    // 'YYYY-M-D'
  timeIndex: number;    // 0–11 = 子–亥, 12 = 晚子時
  gender: 'male' | 'female';
  multiBirthOrder?: 2 | 3 | 4;  // 同時辰多胞胎胎次：2=遷移, 3=兄弟, 4=僕役 為命宮
  category?: string;
  notes?: string;       // 自由筆記，純文字，≤1000 字
  alias?: string;       // 隱藏分享時的自訂外號（取代隨機代號）；彩蛋：隱藏狀態點代號可改。localStorage + Supabase 同步
  updatedAt: number;    // Date.now()
  deletedAt?: number;   // soft delete
}
