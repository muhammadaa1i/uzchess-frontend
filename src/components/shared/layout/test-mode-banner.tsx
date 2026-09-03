"use client"

import { XIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const MESSAGE =
  "Sayt test rejimida ishlamoqda / Сайт работает в тестовом режиме / The site is running in test mode"

function TestModeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative flex items-center justify-center gap-2 bg-brand-yellow px-10 py-2 text-center text-xs font-medium text-[#111315]">
      <span>{MESSAGE}</span>
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute right-2 text-[#111315] hover:bg-black/10"
        aria-label="Yopish"
        onClick={() => setDismissed(true)}
      >
        <XIcon />
      </Button>
    </div>
  )
}

export { TestModeBanner }
