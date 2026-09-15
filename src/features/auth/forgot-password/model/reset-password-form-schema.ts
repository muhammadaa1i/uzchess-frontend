import { z } from "zod"

// The exact leaf keys under the "Auth.validation" message namespace (see
// messages/*.json) — matches next-intl's own `useTranslations("Auth.validation")`
// return type structurally, so the real translator (and only the real
// translator) is assignable here, with autocomplete/typo-safety to boot.
// Reuses verify-email's codeRequired and sign-up's password/confirm-password
// keys — same fields/rules, no new copy needed.
type ValidationKey =
  | "codeRequired"
  | "passwordRequired"
  | "confirmPasswordRequired"
  | "passwordMismatch"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the "reset password" code + new-password step — mirrors
// ResetPasswordRequest (minus `email`, which comes from Redux — see
// viewmodel/use-reset-password.ts — not from this form).
function createResetPasswordFormSchema(t: ValidationT) {
  return z
    .object({
      code: z.string().length(6, t("codeRequired")),
      newPassword: z.string().min(1, t("passwordRequired")).max(32),
      confirmNewPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("passwordMismatch"),
      path: ["confirmNewPassword"],
    })
}

type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordFormSchema>>

export { createResetPasswordFormSchema }
export type { ResetPasswordFormValues }
