"use client"

import { useTranslations } from "next-intl"

import { ContactForm } from "@/features/contact/view/contact-form"
import { ContactInfoCard } from "@/features/contact/view/contact-info-card"
import { ContactMap } from "@/features/contact/view/contact-map"
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
          <ContactMap />
          <ContactInfoCard />
        </div>

        <ContactForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          justSent={justSent}
          submitError={submitError}
        />
      </div>
    </div>
  )
}

export { ContactView }
