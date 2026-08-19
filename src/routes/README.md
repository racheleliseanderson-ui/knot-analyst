# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File                     | URL                                                     |
| ------------------------ | ------------------------------------------------------- |
| `index.tsx`              | `/`                                                     |
| `about.tsx`              | `/about`                                                |
| `users/index.tsx`        | `/users`                                                |
| `users/$id.tsx`          | `/users/:id` (dynamic — bare `$`, no curly braces)      |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment)                  |
| `files/$.tsx`            | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx`            | layout route (renders children via `<Outlet />`)        |
| `__root.tsx`             | app shell — wraps every page; preserve `<Outlet />`     |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.

## Instrument modes

| File                  | URL                | Mode                                          |
| --------------------- | ------------------ | --------------------------------------------- |
| `index.tsx`           | `/`                | 01 Decide                                     |
| `diagnose.tsx`        | `/diagnose`        | 02 Diagnose                                   |
| `compare.tsx`         | `/compare`         | 03 Compare                                    |
| `admin.tsx`           | `/admin`           | 04 Data                                       |
| `library.tsx`         | `/library`         | 05 Library — browse the knots, no form        |
| `diagram.$knotId.tsx` | `/diagram/:knotId` | 06 Diagrams — field plates for one connection |
| `tie.$knotId.tsx`     | `/tie/:knotId`     | Step player                                   |
