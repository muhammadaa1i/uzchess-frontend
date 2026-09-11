"use client"

import { useTranslations } from "next-intl"

import type { NewsAdminItem } from "@/features/admin/news-management/model/news-management-schemas"
import { NewsManagementRow } from "@/features/admin/news-management/view/news-management-row"

interface NewsManagementListProps {
  news: NewsAdminItem[]
  onSaved: () => void
}

function NewsManagementList({ news, onSaved }: NewsManagementListProps) {
  const t = useTranslations("Admin.newsManagement")

  if (news.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
        {t("empty")}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden grid-cols-[56px_1fr_140px_auto] gap-3 px-3 text-xs font-medium text-brand-secondary-low sm:grid">
        <span>{t("columns.image")}</span>
        <span>{t("columns.title")}</span>
        <span>{t("columns.publishedAt")}</span>
        <span className="text-right">{t("columns.actions")}</span>
      </div>
      {news.map((item) => (
        <NewsManagementRow key={item.id} item={item} onSaved={onSaved} />
      ))}
    </div>
  )
}

export { NewsManagementList }
