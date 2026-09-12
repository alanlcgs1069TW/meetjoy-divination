# 紫微斗數排盤公式 — 完整速查（學會版）

> 本文件是各模組公式的完整速查表，所有公式皆已通過 dreamkinin（紫微攻略）截圖驗證。
> 中英文字典屬純 UI，不寫入本文件（見 `src/i18n/index.ts`）。

---

## §0 通則與修改規則

### ⛔ AI 修改規則（強制）

**沒有 DK 截圖驗證，禁止修改任何查表陣列、起點、方向。** 違反此規則導致過天馬公式三次反覆改錯。

修改任何公式前必須：

1. **說明來源**：學會講義、學會版排盤、或 ≥N 筆 DK 截圖
2. **驗證標準**：
   - ≥5 筆非閏月 + ≥3 筆閏月案例，全部對 DK
   - 涵蓋四馬地（寅申巳亥）四個年支三合組各 ≥1 筆
   - 涵蓋多種時辰（子/午 + 其他至少 2 種）
3. **禁止循環驗證**：不可用 app 自己的 output 比對 app 自己，必須對 DK 截圖
4. **更新對應 ✅ VERIFIED 日期**（含 HH:MM，台北時區）
5. **§17 修改記錄新增 entry** 必須附 `YYYY-MM-DD HH:MM` 時間戳

> ⚠️ **交付版說明**：原始驗證命例為真實命盤，已依隱私要求移除，本檔所列「N 筆驗證」為歷史紀錄。
> 接手者手上沒有那些截圖，請改為自建幾張有把握的基準盤再逐宮比對；本檔的公式說明足以判斷結果對錯。


### 三種「月」的差異（極重要）

| 月種類 | 切換點 | lunar-javascript API | 用途 |
|--------|--------|---------------------|------|
| **農曆月**（朔望月） | 新月 / 月相 | `lunar.getMonth()`（閏月回負）| 命宮、五行局、左輔、右弼、月柱（紫微）等多數計算 |
| **節氣月**（太陽月） | 立春、驚蟄… | `lunar.getMonthInGanZhi()` | **天馬**、流月四化、月祿羊陀 |
| **陽曆月** | 1 日 | solarDate 直接 | 不直接用於排盤 |

兩者大部分時候差幾天，邊界日子（特別是月初接近節氣切換點）會給不同結果。

### 晚子時處理

`createAstrolabe.ts` 對 `timeIndex === 12` 的處理：
- `calcDate = solarDate + 1 day`
- `calcTimeIndex = 0`

所有後續計算用 `calcDate` + `calcTimeIndex`。`birthInfo` 保留原始日期供顯示。

### 陽曆 vs 農曆 年支差異（極重要）

| 年支類型 | 計算 | 用於哪些星 |
|----------|------|-----------|
| **農曆年支** (yb) | `solarToLunar()` 回傳的 yearBranch | 月德/孤辰/寡宿/破碎/蜚廉 + **小限起始地支** |
| **陽曆年支** (solarYb) | `((solarYear - 4) % 12 + 12) % 12` | 咸池/華蓋/天德/龍德/歲前十二神/年支十二神 |

差異情境：出生於正月前（約 Jan 1 ~ Feb 4），農曆仍屬前一年，陽曆已換年。

---

## §1 農曆轉換

**檔案**：`src/lib/engine/native/lunarConverter.ts`

### 1.1 閏月處理（十五分界法）✅ VERIFIED 2026-05-20（3 筆）

```ts
rawMonth = lunar.getMonth()           // 閏月為負，如閏四月 = -4
isLeap   = rawMonth < 0
absMonth = |rawMonth|                 // 4
lunarDay = lunar.getDay()

// 十五分界法：以第 16 日為界
lunarMonth = (isLeap && lunarDay >= 16) ? absMonth + 1 : absMonth
```

| 規則 | 說明 | 舉例 |
|------|------|------|
| ld 1–15 | 視為當月，lm 不進 | 閏四月十五 → lm=4 |
| ld 16–30 | 視為下月，lm+1 | 閏四月廿 → lm=5 |

**驗證**：某例(ld=20)/測試B(ld=15)/測試C(ld=15) 3/3 ✅

### 1.2 節氣月地支 ✅ VERIFIED 2026-05-20

```ts
solarTermGanZhi = lunar.getMonthInGanZhi()        // 例 "庚寅"
solarTermBranchChar = solarTermGanZhi.charAt(last) // "寅"
solarTermMonthBranch = BRANCHES.find(b => b === branchChar)
```

