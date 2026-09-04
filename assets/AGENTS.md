# assets/ — 設計系統與共用資源

## OVERVIEW

主站（非 presentation）共用 CSS tokens、JavaScript 工具函式與可嵌入 HTML 元件。零框架依賴，純原生實現。

## STRUCTURE

```
assets/
├── css/
│   ├── tokens.css       # 📐 設計系統 token 源頭（OKLCH 色彩、字體、間距、motion）
│   └── style_system.css # 基於 tokens 的樣式（nav-bar, CTA, layout primitives）
├── js/
│   ├── main.js          # 元件載入器：fetch() includes/ → innerHTML
│   ├── chronicle.js     # 時間軸渲染引擎（事件卡、篩選、統計）
│   └── navigation.js    # 導航互動邏輯
└── images/
    └── chronicle/       # 歷史頁面截圖（desktop + mobile，git worktree 取得）
```

## WHERE TO LOOK

| 任務 | 位置 |
|------|------|
| 修改色彩/字體/間距 | `assets/css/tokens.css`（同步更新 `design.md`）|
| 新增頁面樣式 | `assets/css/style_system.css` |
| 修改導航行為 | `assets/js/navigation.js` |
| 修改時間軸邏輯 | `assets/js/chronicle.js` |
| 替換截圖 | `assets/images/chronicle/` |

## CONVENTIONS

- **Token 同步**: `tokens.css` 與 `design.md` §9 必須保持一致（design.md 為 doc，tokens.css 為 source of truth）
- **OKLCH 優先**: 所有色彩使用 OKLCH 空間（非 HEX/RGB），便於 perceptual uniformity
- **4pt 間距**: `--space-xs: 4px` → `--space-4xl: 96px`
- **motion tokens**: `--dur-short: 150ms`, `--dur-medium: 300ms`, `--dur-long: 500ms`；easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- **main.js pattern**: IIFE + `fetch()` includes → `innerHTML`；**禁止**在 HTML 中手動 embedded `<script>` 重複載入
- **chronicle.js**: IIFE 封裝，讀取全域 `chronicleData` 變數（由 `chronicle-data.js` 注入）

## ANTI-PATTERNS

- 直接在 HTML 寫 inline style（應使用 token variable）
- tokens.css 與 design.md 不同步
- 在 chronicle.js 外修改 `chronicleData` 結構
- 用 Tailwind（零 Tailwind 依賴）

## NOTES

- `tokens.css` 已包含 `@media (prefers-reduced-motion: reduce)` fallback
- `.nav-bar` class 定義在 tokens.css 末段（sticky nav）
- 圖片路徑：`./image/`（根層級）為主站圖片資源，`assets/images/` 為 chronicle 專用
