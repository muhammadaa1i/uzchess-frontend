"use client"

import { useTranslations } from "next-intl"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuthModal } from "@/features/auth/viewmodel/use-auth-modal"
import { useVerifyEmail } from "@/features/auth/viewmodel/use-verify-email"

function VerifyEmailPrompt() {
  const t = useTranslations("Auth.verifyEmail")
  const { close } = useAuthModal()
  const {
    form,
    onSubmit,
    onResend,
    isConfirming,
    isResending,
    formError,
    isExpired,
    cooldown,
  } = useVerifyEmail()

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
        {formError && (
          <p className="text-center text-sm text-destructive">{formError}</p>
        )}
        <Button type="submit" disabled={isConfirming || isExpired} className="w-full">
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
      <button
        type="button"
        className="text-center text-sm text-brand-secondary-low hover:underline"
        onClick={close}
      >
        {t("skip")}
      </button>
    </div>
  )
}

export { VerifyEmailPrompt }
