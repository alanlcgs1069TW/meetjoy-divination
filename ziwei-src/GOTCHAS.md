# GOTCHAS — 工程陷阱與已知非直覺行為

> 這裡記錄踩過的坑、引擎 quirks、運維注意事項。
> 遇到相關問題時先查這裡。

## 大限看實歲、小限看虛歲 —— 兩者差 1 是定義，不是 bug（2026-07-09）

**結論：`decadal.ts`（大限，無 +1）與 `minorLimit.ts`（小限，有 +1）都正確，已對照 dreamkinin（學會版）驗證一致，不要「對齊」它們。**

學會講義定義：
- **實歲** = 西元年 − 出生西元年（需注意是否跨農曆除夕）
- **虛歲** = 實歲 + 1
- **大限看實歲**；**小限看虛歲**

對應程式（皆以農曆生年為基準，故用 `lunarBirthYear`，自動處理「農曆除夕前出生」跨年）：
- 大限 `getCurrentDecadal`：`queryYear − lunarBirthYear`（＝實歲，**無 +1**）
- 小限 `getCurrentMinorLimit`：`queryYear − lunarBirthYear + 1`（＝虛歲，**有 +1**）
- `YearlyTimeline` 歲數標籤 = 實歲（與大限同基準）

### 為什麼容易被誤判成 bug
同一年，大限標「實歲 N」、小限落「虛歲 N+1」的宮位，看起來像小限超前一格。例：農曆壬戌年底出生的陽男，1986 大限**實歲4**、小限**虛歲5（申）** —— 兩者差 1 是「實歲 vs 虛歲」，**不是 off-by-one bug**。dreamkinin 完全相同。

### 陷阱
- 「1 歲小限應在辰」的直覺會誤導：小限起運宮辰 = **虛歲1 = 實歲0**，對應農曆生年（時間軸實歲從 1 起、不畫實歲0），所以時間軸「1 歲」格顯示的是虛歲2（巳），**與 dreamkinin 一致、非錯**。
- 驗證任何歲數問題**一律以 dreamkinin 實盤為地面真相**，不靠推理猜基準。

## 進階模式焦點視窗：焦點層 = 最深顯示層，往上補兩層（2026-06-14）

`App.tsx` 的 `advLayers` 決定盤面疊哪些運線層（natal/decadal/yearly/monthly/daily）。規則：

- **視窗 = `[focus-2, focus]`**：焦點層本身是「最深」顯示層，往上補兩層較粗的層。
  - 焦點流月 → 大限／年／月；焦點流日 → 年／月／日。
- **焦點不往更深延伸**：即使深層仍有選擇（如已選流日），按「流月」也只顯示到流月（回乾淨流月盤）。`effectiveFocus` 已 clamp ≤ 最深選擇 `advLevel`，但視窗上緣用 `focus` 本身、**不要**用 `advLevel`（否則流日選著時按流月仍會疊流日）。
- **切換焦點保留選擇**：`focusLevel` 與各 `selectedX` 獨立；點 chip 的 refocus 鍵只改 `focusLevel`。
- 陷阱：「本月」≠「今日」。`goThisMonth()` 只到月層（清流日）；`goToday()` 會設流日 + 聚焦流日。別讓「本月」呼叫到 `goToday()`。

## 天馬用「節氣月」不是「農曆月」（2026-05-20 釐清）

### 症狀
天馬位置怎麼推都對不上 DK。試過：
- 年支三合驛馬（傳統公式）
- 命宮支查表（舊 code 用這個）
- 農曆月支三合驛馬
- 身宮驛馬

全部最高 2/5 對。代數窮舉證明 (年支, lm, 命宮, ti, isLeap) 任何線性組合 mod 12 都無解。

### 根本原因
天馬用的是**節氣月支**，不是農曆月支：
- **農曆月**：正月、二月、…、十二月（看月相 / 朔望）
- **節氣月**：立春→寅月、驚蟄→卯月、清明→辰月、…（看太陽位置）

兩者大部分時候差一點（節氣月切換在月中），但在「立春前一天（如 2021-02-02）」這種日子，農曆是十二月（丑），節氣月已經是丑（前一年的丑月延續），看起來一樣；但 2023-04-05 凌晨 0:30 這種剛好在 清明 09:13 邊界附近，誤差就出來了。

