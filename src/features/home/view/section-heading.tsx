import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  actionLabel?: string
  /** Renders a trailing chevron-right next to the action label (e.g. "Ko'rish", "Barchasi" with an arrow). */
  actionIcon?: boolean
  /** Extra classes for the action button — used for the odd cases where Figma dims one section's link more than another's. */
  actionClassName?: string
  /** Title text size: "default" is 20px, "sm" is 18px (used by the sidebar list cards). */
  size?: "default" | "sm"
  titleClassName?: string
  className?: string
}

// "Barchasi"/"Ko'rish" style CTAs render disabled — the pages they'd link to
// (Ranking, Courses catalog, Library catalog, News detail) don't exist yet,
// so this is a visual placeholder rather than a broken route (see CLAUDE.md's
// Home to-do).
function SectionHeading({
  title,
  actionLabel,
  actionIcon,
  actionClassName,
  size = "default",
  titleClassName,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2
        className={cn(
          "font-medium text-brand-white",
          size === "sm" ? "text-lg" : "text-xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {actionLabel && (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className={cn("text-brand-blue-light", actionClassName)}
        >
          {actionLabel}
          {actionIcon && <ChevronRightIcon />}
        </Button>
      )}
    </div>
  )
}

export { SectionHeading }
export type { SectionHeadingProps }
