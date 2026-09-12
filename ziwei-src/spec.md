# 紫微斗數 WebApp — 詳細規格書

> 本文件是 `claude.md` 的詳細補充。日常開發以 claude.md 為主，需要精確規格時查此文件。

---

## §1. 宮格排版規格（PalaceCell）

每宮格 = 頂部 + 星曜區（flex:1）+ 底部識別欄，結構如下：

```
┌──────────────────────────────┐
│ [age range, 小字]            │  ← palace-top
├──────────────────────────────┤
│ Row 1: 十四主星（紅色）       │
│ Row 2: 輔煞星（黑色）         │  ← star-content (flex:1, overflow:hidden)
│ Row 3: 大限+流年疊星（棕/青） │    僅 !isNatalMode 顯示
│ Row 4: 其他雜曜（淺藍/灰）    │
├──────────────────────────────┤
│ [流X  ][Annual label]        │  ← identity-stack（!isNatalMode 才顯示）
│ [大X  ][Decade label]        │
│ [宮名 ][palace en]           │
│ [干支 ][Stem-Branch pinyin]  │
│                   [badges →] │  ← palace-badges（右側）
└──────────────────────────────┘
```

### 星曜顏色 class
| 類型 | CSS class | 顏色 |
|------|-----------|------|
| 十四主星 | `star-red` | #c0392b |
| 輔煞星（下方列表）| `star-black` | #1a1a1a |
| 其他雜曜 | `star-lightblue` | #5a8ec0 |
| 大限疊星 | `star-decadal` | #9b6a30 |
| 流年疊星 | `star-yearly` | #1a7a6b |

### 輔煞星（黑色全尺寸，FULL_SIZE_STARS）
陀羅、擎羊、火星、鈴星、祿存、文昌、文曲、天鉞、天魁、左輔、右弼、地空、地劫、天馬、紅鸞、天喜

### 博士十二神（star-tiny，無拼音）
博士、力士、青龍、小耗、將星、奏書、飛廉、喜神、病符、大耗、伏兵、官府

### 字體大小層級（CSS clamp variables）
| 用途 | Variable | 值 |
|------|----------|----|
| 主星 + 輔煞 | `--fs-star` | clamp(12px, 1.6vw, 16px) |
| 雜曜 | `--fs-small` | clamp(11px, 1.4vw, 14px) |
| 拼音/英文 | `--fs-pinyin` | clamp(10px, 1.3vw, 13px) |
| 宮名 | `--fs-name` | clamp(12px, 1.6vw, 16px) |
| 博士十二神 | `star-tiny` | calc(var(--fs-pinyin) - 2px) |

手機（max-width 768px）：格高 clamp(110px, 30vw, 245px)；手機（≤520px）另有縮小 override。

---

## §2. 四化 Badge 規格

```
┌───┐
│ 祿 │  ← badge-zh（字）
│ Lu│  ← badge-pinyin（拼音，較小）
└───┘
```

| 類型 | CSS class | 背景色 |
|------|-----------|--------|
| 本命 | `mutagen-origin` | #c0392b |
| 大限 | `mutagen-decadal` | #9b6a30 |
| 流年 | `mutagen-yearly` | #1a7a6b |

四化字：祿(Lu) / 權(Quan) / 科(Ke) / 忌(Ji)

---

## §3. 模式與三方四正

### 三種模式
| 狀態 | isNatalMode | isYearlyMode | 說明 |
|------|-------------|--------------|------|
| 本命盤 | true | false | 不顯示疊層；點擊宮位可顯示三方四正 |
| 大限模式 | false | false | 顯示大限疊層；無小限 badge |
| 流年模式 | false | true | 顯示大限+流年疊層；顯示小限 badge |

判斷：`isNatalMode = selectedPalaceIdx === null && selectedYear === null`

### 三方四正（ThreeSideLine）
- SVG overlay，strokeWidth=0.003，pointer-events: none
- 顯示條件：`!isNatalMode || clickedPalaceIdx !== null`
- originPalaceIdx 優先順序：`clickedPalaceIdx > 大限命宮 > 流年命宮`
- 本命盤：點擊宮位顯示，點另一宮切換，再點同宮取消

---

## §4. 中英文字典（唯一版本，不可自行修改）

