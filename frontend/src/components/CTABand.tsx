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
      <div className="glass-strong glass-spec relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/40 px-6 py-14 sm:px-12 sm:py-16 dark:border-white/10 dark:bg-white/5">
        {/* Brand glow blobs behind the glass so the tint leans brand-colored */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-700/40 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base dark:text-ink-300">
              {description}
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-900/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start a project
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}