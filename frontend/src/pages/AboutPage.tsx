import { Link } from 'react-router-dom'
import { ArrowRight, Code2, LifeBuoy, PenTool } from 'lucide-react'
import { Section, SectionHeader } from '../components/Section'
import CTABand from '../components/CTABand'
import Reveal from '../components/Reveal'
import { usePageTitle } from '../hooks/usePageTitle'

const VALUES = [
  { title: 'Clarity over cleverness', body: 'Interfaces that say what they mean. Copy that reads in one pass. Code the next developer can pick up on a Monday.' },
  { title: 'Ship small, ship often', body: 'Working software in front of real users beats a perfect plan that never leaves the whiteboard.' },
  { title: 'Design is not decoration', body: 'Every spacing decision, every color choice, every transition earns its place or it goes.' },
  { title: 'Own the outcome', body: "We don't hand off and disappear. If something isn't working after launch, that's our problem to solve." },
]

const STATS = [
  { label: 'Projects shipped', value: '120+' },
  { label: 'Years in business', value: '8' },
  { label: 'Avg. client rating', value: '4.9' },
  { label: 'Response time', value: '< 24h' },
]

const CAPABILITIES = [
  { icon: PenTool, title: 'Design', body: 'Wireframes, high-fidelity mockups, design systems, and the handoff docs that keep them honest.' },
  { icon: Code2, title: 'Build', body: 'React, TypeScript, Tailwind on the front. FastAPI, SQLAlchemy, Postgres on the back. Nothing exotic, everything solid.' },
  { icon: LifeBuoy, title: 'Support', body: 'Launch is the start. We stick around for the bug reports, the tweaks, and the "can we add one more thing" requests.' },
]

export default function AboutPage() {
  usePageTitle('About')

  return (
    <main>
      <div className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="grid-bg absolute inset-0 h-[34rem]" style={{ color: 'var(--site-text)' }} />
          <div
            className="absolute inset-x-0 top-0 mx-auto h-[28rem] max-w-4xl rounded-full opacity-60 blur-3xl animate-pulse-glow"
            style={{ background: 'radial-gradient(50% 50% at 50% 40%, var(--site-glow), transparent 70%)' }}
          />
        </div>
        <Section className="pb-10 pt-20 sm:pt-28">
          <div className="animate-fade-up">
            <SectionHeader
              eyebrow="About"
              title="A small studio with a long attention span"
              description="We're a tight team of designers and engineers who like doing the work properly. No account managers between you and the people building your site."
            />
          </div>

          <Reveal>
            <dl className="glass glass-spec mt-14 grid grid-cols-2 rounded-3xl sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-6 py-8 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}
                  style={{ borderColor: 'var(--site-border)' }}
                >
                  <dd
                    className="text-3xl font-semibold tracking-tight sm:text-4xl"
                    style={{ background: 'var(--site-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
                  >
                    {s.value}
                  </dd>
                  <dt className="mt-1.5 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--site-muted)' }}>{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--site-border)' }}>
        <Section>
          <Reveal>
            <SectionHeader
              eyebrow="How we work"
              title="Principles we actually follow"
              description="Not a values page written by a committee. These are the ones that show up in the work."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 90}>
                <div className="card card-hover h-full p-8">
                  <span className="text-sm font-semibold" style={{ color: 'var(--site-primary)' }}>0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--site-muted)' }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--site-border)' }}>
        <Section>
          <Reveal>
            <SectionHeader eyebrow="Capabilities" title="Design, build, and support — under one roof" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="card card-hover h-full p-7">
                  <span
                    className="inline-flex size-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: 'var(--site-gradient)', boxShadow: '0 10px 24px -10px var(--site-glow), inset 0 1px 0 0 rgb(255 255 255 / 0.35)' }}
                  >
                    <c.icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--site-muted)' }}>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/contact" className="btn-primary">
              Work with us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Section>
      </div>

      <div className="pt-4 sm:pt-8">
        <Reveal>
          <CTABand />
        </Reveal>
      </div>
    </main>
  )
}