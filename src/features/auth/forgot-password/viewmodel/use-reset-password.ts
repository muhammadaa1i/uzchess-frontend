import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/features/auth/forgot-password/model/forgot-password-api"
import {
  createResetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/forgot-password/model/reset-password-form-schema"
import { getAuthErrorMessage, isThrottled } from "@/features/auth/session/model/auth-error"
import { passwordResetCompleted } from "@/features/auth/session/model/auth-slice"
import {
  THROTTLE_COOLDOWN_SECONDS,
  useThrottleCooldown,
} from "@/features/auth/session/viewmodel/use-throttle-cooldown"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"

// Same 60s window as the backend's per-account forgot-password cooldown —
// same pattern as verify-email's own RESEND_COOLDOWN_SECONDS (see
// verify-email/viewmodel/use-verify-email.ts).
const RESEND_COOLDOWN_SECONDS = 60

// Backend's exact 404 message for "the code cache entry is gone" (already
// confirmed/expired-and-cleared, or never requested) — distinct from
// "Invalid confirmation code"/"User not found", which are just a wrong code.
// See ../model/forgot-password-schemas.ts and the backend's
// reset-password.handler.ts.
const NO_PENDING_RESET_MESSAGE = "No pending reset. Please request a new code."

// Code + new-password step of the "forgot password" flow — reads the email
// captured by the previous step from Redux (`auth.forgotPasswordEmail`, set
// by ../view/forgot-password-form.tsx / ./use-forgot-password.ts's
// `passwordResetCodeSent`) since POST /auth/reset-password is a public,
// unauthenticated endpoint that needs the email as an explicit field.
function useResetPassword() {
  const dispatch = useAppDispatch()
  const t = useTranslations("Auth.errors")
  const tValidation = useTranslations("Auth.validation")
  const email = useAppSelector((state) => state.auth.forgotPasswordEmail)
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()
  const [resend, { isLoading: isResending }] = useForgotPasswordMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [cooldown, setCooldown] = useThrottleCooldown()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordFormSchema(tValidation)),
    defaultValues: { code: "", newPassword: "", confirmNewPassword: "" },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!email) return
    setFormError(null)
    setIsExpired(false)
    try {
      await resetPassword({ email, ...values }).unwrap()
      // A successful reset revokes all of the user's existing refresh
      // tokens server-side — there is no "stay signed in" path here, so
      // this only ever routes back to sign-in (see CLAUDE.md's Auth
      // section), never sets credentials.
      dispatch(passwordResetCompleted())
    } catch (error) {
      const status = (error as { status?: number })?.status
      const message = getAuthErrorMessage(error, "")
      if (status === 410) {
        setIsExpired(true)
        setFormError(t("codeExpired"))
      } else if (status === 404 && message === NO_PENDING_RESET_MESSAGE) {
        setIsExpired(true)
        setFormError(t("noPendingReset"))
      } else if (status === 404) {
        // "Invalid confirmation code" / "User not found" — both surfaced as
        // a plain wrong-code error, never as an account-existence signal.
        setFormError(t("codeInvalid"))
      } else if (status === 400) {
        setFormError(tValidation("passwordMismatch"))
      } else if (isThrottled(error)) {
        setCooldown(THROTTLE_COOLDOWN_SECONDS)
      } else {
        setFormError(getAuthErrorMessage(error, t("generic")))
      }
    }
  }

  async function onResend() {
    if (!email) return
    setFormError(null)
    setIsExpired(false)
    form.setValue("code", "")
    try {
      await resend({ email }).unwrap()
      setCooldown(RESEND_COOLDOWN_SECONDS)
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
    onResend,
    isResetting,
    isResending,
    formError: cooldown > 0 ? t("tooManyRequests", { seconds: cooldown }) : formError,
    isExpired,
    cooldown,
    hasEmail: email !== null,
  }
}

export { useResetPassword }
