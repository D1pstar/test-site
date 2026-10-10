import {
  ArrowRight,
  Check,
  Quote,
  Rocket,
  Search,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section, SectionHeader } from '../components/Section'
import ServiceCard from '../components/ServiceCard'
import CTABand from '../components/CTABand'
import FAQ from '../components/FAQ'
import Reveal from '../components/Reveal'
import { CardSkeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useServices } from '../hooks/useServices'
import { usePageTitle } from '../hooks/usePageTitle'

const TECH = ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'Vite', 'SQLAlchemy', 'Docker']

const STEPS = [
  { icon: Search, title: 'Discover', body: 'We learn your goals, audience, and constraints, then agree on a clear scope before any pixels move.' },
  { icon: Wand2, title: 'Design', body: 'Wireframes and high-fidelity mockups you can react to, refined in quick, honest feedback loops.' },
  { icon: Rocket, title: 'Build & launch', body: 'Fast, accessible, well-tested code shipped in small increments, so you see real progress every week.' },
]

const TESTIMONIALS = [
  { quote: 'They turned a fuzzy idea into a site we’re proud to send people to. Our inquiries doubled within two months.', name: 'Maya Chen', role: 'Founder, Lumen Studio' },
  { quote: 'Fast, clear communication and zero surprises. The best agency experience we’ve had, by a wide margin.', name: 'Daniel Okafor', role: 'COO, Northwind Logistics' },
  { quote: 'The attention to detail is unreal. Every interaction feels intentional, and the site loads instantly.', name: 'Priya Raman', role: 'Head of Marketing, Fieldnote' },
]

const FAQS = [
  { q: 'How long does a typical project take?', a: 'Most marketing sites ship in 3–6 weeks from kickoff. Larger products with custom back-end work are scoped individually, and we’ll give you a realistic timeline before you commit.' },
  { q: 'What does it cost?', a: 'Every engagement is scoped to your needs, so pricing varies. After a short intro call we send a fixed-price proposal with no hidden extras.' },
  { q: 'Do you work with existing brands and codebases?', a: 'Yes. We can build on top of your current brand guidelines, design system, or code, or help you create new ones from scratch.' },
  { q: 'What happens after launch?', a: 'We stick around. Every project includes a support window, and ongoing maintenance plans are available if you want us to keep improving things.' },
]

