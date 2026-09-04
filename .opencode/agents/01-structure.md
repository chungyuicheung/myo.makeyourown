# 01 — 專案結構

## 主站頁面對照

| 頁面 | 宏結構 | 類型 | 說明 |
|------|--------|------|------|
| `index.html` | Marquee Hero | Marketing | 核心品牌故事 |
| `trip.html` | Marquee Hero | Marketing | 旅行規劃 |
| `tv.html` | Long Document | Content | 影評/科技 |
| `blog/*` | Long Document / Letter | Content | 文章（每頁自包含） |
| `heic-converter.html` | Workbench | Tool | HEIC→PNG 轉換 |
| `cert-folder.html` | Workbench | Tool | 證書套產生器 |
| `chronicle.html` | Long Document | Content | 開發歷程時間軸 |

## 宏結構 Diversification Rule

相鄰頁面不得共用同一宏結構。五種標準架構：

1. **Marquee Hero** — 全螢幕動態跑馬燈 + 主故事線 + CTA
2. **Long Document** — 左對齊 editorial 排版，多段落 + 圖片穿插
3. **Letter** — 第一人稱書信體
4. **Workbench** — 輸入 → 處理 → 輸出，工具介面優先
5. **FAQ** — 對話式問答集合

## 新增頁面流程

```
1. 複製 includes/ 的 head.html + header.html + footer.html
2. 引入 <link rel="stylesheet" href="assets/css/style_system.css">
3. 引入 <script src="assets/js/main.js"></script>
4. 遵循現有導航結構（N5 Floating Pill）
5. 確認宏結構與相鄰頁面不同
```

## 時間軸資料流程

```
chronicle-data.json → chronicle-data.js → chronicle.js 渲染
更新：node scripts/update-chronicle-data.cjs
```

## 歷史截圖取得

```bash
git worktree add --detach <commit> /tmp/shot-<hash>
# Chrome Headless screenshot via Playwright
# 結果存到 assets/images/chronicle/
```
