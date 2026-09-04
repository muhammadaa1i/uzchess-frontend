import { CompletedGamesSection } from "@/features/home/view/completed-games-section"
import { DonationBanner } from "@/features/home/view/donation-banner"
import { GameOfDaySection } from "@/features/home/view/game-of-day-section"
import { HeroPromoBanner } from "@/features/home/view/hero-promo-banner"
import { NewsList } from "@/features/home/view/news-list"
import { PromoBanners } from "@/features/home/view/promo-banners"
import { RankingWidget } from "@/features/home/view/ranking-widget"
import { ShortcutTiles } from "@/features/home/view/shortcut-tiles"
import { TopBooksSection } from "@/features/home/view/top-books-section"
import { TopCoursesSection } from "@/features/home/view/top-courses-section"

// Mirrors the real 3-column dashboard layout from Figma (node 690:21931):
// a 326px left column, a 676px center column, and a 326px right column,
// gap-6 (24px) between them, all inside the same 1376px container the
// header uses. Columns are independent stacks of differing height
// (items-start), not row-locked. Collapses to a single column below `lg`.
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
