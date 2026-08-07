"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/session";

export async function removeFromLibrary(libraryEntryId: number) {
  const userId = await requireUserId();

  const entry = await prisma.libraryEntry.findFirstOrThrow({
    where: { id: libraryEntryId, userId },
    include: { media: true },
  });

  await prisma.libraryEntry.delete({ where: { id: libraryEntryId } });

  const sourceSlug = entry.media.externalSource === "ANILIST" ? "anilist" : "tmdb";
  revalidatePath("/");
  revalidatePath(`/title/${sourceSlug}/${entry.media.externalId}`);
}
