"use client"

import { Trash2Icon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { BookAdminItem } from "@/features/admin/book-list/model/book-list-schemas"
import { useDeleteBook } from "@/features/admin/book-list/viewmodel/use-delete-book"

// The Dialog's content (per CLAUDE.md's next/dynamic guidance for anything
// not visible on initial render) is loaded via next/dynamic(ssr:false) —
// only this trigger button stays in the always-loaded row, same split as
// news-delete-button.tsx/banner-delete-button.tsx.
const BookDeleteDialog = dynamic(
  () =>
    import("@/features/admin/book-list/view/book-delete-dialog").then(
      (mod) => mod.BookDeleteDialog
    ),
  { ssr: false }
)

interface BookDeleteButtonProps {
  item: BookAdminItem
  onSaved: () => void
}

function BookDeleteButton({ item, onSaved }: BookDeleteButtonProps) {
  const t = useTranslations("Admin.bookManagement")
  const { open, setOpen, confirmDelete, isLoading } = useDeleteBook({
    bookId: item.id,
    onDeleted: onSaved,
  })

  return (
    <>
      <Button
        variant="destructive"
        size="icon-sm"
        aria-label={t("delete")}
        onClick={() => setOpen(true)}
      >
        <Trash2Icon className="size-4" />
      </Button>
      <BookDeleteDialog
        title={item.title}
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </>
  )
}

export { BookDeleteButton }
