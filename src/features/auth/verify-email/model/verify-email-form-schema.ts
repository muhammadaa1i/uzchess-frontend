import { z } from "zod"

// The exact leaf keys under the "Auth.validation" message namespace (see
// messages/*.json) — matches next-intl's own `useTranslations("Auth.validation")`
// return type structurally, so the real translator (and only the real
// translator) is assignable here, with autocomplete/typo-safety to boot.
type ValidationKey = "codeRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the 6-digit email verification OTP prompt.
function createVerifyEmailFormSchema(t: ValidationT) {
  return z.object({
    code: z.string().length(6, t("codeRequired")),
  })
}

type VerifyEmailFormValues = z.infer<ReturnType<typeof createVerifyEmailFormSchema>>

export { createVerifyEmailFormSchema }
export type { VerifyEmailFormValues }
