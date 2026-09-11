"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { CourseCreateButton } from "@/features/admin/course-list/view/course-create-button"
import { CourseList } from "@/features/admin/course-list/view/course-list"
import { CourseListPagination } from "@/features/admin/course-list/view/course-list-pagination"
import { CourseListSkeleton } from "@/features/admin/course-list/view/course-list-skeleton"
import { useAdminCourseList } from "@/features/admin/course-list/viewmodel/use-admin-course-list"
import { useAdminAccess } from "@/features/auth/viewmodel/use-admin-access"

// /admin/courses — layout.tsx's gate already requires plain `admin` (unlike
// role-management, this screen doesn't need the stricter superadmin check),
// but it still checks `isAdmin` directly as a defense-in-depth fallback, same
// "plain in-page fallback instead of a redirect" pattern as
// book-list-view.tsx.
function CourseListView() {
  const t = useTranslations("Admin.courseManagement")
  const { isAdmin } = useAdminAccess()
  const {
    courses,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
  } = useAdminCourseList()

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
        <CourseCreateButton onSaved={refetch} />
      </div>

      {isLoading ? (
        <CourseListSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <CourseList courses={courses} onSaved={refetch} />
          {totalPages > 1 && (
            <CourseListPagination
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

export { CourseListView }
