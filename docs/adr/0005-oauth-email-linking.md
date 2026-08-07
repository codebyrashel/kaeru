# 0005 — Allow dangerous email account linking for Google

Date: 2026-08-08
Status: Accepted

## Context
Auth.js's Prisma adapter refuses by default to link an OAuth sign-in
to an existing account sharing the same email — a guard against
unverified-email providers enabling account takeover.

## Decision
Enable allowDangerousEmailAccountLinking for the Google provider only.
Google cryptographically verifies email ownership before authenticating,
so the takeover scenario the guard protects against doesn't apply here.

## Consequences
- A user who signs up with email+password, then later signs in with
  Google using the same email, gets merged into one account
  automatically — this is the intended, desirable behavior for us.
- If a second OAuth provider is added later, this same judgment call
  must be made per-provider, not assumed to carry over automatically —
  only enable it for providers that genuinely verify email ownership.