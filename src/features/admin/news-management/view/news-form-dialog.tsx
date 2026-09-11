"use client"

import { useTranslations } from "next-intl"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { NewsManagementForm } from "@/features/admin/news-management/view/news-management-form"
import { useNewsForm } from "@/features/admin/news-management/viewmodel/use-news-form"

interface NewsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newsId?: number
  onSaved: () => void
}

// Shared create/edit Dialog — news-create-button.tsx opens it with no
// `newsId` (POST /news/create), news-edit-button.tsx opens it with one
// (PATCH /news/update/{id}), same "one dialog, two triggers" reuse as
// CLAUDE.md asked for. Loaded via next/dynamic (ssr:false) from both
// triggers and only ever mounted while `open` is true — see
// news-create-button.tsx/news-edit-button.tsx.
function NewsFormDialog({ open, onOpenChange, newsId, onSaved }: NewsFormDialogProps) {
  const t = useTranslations("Admin.newsManagement.form")
  const {
    isEditMode,
    form,
    onSubmit,
    isLoading,
    isDetailLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl,
  } = useNewsForm({
    newsId,
    open,
    onSaved: () => {
      onOpenChange(false)
      onSaved()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <NewsManagementForm
          title={isEditMode ? t("editTitle") : t("createTitle")}
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isDetailLoading={isDetailLoading}
          formError={formError}
          selectedImageName={selectedImageName}
          existingImageUrl={existingImageUrl}
          onImageChange={onImageChange}
          submitLabel={isEditMode ? t("submitEdit") : t("submitCreate")}
        />
      </DialogContent>
    </Dialog>
  )
}

export { NewsFormDialog }
