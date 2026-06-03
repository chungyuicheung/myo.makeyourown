# 策略探索家 — Design System

> **Locked.** This file is the single source of truth for all visual, motion, and voice decisions.
> Do not override these tokens without a new Hallmark run.

---

## 1. Genre & Tone

**Genre:** Editorial
**Voice:** Warm, considered, personal — the antithesis of AI-slop SaaS. Long-form first. No hype.
**Language:** 繁體中文 (Traditional Chinese)

---

## 2. Macrostructure Family

| Page type | Allowed macrostructures |
|---|---|
| Marketing (index, trip, tv) | Marquee Hero · Long Document |
| Content (blog, okinawa-trip) | Long Document · Letter |
| Tool (heic-converter, cert-folder) | Workbench · Conversational FAQ |

**Diversification rule:** No two consecutive pages may share the same macrostructure.

---

## 3. Theme — Almanac (Warm Editorial)

### Palette

| Token | OKLCH | Usage |
|---|---|---|
| `--color-paper` | `oklch(97% 0.01 90)` | Page background — warm off-white |
| `--color-paper-2` | `oklch(94% 0.02 85)` | Card / inset backgrounds — cream |
| `--color-ink` | `oklch(25% 0.02 60)` | Primary text — warm charcoal |
| `--color-ink-2` | `oklch(45% 0.02 60)` | Secondary text — warm grey |
| `--color-rule` | `oklch(85% 0.01 90)` | Hairline dividers |
| `--color-accent` | `oklch(52% 0.14 38)` | **Terracotta/rust** — CTAs, links, highlights |
| `--color-accent-ink` | `oklch(97% 0.01 90)` | Text on accent |
| `--color-focus` | `oklch(52% 0.14 38)` | Focus rings (same as accent) |

> **Hard rule:** No purple, indigo, violet, or blue-purple gradients anywhere. Zero tolerance.

### Typography

| Role | Font | Weight | Fallback |
|---|---|---|---|
| Display | Noto Serif TC | 700 | Georgia, serif |
| Body | Noto Sans TC | 400 | system-ui, sans-serif |
| Mono | JetBrains Mono | 400 | 'Fira Code', monospace |

### Spacing Scale (4-point)

```
--space-xs:  4px
--space-sm:  8px
--space-md:  16px
--space-lg:  24px
--space-xl:  32px
--space-2xl: 48px
--space-3xl: 64px
--space-4xl: 96px
```

---

## 4. Motion

**Principle:** Fade-only reveal. No scroll-triggered animations. No bounce, no slide-in, no parallax.

| Property | Value |
|---|---|
| Reveal | `opacity: 0 → 1` only |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Duration | 400ms (standard) · 200ms (micro) |
| Scroll trigger | **None** — all entrance animations fire on load |
| Reduced motion | `prefers-reduced-motion: reduce` → instant |

---

## 5. Microinteractions

| Interaction | Behavior |
|---|---|
| Success feedback | Silent — no toast, no checkmark animation. State change only. |
| Hover delay | 800ms before any hover state activates (prevents accidental triggers) |
| Focus delay | 0ms — `:focus-visible` is instant |
| Button press | `transform: translateY(1px)` on `:active` |
| Link hover | Color shift to `--color-accent` with 150ms transition |

---

## 6. CTA Voice

- **Style:** Solid terracotta fill (`--color-accent`), pill radius (`border-radius: 9999px`)
- **Label:** `開始探索 →`
- **Hover:** Darken 8% (`oklch(46% 0.14 38)`)
- **Focus:** 2px offset outline in `--color-focus`
- **Active:** `translateY(1px)`

---

## 7. Navigation Archetype — N5 Floating Pill

```
┌─────────────────────────────────────────────────────────────┐
│  [策略探索家]    [文章]  [工具]  [關於]      [開始探索 →]   │
└─────────────────────────────────────────────────────────────┘
```

- Brand name left-aligned, text-only (no logo image)
- Nav links: pill-shaped text buttons, no background
- CTA: solid terracotta pill, far right
- **No emoji anywhere in nav**
- Background: transparent or `--color-paper` with subtle shadow on scroll
- Mobile: hamburger → slide-in drawer

---

## 8. Footer Archetype — Ft2 Inline Single Line

```
© 2026 策略探索家 · Privacy · GitHub
```

- Single horizontal line
- No 4-column layout
- Minimal: copyright + 1–2 links
- `--color-ink-2` for text, `--color-rule` for hairline above

---

## 9. Design Tokens Export

### 9a. CSS Custom Properties (`tokens.css`)

```css
:root {
  /* Palette */
  --color-paper:       oklch(97% 0.01 90);
  --color-paper-2:      oklch(94% 0.02 85);
  --color-ink:          oklch(25% 0.02 60);
  --color-ink-2:        oklch(45% 0.02 60);
  --color-rule:         oklch(85% 0.01 90);
  --color-accent:       oklch(52% 0.14 38);
  --color-accent-ink:   oklch(97% 0.01 90);
  --color-focus:        oklch(52% 0.14 38);

  /* Typography */
  --font-display: 'Noto Serif TC', Georgia, serif;
  --font-body:    'Noto Sans TC', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* Font weights */
  --weight-display: 700;
  --weight-body:    400;

  /* Spacing */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Motion */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 200ms;
  --duration-std:  400ms;

  /* Radius */
  --radius-pill: 9999px;
  --radius-sm:   4px;
  --radius-md:   8px;
}
```