### 十二宮
| 中文 | 英文 | 拼音 |
|------|------|------|
| 命宮 | Self | Ming-Gong |
| 兄弟 | Sibling | Xiong-Di |
| 夫妻 | Romance | Fu-Qi |
| 子女 | Children | Zi-Nu |
| 財帛 | Wealth | Cai-Bo |
| 疾厄 | Health | Ji-E |
| 遷移 | Reflection | Qian-Yi |
| 僕役 | Friends | Pu-Yi |
| 官祿 | Achievement | Guan-Lu |
| 田宅 | Property | Tian-Zhai |
| 福德 | Soul | Fu-De |
| 父母 | Parent | Fu-Mu |

### 十四主星
| 中文 | 英文 | 拼音 |
|------|------|------|
| 紫微 | Star of Emperor | Zi-Wei |
| 天機 | Star of Calculating | Tian-Ji |
| 太陽 | The Sun | Tai-Yang |
| 太陰 | The Moon | Tai-Yin |
| 武曲 | Star of Finance | Wu-Qu |
| 天同 | Star of Innocence | Tian-Tong |
| 廉貞 | Star of Confinement | Lian-Zhen |
| 天梁 | Star of Blessing | Tian-Liang |
| 天府 | Star of Lord | Tian-Fu |
| 天相 | Star of Minister | Tian-Xiang |
| 七殺 | Star of Persistence | Qi-Sha |
| 破軍 | Star of Passion | Po-Jun |
| 貪狼 | Star of Desire | Tan-Lang |
| 巨門 | Somber Star | Ju-Men |

### 輔煞星
| 中文 | 英文 | 拼音 |
|------|------|------|
| 陀羅 | star of thoughts | Tuo-Luo |
| 擎羊 | dagger star | Qing-Yang |
| 火星 | fiery star | Huo-Xing |
| 鈴星 | wily star | Ling-Xing |
| 祿存 | flow | Lu-Cun |
| 文昌 | intellect star | Wen-Chang |
| 文曲 | intelligence star | Wen-Qu |
| 天鉞 | female helper | Tian-Yue |
| 天魁 | male helper | Tian-Kui |
| 左輔 | left aide | Zuo-Fu |
| 右弼 | right aide | You-Bi |
| 地空 | Vanish damage | Di-Kong |
| 地劫 | Robbery damage | Di-Jie |
| 天馬 | sky horse | Tian-Ma |
| 紅鸞 | romance star | Hong-Luan |
| 天喜 | joy star | Tian-Xi |

### 四化
| 中文 | 英文 | 拼音 |
|------|------|------|
| 化祿 | Flow enhancer | Lu |
| 化權 | Power enhancer | Quan |
| 化科 | Fame enhancer | Ke |
| 化忌 | Devoid enhancer | Ji |

### 大限/流年/小限 overlay 標籤
- 大X：`getDecadalOverlay(palaceIdx, decadalStartIdx)` → zh: 大命/大兄…, en: Self/Sibling…
- 流X：`getYearlyOverlay(palaceIdx, yearlyStartIdx)` → zh: 流命/流兄…, en: Self/Sibling…
- 小限 badge：`小限 Minor`（僅流年模式）
- 身宮 badge：`身 Action`

---

## §5. 語言切換規格（手機）

### 切換機制
- React Context：`LangContext`（`locale: 'zh-TW'|'zh-CN'|'en'` + `showPinyin: boolean`，兩者獨立）
- 持久化：`localStorage['ziwei-locale']`、`localStorage['ziwei-pinyin']`
- DOM 屬性：`<div class="app" data-locale="zh-TW|zh-CN|en" data-show-pinyin="true|false">`

> 註：早期為 `data-lang="zh|pinyin"` 的兩態設計，已改為 locale + pinyin 兩個獨立維度。
- 切換按鈕：在 CenterInfo 卡，標籤 "Pinyin" ↔ "Chinese"，淺灰色樣式

