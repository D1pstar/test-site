import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../Section'
import Reveal from '../Reveal'
import SmartLink from '../SmartLink'
import { getIcon } from '../../lib/icons'
import type { BlockPropsMap } from '../../lib/site-types'

const COLS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const

export default function FeaturesBlock({ eyebrow, title, description, columns, cta, items }: BlockPropsMap['features']) {
  return (
    <Section className="border-t border-ink-200/70 dark:border-white/10">
      {title && (
        <Reveal>
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
      )}
      <div className={`grid gap-6 ${COLS[columns]} ${title ? 'mt-12' : ''}`}>
        {items.map((f, i) => {
          const Icon = f.icon ? getIcon(f.icon) : null
          return (
            <Reveal key={`${i}-${f.title}`} delay={(i % columns) * 90}>
              {Icon ? (
                <div className="card h-full p-7">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-900/25">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{f.body}</p>
                </div>
              ) : (
                <div className="card card-hover h-full p-8">
                  <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{f.body}</p>
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
      {cta.label && (
        <div className="mt-12">
          <SmartLink to={cta.to} className="btn-primary !px-6 !py-3.5">
            {cta.label}
            <ArrowRight className="size-4" />
          </SmartLink>
        </div>
      )}
    </Section>
  )
}
