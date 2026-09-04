import { z } from "zod"

// The exact leaf keys under the "Auth.validation" message namespace (see
// messages/*.json) — matches next-intl's own `useTranslations("Auth.validation")`
// return type structurally, so the real translator (and only the real
// translator) is assignable here, with autocomplete/typo-safety to boot.
type ValidationKey =
  | "firstNameRequired"
  | "lastNameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "passwordRequired"
  | "confirmPasswordRequired"
  | "passwordMismatch"
  | "termsRequired"
  | "codeRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the Sign up form. Field-level rules mirror the backend's
// RegisterRequest validators exactly (see auth-schemas.ts's
// registerRequestSchema) plus the password-match check the backend also
// enforces (RegisterHandler compares password/confirmPassword itself).
// `acceptTerms` is a client-only gate on the submit button — no backend
// field backs it (see CLAUDE.md's Auth section note) — so it lives only in
// this form schema, not in registerRequestSchema.
//
// Takes a translation function (from `useTranslations("Auth.validation")`)
// rather than baking in a fixed language, since RHF+zod messages don't
// otherwise react to the active next-intl locale.
function createSignUpFormSchema(t: ValidationT) {
  return z
    .object({
      firstName: z.string().trim().min(1, t("firstNameRequired")).max(64),
      lastName: z.string().trim().min(1, t("lastNameRequired")).max(64),
      email: z.string().trim().min(1, t("emailRequired")).max(128).email(t("emailInvalid")),
      password: z.string().min(1, t("passwordRequired")).max(32),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
      acceptTerms: z.literal(true, { error: t("termsRequired") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    })
}

type SignUpFormValues = z.infer<ReturnType<typeof createSignUpFormSchema>>

// RHF+zod schema for the Sign in form — mirrors LoginRequest.
function createSignInFormSchema(t: ValidationT) {
  return z.object({
    email: z.string().trim().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  })
}

type SignInFormValues = z.infer<ReturnType<typeof createSignInFormSchema>>

// RHF+zod schema for the 6-digit email verification OTP prompt.
function createVerifyEmailFormSchema(t: ValidationT) {
  return z.object({
    code: z.string().length(6, t("codeRequired")),
  })
}

type VerifyEmailFormValues = z.infer<ReturnType<typeof createVerifyEmailFormSchema>>

export { createSignUpFormSchema, createSignInFormSchema, createVerifyEmailFormSchema }
export type { SignUpFormValues, SignInFormValues, VerifyEmailFormValues }
