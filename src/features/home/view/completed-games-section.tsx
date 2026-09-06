"use client"

import { useTranslations } from "next-intl"

import { TimeControlTag } from "@/components/shared/chess/time-control-tag"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { CompletedGame } from "@/features/home/model/home-schemas"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useCompletedGames } from "@/features/home/viewmodel/use-completed-games"
import { cn, formatDayMonth } from "@/lib/utils"

const GRID_COLS = "grid-cols-[1fr_64px_128px_88px_88px]"

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

function CompletedGameRow({ game, alt }: { game: CompletedGame; alt: boolean }) {
  return (
    <div
      className={cn(
        "grid h-[72px] items-center gap-4 border-b border-[#272B30] px-4",
        GRID_COLS,
        alt && "bg-[#15181A]"
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm text-brand-white">{game.whitePlayerName}</span>
        <span className="truncate text-sm text-brand-white">{game.blackPlayerName}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-brand-secondary-low">{game.whiteScore}</span>
        <span className="text-sm text-brand-secondary-low">{game.blackScore}</span>
      </div>
      <TimeControlTag control={game.gameType} />
      <span className="text-sm text-brand-secondary-low">{game.movesCount}</span>
      <span className="text-right text-sm text-brand-secondary-low">
        {formatDayMonth(game.playedAt)}
      </span>
    </div>
  )
}

export { CompletedGamesSection }
