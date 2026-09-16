import type { SavedChart } from '../types/savedChart';

const KEY = 'ziwei-charts';
const UNIVERSAL_KEY = 'mj_universal_profiles';

export const DEFAULT_CATEGORIES = ['自己', '家人', '朋友', '客戶', '名人'];
const CUSTOM_CATS_KEY = 'ziwei-custom-categories';

export function getCustomCategories(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) ?? 'null');
    if (Array.isArray(saved)) return saved;
  } catch {}
  return [];
}

export function saveCustomCategories(cats: string[]): void {
  localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(cats));
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function birthTimeToTimeIndex(birthTime?: string): number {
  if (!birthTime) return 6; // 預設午時
  const parts = birthTime.split(':');
  const h = parseInt(parts[0], 10) || 0;
  if (h === 23) return 12; // 晚子時
  if (h === 0) return 0;   // 早子時
  return Math.floor((h + 1) / 2) % 12;
}

export function timeIndexToBirthTime(timeIndex: number): string {
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23];
  const h = hours[timeIndex] !== undefined ? hours[timeIndex] : 12;
  const mm = (timeIndex === 0 || timeIndex === 12) ? '30' : '00';
  return `${String(h).padStart(2, '0')}:${mm}`;
}

export function profileToSavedChart(p: any): SavedChart {
  const timeIdx = (p.timeIndex !== undefined && p.timeIndex !== null)
    ? Number(p.timeIndex)
    : birthTimeToTimeIndex(p.birthTime);

  const solar = (p.birthDate || p.solarDate || '1990-01-01').trim();
  const gender = (p.gender === 'female' || p.gender === 'Female') ? 'female' : 'male';

  return {
    id: p.id || generateId(),
    name: p.name || '未命名',
    solarDate: solar,
    timeIndex: timeIdx,
    gender,
    category: p.category || '自己',
    notes: p.notes || '',
    updatedAt: Number(p.updatedAt) || Date.now(),
    deletedAt: p.deletedAt ? Number(p.deletedAt) : undefined,
  };
}

export function savedChartToProfile(c: SavedChart): any {
  return {
    id: c.id,
    name: c.name,
    birthDate: c.solarDate,
    solarDate: c.solarDate,
    birthTime: timeIndexToBirthTime(c.timeIndex),
    timeIndex: c.timeIndex,
    gender: c.gender,
    category: c.category || '自己',
    notes: c.notes || '',
    updatedAt: c.updatedAt || Date.now(),
  };
}

