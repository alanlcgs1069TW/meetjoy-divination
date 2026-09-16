/**
 * 癒見幸福 · 全站命盤雲端跨裝置同步 API (Cloudflare Pages Functions)
 * 解決使用者在不同電腦 / 裝置登入時，命盤庫資料不一致的問題。
 */

function normalizeDateStr(dStr) {
  if (!dStr) return '1990-01-01';
  const parts = dStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dStr;
  const y = String(parts[0]);
  const m = String(parts[1]).padStart(2, '0');
  const d = String(parts[2]).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const hasValidExactTime = (t) => t && t !== 'None' && t !== '12:00';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  const userId = (url.searchParams.get('user_id') || '').trim();

  const key = email ? `user:${email}` : (userId ? `uid:${userId}` : null);
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing email or user_id', profiles: [] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  if (!env.PROFILES_KV) {
    return new Response(JSON.stringify({ error: 'KV_NOT_BOUND', profiles: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const raw = await env.PROFILES_KV.get(key);
    let profiles = raw ? JSON.parse(raw) : [];
    const dedupMap = new Map();
    profiles.filter(p => !p.deletedAt).forEach(p => {
      const bDate = normalizeDateStr(p.birthDate);
      const cleanName = (p.name || '').trim();
      const k = `${cleanName}_${bDate}`;
      const prev = dedupMap.get(k);
      if (!prev) {
        dedupMap.set(k, { ...p, name: cleanName, birthDate: bDate });
      } else {
        const pExact = hasValidExactTime(p.birthTime);
        const prevExact = hasValidExactTime(prev.birthTime);
        const chosenTime = pExact ? p.birthTime : (prevExact ? prev.birthTime : (p.birthTime || prev.birthTime));
        dedupMap.set(k, {
          ...prev,
          ...p,
          id: (prev.id && prev.id.startsWith('prof_ag_')) ? prev.id : (p.id || prev.id),
          name: cleanName,
          birthDate: bDate,
          birthTime: chosenTime
        });
      }
    });
    profiles = Array.from(dedupMap.values());
    profiles.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return new Response(JSON.stringify({ success: true, count: profiles.length, profiles }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, profiles: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const email = (data.email || '').trim().toLowerCase();
    const userId = (data.user_id || '').trim();
    const incomingProfiles = Array.isArray(data.profiles) ? data.profiles : [];
    const action = data.action || 'merge'; // 'merge' or 'replace'

    const key = email ? `user:${email}` : (userId ? `uid:${userId}` : null);
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing email or user_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (!env.PROFILES_KV) {
      return new Response(JSON.stringify({ error: 'KV_NOT_BOUND', profiles: incomingProfiles }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    let finalProfiles = [];

    if (action === 'replace') {
      const dedupMap = new Map();
      incomingProfiles.filter(p => !p.deletedAt).forEach(p => {
        const bDate = normalizeDateStr(p.birthDate);
        const cleanName = (p.name || '').trim();
        const k = `${cleanName}_${bDate}`;
        const prev = dedupMap.get(k);
        if (!prev) {
          dedupMap.set(k, { ...p, name: cleanName, birthDate: bDate });
        } else {
          const pExact = hasValidExactTime(p.birthTime);
          const prevExact = hasValidExactTime(prev.birthTime);
          const chosenTime = pExact ? p.birthTime : (prevExact ? prev.birthTime : (p.birthTime || prev.birthTime));
          dedupMap.set(k, {
            ...prev,
            ...p,
            id: (prev.id && prev.id.startsWith('prof_ag_')) ? prev.id : (p.id || prev.id),
            name: cleanName,
            birthDate: bDate,
            birthTime: chosenTime
          });
        }
      });
      finalProfiles = Array.from(dedupMap.values());
    } else {
      // 雙向合併模式 (Merge with Last-Write-Wins 與同名同日嚴格語意去重)
      const raw = await env.PROFILES_KV.get(key);
      const existing = raw ? JSON.parse(raw) : [];

      const map = new Map();

      existing.forEach(p => {
        const bDate = normalizeDateStr(p.birthDate);
        const cleanName = (p.name || '').trim();
        const k = `${cleanName}_${bDate}`;
        map.set(k, { ...p, name: cleanName, birthDate: bDate });
      });

      incomingProfiles.forEach(p => {
        const bDate = normalizeDateStr(p.birthDate);
        const cleanName = (p.name || '').trim();
        const k = `${cleanName}_${bDate}`;
        const prev = map.get(k);

        if (!prev) {
          if (!p.deletedAt) map.set(k, { ...p, name: cleanName, birthDate: bDate });
        } else {
          if (p.deletedAt) {
            map.delete(k);
          } else {
            // 比對更新時間，同時保護精確分鐘時間不被 dummy/None 覆蓋
            const prevTime = prev.updatedAt || 0;
            const currTime = p.updatedAt || Date.now();
            const pExact = hasValidExactTime(p.birthTime);
            const prevExact = hasValidExactTime(prev.birthTime);
            const chosenTime = pExact ? p.birthTime : (prevExact ? prev.birthTime : (p.birthTime || prev.birthTime));

            if (currTime >= prevTime) {
              map.set(k, {
                ...prev,
                ...p,
                id: (prev.id && prev.id.startsWith('prof_ag_')) ? prev.id : (p.id || prev.id),
                name: cleanName,
                birthDate: bDate,
                birthTime: chosenTime
              });
            } else if (pExact && !prevExact) {
              prev.birthTime = p.birthTime;
            }
          }
        }
      });

      finalProfiles = Array.from(map.values()).filter(p => !p.deletedAt);
    }

    // 依更新時間新到舊排序
    finalProfiles.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    await env.PROFILES_KV.put(key, JSON.stringify(finalProfiles));

    return new Response(JSON.stringify({
      success: true,
      count: finalProfiles.length,
      profiles: finalProfiles
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