**注意**：呼叫前 solarDate 必須已處理晚子時 +1。

### 1.3 年干 / 年支

```ts
yearStemIdx   = ((lunarYear - 4) % 10 + 10) % 10   // 0=甲…9=癸
yearBranchIdx = ((lunarYear - 4) % 12 + 12) % 12   // 0=子…11=亥
```

### 1.4 月干（五虎遁年起月）

```ts
MONTH_STEM_START = [2, 4, 6, 8, 0]
// 甲己年→丙(2), 乙庚→戊(4), 丙辛→庚(6), 丁壬→壬(8), 戊癸→甲(0)

monthStemIdx = (MONTH_STEM_START[yearStemIdx % 5] + lunarMonth - 1) % 10
```

### 1.5 月支

正月=寅(2), 二月=卯(3), …, 十一月=子(0), 十二月=丑(1)

```ts
monthBranchIdx = (lunarMonth + 1) % 12
```

### 1.6 時干（五鼠遁日起時）

```ts
HOUR_STEM_START = [0, 2, 4, 6, 8]
// 甲己日→甲子(0), 乙庚→丙子(2), 丙辛→戊子(4), 丁壬→庚子(6), 戊癸→壬子(8)

dayGanIdx   = lunar.getDayGanIndex()
hourStemIdx = (HOUR_STEM_START[dayGanIdx % 5] + timeIndex) % 10
```

### 1.7 時支

```ts
hourBranchIdx = timeIndex % 12   // 子=0, 丑=1, …
```

---

## §2 命宮 / 身宮 / 五行局

**檔案**：`src/lib/engine/native/mingGong.ts`

### 2.1 命宮地支

```ts
yueLuo  = (lunarMonth + 1) % 12   // 月支
mingIdx = (yueLuo - timeIndex + 12) % 12
```

### 2.2 命宮天干（五虎遁）

```ts
base   = MONTH_STEM_START[yearStemIdx % 5]
offset = (mingBranchIdx - 2 + 12) % 12   // 從寅(2)起算
stemIdx = (base + offset) % 10
```

### 2.3 身宮地支

```ts
shenIdx = (mingIdx + 2 * timeIndex) % 12
```

### 2.4 五行局 ✅ VERIFIED 2026-06-05（學會五局全齊 + 公式 60/60）

命宮干支查**納音五行**，五行對應局數：金→四局、木→三局、水→二局、火→六局、土→五局。

**納音五行公式（口訣，可取代查表，不分門派）**

```
干數：甲乙=1 丙丁=2 戊己=3 庚辛=4 壬癸=5   → floor(stemIdx/2)+1
支數：子丑/午未=1 寅卯/申酉=2 辰巳/戌亥=3   → (floor(branchIdx/2) % 3)+1
和 = 干數 + 支數；若 > 5 則 −5
和 → 五行：1=木 2=金 3=水 4=火 5=土
```

例：辛卯 → 辛=4 + 卯=2 = 6 → −5 = 1 → 木 → **木三局**（納音=松柏木）。

**實作**：`mingGong.ts` 的 `nayinWuxing(stemIdx, branchIdx)` 直接用上述口訣公式（編碼 0金1木2水3火4土）。**2026-06-05 由硬編碼查表改為公式**，根除手抄 typo 來源（改動經表版↔公式版全盤逐字 diff 證明零差異）。

**⚠️ 歷史 bug（2026-06-05 修正）**：原硬編碼納音表 `NAYIN_WUXING[13]`（庚寅辛卯對＝松柏木＝木）曾被手 key 成「土(4)」，導致**命宮落庚寅/辛卯者誤判土五局**（應木三局），連帶紫微錯位、大限起運差 2 歲。先補一格修正、再整個改為公式。

**驗證**：
- 納音曾以獨立腳本跑全 60 甲子對標準納音（60/60 通過）；該腳本含命例資料，未隨交付包提供。
- 表版↔公式版：5 盤(五局全涵蓋)主星/輔煞/雜曜/宮位/長生/大限 + 運線(四化/祿羊陀/宮職)逐字 diff，**零差異**。
- 學會（dreamkinin）實際輸出五局全齊對照：松柏木/桑柘木(木)、劍鋒金(金)、大海水/大溪水(水)、大驛土/屋上土(土)、霹靂火(火)。

---

## §3 宮位結構 / 大限 / 小限

**檔案**：`src/lib/engine/native/nativePalaces.ts`

### 3.1 12 宮名順序（CCW 從命宮）

