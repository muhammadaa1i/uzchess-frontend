import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ShortcutTileProps {
  title: string
  icon: ReactNode
  className?: string
}

function ShortcutTile({ title, icon, className }: ShortcutTileProps) {
  return (
    <div
      aria-disabled
      className={cn(
        "relative flex h-[108px] items-center justify-center gap-3 overflow-hidden rounded-lg",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute -top-8 -right-8 size-24 rounded-full bg-brand-blue opacity-30 blur-3xl"
      />
      <span
        aria-hidden
        className="absolute -bottom-8 -left-8 size-24 rounded-full bg-brand-blue opacity-30 blur-3xl"
      />
      <span className="relative">{icon}</span>
      <span className="relative text-xl font-bold text-brand-white">{title}</span>
    </div>
  )
}

export { ShortcutTile }
