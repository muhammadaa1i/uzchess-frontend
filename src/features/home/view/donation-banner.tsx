import { HeartHandshakeIcon } from "lucide-react"
import { useTranslations } from "next-intl"

// Static, no backend data (no donation endpoint exists) — this is a "soon"
// teaser card, not a functional CTA yet.
function DonationBanner() {
  const t = useTranslations("Home.donation")

  return (
    <section className="relative flex h-[82px] w-full items-center gap-3 rounded-lg bg-dark px-4">
      <span className="flex size-[42px] shrink-0 items-center justify-center rounded-lg bg-dark-2">
        <HeartHandshakeIcon className="size-5 text-brand-blue-light" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm text-[#FCFCFC]">{t("title")}</span>
        <span className="text-sm text-[#6F767E]">{t("subtitle")}</span>
      </div>
      <span className="absolute top-2.5 right-3 rounded bg-brand-blue px-1.5 py-0.5 text-xs text-brand-white">
        {t("badge")}
      </span>
    </section>
  )
}

export { DonationBanner }
