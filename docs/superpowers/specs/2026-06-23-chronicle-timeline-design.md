# 編年史時間軸 — Design Spec

> **策略探索家** 個人網站的編年史頁面，彙整 git commit、OpenCode session、頁面上線與個人筆記，以垂直時間軸呈現探索歷程。

---

## 1. 目標

在 `makeyourown.pages.dev/chronicle.html` 上建立一個時間軸頁面，讓訪客可以：

- 瀏覽作者在不同時間點探索過的主題與成果
- 從月份層級鑽入到每日細節（混合式顆粒度）
- 透過顏色/圖示一眼辨識資料來源類型
- 過濾特定類型或標籤的事件

---

## 2. 資料來源

四種事件類型，全部合併在同一條時間軸上：

| 類型 | 顏色 | 圖示 | 來源 |
|---|---|---|---|
| Git commit | 綠 | `<>` | `git log` 歷史（91 commits, 2025/07–2026/06） |
| OpenCode session | 藍 | `💬` | OpenCode session list（7 sessions, 2026/05–06） |
| 頁面上線 | 橙 | `🌐` | 網站各頁面的首次發布時間 |
| 個人筆記 | 紫 | `📝` | 手動新增的探索記錄（research、學習） |

> 顏色對應主設計系統中的 accent family，不使用紫色/indigo 之外的色票。紫色僅用於「個人筆記」類型，且不使用漸層。

---

## 3. 資料格式

`chronicle-data.json` 位於網站根目錄，由 JS `fetch` 載入：

```json
{
  "events": [
    {
      "date": "2026-06-05",
      "type": "commit",
      "title": "feat: add AI-generated cover images to blog articles",
      "description": "為 5 篇部落格文章加入 AI 生成的封面圖",
      "link": "https://github.com/.../commit/49bc0e3",
      "tags": ["blog", "design"]
    }
  ]
}
```

**資料維護方式：**
- 初始版本由輔助 script 從 `git log` 提取 commits，手動補充 session 與頁面上線資訊
- 後續更新手動編輯 JSON（新增事件條目）
- 未來可考慮自動化：`git log` hook 或定期 script

---

## 4. 頁面架構

```
chronicle.html
├── <head> (沿用 includes/head.html)
├── <body>
│   ├── <site-header> (沿用 components/site-header.html)
│   ├── <main class="chronicle">
│   │   ├── 頁面標題區
│   │   │   └── h1 "探索編年史" + 簡短說明
│   │   ├── Filter bar
│   │   │   ├── 類型按鈕：全部 / Commit / Session / 上線 / 筆記
│   │   │   └── 年份快速跳轉：2025 · 2026
│   │   └── Timeline container
│   │       ├── 年份區塊 <section class="year">
│   │       │   ├── 年份標題 (h2)
│   │       │   └── 月份區塊 <details class="month">
│   │       │       ├── <summary>月份名稱 + 事件計數</summary>
│   │       │       └── 事件列表
│   │       │           └── 事件卡片
│   │       │               ├── 日期標籤 (MM/DD)
│   │       │               ├── 類型圓點（顏色區分）
│   │       │               ├── 標題 + 描述
│   │       │               └── 標籤 chips
│   │       └── 垂直時間軸線（左側裝飾）
│   └── <site-footer> (沿用 includes/footer.html)
```

---

## 5. 互動行為

| 功能 | 行為 |
|---|---|
| 月份展開/收合 | 使用 `<details>` 元素，無 JavaScript 也能運作。JS 增強：單擊月份展開，另擊其他月份自動收合前一個 |
| 篩選 | 點擊 filter button 隱藏非選取類型的事件；「全部」顯示所有 |
| 年份跳轉 | 點擊年份快速滾動到對應區塊 |
| 事件連結 | commit 類型連到 GitHub、session 類型連到 session 頁面、上線類型連到站內頁面 |
| 預設狀態 | 離當前日期最近的月份展開，其餘收合 |

**不使用的情境：** 無無限滾動、無動畫過場、無 scroll-trigger 效果。

---

## 6. 視覺設計

### 佈局

- 左右雙欄：左側為時間軸線 + 日期，右側為事件卡片
- 時間軸線：1px solid `--color-rule`，垂直貫穿
- 最大寬度 `max-w-4xl`，置中

### 事件卡片

- 背景 `--color-paper`，無陰影、無圓角（呼應 editorial 風格）
- 下方 1px `--color-rule` 分隔線
- 類型圓點：8px 圓形，位於時間軸線與卡片之間
- hover 效果：僅 `text-decoration: underline` 在標題上

### 響應式

- 桌面（≥768px）：雙欄時間軸佈局
- 手機（<768px）：單欄，時間軸線移到左邊界，日期內嵌在卡片上方

### 字體

- 年份標題：Noto Serif TC 700
- 月份標題：Noto Sans TC 500
- 事件標題：Noto Sans TC 400
- 日期與標籤：Noto Sans TC 400, small

---

## 7. 技術實作

- **HTML**：單一頁面 `chronicle.html`，符合現有網站結構
- **CSS**：內嵌 `<style>` 或新增 `chronicle.css`（不影響既有頁面）
- **JavaScript**：單一 `chronicle.js`，負責載入 JSON、渲染時間軸、filter 互動
- **資料**：`chronicle-data.json`，與頁面分離
- **無 build step**：完全靜態，直接部署

### 相依性

- Tailwind CSS CDN（既有）
- Noto Sans TC + Noto Serif TC Google Fonts（既有）
- 無其他外部套件

---

## 8. 初始資料範圍

第一版 JSON 涵蓋：

- **Git commits**：從 `git log --all --format="%h %ad %s" --date=short` 提取，約 91 筆
- **OpenCode sessions**：從 session_list 提取，7 筆
- **頁面上線**：主要頁面的首次 commit 日期（index, trip, tv, food, blog, cert-folder, heic-converter, okinawa pages）
- **個人筆記**：待手動補充

---

## 9. 未來擴展（不做於第一版）

- 自動從 git hook 更新 JSON
- 結合 OpenCode session 的詳細內容摘要
- 時間軸的年份篩選 + 標籤篩選組合
- RSS feed 輸出
