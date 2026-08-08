# 0007 — Rate limiting deferred

Date: 2026-08-10
Status: Accepted — revisit at scale

## Context
Considered Upstash + @upstash/ratelimit for login/signup abuse protection
during initial deploy planning. At beta scale (<100 users), the real
attack surface is minimal, and Auth.js + bcrypt already provide baseline
protection against casual brute-forcing.

## Decision
Skip dedicated rate limiting for now. Revisit when any of these happen:
- User count approaches a few hundred+
- Vercel/Neon dashboards show unusual traffic spikes
- Any actual abuse is observed (repeated failed logins, signup spam)

## Consequences
- Login/signup currently have no request-throttling beyond Auth.js's
  built-in CSRF/session protections
- This is a deliberate, tracked gap — not an oversight — but must
  actually get revisited once a trigger above is hit, not forgotten