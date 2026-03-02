# profcheck

Professor AI-friendliness rating platform. Community-driven, student-powered.

## Stack

| Concern | Tool |
|---------|------|
| Framework | Next.js 16 + React 19, App Router, Turbopack |
| Backend | Convex (^1.18.0) + @convex-dev/auth (Password) |
| UI | shadcn/ui new-york, @tabler/icons-react, neutral base |
| CSS | Tailwind CSS 4 (CSS-first, no tailwind.config.ts) |
| Lint | Biome (NOT ESLint/Prettier) |
| Deploy | Vercel |
| Font | JetBrains Mono, dark mode default |
| Package manager | pnpm |

## Commands

```bash
pnpm dev          # Start dev server (Next.js + Convex)
pnpm build        # Production build
pnpm lint         # Biome lint check
pnpm lint:fix     # Auto-fix lint
pnpm typecheck    # TypeScript check
```

IMPORTANT: Always run `pnpm lint && pnpm typecheck` before committing.

## Code Style

- Biome for linting/formatting — never Prettier or ESLint
- 2-space indent, 100 char line width, double quotes, always semicolons
- ES5 trailing commas, shorthand array types (`T[]` not `Array<T>`)
- ES module imports (import/export), not CommonJS
- Follow existing patterns before inventing new ones

## Convex Patterns

- Convex functions in `convex/` directory
- Schema: union literals for enums, `v.optional()` for nullable fields
- Timestamps as `v.number()` (epoch ms)
- Auth via `@convex-dev/auth` with `ConvexAuthNextjsProvider`

## Tailwind 4

CSS-first config — no `tailwind.config.ts`. Theme tokens in `globals.css`:
- `@import "tailwindcss"` at top
- Brand color: `--brand: 262 83% 58%` (vibrant purple/indigo)
- JetBrains Mono for both `--font-sans` and `--font-mono`
- Dark mode via `.dark` class custom variant

## Git Workflow

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Imperative mood, lowercase after type, no period, max ~72 chars
- Never add Co-Authored-By lines
- Stage specific files, never `git add -A`

## Architecture

Single Next.js app (NOT a monorepo). App Router with these routes:

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/schools` | Browse/search schools |
| `/schools/[slug]` | School detail |
| `/professors/[id]` | Professor detail + reviews |
| `/submit` | Submit school/professor |

## AI-Friendliness Scale (1-4)

1. Bans AI (red)
2. Tolerates AI (yellow)
3. Encourages AI (green)
4. Requires AI (blue)
