# 策略探索家 — 專案知識庫

**Commit:** b4d65e3 · **Branch:** main

## 模組導航

Agent 應根據任務類型按需載入下方對應模組，無需一次讀取全部內容。

| 模組 | 檔案 | 觸發時機 |
|------|------|---------|
| 📐 專案結構 | `.opencode/agents/01-structure.md` | 新增頁面、修改目錄結構 |
| 🎨 設計系統 | `.opencode/agents/02-design.md` | 改色彩/字體/動畫、新建視覺元件 |
| 🚫 反模式 | `.opencode/agents/03-anti-patterns.md` | code review、review work |
| ⌨️ 指令 | `.opencode/agents/04-commands.md` | 執行命令、部署 |
| 🗄️ 外部工具 | `.opencode/agents/05-tools.md` | 使用 Notion / OpenCLI / AI 工具 |
| ⚛️ 簡報子專案 | `presentation/AGENTS.md` | 任何 presentation/ 相關工作 |

## 快速索引

```
myo.makeyourown/
├── index.html              # 主頁（策略探索家核心故事）
├── trip.html / food.html / tv.html  # 內容頁面（含 OG + JSON-LD）
├── chronicle.html          # 開發歷程時間軸
├── cert-folder.html        # 證書套產生器
├── heic-converter.html     # HEIC→PNG 轉換工具
├── assets/css/tokens.css   # 📐 設計系統 token（Almanac 主題）
├── design.md               # 📐 設計系統單一真相來源
├── includes/               # HTML 元件（header/footer/head）
├── blog/                   # 文章頁面
├── presentation/           # ⚛️ React+Vite 心經口播簡報
└── .opencode/agents/       # 📦 本目錄 — 按需載入模組
```

## 核心規則（一律適用）

- **語言**：繁體中文
- **色彩**：accent = terracotta `oklch(52% 0.14 38)`，**禁止**紫/靛藍/藍紫漸層
- **字體**：Noto Serif TC / Noto Sans TC / JetBrains Mono
- **動畫**：僅 fade-in（opacity 0→1），無 scroll-triggered / bounce / parallax
- **設計決策唯一真相來源**：`design.md` + `tokens.css`（Hallmark locked，勿覆蓋）

> 詳細規範請載入對應模組。
