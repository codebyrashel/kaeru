"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, googleSignIn } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-lg font-medium text-text-primary">Welcome back</h1>
        <p className="mb-6 text-sm text-text-secondary">Sign in to your Kaeru library.</p>

        <form action={formAction} className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="h-9 rounded-lg border border-border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="h-9 rounded-lg border border-border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {state?.error && <p className="text-xs text-danger-text">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1 h-9 rounded-lg bg-brand text-sm text-on-brand disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-text-muted">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form action={googleSignIn}>
          <button
            type="submit"
            className="flex h-9 w-full items-center justify-center rounded-lg border border-border bg-surface-1 text-sm text-text-primary hover:bg-surface-2"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-5 text-xs text-text-muted">
          No account?{" "}
          <Link href="/signup" className="text-accent-text underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