### 正確做法
1. 取出 `lunar.getMonthInGanZhi()` 的月干支字串
2. 從末尾抽地支字（如「庚寅」→「寅」）
3. **晚子時要 date+1 才能跨節氣**（既有 `createAstrolabe.ts` 的 `calcDate` 變量就是這個）
4. 查表：申子辰月→寅, 寅午戌月→申, 亥卯未月→巳, 巳酉丑月→亥

詳見 `FORMULAS.md` §5.5 天馬段。

### 為何確定是節氣月支
對照學會版排盤結果，天馬只隨節氣月支變動、不隨農曆月或命宮變動，對應的 12 格位置正是上述三合驛馬規則。

### 8 筆驗證全對（2026-05-20）
case-3 / case-8 / case-2 / case-1 / case-4 / Test D / Test E / Test F = 8 筆有完整資料，全對。
另 1 筆資料不全，未計。


## 雙胞胎盤 computeIsForward 陷阱（2026-05-06 修正）

### 症狀
`twinChart.ts` 的 `computeIsForward()` 永遠回傳 `true`，造成逆行年份的雙胞胎盤大限方向錯誤（顯示順行，實際應逆行）。

### 根本原因
原版只比較 CW 鄰宮 vs 命宮：
```ts
return (nextPalace?.decadal.range[0] ?? 0) > (mingGong.decadal.range[0] ?? 0);
```
命宮永遠是一限（range=startAge），任何其他宮都比它大（順行 CW=startAge+10，逆行 CW=startAge+110），所以永遠回傳 true。

### 正確做法
比較 **CW 鄰宮 vs CCW 鄰宮**：
- 順行：CW=step1（range+10）< CCW=step11（range+110）→ true ✓
- 逆行：CW=step11（range+110）> CCW=step1（range+10）→ false ✓

```ts
function computeIsForward(original: ZiweiChart): boolean {
  const mingGong = original.palaces.find(p => p.name === '命宮');
  if (!mingGong) return true;
  const mingBranchIdx = BRANCH_ORDER.indexOf(mingGong.earthlyBranch);
  const cwBranch  = BRANCH_ORDER[(mingBranchIdx + 1) % 12];
  const ccwBranch = BRANCH_ORDER[(mingBranchIdx - 1 + 12) % 12];
  const cwPalace  = original.palaces.find(p => p.earthlyBranch === cwBranch);
  const ccwPalace = original.palaces.find(p => p.earthlyBranch === ccwBranch);
  return (cwPalace?.decadal.range[0] ?? Infinity) < (ccwPalace?.decadal.range[0] ?? 0);
}
```

### 歷史 bug 軌跡（雙 bug 抵銷陷阱）
- **舊版部署**：periodNum=newIdx（for isForward=true），isForward 永遠 true → 逆行twin偶然正確，順行twin錯誤
- **中間版**：periodNum=(12-newIdx)%12，isForward 永遠 true → 順行twin正確，逆行twin錯誤
- **修正版**：periodNum=(12-newIdx)%12 or newIdx，isForward 正確偵測 → 兩者均正確

### 驗證案例
- case-7（己丑年，逆行）Twin2：命宮=巳，正確為 巳→辰→卯（遞減）
- 壬戌年 順行 Twin2：命宮=申，正確為 申→酉→戌（遞增）

---

## 博士十二神起點錯誤（2026-05-18 修正）

### 症狀
博士十二神全部錯位，case-4 12 宮均不符合學會版排盤。

### 根本原因
起始地支用了 `mingBranchIdx`（命宮），應為 `LU_CUN_MS[yearStemIdx]`（**年干祿存**）。

### 正確規則
**博士 = 年干祿存所在地支，逆行（地支遞減）**
```ts
const boShiStart = LU_CUN_MS[yearStemIdx];  // 年干祿存
branchIdx = ((boShiStart - i) % 12 + 12) % 12;  // 逆行
```

### 驗證
庚年（祿存=申=8）：博士→申 力士→未 … 12 宮對照全部一致 ✓

---

## 長生十二神方向被「修正」了兩次（2026-05-18）

