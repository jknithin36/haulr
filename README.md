# Haulr

Haulr is a peer-to-peer freight marketplace. People who need something moved post a shipment, and drivers who already have the route share the spare space in their vehicle. This repository is a complete front-end demo of that product, built with Next.js 16 and shadcn/ui.

All data is in-memory demo data, so the app runs with no database, API keys or environment variables.

## Features

- **Marketing site:** home, live board, pricing, FAQ, estimate calculator, blog, and legal pages
- **Marketplace:** browse shipments and trips on a list or a map (MapLibre via [mapcn](https://www.mapcn.dev)), with detail pages, offers and messaging
- **Posting flows:** multi-step wizards to post a shipment or share a trip, with saved drafts
- **User dashboard:** shipments, tracking, offers, trips, jobs, vehicles, messages, payments, reviews, saved items, notifications and settings
- **Admin dashboard:** analytics, revenue, moderation, verification, disputes, users, blog editor and activity log
- **Demo auth:** cookie-based sessions with `user` and `admin` roles, protected by `proxy.ts`

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components, React Compiler) |
| UI | [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Hugeicons](https://hugeicons.com) |
| Maps | [MapLibre GL](https://maplibre.org) with CARTO basemaps |
| Charts | [Recharts](https://recharts.org) |
| Motion | [Motion](https://motion.dev) |
| Lint and format | [Biome](https://biomejs.dev) |

## Getting started

Requirements: Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To try the signed-in areas, go to `/login` and choose **Log in as user** or **Log in as admin**. No credentials are needed.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Lint and check formatting with Biome |
| `pnpm format` | Format with Biome |
| `pnpm typecheck` | Type-check with TypeScript |

## Project structure

```
app/                 Routes only: thin pages that compose features
  (marketing)/       Public site with the shared header and footer
  (auth)/            Login, sign up, forgot password
  (standalone)/      Full-screen flows (post a shipment, share a trip)
  dashboard/         Signed-in user area
  admin/             Admin area
features/<domain>/   Everything for one domain
  components/        UI for the domain, each with a co-located skeleton
  <domain>-queries.ts  Server-only data access
  <domain>-actions.ts  Server actions
components/
  ui/                Shared primitives (shadcn plus app-wide building blocks)
  maps/ wizard/      Purpose-named shared pieces
lib/
  demo-data/         In-memory data that stands in for a database
  format.ts          Currency, number, distance and name formatters
proxy.ts             Route protection for /dashboard and /admin
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the conventions behind this layout.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE)
