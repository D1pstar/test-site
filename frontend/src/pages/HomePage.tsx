import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useHealth } from '../hooks/useHealth'

export default function HomePage() {
  const { data, isLoading, isError, error } = useHealth()

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 shadow-sm">
          <ShieldCheck className="size-3.5 text-brand-500" />
          Part 3 — data layer online
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Hello from{' '}
          <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
            test-site
          </span>
        </h1>

        <p className="mt-4 text-base text-ink-600 sm:text-lg">
          Layout, routing, and the typed API layer are wired up. Home, Services,
          Portfolio, About, and Contact pages come next.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Start a project
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-300"
          >
            See our work
          </Link>
        </div>

        <div className="mt-10 rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-700">Backend health</h2>
            <span className="inline-flex items-center gap-1 text-xs text-ink-500">
              <span
                className={
                  'size-2 rounded-full ' +
                  (isLoading
                    ? 'bg-amber-400'
                    : isError
                      ? 'bg-red-500'
                      : 'bg-emerald-500')
                }
              />
              {isLoading ? 'checking…' : isError ? 'unreachable' : 'ok'}
            </span>
          </div>

          <pre className="mt-3 overflow-x-auto rounded-lg bg-ink-900 p-3 text-xs leading-relaxed text-ink-100">
{isLoading
  ? 'loading…'
  : isError
    ? `error: ${(error as Error).message}`
    : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  )
}