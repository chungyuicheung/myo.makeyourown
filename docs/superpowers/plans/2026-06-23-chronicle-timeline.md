# 編年史時間軸 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在策略探索家網站上建立編年史頁面 chronicle.html，以垂直時間軸混合顯示 git commit、OpenCode session、頁面上線與個人筆記。

**Architecture:** 靜態 HTML 頁面 + JSON 資料檔 + vanilla JS 渲染。無 build step。時間軸以年份/月份分組，使用 `<details>` 元素作展開收合，JS 增強互動（filter、自動收合）。

**Tech Stack:** HTML5 + Tailwind CSS CDN + Vanilla JS + CSS custom properties (tokens.css)

---

### 檔案結構

| 檔案 | 角色 |
|---|---|
| `chronicle.html` | 編年史頁面，含 inline header/footer，載入 chronicle.js |
| `chronicle-data.json` | 所有時間軸事件的資料檔 |
| `assets/js/chronicle.js` | 載入 JSON、渲染時間軸、filter 互動 |
| `scripts/generate-chronicle-data.mjs` | Node.js script：從 `git log` 提取 commits 輸出 JSON |
| `sitemap.xml` | 新增 chronicle.html 條目 |

---

### Task 1: 建立資料生成輔助 script

**Files:**
- Create: `scripts/generate-chronicle-data.mjs`

**Context:** 這個 script 只負責從 `git log` 提取 commits 輸出 JSON。Session 和頁面上線資料需要手動補充。script 產生的 JSON 是初始版本，後續手動維護。

- [ ] **Step 1: 產生 scripts/generate-chronicle-data.mjs**

```javascript
#!/usr/bin/env node
// scripts/generate-chronicle-data.mjs
// 從 git log 提取 commits，輸出 chronicle-data.json 的初始版本

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

// 取得所有 commits (format: hash|date|subject)
const logOutput = execSync(
  'git log --all --format="%h|%ad|%s" --date=short',
  { cwd: repoRoot, encoding: 'utf-8' }
);

const events = logOutput
  .trim()
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [hash, date, ...subjectParts] = line.split('|');
    const subject = subjectParts.join('|'); // 有些 commit 訊息可能包含 |
    const tags = [];

    // 從 commit 訊息推斷標籤
    if (/blog|article|post/i.test(subject)) tags.push('blog');
    if (/trip|travel|okinawa|hongkong/i.test(subject)) tags.push('travel');
    if (/nav|header|footer|design/i.test(subject)) tags.push('design');
    if (/test|tdd/i.test(subject)) tags.push('test');
    if (/ai|qwen|image|cover/i.test(subject)) tags.push('ai');
    if (/food/i.test(subject)) tags.push('food');
    if (/cert|heic|tool/i.test(subject)) tags.push('tool');
    if (/seo|sitemap|robots/i.test(subject)) tags.push('seo');
    if (/refactor|fix|clean/i.test(subject)) tags.push('maintenance');

    return {
      date,
      type: 'commit',
      title: subject,
      description: '',
      link: `https://github.com/ashashash001001-stack/myo.makeyourown/commit/${hash}`,
      tags
    };
  });

// 依日期排序（舊到新）
events.sort((a, b) => a.date.localeCompare(b.date));

const output = { events };
const outPath = join(repoRoot, 'chronicle-data.json');
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Wrote ${events.length} events to ${outPath}`);
```

- [ ] **Step 2: 執行 script 產生初始 JSON**

Run: `node scripts/generate-chronicle-data.mjs`
Expected: "Wrote 91 events to .../chronicle-data.json"
Verify file exists and is valid JSON.

- [ ] **Step 3: 手動補上 session 資料**

將以下 session 事件手動合併到 `chronicle-data.json` 的 `events` 陣列中：

