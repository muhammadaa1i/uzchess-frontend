import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  actionLabel?: string
  /** Renders a trailing chevron-right next to the action label (e.g. "Ko'rish", "Barchasi" with an arrow). */
  actionIcon?: boolean
  /** Extra classes for the action button — used for the odd cases where Figma dims one section's link more than another's. */
  actionClassName?: string
  /**
   * Locale-aware route the action button links to. Omit to render the
   * button disabled — the default for sections whose target page (Courses
   * catalog, Library catalog, News detail) doesn't exist yet (see CLAUDE.md's
   * Home to-do).
   */
  href?: Parameters<typeof Link>[0]["href"]
  /** Title text size: "default" is 20px, "sm" is 18px (used by the sidebar list cards). */
  size?: "default" | "sm"
  titleClassName?: string
  className?: string
}

function SectionHeading({
  title,
  actionLabel,
  actionIcon,
  actionClassName,
  href,
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
      {actionLabel &&
        (href ? (
          <Button
            variant="ghost"
            size="sm"
            className={cn("text-brand-blue-light", actionClassName)}
            nativeButton={false}
            render={<Link href={href} />}
          >
            {actionLabel}
            {actionIcon && <ChevronRightIcon />}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            className={cn("text-brand-blue-light", actionClassName)}
          >
            {actionLabel}
            {actionIcon && <ChevronRightIcon />}
          </Button>
        ))}
    </div>
  )
}

export { SectionHeading }
export type { SectionHeadingProps }
