import { Section } from '../Section'
import Reveal from '../Reveal'
import type { BlockPropsMap } from '../../lib/site-types'

export default function StatsBlock({ items }: BlockPropsMap['stats']) {
  const n = items.length
  if (n === 0) return null
  const cols =
    n === 1 ? 'grid-cols-1' : n === 2 ? 'grid-cols-2' : n === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
  const divide = n < 4 ? 'divide-x divide-ink-200 dark:divide-white/10' : ''

  return (
    <Section className="pb-0 pt-10 sm:pt-12">
      <Reveal>
        <dl className={`card grid ${cols} ${divide}`}>
          {items.map((s, i) => (
            <div
              key={`${i}-${s.label}`}
              className={`px-3 py-7 text-center sm:px-6 sm:py-9 ${
                n === 4
                  ? `${i % 2 === 1 ? 'border-l border-ink-200 dark:border-white/10' : ''} ${
                      i >= 2 ? 'border-t border-ink-200 sm:border-t-0 dark:border-white/10' : ''
                    } ${i === 2 ? 'sm:border-l' : ''}`
                  : ''
              }`}
            >
              <dd className="text-3xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-gradient">{s.value}</span>
              </dd>
              <dt className="mt-2 text-[11px] uppercase tracking-wider text-ink-500 sm:text-xs">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}
