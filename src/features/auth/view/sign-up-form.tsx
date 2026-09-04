"use client"

import { useTranslations } from "next-intl"
import { Controller } from "react-hook-form"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useAuthModal } from "@/features/auth/viewmodel/use-auth-modal"
import { useSignUp } from "@/features/auth/viewmodel/use-sign-up"

function SignUpForm() {
  const t = useTranslations("Auth.signUp")
  const { open } = useAuthModal()
  const { form, onSubmit, isLoading, formError } = useSignUp()

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogDescription className="sr-only">{t("title")}</DialogDescription>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={t("firstName")}
            autoComplete="given-name"
            errors={[form.formState.errors.firstName]}
            {...form.register("firstName")}
          />
          <TextField
            label={t("lastName")}
            autoComplete="family-name"
            errors={[form.formState.errors.lastName]}
            {...form.register("lastName")}
          />
        </div>
        <TextField
          label={t("email")}
          autoComplete="email"
          errors={[form.formState.errors.email]}
          {...form.register("email")}
        />
        <TextField
          label={t("password")}
          variant="password"
          autoComplete="new-password"
          errors={[form.formState.errors.password]}
          {...form.register("password")}
        />
        <TextField
          label={t("confirmPassword")}
          variant="password"
          autoComplete="new-password"
          errors={[form.formState.errors.confirmPassword]}
          {...form.register("confirmPassword")}
        />
        <Controller
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id="accept-terms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              <FieldLabel htmlFor="accept-terms" className="text-sm font-normal">
                {t("terms")}
              </FieldLabel>
              <FieldError errors={[form.formState.errors.acceptTerms]} />
            </Field>
          )}
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
          onClick={() => open("sign-in")}
        >
          {t("switchAction")}
        </button>
      </p>
    </div>
  )
}

export { SignUpForm }
