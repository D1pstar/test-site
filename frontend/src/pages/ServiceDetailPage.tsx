import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Section } from '../components/Section'
import CTABand from '../components/CTABand'
import { Skeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { getIcon } from '../lib/icons'
import { useService, useServices } from '../hooks/useServices'
import { usePageTitle } from '../hooks/usePageTitle'

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
          <Skeleton className="mt-6 h-10 w-2/3" />
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
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="size-4" />
            All services
          </Link>

          {isNotFound ? (
            <div className="mt-8">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Service not found
              </h1>
              <p className="mt-3 text-ink-600">
                We couldn't find a service with that name.
              </p>
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
              >
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
      <Section className="pt-14 sm:pt-20">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" />
          All services
        </Link>

        <div className="mt-8 max-w-3xl">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="size-6" />
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 text-lg text-ink-600">{data.summary}</p>
        </div>

        <div className="mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-ink-700">
          {data.description.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Start a project
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      {others.length > 0 && (
        <Section className="border-t border-ink-200">
          <h2 className="text-lg font-semibold tracking-tight">Other services</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => {
              const OtherIcon = getIcon(s.icon)
              return (
                <Link
                  key={s.id}
                  to={`/services/${s.slug}`}
                  className="group flex flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-md"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <OtherIcon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                    {s.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Section>
      )}

      <div className="border-t border-ink-200 pt-16 sm:pt-20">
        <CTABand />
      </div>
    </main>
  )
}