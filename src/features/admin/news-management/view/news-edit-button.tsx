"use client"

import { PencilIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { NewsAdminItem } from "@/features/admin/news-management/model/news-management-schemas"

// Same next/dynamic(ssr:false)-loaded dialog as news-create-button.tsx, this
// time opened in edit mode via `newsId`.
const NewsFormDialog = dynamic(
  () => import("@/features/admin/news-management/view/news-form-dialog").then((mod) => mod.NewsFormDialog),
  { ssr: false }
)

interface NewsEditButtonProps {
  item: NewsAdminItem
  onSaved: () => void
}

function NewsEditButton({ item, onSaved }: NewsEditButtonProps) {
  const t = useTranslations("Admin.newsManagement")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" size="icon-sm" aria-label={t("edit")} onClick={() => setOpen(true)}>
        <PencilIcon className="size-4" />
      </Button>
      <NewsFormDialog open={open} onOpenChange={setOpen} newsId={item.id} onSaved={onSaved} />
    </>
  )
}

export { NewsEditButton }
