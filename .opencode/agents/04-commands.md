# 04 — 指令

## 主站

```bash
# 預覽
open index.html

# 無構建步驟，純靜態檔案
```

## 簡報（presentation/）

```bash
cd presentation && npm run dev        # :5174
cd presentation && npm run build      # tsc -b && vite build
cd presentation && npm run extract-narrations  # → audio-segments.json
cd presentation && npm run synthesize-audio     # TTS pipeline
```

## 時間軸

```bash
node scripts/update-chronicle-data.cjs    # 從 git log 更新
node scripts/generate-chronicle-data.mjs  # 產出 JS 載入檔
```

## 部署建議

- **Vercel / Netlify** — 推薦，直接拖拽或 CLI
- **GitHub Pages** — 免費靜態託管
- **Cloudflare Pages** — 全球 CDN
