"use client"

import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"

// The Dialog's content (react-hook-form + zod + the mutation) is loaded via
// next/dynamic (ssr:false) and code-split from the initial bundle — see
// banner-form-dialog.tsx — same pattern as news-create-button.tsx. The "Add
// banner" trigger button itself stays directly in this always-loaded view
// tree, per CLAUDE.md's "don't next/dynamic small, always-visible UI"
// guidance.
const BannerFormDialog = dynamic(
  () =>
    import("@/features/admin/banner-management/view/banner-form-dialog").then(
      (mod) => mod.BannerFormDialog
    ),
  { ssr: false }
)

interface BannerCreateButtonProps {
  onSaved: () => void
}

// Header "Add banner" trigger — the create-mode entry point into
// banner-form-dialog.tsx (edit mode's entry point is banner-edit-button.tsx,
// same shared dialog/form per CLAUDE.md's "reuse the same form component"
// note).
function BannerCreateButton({ onSaved }: BannerCreateButtonProps) {
  const t = useTranslations("Admin.bannerManagement")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        {t("createCta")}
      </Button>
      <BannerFormDialog open={open} onOpenChange={setOpen} onSaved={onSaved} />
    </>
  )
}

export { BannerCreateButton }
