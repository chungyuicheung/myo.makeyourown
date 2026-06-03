# Hallmark Redesign — 策略探索家 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the 策略探索家 website using Hallmark's anti-AI-slop design system — replacing the generic AI aesthetic (purple gradients, emoji nav, centered layouts) with a distinctive editorial identity.

**Architecture:**
- Single `design.md` as locked design system for all pages
- Token-driven CSS via `tokens.css`
- Shared `includes/` components updated once, propagating to all pages
- Phased rollout: design system → core pages → content pages → cleanup

**Tech Stack:** Pure HTML + CSS (no build tools), Tailwind CSS CDN (existing), Vanilla JS (existing), Hallmark OKLCH tokens

---

## Phase 0: Design System Foundation

### Files Created in Phase 0:
- Create: `design.md` (root)
- Create: `tokens.css` (root)
- Create: `.hallmark/log.json`
- Create: `.hallmark/preflight.json`

### Task 1: Create design.md

**Files:**
- Create: `design.md`

```markdown
# Design — 策略探索家 (Strategy Explorer)

> A locked design system. Every page redesign reads this file. Do not regenerate per page.

## Genre
**Editorial** — Personal brand with long-form Chinese content. Voice: authentic, considered, literary.

## Macrostructure Family
- **Marketing pages** (index, trip, tv): Marquee Hero or Long Document
- **Content pages** (blog, okinawa-trip): Long Document or Letter
- **Tool pages** (heic-converter, cert-folder): Workbench or Conversational FAQ

## Theme — Almanac (warm editorial)
```
--color-paper:      oklch(97% 0.01 90)   /* warm off-white */
--color-paper-2:    oklch(94% 0.02 85)   /* cream */
--color-ink:        oklch(25% 0.02 60)   /* warm charcoal */
--color-ink-2:      oklch(45% 0.02 60)   /* warm grey */
--color-rule:       oklch(85% 0.01 90)   /* hairline */
--color-accent:     oklch(52% 0.14 38)   /* terracotta/rust */
--color-accent-ink: oklch(97% 0.01 90)   /* on accent */
--color-focus:      oklch(52% 0.14 38)   /* same as accent */
```

## Typography
- **Display:** Noto Serif TC, weight 700, normal tracking
- **Body:** Noto Sans TC, weight 400
- **Mono:** JetBrains Mono (for code/tools)
- Scale anchor: `--text-display` = clamp(2.5rem, 5vw, 4rem)

## Spacing
4-point scale in `tokens.css`:
`--space-xs: 0.75rem; --space-sm: 1rem; --space-md: 1.5rem; --space-lg: 2rem; --space-xl: 3rem; --space-2xl: 4.5rem; --space-3xl: 7rem;`

## Motion
- Reveal: **fade only** — one entrance on first load, content stays
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- No scroll-triggered animations
- Reduced-motion: opacity-only ≤ 150ms

## Microinteractions
- Hover delay: 800ms (tooltips)
- Focus delay: 0ms
- Success: **silent** (no celebratory toasts)
- Focus rings: instant appear, no transition

## CTA Voice
- Primary: solid terracotta fill, pill radius, "開始探索 →"
- Secondary: hairline border, transparent fill

## Nav Archetype
**N5 — Floating pill** (editorial): Brand left, links center-right as pill buttons, no hamburger until mobile. Background: paper with subtle shadow.

## Footer Archetype
**Ft2 — Inline single line**: Single row with social icons + copyright, no 4-column layout.

## What Pages MUST Share
- The brand wordmark
- Terracotta accent (≤ 5% per viewport)
- Noto Serif TC + Noto Sans TC pairing
- CTA button style (pill, terracotta)
- Section heading rhythm (no numbering, no eyebrows)

## What Pages MAY Differ On
- Macrostructure within family (Marquee vs Long Document)
- Content density
- Hero archetype (typography-only is fine)
```

---

### Task 2: Create tokens.css

