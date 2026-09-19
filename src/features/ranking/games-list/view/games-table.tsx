import type { GameListItem } from "@/features/ranking/games-list/model/games-list-schemas"
import { GRID_COLS, GameRow } from "@/features/ranking/games-list/view/game-row"
import { cn } from "@/lib/utils"

interface GamesTableColumnLabels {
  players: string
  result: string
  gameType: string
  moves: string
  date: string
}

interface GamesTableProps {
  games: GameListItem[]
  columnLabels: GamesTableColumnLabels
  ongoingLabel: string
  className?: string
}

// Purely presentational games table — same grid-row visual pattern as the
// Home page's completed-games widget (@/features/ranking/completed-games),
// duplicated locally rather than imported since that feature's row shape
// doesn't carry `status`/nullable scores (see CLAUDE.md's code-splitting
// mandate on not importing across feature boundaries).
function GamesTable({ games, columnLabels, ongoingLabel, className }: GamesTableProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "grid h-9 items-center gap-4 border border-[#151C1F] bg-[#272B30] px-4 text-xs tracking-wider text-[#9D9FA1] uppercase",
          GRID_COLS
        )}
      >
        <span>{columnLabels.players}</span>
        <span>{columnLabels.result}</span>
        <span>{columnLabels.gameType}</span>
        <span>{columnLabels.moves}</span>
        <span className="text-right">{columnLabels.date}</span>
      </div>
      {games.map((game, index) => (
        <GameRow key={game.id} game={game} alt={index % 2 === 1} ongoingLabel={ongoingLabel} />
      ))}
    </div>
  )
}

export { GamesTable }
export type { GamesTableColumnLabels }
