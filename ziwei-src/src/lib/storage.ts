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

export function getAllCharts(): SavedChart[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function getActiveCharts(): SavedChart[] {
  return getAllCharts().filter(c => !c.deletedAt);
}

export function upsertChart(chart: SavedChart): void {
  const charts = getAllCharts().filter(c => c.id !== chart.id);
  localStorage.setItem(KEY, JSON.stringify([...charts, chart]));
}

export function softDeleteChart(id: string): void {
  const now = Date.now();
  const charts = getAllCharts().map(c =>
    c.id === id ? { ...c, deletedAt: now, updatedAt: now } : c
  );
  localStorage.setItem(KEY, JSON.stringify(charts));
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