**Files:**
- Create: `tokens.css`

```css
/* Hallmark Design Tokens — 策略探索家 */
/* Theme: Almanac (editorial cluster) */

:root {
  /* Colors — OKLCH for perceptual accuracy */
  --color-paper:      oklch(97% 0.01 90);
  --color-paper-2:    oklch(94% 0.02 85);
  --color-ink:        oklch(25% 0.02 60);
  --color-ink-2:      oklch(45% 0.02 60);
  --color-rule:       oklch(85% 0.01 90);
  --color-accent:     oklch(52% 0.14 38);
  --color-accent-ink: oklch(97% 0.01 90);
  --color-focus:      oklch(52% 0.14 38);

  /* Typography */
  --font-display: 'Noto Serif TC', 'Source Han Serif TC', Georgia, serif;
  --font-body:    'Noto Sans TC', 'Noto Sans CJK TC', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-md:   1.125rem;
  --text-lg:   1.375rem;
  --text-xl:   1.75rem;
  --text-2xl:  2.25rem;
  --text-3xl:  3rem;
  --text-display: clamp(2.5rem, 5vw, 4rem);

  /* Spacing — 4pt scale */
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs:  0.75rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  2rem;
  --space-xl:  3rem;
  --space-2xl: 4.5rem;
  --space-3xl: 7rem;

  /* Motion */
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:      cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --dur-short:    150ms;
  --dur-medium:   300ms;
  --dur-long:     500ms;

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:    8px;
  --radius-pill:  9999px;
  --radius-card:  var(--radius-md);
}

/* Reduced motion fallback */
@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-short: 0ms;
    --dur-medium: 0ms;
    --dur-long: 0ms;
  }
}
```

---

## Phase 1: Core Component Updates

### Files Modified in Phase 1:
- Modify: `includes/header.html` — replace nav with N5 Floating pill, remove emoji
- Modify: `includes/footer.html` — replace with Ft2 inline single line
- Modify: `includes/head.html` — add tokens.css import, proper font loading

### Task 3: Update includes/head.html

**Files:**
- Modify: `includes/head.html`

```html
<!-- Add before closing </head> on all pages -->
<link rel="stylesheet" href="tokens.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap" rel="stylesheet">
```

---

### Task 4: Replace includes/header.html — N5 Floating pill nav

**Files:**
- Modify: `includes/header.html`

```html
<!-- Hallmark · N5 Floating pill nav -->
<header id="header" class="bg-[var(--color-paper)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] sticky top-0 z-50">
  <nav class="container mx-auto px-6 py-4">
    <!-- Desktop: brand left, links as pill buttons -->
    <div class="hidden md:flex justify-between items-center">
      <a href="index.html" class="font-[var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
        策略探索家
      </a>
      <div class="flex items-center gap-2">
        <a href="trip.html" class="text-sm px-4 py-1.5 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors">旅程</a>
        <a href="trip/okinawa-trip.html" class="text-sm px-4 py-1.5 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors">沖繩</a>
        <a href="trip/hongkong/2025-07-09-red-incense-burner-peak.html" class="text-sm px-4 py-1.5 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors">香港行山</a>
        <a href="tv.html" class="text-sm px-4 py-1.5 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors">影視</a>
        <a href="food.html" class="text-sm px-4 py-1.5 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors">美食</a>
        <a href="index.html" class="text-sm px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:opacity-90 transition-opacity">首頁</a>
      </div>
    </div>

    <!-- Mobile: hamburger with sheet -->
    <div class="flex flex-col items-center md:hidden">
      <div class="flex items-center justify-between w-full mb-3">
        <a href="index.html" class="font-[var(--font-display)] text-xl font-bold text-[var(--color-ink)]">策略探索家</a>
        <button id="mobile-menu-btn" class="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-ink)]" aria-label="打開選單">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      <div id="mobile-menu" class="hidden w-full border-t border-[var(--color-rule)] pt-4 pb-2">
        <div class="flex flex-col gap-1">
          <a href="trip.html" class="px-4 py-2 text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-paper-2)]">旅程</a>
          <a href="trip/okinawa-trip.html" class="px-4 py-2 text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-paper-2)]">沖繩</a>
          <a href="trip/hongkong/2025-07-09-red-incense-burner-peak.html" class="px-4 py-2 text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-paper-2)]">香港行山</a>
          <a href="tv.html" class="px-4 py-2 text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-paper-2)]">影視</a>
          <a href="food.html" class="px-4 py-2 text-[var(--color-ink)] rounded-lg hover:bg-[var(--color-paper-2)]">美食</a>
          <a href="index.html" class="px-4 py-2 mt-2 text-center rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-ink)]">返回首頁</a>
        </div>
      </div>
    </div>
  </nav>
</header>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  }
});
</script>
```

