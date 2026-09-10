interface CheckoutSummaryRowProps {
  label: string
  value: string
}

function CheckoutSummaryRow({ label, value }: CheckoutSummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-brand-secondary-low">
      <span>{label}</span>
      <span className="text-brand-white">{value}</span>
    </div>
  )
}

export { CheckoutSummaryRow }
