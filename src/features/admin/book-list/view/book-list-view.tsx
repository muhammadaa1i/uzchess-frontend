"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { BookCreateButton } from "@/features/admin/book-list/view/book-create-button"
import { BookList } from "@/features/admin/book-list/view/book-list"
import { BookListPagination } from "@/features/admin/book-list/view/book-list-pagination"
import { BookListSkeleton } from "@/features/admin/book-list/view/book-list-skeleton"
import { useAdminBookList } from "@/features/admin/book-list/viewmodel/use-admin-book-list"
import { useAdminAccess } from "@/features/auth/viewmodel/use-admin-access"

// /admin/books — layout.tsx's gate already requires plain `admin` (unlike
// role-management, this screen doesn't need the stricter superadmin check),
// but it still checks `isAdmin` directly as a defense-in-depth fallback, same
// "plain in-page fallback instead of a redirect" pattern as
// news-management-view.tsx/banner-management-view.tsx.
function BookListView() {
  const t = useTranslations("Admin.bookManagement")
  const { isAdmin } = useAdminAccess()
  const { books, isLoading, isError, refetch, page, setPage, totalPages, hasNext, hasPrevious } =
    useAdminBookList()

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
        <BookCreateButton onSaved={refetch} />
      </div>

      {isLoading ? (
        <BookListSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <BookList books={books} onSaved={refetch} />
          {totalPages > 1 && (
            <BookListPagination
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

export { BookListView }
