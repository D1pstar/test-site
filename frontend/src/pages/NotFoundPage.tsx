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
          <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Compass className="size-7" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-600">
            404 — Not found
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            This page wandered off
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            The link may be broken, or the page may have moved. Either way,
            there's nothing here to see.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
            >
              <Home className="size-4" />
              Back home
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-300"
            >
              <ArrowLeft className="size-4" />
              Go back
            </button>
          </div>

          <div className="mt-12 border-t border-ink-200 pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
              Or try one of these
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-flex items-center rounded-full border border-ink-200 bg-white px-3 py-1 text-sm font-medium text-ink-700 hover:border-ink-300 hover:text-ink-900"
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