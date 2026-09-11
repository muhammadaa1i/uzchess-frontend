import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  useCreateBookMutation,
  useGetAdminBookAuthorsQuery,
  useGetAdminBookCategoriesQuery,
  useGetAdminBookDifficultiesQuery,
  useGetAdminBookLanguagesQuery,
  useUpdateBookMutation,
} from "@/features/admin/book-editor/model/book-editor-api"
import { getBookEditorErrorMessage } from "@/features/admin/book-editor/model/book-editor-error"
import {
  createBookEditorFormSchema,
  type BookEditorFormValues,
} from "@/features/admin/book-editor/model/book-editor-form-schema"
import type { BookEditorItem } from "@/features/admin/book-editor/model/book-editor-schemas"

interface UseBookEditorFormOptions {
  book?: BookEditorItem
  open: boolean
  onSaved: () => void
}

const EMPTY_VALUES: BookEditorFormValues = {
  title: "",
  price: "",
  discountPrice: "",
  description: "",
  pageCount: "",
  publishedYear: "",
  categoryId: "",
  difficultyId: "",
  languageId: "",
  authorIds: [],
}

// Drives the create/edit book form shared by the sibling book-list slice's
// book-create-button.tsx and book-edit-button.tsx (which open this feature's
// book-editor-dialog.tsx) — POST /books/create when `book` is absent, PATCH
// /books/update/{id} when present. Same "no separate by-id fetch" shape as
// use-banner-form.ts: GET /books/read's list response already carries every
// field the edit form needs (see book-editor-schemas.ts), so the row's own
// item is passed straight in. The four reference-list queries (category/
// author/difficulty/language) back this form's read-only reference selects/
// checkboxes only — this feature does not add CRUD for those sub-catalogs
// themselves (see CLAUDE.md's admin-panel deferred backlog); gated on `open`
// for the same reason use-news-form.ts gates its by-id fetch on `open` — the
// dialog stays mounted in each row for the row's whole lifetime, only its
// visibility toggles, so without the gate every row would fire all four
// reference-list requests as soon as the page loads instead of on demand.
function useBookEditorForm({ book, open, onSaved }: UseBookEditorFormOptions) {
  const t = useTranslations("Admin.bookManagement")
  const tValidation = useTranslations("Admin.bookManagement.validation")
  const isEditMode = book !== undefined

  const { data: categories, isFetching: isCategoriesLoading } = useGetAdminBookCategoriesQuery(
    undefined,
    { skip: !open }
  )
  const { data: authors, isFetching: isAuthorsLoading } = useGetAdminBookAuthorsQuery(undefined, {
    skip: !open,
  })
  const { data: difficulties, isFetching: isDifficultiesLoading } =
    useGetAdminBookDifficultiesQuery(undefined, { skip: !open })
  const { data: languages, isFetching: isLanguagesLoading } = useGetAdminBookLanguagesQuery(
    undefined,
    { skip: !open }
  )

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation()
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)

  const form = useForm<BookEditorFormValues>({
    resolver: zodResolver(createBookEditorFormSchema(tValidation)),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      book
        ? {
            title: book.title,
            price: String(book.price),
            discountPrice:
              book.discountPrice !== null && book.discountPrice !== undefined
                ? String(book.discountPrice)
                : "",
            description: book.description,
            pageCount: String(book.pageCount),
            publishedYear: String(book.publishedYear),
            categoryId: String(book.categoryId),
            difficultyId: String(book.difficultyId),
            languageId: String(book.languageId),
            authorIds: book.authorIds,
          }
        : EMPTY_VALUES
    )
  }, [open, book, form])

  function onImageChange(file: File | undefined) {
    form.setValue("cover", file, { shouldDirty: true })
    setSelectedImageName(file?.name ?? null)
  }

  async function onSubmit(values: BookEditorFormValues) {
    setFormError(null)

    // CreateBookRequest requires `cover` on the backend (`BadRequestException`
    // if missing) — there's no existing "required on create, optional on
    // edit" zod pattern elsewhere in this codebase to reuse, so this is
    // enforced here rather than in book-editor-form-schema.ts.
    if (!isEditMode && !values.cover) {
      setFormError(t("errors.coverRequired"))
      return
    }

    try {
      if (isEditMode) {
        await updateBook({
          id: book.id,
          body: {
            title: values.title,
            price: values.price,
            discountPrice: values.discountPrice ?? "",
            description: values.description,
            pageCount: values.pageCount,
            publishedYear: values.publishedYear,
            categoryId: values.categoryId,
            difficultyId: values.difficultyId,
            languageId: values.languageId,
            authorIds: values.authorIds,
            cover: values.cover,
          },
        }).unwrap()
      } else {
        await createBook({
          title: values.title,
          price: values.price,
          discountPrice: values.discountPrice ? values.discountPrice : undefined,
          description: values.description,
          pageCount: values.pageCount,
          publishedYear: values.publishedYear,
          categoryId: values.categoryId,
          difficultyId: values.difficultyId,
          languageId: values.languageId,
          authorIds: values.authorIds,
          cover: values.cover,
        }).unwrap()
        form.reset(EMPTY_VALUES)
      }
      setSelectedImageName(null)
      onSaved()
    } catch (error) {
      setFormError(getBookEditorErrorMessage(error, t("errors.generic")))
    }
  }

  return {
    isEditMode,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isCreating || isUpdating,
    isReferenceDataLoading:
      isCategoriesLoading || isAuthorsLoading || isDifficultiesLoading || isLanguagesLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl: book?.cover ?? null,
    categories: categories ?? [],
    authors: authors ?? [],
    difficulties: difficulties ?? [],
    languages: languages ?? [],
  }
}

export { useBookEditorForm }
