"use client"

import { useTranslations } from "next-intl"
import { Controller } from "react-hook-form"

import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useResetPassword } from "@/features/auth/forgot-password/viewmodel/use-reset-password"

// Step 2 of the "forgot password" flow (code + new password) — reached once
// step 1 (forgot-password-form.tsx) has requested a code for an email.
// `hasEmail` guards the (unreachable-through-normal-navigation) case where
// this view renders without that email in Redux — see
// use-reset-password.ts.
function ResetPasswordForm() {
  const t = useTranslations("Auth.resetPassword")
  const {
    form,
    onSubmit,
    onResend,
    isResetting,
    isResending,
    formError,
    isExpired,
    cooldown,
    hasEmail,
  } = useResetPassword()

  if (!hasEmail) return null

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogDescription>{t("description")}</DialogDescription>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-4">
        <Controller
          control={form.control}
          name="code"
          render={({ field }) => (
            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                aria-invalid={Boolean(form.formState.errors.code) || isExpired}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <FieldError errors={[form.formState.errors.code]} />
            </div>
          )}
        />
        <TextField
          label={t("newPassword")}
          variant="password"
          autoComplete="new-password"
          errors={[form.formState.errors.newPassword]}
          {...form.register("newPassword")}
        />
        <TextField
          label={t("confirmNewPassword")}
          variant="password"
          autoComplete="new-password"
          errors={[form.formState.errors.confirmNewPassword]}
          {...form.register("confirmNewPassword")}
        />
        {formError && (
          <p className="text-center text-sm text-destructive">{formError}</p>
        )}
        <Button type="submit" disabled={isResetting || isExpired} className="w-full">
          {t("submit")}
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        disabled={isResending || cooldown > 0}
        onClick={onResend}
      >
        {cooldown > 0 ? t("resendCooldown", { seconds: cooldown }) : t("resend")}
      </Button>
    </div>
  )
}

export { ResetPasswordForm }
