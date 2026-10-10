type Props = {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-ink-900/[0.06] dark:bg-white/[0.06] ${className}`}
      aria-hidden
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-7">
      <Skeleton className="size-12 rounded-2xl" />
      <Skeleton className="mt-6 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  )
}
