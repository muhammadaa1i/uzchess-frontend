import { cva, type VariantProps } from "class-variance-authority"
import Image from "next/image"

import { cn } from "@/lib/utils"

type DifficultyLevel = "beginner" | "amateur" | "professional"

const DEFAULT_LABEL: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  amateur: "Amateur",
  professional: "Professional",
}

const difficultyBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-brand-white",
  {
    variants: {
      level: {
        beginner: "bg-brand-green",
        amateur: "bg-brand-yellow",
        professional: "bg-brand-red",
      },
    },
  }
)

interface DifficultyBadgeProps
  extends Omit<VariantProps<typeof difficultyBadgeVariants>, "level"> {
  level: DifficultyLevel
  label?: string
  className?: string
}

function DifficultyBadge({ level, label, className }: DifficultyBadgeProps) {
  return (
    <span className={cn(difficultyBadgeVariants({ level }), className)}>
      <Image src={`/chess/difficulty/${level}.svg`} alt="" width={14} height={14} />
      {label ?? DEFAULT_LABEL[level]}
    </span>
  )
}

export { DifficultyBadge }
export type { DifficultyBadgeProps, DifficultyLevel }