### 第一次錯誤 → 修正
原始程式碼：陽干→順行（錯），陰干→逆行（實際正確）。
針對 case-4（庚=陽干）對照修正：陽干→逆行 ✓，同時**錯誤地**把陰干改為→順行。

### 第二次錯誤 → 最終修正
修正後陰干（己年 case-5）長生顯示錯誤：遷移=養（應=沐浴）、僕役=胎（應=冠帶）。

### 正確規則
> ⚠️ 2026-05-19 再修正：方向依 `isForward = (isMale === isYangStem)`（陽男陰女順、陰男陽女逆），**並非一律逆行**；下方是 05-18 當日的紀錄，程式以 `FORMULAS.md` 為準。

**（05-18 紀錄）長生十二神一律逆行（地支遞減），陰陽干相同**
```ts
branchIdx = ((changShengStart - i) % 12 + 12) % 12;  // 一律逆行
```

### 驗證
- 庚年陽干 火六局 寅(2)起逆：case-4 12 宮全部一致 ✓
- 己年陰干 水二局 申(8)起逆：case-5 遷移=沐浴、僕役=冠帶、官祿=臨官 ✓
- 壬年陽干 木三局 亥(11)起逆：case-1 4 宮對照全部一致 ✓

---

## 天馬 TIAN_MA 陣列兩次錯誤（2026-05-18 最終修正）

> ⛔ **此節已被取代**（2026-05-20）：天馬最終規則是**節氣月支**三合驛馬（`[2,11,8,5,…]`），見上方「天馬用『節氣月』不是『農曆月』」與 `FORMULAS.md` §5.5。本節只是修正歷程，**不要照本節的命宮支陣列改程式**。

- 天馬依**命宮支**查表（非年支），`mingBranchIdx = ((lunarMonth+1)%12 - timeIndex + 12) % 12`
- 正確陣列：`[8, 11, 11, 5, 8, 11, 11, 5, 8, 11, 11, 5]`（命宮%4→ 0=申,1=亥,2=亥,3=巳）
- 第一次錯誤陣列（FORMULAS.md殘留）：`[6, 11, 8, 1, ...]`
- 第二次錯誤陣列（2026-05-07修正後）：`[2, 8, 11, 5, ...]`（只對了 6→亥、11→巳，其他全錯）
- 驗證 5 筆：子→申(case-1) ✓, 丑→亥(case-4) ✓, 辰→申(case-2) ✓, 午→亥(case-8) ✓, 亥→巳(case-6) ✓

## 四化配色曾在三個檔案各寫一份（2026-08-11 收斂）

同一組四化顏色（祿/權/科/忌）原本在三處各自硬寫字面值：

| 檔案 | 用途 |
|------|------|
| `PalaceCell.tsx` | 飛化星曜外框（`--fx-stroke`） |
| `FeixingLine.tsx` | 自化箭頭（line stroke + path fill） |
| `CenterInfo.tsx` | 中央卡圖例 `.fx-lg` |

改色時**必須三處同步，漏一處會靜默不一致且不會報錯**（TypeScript 無從得知這三個字串該相等）。
2026-08-11 調權的顏色時正好踩到，才發現有三份副本。

→ 已抽成 `src/lib/huaColors.ts` 的 `HUA_COLORS`，三處改為 import。**不要再在任何地方寫死這四個色碼。**

選色限制（寫在該檔註解，改色前先看）：
- 忌維持紅 `#c0392b`（學會慣例）
- 避開運線層色：大限 `#9b6a30` / 流年 `#1a7a6b` / 流月 `#8a4fb0` / 流日 `#c43e8e` / 流時 `#d1671f`
- 避開無彩色區間：輔煞星 `#1a1a1a`、干支 `#888` —— 灰階的化會被讀成「一顆比較深的普通星」

## 簡體字典有 5 個缺口（2026-09-12 發現，未修）

`src/i18n/index.ts` 的字典只在簡繁有差異時才加 `'zh-CN'` 欄位（146 條中 51 條有），
**這個設計是對的** —— 字形相同時 fallback 回繁體即可。

但下列 5 條含繁體專用字卻漏了 `'zh-CN'`，簡體模式會顯示繁體字形：

`歲建`、`喪門`、`歲驛`、`化祿`、`化權`

未修的原因：字典內容依規範不由 AI 自行增修（原作者的規範）。
要補的話比照現有格式加 `'zh-CN'` 欄位即可。

