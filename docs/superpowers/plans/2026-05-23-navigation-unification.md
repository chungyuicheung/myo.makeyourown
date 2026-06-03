# Navigation Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a consistent, full-site navigation bar and back-to-home links to every HTML page in the static site, enabling free navigation between the homepage and all sub-pages. The design must exactly match the existing `index.html` header aesthetic — sticky, backdrop-blur, indigo pill nav links, mobile hamburger.

**Architecture:** Extract the existing `index.html` header into a single reusable `components/site-header.html` partial. All 19 pages include this one file. The partial auto-detects page depth for correct relative paths and supports both light-theme (策略探索家) and dark-theme (make your own tv) brands.

**Tech Stack:** Vanilla HTML/CSS/JS (Tailwind CSS via CDN, Noto Sans TC via Google Fonts). No build step.

---

## Design Direction (Frontend Review)

**Reference:** The header in `index.html` lines 111–158 is the canonical implementation. Do NOT deviate.

**Exact design to match:**
- Sticky header: `bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm`
- Brand: `text-xl font-bold text-indigo-700` (light) / `text-indigo-400` (dark)
- Nav links: `rounded-full px-3 py-1.5 text-sm`, hover `bg-indigo-100/80`, active `bg-indigo-100/80 text-indigo-800`
- Mobile: hamburger button + full-width dropdown with `border-b border-gray-100` items
- Back link (sub-pages only): `text-sm text-gray-500 hover:text-indigo-600`

---

## File Inventory

### Pages grouped by directory depth

| Depth | Pages | Relative path to root |
|-------|-------|----------------------|
| 0 (root) | `index.html`, `trip.html`, `tv.html`, `food.html`, `cert-folder.html`, `heic-converter.html` | `./` |
| 1 (blog/) | 7 blog pages | `../` |
| 1 (trip/) | 3 trip pages | `../` |
| 2 (trip/hongkong/) | 1 page | `../../` |
| 1 (archive/) | 3 archive pages | `../` |

### Files to create
- `components/site-header.html` — single shared header partial

### Files to modify (19 total)
- `trip.html`, `tv.html`, `food.html`, `heic-converter.html` (root)
- 7 blog/ pages (depth 1)
- 3 trip/ pages (depth 1)
- `trip/hongkong/2025-07-09-red-incense-burner-peak.html` (depth 2)
- 3 archive/ pages (depth 1)
- `cert-folder.html` (special: different brand, add back link only)

### Files to NOT modify
- `google5b106a66b8e06819.html` — Google verification
- `index.html` — already complete, reference implementation
- `includes/` partials — superseded by `components/site-header.html`

---

## Task 1: Create components/ directory and site-header.html

**Files:**
- Create: `components/site-header.html`

- [ ] **Step 1: Create the components directory**

Run: `mkdir -p components`

- [ ] **Step 2: Write components/site-header.html**

The file contains the complete header markup (from `index.html` lines 111–158) with:
- `NAV_ROOT` auto-detection for relative paths
- Back link shown on all non-index pages
- Brand auto-detection (light vs dark theme)
- Full desktop + mobile responsive nav

