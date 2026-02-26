# LP/SP Tracker — Specification Document

## Overview

A full-screen, mobile-first web app for tracking Life Points (LP) and Sanity Points (SP) during card game play. Hosted on GitHub Pages at `voidnologo.com/card_game`.

## V1 Scope

Simple increment/decrement tracker with no hero selection or multiplayer features.

---

## Layout

The app fills the entire viewport (`100dvh × 100dvw`), no scrolling.

```
┌──────────────────────────────────┐
│         LP Section (50vh)        │
│                                  │
│  +  │         18          │  -   │
│ 1/3 │    (heart watermark) │ 2/3  │
│     │                      │      │
├──────────────────────────────────┤
│         SP Section (50vh)        │
│                                  │
│  +  │         24          │  -   │
│ 1/3 │    (eye watermark)   │ 2/3  │
│     │                      │      │
└──────────────────────────────────┘
```

### Sections

- **Top half (50vh)**: LP — Life Points
- **Bottom half (50vh)**: SP — Sanity Points

### Button Zones (touch targets)

- **Left ~33%**: `+` button (increment by 1)
- **Right ~67%**: `-` button (decrement by 1)
- The number is displayed centered in the section, overlapping both touch zones
- The `+` and `-` symbols are positioned at the left and right edges respectively

### Divider

- A subtle horizontal line or visual separator between the two sections

---

## Visual Design

### Theme

- **Background**: Black (`#000000`)
- **Text**: White (`#ffffff`)
- Dark theme chosen for legibility during tabletop play

### Typography

- **Numbers**: JetBrains Mono (with fallbacks to Fira Code, monospace)
- **Size**: Large enough to read from arm's length (~20vw or similar responsive unit)
- **Weight**: Bold / semi-bold for numbers
- Loaded via Google Fonts or self-hosted

### Button Symbols (`+` / `-`)

- Same monospace font family
- Low opacity: `0.15 – 0.25`
- Large enough to indicate the tap zone but not visually dominate

### Watermark Icons

Each section has a large, centered watermark icon behind the number:

- **LP watermark**: Heart icon (matches hero card stat icon)
  - Fill color: `#8b3a3a` (muted dark red)
  - Opacity: `0.08 – 0.12` (very subtle)
- **SP watermark**: Eye icon with radiating cracks (matches hero card stat icon)
  - Fill color: `#6a5a8e` (muted purple)
  - Opacity: `0.08 – 0.12` (very subtle)

Both icons are rendered as inline SVGs for zero external dependencies.

### Section Background Tinting

Optional subtle color tint per section to reinforce LP vs SP identity:
- LP section: very faint red-black tint
- SP section: very faint purple-black tint

---

## Behavior

### Interaction

- **Tap left zone**: LP or SP increments by 1
- **Tap right zone**: LP or SP decrements by 1
- Single tap only — no long-press, swipe, or multi-tap in V1

### Bounds

- **Minimum**: 0 (cannot go below zero)
- **Maximum**: None (no upper cap)

### Default Values

- LP starts at **20**
- SP starts at **20**

### Persistence

- Current LP and SP values saved to `localStorage`
- Restores on page reload (prevents accidental refresh losing game state)
- No explicit "reset" button in V1 (user can clear localStorage via browser)

### Touch Feedback

- Brief visual flash or scale animation on tap to confirm input registered
- CSS-only animation, no audio or vibration in V1

---

## Technical Stack

### Why Vanilla HTML/CSS/JS

- **Zero build step** — deploy directly to GitHub Pages
- **Zero dependencies** — no npm, no bundler, no framework
- **Instant load** — critical for phone use mid-game
- **Simple** — the V1 app is two numbers and four buttons

A framework (React, Svelte, etc.) would be over-engineering for this scope. If V3/V4 complexity warrants it, migration is trivial since the core logic is ~50 lines.

### File Structure

```
tracker/
├── index.html          # Single-page app
├── styles.css          # All styles, mobile-first
├── app.js              # All logic
├── SPEC.md             # This document
├── project.prompt      # Original brief
└── prototype/
    ├── prototype.1.jpeg
    └── prototype.pages
```

### Deployment

- GitHub Pages, served from the `tracker/` directory
- Target URL: `voidnologo.com/card_game`
- No build step required — static files only

---

## Icon SVG Definitions

### LP Icon (Heart)

```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
    2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
    C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
    c0 3.78-3.4 6.86-8.55 11.54z"/>
</svg>
```

### SP Icon (Eye with cracks)

```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 4C6 4 1.5 10 1 12c.5 2 5 8 11 8s10.5-6 11-8
    c-.5-2-5-8-11-8zm0 2c4.5 0 8 4.2 8.8 6-.8 1.8-4.3 6-8.8
    6s-8-4.2-8.8-6c.8-1.8 4.3-6 8.8-6z"/>
  <circle cx="12" cy="12" r="4.5"/>
  <circle cx="12" cy="12" r="2" opacity="0.3"/>
  <path d="M3.5 7L1.5 4.5M20.5 7l2-2.5M3.5 17L1.5 19.5M20.5 17l2 2.5"
    stroke="currentColor" stroke-width="1" stroke-linecap="round" fill="none"/>
</svg>
```

---

## Mobile Considerations

- `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">`
- `-webkit-touch-callout: none` to prevent long-press menus
- `touch-action: manipulation` to eliminate 300ms tap delay
- `user-select: none` to prevent text selection on taps
- `overscroll-behavior: none` to prevent pull-to-refresh
- Full-screen capable via `manifest.json` (add-to-home-screen)

---

## Future Phases (reference only — not built in V1)

| Phase | Feature | Notes |
|-------|---------|-------|
| V2 | Hero selection | Hamburger menu, auto-set LP/SP from hero data, hero color themes |
| V3 | Two-player mode | Mirror layout, 4 sections, rotated display for opposing player |
| V4 | Essence tracker | Additional row (1/3 height), resets each turn, single-player only |

---

## Color Reference (from card game codebase)

| Token | Hex | Usage |
|-------|-----|-------|
| LP color | `#8b3a3a` | Heart icon, LP section tint |
| SP color | `#6a5a8e` | Eye icon, SP section tint |
| Essence color | `#b89530` | Reserved for V4 |
| Attack color | `#8b3a3a` | — |
| Defense color | `#4a6e52` | — |

### Hero Starting Stats (for V2)

| Hero | LP | SP |
|------|----|----|
| Iron Warden | 27 | 15 |
| Bone Tyrant | 21 | 21 |
| Thread-Cutter | 18 | 24 |
| Void Scholar | 18 | 24 |
| Crimson Ranger | 24 | 18 |
