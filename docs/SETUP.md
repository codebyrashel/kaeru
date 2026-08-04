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