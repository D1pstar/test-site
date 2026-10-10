import { ArrowRight } from 'lucide-react'
import SmartLink from './SmartLink'
import { useSiteContent } from '../hooks/useSite'
import type { LinkItem } from '../lib/site-types'

type Props = {
  title?: string
  description?: string
  primary?: LinkItem
  secondary?: LinkItem
}

export default function CTABand({
  title = 'Have a project in mind?',
  description = "Let's talk about what you're trying to build and whether we're a good fit.",
  primary,
  secondary,
}: Props) {
  const site = useSiteContent()
  const main = primary ?? { label: 'Start a project', to: '/contact' }
  const second =
    secondary ?? (site.contact.email ? { label: 'Email us', to: `mailto:${site.contact.email}` } : undefined)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-14 text-white shadow-2xl shadow-brand-900/30 sm:px-14 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 -z-10 size-96 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 -z-10 size-96 rounded-full bg-fuchsia-500/30 blur-3xl"
        />
        <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-40 invert" />
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
            {description && (
              <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {main.label && (
              <SmartLink
                to={main.to}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {main.label}
                <ArrowRight className="size-4" />
              </SmartLink>
            )}
            {second?.label && (
              <SmartLink
                to={second.to}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {second.label}
              </SmartLink>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
