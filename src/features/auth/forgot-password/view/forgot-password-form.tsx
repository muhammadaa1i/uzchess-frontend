"use client"

import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { useForgotPassword } from "@/features/auth/forgot-password/viewmodel/use-forgot-password"
import { useAuthModal } from "@/features/auth/session/viewmodel/use-auth-modal"

// Step 1 of the "forgot password" flow (email step) — reached from
// sign-in-form.tsx's "Forgot password?" link. On submit, advances the modal
// to `reset-password` (see use-forgot-password.ts's `passwordResetCodeSent`).
function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword")
  const { open } = useAuthModal()
  const { form, onSubmit, isDisabled, formError } = useForgotPassword()

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogDescription>{t("description")}</DialogDescription>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label={t("email")}
          autoComplete="email"
          errors={[form.formState.errors.email]}
          {...form.register("email")}
        />
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        <Button type="submit" disabled={isDisabled} className="mt-2">
          {t("submit")}
        </Button>
      </form>
      <button
        type="button"
        className="text-center text-sm text-brand-secondary-low hover:underline"
        onClick={() => open("sign-in")}
      >
        {t("backToSignIn")}
      </button>
    </div>
  )
}

export { ForgotPasswordForm }
