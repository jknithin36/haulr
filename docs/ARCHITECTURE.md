# Architecture

Haulr follows a feature-folder architecture for the Next.js App Router. The goal is that any domain can be understood, changed or removed by looking at one folder.

## Layers

```
app/  ──▶  features/<domain>/  ──▶  lib/
 routes      domain UI + data         utilities and demo data
                  │
                  ▼
           components/ui/
           shared primitives
```

Dependencies point one way. `lib/` and `components/ui/` never import from `features/` or `app/`. A feature may import from another feature's components when it composes them, but never from its queries or actions.

## `app/`: routes

- A page is a synchronous function that composes feature components and owns the `<Suspense>` boundaries.
- Dynamic segments are read with `params.then(({ id }) => <Feature id={id} />)` inside `<Suspense>`. Features receive plain IDs, never `params`.
- Route groups share layouts without changing URLs:
  - `(marketing)` renders the site header and footer.
  - `(auth)` and `(standalone)` render full-screen pages without them.
  - `dashboard` and `admin` each have their own shell layout.

## `features/<domain>/`

| File | Purpose |
| --- | --- |
| `components/` | The domain's UI. Each async or data-heavy component exports a matching `…Skeleton` from the same file. |
| `<domain>-queries.ts` | `import "server-only"`. Read functions for server components. Detail lookups call `notFound()`. |
| `<domain>-actions.ts` | `"use server"` mutations. |
| `hooks/` | Client hooks used only by this domain. |

### Server and client halves

Interactive views are split in two files:
- `shipment-browser.tsx` is an async server component that reads through the domain's queries.
- `shipment-browser-client.tsx` is the `"use client"` half, and receives the data as props.

Client components never import demo data directly, only types and pure helpers. Replacing the demo data with a real backend therefore never touches the UI.

Domains: `marketing`, `shipment`, `trip`, `estimate`, `place`, `message`, `blog`, `legal`, `brand`, `user`, `dashboard` and `admin`.

## `components/`

- `ui/`: shadcn primitives plus app-wide building blocks such as `PageHeader`, `EmptyState`, `StatusBadge`, `Rating`, `Stars`, `KpiCard`, `RouteLabel`, `CtaBand` and `Logo`.
- App-shell singletons: `site-header`, `site-footer`, `session-header` and `user-menu`.
- Purpose-named folders for shared pieces that aren't primitives: `maps/` and `wizard/`.

There is no `common/` or `shared/` folder. A shared piece is either a primitive in `ui/` or lives in a folder named after what it does.

## `lib/`

- `format.ts`: the only place that formats currency, numbers, distances, short dates and names.
- `demo-data/`: typed, in-memory records that stand in for a database. Swapping in a real backend means changing the `*-queries.ts` files, not the components.
- `utils.ts`, `site-nav.ts` and `wizard.ts`: small cross-cutting helpers.

## Auth

Demo auth uses two cookies:
- `haulr_session` is httpOnly and holds `user` or `admin`.
- `haulr_role` is a readable twin, so client components can adapt with `useSessionRole()`.

`proxy.ts` guards `/dashboard` and `/admin`, and redirects signed-in users away from `/login` and `/signup`.

## Rendering

`cacheComponents` is enabled. Static shells are prerendered, and request-time data (cookies, params) streams in behind `<Suspense>` with co-located skeletons. Server render never reads the clock, so prerendered output stays deterministic.
