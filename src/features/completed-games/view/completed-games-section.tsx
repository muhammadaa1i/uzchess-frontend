"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { EmptyState } from "@/components/shared/widget/empty-state"
import { SectionHeading } from "@/components/shared/widget/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { CompletedGameRow, GRID_COLS } from "@/features/completed-games/view/completed-game-row"
import { useCompletedGames } from "@/features/completed-games/viewmodel/use-completed-games"
import { cn } from "@/lib/utils"

// "Barchasi" links to the full Ranking/games page (Figma to-do section 3),
// which doesn't exist yet — see SectionHeading's placeholder CTA.
function CompletedGamesSection() {
  const t = useTranslations("Home.completedGames")
  const { games, isLoading, isError, refetch } = useCompletedGames()

  const columnLabels = [
    { label: t("players"), className: "" },
    { label: t("result"), className: "" },
    { label: t("gameType"), className: "" },
    { label: t("moves"), className: "" },
    { label: t("date"), className: "text-right" },
  ]

  return (
    <section className="flex flex-col overflow-hidden rounded-lg border border-[#1F272A] bg-[#1A1D1F]">
      <SectionHeading
        title={t("title")}
        actionLabel={t("seeAll")}
        actionIcon
        className="px-4 py-4"
      />
      {isLoading ? (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[72px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="px-4 pb-4">
          <ErrorState onRetry={refetch} />
        </div>
      ) : games.length === 0 ? (
        <div className="px-4 pb-4">
          <EmptyState message={t("empty")} />
        </div>
      ) : (
        <div className="flex flex-col">
          <div
            className={cn(
              "grid h-9 items-center gap-4 border border-[#151C1F] bg-[#272B30] px-4 text-xs tracking-wider text-[#9D9FA1] uppercase",
              GRID_COLS
            )}
          >
            {columnLabels.map((column) => (
              <span key={column.label} className={column.className}>
                {column.label}
              </span>
            ))}
          </div>
          {games.map((game, index) => (
            <CompletedGameRow key={game.id} game={game} alt={index % 2 === 1} />
          ))}
        </div>
      )}
    </section>
  )
}

export { CompletedGamesSection }
