import Image from "next/image"

import { cn } from "@/lib/utils"

type ChessPieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
type ChessPieceSide = "black" | "white"
type ChessPieceStyle = "piece" | "symbol"

interface ChessPieceProps {
  piece: ChessPieceType
  side: ChessPieceSide
  /** "piece" = realistic 3D-style set, "symbol" = flat glyph set. */
  variant?: ChessPieceStyle
  size?: number
  className?: string
}

const NATIVE_SIZE: Record<ChessPieceStyle, number> = { piece: 84, symbol: 72 }
const FOLDER: Record<ChessPieceStyle, string> = { piece: "pieces", symbol: "symbols" }

function ChessPiece({
  piece,
  side,
  variant = "piece",
  size,
  className,
}: ChessPieceProps) {
  const dimension = size ?? NATIVE_SIZE[variant]

  return (
    <Image
      src={`/chess/${FOLDER[variant]}/${piece}-${side}.svg`}
      alt=""
      width={dimension}
      height={dimension}
      className={cn("shrink-0", className)}
    />
  )
}

export { ChessPiece }
export type { ChessPieceProps, ChessPieceType, ChessPieceSide, ChessPieceStyle }
