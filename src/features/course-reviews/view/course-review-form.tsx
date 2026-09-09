"use client"

import { StarIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FormEvent } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { ReviewFormValues } from "@/features/course-reviews/model/course-review-form-schema"
import { cn } from "@/lib/utils"

interface CourseReviewFormProps {
  form: UseFormReturn<ReviewFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  formError: string | null
  justSubmitted: boolean
}

function CourseReviewForm({ form, onSubmit, isSubmitting, formError, justSubmitted }: CourseReviewFormProps) {
  const t = useTranslations("Courses.reviews")

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4"
    >
      <Controller
        control={form.control}
        name="score"
        render={({ field }) => (
          <Field>
            <FieldLabel>{t("form.scoreLabel")}</FieldLabel>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={String(value)}
                  onClick={() => field.onChange(value)}
                >
                  <StarIcon
                    className={cn(
                      "size-6 text-brand-secondary-low",
                      field.value >= value && "fill-brand-yellow text-brand-yellow"
                    )}
                  />
                </button>
              ))}
            </div>
            <FieldError errors={[form.formState.errors.score]} />
          </Field>
        )}
      />
      <Field>
        <FieldLabel htmlFor="review-comment">{t("form.commentLabel")}</FieldLabel>
        <Textarea
          id="review-comment"
          placeholder={t("form.commentPlaceholder")}
          {...form.register("comment")}
        />
        <FieldError errors={[form.formState.errors.comment]} />
      </Field>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      {justSubmitted && <p className="text-sm text-brand-green">{t("form.success")}</p>}
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {t("form.submit")}
      </Button>
    </form>
  )
}

export { CourseReviewForm }
