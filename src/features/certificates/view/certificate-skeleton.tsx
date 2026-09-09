import { Skeleton } from "@/components/ui/skeleton"

function CertificateSkeleton() {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-8">
      <Skeleton className="aspect-video w-full rounded-xl" />
    </div>
  )
}

export { CertificateSkeleton }
