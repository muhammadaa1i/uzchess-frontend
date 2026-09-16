"use client"

import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"

// The Dialog's content (react-hook-form + zod + the mutation) is loaded via
// next/dynamic (ssr:false) and only mounted while open — see
// news-form-dialog.tsx — so its JS isn't part of this page's initial bundle.
// The "Add news" trigger button itself stays directly in this
// always-loaded view tree, per CLAUDE.md's "don't next/dynamic small,
// always-visible UI" guidance.
const NewsFormDialog = dynamic(
  () => import("@/features/admin/news-management/view/news-form-dialog").then((mod) => mod.NewsFormDialog),
  { ssr: false }
)

interface NewsCreateButtonProps {
  onSaved: () => void
}

// Header "Add news" trigger — the create-mode entry point into
// news-form-dialog.tsx (edit mode's entry point is news-edit-button.tsx,
// same shared dialog/form per CLAUDE.md's "reuse the same form component"
// note).
function NewsCreateButton({ onSaved }: NewsCreateButtonProps) {
  const t = useTranslations("Admin.newsManagement")
  const [open, setOpen] = useState(false)
  // `next/dynamic` starts fetching its chunk as soon as the component is
  // rendered, not when `open` becomes true — gate the mount on a
  // one-way-latched flag so the dialog only ever loads once the user
  // actually clicks, instead of on every page load.
  const [hasOpened, setHasOpened] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setHasOpened(true)
          setOpen(true)
        }}
      >
        <PlusIcon />
        {t("createCta")}
      </Button>
      {hasOpened && <NewsFormDialog open={open} onOpenChange={setOpen} onSaved={onSaved} />}
    </>
  )
}

export { NewsCreateButton }
