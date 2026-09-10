import { CheckoutView } from "@/features/commerce/checkout/view/checkout-view"

interface CheckoutPageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function Checkout({ searchParams }: CheckoutPageProps) {
  const { code } = await searchParams

  return <CheckoutView couponCode={code} />
}
