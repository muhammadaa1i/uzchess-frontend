"use client"

import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { useAuthModal } from "@/features/auth/viewmodel/use-auth-modal"
import { useSignIn } from "@/features/auth/viewmodel/use-sign-in"

function SignInForm() {
  const t = useTranslations("Auth.signIn")
  const { open } = useAuthModal()
  const { form, onSubmit, isLoading, formError } = useSignIn()

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogDescription className="sr-only">{t("title")}</DialogDescription>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <TextField
          label={t("email")}
          autoComplete="email"
          errors={[form.formState.errors.email]}
          {...form.register("email")}
        />
        <TextField
          label={t("password")}
          variant="password"
          autoComplete="current-password"
          errors={[form.formState.errors.password]}
          {...form.register("password")}
        />
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        <Button type="submit" disabled={isLoading} className="mt-2">
          {t("submit")}
        </Button>
      </form>
      <p className="text-center text-sm text-brand-secondary-low">
        {t("switchPrompt")}{" "}
        <button
          type="button"
          className="font-medium text-brand-blue-light hover:underline"
          onClick={() => open("sign-up")}
        >
          {t("switchAction")}
        </button>
      </p>
    </div>
  )
}

export { SignInForm }
