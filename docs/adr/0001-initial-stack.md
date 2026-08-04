# 0001 - Initial stack

Date: 2026-08-04
Status: Accepted

## Context
Building a self-hosted media tracker (anime/manga/manhwa/manhua/movies)
with room to scale later. Team of one, learning as we build.

## Decision
- pnpm workspaces monorepo: apps/web (Next.js) + packages/database (Prisma)
- Next.js 16 (App Router, TypeScript, Tailwind, Turbopack) - one framework
  for frontend + API routes at current scale
- Prisma ORM 7 (stable) over Prisma Next (early access, not production-ready yet)
- Postgres via Docker Compose, NOT Prisma Postgres (their hosted offering)
  — deviates from Prisma's own default guide, chosen to keep infra
  self-hosted and portable to any host later
- Node 24 LTS, pnpm 11

## Consequences
- We self-manage Postgres backups/migrations instead of a managed service
- Splitting apps/web's API routes into a standalone service later is possible
  without touching packages/database