| index | 宮名 |
|-------|------|
| 0 | 命宮 |
| 1 | 兄弟 |
| 2 | 夫妻 |
| 3 | 子女 |
| 4 | 財帛 |
| 5 | 疾厄 |
| 6 | 遷移 |
| 7 | 僕役 |
| 8 | 官祿 |
| 9 | 田宅 |
| 10 | 福德 |
| 11 | 父母 |

### 3.2 宮位地支

```ts
ccwOffset = 0…11
branchIdx = (mingBranchIdx - ccwOffset + 12) % 12
```

### 3.3 宮位天干

```ts
base   = MONTH_STEM_START[yearStemIdx % 5]
offset = (branchIdx - 2 + 12) % 12   // 地支偏移 0–11
stemIdx = (base + offset) % 10
// ⚠️ 必須先 %12 再 %10，順序不可互換
```

### 3.4 大限方向 ✅ VERIFIED 2026-05-19（6 筆）

```ts
isYangStem        = yearStemIdx % 2 === 0
isDecadalForward  = (isMale === isYangStem)
```

| 性別 | 年干 | 方向 |
|------|------|------|
| 陽男 / 陰女 | 同性陰陽 | 順行（CW，branch 遞增）|
| 陰男 / 陽女 | 異性陰陽 | 逆行（CCW，branch 遞減）|

### 3.5 大限步序

```
順行: decadalStep = (branchIdx - mingBranchIdx + 12) % 12
逆行: decadalStep = (mingBranchIdx - branchIdx + 12) % 12
```

### 3.6 大限虛歲範圍

```ts
decadalStart = fiveElementsJu + decadalStep * 10
decadalEnd   = decadalStart + 9
```

### 3.7 童限

```ts
// 虛歲 1 到 fiveElementsJu - 1
順行: 童限宮 = 父母宮（index 11）
逆行: 童限宮 = 兄弟宮（index 1）
// 判斷：兄弟大限起始 < 父母大限起始 → 順行
```

### 3.8 小限起始地支（**農曆年支**決定）

```ts
MINOR_START:
  亥卯未 → 丑(1)
  申子辰 → 戌(10)
  巳酉丑 → 未(7)
  寅午戌 → 辰(4)
```

### 3.9 小限虛歲（男順女逆）

```ts
男: r = (palaceBranchIdx - minorStartBranchIdx + 1 + 12) % 12
女: r = (minorStartBranchIdx - palaceBranchIdx + 1 + 12) % 12
firstAge = (r === 0) ? 12 : r
ages = firstAge, firstAge+12, firstAge+24, …
```

---

## §4 主星（14 顆）

**檔案**：`src/lib/engine/native/mainStars.ts`

### 4.1 紫微安星訣

依五行局 N 和農曆日 d：

```ts
// 求最小正整數 offset 使得 (d + offset) % N === 0
// ziweiIdx = (offset % 2 === 0) ? 4 + offset/2 : 4 - (offset+1)/2
// 從辰(4)起，偶數步順數，奇數步逆數
```

### 4.2 天府

```ts
tianFuIdx = (4 - ziweiIdx + 12) % 12   // 以辰(4)為對稱軸
```

### 4.3 紫微星系（從紫微 CW 偏移）

| 星曜 | CW 偏移 |
|------|---------|
| 天機 | -1 |
| 太陽 | -3 |
| 武曲 | -4 |
| 天同 | -5 |
| 廉貞 | -8 |

公式：`(ziweiIdx - n + 12) % 12`

### 4.4 天府星系（從天府 CW 偏移）

| 星曜 | CW 偏移 |
|------|---------|
| 太陰 | +1 |
| 貪狼 | +2 |
| 巨門 | +3 |
| 天相 | +4 |
| 天梁 | +5 |
| 七殺 | +6 |
| 破軍 | +10 |

---

## §5 輔星 / 六煞 / 天馬 / 地空劫

**檔案**：`src/lib/engine/native/luckyStars.ts`

### 5.1 祿存 / 擎羊 / 陀羅（年干起）✅ VERIFIED 2026-05-04

```ts
LU_CUN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]
// 甲→寅, 乙→卯, 丙→午, 丁→未, 戊→午,
// 己→未, 庚→申, 辛→酉, 壬→亥, 癸→子

祿存idx = LU_CUN[yearStemIdx]
擎羊idx = (祿存 + 1) % 12
陀羅idx = (祿存 - 1 + 12) % 12
```

> ⛔ 修改 LU_CUN 會同步影響擎羊、陀羅、大/流/小限祿羊陀、博士十二神起點。

