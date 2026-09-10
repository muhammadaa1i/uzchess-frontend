"use client"

import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin/roles", key: "roles" },
  { href: "/admin/news", key: "news" },
  { href: "/admin/banners", key: "banners" },
  { href: "/admin/books", key: "books" },
  { href: "/admin/courses", key: "courses" },
] as const

// Route-based sidebar (each item is its own page under /admin), unlike
// Profile's single-page Tabs — admin sections are separate CRUD screens, not
// panels of one dashboard. Imported directly by admin/layout.tsx (a route
// entry), so this doesn't create a cross-feature bundle boundary violation.
function AdminSidebarNav() {
  const t = useTranslations("Admin.nav")
  const pathname = usePathname()

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 lg:w-64">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-4 py-2.5 text-sm font-medium text-brand-secondary-low transition-colors hover:bg-card hover:text-brand-white",
              isActive && "bg-card text-brand-white"
            )}
          >
            {t(item.key)}
          </Link>
        )
      })}
    </nav>
  )
}

export { AdminSidebarNav }
