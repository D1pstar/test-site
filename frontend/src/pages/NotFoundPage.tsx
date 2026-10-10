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
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 h-[38rem]" style={{ color: 'var(--site-text)' }} />
        <div
          className="absolute inset-x-0 top-0 mx-auto h-[30rem] max-w-4xl rounded-full opacity-60 blur-3xl animate-pulse-glow"
          style={{ background: 'radial-gradient(50% 50% at 50% 40%, var(--site-glow), transparent 70%)' }}
        />
      </div>
      <Section className="pt-24 sm:pt-36">
        <div className="animate-fade-up mx-auto max-w-2xl text-center">
          <span
            className="inline-flex size-16 items-center justify-center rounded-2xl text-white"
            style={{ background: 'var(--site-gradient)', boxShadow: '0 14px 30px -12px var(--site-glow), inset 0 1px 0 0 rgb(255 255 255 / 0.35)' }}
          >
            <Compass className="size-8" />
          </span>
          <p
            className="mt-8 text-7xl font-semibold tracking-tighter sm:text-8xl"
            style={{ background: 'var(--site-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'var(--site-text)' }}>
            This page wandered off
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--site-muted)' }}>
            The link may be broken, or the page may have moved. Either way,
            there's nothing here to see.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-primary">
              <Home className="size-4" /> Back home
            </Link>
            <button type="button" onClick={() => window.history.back()} className="btn-secondary">
              <ArrowLeft className="size-4" /> Go back
            </button>
          </div>

          <div className="mt-14 border-t pt-8" style={{ borderColor: 'var(--site-border)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--site-muted)' }}>
              Or try one of these
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="glass inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5"
                    style={{ color: 'var(--site-text)' }}
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