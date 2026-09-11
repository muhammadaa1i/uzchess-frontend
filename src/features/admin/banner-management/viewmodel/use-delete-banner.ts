import { useState } from "react"

import { useDeleteBannerMutation } from "@/features/admin/banner-management/model/banner-management-api"

interface UseDeleteBannerOptions {
  bannerId: number
  onDeleted: () => void
}

// Backs each row's delete confirmation — DELETE /banners/delete/{id}. Same
// self-contained trigger+dialog shape as use-delete-news.ts: `open` is this
// one row's own ephemeral UI state, not Redux.
function useDeleteBanner({ bannerId, onDeleted }: UseDeleteBannerOptions) {
  const [deleteBanner, { isLoading }] = useDeleteBannerMutation()
  const [open, setOpen] = useState(false)

  async function confirmDelete() {
    try {
      await deleteBanner(bannerId).unwrap()
      onDeleted()
    } finally {
      setOpen(false)
    }
  }

  return { open, setOpen, confirmDelete, isLoading }
}

export { useDeleteBanner }