export default function HomePage() {
  usePageTitle()
  const services = useServices()

  return (
    <main>
      {/* HERO */}
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="grid-bg absolute inset-0 h-[44rem]" style={{ color: 'var(--site-text)' }} />
          <div
            className="absolute inset-x-0 top-0 mx-auto h-[40rem] max-w-6xl rounded-full opacity-60 blur-3xl animate-pulse-glow"
            style={{
              background:
                'radial-gradient(45% 45% at 30% 30%, var(--site-glow), transparent 70%), radial-gradient(40% 40% at 75% 55%, color-mix(in srgb, var(--site-secondary) 40%, transparent), transparent 70%)',
            }}
          />
        </div>

        <Section className="pb-14 pt-20 sm:pb-24 sm:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div
                className="animate-fade-up inline-flex items-center gap-2 rounded-full border py-1 pl-1.5 pr-4 text-xs font-medium shadow-sm"
                style={{
                  borderColor: 'color-mix(in srgb, var(--site-primary) 28%, transparent)',
                  background: 'color-mix(in srgb, var(--site-surface) 70%, transparent)',
                  color: 'var(--site-text)',
                }}
              >
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-white"
                  style={{ background: 'var(--site-primary)' }}
                >
                  <Sparkles className="size-3" /> New
                </span>
                Taking on projects for next quarter
              </div>

              <h1
                className="animate-fade-up mt-7 text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.5rem] lg:leading-[1.02]"
                style={{ animationDelay: '80ms', color: 'var(--site-text)' }}
              >
                A web presence that does your work{' '}
                <span className="site-gradient-text">justice.</span>
              </h1>

              <p
                className="animate-fade-up mt-7 max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ animationDelay: '160ms', color: 'var(--site-muted)' }}
              >
                We design and build fast, modern websites that look sharp, read
                clearly, and turn visitors into customers. This page is a live
                demo of what that looks like.
              </p>

              <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
                <Link to="/contact" className="btn-primary !px-6 !py-3.5">
                  Start a project
                  <ArrowRight className="size-4" />
                </Link>
                <Link to="/services" className="btn-secondary !px-6 !py-3.5">
                  What we do
                </Link>
              </div>

              <div
                className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
                style={{ animationDelay: '320ms', color: 'var(--site-muted)' }}
              >
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 font-medium" style={{ color: 'var(--site-text)' }}>4.9 / 5</span>
                </div>
                <span className="hidden h-4 w-px sm:block" style={{ background: 'var(--site-border)' }} />
                <span>Trusted on 120+ projects</span>
              </div>
            </div>

            {/* Browser mockup */}
            <div className="relative lg:col-span-5">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[3rem] opacity-70 blur-3xl"
                style={{
                  background:
                    'conic-gradient(from 45deg at 50% 50%, color-mix(in srgb, var(--site-primary) 40%, transparent), color-mix(in srgb, var(--site-secondary) 35%, transparent), color-mix(in srgb, var(--site-primary) 40%, transparent))',
                }}
              />
              <div className="animate-float">
                <div className="glass-strong glass-spec overflow-hidden rounded-3xl">
                  <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--site-border)' }}>
                    <span className="size-2.5 rounded-full bg-red-400" />
                    <span className="size-2.5 rounded-full bg-amber-400" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                    <span
                      className="ml-3 flex-1 rounded-full px-3 py-1 text-[11px]"
                      style={{ background: 'color-mix(in srgb, var(--site-text) 6%, transparent)', color: 'var(--site-muted)' }}
                    >
                      yourbrand.com
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="h-24 rounded-2xl p-4 text-white" style={{ background: 'var(--site-gradient)' }}>
                      <div className="h-2.5 w-24 rounded-full bg-white/70" />
                      <div className="mt-3 h-2 w-40 rounded-full bg-white/40" />
                      <div className="mt-2 h-2 w-32 rounded-full bg-white/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-xl border p-3" style={{ borderColor: 'var(--site-border)' }}>
                          <div className="size-6 rounded-lg" style={{ background: 'var(--site-primary-soft)' }} />
                          <div className="mt-3 h-2 w-full rounded-full" style={{ background: 'color-mix(in srgb, var(--site-text) 10%, transparent)' }} />
                          <div className="mt-1.5 h-2 w-2/3 rounded-full" style={{ background: 'color-mix(in srgb, var(--site-text) 10%, transparent)' }} />
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-xs font-medium"
                      style={{ background: 'color-mix(in srgb, #10b981 14%, transparent)', color: '#059669' }}
                    >
                      <span className="flex items-center gap-2"><Check className="size-4" /> Lighthouse score</span>
                      <span className="text-sm font-semibold">100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* TECH MARQUEE */}
      <div
        className="border-y py-8"
        style={{
          borderColor: 'var(--site-border)',
          background: 'color-mix(in srgb, var(--site-surface) 55%, transparent)',
        }}
      >
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--site-muted)' }}>
          Built on a modern, proven stack
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex w-max gap-14 pr-14 hover:[animation-play-state:paused]">
            {[...TECH, ...TECH].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-xl font-semibold tracking-tight"
                style={{ color: 'color-mix(in srgb, var(--site-text) 42%, transparent)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <Section className="pb-0 pt-20 sm:pt-28">
        <Reveal>
          <dl
            className="glass glass-spec grid grid-cols-3 divide-x rounded-3xl"
            style={{ borderColor: 'var(--site-border)' } as any}
          >
            {[['120+', 'Projects shipped'], ['8', 'Years in business'], ['4.9', 'Avg. client rating']].map(([value, label]) => (
              <div key={label} className="px-3 py-8 text-center sm:px-6 sm:py-10">
                <dd
                  className="text-3xl font-semibold tracking-tight sm:text-5xl"
                  style={{
                    background: 'var(--site-gradient)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {value}
                </dd>
                <dt className="mt-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs" style={{ color: 'var(--site-muted)' }}>
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* SERVICES */}
      <Section>
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Services"
              title="Everything you need to launch and grow"
              description="A focused set of capabilities, done well. Click any card to read more."
            />
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: 'var(--site-primary)' }}
            >
              All services
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12">
          {services.isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>
          )}
          {services.isError && (
            <ErrorState title="Couldn’t load services" message={(services.error as Error).message} />
          )}
          {services.data && services.data.length === 0 && (
            <p className="card p-6 text-sm" style={{ color: 'var(--site-muted)' }}>No services yet.</p>
          )}
          {services.data && services.data.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.data.map((s, i) => (
                <Reveal key={s.id} delay={i * 70}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* PROCESS */}
      <Section className="border-t" style={{ borderColor: 'var(--site-border)' } as any}>
        <Reveal>
          <SectionHeader
            align="center"
            eyebrow="Process"
            title="Simple, transparent, and fast"
            description="No black boxes. You’ll always know what’s happening and what’s next."
          />
        </Reveal>
        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="card h-full p-8">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex size-12 items-center justify-center rounded-2xl"
                    style={{ background: 'var(--site-primary-soft)', color: 'var(--site-primary)' }}
                  >
                    <step.icon className="size-6" />
                  </span>
                  <span
                    className="text-5xl font-semibold tracking-tighter"
                    style={{ color: 'color-mix(in srgb, var(--site-text) 8%, transparent)' }}
                  >
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--site-muted)' }}>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="border-t" style={{ borderColor: 'var(--site-border)' } as any}>
        <Reveal>
          <SectionHeader eyebrow="Testimonials" title="Loved by teams who care about the details" />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <figure className="glass glass-spec flex h-full flex-col rounded-3xl p-7">
                <Quote className="size-8" style={{ color: 'var(--site-primary)' }} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed" style={{ color: 'var(--site-text)', opacity: 0.88 }}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: 'var(--site-gradient)' }}
                  >
                    {t.name.split(' ').map((p) => p[0]).join('')}
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--site-text)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--site-muted)' }}>{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-t" style={{ borderColor: 'var(--site-border)' } as any}>
        <div className="grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <SectionHeader
              eyebrow="FAQ"
              title="Questions, answered"
              description="Can’t find what you’re looking for? Reach out and we’ll get back within a day."
            />
          </Reveal>
          <Reveal className="lg:col-span-3" delay={100}>
            <FAQ items={FAQS} />
          </Reveal>
        </div>
      </Section>

      <div className="pt-4 sm:pt-8">
        <Reveal>
          <CTABand />
        </Reveal>
      </div>
    </main>
  )
}