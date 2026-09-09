"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

interface CartSignInRequiredProps {
  onSignIn: () => void
}

function CartSignInRequired({ onSignIn }: CartSignInRequiredProps) {
  const t = useTranslations("Cart")

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
        <p className="text-sm text-brand-secondary-low">{t("signInRequired")}</p>
        <Button onClick={onSignIn}>{t("signInCta")}</Button>
      </div>
    </div>
  )
}

export { CartSignInRequired }