### 5.2 天魁 / 天鉞（年干查表）✅ VERIFIED 2026-05-04

```ts
TIAN_KUI = [1, 0, 11, 11, 1, 0, 1, 6, 3, 3]
// 甲→丑, 乙→子, 丙→亥, 丁→亥, 戊→丑,
// 己→子, 庚→丑, 辛→午, 壬→卯, 癸→卯

TIAN_YUE = [7, 8, 9, 9, 7, 8, 7, 2, 5, 5]
// 甲→未, 乙→申, 丙→酉, 丁→酉, 戊→未,
// 己→申, 庚→未, 辛→寅, 壬→巳, 癸→巳
```

> ⛔ 壬/癸 曾被對調錯誤（2026-05-04 修正）。

### 5.3 左輔 / 右弼（農曆月起）✅ VERIFIED 2026-05-04

```ts
左輔idx = (3 + lunarMonth) % 12       // 辰(3)宮起正月，順行
右弼idx = (23 - lunarMonth) % 12      // 戌(10)宮起正月，逆行
```

### 5.4 文昌 / 文曲（時支起）✅ VERIFIED 2026-05-04

```ts
文昌idx = (10 - timeIndex + 12) % 12  // 戌(10)宮起子時，逆行
文曲idx = (4 + timeIndex) % 12         // 辰(4)宮起子時，順行
```

### 5.5 天馬（節氣月支三合驛馬）✅ VERIFIED 2026-05-20（9 筆 + 學會版排盤）

```ts
TIAN_MA = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5]
// 申子辰月(%4=0) → 寅(2)
// 丑巳酉月(%4=1) → 亥(11)
// 寅午戌月(%4=2) → 申(8)
// 卯未亥月(%4=3) → 巳(5)

天馬idx = TIAN_MA[solarTermMonthBranchIdx]   // ⚠️ 用節氣月支，不是農曆月，不是命宮支
```

**驗證結果**：原為 8 筆實際命盤全數相符，另 1 筆因缺完整生日未驗；命例資料因隱私已移除。

**來源**：對照 dreamkinin 公開資源找到 `tianMa.no="month_zodiac"`。

> ⛔ 修改前先看 `GOTCHAS.md` 天馬段，避免又被改為「年支」、「命宮支」、「農曆月支」等錯誤版本。

### 5.6 地空 / 地劫（時支起）✅ VERIFIED 2026-05-04

```ts
地空idx = (11 - timeIndex + 12) % 12  // 亥(11)宮起子時，逆行
地劫idx = (11 + timeIndex) % 12        // 亥(11)宮起子時，順行
```

### 5.7 火星 / 鈴星（年支四組 + 時支）✅ VERIFIED 2026-05-04

```ts
HUO_XING_BASE = [2, 3, 1, 9, 2, 3, 1, 9, 2, 3, 1, 9]
// 申子辰→寅(2), 巳酉丑→卯(3), 寅午戌→丑(1), 亥卯未→酉(9)

LING_XING_BASE = [10, 10, 3, 10, 10, 10, 3, 10, 10, 10, 3, 10]
// 寅午戌→卯(3), 其餘三組→戌(10)

火星idx = (HUO_XING_BASE[yearBranchIdx] + timeIndex) % 12
鈴星idx = (LING_XING_BASE[yearBranchIdx] + timeIndex) % 12
```

---

## §6 雜曜（本命）

**檔案**：`src/lib/engine/native/miscStars.ts`

### 6.1 年支系（陽曆 vs 農曆，重要區分）

| 星群 | 使用年支 |
|------|---------|
| 截空 | 農曆年干 |
| 孤辰/寡宿 | 農曆年支 |
| 破碎/蜚廉 | 農曆年支 |
| 月德 | 農曆年支 |
| 紅鸞/天喜/天哭/天虛 | 農曆年支 |
| 龍池/鳳閣/天空 | 農曆年支 |
| **咸池** | **陽曆年支** |
| **華蓋** | **陽曆年支** |
| 天德/龍德 | 陽曆年支 |
| 歲前十二神 | 陽曆年支 |
| 年支十二神 | 華蓋地支（非 solarYb！） |

### 6.2 華蓋 ✅ VERIFIED 2026-05-18

```ts
HUA_GAI_TABLE = [4, 1, 10, 7]
// 子辰申(yb%4=0)→辰(4), 丑巳酉(yb%4=1)→丑(1)
// 寅午戌(yb%4=2)→戌(10), 卯未亥(yb%4=3)→未(7)

huaGai = HUA_GAI_TABLE[solarYb % 4]
```

