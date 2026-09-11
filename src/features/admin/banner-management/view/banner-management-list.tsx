"use client"

import { useTranslations } from "next-intl"

import type { BannerAdminItem } from "@/features/admin/banner-management/model/banner-management-schemas"
import { BannerManagementRow } from "@/features/admin/banner-management/view/banner-management-row"

interface BannerManagementListProps {
  banners: BannerAdminItem[]
  onSaved: () => void
}

function BannerManagementList({ banners, onSaved }: BannerManagementListProps) {
  const t = useTranslations("Admin.bannerManagement")

  if (banners.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
        {t("empty")}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden grid-cols-[56px_1fr_120px_auto] gap-3 px-3 text-xs font-medium text-brand-secondary-low sm:grid">
        <span>{t("columns.image")}</span>
        <span>{t("columns.title")}</span>
        <span>{t("columns.status")}</span>
        <span className="text-right">{t("columns.actions")}</span>
      </div>
      {banners.map((item) => (
        <BannerManagementRow key={item.id} item={item} onSaved={onSaved} />
      ))}
    </div>
  )
}

export { BannerManagementList }
