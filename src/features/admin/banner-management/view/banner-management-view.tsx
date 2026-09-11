"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { BannerCreateButton } from "@/features/admin/banner-management/view/banner-create-button"
import { BannerManagementList } from "@/features/admin/banner-management/view/banner-management-list"
import { BannerManagementSkeleton } from "@/features/admin/banner-management/view/banner-management-skeleton"
import { useAdminBannerList } from "@/features/admin/banner-management/viewmodel/use-admin-banner-list"
import { useAdminAccess } from "@/features/auth/viewmodel/use-admin-access"

// /admin/banners — layout.tsx's gate already requires plain `admin` (unlike
// role-management, this screen doesn't need the stricter superadmin check),
// but it still checks `isAdmin` directly as a defense-in-depth fallback, same
// "plain in-page fallback instead of a redirect" pattern as
// news-management-view.tsx.
function BannerManagementView() {
  const t = useTranslations("Admin.bannerManagement")
  const { isAdmin } = useAdminAccess()
  const { banners, isLoading, isError, refetch } = useAdminBannerList()

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
        <BannerCreateButton onSaved={refetch} />
      </div>

      {isLoading ? (
        <BannerManagementSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <BannerManagementList banners={banners} onSaved={refetch} />
      )}
    </div>
  )
}

export { BannerManagementView }
