import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

type Props = {
  title?: string
  description?: string
}

export default function CTABand({
  title = 'Have a project in mind?',
  description = "Let's talk about what you're trying to build and whether we're a good fit.",
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-12 sm:px-12 sm:py-16 dark:border dark:border-ink-800">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-700/30 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:text-base">
              {description}
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-ink-900 shadow-sm hover:bg-ink-100"
          >
            Start a project
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}