# Contributing to Agent Hub

## Setup

```bash
git clone <repo-url>
cd agent-hub
npm install
npm run dev
```

## Development

- `npm run dev` — start dev server (http://localhost:5173)
- `npm run build` — production build
- `npm test` — run unit tests (vitest)
- `npm run test:e2e` — run browser tests (playwright)
- `npm run test:all` — run all tests

## Adding Prompts

Prompts are stored as compressed JSON in `src/App.jsx` (const Z).

To add prompts:
1. Create a script (see `add-prompts.cjs` pattern)
2. Decompress Z → add to P array → recompress → replace Z
3. Run `npm run build` to verify
4. Run `npm test` to verify

## Prompt Schema

```js
{
  id: "c-fe",           // unique ID (prefix: c=claude, g=gemini, x=codex)
  m: "Claude Opus 4.6", // full model name
  mk: "claude",         // model key
  role: "frontend",     // role key (must exist in T.ru.r and T.en.r)
  type: "role"|"task",  // role = base role, task = specific task
  icon: "🖥",           // emoji icon
  ac: "#10b981",        // accent color (hex)
  time: "~2h",          // estimated time
  text: "...",           // full prompt text
  tags: ["tag1"],        // searchable tags
  difficulty: "intermediate", // beginner|intermediate|advanced
  output: ".claude/reports/report.md", // expected output
  related: ["c-be"],    // related prompt IDs
  prereqs: ["git worktree"], // prerequisites
  v: "8.2",             // version added
  compact: "..."         // compact version (~700 chars)
}
```

## Code Style

- Single-file architecture (App.jsx) + TS modules for utils/hooks/types
- Inline styles (no CSS-in-JS library)
- Functional components + hooks
- `memo()` for pure components
- `useMemo`/`useCallback` for expensive computations

## Testing

- Unit tests: `src/test/*.test.{ts,tsx,js,jsx}`
- E2E tests: `e2e/*.spec.js`
- All tests must pass before committing

## Commit Convention

```
feat: description     # new feature
fix: description      # bug fix
[agent] cycle-N: ...  # automated agent work
[overnight] N-M: ...  # overnight batch
```
