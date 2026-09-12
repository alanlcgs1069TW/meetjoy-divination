# 紫微斗數 WebApp — 技術規格

> 交付版：只保留排盤邏輯與前端規格，原始開發環境的路徑、部署設定與協作流程已移除。
> UI/UX 與字典見 `spec.md`，工程陷阱見 `GOTCHAS.md`，開發歷程見 `CHANGELOG.md`。

## 3. 技術選型
- React + TypeScript（Vite）
- 排盤引擎：自訂封裝（MIT 開源引擎，勿替換）
- 後端/Auth：Supabase（email/password，free tier）
- 部署：Cloudflare Pages + GitHub Actions

## 4. 客製化邏輯（不可更動）

### 十干四化表（學會版本）
| 天干 | 化祿 | 化權 | 化科 | 化忌 |
|------|------|------|------|------|
| 甲   | 廉貞 | 破軍 | 武曲 | 太陽 |
| 乙   | 天機 | 天梁 | 紫微 | 太陰 |
| 丙   | 天同 | 天機 | 文昌 | 廉貞 |
| 丁   | 太陰 | 天同 | 天機 | 巨門 |
| 戊   | 貪狼 | 太陰 | 右弼 | 天機 |
| 己   | 武曲 | 貪狼 | 天梁 | 文曲 |
| 庚   | 太陽 | 武曲 | 天同 | 天相 |
| 辛   | 巨門 | 太陽 | 文曲 | 文昌 |
| 壬   | 天梁 | 紫微 | 左輔 | 武曲 |
| 癸   | 破軍 | 巨門 | 太陰 | 貪狼 |

### 計算規則
- 大限：**實歲**（`queryYear - 農曆生年`；跨農曆除夕以農曆年為基準，故用 lunarBirthYear），range 存實歲
- 小限：**虛歲（= 實歲 + 1）**，自訂演算法（見 `src/lib/astrolabe/minorLimit.ts`）
- ⚠️ 大限看實歲、小限看虛歲，兩者**差 1 是定義、非 bug**（`decadal.ts` 無 +1、`minorLimit.ts` 有 +1，皆正確、對照 dreamkinin 一致）
- **晚子時（timeIndex 12）**：視為隔日起盤（日期 +1 天，用 timeIndex 0），birthInfo 保留原始日期
- 星名覆寫：`空亡→截空`、`空劫→劫空`（注意截/劫順序）
- 隱藏/過濾星曜見 `src/lib/engine/constants.ts`

### 運線 overlay 星曜（學會版，不可更改）
| 層 | 星曜名稱 | 說明 |
|----|---------|------|
| 大限 | 限祿、限羊、限陀 | 依大限天干計算，**無限馬** |
| 流年 | 年祿、年羊、年陀、年鸞、年喜 | 依流年天干/年支計算，**無年馬** |

### 運線 overlay 星曜（Advanced 模式延伸，非學會版教材）
| 層 | 星曜名稱 | 說明 |
|----|---------|------|
| 流月 | 月祿、月羊、月陀 | 依節氣月干計算 |
| 流日 | 日祿、日羊、日陀 | 依日干計算 |
| 流時 | 時祿、時羊、時陀 | 依時干（五鼠遁）計算 |

- 大限/流年 overlay 宮位方向：從命宮/流年命宮起 **CCW**
- offset 公式：`(palaceIdx - startIdx + 12) % 12`（錯誤版本是 startIdx - palaceIdx，會全反）
- 宮位方向 CCW 與 offset 公式，流月/流日/流時同大限/流年
- 代碼位置：`src/i18n/index.ts` → `getDecadalOverlay` / `getYearlyOverlay`
  / `getMonthlyOverlay` / `getDailyOverlay` / `getHourlyOverlay`

## 5. 語言顯示規範
- **桌面**：中文 + 英文/拼音同時顯示
- **手機（≤768px）**：中文/拼音二選一，切換按鈕在中央資訊卡（"Pinyin" / "Chinese"）
- 拼音格式：Title-Case-Hyphenated，如 `Tian-Liang`、`Ding-Chou`
- 語言狀態：`data-locale="zh-TW|zh-CN|en"` + `data-show-pinyin="true|false"` 屬性 + `LangContext`
  （locale 與 pinyin 是**兩個獨立維度**，分別存 `ziwei-locale` / `ziwei-pinyin`；
  早期為 `data-lang="zh|pinyin"` 兩態設計，已淘汰）

## 7. 頁面架構

```
AppPage: 'list' | 'chart'

list（主頁）：
  ChartList：搜尋 + 命盤列表（gender icon / name / date+時辰 / 編輯/刪除）
  左上漢堡 → Sidebar overlay
  右上 ✏ → ChartModal（新增）
  點命盤列表項目 → setPage('chart')

chart（命盤頁）：
  .app.page-chart → height: 100vh（桌面無需捲動）
  AstrolabeChart + DecadalTimeline + YearlyTimeline
  中央資訊卡「← 命盤資料庫 Database」→ setPage('list')

Sidebar：overlay drawer，漢堡開關
  未登入：登入/註冊 → AuthPage modal
  已登入：帳號 email + 備份同步（顯示上次同步時間）+ 登出

ChartModal / AuthPage：position: fixed modal overlay
```

## 8. 關鍵技術備忘
技術細節見 `spec.md`，工程陷阱見 `GOTCHAS.md`。
