import { z } from "zod"

// The exact leaf keys under the "Profile.general.validation" message
// namespace (see messages/*.json) — same "translator-typed" pattern as
// auth-form-schemas.ts's ValidationKey, kept local to this feature per
// CLAUDE.md's code-splitting mandate rather than sharing a generic type.
type ValidationKey =
  | "firstNameRequired"
  | "lastNameRequired"
  | "currentPasswordRequired"
  | "newPasswordRequired"
  | "confirmNewPasswordRequired"
  | "passwordMismatch"
  | "newEmailRequired"
  | "newEmailInvalid"
  | "codeRequired"

type ValidationT = (key: ValidationKey) => string

// RHF+zod schema for the "edit profile" form — mirrors PATCH /profile's
// UpdateProfileRequest (firstName/lastName/birthDate/avatar, all optional on
// the backend), but firstName/lastName are required here for form UX (a
// blank name isn't a sensible "save" — the backend itself never sends an
// empty string, only omits the field entirely for "unchanged"). `birthDate`
// is a plain `YYYY-MM-DD` string from a native `<input type="date">`, empty
// string meaning "not set". `avatar` holds the raw `File` object from a file
// input; validated as `File` here (not by content) since the backend is the
// one that actually validates image type/size.
function createEditProfileFormSchema(t: ValidationT) {
  return z.object({
    firstName: z.string().trim().min(1, t("firstNameRequired")).max(64),
    lastName: z.string().trim().min(1, t("lastNameRequired")).max(64),
    birthDate: z.string().optional(),
    avatar: z.instanceof(File).optional(),
  })
}

type EditProfileFormValues = z.infer<ReturnType<typeof createEditProfileFormSchema>>

// RHF+zod schema for the "change password" form — mirrors
// PATCH /profile/password's ChangePasswordRequest, plus the client-side
// password-match check the backend also enforces.
function createChangePasswordFormSchema(t: ValidationT) {
  return z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      newPassword: z.string().min(1, t("newPasswordRequired")).max(32),
      confirmNewPassword: z.string().min(1, t("confirmNewPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("passwordMismatch"),
      path: ["confirmNewPassword"],
    })
}

type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordFormSchema>>

// RHF+zod schema for step 1 of "change email" — mirrors
// PATCH /profile/email's ChangeEmailRequest.
function createChangeEmailFormSchema(t: ValidationT) {
  return z.object({
    currentPassword: z.string().min(1, t("currentPasswordRequired")),
    newEmail: z.string().trim().min(1, t("newEmailRequired")).email(t("newEmailInvalid")),
  })
}

type ChangeEmailFormValues = z.infer<ReturnType<typeof createChangeEmailFormSchema>>

// RHF+zod schema for step 2 of "change email" — the 6-digit OTP, mirrors
// POST /profile/email/confirm's ConfirmEmailRequest. Same shape as the
// signup verify-email prompt's schema (auth-form-schemas.ts) but kept
// feature-local per the code-splitting mandate.
function createConfirmEmailFormSchema(t: ValidationT) {
  return z.object({
    code: z.string().length(6, t("codeRequired")),
  })
}

type ConfirmEmailFormValues = z.infer<ReturnType<typeof createConfirmEmailFormSchema>>

export {
  createChangeEmailFormSchema,
  createChangePasswordFormSchema,
  createConfirmEmailFormSchema,
  createEditProfileFormSchema,
}
export type {
  ChangeEmailFormValues,
  ChangePasswordFormValues,
  ConfirmEmailFormValues,
  EditProfileFormValues,
}
