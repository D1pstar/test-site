type Props = {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-ink-200/70 ${className}`}
      aria-hidden
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
      <Skeleton className="size-11 rounded-lg" />
      <Skeleton className="mt-5 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  )
}

export function ProjectSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-3 h-5 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
      </div>
    </div>
  )
}