### CSS 行為（≤768px）
| 元素 class | zh 模式 | pinyin 模式 |
|-----------|---------|------------|
| `.star-zh` | 顯示 | 隱藏 |
| `.star-pinyin` | 隱藏 | 顯示，升至 `--fs-star` 大小 |
| `.id-zh` | 顯示 | 隱藏 |
| `.id-en` | 隱藏 | 顯示 |
| `.sb-zh` | 顯示 | 隱藏 |
| `.sb-pinyin` | 隱藏 | 顯示 |
| `.badge-zh` | 顯示 | 隱藏 |
| `.badge-pinyin` | 隱藏 | 顯示 |
| `.tl-label` / `.tl-stem` / `.yl-stem` | 顯示 | 隱藏 |
| `.tl-label-en` / `.tl-pinyin` / `.yl-pinyin` | 隱藏 | 顯示 |

桌面（>768px）：中文 + 英文/拼音同時顯示。

### 拼音格式
- 格式：Title-Case-Hyphenated
- 星名：`Tian-Liang`、`Zi-Wei`
- 干支：`Ding-Chou`、`Jia-Zi`
- 實作：`formatPinyin(s)` in `src/i18n/index.ts`（split on spaces → capitalize → join with `-`）

---

## §6. 中央資訊卡（CenterInfo）

顯示內容：
- 姓名（若有）
- 時辰大字 + 拼音 + 時間範圍，如「寅時 Yin　03:00–05:00」
- 性別（男命 · Male / 女命 · Female）
- 五行局
- 陽曆 Solar：solarDate
- 農曆 Lunar：lunarToArabic() 轉阿拉伯數字（如 ）
- `!isNatalMode` 才顯示：
  - 大限 Decade：宮名英文 + 歲數範圍
  - 流年 Annual：宮名英文 + 干支 + 拼音
  - 小限 Minor：宮名英文 + 虛歲

---

## §7. 輸入表單（BirthForm）

> ⚠️ 此元件已從交付包移除（未被任何地方引用）。以下保留規格供日後重建參考；
> 實際使用中的新增/編輯介面是 `src/components/ChartModal.tsx`。

欄位：
- 姓名（選填）
- 陽曆：年/月/日 數字輸入
- 時辰：`<select>`，格式「寅時 Yin　03:00–05:00」
- 性別：radio（男命 Male / 女命 Female）

預設值：，時辰 index 2（寅），男

---

## §8. 時間軸規格

### 大限時間軸（DecadalTimeline）
每格：N限 / Nth Decade → 干支 → Stem-Branch pinyin → 歲數範圍  
點擊選中；再次點擊同格 → 取消（退回本命盤）  
選中：深棕底色 `#9b6a30`，白字

### 流年時間軸（YearlyTimeline）
每格：干支 → Stem-Branch pinyin → 西元年 → 歲數  
點擊選中；再次點擊 → 取消  
選中：深青底色 `#1a7a6b`，白字

時間軸不可橫向捲動，格子自動縮放（flex: 1 1 0）。

---

## §9. 小限演算法（minorLimit.ts）

```
三合局起始宮（出生地支）：
  亥卯未 → 丑宮（branchIdx = 1）
  申子辰 → 戌宮（branchIdx = 10）
  巳酉丑 → 未宮（branchIdx = 7）
  寅午戌 → 辰宮（branchIdx = 4）

虛歲 = queryYear − birthYear + 1
男命順行：palaceIndex = (startIdx + age − 1) % 12
女命逆行：palaceIndex = (startIdx − age + 1 + 1200) % 12
```

注意：小限採自訂虛歲演算法（見 `minorLimit.ts`），不依賴外部引擎。

---

## §10. CSS Token 參考

```css
--color-major-star-bright: #c0392b;   /* 旺/廟主星 */
--color-major-star-weak:   #2c3e8f;   /* 陷/平主星（亮度隱藏，目前全隱）*/
--color-minor-star:        #1a1a1a;   /* 輔星 */
--color-mutagen-badge:     #c0392b;   /* 本命四化底色 */
--color-active-palace:     #FFDAB9;   /* 當前大限宮底色 */
--color-palace-border:     #d0d0d0;   /* 宮格邊框 */
--color-decadal:           #9b6a30;   /* 大限色 */
--color-yearly:            #1a7a6b;   /* 流年色 */
```

亮度指示（廟旺平落陷）：目前全域隱藏（`.brightness { display: none }`）。

---

## §11. 已知 Pre-existing 問題（不修）

- `src/i18n/index.ts`：TS1117 重複 key（天哭出現兩次）
- 以上不影響 Vite dev server，待評估是否修復

