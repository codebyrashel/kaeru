# 0002 - Enable React Compiler

Date: 2026-08-04
Status: Accepted

## Context
React Compiler reached stable status in Next.js 16 but ships disabled
by default while the Next.js team gathers build performance data. It
auto-memoizes components (no more manual useMemo/useCallback) but adds
a Babel compilation pass, increasing dev/build times.

## Decision
Enable it (`reactCompiler: true` in next.config.ts). Comfortable trading
some build speed for automatic render optimization given the team's
experience level.

## Consequences
- Dev and production builds will be slower than default Turbopack-only compiles
- If build times become a real problem later, this is a one-line revert
- Components that violate React's rules are silently skipped by the
  compiler rather than erroring — worth occasionally checking the
  React DevTools Profiler to confirm expected components are memoized