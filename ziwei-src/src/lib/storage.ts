import type { SavedChart } from '../types/savedChart';

const KEY = 'ziwei-charts';

export const DEFAULT_CATEGORIES = ['自己', '家人', '朋友', '客戶', '名人', '紫占'];

// 預設分類的顯示文字（存檔值固定中文，顯示依語言翻）；自訂分類原樣顯示
const CAT_LABELS: Record<string, Record<string, string>> = {
  '自己': { 'zh-TW': '自己', 'zh-CN': '自己', 'en': 'Me' },
  '家人': { 'zh-TW': '家人', 'zh-CN': '家人', 'en': 'Family' },
  '朋友': { 'zh-TW': '朋友', 'zh-CN': '朋友', 'en': 'Friends' },
  '客戶': { 'zh-TW': '客戶', 'zh-CN': '客户', 'en': 'Clients' },
  '名人': { 'zh-TW': '名人', 'zh-CN': '名人', 'en': 'Celebrities' },
  '紫占': { 'zh-TW': '紫占', 'zh-CN': '紫占', 'en': 'Divination' },
};
export function catLabel(cat: string, locale: string): string {
  return CAT_LABELS[cat]?.[locale] ?? cat;
}
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

export function timeToTimeIndex(timeStr?: string): number {
  if (!timeStr) return 6;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10);
  if (isNaN(h)) return 6;
  if (h === 23) return 12; // 晚子時
  if (h === 0) return 0;   // 早子時
  return Math.floor((h + 1) / 2);
}

export function timeIndexToDefaultTime(idx: number): string {
  const times = ['00:30', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '23:30'];
  return times[idx] ?? '12:00';
}

export function getMeetJoyUser(): { name?: string; email?: string; isAdmin?: boolean } | null {
  if (typeof window === 'undefined') return null;
  try {
    if ((window as any).MeetJoyAuth?.getUser) {
      return (window as any).MeetJoyAuth.getUser();
    }
    const raw = localStorage.getItem('mj_member_user');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function openMeetJoyLoginModal(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).MeetJoyAuth?.showLoginModal) {
    (window as any).MeetJoyAuth.showLoginModal();
  } else {
    window.location.href = 'https://meetjoy.net/my-account/';
  }
}

export function syncMeetJoyCloud(): void {
  if (typeof window === 'undefined') return;
  if ((window as any).MeetJoyProfiles?.syncWithCloud) {
    (window as any).MeetJoyProfiles.syncWithCloud(false);
  }
}