### 6.3 咸池（陽曆年支，三合桃花）

```ts
XIAN_CHI = [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0]
// 申子辰→酉, 丑巳酉→午, 寅午戌→卯, 卯未亥→子
// 等價：xianChi = (huaGai + 5) % 12
```

### 6.4 天德 / 龍德（陽曆年支）

```ts
天德idx = (solarYb + 9) % 12
龍德idx = (solarYb + 7) % 12
```

### 6.5 歲前十二神（陽曆年支起，11 顆）✅ VERIFIED 2026-05-18

| 星曜 | 公式 |
|------|------|
| 歲建 | `solarYb` |
| 晦氣 | `(solarYb+1)%12` |
| 喪門 | `(solarYb+2)%12` |
| 貫索 | `(solarYb+3)%12` |
| 官符 | `(solarYb+4)%12` |
| 小耗 | `(solarYb+5)%12` |
| 大耗 | `(solarYb+6)%12` |
| 龍德 | `(solarYb+7)%12` |
| 白虎 | `(solarYb+8)%12` |
| 天德 | `(solarYb+9)%12` |
| 弔客 | `(solarYb+10)%12` |
| 病符 | `(solarYb+11)%12` |

### 6.6 年支十二神（華蓋起，10 顆）✅ VERIFIED 2026-05-18

| 星曜 | 公式 |
|------|------|
| 華蓋 | `huaGai` |
| 劫煞 | `(huaGai+1)%12` |
| 災煞 | `(huaGai+2)%12` |
| 天煞 | `(huaGai+3)%12` |
| 指背 | `(huaGai+4)%12` |
| 咸池 | `(huaGai+5)%12` |
| 月煞 | `(huaGai+6)%12` |
| 亡神 | `(huaGai+7)%12` |
| 將星 | `(huaGai+8)%12` |
| 攀鞍 | `(huaGai+9)%12` |
| 歲驛 | `(huaGai+10)%12` |
| 息神 | `(huaGai+11)%12` |

> ⚠️ huaGai ≠ solarYb（除非 solarYb%4==0）。見 GOTCHAS.md「nianzhi 用錯基準」。

### 6.7 截空（年干）

```ts
JIEKONG_BY_YS = [8, 6, 4, 2, 0, 9, 7, 5, 3, 1]
// 甲→申, 乙→午, 丙→辰, 丁→寅, 戊→子,
// 己→酉, 庚→未, 辛→巳, 壬→卯, 癸→丑
// ⚠️ 原名「空亡」覆寫為「截空」
```

### 6.8 解神（農曆月）

```ts
JIESHEN = [8, 8, 10, 10, 0, 0, 2, 2, 4, 4, 6, 6]
// 正二→申, 三四→戌, 五六→子, 七八→寅, 九十→辰, 十一十二→午
解神idx = JIESHEN[lunarMonth - 1]
```

### 6.9 孤辰 / 寡宿（農曆年支）

```ts
GU_CHEN: 亥子丑→寅, 寅卯辰→巳, 巳午未→申, 申酉戌→亥
GUA_SU:  亥子丑→戌, 寅卯辰→丑, 巳午未→辰, 申酉戌→未
```

### 6.10 破碎 / 蜚廉（農曆年支）

```ts
PO_SUI:  子午卯酉→巳, 寅巳申亥→酉, 辰戌丑未→丑
FEI_LIAN = [8, 9, 10, 5, 6, 7, 2, 3, 4, 11, 0, 1]
// 子→申, 丑→酉, 寅→戌, 卯→巳, 辰→午, 巳→未,
// 午→寅, 未→卯, 申→辰, 酉→亥, 戌→子, 亥→丑
```

### 6.11 月德（農曆年支）

```ts
月德idx = (lunarYearBranchIdx + 5) % 12
// 例外：用農曆年支，不用陽曆
```

### 6.12 年干雜曜

```ts
天廚 = TIAN_CHU[ys]   // 甲→巳, 乙→午, 丙→子, 丁→巳, 戊→午,
                       // 己→申, 庚→寅, 辛→午, 壬→酉, 癸→亥
天官 = TIAN_GUAN[ys]  // 甲→未, 乙→辰, 丙→巳, 丁→寅, 戊→卯,
                       // 己→酉, 庚→亥, 辛→酉, 壬→戌, 癸→午
天福 = TIAN_FU2[ys]   // 甲→酉, 乙→申, 丙→子, 丁→亥, 戊→卯,
                       // 己→寅, 庚→午, 辛→巳, 壬→午, 癸→巳
```