```json
    {
      "date": "2026-05-22",
      "type": "session",
      "title": "Okinawa food & craft 5-day page — TDD development",
      "description": "建立沖繩美食手作頁面，逐步 TDD 開發 40 頁簡報與行程頁（37 messages）",
      "sessionId": "ses_1771b3c4bffepcIyOYZrzlRE2l",
      "tags": ["travel", "tdd"]
    },
    {
      "date": "2026-06-03",
      "type": "session",
      "title": "AI cover images + multi-session blog workflow",
      "description": "用 Qwen Studio 生成部落格封面圖，處理 session 延續與工具切換（266 messages）",
      "sessionId": "ses_171c2ef33ffeLbWjjyfggTZBZz",
      "tags": ["ai", "blog"]
    },
    {
      "date": "2026-06-03",
      "type": "session",
      "title": "Hallmark redesign continuation + PR merge",
      "description": "繼續 Hallmark 設計改造，合併 PR 與修復衝突（30 messages）",
      "sessionId": "ses_171c6a7a8ffe4FekLNo5qnSuFT",
      "tags": ["design", "maintenance"]
    },
    {
      "date": "2026-06-05",
      "type": "session",
      "title": "Blog cover images deep dive",
      "description": "深入調整 blog cover images 的 AI 生成工作流程（37 messages）",
      "sessionId": "ses_16902dadbffeQTmTtKs9d8o7HK",
      "tags": ["ai", "blog"]
    },
    {
      "date": "2026-06-22",
      "type": "session",
      "title": "Chronicle project — multi-agent orchestration",
      "description": "用 ultraworker 進行編年史功能的初步探索與 session 管理（187 messages）",
      "sessionId": "ses_11113060bffevpVm5TokusKKTd",
      "tags": ["chronicle"]
    }
```

- [ ] **Step 4: 手動補上頁面上線事件**

將以下 launch 事件合併到 `chronicle-data.json`：

```json
    {
      "date": "2025-05-21",
      "type": "launch",
      "title": "策略探索家網站上線",
      "description": "第一版 index page 與 cert-folder 工具頁面發布",
      "link": "/",
      "tags": ["launch"]
    },
    {
      "date": "2025-07-03",
      "type": "launch",
      "title": "Trip 頁面上線 — 香港行山路線",
      "description": "trip.html 與紅香爐峰行山攻略發布",
      "link": "/trip.html",
      "tags": ["travel", "launch"]
    },
    {
      "date": "2025-07-04",
      "type": "launch",
      "title": "TV 頁面上線 — LibreTV 影視",
      "description": "tv.html 影視推薦頁面上線",
      "link": "/tv.html",
      "tags": ["launch"]
    },
    {
      "date": "2026-03-12",
      "type": "launch",
      "title": "美食頁面上線",
      "description": "food.html — 用產品思維探索美食系統",
      "link": "/food.html",
      "tags": ["food", "launch"]
    },
    {
      "date": "2026-04-02",
      "type": "launch",
      "title": "部落格專區上線",
      "description": "blog/ 目錄建立，首批 3 篇香港婚姻相關 SEO 文章發布",
      "link": "/blog/",
      "tags": ["blog", "launch"]
    },
    {
      "date": "2026-05-22",
      "type": "launch",
      "title": "沖繩深度旅遊頁面上線",
      "description": "okinawa-food-craft-5days.html 與 okinawa-trip.html 發布",
      "link": "/trip/okinawa-food-craft-5days.html",
      "tags": ["travel", "launch"]
    }
```

- [ ] **Step 5: 驗證 JSON 格式正確**

Run: `node -e "const d=require('./chronicle-data.json'); console.log('Events:', d.events.length, '| Types:', [...new Set(d.events.map(e=>e.type))])"`
Expected: Events: ~102 | Types: commit,session,launch

---

### Task 2: 建立 chronicle.html 頁面

**Files:**
- Create: `chronicle.html`

遵循現有頁面模式（參考 index.html、trip.html）：inline header/footer、Tailwind CDN、tokens.css、Google Fonts。

- [ ] **Step 1: 建立 chronicle.html 骨架**

