import type { BlockPropsMap } from '../../lib/site-types'

export default function MarqueeBlock({ label, items }: BlockPropsMap['marquee']) {
  const words = items.map((i) => i.text).filter(Boolean)
  if (words.length === 0) return null

  return (
    <div className="border-y border-ink-200/70 bg-white/50 py-6 dark:border-white/10 dark:bg-white/[0.02]">
      {label && (
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-500">{label}</p>
      )}
      <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="animate-marquee flex w-max gap-12 pr-12">
          {[...words, ...words].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-lg font-semibold tracking-tight text-ink-400 dark:text-ink-500"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
