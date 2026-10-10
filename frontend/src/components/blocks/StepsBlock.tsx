import { Section, SectionHeader } from '../Section'
import Reveal from '../Reveal'
import { getIcon } from '../../lib/icons'
import type { BlockPropsMap } from '../../lib/site-types'

export default function StepsBlock({ eyebrow, title, description, align, items }: BlockPropsMap['steps']) {
  const n = items.length
  const cols =
    n <= 1 ? 'md:grid-cols-1' : n === 2 ? 'md:grid-cols-2' : n === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'

  return (
    <Section className="border-t border-ink-200/70 dark:border-white/10">
      {title && (
        <Reveal>
          <SectionHeader align={align} eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
      )}
      <div className={`relative grid gap-6 ${cols} ${title ? 'mt-14' : ''}`}>
        {items.map((s, i) => {
          const Icon = getIcon(s.icon || 'Sparkles')
          return (
            <Reveal key={`${i}-${s.title}`} delay={i * 100}>
              <div className="card h-full p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-5xl font-semibold tracking-tighter text-ink-200 dark:text-white/10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{s.body}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
