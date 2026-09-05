"use client"

import { useTranslations } from "next-intl"

import { RankingTable } from "@/components/shared/ranking-table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useTopRanking } from "@/features/home/viewmodel/use-top-ranking"

// "Barchasi" links to the full Ranking page (section 3 of the Figma to-do
// list) — the row rendering itself lives in the shared `RankingTable`
// component (@/components/shared/ranking-table) so this widget and the full
// Ranking page don't import from each other's feature folder (see CLAUDE.md's
// code-splitting mandate).
function RankingWidget() {
  const t = useTranslations("Home.ranking")
  const { players, isLoading, isError } = useTopRanking()

  return (
    <section className="flex flex-col rounded-xl border border-[#1F272A] bg-[#1A1D1F]">
      <SectionHeading
        title={t("title")}
        actionLabel={t("seeAll")}
        href="/ranking"
        className="px-4 py-4"
      />
      {isLoading ? (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[62px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError || players.length === 0 ? (
        <div className="px-4 pb-4">
          <EmptyState message={t("empty")} />
        </div>
      ) : (
        <RankingTable rows={players} />
      )}
    </section>
  )
}

export { RankingWidget }
