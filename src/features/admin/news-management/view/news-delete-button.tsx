"use client"

import { Trash2Icon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { NewsAdminItem } from "@/features/admin/news-management/model/news-management-schemas"
import { useDeleteNews } from "@/features/admin/news-management/viewmodel/use-delete-news"

// The Dialog's content (per CLAUDE.md's next/dynamic guidance for anything
// not visible on initial render) is loaded via next/dynamic(ssr:false) —
// only this trigger button stays in the always-loaded row, same split as
// ProfileLogoutButton/profile-logout-dialog.tsx.
const NewsDeleteDialog = dynamic(
  () => import("@/features/admin/news-management/view/news-delete-dialog").then((mod) => mod.NewsDeleteDialog),
  { ssr: false }
)

interface NewsDeleteButtonProps {
  item: NewsAdminItem
  onSaved: () => void
}

function NewsDeleteButton({ item, onSaved }: NewsDeleteButtonProps) {
  const t = useTranslations("Admin.newsManagement")
  const { open, setOpen, confirmDelete, isLoading } = useDeleteNews({
    newsId: item.id,
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
      <NewsDeleteDialog
        title={item.title}
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </>
  )
}

export { NewsDeleteButton }
