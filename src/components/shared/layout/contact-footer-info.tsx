import { MailIcon, PhoneIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/lib/i18n/navigation"

// Short/footer variant of the Contact page (CLAUDE.md section 7's "short/
// footer variant" bullet), rendered globally by SiteFooter. Email/phone are
// duplicated here rather than imported from
// `src/features/contact/model/contact-info.ts` — same reasoning as
// news-schemas.ts duplicating home's news schema: SiteFooter is a
// cross-cutting shared component reachable from every route, not the
// contact feature's own route, so it shouldn't pull the feature's model
// file into every page's bundle just for two static strings. Values here
// are the same placeholders as the full page pending real copy from
// product/design.
const FOOTER_CONTACT_INFO = {
  email: "info@uzchess.uz",
  phone: "+998 71 200 00 00",
} as const

function ContactFooterInfo() {
  const t = useTranslations("Footer")

  return (
    <div className="flex flex-col items-center gap-2 text-sm text-brand-white">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={`mailto:${FOOTER_CONTACT_INFO.email}`}
          className="flex items-center gap-1.5 hover:text-brand-white/80"
        >
          <MailIcon className="size-4" aria-hidden />
          {FOOTER_CONTACT_INFO.email}
        </a>
        <a
          href={`tel:${FOOTER_CONTACT_INFO.phone.replace(/\s+/g, "")}`}
          className="flex items-center gap-1.5 hover:text-brand-white/80"
        >
          <PhoneIcon className="size-4" aria-hidden />
          {FOOTER_CONTACT_INFO.phone}
        </a>
      </div>
      <Link href="/contact" className="text-brand-blue-light hover:underline">
        {t("contactCta")}
      </Link>
    </div>
  )
}

export { ContactFooterInfo }
