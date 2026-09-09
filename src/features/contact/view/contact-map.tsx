"use client"

import { useTranslations } from "next-intl"

import { CONTACT_INFO } from "@/features/contact/model/contact-info"

function ContactMap() {
  const t = useTranslations("Contact")

  return (
    <div className="overflow-hidden rounded-xl border border-[#1F272A]">
      <iframe
        title={t("mapTitle")}
        src={CONTACT_INFO.mapEmbedSrc}
        className="h-[280px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export { ContactMap }
