import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { userUpdated } from "@/features/auth/model/auth-slice"
import { useUpdateProfileMutation } from "@/features/profile/model/profile-api"
import { getProfileErrorMessage } from "@/features/profile/model/profile-error"
import {
  createEditProfileFormSchema,
  type EditProfileFormValues,
} from "@/features/profile/model/profile-form-schemas"
import type { Profile } from "@/features/profile/model/profile-schemas"
import { useAppDispatch } from "@/lib/store/hooks"

// Drives the "Personal info" form in the General settings tab. `profile`
// seeds the form's defaults once loaded (see profile-schemas.ts's note on
// `birthDate` being a full ISO datetime — sliced to the `YYYY-MM-DD` a
// native date input expects). On success, dispatches `userUpdated` on the
// global auth slice (imported the same way course-detail-view/site-header
// already import auth-slice actions across the feature boundary — auth's
// session state is the one deliberately shared exception to the
// code-splitting mandate) so SiteHeader's avatar/name reflect the change
// immediately, and calls the caller's `onSaved` to refetch the GET /profile
// cache backing this page's own header.
function useEditProfile(profile: Profile | undefined, onSaved?: () => void) {
  const dispatch = useAppDispatch()
  const t = useTranslations("Profile.general.profile")
  const tValidation = useTranslations("Profile.general.validation")
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(createEditProfileFormSchema(tValidation)),
    defaultValues: { firstName: "", lastName: "", birthDate: "" },
  })

  useEffect(() => {
    if (!profile) return
    form.reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate?.slice(0, 10) ?? "",
    })
  }, [profile, form])

  function onAvatarChange(file: File | undefined) {
    form.setValue("avatar", file, { shouldDirty: true })
    setAvatarPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return file ? URL.createObjectURL(file) : null
    })
  }

  async function onSubmit(values: EditProfileFormValues) {
    setFormError(null)
    setSuccessMessage(null)
    try {
      const updated = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate || undefined,
        avatar: values.avatar,
      }).unwrap()
      dispatch(
        userUpdated({
          id: updated.id,
          email: updated.email,
          firstName: updated.firstName,
          lastName: updated.lastName,
          isEmailVerified: updated.isEmailVerified,
          avatar: updated.avatar,
        })
      )
      setSuccessMessage(t("success"))
      setAvatarPreview(null)
      onSaved?.()
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
    avatarPreview,
    onAvatarChange,
  }
}

export { useEditProfile }
