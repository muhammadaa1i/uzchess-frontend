import { cn } from "@/lib/utils"
import {
  ChessPiece,
  type ChessPieceSide,
  type ChessPieceType,
} from "@/components/shared/chess/chess-piece"

interface BoardPiece {
  /** 0-7, 0 = top rank (8th rank) */
  row: number
  /** 0-7, 0 = a-file */
  col: number
  piece: ChessPieceType
  side: ChessPieceSide
}

interface SimpleBoardProps {
  size?: number
  pieces?: BoardPiece[]
  showCoordinates?: boolean
  className?: string
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]

function SimpleBoard({
  size = 320,
  pieces = [],
  showCoordinates = false,
  className,
}: SimpleBoardProps) {
  const squareSize = size / 8

  return (
    <div
      className={cn(
        "grid grid-cols-8 grid-rows-8 overflow-hidden rounded-[5px]",
        className
      )}
      style={{ width: size, height: size }}
    >
      {RANKS.flatMap((rank, row) =>
        FILES.map((file, col) => {
          const isDark = (row + col) % 2 === 1
          const piece = pieces.find((p) => p.row === row && p.col === col)

          return (
            <div
              key={`${file}${rank}`}
              className={cn(
                "relative flex items-center justify-center",
                isDark ? "bg-board-dark" : "bg-board-light"
              )}
            >
              {piece && (
                <ChessPiece
                  piece={piece.piece}
                  side={piece.side}
                  size={squareSize * 0.85}
                />
              )}
              {showCoordinates && col === 0 && (
                <span className="pointer-events-none absolute left-1 top-0.5 text-[10px] font-medium text-brand-secondary-low">
                  {rank}
                </span>
              )}
              {showCoordinates && row === 7 && (
                <span className="pointer-events-none absolute bottom-0.5 right-1 text-[10px] font-medium text-brand-secondary-low">
                  {file}
                </span>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export { SimpleBoard }
export type { SimpleBoardProps, BoardPiece }
