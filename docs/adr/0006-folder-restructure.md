# 0006 — Feature-based folder structure

Date: 2026-08-09
Status: Accepted

## Context
components/ and lib/ had grown to 18+ flat files each, mixing unrelated
concerns. Also discovered app/(app)/(dashboard)/page.tsx was an actual
routing bug: parenthesized folders are route groups, invisible in the
URL — this resolved to "/", colliding with the landing page, not
"/dashboard" as intended.

## Decision
- Grouped components/ and lib/ by feature domain (layout, library,
  discovery, stats, shared / api, auth) rather than flat file lists
- Fixed the route group bug: (dashboard) -> dashboard (real segment)
- Removed dead code accumulated across the session: app/dev-search,
  app/lists/[status], lib/status-routes.ts, components/navbar.tsx

## Consequences
- Import paths are now more predictable (components/library/* is
  always library-tracking UI)
- Route groups ( ) vs real segments must be applied deliberately going
  forward — this bug is easy to reintroduce by habit