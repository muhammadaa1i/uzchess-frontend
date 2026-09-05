import { z } from "zod"

import { purchaseProviderSchema } from "@/features/courses/model/course-schemas"

// RHF+zod schema for the purchase modal's payment-provider picker. One
// field, but still routed through react-hook-form + zod rather than plain
// `useState` per CLAUDE.md's forms mandate ("react-hook-form + zod ...
// always, never uncontrolled/manual form state") — this is a real submitted
// form (POST /courses/{id}/purchase's body), not view-local UI state. The
// radio group always defaults to a pre-selected provider (see
// use-course-purchase.ts), so there's no "nothing selected" state to guard
// against beyond the enum itself.
function createPurchaseFormSchema() {
  return z.object({ provider: purchaseProviderSchema })
}

type PurchaseFormValues = z.infer<ReturnType<typeof createPurchaseFormSchema>>

export { createPurchaseFormSchema }
export type { PurchaseFormValues }
