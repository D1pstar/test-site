import { ArrowRight, Check, Sparkles, Star } from 'lucide-react'
import { Section } from '../Section'
import SmartLink from '../SmartLink'
import { safeImage } from '../../lib/links'
import type { BlockPropsMap } from '../../lib/site-types'

export default function HeroBlock(p: BlockPropsMap['hero']) {
  const image = safeImage(p.imageUrl)
  const hasVisual = Boolean(image) || p.showMockup

  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 h-[40rem]" />
      <Section className="pb-12 pt-14 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className={hasVisual ? 'lg:col-span-7' : 'lg:col-span-12'}>
            {p.badge && (
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 py-1 pl-1.5 pr-4 text-xs font-medium text-ink-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-ink-300">
                {p.badgeTag && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-white">
                    <Sparkles className="size-3" /> {p.badgeTag}
                  </span>
                )}
                {p.badge}
              </div>
            )}

            <h1
              className="animate-fade-up mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl lg:leading-[1.02]"
              style={{ animationDelay: '80ms' }}
            >
              {p.title}
              {p.highlight && (
                <>
                  {' '}
                  <span className="text-gradient">{p.highlight}</span>
                </>
              )}
            </h1>

            {p.subtitle && (
              <p
                className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg dark:text-ink-400"
                style={{ animationDelay: '160ms' }}
              >
                {p.subtitle}
              </p>
            )}

            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '240ms' }}
            >
              {p.primaryCta.label && (
                <SmartLink to={p.primaryCta.to} className="btn-primary !px-6 !py-3.5">
                  {p.primaryCta.label}
                  <ArrowRight className="size-4" />
                </SmartLink>
              )}
              {p.secondaryCta.label && (
                <SmartLink to={p.secondaryCta.to} className="btn-secondary !px-6 !py-3.5">
                  {p.secondaryCta.label}
                </SmartLink>
              )}
            </div>

            {(p.ratingValue || p.trustText) && (
              <div
                className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-600 dark:text-ink-400"
                style={{ animationDelay: '320ms' }}
              >
                {p.ratingValue && (
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 font-medium text-ink-800 dark:text-ink-200">{p.ratingValue}</span>
                  </div>
                )}
                {p.ratingValue && p.trustText && (
                  <span className="hidden h-4 w-px bg-ink-300 sm:block dark:bg-white/20" />
                )}
                {p.trustText && <span>{p.trustText}</span>}
              </div>
            )}
          </div>

          {image ? (
            <div className="relative lg:col-span-5">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-brand-500/30 via-fuchsia-400/20 to-cyan-400/30 blur-3xl"
              />
              <img
                src={image}
                alt={p.imageAlt}
                className="w-full rounded-3xl border border-white/60 object-cover shadow-2xl dark:border-white/10"
              />
            </div>
          ) : (
            p.showMockup && (
              <div className="relative lg:col-span-5">
                <div
                  aria-hidden
                  className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-brand-500/30 via-fuchsia-400/20 to-cyan-400/30 blur-3xl"
                />
                <div className="animate-float">
                  <div className="glass-strong overflow-hidden rounded-3xl border border-white/60 bg-white/70 dark:border-white/10 dark:bg-ink-800/70">
                    <div className="flex items-center gap-2 border-b border-ink-200/70 px-4 py-3 dark:border-white/10">
                      <span className="size-2.5 rounded-full bg-red-400" />
                      <span className="size-2.5 rounded-full bg-amber-400" />
                      <span className="size-2.5 rounded-full bg-emerald-400" />
                      <span className="ml-3 flex-1 rounded-full bg-ink-900/5 px-3 py-1 text-[11px] text-ink-500 dark:bg-white/5">
                        {p.mockupDomain}
                      </span>
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 p-4">
                        <div className="h-2.5 w-24 rounded-full bg-white/70" />
                        <div className="mt-3 h-2 w-40 rounded-full bg-white/40" />
                        <div className="mt-2 h-2 w-32 rounded-full bg-white/40" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-ink-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5"
                          >
                            <div className="size-6 rounded-lg bg-brand-500/20" />
                            <div className="mt-3 h-2 w-full rounded-full bg-ink-900/10 dark:bg-white/10" />
                            <div className="mt-1.5 h-2 w-2/3 rounded-full bg-ink-900/10 dark:bg-white/10" />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        <span className="flex items-center gap-2">
                          <Check className="size-4" /> Lighthouse score
                        </span>
                        <span className="text-sm font-semibold">100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Section>
    </div>
  )
}
