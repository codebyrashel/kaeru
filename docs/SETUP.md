## packages/database - gotchas

- **moduleResolution**: set to `"bundler"` in tsconfig.json, not the
  `tsc --init` default. This package is only ever consumed through
  Next.js/Turbopack, never run directly with plain `node`, so bundler
  resolution is correct - it understands package.json `exports` maps
  (needed for `dotenv/config`, `prisma/config`) without requiring
  explicit file extensions on every relative import.

- **Prisma client import path**: schema.prisma uses the `prisma-client`
  generator, which outputs a flat structure - `generated/client/client.ts`
  is the documented main entry point, there is no `index.ts` barrel.
  Always import from `./generated/client/client`, not `./generated/client`.
  This will look wrong at a glance; it isn't.

- **Postgres 18 volume mount**: docker-compose.yml mounts the volume at
  `/var/lib/postgresql` (not `/var/lib/postgresql/data`). Postgres 18+
  manages a version-specific subdirectory itself; mounting directly at
  the old `/data` path causes a crash-loop.


## apps/web - gotchas

- **Prisma + Turbopack**: the `prisma-client` generator's output needs
  `@prisma/client` installed as a real dependency in packages/database
  (not just `prisma` as a dev dependency) - its generated code imports
  runtime helpers from `@prisma/client/runtime/*` at, well, runtime.
  Additionally, `next.config.ts` sets `serverExternalPackages:
  ["@prisma/client", "pg"]` so Turbopack doesn't try to bundle Prisma's
  native/wasm internals - left bundled, this fails with
  "Module not found: Can't resolve '@prisma/client/runtime/client'".

- **turbopack.root**: explicitly set to the monorepo root in
  next.config.ts. Without it, Next.js sometimes misdetects the
  workspace root in a pnpm monorepo and warns about multiple lockfiles.

- Only one pnpm-workspace.yaml and one pnpm-lock.yaml should exist,
  both at the repo root. `pnpm create next-app` scaffolds its own by
  default - delete them from apps/web if they reappear after a
  re-scaffold


## Known gotcha: `Record<X, { ... }>` type errors

If a multi-property inline object type inside a generic (e.g.
`Record<Key, { a: string; b: string }>`) throws a wall of "',' expected"
/ "';' expected" errors, check whether `> =` (generic close, space,
equals) collapsed into `>=` somewhere in the file - TypeScript then
parses the whole thing as a comparison expression instead of a type
annotation. Fix: extract the object into a named `type` alias instead
of inlining it. Happened in media-category.ts and media-style.ts.