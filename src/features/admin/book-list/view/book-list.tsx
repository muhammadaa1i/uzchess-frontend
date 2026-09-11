"use client"

import { useTranslations } from "next-intl"

import type { BookAdminItem } from "@/features/admin/book-list/model/book-list-schemas"
import { BookListRow } from "@/features/admin/book-list/view/book-list-row"

interface BookListProps {
  books: BookAdminItem[]
  onSaved: () => void
}

function BookList({ books, onSaved }: BookListProps) {
  const t = useTranslations("Admin.bookManagement")

  if (books.length === 0) {
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
      {books.map((item) => (
        <BookListRow key={item.id} item={item} onSaved={onSaved} />
      ))}
    </div>
  )
}

export { BookList }
