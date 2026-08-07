import Link from "next/link";
import { redirect } from "next/navigation";
import { Library, Layers, Flame, MoonStar, Tv, BookOpen, Book, Film } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "database";
import { fetchAniListMedia } from "@/lib/api/anilist";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const userCount = await prisma.user.count();
  const titleCount = await prisma.media.count();

  const [animeRow, mangaRow, manhwaRow, manhuaRow] = await Promise.all([
    fetchAniListMedia({ type: "ANIME", sort: "TRENDING_DESC", page: 1, perPage: 2 }),
    fetchAniListMedia({ type: "MANGA", countryOfOrigin: "JP", sort: "TRENDING_DESC", page: 1, perPage: 2 }),
    fetchAniListMedia({ type: "MANGA", countryOfOrigin: "KR", sort: "TRENDING_DESC", page: 1, perPage: 2 }),
    fetchAniListMedia({ type: "MANGA", countryOfOrigin: "CN", sort: "TRENDING_DESC", page: 1, perPage: 1 }),
  ]);

  const posterWall = [
    ...animeRow.results,
    ...mangaRow.results,
    ...manhwaRow.results,
    ...manhuaRow.results,
  ].filter((m) => m.coverImageUrl);

  return (
    <div className="relative bg-surface-0 overflow-x-hidden w-full min-h-screen">
      {/* Aurora background — sits behind header + hero */}
      <AuroraBackground
        showRadialGradient
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[85vh] max-h-[1000px] bg-transparent"
      />

      {/* Header */}
      <header className="relative z-10 w-full px-[4vw] py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-text-primary">Kaeru</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-sm sm:text-base text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-on-brand hover:opacity-90 transition-opacity"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full px-[4vw] pb-20 sm:pb-24 lg:pb-32">
        {/* Hero Section — vertically centered in viewport */}
        <section className="min-h-[78vh] flex flex-col items-center justify-center text-center">
          <div className="mb-8 sm:mb-10 flex flex-wrap justify-center gap-2.5 sm:gap-4 opacity-90">
            {posterWall.map((title, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={title.externalId}
                src={title.coverImageUrl!}
                alt=""
                className="h-[92px] w-[65px] sm:h-[150px] sm:w-[106px] lg:h-[175px] lg:w-[124px] rounded-md object-cover shadow-lg shrink-0"
                style={{ marginTop: i % 3 === 1 ? "14px" : i % 3 === 2 ? "5px" : "0" }}
              />
            ))}
          </div>

          <p className="mb-4 text-xs sm:text-sm tracking-wide text-text-muted">
            for anime · manga · manhwa · manhua · movies
          </p>

          <h1 className="mb-4 sm:mb-5 w-full whitespace-nowrap text-center text-[clamp(1.35rem,6.5vw,3.75rem)] font-medium leading-tight text-text-primary">
            Which episode did you drop this on?
          </h1>

          <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-base sm:text-lg leading-relaxed text-text-secondary">
            You don&apos;t remember. Neither does the fifth app you tried. Kaeru is the one
            place that actually keeps up with everything you watch and read.
          </p>

          <div className="mb-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-brand px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg text-on-brand hover:opacity-90 transition-opacity"
            >
              Start tracking free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-border-strong px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg text-text-primary hover:bg-surface-1 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="text-sm text-text-muted">No credit card required.</p>
        </section>

        {/* Features Grid */}
        <section className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <div className="rounded-xl bg-surface-1 p-5 sm:p-6 hover:shadow-lg transition-shadow">
            <Layers size={24} className="text-accent-text" />
            <p className="mb-1.5 mt-3 text-base sm:text-lg font-medium text-text-primary">Everything, one shelf</p>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
              Anime, manga, manhwa, manhua, and movies stop living in five different tabs.
            </p>
          </div>

          <div className="rounded-xl bg-surface-1 p-5 sm:p-6 hover:shadow-lg transition-shadow">
            <Flame size={24} className="text-warning-text" />
            <p className="mb-1.5 mt-3 text-base sm:text-lg font-medium text-text-primary">Your year, mapped out</p>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
              A GitHub-style grid of every episode and chapter you actually finished.
            </p>
          </div>

          <div className="rounded-xl bg-surface-1 p-5 sm:p-6 hover:shadow-lg transition-shadow">
            <MoonStar size={24} className="text-category-manga" />
            <p className="mb-1.5 mt-3 text-base sm:text-lg font-medium text-text-primary">Built for the dark</p>
            <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
              No blinding white screens at 1am. It was never designed for daylight.
            </p>
          </div>
        </section>

        {/* Testimonial */}
        <section className="mt-16 sm:mt-20 lg:mt-24 max-w-3xl mx-auto">
          <div className="rounded-xl bg-surface-1 p-6 sm:p-8">
            <p className="text-base sm:text-lg italic leading-relaxed text-text-secondary">
              &ldquo;I dropped Bleach at episode 167 or 168, I genuinely could not tell you
              which. That&apos;s the whole reason I needed this.&rdquo;
            </p>
          </div>
        </section>

        {/* Stats — all 4 in a single row, always */}
        <section className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <p className="mb-6 sm:mb-8 text-sm sm:text-base text-text-muted">
            joining people who finally know where they left off
          </p>

          <div className="grid grid-cols-4 gap-1 xs:gap-3 sm:gap-8 lg:gap-16 max-w-4xl mx-auto">
            <div className="min-w-0">
              <p className="text-[clamp(0.85rem,4vw,2.5rem)] font-medium text-text-primary">
                {titleCount.toLocaleString()}
              </p>
              <p className="mt-1 text-[clamp(0.5rem,1.6vw,0.875rem)] text-text-muted leading-tight">titles tracked</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(0.85rem,4vw,2.5rem)] font-medium text-text-primary">4</p>
              <p className="mt-1 text-[clamp(0.5rem,1.6vw,0.875rem)] text-text-muted leading-tight">formats in one place</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(0.85rem,4vw,2.5rem)] font-medium text-text-primary">0</p>
              <p className="mt-1 text-[clamp(0.5rem,1.6vw,0.875rem)] text-text-muted leading-tight">spreadsheets needed</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(0.85rem,4vw,2.5rem)] font-medium text-text-primary">
                {userCount.toLocaleString()}
              </p>
              <p className="mt-1 text-[clamp(0.5rem,1.6vw,0.875rem)] text-text-muted leading-tight">
                {userCount === 1 ? "person joined" : "people joined"}
              </p>
            </div>
          </div>
        </section>

        {/* Format Icons */}
        <section className="mt-16 sm:mt-20 lg:mt-24 flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-14">
          <div className="text-center">
            <Tv size={22} className="mx-auto text-category-anime" />
            <p className="mt-2 text-xs sm:text-sm text-text-muted">anime</p>
          </div>
          <div className="text-center">
            <BookOpen size={22} className="mx-auto text-category-manga" />
            <p className="mt-2 text-xs sm:text-sm text-text-muted">manga</p>
          </div>
          <div className="text-center">
            <Book size={22} className="mx-auto text-category-manhwa" />
            <p className="mt-2 text-xs sm:text-sm text-text-muted">manhwa</p>
          </div>
          <div className="text-center">
            <Library size={22} className="mx-auto text-category-manhua" />
            <p className="mt-2 text-xs sm:text-sm text-text-muted">manhua</p>
          </div>
          <div className="text-center">
            <Film size={22} className="mx-auto text-category-movie" />
            <p className="mt-2 text-xs sm:text-sm text-text-muted">movies</p>
          </div>
        </section>
      </main>
    </div>
  );
}