---

### Task 5: Replace includes/footer.html — Ft2 Inline single line

**Files:**
- Modify: `includes/footer.html`

```html
<!-- Hallmark · Ft2 Inline single line footer -->
<footer class="bg-[var(--color-paper-2)] border-t border-[var(--color-rule)] mt-[var(--space-3xl)]">
  <div class="container mx-auto px-6 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-6">
        <span class="font-[var(--font-display)] font-bold text-[var(--color-ink)]">策略探索家</span>
        <div class="flex items-center gap-4">
          <a href="#" aria-label="GitHub" class="text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="#" aria-label="LinkedIn" class="text-[var(--color-ink-2)] hover:text-[var(--color-accent)] transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </div>
      <p class="text-sm text-[var(--color-ink-2)]">© 2025 策略探索家. All rights reserved.</p>
    </div>
  </div>
</footer>
```

---

## Phase 2: Main Landing Page Redesign

### Files Modified in Phase 2:
- Modify: `index.html` — replace hero with Marquee Hero macrostructure, remove animate-on-scroll, fix centered layout

### Task 6: Redesign index.html hero section

**Files:**
- Modify: `index.html` (hero section around line 545-600)

Replace the existing hero with a **Marquee Hero** — a single bold statement filling the viewport, no CTA in fold:

```html
<!-- Hallmark · macrostructure: Marquee Hero · genre: editorial -->
<section class="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 relative overflow-hidden"
         style="background-color: var(--color-paper);">

  <!-- Typographic statement — left-biased -->
  <div class="max-w-3xl relative z-10">
    <p class="text-sm font-[var(--font-body)] text-[var(--color-ink-2)] tracking-wide mb-4">
      產品經理的系統化思維
    </p>
    <h1 class="font-[var(--font-display)] font-bold text-[var(--color-ink)] leading-[1.1]"
        style="font-size: var(--text-display);">
      把人生當產品打造<br>為自己規劃路線圖
    </h1>
    <p class="mt-6 text-lg text-[var(--color-ink-2)] max-w-xl leading-relaxed">
      旅行、科技、投資 — 那些用來打造好產品的思維，也能用來打造更好的自己。
    </p>
    <a href="trip.html"
       class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-medium hover:opacity-90 transition-opacity">
      開始探索旅程
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
      </svg>
    </a>
  </div>

  <!-- Decorative element — typography only, no AI blobs -->
  <div class="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none"
       style="font-size: clamp(15rem, 30vw, 25rem); font-family: var(--font-display); font-weight: 700; color: var(--color-ink);">
    策
  </div>
</section>
```

---

### Task 7: Remove animate-on-scroll from index.html

**Files:**
- Modify: `index.html` (inline styles section)

Remove the `.reveal-on-scroll` CSS and all `reveal-on-scroll` classes from elements.

