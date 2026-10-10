import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../Section'
import ServiceCard from '../ServiceCard'
import Reveal from '../Reveal'
import SmartLink from '../SmartLink'
import ErrorState from '../ErrorState'
import { CardSkeleton } from '../Skeleton'
import { useServices } from '../../hooks/useServices'
import type { BlockPropsMap } from '../../lib/site-types'

export default function ServicesGridBlock(p: BlockPropsMap['services_grid']) {
  const services = useServices()
  const hasHeader = Boolean(p.title)
  const grid =
    p.columns === 4 ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4' : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
  const list = services.data ? (p.limit > 0 ? services.data.slice(0, p.limit) : services.data) : []

  return (
    <Section className={hasHeader ? '' : 'pt-8'}>
      {hasHeader && (
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />
            {p.showLink && p.linkLabel && (
              <SmartLink
                to={p.linkTo}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                {p.linkLabel}
                <ArrowRight className="size-4" />
              </SmartLink>
            )}
          </div>
        </Reveal>
      )}

      <div className={hasHeader ? 'mt-12' : ''}>
        {services.isLoading && (
          <div className={grid}>
            {Array.from({ length: p.columns }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
        {services.isError && (
          <ErrorState title="Couldn’t load services" message={(services.error as Error).message} />
        )}
        {services.data && list.length === 0 && (
          <p className="card p-6 text-sm text-ink-600 dark:text-ink-400">{p.emptyText}</p>
        )}
        {list.length > 0 && (
          <div className={grid}>
            {list.map((s, i) => (
              <Reveal key={s.id} delay={(i % p.columns) * 70}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
