import { z } from "zod"

// The exact leaf keys under the "Contact.validation" message namespace (see
// messages/*.json) — same "translator function typed as an exhaustive key
// union" trick used by auth-form-schemas.ts's ValidationKey, so RHF+zod
// messages can react to the active next-intl locale.
type ValidationKey = "nameRequired" | "emailRequired" | "emailInvalid" | "messageRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the Contact page form, mirroring `POST /contact/create`
// exactly (verified live against the local backend's `/swagger/home-json` —
// `{name, email, message}`, no phone field). There is no phone column on the
// backend's contact-message entity, so the field is intentionally not built
// here, same pattern as dropping phone auth/profile fields elsewhere in this
// codebase.
function createContactFormSchema(t: ValidationT) {
  return z.object({
    name: z.string().trim().min(1, t("nameRequired")).max(64),
    email: z.string().trim().min(1, t("emailRequired")).max(128).email(t("emailInvalid")),
    message: z.string().trim().min(1, t("messageRequired")).max(2000),
  })
}

type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>

export { createContactFormSchema }
export type { ContactFormValues }
