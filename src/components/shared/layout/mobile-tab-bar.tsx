"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCapIcon,
  HomeIcon,
  LibraryIcon,
  NewspaperIcon,
  PhoneIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const TABS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/", label: "Asosiy", icon: HomeIcon },
  { href: "/news", label: "Yangiliklar", icon: NewspaperIcon },
  { href: "/courses", label: "Kurslar", icon: GraduationCapIcon },
  { href: "/library", label: "Kutubxona", icon: LibraryIcon },
  { href: "/contact", label: "Aloqa", icon: PhoneIcon },
]

function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-dark-2/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
      <div className="flex items-stretch justify-between px-2">
        {TABS.map((tab) => {
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
