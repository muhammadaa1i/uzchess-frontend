interface CartSummaryRowProps {
  label: string
  value: string
}

function CartSummaryRow({ label, value }: CartSummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-brand-secondary-low">
      <span>{label}</span>
      <span className="text-brand-white">{value}</span>
    </div>
  )
}

export { CartSummaryRow }
