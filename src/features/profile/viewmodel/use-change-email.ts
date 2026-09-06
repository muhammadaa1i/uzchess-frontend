import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { userUpdated } from "@/features/auth/model/auth-slice"
import {
  useChangeEmailMutation,
  useConfirmEmailMutation,
} from "@/features/profile/model/profile-api"
import { getProfileErrorMessage } from "@/features/profile/model/profile-error"
import {
  type ChangeEmailFormValues,
  type ConfirmEmailFormValues,
  createChangeEmailFormSchema,
  createConfirmEmailFormSchema,
} from "@/features/profile/model/profile-form-schemas"
import type { Profile } from "@/features/profile/model/profile-schemas"
import { useAppDispatch } from "@/lib/store/hooks"

const RESEND_COOLDOWN_SECONDS = 60

type ChangeEmailStep = "form" | "code"

// Drives the two-step "Change email" flow: PATCH /profile/email (sends a
// 6-digit code to the new address) then POST /profile/email/confirm
// (finalizes it) — reusing the OTP visual pattern already built for
// signup's verify-email prompt (see @/features/auth/viewmodel/use-verify-email.ts)
// but a separate endpoint/cache, per CLAUDE.md's Profile section. No
// dedicated resend endpoint exists for this flow (unlike signup's
// /profile/verify-email/resend) — resending just re-submits the same
// PATCH /profile/email request, which is what triggers a new code.
function useChangeEmail(profile: Profile | undefined, onConfirmed?: () => void) {
  const dispatch = useAppDispatch()
  const t = useTranslations("Profile.general.email")
  const tValidation = useTranslations("Profile.general.validation")
  const [changeEmail, { isLoading: isRequesting }] = useChangeEmailMutation()
  const [confirmEmail, { isLoading: isConfirming }] = useConfirmEmailMutation()

  const [step, setStep] = useState<ChangeEmailStep>("form")
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const requestForm = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(createChangeEmailFormSchema(tValidation)),
    defaultValues: { currentPassword: "", newEmail: "" },
  })
  const codeForm = useForm<ConfirmEmailFormValues>({
    resolver: zodResolver(createConfirmEmailFormSchema(tValidation)),
    defaultValues: { code: "" },
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function onRequestSubmit(values: ChangeEmailFormValues) {
    setFormError(null)
    setSuccessMessage(null)
    try {
      const result = await changeEmail(values).unwrap()
      setPendingEmail(result.email)
      setStep("code")
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      setFormError(getProfileErrorMessage(error, t("errors.generic")))
    }
  }

  async function onCodeSubmit(values: ConfirmEmailFormValues) {
    setFormError(null)
    setIsExpired(false)
    try {
      const result = await confirmEmail(values).unwrap()
      if (profile) {
        dispatch(
          userUpdated({
            id: profile.id,
            email: result.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            isEmailVerified: profile.isEmailVerified,
            avatar: profile.avatar,
          })
        )
      }
      setSuccessMessage(t("success"))
      setStep("form")
      setPendingEmail(null)
      requestForm.reset({ currentPassword: "", newEmail: "" })
      codeForm.reset({ code: "" })
      onConfirmed?.()
    } catch (error) {
      // Backend throws a GoneException (410) on an expired code, same as
      // signup's verify-email confirm.
      const status = (error as { status?: number })?.status
      if (status === 410) {
        setIsExpired(true)
        setFormError(t("errors.codeExpired"))
      } else {
        setFormError(getProfileErrorMessage(error, t("errors.generic")))
      }
    }
  }

  async function onResend() {
    setFormError(null)
    setIsExpired(false)
    codeForm.reset({ code: "" })
    try {
      await changeEmail(requestForm.getValues()).unwrap()
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      setFormError(getProfileErrorMessage(error, t("errors.generic")))
    }
  }

  function cancel() {
    setStep("form")
    setFormError(null)
    setIsExpired(false)
    setPendingEmail(null)
    codeForm.reset({ code: "" })
  }

  return {
    step,
    pendingEmail,
    requestForm,
    codeForm,
    onRequestSubmit: requestForm.handleSubmit(onRequestSubmit),
    onCodeSubmit: codeForm.handleSubmit(onCodeSubmit),
    onResend,
    cancel,
    isRequesting,
    isConfirming,
    formError,
    successMessage,
    isExpired,
    cooldown,
  }
}

export { useChangeEmail }
