"use server";

import { prisma } from "database";
import type { LibraryStatus } from "database";
import { revalidatePath } from "next/cache";

// TEMP: matches DEMO_USER_ID elsewhere. See ADR-0004.
const DEMO_USER_ID = 1;

export async function updateProgress(
  libraryEntryId: number,
  newValue: number,
  field: "currentEpisode" | "currentChapter",
) {
  const entry = await prisma.libraryEntry.findFirstOrThrow({
    where: { id: libraryEntryId, userId: DEMO_USER_ID },
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
      data: { userId: DEMO_USER_ID, libraryEntryId, delta },
    });

    return result;
  });

  revalidatePath(`/title/${entry.mediaId}`);
  revalidatePath("/");

  return updated;
}

export async function updateStatus(libraryEntryId: number, status: LibraryStatus) {
  const entry = await prisma.libraryEntry.update({
    where: { id: libraryEntryId, userId: DEMO_USER_ID },
    data: {
      status,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
  });

  revalidatePath(`/title/${entry.mediaId}`);
  revalidatePath("/");

  return entry;
}
