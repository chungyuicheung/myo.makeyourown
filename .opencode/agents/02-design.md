# 02 — 設計系統

## 單一真相來源

- **視覺/動畫/語氣決策**：`design.md`（Hallmark locked，勿覆蓋）
- **Token 值**：`tokens.css` + `design.md` 第 9 節

## 色彩（OKLCH）

| Token | OKLCH | 用途 |
|-------|-------|------|
| `--color-paper` | `oklch(97% 0.01 90)` | 頁面背景（暖米白） |
| `--color-paper-2` | `oklch(94% 0.02 85)` | 卡片背景（奶油色） |
| `--color-ink` | `oklch(25% 0.02 60)` | 主文字（暖炭黑） |
| `--color-ink-2` | `oklch(45% 0.02 60)` | 次要文字（暖灰色） |
| `--color-rule` | `oklch(85% 0.01 90)` | 髮絲級分隔線 |
| `--color-accent` ⭐ | `oklch(52% 0.14 38)` | 赤陶/鐵鏽紅 — CTA/連結/重點 |
| `--color-focus` | `oklch(52% 0.14 38)` | focus ring（同 accent） |

> **硬規則**：禁止紫/靛藍/藍紫漸層，零容忍。

## 字體

| 角色 | 字體 | Fallback |
|------|------|---------|
| Display | Noto Serif TC | Georgia, serif |
| Body | Noto Sans TC | system-ui, sans-serif |
| Mono | JetBrains Mono | 'Fira Code', monospace |

## 間距（4pt scale）

```
--space-xs:  4px   --space-sm:  8px   --space-md:  16px
--space-lg:  24px  --space-xl:  32px  --space-2xl: 48px
--space-3xl: 64px  --space-4xl: 96px
```

## 動畫

- **Reveal**：`opacity: 0 → 1` only
- **Easing**：`cubic-bezier(0.16, 1, 0.3, 1)`
- **Duration**：400ms standard / 200ms micro
- **Scroll trigger**：None（全部 fade-in on load）
- **Hover delay**：800ms
- **Focus**：0ms instant

## 導航架構 · N5 Floating Pill

```
┌─────────────────────────────────────────────────────────────┐
│  [策略探索家]    [文章]  [工具]  [關於]      [開始探索 →]   │
└─────────────────────────────────────────────────────────────┘
```

- 品牌名左對齊，純文字（無 logo 圖片）
- Nav links：pill-shaped text buttons，無背景
- CTA：solid terracotta pill，最右
- **導航禁用 emoji**

## Footer 架構 · Ft2 Inline Single Line

```
© 2026 策略探索家 · Privacy · GitHub
```

- 單一橫線，無 4 column
- `--color-ink-2` 文字，`--color-rule` 分隔線

## Zero Dependency

- 所有 CSS 基於 `tokens.css`
- **零 Tailwind 依賴**
- Google Fonts：Noto Sans TC / Noto Serif TC / JetBrains Mono
