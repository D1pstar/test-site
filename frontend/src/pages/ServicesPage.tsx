import { Section, SectionHeader } from '../components/Section'
import ServiceCard from '../components/ServiceCard'
import CTABand from '../components/CTABand'
import Reveal from '../components/Reveal'
import { CardSkeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useServices } from '../hooks/useServices'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ServicesPage() {
  usePageTitle('Services')
  const services = useServices()

  return (
    <main>
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="grid-bg absolute inset-0 h-[30rem]" style={{ color: 'var(--site-text)' }} />
          <div
            className="absolute inset-x-0 top-0 mx-auto h-[26rem] max-w-4xl rounded-full opacity-60 blur-3xl animate-pulse-glow"
            style={{ background: 'radial-gradient(50% 50% at 50% 40%, var(--site-glow), transparent 70%)' }}
          />
        </div>
        <Section className="pb-10 pt-20 sm:pb-14 sm:pt-28">
          <div className="animate-fade-up">
            <SectionHeader
              eyebrow="Services"
              title="What we do"
              description="A focused set of capabilities, done well. Every engagement is scoped to what actually moves your business forward."
            />
          </div>
        </Section>
      </div>

      <Section className="pt-6">
        {services.isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}
        {services.isError && (
          <ErrorState title="Couldn’t load services" message={(services.error as Error).message} />
        )}
        {services.data && services.data.length === 0 && (
          <p className="card p-6 text-sm" style={{ color: 'var(--site-muted)' }}>No services yet.</p>
        )}
        {services.data && services.data.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.data.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <div className="pt-4 sm:pt-8">
        <Reveal>
          <CTABand
            title="Not sure which service fits?"
            description="Tell us what you're trying to accomplish and we'll suggest a scope."
          />
        </Reveal>
      </div>
    </main>
  )
}