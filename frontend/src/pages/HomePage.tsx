import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ShieldCheck } from 'lucide-react'

type HealthResponse = {
  status: string
  app: string
  env: string
}

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health')
  if (!res.ok) throw new Error(`health check failed: ${res.status}`)
  return (await res.json()) as HealthResponse
}

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  })

  return (
    <main className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 shadow-sm">
          <ShieldCheck className="size-3.5 text-brand-500" />
          test-site scaffold is live
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Hello from{' '}
          <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
            test-site
          </span>
        </h1>

        <p className="mt-4 text-base text-ink-600 sm:text-lg">
          Frontend stack is wired up: Vite + React 19 + TS, Tailwind v4, Router v7,
          React Query v5, Lucide icons, Inter variable font.
        </p>

        <div className="mt-8 rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
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

        <a
          href="/api/health"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Hit /api/health directly
          <ArrowRight className="size-4" />
        </a>
      </div>
    </main>
  )
}