### 6.13 天月（農曆月）

```ts
TIAN_YUE_MONTH = [-1, 10, 5, 4, 2, 7, 3, 11, 7, 2, 6, 10, 2]
// index 1=正月→戌, 2=二月→午, …
```

### 6.14 陰煞（農曆月）

```ts
YIN_SHA = [2, 0, 10, 8, 6, 4, 2, 0, 10, 8, 6, 4]   // index 0 = 正月
// 正月→寅, 二月→子, 每月逆 2
```

### 6.15 紅鸞 / 天喜 / 天哭 / 天虛（農曆年支）

```ts
紅鸞idx = ((3 - lunarYb) % 12 + 12) % 12    // 卯宮子年起，逆
天喜idx = (紅鸞 + 6) % 12                    // 紅鸞對宮
天哭idx = (6 - lunarYb + 12) % 12            // 午宮子年起，逆
天虛idx = (6 + lunarYb) % 12                 // 午宮子年起，順
```

### 6.16 龍池 / 鳳閣 / 天空（農曆年支）

```ts
龍池idx = (4 + lunarYb) % 12                 // 辰宮子年起，順
鳳閣idx = (10 - lunarYb + 12) % 12           // 戌宮子年起，逆
天空idx = (lunarYb + 1) % 12                 // 年支 +1
```

### 6.17 臺輔 / 封誥（時支）✅ VERIFIED 2026-05-19（封誥方向修正）

```ts
臺輔idx = (6 + timeIndex) % 12               // 午宮子時起，順
封誥idx = (2 + timeIndex) % 12               // 寅宮子時起，順
// ⚠️ 封誥 2026-05-19 從逆行 (2-ti+12)%12 改為順行 (2+ti)%12
```

### 6.18 天刑 / 天姚 / 天巫（農曆月）

```ts
天刑idx = (8 + lunarMonth) % 12              // 酉宮正月起，順
天姚idx = lunarMonth % 12                    // 丑宮正月起，順
TIAN_WU = [5, 8, 2, 11, 5, 8, 2, 11, 5, 8, 2, 11]   // 巳申寅亥四宮循環
天巫idx = TIAN_WU[lunarMonth - 1]
```

### 6.19 三台 / 八座 / 恩光 / 天貴（日 + 錨星）

```ts
三台idx = (zuoFuBranchIdx + lunarDay - 1) % 12          // 左輔起，日1在左輔宮
八座idx = (youBiBranchIdx - lunarDay + 1 + 36) % 12     // 右弼起，逆數
恩光idx = (wenChangBranchIdx + lunarDay - 2 + 12) % 12  // 文昌前一宮起
天貴idx = (wenQuBranchIdx + lunarDay - 2 + 12) % 12     // 文曲前一宮起
```

### 6.20 天才 / 天壽 / 天傷 / 天使（命宮 / 身宮衍生）

```ts
天才idx  = (mingBranchIdx + lunarYb) % 12        // 命宮 + 農曆年支
天壽idx  = (shenBranchIdx + lunarYb) % 12        // 身宮 + 農曆年支
天傷idx  = ((mingBranchIdx - 7) % 12 + 12) % 12  // 僕役宮（命宮逆7步）
天使idx  = ((mingBranchIdx - 5) % 12 + 12) % 12  // 疾厄宮（命宮逆5步）
```

### 6.21 旬空（六十甲子）

```ts
pos60   = 年干支在六十甲子中的序號（甲子=0…癸亥=59）
xunIdx  = Math.floor(pos60 / 10)              // 哪一旬（0–5）
旬空idx = 10 - xunIdx * 2                      // 取兩空中序數較小者
```

---

## §7 十二神序列

### 7.1 博士十二神 ✅ VERIFIED 2026-05-18 + 方向修正 2026-05-19

**起點**：年干祿存地支（**非命宮**）
**方向**：同大限方向 `isForward = (isMale === isYangStem)`

```ts
BO_SHI_12 = ['博士','力士','青龍','小耗','將軍','奏書','蜚廉','喜神','病符','大耗','伏兵','官符']
博士idx = LU_CUN[yearStemIdx]
// 順行：力士=博士+1, 青龍=博士+2, …
// 逆行：力士=博士-1, 青龍=博士-2, …
```

> ⚠️ 學會版兩組蜚廉並存（雜曜 + 博士序列），名稱一致（2026-05-20 修正）。

