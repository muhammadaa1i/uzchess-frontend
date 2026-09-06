"use client"

import { SearchIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"

// The search panel itself (input + debounced queries + results list) is
// genuinely heavy, conditionally-rendered UI — loaded via next/dynamic
// (ssr:false), same pattern as courses' PurchaseModal, so its JS isn't part
// of every page's initial bundle just because the header (rendered on every
// route) holds the trigger button. The button stays directly in this
// always-loaded component per CLAUDE.md's "don't next/dynamic small,
// always-visible UI" guidance.
const GlobalSearchDialog = dynamic(
  () => import("@/features/search/view/global-search-dialog").then((mod) => mod.GlobalSearchDialog),
  { ssr: false }
)

// Rendered from both the mobile and desktop blocks of SiteHeader — each
// instance owns its own open state, which is fine since only one of the two
// blocks is ever visible at a given viewport width (see the `lg:hidden` /
// `lg:flex` split in site-header.tsx).
function GlobalSearchTrigger() {
  const t = useTranslations("Header")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("search")}
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>
      {open && <GlobalSearchDialog open={open} onOpenChange={setOpen} />}
    </>
  )
}

export { GlobalSearchTrigger }