## 運線 overlay 星曜命名（學會版，dreamkinin 標準）
- **大限**：限祿、限羊、限陀（依大限天干）→ **無限馬**
- **流年**：年祿、年羊、年陀、年鸞、年喜（依流年天干/年支）→ **無年馬**
- 天馬（本命）只出現在本命盤，不在 overlay 顯示
- i18n 對應：`限祿/限羊/限陀`、`年祿/年羊/年陀/年鸞/年喜`（`src/i18n/index.ts` STAR_DICT）

## 大限/流年 overlay 宮位方向 bug（2026-05-05 修正）
- **正確公式**：`offset = (palaceIdx - startIdx + 12) % 12`（CCW from 大限/流年命宮）
- **錯誤版本**：`(startIdx - palaceIdx + 12) % 12`（方向完全反，命宮會顯示大父而非大兄）
- 代碼位置：`src/i18n/index.ts` → `getDecadalOverlay` / `getYearlyOverlay`

## 排盤引擎

- **農曆字串字符：`〇` 非 `零`**：農曆年字串慣用 `〇`（U+3007，圓圈零）而非 `零`（U+96F6，漢字零）。任何解析農曆年字串的地方（如 `lunarToArabic`）都必須同時處理兩個字符，否則 2000 年後出生者（如 2009 = 二〇〇九年）的年份 parse 會得到 NaN，導致白屏崩潰
- **虛歲 vs 實歲**：大限範圍（`palace.decadal.range`）為**實歲**，偵測活躍大限用
  `農曆流年 − 農曆生年`（**無 +1**，見 `decadal.ts`）；小限才是虛歲（有 +1）。
  ⚠️ 本條 2026-09-12 更正 —— 原本寫成「range 為虛歲、需 +1」，與本檔開頭「大限看實歲」
  一節、`FORMULAS.md` §8 及實際程式全部牴觸。照舊敘述去改會製造 off-by-one。
- **農曆年 vs 陽曆年**：正月前出生者（農曆年 ≠ 陽曆年），陰陽/流年計算必須用**農曆出生年**，不可用陽曆年；用 `lunarToArabic(birthInfo.lunarDate)` 取得

## Supabase 運維

- **env var 空值**：`.env.local` 缺 `VITE_SUPABASE_URL`／`VITE_SUPABASE_ANON_KEY` 時 client 用佔位值啟動、console 報錯，排盤照常，只有 auth/sync 不能用（早期版本會白屏，已修）
- **Free tier 閒置暫停**：閒置 7 天自動暫停，需設 cron ping（cron ping）
- **PASSWORD_RECOVERY 攔截**：由 `onAuthStateChange` 監聽 PASSWORD_RECOVERY 事件 → 觸發 ResetPasswordModal，不走一般路由
- **`resetPasswordForEmail` redirectTo**：用 `VITE_SITE_URL` 環境變數，fallback `window.location.origin`；Supabase 的 Redirect URLs 需包含**每一個**實際部署網域（換網域時 Cloudflare 環境變數與 Supabase Redirect URLs 兩邊要一起改）

## lunar-javascript 陷阱（Phase 0，2026-05-03）

- **月干支**：`lunar.getMonthGanIndex()` / `getMonthZhiIndex()` 用**節氣月**（Solar term），紫微斗數用**農曆月**。兩者在同一個陽曆日可能差一個月（如 3/15 在驚蟄後已是卯月，但農曆仍是正月）。必須自行用「五虎遁年起月法」從農曆月份推算。
- **時干支**：`getTimeGanIndex()` 不能直接帶 timeIndex 使用。必須自行用「五鼠遁日起時法」：`(HOUR_STEM_START[dayGanIdx % 5] + timeIndex) % 10`，其中 `HOUR_STEM_START = [0, 2, 4, 6, 8]`（甲/己→0, 乙/庚→2, 丙/辛→4, 丁/壬→6, 戊/癸→8）。

## CSS 垂直模式 badge 對齊陷阱（2026-05-04）

### 症狀
四化 badge 在中文垂直模式下水平偏移，`translateX` hack 只在特定 viewport size 下偶然正確，換機器或調整視窗就再次歪掉。

