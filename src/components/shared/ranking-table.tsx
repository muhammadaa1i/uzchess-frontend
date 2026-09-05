"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Purely presentational player-ranking table, shared between the Home page's
// top-5 widget (src/features/home/view/ranking-widget.tsx) and the full
// Ranking page (src/features/ranking/view/ranking-view.tsx) — see CLAUDE.md's
// code-splitting mandate: since neither feature may import the other's
// model/view files, this row shape is defined locally here rather than
// importing a feature's zod-inferred type. Each feature's own `PlayerRanking`
// type is a structural superset of `RankingTableRow`, so no adapter/mapping
// is needed to pass it in directly.
type RankingTitle = "none" | "cm" | "fm" | "im" | "gm" | "wcm" | "wfm" | "wim" | "wgm"

interface RankingTableRow {
  id: number
  rank: number
  name: string
  avatarUrl?: string | null
  country: string
  title: RankingTitle
  classicalRating: number
  classicalRatingChange?: number | null
}

interface RankingTableColumnLabels {
  rank: string
  player: string
  rating: string
}

interface RankingTableProps {
  rows: RankingTableRow[]
  /** Omit to render without a header row (the Home widget's compact top-5
   * card doesn't show one; the full Ranking page does). */
  columnLabels?: RankingTableColumnLabels
  className?: string
}

const TITLE_LABEL: Record<RankingTitle, string> = {
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

function RankingTable({ rows, columnLabels, className }: RankingTableProps) {
  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-[#1A2226] border-t border-[#1A2226]",
        className
      )}
    >
      {columnLabels && (
        <div className="flex items-center justify-between gap-4 bg-[#272B30] px-4 py-2 text-xs tracking-wider text-[#9D9FA1] uppercase">
          <div className="flex items-center gap-3">
            <span className="w-5">{columnLabels.rank}</span>
            <span>{columnLabels.player}</span>
          </div>
          <span>{columnLabels.rating}</span>
        </div>
      )}
      {rows.map((row) => (
        <RankingTableRowView key={row.id} row={row} />
      ))}
    </div>
  )
}

function RankingTableRowView({ row }: { row: RankingTableRow }) {
  return (
    <div className="flex h-[62px] items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-3">
        <span className="w-5 text-sm font-medium text-brand-secondary-low">{row.rank}</span>
        <Avatar size="sm">
          <AvatarImage src={row.avatarUrl ?? undefined} alt={row.name} />
          <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-brand-white">
          {row.name}
          {row.title !== "none" && (
            <span className="ml-1.5 text-xs font-normal text-brand-blue-light">
              {TITLE_LABEL[row.title]}
            </span>
          )}
        </span>
        <span className="text-xs text-brand-secondary-low">{row.country}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-semibold text-brand-white">{row.classicalRating}</span>
        <RatingChange value={row.classicalRatingChange} />
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

export { RankingTable }
export type { RankingTableColumnLabels, RankingTableRow, RankingTitle }