### 7.2 長生十二神 ✅ VERIFIED 2026-05-19/20（6 筆）

**起點**：五行局

```ts
JU_START_BRANCH = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 }
// 水二局→申, 木三局→亥, 金四局→巳, 土五局→申, 火六局→寅
```

**方向**：`isForward = (isMale === isYangStem)`（與大限相同）

```ts
名稱順序: 長生, 沐浴, 冠帶, 臨官, 帝旺, 衰, 病, 死, 墓, 絕, 胎, 養
順行: branchIdx = (start + i) % 12
逆行: branchIdx = (start - i + 12) % 12
```

> ⚠️「一律逆行」是 2026-05-18 舊錯誤；2026-05-19 改為 isForward。

---

## §8 四化（學會版）

**檔案**：`src/lib/engine/constants.ts`

| 年干 | 化祿 | 化權 | 化科 | 化忌 |
|------|------|------|------|------|
| 甲 | 廉貞 | 破軍 | 武曲 | 太陽 |
| 乙 | 天機 | 天梁 | 紫微 | 太陰 |
| 丙 | 天同 | 天機 | 文昌 | 廉貞 |
| 丁 | 太陰 | 天同 | 天機 | 巨門 |
| 戊 | 貪狼 | 太陰 | 右弼 | 天機 |
| 己 | 武曲 | 貪狼 | 天梁 | 文曲 |
| 庚 | 太陽 | 武曲 | 天同 | 天相 |
| 辛 | 巨門 | 太陽 | 文曲 | 文昌 |
| 壬 | 天梁 | 紫微 | 左輔 | 武曲 |
| 癸 | 破軍 | 巨門 | 太陰 | 貪狼 |

**學會與其他版本差異**：庚的化科（學會=天同，他版=天府）、化忌（學會=天相，他版=天同）。

---

## §9 大限 overlay

**檔案**：`src/lib/astrolabe/decadal.ts`

```ts
大限干    = 大限宮位的宮干
大限四化  = MUTAGEN_TABLE[decadalStemIdx]

限祿idx = LU_CUN[decadalStemIdx]
限羊idx = (限祿 + 1) % 12
限陀idx = (限祿 - 1 + 12) % 12

// ⛔ 無限馬（claude.md 規定）
```

---

## §10 流年 overlay

**檔案**：`src/lib/engine/native/horoscope.ts`

```ts
流年干支  = 農曆年干支（lunar-javascript getLunarYear）
流年命宮  = 農曆年支所落宮位
流年四化  = MUTAGEN_TABLE[yearStemIdx]

年祿idx = LU_CUN[ys]
年羊idx = (年祿 + 1) % 12
年陀idx = (年祿 - 1 + 12) % 12
年鸞idx = (3 - yearBranchIdx + 12) % 12
年喜idx = (年鸞 + 6) % 12

// ⛔ 無年馬（claude.md 規定）
```

---

## §11 流月 overlay（節氣月）

**檔案**：`src/lib/engine/native/horoscope.ts`

```ts
月干支   = 節氣月干支（lunar.getMonthInGanZhi()）
// ⚠️ 節令切換，比農曆月精確

流月命宮 = 月支所落宮位
流月四化 = MUTAGEN_TABLE[monthStemIdx]

月祿idx = LU_CUN[monthStemIdx]
月羊idx = (月祿 + 1) % 12
月陀idx = (月祿 - 1 + 12) % 12
```

---

## §12 流日 overlay

**檔案**：`src/lib/engine/native/horoscope.ts`

```ts
日干支   = lunar.getDayInGanZhi()
流日命宮 = 日支所落宮位
流日四化 = MUTAGEN_TABLE[dayStemIdx]

日祿idx = LU_CUN[dayStemIdx]
日羊idx = (日祿 + 1) % 12
日陀idx = (日祿 - 1 + 12) % 12
```

---

## §13 小限 overlay

**檔案**：`src/lib/astrolabe/minorLimit.ts` + `horoscope.ts`

```ts
小限宮   = computeMinorLimitAges() 預算的虛歲所在宮
小限干   = 小限宮位的宮干
小限四化 = MUTAGEN_TABLE[minorLimitStemIdx]

小祿idx = LU_CUN[minorLimitStemIdx]
小羊idx = (小祿 + 1) % 12
小陀idx = (小祿 - 1 + 12) % 12
```

---

## §14 宮名 overlay 計算方向

**檔案**：`src/i18n/index.ts`

