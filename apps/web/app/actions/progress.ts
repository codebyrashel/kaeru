"use server";

import { prisma } from "database";
import type { LibraryStatus } from "database";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/session";

export async function updateProgress(
  libraryEntryId: number,
  newValue: number,
  field: "currentEpisode" | "currentChapter",
) {
  const userId = await requireUserId();

  const entry = await prisma.libraryEntry.findFirstOrThrow({
    where: { id: libraryEntryId, userId },
    include: { media: true },
  });

  const previous = (field === "currentEpisode" ? entry.currentEpisode : entry.currentChapter) ?? 0;
  const clamped = Math.max(0, newValue);
  const total = field === "currentEpisode" ? entry.media.totalEpisodes : entry.media.totalChapters;
  const value = total ? Math.min(clamped, total) : clamped;
  const delta = value - previous;

  if (delta === 0) return entry;

  let status: LibraryStatus | undefined;
  let startedAt: Date | undefined;
  let completedAt: Date | undefined;

  if (previous === 0 && value > 0 && entry.status === "PLAN_TO_WATCH") {
    status = field === "currentEpisode" ? "WATCHING" : "READING";
    startedAt = new Date();
  }
  if (total && value >= total && entry.status !== "COMPLETED") {
    status = "COMPLETED";
    completedAt = new Date();
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.libraryEntry.update({
      where: { id: libraryEntryId },
      data: {
        [field]: value,
        ...(status && { status }),
        ...(startedAt && { startedAt }),
        ...(completedAt && { completedAt }),
      },
    });

    await tx.progressLog.create({
      data: { userId, libraryEntryId, delta },
    });

    return result;
  });

  const sourceSlug = entry.media.externalSource === "ANILIST" ? "anilist" : "tmdb";
  revalidatePath(`/title/${sourceSlug}/${entry.media.externalId}`);
  revalidatePath("/dashboard");

  return updated;
}

export async function updateStatus(libraryEntryId: number, status: LibraryStatus) {
  const userId = await requireUserId();

  const entry = await prisma.libraryEntry.update({
    where: { id: libraryEntryId, userId },
    data: {
      status,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
    include: { media: true },
  });

  const sourceSlug = entry.media.externalSource === "ANILIST" ? "anilist" : "tmdb";
  revalidatePath(`/title/${sourceSlug}/${entry.media.externalId}`);
  revalidatePath("/dashboard");

  return entry;
}
