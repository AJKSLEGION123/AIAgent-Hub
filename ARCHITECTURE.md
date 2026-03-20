# Agent Hub — Architecture

## Overview

Single-page React application (Vite + React 19) that serves as a prompt reference dashboard for autonomous AI agents (Claude Code, Gemini CLI, Codex CLI).

## Stack

- **Runtime**: React 19 + Vite 8
- **Language**: JavaScript (JSX)
- **Styling**: Inline styles + minimal CSS (index.css)
- **Data**: Compressed JSON blob (base64-deflate) embedded in App.jsx
- **Tests**: Vitest + @testing-library/react
- **State**: React hooks (useState, useMemo, useCallback, useEffect)
- **Persistence**: localStorage

## File Structure

```
src/
  App.jsx          — Main application (1870 lines, single-file architecture)
  index.css        — Global CSS (focus-visible, animations, mobile, print)
  main.jsx         — React root mount
  test/
    App.test.jsx   — Smoke tests (render, localStorage)
    utils.test.js  — Unit tests (alpha, theme, constants)
public/
  favicon.svg      — SVG favicon (3 colored dots = 3 models)
  manifest.json    — PWA manifest
  robots.txt       — SEO
  sitemap.xml      — SEO
```

## Data Flow

```
Z (base64 string) → DecompressionStream (deflate) → JSON → { P, COMBOS, CONFIGS, ... }
                                                              ↓
                                                    AgentHub component
                                                              ↓
                                              pMap (Map for O(1) lookup)
                                                              ↓
                                        Filter → Sort → Paginate → Render cards
```

## Key Patterns

- **pMap/pGet**: O(1) prompt lookup via `new Map(P.map(p => [p.id, p]))`
- **buildPromptBundle**: DRY helper for "copy all prompts as text"
- **Debounced search**: 200ms setTimeout for search input
- **IntersectionObserver**: Infinite scroll instead of "Load more"
- **localStorage**: Settings persist (theme, lang, favs, history, copy counters)
- **Body scroll lock**: `overflow: hidden` when modals open
- **rAF throttle**: Scroll progress handler uses requestAnimationFrame

## Prompt Data Schema

```js
{
  id: string,        // e.g. "c-fe", "g-qa", "c-unstoppable"
  m: string,         // Full model name
  mk: string,        // Model key: "claude" | "gemini" | "codex"
  role: string,      // Role key for translations
  type: "role"|"task",
  icon: string,      // Emoji
  ac: string,        // Accent color (hex)
  time: string,      // Estimated time
  text: string,      // Full prompt text
  tags: string[],    // Searchable tags
  difficulty: string, // "beginner"|"intermediate"|"advanced"
  output: string,    // Expected output file path
  related: string[], // Related prompt IDs
  prereqs: string[], // Prerequisites
  v: string,         // Version added
  compact: string    // Compact version (~700 chars)
}
```
