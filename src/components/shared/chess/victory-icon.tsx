import Image from "next/image"

import { cn } from "@/lib/utils"

interface VictoryIconProps {
  active?: boolean
  size?: number
  className?: string
}

function VictoryIcon({ active = false, size = 24, className }: VictoryIconProps) {
  return (
    <Image
      src={active ? "/chess/victory/victory-on.svg" : "/chess/victory/victory-off.svg"}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  )
}

export { VictoryIcon }
export type { VictoryIconProps }
