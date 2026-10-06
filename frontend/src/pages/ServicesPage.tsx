import { Section, SectionHeader } from '../components/Section'
import ServiceCard from '../components/ServiceCard'
import CTABand from '../components/CTABand'
import { CardSkeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useServices } from '../hooks/useServices'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ServicesPage() {
  usePageTitle('Services')
  const services = useServices()

  return (
    <main>
      <Section className="pt-14 sm:pt-20">
        <SectionHeader
          eyebrow="Services"
          title="What we do"
          description="A focused set of capabilities, done well. Every engagement is scoped to what actually moves your business forward."
        />
      </Section>

      <Section className="border-t border-ink-200/60 pt-10 dark:border-ink-800/60">
        {services.isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.data.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </Section>

      <div className="pt-16 sm:pt-20">
        <CTABand
          title="Not sure which service fits?"
          description="Tell us what you're trying to accomplish and we'll suggest a scope."
        />
      </div>
    </main>
  )
}