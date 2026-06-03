# myo.makeyourown | 策略探索家

> 用產品經理的系統化思維，為你的旅行、科技與投資打造清晰路線圖

---

## 🎯 專案定位

**策略探索家** 是一個個人品牌網站，展示如何運用產品_manager_ 的框架與 AI 工具，幫助個人建立 LifeOS（人生操作系統）。內容涵蓋：

- **旅行規劃系統** - 用產品思維設計夢想旅程
- **科技探索** - 深度評測與實用工具（HEIC 轉換器等）
- **投資策略** - 系統化決策框架
- **證書套工具** - 自動生成與管理

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
├── includes/             # 可重用組件
│   ├── head.html
│   ├── header.html
│   └── footer.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── style_system.css
│   └── js/
│       └── main.js
├── image/                # 圖片資源
├── js library/           # 第三方腳本
├── robots.txt
└── ads.txt               # Google AdSense 配置
```

## 🛠️ 技術棧

- **HTML5** + 語意化標籤
- **Tailwind CSS** (CDN) - 響應式設計
- **Vanilla JavaScript** - 互動功能
- **Font Awesome** - 圖標庫
- **Google Fonts** - Noto Sans TC（繁體中文）

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
