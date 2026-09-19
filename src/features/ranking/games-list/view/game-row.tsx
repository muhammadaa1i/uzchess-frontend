import { TimeControlTag } from "@/components/shared/chess/time-control-tag"
import type { GameListItem } from "@/features/ranking/games-list/model/games-list-schemas"
import { cn, formatDayMonth } from "@/lib/utils"

const GRID_COLS = "grid-cols-[1fr_64px_128px_88px_88px]"

interface GameRowProps {
  game: GameListItem
  alt: boolean
  /** Translated label shown in place of a score for a still-ongoing game
   * (whiteScore/blackScore are null) — passed in rather than calling
   * useTranslations here so this stays a plain presentational row, same as
   * the sibling completed-games feature's CompletedGameRow. */
  ongoingLabel: string
}

function GameRow({ game, alt, ongoingLabel }: GameRowProps) {
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
      {game.status === "ongoing" ? (
        <span className="text-sm text-brand-yellow">{ongoingLabel}</span>
      ) : (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-brand-secondary-low">{game.whiteScore}</span>
          <span className="text-sm text-brand-secondary-low">{game.blackScore}</span>
        </div>
      )}
      <TimeControlTag control={game.gameType} />
      <span className="text-sm text-brand-secondary-low">{game.movesCount}</span>
      <span className="text-right text-sm text-brand-secondary-low">
        {formatDayMonth(game.playedAt)}
      </span>
    </div>
  )
}

export { GRID_COLS, GameRow }
