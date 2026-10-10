import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Section } from '../components/Section'
import CTABand from '../components/CTABand'
import Reveal from '../components/Reveal'
import { Skeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import ServiceCard from '../components/ServiceCard'
import { getIcon } from '../lib/icons'
import { useService, useServices } from '../hooks/useServices'
import { usePageTitle } from '../hooks/usePageTitle'

const BackLink = () => (
  <Link
    to="/services"
    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-300"
  >
    <ArrowLeft className="size-4" />
    All services
  </Link>
)

const INCLUDED = [
  'A dedicated senior designer and engineer',
  'Weekly progress demos and open communication',
  'Accessible, responsive, performance-tuned output',
  'A support window after launch',
]

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const service = useService(slug)
  const allServices = useServices()

  usePageTitle(service.data?.title ?? 'Service')

  const others = (allServices.data ?? []).filter((s) => s.slug !== slug).slice(0, 3)

  if (service.isLoading) {
    return (
      <main>
        <Section className="pt-14 sm:pt-20">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-8 size-14" />
          <Skeleton className="mt-6 h-12 w-2/3" />
          <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
        </Section>
      </main>
    )
  }

  if (service.isError) {
    const status = (service.error as { status?: number }).status
    const isNotFound = status === 404

    return (
      <main>
        <Section className="pt-14 sm:pt-20">
          <BackLink />

          {isNotFound ? (
            <div className="mt-8">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Service not found
              </h1>
              <p className="mt-3 text-ink-600 dark:text-ink-400">
                We couldn't find a service with that name.
              </p>
              <Link to="/services" className="btn-primary mt-6 !px-6 !py-3">
                Browse all services
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <ErrorState
                title="Couldn’t load this service"
                message={(service.error as Error).message}
              />
            </div>
          )}
        </Section>
      </main>
    )
  }

  const data = service.data!
  const Icon = getIcon(data.icon)

  return (
    <main>
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="grid-bg absolute inset-0 -z-10 h-[30rem]" />
        <Section className="pb-8 pt-12 sm:pt-20">
          <BackLink />

          <div className="animate-fade-up mt-8 max-w-3xl">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-900/30">
              <Icon className="size-7" />
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
              {data.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600 dark:text-ink-400">
              {data.summary}
            </p>
          </div>
        </Section>
      </div>

      <Section className="pt-8 sm:pt-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="card p-8 sm:p-10">
              <div className="space-y-5 text-base leading-relaxed text-ink-700 dark:text-ink-300">
                {data.description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <aside className="card sticky top-24 p-7">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-500">
                What’s included
              </h2>
              <ul className="mt-5 space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-700 dark:text-ink-300">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary mt-7 w-full !py-3.5">
                Start a project
                <ArrowRight className="size-4" />
              </Link>
            </aside>
          </Reveal>
        </div>
      </Section>

      {others.length > 0 && (
        <Section className="border-t border-ink-200/70 dark:border-white/10">
          <h2 className="text-2xl font-semibold tracking-tight">Other services</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <div className="pt-4 sm:pt-8">
        <Reveal>
          <CTABand />
        </Reveal>
      </div>
    </main>
  )
}
