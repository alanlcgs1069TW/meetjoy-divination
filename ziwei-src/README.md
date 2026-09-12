# 紫微斗數命盤 Zi Wei Dou Shu Astrology Chart

A web app for generating and saving Zi Wei Dou Shu (紫微斗數) astrology charts, built for overseas Chinese communities.

## Features

- 12-palace astrology chart with natal, decadal, and annual modes
- Custom four transformations (四化) table — school version
- Traditional Chinese / Simplified Chinese / English, plus an independent Pinyin toggle
- Chart database with save, edit, and delete
- Supabase-backed sync across devices (optional login)
- Offline-first: works without an account

## Tech Stack

- React + TypeScript (Vite)
- Custom Zi Wei Dou Shu calculation engine (aligned with ISZN school teaching)
- Supabase (auth + sync)
- Docker dev environment
- Deployed on Cloudflare Pages

## Development

```bash
docker compose --profile test up -d      # → http://localhost:5174
docker compose --profile test down       # 停止
```

`--profile test` 不可省略 —— compose 的服務掛在 `test` profile 下，
少了它會是「no service selected」、**什麼都不會啟動且沒有錯誤訊息**。
首次啟動會先跑 `npm install`，請等一下。

不用 Docker：`npm install && npm run dev` → http://localhost:5173
（兩條路徑的 port 不同，不是筆誤。）

**不需要 Supabase、Cloudflare 或任何雲端帳號就能跑完整功能**；
後端只影響登入與跨裝置同步。

## 文件導覽

| 檔案 | 內容 |
|------|------|
| `說明書.md` | **從這裡開始** —— 功能導覽、專案結構、哪些「看起來像 bug」的東西不可以修 |
| `SETUP.md` | 安裝、Supabase 建表、意見回報端點的風險 |
| `GOTCHAS.md` | 踩過的坑與判斷依據，**改算法前必讀** |
| `claude.md` | 四化表與計算規則（不可更動） |
| `FORMULAS.md` | 各模組公式速查 |
| `CHANGELOG.md` | 每次改動與其理由 |
