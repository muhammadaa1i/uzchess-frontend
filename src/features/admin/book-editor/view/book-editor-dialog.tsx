"use client"

import { useTranslations } from "next-intl"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { BookEditorItem } from "@/features/admin/book-editor/model/book-editor-schemas"
import { BookEditorForm } from "@/features/admin/book-editor/view/book-editor-form"
import { useBookEditorForm } from "@/features/admin/book-editor/viewmodel/use-book-editor-form"

interface BookEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book?: BookEditorItem
  onSaved: () => void
}

// Shared create/edit Dialog — the sibling book-list slice's
// book-create-button.tsx opens it with no `book` (POST /books/create),
// book-edit-button.tsx opens it with one (PATCH /books/update/{id}), same
// "one dialog, two triggers" reuse as news-form-dialog.tsx/banner-form-dialog.tsx.
// Loaded via next/dynamic (ssr:false) from both triggers and only ever
// mounted while `open` is true — see book-list's book-create-button.tsx/
// book-edit-button.tsx.
function BookEditorDialog({ open, onOpenChange, book, onSaved }: BookEditorDialogProps) {
  const t = useTranslations("Admin.bookManagement.form")
  const {
    isEditMode,
    form,
    onSubmit,
    isLoading,
    isReferenceDataLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl,
    categories,
    authors,
    difficulties,
    languages,
  } = useBookEditorForm({
    book,
    open,
    onSaved: () => {
      onOpenChange(false)
      onSaved()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <BookEditorForm
          title={isEditMode ? t("editTitle") : t("createTitle")}
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isReferenceDataLoading={isReferenceDataLoading}
          formError={formError}
          selectedImageName={selectedImageName}
          existingImageUrl={existingImageUrl}
          onImageChange={onImageChange}
          submitLabel={isEditMode ? t("submitEdit") : t("submitCreate")}
          categories={categories}
          authors={authors}
          difficulties={difficulties}
          languages={languages}
        />
      </DialogContent>
    </Dialog>
  )
}

export { BookEditorDialog }
