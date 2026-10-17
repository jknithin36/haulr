<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Architecture is described in `docs/ARCHITECTURE.md`. Routes stay thin, and domain code lives in `features/<domain>/`.
- Reuse `components/ui/*` and `lib/format.ts` instead of re-implementing badges, ratings, route labels or formatters.
- Icons: Hugeicons, `strokeWidth={2}`. Draw routes with `RouteLabel`, never "→".
- Run `pnpm typecheck` and `pnpm lint` before finishing a change.
