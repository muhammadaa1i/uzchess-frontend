import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useRegisterMutation } from "@/features/auth/model/auth-api"
import { getAuthErrorMessage, isThrottled } from "@/features/auth/model/auth-error"
import {
  createSignUpFormSchema,
  type SignUpFormValues,
} from "@/features/auth/model/auth-form-schemas"
import { authModalOpened, credentialsSet } from "@/features/auth/model/auth-slice"
import {
  THROTTLE_COOLDOWN_SECONDS,
  useThrottleCooldown,
} from "@/features/auth/viewmodel/use-throttle-cooldown"
import { useAppDispatch } from "@/lib/store/hooks"

function useSignUp() {
  const dispatch = useAppDispatch()
  const t = useTranslations("Auth.errors")
  const tValidation = useTranslations("Auth.validation")
  const [register, { isLoading }] = useRegisterMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useThrottleCooldown()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(createSignUpFormSchema(tValidation)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      // Runtime default is unchecked; cast because zod's `z.literal(true)`
      // narrows the type to exactly `true` (the only value that passes
      // validation), which doesn't include `false` for an initial value.
      acceptTerms: false as unknown as true,
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    setFormError(null)
    try {
      const response = await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap()

      dispatch(
        credentialsSet({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response,
        })
      )
      // Registration logs the user in immediately — the non-blocking email
      // verification prompt comes next, it doesn't gate anything.
      dispatch(authModalOpened("verify-email"))
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

export { useSignUp }
