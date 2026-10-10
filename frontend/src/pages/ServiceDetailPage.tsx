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
    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
    style={{ color: 'var(--site-muted)' }}
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
        <Section className="pt-20 sm:pt-28">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-8 size-14" />
          <Skeleton className="mt-6 h-14 w-2/3" />
          <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
        </Section>
      </main>
    )
  }

  if (service.isError) {
    const status = (service.error as { status?: number }).status
    const isNotFound = status === 404
    return (
      <main>
        <Section className="pt-20 sm:pt-28">
          <BackLink />
          {isNotFound ? (
            <div className="mt-8">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--site-text)' }}>
                Service not found
              </h1>
              <p className="mt-3" style={{ color: 'var(--site-muted)' }}>
                We couldn't find a service with that name.
              </p>
              <Link to="/services" className="btn-primary mt-6">Browse all services</Link>
            </div>
          ) : (
            <div className="mt-8">
              <ErrorState title="Couldn’t load this service" message={(service.error as Error).message} />
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
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="grid-bg absolute inset-0 h-[32rem]" style={{ color: 'var(--site-text)' }} />
          <div
            className="absolute inset-x-0 top-0 mx-auto h-[28rem] max-w-4xl rounded-full opacity-60 blur-3xl animate-pulse-glow"
            style={{ background: 'radial-gradient(50% 50% at 40% 40%, var(--site-glow), transparent 70%)' }}
          />
        </div>

        <Section className="pb-10 pt-16 sm:pt-24">
          <BackLink />
          <div className="animate-fade-up mt-8 max-w-3xl">
            <span
              className="inline-flex size-14 items-center justify-center rounded-2xl text-white"
              style={{
                background: 'var(--site-gradient)',
                boxShadow: '0 14px 30px -12px var(--site-glow), inset 0 1px 0 0 rgb(255 255 255 / 0.35)',
              }}
            >
              <Icon className="size-7" />
            </span>
            <h1
              className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]"
              style={{ color: 'var(--site-text)' }}
            >
              {data.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--site-muted)' }}>
              {data.summary}
            </p>
          </div>
        </Section>
      </div>

      <Section className="pt-8 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="card p-8 sm:p-10">
              <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--site-text)', opacity: 0.88 }}>
                {data.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85]' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <aside className="glass glass-spec sticky top-24 rounded-3xl p-7">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--site-muted)' }}>
                What's included
              </h2>
              <ul className="mt-5 space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--site-text)' }}>
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0" style={{ color: 'var(--site-primary)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary mt-7 w-full">
                Start a project
                <ArrowRight className="size-4" />
              </Link>
            </aside>
          </Reveal>
        </div>
      </Section>

      {others.length > 0 && (
        <div className="border-t" style={{ borderColor: 'var(--site-border)' }}>
          <Section>
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>Other services</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </Section>
        </div>
      )}

      <div className="pt-4 sm:pt-8">
        <Reveal>
          <CTABand />
        </Reveal>
      </div>
    </main>
  )
}