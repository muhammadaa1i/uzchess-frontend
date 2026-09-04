import { GraduationCapIcon, LibraryIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// Navigation shortcuts to the Courses/Library catalogs (Figma to-do sections
// 5 and 6), neither of which exists yet — rendered as inert cards rather
// than real links, same "no route yet" convention as SectionHeading's
// disabled "Barchasi" CTAs elsewhere on this page.
function ShortcutTiles() {
  const t = useTranslations("Home.shortcuts")

  return (
    <div className="grid grid-cols-2 gap-6">
      <ShortcutTile
        title={t("courses")}
        icon={<GraduationCapIcon className="size-11 text-brand-white" />}
        className="border border-blue-500/16 bg-[#13181C] shadow-[0_8px_44px_rgba(28,146,224,0.2)]"
      />
      <ShortcutTile
        title={t("library")}
        icon={<LibraryIcon className="size-11 text-brand-white" />}
        className="border border-blue-500/8 bg-[#1A1D1F]"
      />
    </div>
  )
}

function ShortcutTile({
  title,
  icon,
  className,
}: {
  title: string
  icon: ReactNode
  className?: string
}) {
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

export { ShortcutTiles }