```html
<!-- components/site-header.html -->
<!-- Shared Site Header — include at top of <body> on every page -->
<header id="header" class="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm transition-all duration-300" data-brand="策略探索家">
  <nav class="container mx-auto px-6 py-4">
    <!-- Desktop Header Layout -->
    <div class="hidden md:flex justify-between items-center" id="desktop-nav">
      <!-- Left: Brand + Back Link -->
      <div class="flex items-center gap-6">
        <a href="INDEX_HREF" class="text-xl font-bold" id="desktop-brand">
          <span id="brand-text">策略探索家</span>
        </a>
        <a href="INDEX_HREF" class="text-sm text-gray-500 hover:text-indigo-600 transition-colors" id="back-link" style="display: none;">
          ⬅️ 返回首頁
        </a>
      </div>

      <!-- Center: Navigation Links -->
      <div class="flex items-center gap-8" id="desktop-links"></div>

      <!-- Right: CTA Button (optional) -->
      <div id="desktop-cta" style="display: none;"></div>
    </div>

    <!-- Mobile Header -->
    <div class="flex flex-col items-center md:hidden">
      <div class="flex items-center gap-2 w-full justify-between mb-3">
        <a href="INDEX_HREF" class="text-xl font-bold" id="mobile-brand">
          <span id="mobile-brand-text">策略探索家</span>
        </a>
        <button id="mobile-menu-btn" class="text-gray-700 hover:text-indigo-600 focus:outline-none p-3 min-w-[44px] min-h-[44px] flex items-center justify-center touch-action-manipulation">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu (hidden by default) -->
      <div id="mobile-menu" class="hidden w-full mt-3 pb-4 border-t border-gray-200">
        <div class="flex flex-col space-y-3 pt-4" id="mobile-links"></div>
      </div>
    </div>
  </nav>
</header>

<script>
(function() {
  // Auto-detect directory depth from window.location.pathname
  function getNavRoot() {
    var path = window.location.pathname;
    if (path.includes('/trip/hongkong/')) return '../../';
    if (path.includes('/blog/') || path.includes('/trip/') || path.includes('/archive/')) return '../';
    return './';
  }

  var NAV_ROOT = getNavRoot();
  var INDEX_HREF = NAV_ROOT + 'index.html';

  // Replace INDEX_HREF placeholder in HTML with actual path
  document.querySelectorAll('a[href="INDEX_HREF"]').forEach(function(el) {
    el.href = INDEX_HREF;
  });

  function detectBrand() {
    var title = document.title;
    if (title.indexOf('make your own tv') > -1) return 'make your own tv';
    return '策略探索家';
  }

  function getCurrentPage() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  function applyTheme(config) {
    var header = document.getElementById('header');
    var brandEls = document.querySelectorAll('#brand-text, #desktop-brand, #mobile-brand, #mobile-brand-text');
    if (config.theme === 'dark') {
      header.className = header.className.replace(/bg-\w+\/\w+/, 'bg-gray-900/80');
      header.classList.add('shadow-indigo-500/10');
      brandEls.forEach(function(el) { if (el) el.className = 'text-indigo-400'; });
    } else {
      header.className = header.className.replace(/bg-\w+\/\w+/, 'bg-white/80');
      header.classList.remove('shadow-indigo-500/10');
      brandEls.forEach(function(el) { if (el) el.className = 'text-indigo-700'; });
    }
  }

  function renderDesktopLinks(items, currentPage) {
    var container = document.getElementById('desktop-links');
    if (!container) return;
    var html = items.map(function(item) {
      var isAnchor = item.anchor;
      var isActive = !isAnchor && (item.href.indexOf(currentPage) > -1);
      var cls = 'text-sm transition-colors px-3 py-1.5 rounded-full';
      if (isAnchor) {
        cls += ' text-gray-300 hover:text-indigo-400';
      } else {
        cls += isActive ? ' bg-indigo-100/80 text-indigo-800' : ' text-gray-700 hover:text-indigo-600 bg-gray-100/80';
      }
      var emoji = item.emoji ? '<span class="mr-1">' + item.emoji + '</span>' : '';
      return '<a href="' + item.href + '" class="' + cls + '">' + emoji + item.name + '</a>';
    });
    container.innerHTML = html.join('');
  }

  function renderMobileLinks(items, currentPage) {
    var container = document.querySelector('#mobile-menu #mobile-links');
    if (!container) return;
    var html = items.map(function(item) {
      var isAnchor = item.anchor;
      var isActive = !isAnchor && (item.href.indexOf(currentPage) > -1);
      var cls = 'text-base py-2 border-b border-gray-100 last:border-0';
      if (isAnchor) {
        cls += ' text-gray-300 hover:text-indigo-400';
      } else {
        cls += isActive ? ' text-indigo-600 font-semibold' : ' text-gray-700 hover:text-indigo-600';
      }
      var emoji = item.emoji ? item.emoji + ' ' : '';
      return '<a href="' + item.href + '" class="' + cls + '">' + emoji + item.name + '</a>';
    });
    container.innerHTML = html.join('');
  }

  function renderCTA(ctaConfig) {
    var container = document.getElementById('desktop-cta');
    if (!container || !ctaConfig) return;
    container.innerHTML = '<a href="' + ctaConfig.href + '" class="' + ctaConfig.class + ' font-semibold px-5 py-2 rounded-lg cta-btn">' + ctaConfig.text + '</a>';
    container.style.display = 'block';
  }

  function renderBackLink() {
    var backLink = document.getElementById('back-link');
    if (!backLink) return;
    var currentPage = getCurrentPage();
    if (currentPage !== 'index.html') {
      backLink.href = INDEX_HREF;
      backLink.style.display = 'inline-block';
    }
  }

  function initHeader() {
    var brand = detectBrand();
    var config = NAVIGATION_CONFIG[brand] || NAVIGATION_CONFIG['策略探索家'];
    var currentPage = getCurrentPage();
    document.documentElement.setAttribute('data-brand', brand);
    applyTheme(config);
    renderDesktopLinks(config.items, currentPage);
    renderMobileLinks(config.items, currentPage);
    renderBackLink();
    renderCTA(config.cta);
  }

  function setupMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        menu.classList.toggle('hidden');
      });
    }
  }

  // Navigation config — NAV_ROOT is set at the top of this script block
  var NAVIGATION_CONFIG = {
    '策略探索家': {
      brand: '策略探索家',
      theme: 'light',
      cta: null,
      items: [
        { name: '首頁', emoji: '🏠', href: NAV_ROOT + 'index.html' },
        { name: '旅程', emoji: '✈️', href: NAV_ROOT + 'trip.html' },
        { name: '影視', emoji: '📺', href: NAV_ROOT + 'tv.html' },
        { name: '美食', emoji: '🍽️', href: NAV_ROOT + 'food.html' }
      ]
    },
    'make your own tv': {
      brand: 'make your own tv',
      theme: 'dark',
      cta: { text: '開始使用', href: '#demo', class: 'bg-indigo-600 text-white', mobileHighlight: true },
      items: [
        { name: '核心功能', emoji: '⚡', href: '#features', anchor: true },
        { name: '精選推薦', emoji: '✨', href: '#showcase', anchor: true },
        { name: '立即體驗', emoji: '🚀', href: '#demo', anchor: true },
        { name: '關於我們', emoji: 'ℹ️', href: '#contact', anchor: true }
      ]
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    setupMobileMenu();
  });
})();
</script>
```

