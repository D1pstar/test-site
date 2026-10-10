import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Home } from 'lucide-react'
import { Section } from '../components/Section'
import { usePageTitle } from '../hooks/usePageTitle'

const QUICK_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <main className="relative isolate overflow-hidden">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 h-[36rem]" />
      <Section className="pt-20 sm:pt-32">
        <div className="animate-fade-up mx-auto max-w-2xl text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-900/30">
            <Compass className="size-8" />
          </span>
          <p className="text-gradient mt-8 text-7xl font-semibold tracking-tighter sm:text-8xl">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            This page wandered off
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-400">
            The link may be broken, or the page may have moved. Either way,
            there's nothing here to see.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-primary !px-6 !py-3.5">
              <Home className="size-4" />
              Back home
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary !px-6 !py-3.5"
            >
              <ArrowLeft className="size-4" />
              Go back
            </button>
          </div>

          <div className="mt-14 border-t border-ink-200/70 pt-8 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
              Or try one of these
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-flex items-center rounded-full border border-ink-200 bg-white/70 px-4 py-2 text-sm font-medium text-ink-700 transition-all hover:border-brand-400 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  )
}
