-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('ANIME', 'MANGA', 'MANHWA', 'MANHUA', 'MOVIE');

-- CreateEnum
CREATE TYPE "ExternalSource" AS ENUM ('ANILIST', 'TMDB');

-- CreateEnum
CREATE TYPE "LibraryStatus" AS ENUM ('PLAN_TO_WATCH', 'WATCHING', 'READING', 'COMPLETED', 'ON_HOLD', 'DROPPED');

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "type" "MediaType" NOT NULL,
    "externalSource" "ExternalSource" NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "synopsis" TEXT,
    "releaseYear" INTEGER,
    "totalEpisodes" INTEGER,
    "totalChapters" INTEGER,
    "genres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "status" "LibraryStatus" NOT NULL DEFAULT 'PLAN_TO_WATCH',
    "currentEpisode" INTEGER,
    "currentChapter" INTEGER,
    "score" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "libraryEntryId" INTEGER NOT NULL,
    "delta" INTEGER NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Media_externalSource_externalId_key" ON "Media"("externalSource", "externalId");

-- CreateIndex
CREATE INDEX "LibraryEntry_userId_status_idx" ON "LibraryEntry"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryEntry_userId_mediaId_key" ON "LibraryEntry"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "ProgressLog_userId_loggedAt_idx" ON "ProgressLog"("userId", "loggedAt");

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressLog" ADD CONSTRAINT "ProgressLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressLog" ADD CONSTRAINT "ProgressLog_libraryEntryId_fkey" FOREIGN KEY ("libraryEntryId") REFERENCES "LibraryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
