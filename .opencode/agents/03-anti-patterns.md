# 03 — 反模式

## 視覺層

| 反模式 | 原因 |
|--------|------|
| 紫/靛藍漸層 | brand violation，accent 只能是 terracotta |
| emoji 作為導航圖標 | AI-slop 規則違反，用 inline SVG 或文字 |
| 置中佈局 | editorial left-aligned rhythm |
| Inter-only 字體堆疊 | 主體字是 Noto Sans TC |
| animate-on-scroll |  banned，fade-only on load |
| 4-column footer | 只用 Ft2 Inline Single Line |
| success toast | 靜默 state change，無 toast |

## 架構層

| 反模式 | 原因 |
|--------|------|
| 相鄰頁面共用同一宏結構 | 破壞視覺多樣性 |
| 在 .tsx 硬編色彩/字體 | 應使用 theme tokens |
| 修改 narrations.ts 不同步更新 audio | 步驟計數唯一來源 |
| Stage 內使用 scroll | html/body overflow: hidden |

## 程式碼層

| 反模式 | 原因 |
|--------|------|
| `as any` / `@ts-ignore` | 禁止 type error suppression |
| Empty catch blocks | 隱藏錯誤 |
| 刪除 failing tests 來 pass | 掩蓋問題 |
