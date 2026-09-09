import type { LucideIcon } from "lucide-react"

interface InfoRowProps {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

function InfoRow({ icon: Icon, label, value, href }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-brand-blue-light" aria-hidden />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-brand-white">{label}</span>
        {href ? (
          <a href={href} className="text-sm text-brand-secondary-low hover:text-brand-white">
            {value}
          </a>
        ) : (
          <span className="text-sm text-brand-secondary-low">{value}</span>
        )}
      </div>
    </div>
  )
}

export { InfoRow }
