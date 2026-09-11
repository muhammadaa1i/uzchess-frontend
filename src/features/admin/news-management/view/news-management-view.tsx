"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { NewsCreateButton } from "@/features/admin/news-management/view/news-create-button"
import { NewsManagementList } from "@/features/admin/news-management/view/news-management-list"
import { NewsManagementPagination } from "@/features/admin/news-management/view/news-management-pagination"
import { NewsManagementSkeleton } from "@/features/admin/news-management/view/news-management-skeleton"
import { useAdminNewsList } from "@/features/admin/news-management/viewmodel/use-admin-news-list"
import { useAdminAccess } from "@/features/auth/viewmodel/use-admin-access"

// /admin/news — layout.tsx's gate already requires plain `admin` (unlike
// role-management, this screen doesn't need the stricter superadmin check),
// but it still checks `isAdmin` directly as a defense-in-depth fallback, same
// "plain in-page fallback instead of a redirect" pattern as
// role-management-view.tsx/profile-view.tsx's signed-out state.
function NewsManagementView() {
  const t = useTranslations("Admin.newsManagement")
  const { isAdmin } = useAdminAccess()
  const { news, isLoading, isError, refetch, page, setPage, totalPages, hasNext, hasPrevious } =
    useAdminNewsList()

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="text-sm text-brand-secondary-low">{t("notAuthorized")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-brand-white">{t("title")}</h1>
          <p className="text-sm text-brand-secondary-low">{t("description")}</p>
        </div>
        <NewsCreateButton onSaved={refetch} />
      </div>

      {isLoading ? (
        <NewsManagementSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <NewsManagementList news={news} onSaved={refetch} />
          {totalPages > 1 && (
            <NewsManagementPagination
              page={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export { NewsManagementView }
