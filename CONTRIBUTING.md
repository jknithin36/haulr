# Contributing to Haulr

Thanks for your interest in improving Haulr.

## Setup

```bash
pnpm install
pnpm dev
```

## Before you open a pull request

```bash
pnpm typecheck
pnpm lint
pnpm build
```

All three must pass.

## Conventions

- **Follow the architecture.** Routes in `app/` stay thin. Domain code lives in `features/<domain>/`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Reuse before you add.** Check `components/ui/` and `lib/format.ts` before writing a new badge, rating, route label or formatter.
- **Style with tokens.** Use Tailwind classes and the theme variables in `app/globals.css`. Don't hardcode colors.
- **Icons** come from Hugeicons with `strokeWidth={2}`. Draw a route as "from, arrow icon, to" with `RouteLabel`, never the "→" character.
- **Next.js 16 specifics:** this project uses Cache Components. Read request data (params, cookies) inside `<Suspense>`, and don't call `Date.now()` during server render. The docs that ship with Next are in `node_modules/next/dist/docs/`.
- **Commits:** keep them small and focused, written in the imperative mood ("Add trip filters", not "Added trip filters").

## Reporting bugs

Open an issue with steps to reproduce, what you expected, and what happened. Include screenshots for UI problems.
