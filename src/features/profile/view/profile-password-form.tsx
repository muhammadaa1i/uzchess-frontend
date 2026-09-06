"use client"

import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { useChangePassword } from "@/features/profile/viewmodel/use-change-password"

// "Change password" card — PATCH /profile/password, the only password-reset
// surface the backend exposes (see CLAUDE.md's Auth section note).
function ProfilePasswordForm() {
  const t = useTranslations("Profile.general.password")
  const { form, onSubmit, isLoading, formError, successMessage } = useChangePassword()

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <h2 className="text-base font-medium text-brand-white">{t("title")}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label={t("currentPassword")}
          variant="password"
          autoComplete="current-password"
          errors={[form.formState.errors.currentPassword]}
          {...form.register("currentPassword")}
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
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {successMessage && <p className="text-sm text-brand-green">{successMessage}</p>}
        <Button type="submit" disabled={isLoading} className="self-start">
          {t("submit")}
        </Button>
      </form>
    </div>
  )
}

export { ProfilePasswordForm }
