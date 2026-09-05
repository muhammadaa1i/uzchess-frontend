import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { usePurchaseCourseMutation } from "@/features/courses/model/course-detail-api"
import { getCourseErrorMessage } from "@/features/courses/model/course-error"
import {
  createPurchaseFormSchema,
  type PurchaseFormValues,
} from "@/features/courses/model/course-purchase-form-schema"

type PurchaseStep = "form" | "success" | "fail"

// Only the *within-modal* step ("form" -> "success" | "fail") lives here —
// whether the modal itself is open is owned by the caller (course-detail-view's
// plain `useState`, kept outside the next/dynamic-loaded modal component so
// the always-visible "Buy course" trigger button never waits on the lazy
// chunk — see purchase-modal.tsx).
function useCoursePurchase(courseId: number, onPurchased?: () => void) {
  const t = useTranslations("Courses.purchase")
  const [step, setStep] = useState<PurchaseStep>("form")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [purchase, { isLoading }] = usePurchaseCourseMutation()

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(createPurchaseFormSchema()),
    defaultValues: { provider: "click" },
  })

  async function onSubmit(values: PurchaseFormValues) {
    setErrorMessage(null)
    try {
      await purchase({ courseId, body: values }).unwrap()
      setStep("success")
      onPurchased?.()
    } catch (error) {
      setErrorMessage(getCourseErrorMessage(error, t("errors.generic")))
      setStep("fail")
    }
  }

  return {
    step,
    errorMessage,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    retry: () => setStep("form"),
  }
}

export { useCoursePurchase }