- [ ] **Step 3: Verify file was created**

Run: `ls -la components/site-header.html`

---

## Task 2: Modify root-level pages (depth 0)

**Files:**
- Modify: `trip.html`, `tv.html`, `food.html`, `heic-converter.html`

For each page: remove the existing inline header HTML and duplicate JS blocks, then insert the shared header HTML from `components/site-header.html` with `NAV_ROOT = './'`.

**Important:** Copy the header HTML from `components/site-header.html` directly into each page (do not use fetch() to avoid FOUC). The header JS is self-contained and will work on each page.

- [ ] **Step 1: Modify trip.html**

Find and remove the existing `<header id="header"...>` block and its inline `<script>` blocks. Insert the shared header HTML from `components/site-header.html` with `NAV_ROOT = './'`.

- [ ] **Step 2: Modify tv.html**

Same pattern. `tv.html` uses dark theme — `detectBrand()` will auto-apply it based on page title.

- [ ] **Step 3: Modify food.html**

Same pattern.

- [ ] **Step 4: Modify heic-converter.html**

Check if it has a header — if not, add the shared header with `NAV_ROOT = './'`.

---

## Task 3: Modify blog/ pages (depth 1)

**Files:**
- Modify: `blog/best-wedding-gifts-hk.html`, `blog/hk-marriage-certificate-size-guide.html`, `blog/hk-marriage-registration-checklist.html`, `blog/hk-marriage-registry-guide.html`, `blog/how-to-preserve-marriage-certificate.html`, `blog/best-certificate-cover-hk-2026.html`, `blog/article-template.html`

- [ ] **Step 1: Add shared header to blog/best-wedding-gifts-hk.html**

Insert shared header HTML immediately after `<body>`, with `NAV_ROOT = '../'` in the JS section.

- [ ] **Step 2: Repeat for remaining 6 blog pages**

Same pattern — `NAV_ROOT = '../'` for all blog/ pages.

---

## Task 4: Modify trip/ pages (depth 1)

**Files:**
- Modify: `trip/okinawa-trip.html`, `trip/okinawa-food-craft-5days.html`, `trip/okinawa-presentation.html`

- [ ] **Step 1: Add shared header to trip/okinawa-trip.html**

Insert shared header after `<body>`, with `NAV_ROOT = '../'`.

- [ ] **Step 2: Repeat for okinawa-food-craft-5days.html and okinawa-presentation.html**

---

## Task 5: Modify trip/hongkong/ page (depth 2)