---

## §12. Phase E — 命盤儲存 & 帳號同步

### 12.1 資料結構

```typescript
// src/types/savedChart.ts
interface SavedChart {
  id: string;           // UUID（crypto.randomUUID 或 fallback）
  name: string;
  solarDate: string;    // 'YYYY-M-D'（使用者輸入的原始日期）
  timeIndex: number;    // 0–11 = 子–亥；12 = 晚子時
  gender: 'male' | 'female';
  updatedAt: number;    // Date.now()，雙向 sync 衝突解決用
  deletedAt?: number;   // 軟刪除 timestamp
}
```

### 12.2 晚子時計算規則

`timeIndex 12` = 晚子時（23:00–00:00），視為隔日起盤：
- `createZiweiChart`：如 timeIndex === 12 → calcDate = solarDate + 1 天，calcTimeIndex = 0
- `birthInfo` 保留原始 solarDate（使用者輸入日）和 timeIndex = 12（顯示用）
- `TIME_LABELS[12]` = `'晚子'`，`TIME_HOURS[12]` = `'23:00–00:00'`

### 12.3 本地儲存（src/lib/storage.ts）

```
getAllCharts()      → SavedChart[]（含軟刪除）
getActiveCharts()  → SavedChart[]（過濾 deletedAt）
upsertChart(c)     → 按 id 更新或新增
softDeleteChart(id)→ 設 deletedAt + updatedAt = now
saveAllCharts(arr) → 覆寫全部（sync 後用）
getLastSyncTime()  → number | null
setLastSyncTime(ts)→ void
generateId()       → UUID string
```

儲存 key：`localStorage['ziwei-charts']`

### 12.4 頁面架構

```
AppPage: 'list' | 'chart'

list（主頁）：
  ChartList
    ├── header: [☰ 漢堡] [命盤資料庫] [✏ 新增]
    ├── search bar（即時 filter 名字/日期）
    └── 命盤列表
          每項：gender icon + 名字 + 日期+時辰 + [編輯] [刪除]
          刪除：第一次點顯示「確認刪除?」，再點確認

chart（命盤頁）：
  [← 返回 Back]
  AstrolabeChart + DecadalTimeline + YearlyTimeline

Sidebar（overlay drawer）：
  未登入：[👤 免費註冊/登入] [隱私政策]
  已登入：[帳號 email] [☁ 備份同步] [↪ 登出] [隱私政策]

ChartModal（overlay modal）：
  gender 選擇（♀/♂ button）
  姓名 input
  陽曆生日（年/月/日 inputs）
  時辰 select（TIME_LABELS 含晚子時）
  [確認新增/確認修改] [取消]

AuthPage（overlay modal）：
  tabs: 登入 / 免費註冊 / 忘記密碼
  忘記密碼 → 輸入 email → Supabase 寄 reset link
```

### 12.5 Supabase 設定

**環境變數（.env.local，不進 git）**：
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

Cloudflare Pages → Settings → Environment Variables 填同樣的值。

**資料庫 schema**：
> ⚠️ **此為舊版 schema**，缺 `category` / `notes` / `alias` / `multi_birth_order`，
> 也沒有 `user_settings` 表。照這份建表會導致同步失敗。**以 `SETUP.md` 為準。**

```sql
create table charts (
  id          uuid primary key,
  user_id     uuid references auth.users not null,
  name        text not null default '',
  solar_date  text not null,
  time_index  integer not null,
  gender      text not null,
  updated_at  bigint not null,    -- Date.now() timestamp
  deleted_at  bigint              -- null = active
);

alter table charts enable row level security;
create policy "users own their charts"
  on charts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**注意**：Supabase free tier 閒置 7 天自動暫停，可設每 5 天 ping 一次 DB 的 cron 避免。

### 12.6 雙向 Sync 邏輯

觸發：使用者點 Sidebar「備份同步 Sync」按鈕（手動）

步驟：
1. `upsert` 所有本地 charts（含 deletedAt）到 Supabase（by id）
2. 拉回該 user 的所有 server charts
3. 按 id merge：哪邊 `updatedAt` 較新就採用哪邊
4. 結果存回 localStorage + 更新 `lastSyncTime`

衝突策略：last-write-wins（以 updatedAt 為準）