```ts
// 大限宮名（大命 / 大兄 / …）
offset = (palaceIdx - decadalStartIdx + 12) % 12

// 流年宮名（流命 / 流兄 / …）
offset = (palaceIdx - yearlyStartIdx + 12) % 12

// ⚠️ 方向 CCW（offset 遞增 = CCW）
// 錯誤版本：startIdx - palaceIdx（會全部反向）
```

---

## §15 三方四正 + 多胞胎

### 15.1 三方四正

**檔案**：`src/i18n/index.ts` `getSanFangSiZheng()`

從某宮地支 idx 出發，回傳 4 個地支（本宮 + 對宮 + 三合左 + 三合右）：

```ts
getSanFangSiZheng(branch) = [
  BRANCH_ORDER[idx],             // 本宮
  BRANCH_ORDER[(idx + 6) % 12],  // 對宮（沖）
  BRANCH_ORDER[(idx + 4) % 12],  // 三合 +4
  BRANCH_ORDER[(idx + 8) % 12],  // 三合 +8
]
```

例：命宮=子(0) → [子, 午, 辰, 申]（命宮 / 遷移 / 財帛 / 官祿）

UI 渲染：`ThreeSideLine.tsx`（鋼藍 SVG 線）。

### 15.2 多胞胎（multiBirthOrder）

**檔案**：`src/lib/astrolabe/twinChart.ts`

同時辰多胞胎以胎次決定命宮：

```ts
BIRTH_ORDER_PALACE = {
  2: '遷移',   // 老二命宮 = 老大的遷移
  3: '兄弟',   // 老三命宮 = 老大的兄弟
  4: '僕役',   // 老四命宮 = 老大的僕役
}
```

實作：對 `original.palaces` 做 rotation，使 `BIRTH_ORDER_PALACE[order]` 變為新命宮（index 0），其他宮名照原 CCW 順序重排。

大限：起始虛歲 = 老大 startAge（五行局同），方向依 `computeIsForward` 重算（看 CW 鄰宮 vs CCW 鄰宮 range 大小，不可只比命宮）。

> ⚠️ 2026-05-06 修正：原 `computeIsForward` 只比較 CW 鄰宮 vs 命宮 → 永遠回 true → 逆行雙胞胎全錯。詳見 GOTCHAS.md。

---

## §16 隱藏 / 過濾規則

**檔案**：`src/components/PalaceCell.tsx`、`createAstrolabe.ts`

| 隱藏項目 | 範圍 | 理由 |
|----------|------|------|
| 流月鸞喜 | 流月 overlay | 學會不顯示 |
| 流年昌曲 | 流年 overlay | 學會不顯示 |
| 流馬 | 流年 overlay | claude.md：無年馬 |
| 限馬 | 大限 overlay | claude.md：無限馬 |
| 運魁鉞 | overlay | 學會不顯示 |
| 年解 | overlay | 學會不顯示 |

**星名覆寫**：
- 空亡 → 截空
- 空劫 → 劫空（注意截/劫順序）

---

## §17 修改記錄

> **規則**：未來新增 entry **必須**附 `YYYY-MM-DD HH:MM`（台北時區）時間戳。
> 既有的 2026-05-19 / 2026-05-20 entries 沒精確時間是歷史紀錄，既往不咎。

| 日期 | 說明 |
|------|------|
| 2026-05-18 15:30 | FORMULAS.md 初版（涵蓋 Phase 4b/4c/4f） |
| 2026-05-18 16:00 | 5 命盤截圖驗證全通過（某例/某例/某例/某例/某例）|
| 2026-05-18 17:30 | 博士十二神起點修正（命宮→年干祿存）、長生十二神方向（陽順陰逆→陽逆陰順）|
| 2026-05-18 20:00 | 長生十二神二次修正（陰干誤改為順行→正確為陰陽干一律逆行 — **此規則 2026-05-19 再次修正**）|
| 2026-05-19 | 閏月命宮初版修正（isLeap → lm+1）；長生/博士12 方向改為 isForward=(isMale===isYangStem)；封誥改順行 |
| 2026-05-20 | 閏月十五分界法（ld≥16 才 lm+1）；閏月顯示「閏X月」；博士十二神 飛廉→蜚廉；天馬 ❌ BROKEN（公式錯）|
| 2026-05-20 晚 | **天馬公式釐清 ✅**（節氣月支三合驛馬，學會版排盤 + 9 筆 DK 驗證）|
| 2026-05-20 晚 | FORMULAS.md 重寫：歸納所有公式為單一速查文件 |
