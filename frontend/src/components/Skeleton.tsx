type Props = {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-ink-900/5 backdrop-blur-sm dark:bg-white/5 ${className}`}
      aria-hidden
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass glass-spec rounded-3xl border border-white/40 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
      <Skeleton className="size-11 rounded-2xl" />
      <Skeleton className="mt-5 h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  )
}