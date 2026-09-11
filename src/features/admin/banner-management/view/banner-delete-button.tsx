"use client"

import { Trash2Icon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { BannerAdminItem } from "@/features/admin/banner-management/model/banner-management-schemas"
import { useDeleteBanner } from "@/features/admin/banner-management/viewmodel/use-delete-banner"

// The Dialog's content (per CLAUDE.md's next/dynamic guidance for anything
// not visible on initial render) is loaded via next/dynamic(ssr:false) —
// only this trigger button stays in the always-loaded row, same split as
// news-delete-button.tsx/NewsDeleteDialog.
const BannerDeleteDialog = dynamic(
  () =>
    import("@/features/admin/banner-management/view/banner-delete-dialog").then(
      (mod) => mod.BannerDeleteDialog
    ),
  { ssr: false }
)

interface BannerDeleteButtonProps {
  item: BannerAdminItem
  onSaved: () => void
}

function BannerDeleteButton({ item, onSaved }: BannerDeleteButtonProps) {
  const t = useTranslations("Admin.bannerManagement")
  const { open, setOpen, confirmDelete, isLoading } = useDeleteBanner({
    bannerId: item.id,
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
      <BannerDeleteDialog
        title={item.title}
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </>
  )
}

export { BannerDeleteButton }