### 9b. Tailwind v4 (`@theme`)

```css
@theme {
  /* Colors */
  --color-paper:       oklch(97% 0.01 90);
  --color-paper-2:      oklch(94% 0.02 85);
  --color-ink:          oklch(25% 0.02 60);
  --color-ink-2:        oklch(45% 0.02 60);
  --color-rule:         oklch(85% 0.01 90);
  --color-accent:       oklch(52% 0.14 38);
  --color-accent-ink:   oklch(97% 0.01 90);
  --color-focus:        oklch(52% 0.14 38);

  /* Fonts */
  --font-display: 'Noto Serif TC', Georgia, serif;
  --font-body:    'Noto Sans TC', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --spacing-xs:  4px;
  --spacing-sm:  8px;
  --spacing-md:  16px;
  --spacing-lg:  24px;
  --spacing-xl:  32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* Border radius */
  --radius-pill: 9999px;
  --radius-sm:   4px;
  --radius-md:   8px;

  /* Easing */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* Duration */
  --duration-fast: 200ms;
  --duration-std:  400ms;
}
```

### 9c. DTCG JSON (`tokens.json`)

```json
{
  "$metadata": {
    "name": "策略探索家 Design System",
    "version": "1.0.0",
    "format": "DTCG"
  },
  "color": {
    "paper":       { "$value": "oklch(97% 0.01 90)", "$type": "color" },
    "paper-2":     { "$value": "oklch(94% 0.02 85)", "$type": "color" },
    "ink":         { "$value": "oklch(25% 0.02 60)", "$type": "color" },
    "ink-2":       { "$value": "oklch(45% 0.02 60)", "$type": "color" },
    "rule":        { "$value": "oklch(85% 0.01 90)", "$type": "color" },
    "accent":      { "$value": "oklch(52% 0.14 38)", "$type": "color" },
    "accent-ink":  { "$value": "oklch(97% 0.01 90)", "$type": "color" },
    "focus":       { "$value": "oklch(52% 0.14 38)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "'Noto Serif TC', Georgia, serif", "$type": "fontFamily" },
    "body":    { "$value": "'Noto Sans TC', system-ui, sans-serif", "$type": "fontFamily" },
    "mono":    { "$value": "'JetBrains Mono', 'Fira Code', monospace", "$type": "fontFamily" }
  },
  "fontWeight": {
    "display": { "$value": 700, "$type": "fontWeight" },
    "body":    { "$value": 400, "$type": "fontWeight" }
  },
  "spacing": {
    "xs":  { "$value": "4px",  "$type": "dimension" },
    "sm":  { "$value": "8px",  "$type": "dimension" },
    "md":  { "$value": "16px", "$type": "dimension" },
    "lg":  { "$value": "24px", "$type": "dimension" },
    "xl":  { "$value": "32px", "$type": "dimension" },
    "2xl": { "$value": "48px", "$type": "dimension" },
    "3xl": { "$value": "64px", "$type": "dimension" },
    "4xl": { "$value": "96px", "$type": "dimension" }
  },
  "radius": {
    "pill": { "$value": "9999px", "$type": "dimension" },
    "sm":   { "$value": "4px",   "$type": "dimension" },
    "md":   { "$value": "8px",   "$type": "dimension" }
  },
  "transition": {
    "duration": {
      "fast": { "$value": "200ms", "$type": "duration" },
      "std":  { "$value": "400ms", "$type": "duration" }
    },
    "easing": {
      "out-expo": { "$value": "cubic-bezier(0.16, 1, 0.3, 1)", "$type": "cubicBezier" }
    }
  }
}
```

### 9d. shadcn/ui CSS Variables

```css
:root {
  /* Background */
  --background:     oklch(97% 0.01 90);
  --background-2:   oklch(94% 0.02 85);

  /* Foreground */
  --foreground:     oklch(25% 0.02 60);
  --foreground-2:   oklch(45% 0.02 60);

  /* Border */
  --border:         oklch(85% 0.01 90);

  /* Primary (accent) */
  --primary:        oklch(52% 0.14 38);
  --primary-foreground: oklch(97% 0.01 90);

  /* Focus */
  --ring:           oklch(52% 0.14 38);

  /* Radius */
  --radius:         9999px;  /* pill */
  --radius-sm:      4px;
  --radius-md:      8px;

  /* Fonts */
  --font-display:   'Noto Serif TC', Georgia, serif;
  --font-body:      'Noto Sans TC', system-ui, sans-serif;
  --font-mono:      'JetBrains Mono', 'Fira Code', monospace;
}
```

---

## 10. Anti-Patterns (Forbidden)

| Pattern | Why |
|---|---|
| Purple / indigo gradients | Brand violation — accent is terracotta only |
| Emoji as nav icons | Anti-AI-slop rule — use inline SVG or text |
| Centered layouts | Use left-aligned editorial rhythm |
| Inter-only font stack | Noto Sans TC is the body font |
| animate-on-scroll | Banned — fade-only on load |
| 4-column footer | Use Ft2 Inline single line |
| Toast on success | Silent success — state change only |

---

*Last updated: 2026-05-24 · Hallmark locked system*