```html
<!DOCTYPE html>
<html lang="zh-Hant" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="策略探索家的探索編年史 — 從程式開發、旅行規劃到工具建置，記錄每一次探索的足跡。">
    
    <title>策略探索家 | 探索編年史</title>
    
    <link rel="canonical" href="https://makeyourown.pages.dev/chronicle.html">

    <meta property="og:title" content="策略探索家 | 探索編年史">
    <meta property="og:description" content="策略探索家的探索編年史 — 從程式開發、旅行規劃到工具建置，記錄每一次探索的足跡。">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://makeyourown.pages.dev/chronicle.html">
    <meta property="og:site_name" content="策略探索家">
    <meta property="og:locale" content="zh_TW">

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4331940044118490"
     crossorigin="anonymous"></script>

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="tokens.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: var(--color-paper);
        }

        /* === Timeline Layout === */
        .timeline {
            position: relative;
            padding-left: 2rem;
        }
        /* Vertical line */
        .timeline::before {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: var(--color-rule);
        }

        /* Event dot on the timeline line */
        .tl-dot {
            position: absolute;
            left: -1.5rem;
            top: 0.35rem;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid var(--color-paper);
            z-index: 1;
        }
        .tl-dot.type-commit  { background-color: #22c55e; }  /* green */
        .tl-dot.type-session { background-color: #3b82f6; }  /* blue */
        .tl-dot.type-launch  { background-color: #f97316; }  /* orange */
        .tl-dot.type-note    { background-color: #a855f7; }  /* purple */

        /* Year section */
        .year-heading {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: var(--text-2xl);
            color: var(--color-ink);
            margin-bottom: var(--space-md);
            padding-bottom: var(--space-xs);
            border-bottom: 2px solid var(--color-accent);
            position: relative;
        }

        /* Month summary (details) */
        .month-summary {
            cursor: pointer;
            font-family: var(--font-body);
            font-weight: 500;
            font-size: var(--text-md);
            color: var(--color-ink-2);
            padding: var(--space-sm) 0;
            list-style: none;
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            user-select: none;
        }
        .month-summary::-webkit-details-marker { display: none; }
        .month-summary::before {
            content: '▸';
            color: var(--color-accent);
            transition: transform var(--dur-short) var(--ease-out);
            display: inline-block;
        }
        details[open] > .month-summary::before {
            transform: rotate(90deg);
        }
        .month-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 1.25rem;
            height: 1.25rem;
            padding: 0 0.3rem;
            border-radius: var(--radius-pill);
            font-size: var(--text-xs);
            background-color: var(--color-accent-light);
            color: var(--color-accent);
        }

        /* Event card */
        .event-card {
            position: relative;
            padding: var(--space-sm) var(--space-md);
            padding-left: var(--space-md);
            margin-bottom: var(--space-xs);
            border-bottom: 1px solid var(--color-rule);
            transition: background-color var(--dur-short) var(--ease-out);
        }
        .event-card:last-child { border-bottom: none; }
        .event-card:hover {
            background-color: var(--color-paper-2);
        }
        .event-date {
            font-size: var(--text-xs);
            color: var(--color-ink-2);
            font-weight: 500;
            min-width: 3.5rem;
        }
        .event-title {
            font-weight: 500;
            color: var(--color-ink);
        }
        .event-title a {
            color: var(--color-ink);
            text-decoration: none;
        }
        .event-title a:hover {
            color: var(--color-accent);
            text-decoration: underline;
        }
        .event-desc {
            font-size: var(--text-sm);
            color: var(--color-ink-2);
            margin-top: 2px;
        }
        .event-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: var(--space-2xs);
        }
        .event-tag {
            font-size: 0.65rem;
            padding: 1px 6px;
            border-radius: var(--radius-pill);
            background-color: var(--color-paper-2);
            color: var(--color-ink-2);
            border: 1px solid var(--color-rule);
        }

        /* Filter bar */
        .filter-btn {
            font-size: var(--text-sm);
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-pill);
            border: 1px solid var(--color-rule);
            background-color: transparent;
            color: var(--color-ink-2);
            cursor: pointer;
            transition: all var(--dur-short) var(--ease-out);
        }
        .filter-btn:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
        }
        .filter-btn.active {
            background-color: var(--color-accent);
            border-color: var(--color-accent);
            color: var(--color-accent-ink);
        }
        .year-jump {
            font-size: var(--text-sm);
            color: var(--color-ink-2);
            cursor: pointer;
            text-decoration: none;
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
        }
        .year-jump:hover {
            color: var(--color-accent);
            background-color: var(--color-paper-2);
        }

        /* Hidden state for filter */
        .event-hidden { display: none; }

        /* Empty state */
        .empty-state {
            text-align: center;
            padding: var(--space-xl);
            color: var(--color-ink-2);
            font-size: var(--text-sm);
        }

        /* Mobile: compact layout */
        @media (max-width: 639px) {
            .timeline { padding-left: 1.5rem; }
            .timeline::before { left: 0.25rem; }
            .tl-dot { left: -1.25rem; width: 8px; height: 8px; }
            .event-card { padding: var(--space-xs) var(--space-sm); }
        }
    </style>
</head>
<body>

    <!-- ===== HEADER (inline, matches includes/header.html pattern) ===== -->
    <header id="header"
            class="sticky top-0 z-50 transition-all duration-300"
            style="background-color: var(--color-paper); box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/"
           class="font-[var(--font-display)] text-xl font-bold"
           style="color: var(--color-ink);">
           策略探索家
        </a>
        <div class="flex items-center gap-2">
          <div class="relative group">
            <button class="text-sm px-4 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    style="color: var(--color-ink);"
                    onmouseover="this.style.backgroundColor='var(--color-paper-2)'"
                    onmouseout="this.style.backgroundColor='transparent'">
              旅程 <span class="text-xs">▼</span>
            </button>
            <div class="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-2 min-w-[180px] hidden group-hover:block z-50"
                 style="border-color: var(--color-rule);">
              <a href="/trip/okinawa-trip.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">沖繩七天</a>
              <a href="/trip/okinawa-food-craft-5days.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">沖繩美食手作</a>
              <a href="/trip/okinawa-presentation.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">沖繩簡報</a>
              <a href="/trip/hongkong/2025-07-09-red-incense-burner-peak.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">香港行山</a>
            </div>
          </div>
          <div class="relative group">
            <button class="text-sm px-4 py-1.5 rounded-full transition-colors flex items-center gap-1"
                    style="color: var(--color-ink);"
                    onmouseover="this.style.backgroundColor='var(--color-paper-2)'"
                    onmouseout="this.style.backgroundColor='transparent'">
              文章 <span class="text-xs">▼</span>
            </button>
            <div class="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-2 min-w-[180px] hidden group-hover:block z-50"
                 style="border-color: var(--color-rule);">
              <a href="/blog/best-wedding-gifts-hk.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">婚禮禮物</a>
              <a href="/blog/hk-marriage-certificate-size-guide.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">結婚證書尺寸</a>
              <a href="/blog/hk-marriage-registry-guide.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">註冊攻略</a>
              <a href="/blog/how-to-preserve-marriage-certificate.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">Preservation指南</a>
              <a href="/blog/hk-marriage-registration-checklist.html" class="block px-4 py-2 text-sm hover:bg-gray-50" style="color: var(--color-ink);">婚禮檢查表</a>
            </div>
          </div>
          <a href="/tv.html"
             class="text-sm px-4 py-1.5 rounded-full transition-colors"
             style="color: var(--color-ink);"
             onmouseover="this.style.backgroundColor='var(--color-paper-2)'"
             onmouseout="this.style.backgroundColor='transparent'">影視</a>
          <a href="/food.html"
             class="text-sm px-4 py-1.5 rounded-full transition-colors"
             style="color: var(--color-ink);"
             onmouseover="this.style.backgroundColor='var(--color-paper-2)'"
             onmouseout="this.style.backgroundColor='transparent'">美食</a>
          <a href="/chronicle.html"
             class="text-sm px-4 py-1.5 rounded-full transition-opacity"
             style="background-color: var(--color-accent); color: var(--color-accent-ink);"
             onmouseover="this.style.opacity='0.9'"
             onmouseout="this.style.opacity='1'">編年史</a>
        </div>
      </nav>
    </header>

    <!-- ===== MAIN CONTENT ===== -->
    <main class="container mx-auto px-6 py-12 max-w-4xl">
        <!-- Page header -->
        <div class="mb-12">
            <h1 class="font-[var(--font-display)] font-bold text-3xl md:text-4xl" style="color: var(--color-ink);">
                探索編年史
            </h1>
            <p class="mt-3" style="color: var(--color-ink-2);">
                從程式開發、旅行規劃到工具建置 — 每一次 commit、每一個 session、每一頁上線，都是探索的足跡。
            </p>
        </div>

        <!-- Filter bar -->
        <div id="filter-bar" class="flex flex-wrap items-center gap-2 mb-8">
            <button class="filter-btn active" data-filter="all">全部</button>
            <button class="filter-btn" data-filter="commit"> Commit</button>
            <button class="filter-btn" data-filter="session"> Session</button>
            <button class="filter-btn" data-filter="launch"> 上線</button>
            <button class="filter-btn" data-filter="note"> 筆記</button>
            <span class="flex-1"></span>
            <span id="year-jumps" class="flex gap-1"></span>
        </div>

        <!-- Timeline container -->
        <div id="timeline" class="timeline">
            <div class="empty-state">載入中…</div>
        </div>
    </main>

    <!-- ===== FOOTER (inline, matches includes/footer.html Ft2 pattern) ===== -->
    <footer class="border-t mt-[var(--space-3xl)]"
            style="background-color: var(--color-paper-2); border-color: var(--color-rule);">
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-6">
            <span class="font-[var(--font-display)] font-bold"
                  style="color: var(--color-ink);">策略探索家</span>
            <div class="flex items-center gap-4">
              <a href="#" aria-label="GitHub"
                 class="transition-colors" style="color: var(--color-ink-2);"
                 onmouseover="this.style.color='var(--color-accent)'"
                 onmouseout="this.style.color='var(--color-ink-2)'">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn"
                 class="transition-colors" style="color: var(--color-ink-2);"
                 onmouseover="this.style.color='var(--color-accent)'"
                 onmouseout="this.style.color='var(--color-ink-2)'">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <p class="text-sm" style="color: var(--color-ink-2);">
            © 2025 策略探索家. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <script src="assets/js/chronicle.js"></script>
</body>
</html>
```