### 根本原因
`.star` 上同時設了 `display: block; writing-mode: vertical-lr`。  
- `display: block` 使元素在 flex parent 中被「blockified」，`align-items` / `align-self` 對它完全無效。  
- `getComputedStyle(el).alignItems` 回傳 `"normal"` 而非 `"center"`，即使 CSS 明確寫了 `align-items: center`。  
- 任何後續的 `translateX` 補正都是在補錯誤，不可能跨所有 viewport 正確。

### 正確做法
將 `writing-mode` 下移到 `.star-zh`，讓 `.star` 保持物理 flex 軸：

```css
/* 垂直模式 */
[data-show-pinyin="false"][data-locale^="zh"] .star {
  display: flex;
  flex-direction: column;
  align-items: center;       /* ← 在 horizontal-tb 軸上正常生效 */
  writing-mode: horizontal-tb;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 1px;
}
[data-show-pinyin="false"][data-locale^="zh"] .star-zh {
  writing-mode: vertical-lr; /* ← 只有文字本身垂直 */
  text-orientation: upright;
}
[data-show-pinyin="false"][data-locale^="zh"] .mutagen-badge {
  writing-mode: horizontal-tb; /* badge 保持水平 */
  margin-left: 0;
  padding: 0 2px;
  /* 不需要任何 translateX */
}
```

### 驗證方式
```js
// 在瀏覽器 console 量測：
const stars = document.querySelectorAll('.star');
const offsets = [...stars].map(s => {
  const sr = s.getBoundingClientRect();
  const br = s.querySelector('.mutagen-badge')?.getBoundingClientRect();
  if (!br) return null;
  const hCenter = sr.left + sr.width / 2;
  return Math.abs((br.left + br.width / 2) - hCenter).toFixed(1);
}).filter(Boolean);
// 修正後全部回傳 "0.0"
```

---

## 大限方向與陰陽標籤（2026-05-06 確認，dreamkinin 驗證）

### 大限方向：`isMale === isYangStem`

傳統規則「陽男陰女順，陰男陽女逆」（紫微斗數 public domain knowledge；陰女=陰年女，陽女=陽年女）：
- 陽男（陽年男）→ 順：true===true=true ✓
- 陰女（陰年女）→ 順：false===false=true ✓
- 陰男（陰年男）→ 逆：true===false=false ✓
- 陽女（陽年女）→ 逆：false===true=false ✓

```ts
const isDecadalForward = isMale === isYangStem;
```

代碼位置：`src/lib/engine/native/nativePalaces.ts`

**dreamkinin 驗證**：
| 案例 | 年干 | 性別 | 方向 |
|------|------|------|------|
| case-7/case-6 己丑 | 陰 | 女 | 順行（乙亥→丙子→丁丑）✓ |
| case-9 戊戌 | 陽 | 女 | 逆行（王戌→辛酉→庚申）✓ |
| case-10 壬戌 | 陽 | 男 | 順行（王寅→癸卯→甲辰）✓ |
| case-8 己未 | 陰 | 男 | 逆行（庚午→己巳→戊辰）✓ |

⚠️ **歷史錯誤**（2026-05-05 commit 誤改）：曾錯誤改成 `isDecadalForward = isYangStem`，以為方向與性別無關。此公式只對男命正確，對女命全反。

### 陰陽標籤：直接用年干，男女相同，不翻轉

- 陽年出生 → **陽**男 / **陽**女
- 陰年出生 → **陰**男 / **陰**女

```ts
function getYinYang(lunarYear: number): '陽' | '陰' {
  const stemIdx = ((lunarYear - 4) % 10 + 10) % 10;
  return stemIdx % 2 === 0 ? '陽' : '陰';
}
```

代碼位置：`src/components/CenterInfo.tsx`

---

## 閏月命宮陷阱：Math.abs() 丟失閏月符號（2026-05-19 修正）

### 症狀
生於閏月的用戶命宮計算錯誤，所有主星跑到錯誤宮位。

### 根本原因
`lunar-javascript` 對閏月回傳**負數月份**（閏四月 = `getMonth() = -4`）。
舊代碼 `Math.abs(-4) = 4`，把閏月視同正四月，lm=4 → 命宮算錯。

