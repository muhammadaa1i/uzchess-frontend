import { CompletedGamesSection } from "@/features/completed-games/view/completed-games-section"
import { GameOfDaySection } from "@/features/game-of-day/view/game-of-day-section"
import { DonationBanner } from "@/features/home/view/donation-banner"
import { ShortcutTiles } from "@/features/home/view/shortcut-tiles"
import { NewsList } from "@/features/latest-news/view/news-list"
import { HeroPromoBanner } from "@/features/promo-banners/view/hero-promo-banner"
import { PromoBanners } from "@/features/promo-banners/view/promo-banners"
import { TopBooksSection } from "@/features/top-books/view/top-books-section"
import { TopCoursesSection } from "@/features/top-courses/view/top-courses-section"
import { RankingWidget } from "@/features/top-ranking/view/ranking-widget"

// Mirrors the real 3-column dashboard layout from Figma (node 690:21931):
// a 326px left column, a 676px center column, and a 326px right column,
// gap-6 (24px) between them, all inside the same 1376px container the
// header uses. Columns are independent stacks of differing height
// (items-start), not row-locked. Collapses to a single column below `lg`.
//
// Each widget below is its own top-level feature (game-of-day,
// completed-games, top-ranking, latest-news, top-courses, top-books,
// promo-banners) rather than living inside home/view — this feature's
// view/ is reserved for page composition plus genuinely page-local pieces
// that don't fetch their own data (ShortcutTiles, DonationBanner).
function HomeView() {
  return (
    <div className="mx-auto grid max-w-[1376px] grid-cols-1 items-start gap-6 px-4 py-8 lg:grid-cols-[326px_1fr_326px] lg:px-6 lg:py-10">
      <div className="flex flex-col gap-6">
        <GameOfDaySection />
        <RankingWidget />
      </div>

      <div className="flex flex-col gap-6">
        <ShortcutTiles />
        <CompletedGamesSection />
        <HeroPromoBanner />
        <NewsList />
      </div>

      <div className="flex flex-col gap-6">
        <DonationBanner />
        <PromoBanners />
        <TopCoursesSection />
        <TopBooksSection />
      </div>
    </div>
  )
}

export { HomeView }
