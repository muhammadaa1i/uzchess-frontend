"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { CountrySelect } from "@/components/shared/form/country-select"
import { RankingTable } from "@/components/shared/ranking/ranking-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RankingPagination } from "@/features/ranking/ranking/view/ranking-pagination"
import { useRanking } from "@/features/ranking/ranking/viewmodel/use-ranking"

const RANKING_PAGE_SIZE = 10

// Figma's full Ranking page has three tabs ("Barchasi" / "Tamomlangan
// o'yinlar" / "Barcha o'yinlar"), but only "Barchasi" (all players, backed by
// GET /players/ranking) has a matching backend endpoint. The other two read
// as a switch to a *games* list (GET /games/list, /games/read) — a
// different entity shape entirely (two-player game records, not per-player
// rating rows), and the backend has no field distinguishing "completed"
// games from "all" games (every record already has final scores). Building
// those tabs would mean guessing a distinction the API doesn't expose, so
// per CLAUDE.md's "flag as a backend gap" rule they're rendered disabled
// rather than wired to fabricated data — see CLAUDE.md section 3's to-do
// note.
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
          <TabsTrigger value="completedGames" disabled>
            {t("tabs.completedGames")}
          </TabsTrigger>
          <TabsTrigger value="allGames" disabled>
            {t("tabs.allGames")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
    </div>
  )
}

export { RankingView }
