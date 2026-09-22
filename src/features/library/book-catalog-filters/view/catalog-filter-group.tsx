import type { ReactNode } from "react"

interface CatalogFilterGroupProps {
  label: string
  children: ReactNode
}

function CatalogFilterGroup({ label, children }: CatalogFilterGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-brand-secondary-low uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

export { CatalogFilterGroup }
