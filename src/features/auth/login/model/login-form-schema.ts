import { z } from "zod"

// The exact leaf keys under the "Auth.validation" message namespace (see
// messages/*.json) — matches next-intl's own `useTranslations("Auth.validation")`
// return type structurally, so the real translator (and only the real
// translator) is assignable here, with autocomplete/typo-safety to boot.
type ValidationKey = "emailRequired" | "emailInvalid" | "passwordRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the Sign in form — mirrors LoginRequest.
function createSignInFormSchema(t: ValidationT) {
  return z.object({
    email: z.string().trim().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  })
}

type SignInFormValues = z.infer<ReturnType<typeof createSignInFormSchema>>

export { createSignInFormSchema }
export type { SignInFormValues }
