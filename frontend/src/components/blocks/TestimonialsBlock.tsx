import { Quote } from 'lucide-react'
import { Section, SectionHeader } from '../Section'
import Reveal from '../Reveal'
import { safeImage } from '../../lib/links'
import type { BlockPropsMap } from '../../lib/site-types'

const COLS = ['md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3']

export default function TestimonialsBlock({ eyebrow, title, description, items }: BlockPropsMap['testimonials']) {
  return (
    <Section className="border-t border-ink-200/70 dark:border-white/10">
      {title && (
        <Reveal>
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
      )}
      <div className={`grid gap-6 ${COLS[Math.min(Math.max(items.length, 1), 3) - 1]} ${title ? 'mt-12' : ''}`}>
        {items.map((t, i) => {
          const avatar = safeImage(t.avatarUrl)
          const initials = t.name
            .split(' ')
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
          return (
            <Reveal key={`${i}-${t.name}`} delay={i * 100}>
              <figure className="card flex h-full flex-col p-7">
                <Quote className="size-8 text-brand-400" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700 dark:text-ink-300">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {avatar ? (
                    <img src={avatar} alt="" className="size-10 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-sm font-semibold text-white">
                      {initials}
                    </span>
                  )}
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-ink-500">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