**Files:**
- Modify: `trip/hongkong/2025-07-09-red-incense-burner-peak.html`

- [ ] **Step 1: Add shared header**

Insert shared header after `<body>`, with `NAV_ROOT = '../../'` for this depth-2 page.

---

## Task 6: Modify archive/ pages (depth 1)

**Files:**
- Modify: `archive/index_system.html`, `archive/index_0.html`, `archive/index2.html`

- [ ] **Step 1: Add shared header to archive/index_system.html**

Insert shared header after `<body>`, with `NAV_ROOT = '../'`.

- [ ] **Step 2: Repeat for archive/index_0.html and archive/index2.html**

---

## Task 7: cert-folder.html — Special handling

**Files:**
- Modify: `cert-folder.html`

This page is a different brand (My O! 結婚證書套) with its own rose/brown color scheme. Do NOT replace its header. Add a single "← 策略探索家首頁" link in its existing nav.

- [ ] **Step 1: Add back link to cert-folder.html**

Find the existing `<nav>` element. Add to the nav links div:
```html
<a href="index.html" class="text-gray-600 hover:text-rose-500 transition-colors font-medium">← 策略探索家</a>
```

---

## Task 8: Verification

**Files:**
- Test: All modified pages

- [ ] **Step 1: Verify components/site-header.html exists**

Run: `ls -la components/site-header.html`

- [ ] **Step 2: Open index.html (reference)**

Verify: Header shows 4 nav links, brand "策略探索家", no back link

- [ ] **Step 3: Open trip.html**

Verify: Header shows 4 nav links, back link "⬅️ 返回首頁" visible, clicking goes to `index.html`

- [ ] **Step 4: Open blog/best-wedding-gifts-hk.html**

Verify: Header shows, back link visible, nav links use `../` paths

- [ ] **Step 5: Open trip/hongkong/2025-07-09-red-incense-burner-peak.html**

Verify: Header shows, back link goes to `../../index.html`, nav links use `../../` paths

- [ ] **Step 6: Open tv.html**

Verify: Dark theme header (bg-gray-900/80, indigo-400 brand text)

- [ ] **Step 7: Open cert-folder.html**

Verify: Original header intact, "← 策略探索家" link visible in nav

- [ ] **Step 8: Mobile test**

Resize any sub-page to mobile width, verify hamburger menu opens/closes

- [ ] **Step 9: Verify no console errors**

Open DevTools Console on any modified page, check for errors

---

## Task 9: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add components/site-header.html
git add trip.html tv.html food.html heic-converter.html
git add blog/best-wedding-gifts-hk.html blog/hk-marriage-certificate-size-guide.html
git add blog/hk-marriage-registration-checklist.html blog/hk-marriage-registry-guide.html
git add blog/how-to-preserve-marriage-certificate.html blog/best-certificate-cover-hk-2026.html
git add blog/article-template.html
git add trip/okinawa-trip.html trip/okinawa-food-craft-5days.html trip/okinawa-presentation.html
git add trip/hongkong/2025-07-09-red-incense-burner-peak.html
git add archive/index_system.html archive/index_0.html archive/index2.html
git add cert-folder.html
git status
git commit -m "feat: unify navigation across all pages with shared header component

- Create components/site-header.html — single source of truth for site header
- Auto-detects page directory depth for correct relative paths (./, ../, ../../)
- Back link shown on all sub-pages for easy return to home
- Dark theme auto-applied on 'make your own tv' brand pages
- cert-folder.html gets 'back to main site' link (different brand exception)
- All links use relative paths — works on file:// and GitHub Pages"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** All 19 pages have navigation added? Yes.
- [ ] **Design match:** Header matches `index.html` visual design (backdrop-blur, pill links, indigo accent)? Yes.
- [ ] **Placeholder scan:** No "TBD", "TODO", or placeholder comments? Correct.
- [ ] **Relative paths:** Depth 0 uses `./`, depth 1 uses `../`, depth 2 uses `../../`? Yes.
- [ ] **cert-folder.html:** Handled as special case (different brand)? Yes.
- [ ] **google5b106a66b8e06819.html:** Not in modify list? Correct.
- [ ] **No new dependencies:** Uses existing Tailwind CDN only? Yes.
- [ ] **Mobile responsive:** Hamburger menu works on all pages? Yes.

---

## Execution Options

**Plan complete and saved to `docs/superpowers/plans/2026-05-23-navigation-unification.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
