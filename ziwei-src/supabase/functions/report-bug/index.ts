// 部署前在 Supabase Edge Function secrets 設定 NOTION_DATABASE_ID
const NOTION_DATABASE_ID = Deno.env.get('NOTION_DATABASE_ID') ?? '';
const NOTION_API = 'https://api.notion.com/v1/pages';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 只接受常見點陣圖；擋掉 SVG（可含 script）與任意檔案上傳
const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_SHOT_BYTES = 5 * 1024 * 1024; // 伺服端再次強制 5 MB（不只信前端）

async function uploadScreenshot(base64: string, mime: string): Promise<string | null> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return null;

  // 硬化：mime 白名單 + 解碼後大小上限
  const ext = ALLOWED_MIME[mime];
  if (!ext) { console.warn('Rejected screenshot mime:', mime); return null; }
  const approxBytes = Math.floor(base64.length * 3 / 4);
  if (approxBytes > MAX_SHOT_BYTES) { console.warn('Rejected oversized screenshot:', approxBytes); return null; }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  } catch {
    console.warn('Rejected screenshot: invalid base64');
    return null;
  }
  if (bytes.length > MAX_SHOT_BYTES) { console.warn('Rejected oversized screenshot (decoded):', bytes.length); return null; }

  const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/bug-reports/${filename}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': mime,
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    console.error('Storage upload failed:', await uploadRes.text());
    return null;
  }

  // Generate a signed URL valid for 10 years (private bucket)
  const signRes = await fetch(`${supabaseUrl}/storage/v1/object/sign/bug-reports/${filename}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: 315360000 }),
  });

  if (!signRes.ok) {
    console.error('Signing failed:', await signRes.text());
    return null;
  }

  const { signedURL } = await signRes.json();
  return `${supabaseUrl}${signedURL}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS });
  }

  const token = Deno.env.get('NOTION_TOKEN');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  let body: {
    title: string;
    description: string;
    steps?: string;
    email?: string;
    browser?: string;
    screenshot?: string;
    screenshotMime?: string;
    screenshots?: { base64: string; mime: string }[];
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  if (!body.title?.trim() || !body.description?.trim()) {
    return new Response(JSON.stringify({ error: 'Title and description are required' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const properties: Record<string, unknown> = {
    Title: { title: [{ text: { content: body.title.slice(0, 200) } }] },
    Status: { select: { name: 'New' } },
    Description: { rich_text: [{ text: { content: body.description.slice(0, 2000) } }] },
  };

  if (body.steps?.trim()) {
    properties['Steps to Reproduce'] = {
      rich_text: [{ text: { content: body.steps.slice(0, 2000) } }],
    };
  }
  if (body.email?.trim()) {
    properties['User Email'] = { email: body.email.trim() };
  }
  if (body.browser?.trim()) {
    properties['Browser / Device'] = {
      rich_text: [{ text: { content: body.browser.slice(0, 300) } }],
    };
  }

  // Upload screenshot and attach as image block
  const notionBody: Record<string, unknown> = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties,
  };

  // 收集截圖：優先用新版陣列 screenshots，否則退回舊版單張欄位
  const shots = (body.screenshots?.length
    ? body.screenshots
    : (body.screenshot && body.screenshotMime
        ? [{ base64: body.screenshot, mime: body.screenshotMime }]
        : [])
  ).slice(0, 3);

  if (shots.length) {
    const blocks: unknown[] = [];
    for (const s of shots) {
      const url = await uploadScreenshot(s.base64, s.mime);
      if (url) {
        blocks.push({
          object: 'block',
          type: 'image',
          image: { type: 'external', external: { url } },
        });
      }
    }
    if (blocks.length) notionBody.children = blocks;
  }

  const res = await fetch(NOTION_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(notionBody),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion API error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create report' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  });
});
