"use client"

import { useSearchParams } from "next/navigation"
import { useCallback } from "react"

import { usePathname, useRouter } from "@/lib/i18n/navigation"

// Keeps a paginated list's current page in the URL's `?page=` query param
// instead of only in memory — a reload remounts the component and loses
// plain `useState` entirely, which is why every catalog/admin list page was
// silently resetting to page 1 on reload. `paramName` lets a page with more
// than one paginated list (e.g. a detail page's reviews section) avoid
// colliding on the same query key.
function usePageQueryParam(paramName = "page") {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const rawPage = Number(searchParams.get(paramName))
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1

  const setPage = useCallback(
    (next: number) => {
      const query = Object.fromEntries(searchParams.entries())
      if (next <= 1) {
        delete query[paramName]
      } else {
        query[paramName] = String(next)
      }
      router.replace({ pathname, query }, { scroll: false })
    },
    [searchParams, pathname, router, paramName]
  )

  return [page, setPage] as const
}

export { usePageQueryParam }
