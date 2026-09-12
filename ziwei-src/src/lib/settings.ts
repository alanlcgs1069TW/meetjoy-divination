import { supabase } from './supabase';

/**
 * 使用者偏好設定（盤面預設等）。
 * 未登入：只存 localStorage。登入後按「備份同步」會與雲端雙向合併（last-write-wins by updatedAt）。
 */
export interface UserSettings {
  defaultFeixing: boolean; // 飛化上色 預設
  defaultZihua: boolean;   // 自化箭頭 預設
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultFeixing: false,
  defaultZihua: true,
};

const KEY      = 'ziwei-settings';
const TS_KEY   = 'ziwei-settings-updated';
// 舊版逐項 key（v1）→ 首次讀取時併入新格式，之後不再使用
const OLD_FEIXING = 'ziwei-default-feixing';
const OLD_ZIHUA   = 'ziwei-default-zihua';

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* 壞資料 → 用預設 */ }
  // 舊格式遷移（僅在新 key 不存在時）
  const old: Partial<UserSettings> = {};
  const f = localStorage.getItem(OLD_FEIXING);
  const z = localStorage.getItem(OLD_ZIHUA);
  if (f !== null) old.defaultFeixing = f === '1';
  if (z !== null) old.defaultZihua   = z !== '0';
  return { ...DEFAULT_SETTINGS, ...old };
}

export function getSettingsUpdatedAt(): number {
  const v = localStorage.getItem(TS_KEY);
  return v ? Number(v) : 0;
}

export function saveSettings(next: UserSettings, updatedAt = Date.now()): void {
  localStorage.setItem(KEY, JSON.stringify(next));
  localStorage.setItem(TS_KEY, String(updatedAt));
  // 舊 key 清掉，避免兩份來源不一致
  localStorage.removeItem(OLD_FEIXING);
  localStorage.removeItem(OLD_ZIHUA);
}

/**
 * 與雲端雙向同步。回傳合併後的設定（若伺服器較新，呼叫端需以此更新畫面）。
 * 與 syncCharts 同規則：以 updatedAt 比較，相同時間戳偏好伺服器。
 */
export async function syncSettings(): Promise<UserSettings> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const localSettings = getSettings();
  const localTs = getSettingsUpdatedAt();

  const { data: row, error } = await supabase
    .from('user_settings')
    .select('settings, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;

  const serverTs = row?.updated_at ?? 0;

  // 伺服器較新（或同時間）→ 採用伺服器版本
  if (row && serverTs >= localTs) {
    const merged = { ...DEFAULT_SETTINGS, ...(row.settings as Partial<UserSettings>) };
    saveSettings(merged, serverTs);
    return merged;
  }

  // 本地較新（或雲端尚無資料）→ 上傳
  const ts = localTs || Date.now();
  const { error: upErr } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, settings: localSettings, updated_at: ts });
  if (upErr) throw upErr;
  saveSettings(localSettings, ts);
  return localSettings;
}
