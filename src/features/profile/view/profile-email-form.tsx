"use client"

import { useTranslations } from "next-intl"
import { Controller } from "react-hook-form"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import type { Profile } from "@/features/profile/model/profile-schemas"
import { useChangeEmail } from "@/features/profile/viewmodel/use-change-email"

interface ProfileEmailFormProps {
  profile: Profile
  onConfirmed?: () => void
}

// "Change email" card — the two-step PATCH /profile/email ->
// POST /profile/email/confirm flow (see use-change-email.ts), reusing the
// OTP visual pattern already built for signup's verify-email prompt
// (@/features/auth/view/verify-email-prompt.tsx).
function ProfileEmailForm({ profile, onConfirmed }: ProfileEmailFormProps) {
  const t = useTranslations("Profile.general.email")
  const {
    step,
    pendingEmail,
    requestForm,
    codeForm,
    onRequestSubmit,
    onCodeSubmit,
    onResend,
    cancel,
    isRequesting,
    isConfirming,
    formError,
    successMessage,
    isExpired,
    cooldown,
  } = useChangeEmail(profile, onConfirmed)

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <h2 className="text-base font-medium text-brand-white">{t("title")}</h2>

      {step === "form" ? (
        <form onSubmit={onRequestSubmit} className="flex flex-col gap-4">
          <TextField label={t("currentEmailLabel")} value={profile.email} disabled readOnly />
          <TextField
            label={t("newEmail")}
            autoComplete="email"
            errors={[requestForm.formState.errors.newEmail]}
            {...requestForm.register("newEmail")}
          />
          <TextField
            label={t("currentPassword")}
            variant="password"
            autoComplete="current-password"
            errors={[requestForm.formState.errors.currentPassword]}
            {...requestForm.register("currentPassword")}
          />
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          {successMessage && <p className="text-sm text-brand-green">{successMessage}</p>}
          <Button type="submit" disabled={isRequesting} className="self-start">
            {t("submit")}
          </Button>
        </form>
      ) : (
        <form onSubmit={onCodeSubmit} className="flex flex-col items-start gap-4">
          <p className="text-sm text-brand-secondary-low">
            {t("codeDescription", { email: pendingEmail ?? "" })}
          </p>
          <Controller
            control={codeForm.control}
            name="code"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={Boolean(codeForm.formState.errors.code) || isExpired}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <FieldError errors={[codeForm.formState.errors.code]} />
              </div>
            )}
          />
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          {successMessage && <p className="text-sm text-brand-green">{successMessage}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isConfirming || isExpired}>
              {t("confirmSubmit")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isRequesting || cooldown > 0}
              onClick={onResend}
            >
              {cooldown > 0 ? t("resendCooldown", { seconds: cooldown }) : t("resend")}
            </Button>
            <Button type="button" variant="ghost" onClick={cancel}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export { ProfileEmailForm }
