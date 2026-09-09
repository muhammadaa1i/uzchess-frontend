import { TimeControlTag } from "@/components/shared/chess/time-control-tag"
import type { CompletedGame } from "@/features/completed-games/model/completed-games-schemas"
import { cn, formatDayMonth } from "@/lib/utils"

const GRID_COLS = "grid-cols-[1fr_64px_128px_88px_88px]"

interface CompletedGameRowProps {
  game: CompletedGame
  alt: boolean
}

function CompletedGameRow({ game, alt }: CompletedGameRowProps) {
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

export { GRID_COLS, CompletedGameRow }
