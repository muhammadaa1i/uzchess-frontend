"use client"

import { Share2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"

interface NewsShareButtonProps {
  title: string
}

// Uses the Web Share API where available (mobile browsers), falling back to
// copying the URL to the clipboard with a brief "copied" confirmation —
// `copied` is purely ephemeral view-local UI state (CLAUDE.md's
// dropdown-open/close-style exception to the Redux Toolkit mandate).
function NewsShareButton({ title }: NewsShareButtonProps) {
  const t = useTranslations("News.share")
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
      return
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" className="text-brand-blue-light" onClick={handleShare}>
      <Share2Icon />
      {copied ? t("copied") : t("label")}
    </Button>
  )
}

export { NewsShareButton }
