"use client"

import { CameraIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useId } from "react"

import { TextField } from "@/components/shared/text-field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Profile } from "@/features/profile/model/profile-schemas"
import { useEditProfile } from "@/features/profile/viewmodel/use-edit-profile"

interface ProfileEditFormProps {
  profile: Profile
  onSaved?: () => void
}

// "Personal info" card in the General settings tab — PATCH /profile
// (multipart/form-data), see use-edit-profile.ts. The avatar preview uses a
// blob: object URL (see use-edit-profile.ts's onAvatarChange), which
// next/image can't render — rendered through the shadcn Avatar/AvatarImage
// primitive instead, matching the same exception SiteHeader's own avatar
// already uses for user-uploaded images.
function ProfileEditForm({ profile, onSaved }: ProfileEditFormProps) {
  const t = useTranslations("Profile.general.profile")
  const tHeader = useTranslations("Profile.header")
  const avatarInputId = useId()
  const { form, onSubmit, isLoading, formError, successMessage, avatarPreview, onAvatarChange } =
    useEditProfile(profile, onSaved)
  const name = `${profile.firstName} ${profile.lastName}`

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <h2 className="text-base font-medium text-brand-white">{t("title")}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field orientation="horizontal">
          <div className="relative">
            <Avatar size="lg">
              <AvatarImage src={avatarPreview ?? profile.avatar ?? undefined} alt={name} />
              <AvatarFallback>{profile.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <label
              htmlFor={avatarInputId}
              aria-label={tHeader("changeAvatarAria")}
              className="absolute -right-1 -bottom-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <CameraIcon className="size-3" />
            </label>
            <input
              id={avatarInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onAvatarChange(event.target.files?.[0])}
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        <Field>
          <FieldLabel htmlFor="birthDate">{t("birthDate")}</FieldLabel>
          <Input id="birthDate" type="date" {...form.register("birthDate")} />
        </Field>

        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {successMessage && <p className="text-sm text-brand-green">{successMessage}</p>}

        <Button type="submit" disabled={isLoading} className="self-start">
          {t("submit")}
        </Button>
      </form>
    </div>
  )
}

export { ProfileEditForm }
