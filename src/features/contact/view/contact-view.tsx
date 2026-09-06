"use client"

import { MailIcon, MapPinIcon, PhoneIcon, TrainFrontIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { CONTACT_INFO } from "@/features/contact/model/contact-info"
import { useContactForm } from "@/features/contact/viewmodel/use-contact-form"

// Full Contact ("Bog'lanish") page — CLAUDE.md section 7: map, hours, email,
// phone, nearest metro, contact form. The form submits to the live
// `POST /contact/create` endpoint (`{name, email, message}` — no phone
// field on the backend's contact-message entity, so the form doesn't
// collect one either).
function ContactView() {
  const t = useTranslations("Contact")
  const { form, onSubmit, isSubmitting, justSent, submitError } = useContactForm()

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-xl border border-[#1F272A]">
            <iframe
              title={t("mapTitle")}
              src={CONTACT_INFO.mapEmbedSrc}
              className="h-[280px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5">
            <InfoRow icon={MapPinIcon} label={t("address")} value={CONTACT_INFO.address} />
            <InfoRow icon={TrainFrontIcon} label={t("nearestMetro")} value={CONTACT_INFO.nearestMetro} />
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
              <span>{CONTACT_INFO.workingHours.weekdays}</span>
              <span>{CONTACT_INFO.workingHours.weekend}</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5"
        >
          <TextField
            label={t("form.name")}
            autoComplete="name"
            errors={[form.formState.errors.name]}
            {...form.register("name")}
          />
          <TextField
            label={t("form.email")}
            autoComplete="email"
            errors={[form.formState.errors.email]}
            {...form.register("email")}
          />
          <Field>
            <FieldLabel htmlFor="contact-message">{t("form.message")}</FieldLabel>
            <Textarea
              id="contact-message"
              placeholder={t("form.messagePlaceholder")}
              rows={5}
              {...form.register("message")}
            />
            <FieldError errors={[form.formState.errors.message]} />
          </Field>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? t("form.sending") : t("form.submit")}
          </Button>
          {submitError ? <p className="text-sm text-brand-red">{submitError}</p> : null}
          {justSent ? (
            <p className="text-sm text-brand-green">{t("form.success")}</p>
          ) : null}
        </form>
      </div>
    </div>
  )
}

interface InfoRowProps {
  icon: typeof MapPinIcon
  label: string
  value: string
  href?: string
}

function InfoRow({ icon: Icon, label, value, href }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-brand-blue-light" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-brand-white">{label}</span>
        {href ? (
          <a href={href} className="text-sm text-brand-secondary-low hover:text-brand-white">
            {value}
          </a>
        ) : (
          <span className="text-sm text-brand-secondary-low">{value}</span>
        )}
      </div>
    </div>
  )
}

export { ContactView }
