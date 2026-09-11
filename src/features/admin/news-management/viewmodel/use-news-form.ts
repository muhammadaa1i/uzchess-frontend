import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  useCreateNewsMutation,
  useGetAdminNewsByIdQuery,
  useUpdateNewsMutation,
} from "@/features/admin/news-management/model/news-management-api"
import { getNewsManagementErrorMessage } from "@/features/admin/news-management/model/news-management-error"
import {
  createNewsFormSchema,
  type NewsFormValues,
} from "@/features/admin/news-management/model/news-management-form-schema"

interface UseNewsFormOptions {
  newsId?: number
  open: boolean
  onSaved: () => void
}

// Drives the create/edit news form shared by news-create-button.tsx and
// news-edit-button.tsx's dialogs (see news-form-dialog.tsx) — POST
// /news/create when `newsId` is absent, PATCH /news/update/{id} when
// present. Edit mode fetches GET /news/read/{id} (this feature's own
// `getAdminNewsById`, not the public news feature's) purely to prefill
// `content`/`title`/`excerpt`/`publishedAt`, since the list response that
// opened this dialog doesn't carry `content`. That fetch is also gated on
// `open`, not just on `newsId` being defined — the Dialog component (and
// this hook alongside it) stays mounted in each row for the row's whole
// lifetime (see NewsEditButton), it's only the Dialog's visibility that
// toggles, so without the `open` check every row would fire its own
// GET /news/read/{id} as soon as the page loads instead of on demand. No
// dedicated Redux slice — same reasoning as use-assign-role.ts, all state
// here is this one form's own submission status.
function useNewsForm({ newsId, open, onSaved }: UseNewsFormOptions) {
  const t = useTranslations("Admin.newsManagement")
  const tValidation = useTranslations("Admin.newsManagement.validation")
  const isEditMode = newsId !== undefined

  const { data: existing, isFetching: isDetailLoading } = useGetAdminNewsByIdQuery(
    newsId as number,
    { skip: !isEditMode || !open }
  )
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(createNewsFormSchema(tValidation)),
    defaultValues: { title: "", excerpt: "", content: "", publishedAt: "" },
  })

  useEffect(() => {
    if (!existing) return
    form.reset({
      title: existing.title,
      excerpt: existing.excerpt,
      content: existing.content,
      publishedAt: existing.publishedAt.slice(0, 10),
    })
  }, [existing, form])

  function onImageChange(file: File | undefined) {
    form.setValue("image", file, { shouldDirty: true })
    setSelectedImageName(file?.name ?? null)
  }

  async function onSubmit(values: NewsFormValues) {
    setFormError(null)
    try {
      if (isEditMode) {
        await updateNews({
          id: newsId,
          body: {
            title: values.title,
            excerpt: values.excerpt,
            content: values.content,
            publishedAt: values.publishedAt,
            image: values.image,
          },
        }).unwrap()
      } else {
        await createNews({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          publishedAt: values.publishedAt,
          image: values.image,
        }).unwrap()
        form.reset({ title: "", excerpt: "", content: "", publishedAt: "" })
      }
      setSelectedImageName(null)
      onSaved()
    } catch (error) {
      setFormError(getNewsManagementErrorMessage(error, t("errors.generic")))
    }
  }

  return {
    isEditMode,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isCreating || isUpdating,
    isDetailLoading: isEditMode && isDetailLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl: existing?.imageUrl ?? null,
  }
}

export { useNewsForm }
