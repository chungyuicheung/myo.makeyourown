# myo.makeyourown | 策略探索家

> 用產品經理的系統化思維，為你的旅行、科技與投資打造清晰路線圖

---

## 🎯 專案定位

**策略探索家** 是一個個人品牌網站，展示如何運用產品_manager_ 的框架與 AI 工具，幫助個人建立 LifeOS（人生操作系統）。內容涵蓋：

- **旅行規劃系統** - 用產品思維設計夢想旅程
- **科技探索** - 深度評測與實用工具（HEIC 轉換器等）
- **投資策略** - 系統化決策框架
- **證書套工具** - 自動生成與管理
- **開發歷程時間軸** - 透過 Git 歷史、頁面上線與學習里程碑記錄專案演進

## 📁 專案結構

```
myo.makeyourown/
├── index_system.html      # 主頁（策略探索家核心故事）
├── trip.html             # 旅行規劃專區
├── trip/okinawa-presentation.html  # 沖繩七天六夜深度文化與手作之旅（40頁簡報）
├── trip/okinawa-plan.md  # 沖繩行程完整規劃
├── tv.html               # 影評/科技內容
├── cert-folder.html      # 證書套產生器
├── heic-converter.html   # HEIC 轉 PNG 工具
├── food.html             # 食物相關（待擴展）
├── chronicle.html         # 開發歷程時間軸（Git 歷史 + 截圖 + 里程碑）
├── chronicle-data.json    # 時間軸事件資料（110+ 筆）
├── chronicle-data.js      # 自動產生的 JS 資料載入檔
├── includes/             # 可重用組件
│   ├── head.html
│   ├── header.html
│   └── footer.html
├── scripts/
│   └── update-chronicle-data.cjs  # 時間軸資料更新腳本
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── style_system.css
│   │   └── tokens.css    # 設計系統 Token
│   └── js/
│       ├── main.js
│       └── chronicle.js  # 時間軸渲染引擎
├── images/chronicle/      # 歷史頁面截圖（桌面 + 手機版）
├── image/                # 圖片資源
├── js library/           # 第三方腳本
├── robots.txt
└── ads.txt               # Google AdSense 配置
```

## 🛠️ 技術棧

- **HTML5** + 語意化標籤
- **Pure CSS** (tokens.css 設計系統) - 不含 Tailwind/framework 依賴
- **Vanilla JavaScript** - 互動功能 + 時間軸渲染引擎
- **Design Tokens** - CSS 變數系統（色彩、字體、間距、動畫）
- **Google Fonts** - Noto Sans TC / Noto Serif TC / JetBrains Mono
- **Chrome Headless + Playwright** - 歷史頁面自動截圖

## 🚀 快速開始

### 本地預覽

1. Clone 此專案
2. 直接用瀏覽器開啟 `index_system.html`
3. 无需构建步骤（纯静态站点）

### 部署建議

- **Vercel / Netlify** - 推薦，直接拖拽上傳或 CLI 部署
- **GitHub Pages** - 免費靜態託管
- **Cloudflare Pages** - 全球 CDN 加速

## 🔧 開發指南

### 新增頁面

1. 複製 `includes/` 中的組件到新 HTML
2. 引入樣式：`<link rel="stylesheet" href="assets/css/style_system.css">`
3. 載入腳本：`<script src="assets/js/main.js"></script>`
4. 遵循現有的導航結構

### 圖片優化

- Hero 圖片建議尺寸：1920×1080 (已優化為 WebP 備份在 `image/`)
- Logo 使用 PNG 透明背景

## 📈 SEO & Open Graph

主要頁面已配置完整的 OG 標籤、JSON-LD 結構化數據，適合搜索引擎收錄與社群分享。

## 📖 學習記錄

### 2026-06-23：開發歷程時間軸（Chronicle）

**目標**：建立一個可視化的時間軸頁面，展示專案從 2025 年 5 月以來的所有開發活動。

**功能**：
- 90+ Git commits、6 次頁面上線、5 次開發會話、9 個學習里程碑
- 六個 launch 事件附有**歷史頁面截圖**（桌面 + 手機版），經由 `git worktree` 切換到當時的 commit 後以 Chrome Headless 截取
- 篩選模式：里程牌（僅顯示里程碑 + 上線事件）、全部、按類型篩選
- 月分類區塊、學習統計卡片、月份活動條形圖、Top 標籤

**技術要點**：
- `git worktree add --detach <commit>` 在不影響目前工作區的條件下撈取歷史頁面
- Chrome Headless screenshot 搭配 Playwright 設定 `document.body.style.zoom` 調整縮放
- 所有 CSS 基於 `tokens.css` 設計系統（零 Tailwind 依賴）
- 資料驅動：`chronicle-data.json` → `chronicle-data.js` → `chronicle.js` 渲染

**修改檔案**：
- `chronicle.html`：時間軸頁面（純 CSS，Archival Scrapbook 風格）
- `assets/js/chronicle.js`：時間軸渲染引擎（事件卡、里程碑卡、篩選、統計、學習區塊）
- `chronicle-data.json` / `chronicle-data.js`：事件資料（110 筆）
- `assets/images/chronicle/`：12 張歷史截圖
- `scripts/update-chronicle-data.cjs`：資料更新腳本

### 2026-05-21：沖繩簡報圖片修復

**問題**：簡報中使用了 Wikipedia/Wikimedia 圖片，造成版權與穩定性問題。

**解決方案**：
1. 掃描 40 頁簡報，找出所有 Wikipedia/Wikimedia 圖片 URL
2. 使用 Bing 圖片搜尋取得對應的 OIP（原始圖片 ID）
3. 透過 DuckDuckGo 代理（`https://external-content.duckduckgo.com/iu/?u=ENCODED_BING_URL`）提供穩定的圖片來源
4. 修正圖片重複問題（例如：首里城城堡出現在封面與內容頁，通過更換為沖繩風獅爺石像解決）

**技術要點**：
- `curl -sI` 驗證所有 URL 可存取（HTTP 200）
- 強制刷新瀏覽器（`ignoreCache: true`）確認緩存問題
- 圖片 alt 文字與內容上下文對應檢查

**修改檔案**：
- `trip/okinawa-presentation.html`：更換為 DuckDuckGo 代理 URL，修正圖片重複

## 🤝 貢獻

歡迎提交 Issue 與 PR！請先閱讀 [CONTRIBUTING.md](CONTRIBUTING.md)（Coming Soon）。

## 📝 License

MIT License - 詳見 [LICENSE](LICENSE)

## 📬 聯繫

- Email: [hello@explorer.com](mailto:hello@explorer.com)
- 網站: https://www.strategy-explorer.com/

---

**製作 with ❤️ by [Your Name] | 策略探索家**
