import { ErrorState } from "@/components/shared/error/error-state"

interface CertificateErrorProps {
  onRetry: () => void
}

function CertificateError({ onRetry }: CertificateErrorProps) {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3 px-4 py-16 text-center">
      <ErrorState onRetry={onRetry} />
    </div>
  )
}

export { CertificateError }
