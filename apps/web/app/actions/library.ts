"use server";

import { prisma } from "database";
import { revalidatePath } from "next/cache";
import { DEMO_USER_ID } from "@/lib/demo-user";

export async function removeFromLibrary(libraryEntryId: number) {
  const entry = await prisma.libraryEntry.findFirstOrThrow({
    where: { id: libraryEntryId, userId: DEMO_USER_ID },
    include: { media: true },
  });

  await prisma.libraryEntry.delete({ where: { id: libraryEntryId } });

  const sourceSlug = entry.media.externalSource === "ANILIST" ? "anilist" : "tmdb";
  revalidatePath("/");
  revalidatePath(`/title/${sourceSlug}/${entry.media.externalId}`);
  revalidatePath("/lists/plan-to-watch");
  revalidatePath("/lists/completed");
  revalidatePath("/lists/on-hold");
}
