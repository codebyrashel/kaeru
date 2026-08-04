# 0003 - Core schema design

Date: 2026-08-04
Status: Accepted

## Context
Needed a data model covering anime/manga/manhwa/manhua/movies, per-user
library tracking, and progress history (for stats/streaks on the "Me" page).

## Decision

**Media cached separately from LibraryEntry.** External API data (title,
cover, episode/chapter counts) is stored once in `Media`, keyed by
`(externalSource, externalId)`. Users' `LibraryEntry` rows just reference
it. Avoids re-fetching AniList/TMDB on every view and avoids duplicate
metadata per user.

**One LibraryEntry table for all five media types**, distinguished by
`Media.type`. Keeps "show me this user's whole library" a single query
instead of a UNION across five tables.

**Genres as String[] on Media, not a join table.** Simplification for
now. Fine for display/filtering at current scale. Revisit if genre-level
analytics, autocomplete, or "find similar" features are needed later -
at that point a proper Genre model with a join table becomes worth the
added complexity.

**Separate ProgressLog table, distinct from LibraryEntry's current
episode/chapter fields.** LibraryEntry holds current state; ProgressLog
holds a timestamped history of changes. Required for the activity
heatmap and streak counter on the Me page — those need "when did
progress happen," which a single mutable current-episode field can't
answer.

**User model kept minimal.** No auth fields yet - deferred to its own
phase/decision (Auth.js vs custom) rather than bolted on speculatively.

## Consequences
- Adding a title requires two writes when it's new to the platform
  (Media, then LibraryEntry) but one when it's already cached
  (just LibraryEntry) - app logic must check-then-create on Media
- Genre queries are limited to simple array contains/overlaps until/unless
  we revisit the join table decision
- ProgressLog will grow indefinitely per active user; may need a
  retention/archival policy once real usage data exists to inform one