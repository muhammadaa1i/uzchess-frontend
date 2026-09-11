"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface CourseCoverFieldProps {
  selectedImageName: string | null
  existingImageUrl: string | null
  onImageChange: (file: File | undefined) => void
}

// The cover-upload field — split out of course-editor-form.tsx per
// CLAUDE.md/feedback's one-component-per-file convention, same pattern as
// the sibling Books domain's book-cover-field.tsx. No live blob-URL
// preview, just the selected file's name — same next/image limitation noted
// there.
function CourseCoverField({
  selectedImageName,
  existingImageUrl,
  onImageChange,
}: CourseCoverFieldProps) {
  const t = useTranslations("Admin.courseManagement.form")
  const coverInputId = useId()

  return (
    <Field>
      <FieldLabel htmlFor={coverInputId}>{t("coverLabel")}</FieldLabel>
      {existingImageUrl && !selectedImageName && (
        <div className="relative h-28 w-full overflow-hidden rounded-lg bg-dark-2">
          <Image src={existingImageUrl} alt="" fill className="object-cover" />
        </div>
      )}
      <Input
        id={coverInputId}
        type="file"
        accept="image/*"
        onChange={(event) => onImageChange(event.target.files?.[0])}
      />
      <p className="text-xs text-brand-secondary-low">
        {selectedImageName ? t("coverSelected", { name: selectedImageName }) : t("coverHint")}
      </p>
    </Field>
  )
}

export { CourseCoverField }
