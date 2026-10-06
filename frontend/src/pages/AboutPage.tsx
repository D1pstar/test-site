import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Section, SectionHeader } from '../components/Section'
import CTABand from '../components/CTABand'
import { usePageTitle } from '../hooks/usePageTitle'

const VALUES = [
  {
    title: 'Clarity over cleverness',
    body: 'Interfaces that say what they mean. Copy that reads in one pass. Code the next developer can pick up on a Monday.',
  },
  {
    title: 'Ship small, ship often',
    body: 'Working software in front of real users beats a perfect plan that never leaves the whiteboard.',
  },
  {
    title: 'Design is not decoration',
    body: 'Every spacing decision, every color choice, every transition earns its place or it goes.',
  },
  {
    title: 'Own the outcome',
    body: "We don't hand off and disappear. If something isn't working after launch, that's our problem to solve.",
  },
]

const STATS = [
  { label: 'Projects shipped', value: '120+' },
  { label: 'Years in business', value: '8' },
  { label: 'Avg. client rating', value: '4.9' },
  { label: 'Response time', value: '< 24h' },
]

export default function AboutPage() {
  usePageTitle('About')

  return (
    <main>
      <Section className="pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <SectionHeader
            eyebrow="About"
            title="A small studio with a long attention span"
            description="We're a tight team of designers and engineers who like doing the work properly. No account managers between you and the people building your site."
          />
        </div>

        <dl className="glass glass-spec mt-12 grid grid-cols-2 gap-6 rounded-3xl border border-white/40 bg-white/40 px-6 py-6 sm:grid-cols-4 dark:border-white/10 dark:bg-white/5">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-500">
                {s.label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="border-t border-ink-200/60 dark:border-ink-800/60">
        <SectionHeader
          eyebrow="How we work"
          title="Principles we actually follow"
          description="Not a values page written by a committee. These are the ones that show up in the work."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="glass glass-spec rounded-3xl border border-white/40 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-900/20">
                  <CheckCircle2 className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                    {v.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-ink-200/60 dark:border-ink-800/60">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="glass glass-spec rounded-3xl border border-white/40 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Design
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              Wireframes, high-fidelity mockups, design systems, and the
              handoff docs that keep them honest.
            </p>
          </div>
          <div className="glass glass-spec rounded-3xl border border-white/40 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Build
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              React, TypeScript, Tailwind on the front. FastAPI, SQLAlchemy,
              Postgres on the back. Nothing exotic, everything solid.
            </p>
          </div>
          <div className="glass glass-spec rounded-3xl border border-white/40 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Support
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              Launch is the start. We stick around for the bug reports, the
              tweaks, and the "can we add one more thing" requests.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Work with us
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      <div className="pt-16 sm:pt-20">
        <CTABand />
      </div>
    </main>
  )
}