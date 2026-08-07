"use server";

import { prisma } from "database";
import bcrypt from "bcryptjs";
import { signIn, signOut, AuthError } from "@/auth";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function signUp(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash, name: name || null } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return null;
  } catch (error) {
    if (error instanceof AuthError) return { error: "Account created — please sign in." };
    throw error;
  }
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logOut() {
  await signOut({ redirectTo: "/login" });
}