- [ ] **Step 2: 驗證 HTML 無語法錯誤**

Open in browser (manual check) or run: `node -e "const fs=require('fs'); const h=fs.readFileSync('chronicle.html','utf-8'); console.log(h.includes('</html>') ? 'OK' : 'MISSING </html>')"`
Expected: OK

---

### Task 3: 建立 chronicle.js — 時間軸渲染與互動

**Files:**
- Create: `assets/js/chronicle.js`

- [ ] **Step 1: 建立 assets/js/chronicle.js**

```javascript
// assets/js/chronicle.js
// 載入 chronicle-data.json 並渲染垂直時間軸

(function () {
  'use strict';

  const FILTER_STORAGE_KEY = 'chronicle-filter';

  // 載入資料
  fetch('chronicle-data.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      renderTimeline(data.events);
      setupFilters(data.events);
      populateYearJumps(data.events);
      restoreFilterState(data.events);
    })
    .catch(err => {
      document.getElementById('timeline').innerHTML =
        `<div class="empty-state">無法載入編年史資料：${err.message}</div>`;
    });

  // === 渲染時間軸 ===
  function renderTimeline(events) {
    // 依年份分組
    const byYear = groupBy(events, e => e.date.slice(0, 4));
    const sortedYears = Object.keys(byYear).sort((a, b) => b.localeCompare(a)); // 最新在前

    const container = document.getElementById('timeline');
    let html = '';

    for (const year of sortedYears) {
      html += `<section class="year-section" data-year="${year}">`;
      html += `<h2 class="year-heading">${year}</h2>`;

      // 依月份分組
      const byMonth = groupBy(byYear[year], e => e.date.slice(5, 7));
      const sortedMonths = Object.keys(byMonth).sort((a, b) => b.localeCompare(a)); // 最新在前

      for (const month of sortedMonths) {
        const monthEvents = byMonth[month];
        const monthName = getMonthName(month);
        const isLatest = (year === sortedYears[0] && month === sortedMonths[0]);

        html += `<details class="month-section" data-year="${year}" data-month="${month}" ${isLatest ? 'open' : ''}>`;
        html += `<summary class="month-summary">${monthName} <span class="month-badge">${monthEvents.length}</span></summary>`;

        // 依日期排序（最新的在前面，因為月份也是最新的在前）
        monthEvents.sort((a, b) => b.date.localeCompare(a.date));

        for (const evt of monthEvents) {
          html += renderEvent(evt);
        }

        html += `</details>`;
      }

      html += `</section>`;
    }

    container.innerHTML = html;
  }

  // === 渲染單一事件 ===
  function renderEvent(evt) {
    const type = evt.type || 'note';
    const displayDate = evt.date.slice(5); // MM-DD
    const hasLink = evt.link || evt.sessionId;

    let linkUrl = '';
    if (evt.link) linkUrl = evt.link;
    else if (evt.sessionId) linkUrl = `https://opencode.ai/session/${evt.sessionId}`;

    const tagsHtml = (evt.tags || [])
      .map(t => `<span class="event-tag">${t}</span>`)
      .join('');

    return `
      <div class="event-card" data-type="${type}" data-date="${evt.date}">
        <div class="tl-dot type-${type}"></div>
        <div class="flex items-start gap-3">
          <span class="event-date whitespace-nowrap">${displayDate}</span>
          <div class="flex-1 min-w-0">
            <div class="event-title">
              ${hasLink
                ? `<a href="${linkUrl}" target="_blank" rel="noopener">${escapeHtml(evt.title)}</a>`
                : escapeHtml(evt.title)
              }
            </div>
            ${evt.description ? `<div class="event-desc">${escapeHtml(evt.description)}</div>` : ''}
            ${tagsHtml ? `<div class="event-tags">${tagsHtml}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // === Filter 功能 ===
  function setupFilters(events) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // 更新按鈕狀態
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 儲存 filter 狀態
        try { localStorage.setItem(FILTER_STORAGE_KEY, filter); } catch (_) {}

        // 套用 filter
        applyFilter(filter, events);
      });
    });
  }

  function applyFilter(filter, events) {
    const cards = document.querySelectorAll('.event-card');
    const sections = document.querySelectorAll('.month-section');
    const years = document.querySelectorAll('.year-section');

    cards.forEach(card => {
      if (filter === 'all' || card.dataset.type === filter) {
        card.classList.remove('event-hidden');
      } else {
        card.classList.add('event-hidden');
      }
    });

    // 隱藏空的月份
    sections.forEach(section => {
      const visible = section.querySelectorAll('.event-card:not(.event-hidden)');
      if (visible.length === 0) {
        section.classList.add('event-hidden');
      } else {
        section.classList.remove('event-hidden');
      }
    });

    // 隱藏空的年份
    years.forEach(yr => {
      const visible = yr.querySelectorAll('.month-section:not(.event-hidden)');
      if (visible.length === 0) {
        yr.classList.add('event-hidden');
      } else {
        yr.classList.remove('event-hidden');
      }
    });
  }

  function restoreFilterState(events) {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved && saved !== 'all') {
        const btn = document.querySelector(`.filter-btn[data-filter="${saved}"]`);
        if (btn) {
          btn.click();
        }
      }
    } catch (_) {}
  }

  // === 年份跳轉 ===
  function populateYearJumps(events) {
    const byYear = groupBy(events, e => e.date.slice(0, 4));
    const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));
    const container = document.getElementById('year-jumps');

    container.innerHTML = years.map(y =>
      `<a href="#" class="year-jump" data-year="${y}">${y}</a>`
    ).join(' · ');

    container.addEventListener('click', e => {
      const target = e.target.closest('.year-jump');
      if (!target) return;
      e.preventDefault();
      const year = target.dataset.year;
      const section = document.querySelector(`.year-section[data-year="${year}"]`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // === 工具函式 ===
  function groupBy(arr, fn) {
    const map = {};
    for (const item of arr) {
      const key = fn(item);
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return map;
  }

  function getMonthName(m) {
    const names = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    return names[parseInt(m, 10) - 1] || m;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
```

- [ ] **Step 2: 驗證 JS 無語法錯誤**

Run: `node -e "try { new Function(require('fs').readFileSync('assets/js/chronicle.js','utf-8')); console.log('OK'); } catch(e) { console.log('SYNTAX ERROR:', e.message); }"`
Expected: OK (可能會有 `fetch` / `localStorage` 的 reference error，但語法本身應正確)

---

### Task 4: 更新 sitemap.xml

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: 在 sitemap.xml 加入 chronicle.html**

在 `</urlset>` 前加入：

```xml
  <url>
    <loc>https://makeyourown.pages.dev/chronicle.html</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
```

- [ ] **Step 2: 驗證 XML 格式**

Run: `node -e "try { const p = require('fs').readFileSync('sitemap.xml','utf-8'); console.log(p.includes('chronicle.html') ? 'OK: chronicle.html found' : 'MISSING'); } catch(e) { console.log('ERR:', e.message); }"`
Expected: "OK: chronicle.html found"

---

### Task 5: 最終驗證

**Files:** （無修改，純驗證）

- [ ] **Step 1: 檢查所有檔案存在**

Run: `ls -la chronicle.html chronicle-data.json assets/js/chronicle.js scripts/generate-chronicle-data.mjs`
Expected: 所有四個檔案都存在

- [ ] **Step 2: 檢查 JSON 格式**

Run: `node -e "const d=require('./chronicle-data.json'); console.log('Events:', d.events.length, '| First:', d.events[0]?.date, '| Last:', d.events[d.events.length-1]?.date)"`
Expected: 列出事件數量與日期範圍

- [ ] **Step 3: 在瀏覽器中手動打開 chronicle.html**

確認事項：
- 時間軸正常顯示，月份可展開/收合
- Filter 按鈕可正確篩選事件類型
- 年份跳轉可滾動到對應年份
- Commit 連結可點開 GitHub
- 手機版佈局正確
