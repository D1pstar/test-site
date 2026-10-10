import type { BlockPropsMap } from '../../lib/site-types'

// The strip scrolls by exactly one "half" (-50%), then loops. For that to look
// endless, one half must be wider than the screen, so short lists are repeated.
const MIN_ITEMS_PER_HALF = 40

export default function MarqueeBlock({ label, items }: BlockPropsMap['marquee']) {
  const words = items.map((i) => i.text).filter(Boolean)
  if (words.length === 0) return null

  const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_HALF / words.length))
  const half = Array.from({ length: repeats }, () => words).flat()

  const item = 'text-lg font-semibold tracking-tight text-ink-400 dark:text-ink-500'

  return (
    <div className="border-y border-ink-200/70 bg-white/50 py-6 dark:border-white/10 dark:bg-white/[0.02]">
      {label && (
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-500">{label}</p>
      )}
      <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        {/* With "reduce motion" the animation is off, so show the words as a centred, wrapping list. */}
        <div style={{ animationDuration: `${Math.round(half.length * 4.2)}s` }} className="animate-marquee flex w-max gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-2 motion-reduce:pr-0">
          {half.map((t, i) => (
            <span key={`a-${i}`} className={`${item} ${i >= words.length ? 'motion-reduce:hidden' : ''}`}>
              {t}
            </span>
          ))}
          {half.map((t, i) => (
            <span key={`b-${i}`} aria-hidden="true" className={`${item} motion-reduce:hidden`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}