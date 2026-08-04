import { prisma, MediaType, LibraryStatus } from "database";
import { DEMO_USER_ID } from "@/lib/demo-user";

export async function getUserLibrary() {
  return prisma.libraryEntry.findMany({
    where: { userId: DEMO_USER_ID },
    include: { media: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function progressPercent(entry: {
  currentEpisode: number | null;
  currentChapter: number | null;
  media: { totalEpisodes: number | null; totalChapters: number | null };
}): number | null {
  const current = entry.currentEpisode ?? entry.currentChapter ?? 0;
  const total = entry.media.totalEpisodes ?? entry.media.totalChapters ?? null;
  if (!total || total === 0) return null;
  return Math.min(100, Math.round((current / total) * 100));
}


export async function getLibraryExternalIds(type: MediaType): Promise<Set<string>> {
  const entries = await prisma.libraryEntry.findMany({
    where: { userId: DEMO_USER_ID, media: { type } },
    select: { media: { select: { externalId: true } } },
  });
  return new Set(entries.map((e) => e.media.externalId));
}

export async function getLibraryEntryByMediaId(mediaId: number) {
  return prisma.libraryEntry.findFirst({
    where: { userId: DEMO_USER_ID, mediaId },
    include: { media: true },
  });
}

export async function getLibraryByStatus(status: LibraryStatus) {
  return prisma.libraryEntry.findMany({
    where: { userId: DEMO_USER_ID, status },
    include: { media: true },
    orderBy: { updatedAt: "desc" },
  });
}