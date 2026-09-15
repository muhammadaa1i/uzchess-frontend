import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useForgotPasswordMutation } from "@/features/auth/forgot-password/model/forgot-password-api"
import {
  createForgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/forgot-password/model/forgot-password-form-schema"
import { getAuthErrorMessage, isThrottled } from "@/features/auth/session/model/auth-error"
import { passwordResetCodeSent } from "@/features/auth/session/model/auth-slice"
import {
  THROTTLE_COOLDOWN_SECONDS,
  useThrottleCooldown,
} from "@/features/auth/session/viewmodel/use-throttle-cooldown"
import { useAppDispatch } from "@/lib/store/hooks"

// Email step of the "forgot password" flow — see
// ../view/forgot-password-form.tsx and its sibling
// ../view/reset-password-form.tsx / ./use-reset-password.ts for the next
// step.
function useForgotPassword() {
  const dispatch = useAppDispatch()
  const t = useTranslations("Auth.errors")
  const tValidation = useTranslations("Auth.validation")
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useThrottleCooldown()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(createForgotPasswordFormSchema(tValidation)),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormError(null)
    try {
      await forgotPassword(values).unwrap()
      // Always advances on a 200 — the backend returns the same generic
      // message whether or not the account exists, so this response must
      // never be used to tell the user "no account found" (see CLAUDE.md's
      // Auth section).
      dispatch(passwordResetCodeSent(values.email))
    } catch (error) {
      if (isThrottled(error)) {
        setCooldown(THROTTLE_COOLDOWN_SECONDS)
      } else {
        setFormError(getAuthErrorMessage(error, t("generic")))
      }
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    formError: cooldown > 0 ? t("tooManyRequests", { seconds: cooldown }) : formError,
    isDisabled: isLoading || cooldown > 0,
  }
}

export { useForgotPassword }
