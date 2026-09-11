import { useState } from "react"

import { useDeleteBookMutation } from "@/features/admin/book-list/model/book-list-api"

interface UseDeleteBookOptions {
  bookId: number
  onDeleted: () => void
}

// Backs each row's delete confirmation — DELETE /books/delete/{id}. Same
// self-contained trigger+dialog shape as use-delete-news.ts/use-delete-banner.ts:
// `open` is this one row's own ephemeral UI state, not Redux.
function useDeleteBook({ bookId, onDeleted }: UseDeleteBookOptions) {
  const [deleteBook, { isLoading }] = useDeleteBookMutation()
  const [open, setOpen] = useState(false)

  async function confirmDelete() {
    try {
      await deleteBook(bookId).unwrap()
      onDeleted()
    } finally {
      setOpen(false)
    }
  }

  return { open, setOpen, confirmDelete, isLoading }
}

export { useDeleteBook }