export function getAllCharts(): SavedChart[] {
  let localCharts: SavedChart[] = [];
  try {
    localCharts = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    localCharts = [];
  }

  // 雙向融合全站通用命盤庫 (MeetJoy Universal Profiles Hub)
  try {
    let universalList: any[] = [];
    if (typeof window !== 'undefined' && (window as any).MeetJoyProfiles?.getAll) {
      universalList = (window as any).MeetJoyProfiles.getAll();
    } else if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('mj_universal_profiles');
      if (raw) universalList = JSON.parse(raw);
    }

    if (Array.isArray(universalList) && universalList.length > 0) {
      const map = new Map<string, SavedChart>();
      localCharts.forEach(c => map.set(c.id, c));

      let changed = false;
      universalList.forEach(p => {
        if (!p || !p.id || !p.name) return;
        const bDate = p.birthDate || p.solarDate;
        if (!bDate) return;

        const existing = map.get(p.id);
        if (!existing) {
          const timeIdx = p.timeIndex !== undefined ? Number(p.timeIndex) : timeToTimeIndex(p.birthTime);
          const newChart: SavedChart = {
            id: p.id,
            name: p.name,
            solarDate: bDate,
            birthTime: p.birthTime || timeIndexToDefaultTime(timeIdx),
            birthCity: p.birthCity || 'tw_taipei',
            timeIndex: timeIdx,
            gender: p.gender === 'male' || p.gender === '乾造' ? 'male' : 'female',
            category: p.category || '自己',
            notes: p.notes || '',
            updatedAt: p.updatedAt || Date.now(),
            deletedAt: p.deletedAt,
          };
          map.set(p.id, newChart);
          localCharts.push(newChart);
          changed = true;
        } else if ((p.updatedAt || 0) > (existing.updatedAt || 0)) {
          existing.name = p.name;
          existing.solarDate = bDate;
          if (p.birthTime) existing.birthTime = p.birthTime;
          if (p.timeIndex !== undefined) existing.timeIndex = Number(p.timeIndex);
          existing.gender = p.gender === 'male' || p.gender === '乾造' ? 'male' : 'female';
          if (p.category) existing.category = p.category;
          if (p.notes) existing.notes = p.notes;
          existing.updatedAt = p.updatedAt;
          existing.deletedAt = p.deletedAt;
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem(KEY, JSON.stringify(localCharts));
      }
    }
  } catch (e) {
    console.warn('[Storage] Universal profiles merge error:', e);
  }

  return localCharts;
}

export function getActiveCharts(): SavedChart[] {
  return getAllCharts().filter(c => !c.deletedAt);
}

export function upsertChart(chart: SavedChart): void {
  const charts = getAllCharts().filter(c => c.id !== chart.id);
  const updatedCharts = [...charts, chart];
  localStorage.setItem(KEY, JSON.stringify(updatedCharts));

  // 1. 同步寫入 window.MeetJoyProfiles 全站通用命盤庫
  try {
    const univProfile = {
      id: chart.id,
      name: chart.name,
      gender: chart.gender,
      birthDate: chart.solarDate,
      birthTime: chart.birthTime || timeIndexToDefaultTime(chart.timeIndex),
      birthCity: chart.birthCity || 'tw_taipei',
      timeIndex: chart.timeIndex,
      category: chart.category || '自己',
      notes: chart.notes || '',
      updatedAt: chart.updatedAt || Date.now(),
    };

    if (typeof window !== 'undefined' && (window as any).MeetJoyProfiles?.upsert) {
      (window as any).MeetJoyProfiles.upsert(univProfile);
    } else if (typeof localStorage !== 'undefined') {
      let univ: any[] = [];
      const raw = localStorage.getItem('mj_universal_profiles');
      if (raw) univ = JSON.parse(raw);
      univ = univ.filter((p: any) => p.id !== chart.id);
      univ.unshift(univProfile);
      localStorage.setItem('mj_universal_profiles', JSON.stringify(univ));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: chart }));
      window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated', { detail: chart }));
    }
  } catch (e) {
    console.warn('[Storage] Sync upsert to universal failed:', e);
  }
}

export function softDeleteChart(id: string): void {
  const now = Date.now();
  const charts = getAllCharts().map(c =>
    c.id === id ? { ...c, deletedAt: now, updatedAt: now } : c
  );
  localStorage.setItem(KEY, JSON.stringify(charts));

  try {
    if (typeof window !== 'undefined' && (window as any).MeetJoyProfiles?.delete) {
      (window as any).MeetJoyProfiles.delete(id);
    } else if (typeof localStorage !== 'undefined') {
      let univ: any[] = [];
      const raw = localStorage.getItem('mj_universal_profiles');
      if (raw) univ = JSON.parse(raw);
      univ = univ.filter((p: any) => p.id !== id);
      localStorage.setItem('mj_universal_profiles', JSON.stringify(univ));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mj-profiles-changed', { detail: { id, deleted: true } }));
      window.dispatchEvent(new CustomEvent('meetjoy_profiles_updated', { detail: { id, deleted: true } }));
    }
  } catch (e) {
    console.warn('[Storage] Sync delete to universal failed:', e);
  }
}

export function saveAllCharts(charts: SavedChart[]): void {
  localStorage.setItem(KEY, JSON.stringify(charts));
}

export function getLastSyncTime(): number | null {
  const v = localStorage.getItem('ziwei-last-sync');
  return v ? Number(v) : null;
}

export function setLastSyncTime(ts: number): void {
  localStorage.setItem('ziwei-last-sync', String(ts));
}

export function exportChartsToJson(): string {
  const charts = getAllCharts();
  return JSON.stringify(charts, null, 2);
}

export function importChartsFromJson(jsonStr: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: '檔案格式錯誤：必須為命盤陣列' };
    }
    const current = getAllCharts();
    const map = new Map<string, SavedChart>();
    current.forEach(c => map.set(c.id, c));

    let importedCount = 0;
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue;
      if (!item.name || !item.solarDate || typeof item.timeIndex !== 'number' || !item.gender) continue;

      const id = item.id || generateId();
      const existing = map.get(id);
      if (!existing || (item.updatedAt || 0) >= (existing.updatedAt || 0)) {
        map.set(id, {
          ...item,
          id,
          updatedAt: item.updatedAt || Date.now(),
        });
        importedCount++;
      }
    }

    const merged = Array.from(map.values());
    saveAllCharts(merged);
    return { success: true, count: importedCount };
  } catch (err) {
    return { success: false, count: 0, error: (err as Error).message };
  }
}
