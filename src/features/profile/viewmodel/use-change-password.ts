import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useChangePasswordMutation } from "@/features/profile/model/profile-api"
import { getProfileErrorMessage } from "@/features/profile/model/profile-error"
import {
  type ChangePasswordFormValues,
  createChangePasswordFormSchema,
} from "@/features/profile/model/profile-form-schemas"

// Drives the "Change password" form — PATCH /profile/password, the only
// password-reset surface that exists on the backend (see CLAUDE.md's Auth
// section note on the missing forgot-password endpoint).
function useChangePassword() {
  const t = useTranslations("Profile.general.password")
  const tValidation = useTranslations("Profile.general.validation")
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(createChangePasswordFormSchema(tValidation)),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  })

  async function onSubmit(values: ChangePasswordFormValues) {
    setFormError(null)
    setSuccessMessage(null)
    try {
      await changePassword(values).unwrap()
      setSuccessMessage(t("success"))
      form.reset({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
    } catch (error) {
      setFormError(getProfileErrorMessage(error, t("errors.generic")))
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    formError,
    successMessage,
  }
}

export { useChangePassword }
