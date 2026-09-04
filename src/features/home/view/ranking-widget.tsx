"use client"

import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { PlayerRanking } from "@/features/home/model/home-schemas"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useTopRanking } from "@/features/home/viewmodel/use-top-ranking"
import { cn } from "@/lib/utils"

const TITLE_LABEL: Record<PlayerRanking["title"], string> = {
  none: "",
  cm: "CM",
  fm: "FM",
  im: "IM",
  gm: "GM",
  wcm: "WCM",
  wfm: "WFM",
  wim: "WIM",
  wgm: "WGM",
}

// "Barchasi" links to the full Ranking page (section 3 of the Figma to-do
// list), which doesn't exist yet — see SectionHeading's placeholder CTA.
function RankingWidget() {
  const t = useTranslations("Home.ranking")
  const { players, isLoading, isError } = useTopRanking()

  return (
    <section className="flex flex-col rounded-xl border border-[#1F272A] bg-[#1A1D1F]">
      <SectionHeading title={t("title")} actionLabel={t("seeAll")} className="px-4 py-4" />
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
        <div className="flex flex-col divide-y divide-[#1A2226] border-t border-[#1A2226]">
          {players.map((player) => (
            <RankingRow key={player.id} player={player} />
          ))}
        </div>
      )}
    </section>
  )
}

function RankingRow({ player }: { player: PlayerRanking }) {
  return (
    <div className="flex h-[62px] items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-3">
        <span className="w-5 text-sm font-medium text-brand-secondary-low">{player.rank}</span>
        <Avatar size="sm">
          <AvatarImage src={player.avatarUrl ?? undefined} alt={player.name} />
          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-brand-white">
          {player.name}
          {player.title !== "none" && (
            <span className="ml-1.5 text-xs font-normal text-brand-blue-light">
              {TITLE_LABEL[player.title]}
            </span>
          )}
        </span>
        <span className="text-xs text-brand-secondary-low">{player.country}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-semibold text-brand-white">{player.classicalRating}</span>
        <RatingChange value={player.classicalRatingChange} />
      </div>
    </div>
  )
}

// Classical-rating delta since the previous ranking period. Null/zero
// renders the neutral fallback rather than a fabricated +/- sign.
function RatingChange({ value }: { value: number | null | undefined }) {
  if (!value) {
    return <span className="text-xs text-brand-secondary-low">-</span>
  }

  return (
    <span className={cn("text-xs", value > 0 ? "text-brand-green" : "text-brand-red")}>
      {value > 0 ? `+${value}` : value}
    </span>
  )
}

export { RankingWidget }
