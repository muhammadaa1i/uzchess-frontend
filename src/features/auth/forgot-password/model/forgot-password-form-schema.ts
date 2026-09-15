import { z } from "zod"

// The exact leaf keys under the "Auth.validation" message namespace (see
// messages/*.json) — matches next-intl's own `useTranslations("Auth.validation")`
// return type structurally, so the real translator (and only the real
// translator) is assignable here, with autocomplete/typo-safety to boot.
// Reuses the same emailRequired/emailInvalid keys sign-in/sign-up already
// use — same field, same validation rule.
type ValidationKey = "emailRequired" | "emailInvalid"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the "forgot password" email step — mirrors
// ForgotPasswordRequest.
function createForgotPasswordFormSchema(t: ValidationT) {
  return z.object({
    email: z.string().trim().min(1, t("emailRequired")).email(t("emailInvalid")),
  })
}

type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>

export { createForgotPasswordFormSchema }
export type { ForgotPasswordFormValues }