Delete these CSS rules:
```css
/* DELETE:
.reveal-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}
*/

Then remove `reveal-on-scroll` class from all HTML elements that have it.

---

## Phase 3: Tool Pages Redesign

### Files Modified in Phase 3:
- Modify: `cert-folder.html` — Workbench macrostructure (product screenshots as primary content)
- Modify: `heic-converter.html` — Conversational FAQ macrostructure (bold Q&A for tool pages)

### Task 8: Simplify heic-converter.html — Conversational FAQ style

**Files:**
- Modify: `heic-converter.html` — replace inline styles with tokens.css, simplify layout

Replace the entire inline `<style>` block with tokens.css compatible styles. Key changes:
- Use `var(--color-paper)` for body background
- Use `var(--color-accent)` for buttons
- Use `var(--radius-pill)` for button border-radius
- Use `var(--font-body)` for font-family

---

## Phase 4: Content Pages — Blog & Trip

### Files Modified in Phase 4:
- Modify: `blog/best-certificate-cover-hk-2026.html` (and 6 other blog files)
- Modify: `trip/okinawa-trip.html`
- Modify: `trip/hongkong/2025-07-09-red-incense-burner-peak.html`

### Task 9: Standardize blog article template — Long Document macrostructure

**Files:**
- Modify: `blog/article-template.html`
- Modify: all `blog/*.html` files

Add blog article body styles using design tokens:
```css
.blog-content {
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: 1.8;
    color: var(--color-ink);
    max-width: 680px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-lg);
}

.blog-content h2 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-ink);
    margin-top: var(--space-2xl);
    margin-bottom: var(--space-md);
    border-bottom: 1px solid var(--color-rule);
    padding-bottom: var(--space-xs);
}

.blog-content h3 {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-ink);
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
}

.blog-content a {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
}

/* Article header — full-bleed title, no hero image */
.article-header {
    padding: var(--space-3xl) var(--space-lg) var(--space-xl);
    max-width: 800px;
    margin: 0 auto;
}

.article-header h1 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--color-ink);
    line-height: 1.2;
    margin-bottom: var(--space-md);
}
```

---

## Phase 5: Cleanup — Remove archive/ and Fix Broken Links

### Task 10: Archive/cleanup

**Files:**
- Delete: `archive/index2.html`
- Delete: `archive/index_0.html`
- Delete: `archive/index_system.html`

### Task 11: Fix JSON-LD placeholder hrefs

**Files:**
- Modify: `blog/*.html` files (7 files)
- Modify: `trip.html`

Replace `"url": "#"` with actual URLs or remove the placeholder entries.

---

## File Change Summary

| Phase | Files | Action |
|-------|-------|--------|
| 0 | `design.md`, `tokens.css`, `.hallmark/log.json` | Create |
| 1 | `includes/header.html`, `includes/footer.html`, `includes/head.html` | Modify |
| 2 | `index.html` | Modify |
| 3 | `heic-converter.html`, `cert-folder.html` | Modify |
| 4 | `blog/*.html` (7 files), `trip/okinawa-trip.html`, `trip/hongkong/*.html` | Modify |
| 5 | `archive/*.html` | Delete |

---

## Non-Destructive Implementation Rule

Per Hallmark's redesign protocol:
- **Never delete** route files, component directories, or the old website unless explicitly approved
- **Default to in-place edits** of named files
- The `archive/` files are explicitly old versions confirmed safe to delete

---

## Verification Checklist

Before marking each task complete, verify:
- [ ] CSS uses `var(--token)` not raw hex/OKLCH values
- [ ] No emoji used as icons (use SVG or icon library)
- [ ] No purple/indigo gradients
- [ ] No `reveal-on-scroll` or animate-on-scroll classes
- [ ] Nav uses pill buttons, not inline links with emoji
- [ ] Footer is single-line, not 4-column
- [ ] No `href="#"` placeholder in JSON-LD

---

## Two Execution Options

**1. Subagent-Driven (recommended)**
I dispatch a fresh subagent per phase, review between tasks, fast iteration.

**2. Inline Execution**
Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?