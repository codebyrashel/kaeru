import { prisma } from "database";
import type { MediaType, ExternalSource } from "database";

export async function getUserLibrary(userId: string) {
  return prisma.libraryEntry.findMany({
    where: { userId },
    include: { media: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getLibraryExternalIds(userId: string, type: MediaType): Promise<Set<string>> {
  const entries = await prisma.libraryEntry.findMany({
    where: { userId, media: { type } },
    select: { media: { select: { externalId: true } } },
  });
  return new Set(entries.map((e) => e.media.externalId));
}

export async function getLibraryEntryByExternalId(userId: string, source: ExternalSource, externalId: string) {
  return prisma.libraryEntry.findFirst({
    where: { userId, media: { externalSource: source, externalId } },
    include: { media: true },
  });
}