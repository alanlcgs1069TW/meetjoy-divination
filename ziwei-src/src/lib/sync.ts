import { supabase } from './supabase';
import type { SavedChart } from '../types/savedChart';
import { getAllCharts, saveAllCharts, setLastSyncTime } from './storage';

// ── DB ↔ local type mapping ───────────────────────────────────────────────────

interface DbChart {
  id: string;
  user_id: string;
  name: string;
  solar_date: string;
  time_index: number;
  gender: string;
  updated_at: number;
  deleted_at: number | null;
  multi_birth_order: number | null;
  category: string | null;
  notes: string | null;
  alias: string | null;
}

function toDb(chart: SavedChart, userId: string): DbChart {
  return {
    id: chart.id,
    user_id: userId,
    name: chart.name,
    solar_date: chart.solarDate,
    time_index: chart.timeIndex,
    gender: chart.gender,
    updated_at: chart.updatedAt,
    deleted_at: chart.deletedAt ?? null,
    multi_birth_order: chart.multiBirthOrder ?? null,
    category: chart.category ?? null,
    notes: chart.notes ?? null,
    alias: chart.alias ?? null,
  };
}

function fromDb(row: DbChart): SavedChart {
  const c: SavedChart = {
    id: row.id,
    name: row.name,
    solarDate: row.solar_date,
    timeIndex: row.time_index,
    gender: row.gender as 'male' | 'female',
    updatedAt: row.updated_at,
  };
  if (row.deleted_at)        c.deletedAt       = row.deleted_at;
  if (row.multi_birth_order) c.multiBirthOrder = row.multi_birth_order as 2 | 3 | 4;
  if (row.category)          c.category        = row.category;
  if (row.notes)             c.notes           = row.notes;
  if (row.alias)             c.alias           = row.alias;
  return c;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean { return UUID_RE.test(id); }

// ── Bidirectional sync ────────────────────────────────────────────────────────

export async function syncCharts(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const local = getAllCharts(); // includes soft-deleted

  // Filter out test/legacy charts with non-UUID ids — Supabase uuid column rejects them
  const syncable = local.filter(c => isValidUuid(c.id));
  const nonUuid  = local.filter(c => !isValidUuid(c.id));
  if (nonUuid.length > 0) console.warn(`[Sync] Skipped ${nonUuid.length} chart(s) with non-UUID ids`);

  // 1. Download server charts first (prevents local stale data from overwriting server)
  const { data: rows, error: fetchErr } = await supabase
    .from('charts')
    .select('*');
  if (fetchErr) throw fetchErr;

  const server: SavedChart[] = (rows ?? []).map(r => fromDb(r as DbChart));

  // 2. Merge: last-write-wins by updatedAt (server first so equal timestamps prefer server)
  const merged = new Map<string, SavedChart>();
  for (const c of [...server, ...syncable]) {
    const existing = merged.get(c.id);
    if (!existing || c.updatedAt >= existing.updatedAt) {
      merged.set(c.id, c);
    }
  }
  const mergedArr      = Array.from(merged.values());
  const mergedSyncable = mergedArr.filter(c => isValidUuid(c.id));

  // 3. Upload only records where local is newer than server
  const serverMap = new Map(server.map(c => [c.id, c]));
  const toUpload  = mergedSyncable.filter(c => {
    const s = serverMap.get(c.id);
    return !s || c.updatedAt > s.updatedAt;
  });
  if (toUpload.length > 0) {
    const { error: upsertErr } = await supabase
      .from('charts')
      .upsert(toUpload.map(c => toDb(c, user.id)));
    if (upsertErr) throw upsertErr;
  }

  // 4. Save merged to localStorage (include non-UUID charts so they remain locally accessible)
  saveAllCharts([...mergedArr, ...nonUuid]);
  setLastSyncTime(Date.now());
}
