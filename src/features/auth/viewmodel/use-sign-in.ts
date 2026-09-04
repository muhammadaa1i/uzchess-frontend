import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useLoginMutation } from "@/features/auth/model/auth-api"
import { getAuthErrorMessage } from "@/features/auth/model/auth-error"
import {
  createSignInFormSchema,
  type SignInFormValues,
} from "@/features/auth/model/auth-form-schemas"
import { authModalClosed, credentialsSet } from "@/features/auth/model/auth-slice"
import { useAppDispatch } from "@/lib/store/hooks"

function useSignIn() {
  const dispatch = useAppDispatch()
  const t = useTranslations("Auth.errors")
  const tValidation = useTranslations("Auth.validation")
  const [login, { isLoading }] = useLoginMutation()
  const [formError, setFormError] = useState<string | null>(null)

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
      setFormError(getAuthErrorMessage(error, t("invalidCredentials")))
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    formError,
  }
}

export { useSignIn }