export function getAllCharts(): SavedChart[] {
  const chartMap = new Map<string, SavedChart>();

  // 1. 讀取全站通用命盤庫 mj_universal_profiles
  try {
    const rawUniv = localStorage.getItem(UNIVERSAL_KEY);
    if (rawUniv) {
      const univ = JSON.parse(rawUniv);
      if (Array.isArray(univ)) {
        for (const p of univ) {
          if (!p || !p.name) continue;
          const chart = profileToSavedChart(p);
          chartMap.set(chart.id, chart);
        }
      }
    }
  } catch (e) {
    console.warn('[Ziwei] Failed reading universal profiles:', e);
  }

  // 2. 讀取紫微本地 ziwei-charts 並進行智慧雙向合併（按 updatedAt 最新者勝）
  try {
    const rawZw = localStorage.getItem(KEY);
    if (rawZw) {
      const zwList: SavedChart[] = JSON.parse(rawZw);
      if (Array.isArray(zwList)) {
        for (const c of zwList) {
          if (!c || !c.id) continue;
          const existing = chartMap.get(c.id);
          if (!existing || (c.updatedAt && c.updatedAt >= existing.updatedAt)) {
            chartMap.set(c.id, c);
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Ziwei] Failed reading ziwei-charts:', e);
  }

  return Array.from(chartMap.values());
}

export function getActiveCharts(): SavedChart[] {
  return getAllCharts().filter(c => !c.deletedAt);
}

export function upsertChart(chart: SavedChart): void {
  // 1. 存入 ziwei-charts
  const charts = getAllCharts().filter(c => c.id !== chart.id);
  const updatedCharts = [...charts, chart];
  localStorage.setItem(KEY, JSON.stringify(updatedCharts));

  // 2. 存入全站通用庫 mj_universal_profiles
  const profileItem = savedChartToProfile(chart);
  try {
    const rawUniv = localStorage.getItem(UNIVERSAL_KEY);
    let univ = rawUniv ? JSON.parse(rawUniv) : [];
    if (!Array.isArray(univ)) univ = [];
    univ = univ.filter((p: any) => p.id !== chart.id);
    univ.push(profileItem);
    localStorage.setItem(UNIVERSAL_KEY, JSON.stringify(univ));
  } catch (e) {
    console.warn('[Ziwei] Failed writing universal profile:', e);
  }

  // 3. 呼叫全站 API（若有掛載 MeetJoyProfiles）
  if (typeof window !== 'undefined') {
    const mjProfiles = (window as any).MeetJoyProfiles;
    if (mjProfiles && typeof mjProfiles.saveProfile === 'function') {
      try {
        mjProfiles.saveProfile(profileItem);
      } catch (e) {}
    }

    // 4. 同步雲端 KV 備份（已登入狀態）
    const rawUser = localStorage.getItem('mj_member_user') || localStorage.getItem('ziwei-user');
    if (rawUser) {
      try {
        const userObj = JSON.parse(rawUser);
        if (userObj && (userObj.email || userObj.id)) {
          fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userObj.email,
              user_id: userObj.id,
              profile: profileItem,
              action: 'save'
            })
          }).catch(() => {});
        }
      } catch (e) {}
    }

    // 5. 分發全域同步事件，更新頂部計數器與全站列表
    window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: profileItem }));
    window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated', { detail: profileItem }));
  }
}

export function softDeleteChart(id: string): void {
  // 1. 從 ziwei-charts 中移除
  const charts = getAllCharts().filter(c => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(charts));

  // 2. 從 mj_universal_profiles 徹底移除
  let activeProfiles: any[] = [];
  try {
    const rawUniv = localStorage.getItem(UNIVERSAL_KEY);
    if (rawUniv) {
      const univ = JSON.parse(rawUniv);
      if (Array.isArray(univ)) {
        activeProfiles = univ.filter((p: any) => p.id !== id);
        localStorage.setItem(UNIVERSAL_KEY, JSON.stringify(activeProfiles));
      }
    }
  } catch (e) {
    console.warn('[Ziwei] Failed deleting from universal profiles:', e);
  }

  // 3. 呼叫全站 API（若有掛載 MeetJoyProfiles）
  if (typeof window !== 'undefined') {
    const mjProfiles = (window as any).MeetJoyProfiles;
    if (mjProfiles && typeof mjProfiles.deleteProfile === 'function') {
      try {
        mjProfiles.deleteProfile(id);
      } catch (e) {}
    }

    // 4. 同步至雲端 KV
    const rawUser = localStorage.getItem('mj_member_user') || localStorage.getItem('ziwei-user');
    if (rawUser) {
      try {
        const userObj = JSON.parse(rawUser);
        if (userObj && (userObj.email || userObj.id)) {
          fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userObj.email,
              user_id: userObj.id,
              profiles: activeProfiles,
              action: 'replace'
            })
          }).catch(() => {});
        }
      } catch (e) {}
    }

    // 5. 分發全域事件：通知頂部計數器（立即更新計數！）與其他頁面
    window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: { id, deleted: true } }));
    window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated', { detail: { id, deleted: true } }));
  }
}

export function saveAllCharts(charts: SavedChart[]): void {
  localStorage.setItem(KEY, JSON.stringify(charts));
  const profiles = charts.map(savedChartToProfile);
  localStorage.setItem(UNIVERSAL_KEY, JSON.stringify(profiles));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mj-profiles-changed'));
    window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated'));
  }
}

export function getLastSyncTime(): number | null {
  const v = localStorage.getItem('ziwei-last-sync');
  return v ? Number(v) : null;
}

export function setLastSyncTime(ts: number): void {
  localStorage.setItem('ziwei-last-sync', String(ts));
}

