"use client"

import { MailIcon, MapPinIcon, PhoneIcon, TrainFrontIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { CONTACT_INFO } from "@/features/contact/model/contact-info"
import { InfoRow } from "@/features/contact/view/info-row"

function ContactInfoCard() {
  const t = useTranslations("Contact")

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5">
      <InfoRow icon={MapPinIcon} label={t("address")} value={t("info.address")} />
      <InfoRow icon={TrainFrontIcon} label={t("nearestMetro")} value={t("info.nearestMetro")} />
      <InfoRow
        icon={MailIcon}
        label={t("email")}
        value={CONTACT_INFO.email}
        href={`mailto:${CONTACT_INFO.email}`}
      />
      <InfoRow
        icon={PhoneIcon}
        label={t("phone")}
        value={CONTACT_INFO.phone}
        href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
      />
      <div className="flex flex-col gap-1 pl-8 text-sm text-brand-secondary-low">
        <span className="text-sm font-medium text-brand-white">{t("workingHours")}</span>
        <span>{t("info.workingHoursWeekdays")}</span>
        <span>{t("info.workingHoursWeekend")}</span>
      </div>
    </div>
  )
}

export { ContactInfoCard }
