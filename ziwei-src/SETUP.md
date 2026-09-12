# 安裝與設定

## 0. 需求

- Node **20.19+**（或 22.12+）。低於此版本 Vite 8 會直接拒絕啟動。
- 用 Docker 的話不必自己裝 Node。

## 1. 本機跑起來（不需要帳號）

```bash
docker compose --profile test up -d
```

開 **http://localhost:5174**

> `--profile test` 不可省略。compose 裡唯一的服務掛在 `test` profile 下，
> 少了這個參數會是「no service selected」、什麼都不會啟動。

不想用 Docker：

```bash
npm install
npm run dev          # 這條走 vite.config.ts，網址是 http://localhost:5173
```

兩條路徑的 port 不同（Docker 5174 / 本機 5173），不是筆誤。

不設定 Supabase 也能完整排盤，命盤存在瀏覽器 localStorage，
只是沒有跨裝置同步與登入。

## 2. 要開啟登入／雲端同步

1. 到 [supabase.com](https://supabase.com) 開一個免費專案
2. 複製 `.env.example` 成 `.env.local`，填入 Project URL 與 anon key
3. 在 SQL Editor 建表並開啟 RLS：

```sql
-- 命盤
create table if not exists public.charts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  solar_date text,
  time_index int,
  gender text,
  category text,
  notes text,
  alias text,
  multi_birth_order int,
  updated_at bigint not null,
  deleted_at bigint
);
alter table public.charts enable row level security;
create policy "users own their charts" on public.charts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 盤面預設（飛化／自化開關）
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at bigint not null
);
alter table public.user_settings enable row level security;
create policy "users own their settings" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

4. Authentication → Providers 開啟 Email，URL Configuration 加入你的網址

> `spec.md` 裡也有一份 charts 建表 SQL，但那是**舊版**（少了 category /
> notes / alias / multi_birth_order，也沒有 user_settings）。以本檔為準。

## 3. 意見回報功能（**預設是開啟的**，不需要請先刪掉）

`supabase/functions/report-bug/` 會把使用者回報寫進 Notion。

⚠️ **側邊欄的「意見回報」按鈕預設就在畫面上**，沒有開關可以關掉它。
未設定 Supabase 時按下去會失敗（endpoint 會組成 `undefined/functions/v1/report-bug`）。
不需要這個功能的話請**直接刪除**：`supabase/functions/report-bug/`、
`src/components/BugReportModal.tsx`，以及 `Sidebar.tsx` 裡的意見回報按鈕與
`App.tsx` 對應的 state。

⚠️ **要用之前先知道這些**：

- 這個 Edge Function 的 CORS 是 `*`、**不需登入即可呼叫**，並且用
  service-role key 寫入你的 Storage、用 integration token 寫入你的 Notion。
  等於對外開放的寫入端點，**沒有 rate limit 也沒有驗證碼**。
  正式對外前請自行加上速率限制或改為需登入。
- 截圖的簽章 URL 有效期寫死 **10 年**（`index.ts` 的 `expiresIn`），
  等同永久公開，會被寫進 Notion 頁面。要縮短請自行調整。

啟用步驟：

1. 建一個名為 **`bug-reports`** 的 private Storage bucket
   （缺這個不會報錯，截圖會靜默丟失）
2. Notion 資料庫需要這些屬性，名稱與型別都要對得上，否則 Notion 回 400：

   | 屬性名 | 型別 |
   |---|---|
   | `Title` | title |
   | `Status` | select（需有 `New` 這個選項）|
   | `Description` | rich_text |
   | `Steps to Reproduce` | rich_text |
   | `User Email` | email |
   | `Browser / Device` | rich_text |

3. Edge Function secrets 設定 `NOTION_TOKEN` 與 `NOTION_DATABASE_ID`
   （`SUPABASE_URL` 與 `SUPABASE_SERVICE_ROLE_KEY` 由平台自動注入）

## 4. 上線前必改

- `src/components/PrivacyPolicy.tsx` 的聯絡信箱目前是佔位值
  `your-email@example.com`，那是**會顯示給使用者看的法律文件**，務必換掉。

## 5. 排盤邏輯

- 客製化邏輯（四化表、歲數基準、晚子時）見 `claude.md` §4
- 已知陷阱見 `GOTCHAS.md`
- 改動理由見 `CHANGELOG.md`
