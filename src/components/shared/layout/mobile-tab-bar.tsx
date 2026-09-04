"use client"

import {
  GraduationCapIcon,
  HomeIcon,
  LibraryIcon,
  NewspaperIcon,
  PhoneIcon,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

function MobileTabBar() {
  const t = useTranslations("Nav")
  const pathname = usePathname()

  const tabs: Array<{ href: string; label: string; icon: LucideIcon }> = [
    { href: "/", label: t("home"), icon: HomeIcon },
    { href: "/news", label: t("news"), icon: NewspaperIcon },
    { href: "/courses", label: t("courses"), icon: GraduationCapIcon },
    { href: "/library", label: t("library"), icon: LibraryIcon },
    { href: "/contact", label: t("contact"), icon: PhoneIcon },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-dark-2/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
      <div className="flex items-stretch justify-between px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-brand-secondary-low transition-colors",
                isActive && "text-brand-blue-light"
              )}
            >
              <Icon className="size-5" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export { MobileTabBar }
