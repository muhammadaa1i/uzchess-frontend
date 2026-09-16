"use client"

import { PencilIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { BannerAdminItem } from "@/features/admin/banner-management/model/banner-management-schemas"

// Same next/dynamic(ssr:false)-loaded dialog as banner-create-button.tsx,
// this time opened in edit mode via `banner`.
const BannerFormDialog = dynamic(
  () =>
    import("@/features/admin/banner-management/view/banner-form-dialog").then(
      (mod) => mod.BannerFormDialog
    ),
  { ssr: false }
)

interface BannerEditButtonProps {
  item: BannerAdminItem
  onSaved: () => void
}

function BannerEditButton({ item, onSaved }: BannerEditButtonProps) {
  const t = useTranslations("Admin.bannerManagement")
  const [open, setOpen] = useState(false)
  // See banner-create-button.tsx — defers the dialog's mount (and its
  // next/dynamic chunk fetch) past the initial render of every row, to the
  // row's first actual click.
  const [hasOpened, setHasOpened] = useState(false)

  return (
    <>
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label={t("edit")}
        onClick={() => {
          setHasOpened(true)
          setOpen(true)
        }}
      >
        <PencilIcon className="size-4" />
      </Button>
      {hasOpened && (
        <BannerFormDialog open={open} onOpenChange={setOpen} banner={item} onSaved={onSaved} />
      )}
    </>
  )
}

export { BannerEditButton }
