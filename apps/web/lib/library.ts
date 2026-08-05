import { prisma, MediaType, LibraryStatus, ExternalSource } from "database";
import { DEMO_USER_ID } from "@/lib/demo-user";

export async function getUserLibrary() {
  return prisma.libraryEntry.findMany({
    where: { userId: DEMO_USER_ID },
    include: { media: true },
    orderBy: { updatedAt: "desc" },
  });
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

export async function getLibraryEntryByExternalId(source: ExternalSource, externalId: string) {
  return prisma.libraryEntry.findFirst({
    where: { userId: DEMO_USER_ID, media: { externalSource: source, externalId } },
    include: { media: true },
  });
}