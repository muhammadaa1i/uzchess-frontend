import { cn } from "@/lib/utils"

interface GameOfDayPlayerChipProps {
  name: string
  colorClassName: string
}

function GameOfDayPlayerChip({ name, colorClassName }: GameOfDayPlayerChipProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("size-2 shrink-0 rounded-sm", colorClassName)} />
      <span className="truncate text-sm font-medium text-brand-white">{name}</span>
    </div>
  )
}

export { GameOfDayPlayerChip }
