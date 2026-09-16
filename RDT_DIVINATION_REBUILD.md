# RDT 規格任務書：八字大典寬螢幕與神煞側邊抽屜升級 + 線上占卜大典(紫微/塔羅/雷諾曼)視覺與正反面完整重構

## 1. 任務背景與用戶真實痛點 (Frame)
用戶反饋四大痛點：
1. **八字神煞說明有時看不到**：原本的底部抽屜 (`#shensha_drawer`) 容易被捲軸或視窗高度遮擋，要求改為 **Right-Side Slide-Over Drawer (右側滑出抽屜)** 或 Pop-up，保證在任何捲動位置皆可流暢開啟與閱讀。
2. **右邊白列與下邊長得很奇怪，主要視窗要求盡量頁寬大**：
   - 舊版 `bazi.html` 容器寫死 `max-w-5xl` (1024px) 或 `max-w-7xl`，在寬螢幕 (iMac / 2K / 4K) 上兩側留白過大，且下半部有佈局截斷與死代碼干擾。
   - 要求全站主要視窗擴展至寬螢幕版型 (`w-full max-w-[1560px] 2xl:max-w-[1720px]`)，滿版大器，背景 `#F6F2EA` 完整覆蓋無白列破版。
3. **紫微牌卡正反面沒處理好**：
   - 卡背沒有正確顯示實體牌背圖片 (`images/ziwei/牌背-主星.jpg`、`牌背-輔星.jpg`、`牌背-長生.jpg`)，被 CSS 樣式覆蓋。
   - 翻牌 CSS 中 `.card-reversed` 錯誤使用 `transform: rotate(180deg)`，覆蓋了 `.card-front` 的 `rotateY(180deg)`，導致倒牌在 3D 翻轉後變成背面不可見！
   - 正牌與倒牌之卡面圖片應保持原始長寬比 (約 1:1.65)，倒牌時圖片須正確旋轉 180 度且牌面正面朝向讀者。長生牌必須突顯「1~12」時數。
4. **塔羅牌與雷諾曼牌卡畫的圖沒正常顯示**：
   - 原先只有文字與 emoji，沒有真正浮世繪風格的卡牌畫作。
   - 必須為 78 張塔羅牌與 36 張雷諾曼牌重構高質感浮世繪木版畫 (Ukiyo-e) 視覺繪圖 (精美向量 SVG 藝術圖或完整牌面繪製)，並配備江戶青海波/金箔幾何專屬牌背。

---

## 2. 系統架構與檔案規範 (Explore & MECE)
- 工作目錄：`/Users/alanlc/Documents/claudeai/100_Todo/projects/meetjoy-divination`
- 核心檔案：
  1. `bazi.html`：八字排盤主頁面，清理死代碼，主容器提升為 `max-w-[1560px]`，整合右側滑出神煞抽屜。
  2. `js/bazi-classic-view.js`：八字大盤／關係／神煞三視圖，對齊寬螢幕，綁定右側滑出抽屜 `openShenShaDrawer`。
  3. `divination.html`：線上占卜大典，重構 3D 翻牌架構、修復紫微實體卡牌正面與三大卡背圖、整合塔羅與雷諾曼浮世繪畫作、寬螢幕排版。
  4. `js/divination-cards.js`：塔羅 78 張與雷諾曼 36 張資料庫，注入浮世繪視覺繪圖 SVG/圖形生成器與深度解讀。
  5. `js/ziwei-cards-complete.js`：紫微斗數 70 張全牌庫與 3 大實體牌背路徑對齊。

---

## 3. 具體實施規格 (Decide & Tasks)

### 任務 A：八字大典寬螢幕化與右側滑出神煞抽屜
1. **右側滑出抽屜 (`#shensha_drawer` + `#shensha_backdrop`)**：
   - 遮罩：`fixed inset-0 bg-black/50 backdrop-blur-xs z-[99] transition-opacity duration-300 hidden`
   - 抽屜：`fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-white shadow-2xl z-[100] flex flex-col transition-transform duration-300 transform translate-x-full`
   - 內容包含：神煞徽章、名稱、吉凶五行屬性、白話生活化解說、若逢空亡之特殊意義、愛倫魔藥師調頻處方（精油、晶石、微儀式、正向肯定句）。
   - 支援點擊遮罩關閉、按 `✕` 關閉、按 `ESC` 鍵關閉。
2. **版面寬度與容器清理**：
   - 移除 `bazi.html` 內重複的 500 行舊 `renderUnifiedBaziView` 代碼。
   - 外層 `<main>` 與卡片容器調整為 `w-full max-w-[1560px] 2xl:max-w-[1720px] px-3 sm:px-8`。
   - 背景設為全局 `bg-[#F6F2EA]`，避免橫向捲動產生白列。

### 任務 B：紫微牌卡實體正反面與 3D 翻牌修復
1. **實體卡背保證顯示**：
   - 主星牌背：`./images/ziwei/牌背-主星.jpg`
   - 輔星牌背：`./images/ziwei/牌背-輔星.jpg`
   - 長生牌背：`./images/ziwei/牌背-長生.jpg`
   - 卡背 `div` 內置 `<img>` 或使用專屬樣式，確保不受外部背景漸層覆蓋。
2. **3D 翻牌與倒牌修正**：
   - `.card-inner`：`transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); transform-style: preserve-3d;`
   - `.card-inner.flipped`：`transform: rotateY(180deg);`
   - `.card-back`：`backface-visibility: hidden; position: absolute; inset: 0;`
   - `.card-front`：`backface-visibility: hidden; position: absolute; inset: 0; transform: rotateY(180deg);`
   - 倒牌處理：當 `isReversed: true` 時，將卡面內部圖片加上 `transform: rotate(180deg);`（而非直接旋轉 `.card-front`），確保正面 180 度翻轉後圖片倒置，文字標籤維持可讀！
3. **長生牌突出時間數值**：
   - 牌面與解讀報告中，清晰標示「時間數值：1～12（天／週／月）」。

### 任務 C：塔羅與雷諾曼浮世繪藝術卡面繪製
1. 為 78 張塔羅牌與 36 張雷諾曼牌提供專屬浮世繪繪圖 (Ukiyo-e Art Canvas)，融入江戶和風波紋、富士靈山、櫻花落葉、浮世人物等傳統木版畫構圖。
2. 塔羅牌背採用深藍江戶青海波紋與金邊菊紋；雷諾曼牌背採用古金祥雲赤漆風格。
3. 支援一鍵切換「🌊 浮世繪風格 / 🔮 現代典雅風格」。

---

## 4. 驗收標準 (DoD)
- 100% 繁體中文（台灣）。
- 嚴格落實 Zero Attribution（無任何外部導師名）。
- 杜絕「不是X而是Y」AI 文案腔。
- Playwright 自動化測試通過，0 Console Error。
