# presentation/ — 心經簡報 React 專案

**Tech:** React 19 + Vite 8 + TypeScript 6 · **Port:** 5174

## OVERVIEW

《般若波羅蜜多心經》口播簡報引擎。8 章 31 步，每步對應一段中文口播 + MP3 音頻。支援手動/自動兩種播放模式，1920×1080 固定比例舞台。

## STRUCTURE

```
presentation/
├── src/
│   ├── main.tsx                    # React 入口
│   ├── App.tsx                     # 主組件（stepper + audio + stage）
│   ├── registry/
│   │   ├── chapters.ts             # 8 章訂單 + ChapterDef 陣列（⚠️ 改此即改結構）
│   │   └── types.ts                # ChapterDef / Narration / ChapterStepProps
│   ├── chapters/                   # 每章獨立目錄（01-08）
│   │   ├── 01-coldopen/
│   │   │   ├── Coldopen.tsx        # 視覺組件
│   │   │   ├── Coldopen.css        # 章專屬樣式
│   │   │   └── narrations.ts       # 📍 步驟計數唯一來源（長度 = 步數）
│   │   └── ... (02-08 同結構)
│   ├── components/
│   │   ├── Stage.tsx               # 16:9 舞台（1920×scale → 1080×scale）
│   │   ├── ProgressBar.tsx         # 章節進度條
│   │   ├── AutoToggle.tsx          # 手動/自動模式切換
│   │   └── AutoStartGate.tsx       # 自動模式啟動確認門
│   ├── hooks/
│   │   ├── useStepper.ts           # 步進邏輯 + localStorage cursor（v5）
│   │   ├── useAudioPlayer.ts       # 音頻播放 + auto-advance
│   │   ├── useAutoMode.ts          # 自動模式狀態
│   │   └── useStageScale.ts        # 視窗縮放計算
│   └── styles/
│       ├── base.css                 # 舞台 chrome + primitive classes（.serif-cn .card 等）
│       ├── tokens.css              # indigo-porcelain 主題 tokens
│       ├── fonts.css               # Google Fonts import
│       └── animations.css          # fade-in keyframes
├── scripts/
│   ├── extract-narrations.ts       # 產出 audio-segments.json（TTS pipeline 輸入）
│   └── synthesize-audio.sh         # 呼叫 TTS provider（MiniMax / OpenAI / say）
└── public/audio/<chapter>/<N>.mp3  # 合成音頻（1-indexed）
```

## WHERE TO LOOK

| 任務 | 位置 |
|------|------|
| 新增/修改章節 | `src/chapters/NN-name/`（複製一章為模板）|
| 調整章節順序 | `src/registry/chapters.ts`（同步影響 TTS pipeline）|
| 修改音頻邏輯 | `src/hooks/useAudioPlayer.ts` |
| 修改步進邏輯 | `src/hooks/useStepper.ts`（localStorage key: `presentation-cursor-v5`）|
| 變更主題 | `src/styles/tokens.css`（indigo-porcelain）|
| 新增 TTS provider | `scripts/tts-providers/` |

## CONVENTIONS

- **章節命名**: `NN-name`（01-coldopen, 02-title-meaning...）— 數字前綴決定順序
- **narrations.ts**: `export const narrations: Narration[]` — 長度 = 該章步數，**禁止**改為物件陣列（extract-narrations.ts 驗證嚴格）
- **音頻路徑**: `/audio/<chapter-id>/<step+1>.mp3`（1-indexed 對應 narrations 陣列 index）
- **舞台**: 固定 1920×1080，透過 `useStageScale` 縮放适配 viewport
- **Theme ownership**: `base.css` 管 primitive classes + tokens；主題 CSS 管 color/font/shadow
- **Auto mode fallback**: 無音頻時用 `text.length * 250ms` 估算（≥ 1500ms）

## ANTI-PATTERNS

- 在 chapter `.tsx` 中硬編色彩/字體（應使用 theme tokens: `var(--accent) var(--font-display-cn)`）
- 修改 `narrations.ts` 陣列長度不同步更新 audio 檔案
- 在 Stage 內使用 scroll（overflow: hidden on html/body）
- 紫色/靛藍漸層（brand violation，延续主站 design.md）

## COMMANDS

```bash
cd presentation
npm run dev          # Vite dev server :5174
npm run build        # tsc -b && vite build
npm run extract-narrations  # → audio-segments.json
npm run synthesize-audio    # TTS pipeline
```

## NOTES

- `extract-narrations.ts` 以 regex 解析 `chapters.ts`（不需 React 執行環境）
- 空字串 narration = silent step（無音頻，auto 模式fallback 到 estimate）
- cursor 版本化：`STORAGE_KEY = "presentation-cursor-v5"`，結構變更時 bump version
