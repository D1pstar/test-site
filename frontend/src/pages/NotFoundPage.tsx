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
    <main>
      <Section className="pt-20 sm:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-900/30">
            <Compass className="size-8" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            404 — Not found
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            This page wandered off
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-400">
            The link may be broken, or the page may have moved. Either way,
            there's nothing here to see.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="size-4" />
              Back home
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="glass glass-spec inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/40 px-5 py-2.5 text-sm font-medium text-ink-800 transition-all hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
            >
              <ArrowLeft className="size-4" />
              Go back
            </button>
          </div>

          <div className="mt-12 border-t border-ink-200/60 pt-8 dark:border-ink-800/60">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-500">
              Or try one of these
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="glass-subtle inline-flex items-center rounded-full border border-white/50 bg-white/40 px-4 py-1.5 text-sm font-medium text-ink-700 transition-all hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
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