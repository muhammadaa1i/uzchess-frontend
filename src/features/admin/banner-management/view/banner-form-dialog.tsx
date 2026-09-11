"use client"

import { useTranslations } from "next-intl"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { BannerAdminItem } from "@/features/admin/banner-management/model/banner-management-schemas"
import { BannerManagementForm } from "@/features/admin/banner-management/view/banner-management-form"
import { useBannerForm } from "@/features/admin/banner-management/viewmodel/use-banner-form"

interface BannerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: BannerAdminItem
  onSaved: () => void
}

// Shared create/edit Dialog — banner-create-button.tsx opens it with no
// `banner` (POST /banners/create), banner-edit-button.tsx opens it with one
// (PATCH /banners/update/{id}), same "one dialog, two triggers" reuse as
// news-form-dialog.tsx. Loaded via next/dynamic (ssr:false) from both
// triggers and only ever visible while `open` is true — see
// banner-create-button.tsx/banner-edit-button.tsx.
function BannerFormDialog({ open, onOpenChange, banner, onSaved }: BannerFormDialogProps) {
  const t = useTranslations("Admin.bannerManagement.form")
  const {
    isEditMode,
    form,
    onSubmit,
    isLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl,
  } = useBannerForm({
    banner,
    open,
    onSaved: () => {
      onOpenChange(false)
      onSaved()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <BannerManagementForm
          title={isEditMode ? t("editTitle") : t("createTitle")}
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
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

export { BannerFormDialog }
