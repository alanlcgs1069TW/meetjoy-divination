/**
 * 癒見幸福 · 全站命盤雲端跨裝置同步 API (Cloudflare Pages Functions)
 * 解決使用者在不同電腦 / 裝置登入時，命盤庫資料不一致的問題。
 */

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
    const profiles = raw ? JSON.parse(raw) : [];
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
      finalProfiles = incomingProfiles.filter(p => !p.deletedAt);
    } else {
      // 雙向合併模式 (Merge with Last-Write-Wins)
      const raw = await env.PROFILES_KV.get(key);
      const existing = raw ? JSON.parse(raw) : [];

      const map = new Map();
      existing.forEach(p => {
        const k = p.id || `${p.name}_${p.birthDate}_${p.birthTime}`;
        map.set(k, p);
      });

      incomingProfiles.forEach(p => {
        const k = p.id || `${p.name}_${p.birthDate}_${p.birthTime}`;
        const prev = map.get(k);
        if (!prev) {
          if (!p.deletedAt) map.set(k, p);
        } else {
          // 比對更新時間
          const prevTime = prev.updatedAt || 0;
          const currTime = p.updatedAt || Date.now();
          if (currTime >= prevTime) {
            if (p.deletedAt) {
              map.delete(k);
            } else {
              map.set(k, p);
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
