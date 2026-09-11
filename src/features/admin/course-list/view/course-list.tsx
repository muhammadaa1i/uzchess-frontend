"use client"

import { useTranslations } from "next-intl"

import type { CourseAdminItem } from "@/features/admin/course-list/model/course-list-schemas"
import { CourseListRow } from "@/features/admin/course-list/view/course-list-row"

interface CourseListProps {
  courses: CourseAdminItem[]
  onSaved: () => void
}

function CourseList({ courses, onSaved }: CourseListProps) {
  const t = useTranslations("Admin.courseManagement")

  if (courses.length === 0) {
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
        <span>{t("columns.price")}</span>
        <span className="text-right">{t("columns.actions")}</span>
      </div>
      {courses.map((item) => (
        <CourseListRow key={item.id} item={item} onSaved={onSaved} />
      ))}
    </div>
  )
}

export { CourseList }
