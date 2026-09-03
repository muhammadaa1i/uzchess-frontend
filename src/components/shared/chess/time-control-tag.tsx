import Image from "next/image"

import { cn } from "@/lib/utils"

type TimeControl = "bullet" | "blitz" | "rapid"

const LABEL: Record<TimeControl, string> = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid",
}

const TEXT_COLOR: Record<TimeControl, string> = {
  bullet: "text-brand-green",
  blitz: "text-brand-yellow",
  rapid: "text-brand-red",
}

interface TimeControlTagProps {
  control: TimeControl
  className?: string
}

function TimeControlTag({ control, className }: TimeControlTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        TEXT_COLOR[control],
        className
      )}
    >
      <Image src={`/chess/time/${control}.svg`} alt="" width={20} height={20} />
      {LABEL[control]}
    </span>
  )
}

export { TimeControlTag }
export type { TimeControlTagProps, TimeControl }
