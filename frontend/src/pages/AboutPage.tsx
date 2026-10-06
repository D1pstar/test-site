import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Section, SectionHeader } from '../components/Section'
import CTABand from '../components/CTABand'
import CatsLayer from '../components/cats/CatsLayer'
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
    <main className="pb-28">
      <Section className="pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <SectionHeader
            eyebrow="About"
            title="A small studio with a long attention span"
            description="We're a tight team of designers and engineers who like doing the work properly. No account managers between you and the people building your site."
          />
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-ink-200 pt-8 sm:grid-cols-4 dark:border-ink-800">
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

      <Section className="border-t border-ink-200 dark:border-ink-800">
        <SectionHeader
          eyebrow="How we work"
          title="Principles we actually follow"
          description="Not a values page written by a committee. These are the ones that show up in the work."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-800/50"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-600 dark:text-brand-400" />
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

      <Section className="border-t border-ink-200 dark:border-ink-800">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Design
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              Wireframes, high-fidelity mockups, design systems, and the
              handoff docs that keep them honest.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Build
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              React, TypeScript, Tailwind on the front. FastAPI, SQLAlchemy,
              Postgres on the back. Nothing exotic, everything solid.
            </p>
          </div>
          <div>
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Work with us
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      <div className="border-t border-ink-200 pt-16 sm:pt-20 dark:border-ink-800">
        <CTABand />
      </div>

      <CatsLayer />
    </main>
  )
}