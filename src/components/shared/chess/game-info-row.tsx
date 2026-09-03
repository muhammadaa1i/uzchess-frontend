import {
  TimeControlTag,
  type TimeControl,
} from "@/components/shared/chess/time-control-tag"
import { VictoryIcon } from "@/components/shared/chess/victory-icon"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface GameInfoPlayer {
  name: string
  avatarUrl?: string
  isWinner?: boolean
}

interface GameInfoRowProps {
  white: GameInfoPlayer
  black: GameInfoPlayer
  result: string
  timeControl: TimeControl
  date: string
  moveCount: number
  className?: string
}

function GameInfoRow({
  white,
  black,
  result,
  timeControl,
  date,
  moveCount,
  className,
}: GameInfoRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-lg bg-card px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <PlayerBadge player={white} />
        <span className="text-sm text-brand-secondary-low">vs</span>
        <PlayerBadge player={black} />
      </div>
      <div className="flex items-center gap-4 text-sm text-brand-secondary-low">
        <TimeControlTag control={timeControl} />
        <span>{result}</span>
        <span>{moveCount} moves</span>
        <span>{date}</span>
      </div>
    </div>
  )
}

function PlayerBadge({ player }: { player: GameInfoPlayer }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarImage src={player.avatarUrl} alt={player.name} />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-brand-white">{player.name}</span>
      {player.isWinner && <VictoryIcon active size={16} />}
    </div>
  )
}

export { GameInfoRow }
export type { GameInfoRowProps, GameInfoPlayer }
