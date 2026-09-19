"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { CountrySelect } from "@/components/shared/form/country-select"
import { Skeleton } from "@/components/ui/skeleton"
import type { GameStatus } from "@/features/ranking/games-list/model/games-list-schemas"
import { GamesListPagination } from "@/features/ranking/games-list/view/games-list-pagination"
import { GamesTable } from "@/features/ranking/games-list/view/games-table"
import { useGamesList } from "@/features/ranking/games-list/viewmodel/use-games-list"

const GAMES_PAGE_SIZE = 10

interface GamesListPanelProps {
  status: GameStatus | undefined
  pageParam: string
}

// Renders the shared games table for both the "Tamomlangan o'yinlar"
// (status: "completed") and "Barcha o'yinlar" (status: undefined) Ranking
// tabs — same query/table shape, only the `status` param differs. Follows
// ranking-view.tsx's exact skeleton/error/empty/pagination pattern for the
// players table.
function GamesListPanel({ status, pageParam }: GamesListPanelProps) {
  const t = useTranslations("Ranking")
  const {
    games,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
    country,
    onCountryChange,
    countryOptions,
    allCountriesValue,
  } = useGamesList(status, pageParam)

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <CountrySelect
        countries={[
          { code: allCountriesValue, name: t("countryFilter.all"), flag: "🌐" },
          ...countryOptions,
        ]}
        value={country}
        onValueChange={onCountryChange}
        placeholder={t("countryFilter.placeholder")}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: GAMES_PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="h-[72px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : games.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("gamesTable.empty")}
        </div>
      ) : (
        <>
          <GamesTable
            games={games}
            columnLabels={{
              players: t("gamesTable.players"),
              result: t("gamesTable.result"),
              gameType: t("gamesTable.gameType"),
              moves: t("gamesTable.moves"),
              date: t("gamesTable.date"),
            }}
            ongoingLabel={t("gamesTable.ongoing")}
          />
          {totalPages > 1 && (
            <GamesListPagination
              page={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export { GamesListPanel }
