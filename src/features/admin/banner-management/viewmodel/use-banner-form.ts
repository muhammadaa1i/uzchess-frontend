import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/features/admin/banner-management/model/banner-management-api"
import { getBannerManagementErrorMessage } from "@/features/admin/banner-management/model/banner-management-error"
import {
  createBannerFormSchema,
  type BannerFormValues,
} from "@/features/admin/banner-management/model/banner-management-form-schema"
import type { BannerAdminItem } from "@/features/admin/banner-management/model/banner-management-schemas"

interface UseBannerFormOptions {
  banner?: BannerAdminItem
  open: boolean
  onSaved: () => void
}

const EMPTY_VALUES: BannerFormValues = {
  title: "",
  subtitle: "",
  linkUrl: "",
  badgeText: "",
  isActive: true,
}

// Drives the create/edit banner form shared by banner-create-button.tsx and
// banner-edit-button.tsx's dialogs (see banner-form-dialog.tsx) — POST
// /banners/create when `banner` is absent, PATCH /banners/update/{id} when
// present. Unlike use-news-form.ts, there's no separate by-id fetch to
// prefill the edit form: GET /banners/read's list response already carries
// every field the edit form needs (see banner-management-schemas.ts), so the
// row's own item is passed straight in instead. The reset effect is still
// gated on `open` (not just on `banner` changing) — the dialog is always
// mounted in each row (see BannerEditButton), only its visibility toggles,
// so gating on `open` re-syncs the form to the row's latest saved values
// (discarding any unsaved edits) every time the dialog is reopened, rather
// than only once on mount. No dedicated Redux slice — same reasoning as
// use-news-form.ts, all state here is this one form's own submission status.
function useBannerForm({ banner, open, onSaved }: UseBannerFormOptions) {
  const t = useTranslations("Admin.bannerManagement")
  const tValidation = useTranslations("Admin.bannerManagement.validation")
  const isEditMode = banner !== undefined

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation()
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(createBannerFormSchema(tValidation)),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      banner
        ? {
            title: banner.title,
            subtitle: banner.subtitle ?? "",
            linkUrl: banner.linkUrl ?? "",
            badgeText: banner.badgeText ?? "",
            isActive: banner.isActive,
          }
        : EMPTY_VALUES
    )
  }, [open, banner, form])

  function onImageChange(file: File | undefined) {
    form.setValue("image", file, { shouldDirty: true })
    setSelectedImageName(file?.name ?? null)
  }

  async function onSubmit(values: BannerFormValues) {
    setFormError(null)
    try {
      if (isEditMode) {
        await updateBanner({
          id: banner.id,
          body: {
            title: values.title,
            subtitle: values.subtitle,
            linkUrl: values.linkUrl,
            badgeText: values.badgeText,
            isActive: values.isActive,
            image: values.image,
          },
        }).unwrap()
      } else {
        await createBanner({
          title: values.title,
          subtitle: values.subtitle,
          linkUrl: values.linkUrl,
          badgeText: values.badgeText,
          isActive: values.isActive,
          image: values.image,
        }).unwrap()
      }
      setSelectedImageName(null)
      onSaved()
    } catch (error) {
      setFormError(getBannerManagementErrorMessage(error, t("errors.generic")))
    }
  }

  return {
    isEditMode,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isCreating || isUpdating,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl: banner?.imageUrl ?? null,
  }
}

export { useBannerForm }
