type Props = { className?: string }

export function Skeleton({ className = '' }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ background: 'color-mix(in srgb, currentColor 7%, transparent)' }}
      aria-hidden
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, currentColor 9%, transparent), transparent)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
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