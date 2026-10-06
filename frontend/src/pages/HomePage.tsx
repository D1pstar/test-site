import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section, SectionHeader } from '../components/Section'
import ServiceCard from '../components/ServiceCard'
import CTABand from '../components/CTABand'
import { CardSkeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useServices } from '../hooks/useServices'
import { usePageTitle } from '../hooks/usePageTitle'

export default function HomePage() {
  usePageTitle()
  const services = useServices()

  return (
    <main>
      <Section className="pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <div className="glass-subtle inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-300">
            <Sparkles className="size-3.5 text-brand-500 dark:text-brand-400" />
            Studio-quality design and development
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A web presence that does your work{' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
              justice.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg dark:text-ink-400">
            We design and build fast, modern websites that look sharp, read
            clearly, and turn visitors into customers. This page is a live demo
            of what that looks like.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a project
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/services"
              className="glass glass-spec inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/40 px-5 py-2.5 text-sm font-medium text-ink-800 transition-all hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
            >
              What we do
            </Link>
          </div>

          <dl className="glass glass-spec mt-12 grid max-w-2xl grid-cols-3 gap-6 rounded-3xl border border-white/40 bg-white/40 px-6 py-6 dark:border-white/10 dark:bg-white/5">
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-500">Projects</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">120+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-500">Years</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">8</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-500">Avg. rating</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">4.9</dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section className="border-t border-ink-200/60 pt-14 dark:border-ink-800/60">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Services"
            title="What we do"
            description="A focused set of capabilities, done well. Click any card to read more."
          />
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            All services
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10">
          {services.isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}

          {services.isError && (
            <ErrorState
              title="Couldn’t load services"
              message={(services.error as Error).message}
            />
          )}

          {services.data && services.data.length === 0 && (
            <p className="glass glass-spec rounded-3xl border border-white/40 bg-white/50 p-6 text-sm text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-ink-400">
              No services yet.
            </p>
          )}

          {services.data && services.data.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.data.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <div className="pt-16 sm:pt-20">
        <CTABand />
      </div>
    </main>
  )
}