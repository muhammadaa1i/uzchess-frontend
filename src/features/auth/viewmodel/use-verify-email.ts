import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  useVerifyEmailConfirmMutation,
  useVerifyEmailResendMutation,
} from "@/features/auth/model/auth-api"
import { getAuthErrorMessage } from "@/features/auth/model/auth-error"
import {
  createVerifyEmailFormSchema,
  type VerifyEmailFormValues,
} from "@/features/auth/model/auth-form-schemas"
import { authModalClosed, emailVerified } from "@/features/auth/model/auth-slice"
import { useAppDispatch } from "@/lib/store/hooks"

const RESEND_COOLDOWN_SECONDS = 60

function useVerifyEmail() {
  const dispatch = useAppDispatch()
  const t = useTranslations("Auth.errors")
  const tValidation = useTranslations("Auth.validation")
  const [confirm, { isLoading: isConfirming }] = useVerifyEmailConfirmMutation()
  const [resend, { isLoading: isResending }] = useVerifyEmailResendMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(createVerifyEmailFormSchema(tValidation)),
    defaultValues: { code: "" },
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function onSubmit(values: VerifyEmailFormValues) {
    setFormError(null)
    setIsExpired(false)
    try {
      await confirm(values).unwrap()
      dispatch(emailVerified())
      dispatch(authModalClosed())
    } catch (error) {
      const status = (error as { status?: number })?.status
      // Backend throws a GoneException (410) on an expired code.
      if (status === 410) {
        setIsExpired(true)
        setFormError(t("codeExpired"))
      } else {
        setFormError(getAuthErrorMessage(error, t("codeInvalid")))
      }
    }
  }

  async function onResend() {
    setFormError(null)
    setIsExpired(false)
    form.reset({ code: "" })
    try {
      await resend().unwrap()
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      setFormError(getAuthErrorMessage(error, t("generic")))
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onResend,
    isConfirming,
    isResending,
    formError,
    isExpired,
    cooldown,
  }
}

export { useVerifyEmail }
