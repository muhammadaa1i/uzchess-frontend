import { useState } from "react"

import { useDeleteNewsMutation } from "@/features/admin/news-management/model/news-management-api"

interface UseDeleteNewsOptions {
  newsId: number
  onDeleted: () => void
}

// Backs each row's delete confirmation — DELETE /news/delete/{id}. Same
// self-contained trigger+dialog shape as profile's use-logout.ts: `open` is
// this one row's own ephemeral UI state, not Redux.
function useDeleteNews({ newsId, onDeleted }: UseDeleteNewsOptions) {
  const [deleteNews, { isLoading }] = useDeleteNewsMutation()
  const [open, setOpen] = useState(false)

  async function confirmDelete() {
    try {
      await deleteNews(newsId).unwrap()
      onDeleted()
    } finally {
      setOpen(false)
    }
  }

  return { open, setOpen, confirmDelete, isLoading }
}

export { useDeleteNews }
