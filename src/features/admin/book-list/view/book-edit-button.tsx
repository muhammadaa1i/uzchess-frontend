"use client"

import { PencilIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { BookAdminItem } from "@/features/admin/book-list/model/book-list-schemas"

// Same next/dynamic(ssr:false)-loaded dialog as book-create-button.tsx (owned
// by the sibling book-editor slice), this time opened in edit mode via
// `book`. `BookAdminItem` (this slice's own model) and book-editor's
// `BookEditorItem` are structurally identical duplicates of the same backend
// shape (see book-list-schemas.ts's comment) — passing one where the other is
// expected relies on that structural match, not a shared import.
const BookEditorDialog = dynamic(
  () =>
    import("@/features/admin/book-editor/view/book-editor-dialog").then(
      (mod) => mod.BookEditorDialog
    ),
  { ssr: false }
)

interface BookEditButtonProps {
  item: BookAdminItem
  onSaved: () => void
}

function BookEditButton({ item, onSaved }: BookEditButtonProps) {
  const t = useTranslations("Admin.bookManagement")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" size="icon-sm" aria-label={t("edit")} onClick={() => setOpen(true)}>
        <PencilIcon className="size-4" />
      </Button>
      <BookEditorDialog open={open} onOpenChange={setOpen} book={item} onSaved={onSaved} />
    </>
  )
}

export { BookEditButton }
