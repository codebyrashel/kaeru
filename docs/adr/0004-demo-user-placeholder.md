# 0004 - Hardcoded demo user (temporary)

Date: 2026-08-04
Status: Accepted - temporary, superseded when auth is built

## Context
Wiring up the AniList integration and library write path before auth
exists. Every write needs a userId to attach to.

## Decision
Hardcode DEMO_USER_ID = 1 in app/actions/media.ts, backed by a seed
script (packages/database/prisma/seed.ts) that creates exactly one user.
Relies on that user getting id: 1 via autoincrement on a fresh database.

## Consequences
- Fragile by design: breaks if the User table is reseeded after other
  inserts, or seeded twice. Acceptable because this is explicitly
  scaffolding for a phase (auth) that doesn't exist yet - not a
  production assumption.
- Must be replaced, not adjusted, once auth exists - the fix is
  "get userId from the session," not "make the hardcode more robust."
- Every write path touching userId (currently just addToLibrary) needs
  auditing when auth lands, to confirm none of them still reference
  DEMO_USER_ID.