/**
 * narrations.ts — coldopen (Chapter 01)
 *
 * Step count = length of this array = chapter's step count.
 * Auto mode / audio synthesis reads this for timing and narration text.
 * Text must semantically match script.md — key phrases / numbers preserved.
 *
 * 4 steps:
 *   step 0 → screen: "260字" (hero number)
 *   step 1 → screen: 每日誦讀的人群 (supporting text)
 *   step 2 → screen: "般若波羅蜜多心經" (full title)
 *   step 3 → screen: "它是什麼？" (question hook — silent narration, just visual)
 */
export const narrations: string[] = [
  // step 0: Hero number — narrator explains why 260 chars is remarkable
  "你知道嗎？全世界每天有數不清的人，在寺廟裏、在家中的佛堂前、甚至在地鐵上戴著耳機，誦讀同一段文字。它只有260個字，卻是大乘佛教般若部經典的精華。",

  // step 1: Daily recitation context
  "它是《般若波羅蜜多心經》，簡稱《心經》。",

  // step 2: Full title reveal
  "今天，我們一起來認識這部流傳了近兩千年的佛經。",

  // step 3: Question hook — visual only, no narration
  "",
];