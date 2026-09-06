import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useLoginMutation } from "@/features/auth/model/auth-api"
import { getAuthErrorMessage, isThrottled } from "@/features/auth/model/auth-error"
import {
  createSignInFormSchema,
  type SignInFormValues,
} from "@/features/auth/model/auth-form-schemas"
import { authModalClosed, credentialsSet } from "@/features/auth/model/auth-slice"
import {
  THROTTLE_COOLDOWN_SECONDS,
  useThrottleCooldown,
} from "@/features/auth/viewmodel/use-throttle-cooldown"
import { useAppDispatch } from "@/lib/store/hooks"

function useSignIn() {
  const dispatch = useAppDispatch()
  const t = useTranslations("Auth.errors")
  const tValidation = useTranslations("Auth.validation")
  const [login, { isLoading }] = useLoginMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useThrottleCooldown()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(createSignInFormSchema(tValidation)),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: SignInFormValues) {
    setFormError(null)
    try {
      const response = await login(values).unwrap()
      dispatch(credentialsSet(response))
      dispatch(authModalClosed())
    } catch (error) {
      if (isThrottled(error)) {
        setCooldown(THROTTLE_COOLDOWN_SECONDS)
      } else {
        setFormError(getAuthErrorMessage(error, t("invalidCredentials")))
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

export { useSignIn }