### 正確規則：十五分界法（2026-05-20 驗證確認）✅
閏月以第 16 日為分界：
- **ld 1–15（含）**：視為當月，lm 不進 → 閏四月十五 = lm=4
- **ld 16+**：視為下月，lm+1 → 閏四月廿 = lm=5

### 最終修正（`lunarConverter.ts`）
```ts
const rawMonth = lunar.getMonth();
const isLeap   = rawMonth < 0;
const lunarDay = lunar.getDay();
const absMonth = Math.abs(rawMonth);
// 十五分界法
const lunarMonth = (isLeap && lunarDay >= 16) ? absMonth + 1 : absMonth;
```

### 驗證（3 筆）
| 案例 | ld | lm | 命宮 | DK |
|------|----|----|------|-----|
| case-1 1982 閏四月廿  | 20 | 5 | 子 | ✅ |
| 測試B 2020 閏四月十五 | 15 | 4 | 亥 | ✅ |
| 測試C 1963 閏四月十五 | 15 | 4 | 亥 | ✅ |

### ⚠️ 常見錯誤：不加分界直接 +1
第一次修正（`isLeap ? absMonth+1 : absMonth`）對 ld≥16 正確，但對 ld≤15 仍錯。
必須加 `&& lunarDay >= 16` 條件。

---

## 命宮/身宮 計算陷阱（Phase 1，2026-05-03）

- **五行局 = 命宮干支的納音五行**，不是月份或年份的五行。須先算出命宮天干，再查 30 對納音表。
- **身宮公式**：正確為 `(命宮branch + 2 * timeIndex) % 12`（等同「月落宮 + ti」，順數時辰）。看起來像 +2ti 應該是 -2ti，但 dreamkinin 實測確認 +2ti 才對。
- **宮位方向**：宮位從命宮**逆時針**排列（branch 遞減），即：  
  `兄弟 = 命宮-1, 夫妻 = 命宮-2, … 遷移 = 命宮-6, … 父母 = 命宮-11`  
  注意：遷移 offset=6 和 -6 mod 12 相等，容易掩蓋方向錯誤；夫妻 offset=2 和 -2 mod 12 不等（2 ≠ 10），才會被發現。
- **測試 PALACE_BRANCH 陷阱**：若用 `shenExpected = (mingIdx + palace_offset) % 12` 寫測試，遷移/福德 offset 對稱（offset 6 = -6 mod 12, offset 10 = -2 mod 12），只有夫妻（offset 2 ≠ -2 mod 12）才能暴露方向錯誤。因此測試要用 `(mingIdx - CCW_STEPS[palace] + 12) % 12`。

---

## 納音五行局：手打查表的 typo（2026-06-05 修正）

### 症狀
命宮落在 **庚寅** 或 **辛卯** 的命盤，五行局被算成**土五局**（應為**木三局**）。連帶紫微星錯位 → 14 主星全移位、大限起運差 2 歲、童限等全錯。其他命宮的盤完全正常。

### 根本原因
`mingGong.ts` 的 `NAYIN_WUXING` 是**人工硬編碼**的 30 對納音五行查表（非公式推導）。index 13（庚寅辛卯＝松柏木＝木）被手 key 成「土(4)」而非「木(1)」。納音五行**有週期性**（每 15 格重複），同一位置在 row5 打對、row2 打錯——典型單格抄寫 typo；旁邊又一堆「土(4)」，肉眼難察。

### 為何潛伏這麼久
只影響 60 個命宮干支中的 2 個（庚寅/辛卯，約 3%）。先前所有驗證盤命宮都不在這兩格，從未觸發；直到一張辛卯命宮盤才暴露。

### 正確做法（已落實）
- 納音五行**有公式可推**（見 FORMULAS §2.4：干數+支數）。**2026-06-05 已把手打查表整個換成公式**（`nayinWuxing()`），根除 typo 來源。
- 換法：先補 typo，再做表版↔公式版**全盤逐字 diff**（主星/雜曜/宮位/運線，零差異）確認行為不變後才換。
- 原作者的驗證腳本（不隨交付包提供）：讀 source 公式常數跑全 60 甲子對標準納音（60/60）守門。

### 教訓
AI 手抄一張查表、又不加驗證 = 最容易埋 bug 的做法。能用公式就用公式；非得查表，就同時放一個對標準源的自動驗證。
