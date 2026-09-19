"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { CountrySelect } from "@/components/shared/form/country-select"
import { RankingTable } from "@/components/shared/ranking/ranking-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GamesListPanel } from "@/features/ranking/games-list/view/games-list-panel"
import { RankingPagination } from "@/features/ranking/ranking/view/ranking-pagination"
import { useRanking } from "@/features/ranking/ranking/viewmodel/use-ranking"

const RANKING_PAGE_SIZE = 10

// Figma's full Ranking page has three tabs ("Barchasi" / "Tamomlangan
// o'yinlar" / "Barcha o'yinlar"). "Barchasi" (all players) is backed by
// GET /players/ranking. The other two read from GET /games/list — a
// different entity shape (two-player game records, not per-player rating
// rows) — filtered via that endpoint's `status` query param ("completed" /
// omitted for "all"). Previously the backend had no field distinguishing
// "completed" games from "all" games (every record already had final
// scores), so those two tabs were rendered disabled per CLAUDE.md's "flag
// as a backend gap" rule; the backend has since shipped `GameStatus`
// (`ongoing` | `completed`) plus nullable scores on GetGamesListResponse,
// so both tabs are now wired to the `games-list` sibling slice.
function RankingView() {
  const t = useTranslations("Ranking")
  const {
    rows,
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
  } = useRanking()

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="completedGames">{t("tabs.completedGames")}</TabsTrigger>
          <TabsTrigger value="allGames">{t("tabs.allGames")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
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
                {Array.from({ length: RANKING_PAGE_SIZE }).map((_, index) => (
                  <Skeleton key={index} className="h-[62px] w-full rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : rows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
                {t("empty")}
              </div>
            ) : (
              <>
                <RankingTable
                  rows={rows}
                  columnLabels={{
                    rank: t("table.rank"),
                    player: t("table.player"),
                    rating: t("table.rating"),
                  }}
                />
                {totalPages > 1 && (
                  <RankingPagination
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
        </TabsContent>

        <TabsContent value="completedGames">
          <GamesListPanel status="completed" pageParam="completedGamesPage" />
        </TabsContent>

        <TabsContent value="allGames">
          <GamesListPanel status={undefined} pageParam="allGamesPage" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { RankingView }
