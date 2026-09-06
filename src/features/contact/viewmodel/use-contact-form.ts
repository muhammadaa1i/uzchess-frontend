import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useCreateContactMutation } from "@/features/contact/model/contact-api"
import { getContactErrorMessage } from "@/features/contact/model/contact-error"
import {
  createContactFormSchema,
  type ContactFormValues,
} from "@/features/contact/model/contact-form-schema"

// Drives the Contact page form via react-hook-form + zod, submitting to the
// live `POST /contact/create` endpoint (verified against the local
// backend's `/swagger/home-json` — CLAUDE.md's snapshot claiming no contact
// endpoint exists anywhere is stale, see the contact feature's tester
// report). `justSent`/`submitError` are plain `useState` rather than Redux
// since they're purely ephemeral view-local feedback for this one form, not
// state anything else in the app reads (same reasoning as Library's
// `useBookRating`/`useBookDetail`).
function useContactForm() {
  const tValidation = useTranslations("Contact.validation")
  const tErrors = useTranslations("Contact.form")
  const [justSent, setJustSent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(createContactFormSchema(tValidation)),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const [createContact, { isLoading: isSubmitting }] = useCreateContactMutation()

  async function onSubmit(values: ContactFormValues) {
    setSubmitError(null)
    setJustSent(false)
    try {
      await createContact(values).unwrap()
      setJustSent(true)
      form.reset()
    } catch (error) {
      setSubmitError(getContactErrorMessage(error, tErrors("error")))
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    justSent,
    submitError,
  }
}

export { useContactForm }
