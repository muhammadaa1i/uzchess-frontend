"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface BookCoverFieldProps {
  selectedImageName: string | null
  existingImageUrl: string | null
  onImageChange: (file: File | undefined) => void
}

// The cover-upload field — split out of book-editor-form.tsx per
// CLAUDE.md/feedback's one-component-per-file convention. Mirrors news/
// banner's file-input pattern (no live blob-URL preview, just the selected
// file's name — same next/image limitation noted there). Uses its own
// `useId()` rather than accepting one as a prop since nothing else in the
// form needs to reference this specific input's id.
function BookCoverField({ selectedImageName, existingImageUrl, onImageChange }: BookCoverFieldProps) {
  const t = useTranslations("Admin.bookManagement.form")
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

export { BookCoverField }
