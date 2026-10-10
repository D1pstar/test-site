import {
  ArrowRight,
  Check,
  Image as ImageIcon,
  Quote as QuoteIcon,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useServices } from '../hooks/useServices'
import { useSubmitContact } from '../hooks/useContact'
import type { Block } from '../lib/site'

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function Button({
  label,
  href,
  secondary = false,
}: {
  label?: string
  href?: string
  secondary?: boolean
}) {
  if (!label) return null
  const cls = secondary ? 'btn-secondary' : 'btn-primary'
  const inner = (
    <>
      {label}
      <ArrowRight className="size-4" />
    </>
  )
  return href?.startsWith('/') ? (
    <Link className={cls} to={href}>{inner}</Link>
  ) : (
    <a className={cls} href={href || '#'}>{inner}</a>
  )
}

function Eyebrow({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
      style={{
        borderColor: 'color-mix(in srgb, var(--site-primary) 28%, transparent)',
        background: 'var(--site-primary-soft)',
        color: 'var(--site-primary)',
      }}
    >
      <span className="size-1.5 rounded-full" style={{ background: 'var(--site-primary)' }} />
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

export default function BlockRenderer({ block }: { block: Block }) {
  if (block.enabled === false) return null
  const s = block.settings || {}
  const pad = s.padding || 'py-20 sm:py-28'

  switch (block.type) {
    case 'hero':     return <HeroBlock s={s} pad={pad} />
    case 'text':     return <TextBlock s={s} pad={pad} />
    case 'stats':    return <StatsBlock s={s} pad={pad} />
    case 'cards':    return <CardsBlock s={s} pad={pad} />
    case 'image':    return <ImageBlock s={s} pad={pad} />
    case 'services': return <ServicesBlock s={s} />
    case 'contact':  return <ContactBlock s={s} />
    case 'quote':    return <QuoteBlock s={s} pad={pad} />
    case 'cta':      return <CtaBlock s={s} pad={pad} />
    case 'spacer':   return <div style={{ height: `${Math.max(0, Number(s.height) || 48)}px` }} />
    case 'html':     return <HtmlBlock s={s} pad={pad} />
    default:         return null
  }
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */

function HeroBlock({ s, pad }: { s: any; pad: string }) {
  const alignClass =
    s.align === 'center'
      ? 'text-center items-center mx-auto'
      : s.align === 'right'
        ? 'text-right items-end ml-auto'
        : 'text-left items-start'

  return (
    <section className={`relative isolate overflow-hidden ${pad}`}>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 h-[46rem]" style={{ color: 'var(--site-text)' }} />
        <div
          className="absolute inset-x-0 top-0 mx-auto h-[36rem] max-w-5xl rounded-full blur-3xl opacity-60 animate-pulse-glow"
          style={{
            background:
              'radial-gradient(50% 50% at 40% 40%, var(--site-glow), transparent 70%), radial-gradient(45% 45% at 70% 60%, color-mix(in srgb, var(--site-secondary) 35%, transparent), transparent 70%)',
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className={`flex flex-col ${alignClass}`}>
          <Eyebrow>{s.eyebrow || 'Welcome'}</Eyebrow>
          <h1
            className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem] lg:leading-[1.02]"
            style={{ color: 'var(--site-text)' }}
          >
            {s.title || 'Your headline'}
          </h1>
          {s.body && (
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--site-muted)' }}
            >
              {s.body}
            </p>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <Button label={s.primaryLabel} href={s.primaryHref} />
            <Button label={s.secondaryLabel} href={s.secondaryHref} secondary />
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl opacity-70"
            style={{
              background:
                'conic-gradient(from 90deg at 50% 50%, color-mix(in srgb, var(--site-primary) 35%, transparent), color-mix(in srgb, var(--site-secondary) 35%, transparent), color-mix(in srgb, var(--site-primary) 35%, transparent))',
            }}
          />
          <div
            className="glass-strong glass-spec relative overflow-hidden rounded-3xl"
            style={{
              border: '1px solid color-mix(in srgb, white 30%, transparent)',
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--site-surface) 92%, transparent), color-mix(in srgb, var(--site-surface) 78%, transparent))',
            }}
          >
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{ borderColor: 'var(--site-border)' }}
            >
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <span
                className="ml-3 flex-1 rounded-full px-3 py-1 text-[11px]"
                style={{
                  background: 'color-mix(in srgb, var(--site-text) 6%, transparent)',
                  color: 'var(--site-muted)',
                }}
              >
                yourbrand.com
              </span>
            </div>

            {s.image ? (
              <img
                src={s.image}
                alt={s.imageAlt || ''}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="space-y-4 p-5">
                <div
                  className="h-28 rounded-2xl p-5 text-white"
                  style={{ background: 'var(--site-gradient)' }}
                >
                  <div className="h-2.5 w-28 rounded-full bg-white/70" />
                  <div className="mt-3 h-2 w-44 rounded-full bg-white/40" />
                  <div className="mt-2 h-2 w-36 rounded-full bg-white/40" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-3"
                      style={{ borderColor: 'var(--site-border)' }}
                    >
                      <div
                        className="size-6 rounded-lg"
                        style={{ background: 'var(--site-primary-soft)' }}
                      />
                      <div
                        className="mt-3 h-2 w-full rounded-full"
                        style={{ background: 'color-mix(in srgb, var(--site-text) 10%, transparent)' }}
                      />
                      <div
                        className="mt-1.5 h-2 w-2/3 rounded-full"
                        style={{ background: 'color-mix(in srgb, var(--site-text) 10%, transparent)' }}
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-xs font-medium"
                  style={{
                    background: 'color-mix(in srgb, #10b981 14%, transparent)',
                    color: '#059669',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Check className="size-4" /> Lighthouse score
                  </span>
                  <span className="text-sm font-semibold">100</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* TEXT                                                                */
/* ------------------------------------------------------------------ */

function TextBlock({ s, pad }: { s: any; pad: string }) {
  const align =
    s.align === 'center'
      ? 'text-center items-center mx-auto'
      : s.align === 'right'
        ? 'text-right items-end ml-auto'
        : 'text-left items-start'
  return (
    <section className={pad}>
      <div className={`mx-auto flex max-w-4xl flex-col px-4 sm:px-6 lg:px-8 ${align}`}>
        <Eyebrow>{s.eyebrow}</Eyebrow>
        {s.title && (
          <h2
            className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.06]"
            style={{ color: 'var(--site-text)' }}
          >
            {s.title}
          </h2>
        )}
        {s.body && (
          <p
            className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8"
            style={{ color: 'var(--site-muted)' }}
          >
            {s.body}
          </p>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* STATS                                                               */
/* ------------------------------------------------------------------ */

function StatsBlock({ s, pad }: { s: any; pad: string }) {
  const items = s.items || []
  return (
    <section className={pad}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.map((x: any, i: number) => (
            <div
              key={i}
              className="glass glass-spec relative overflow-hidden rounded-3xl p-8 text-center"
            >
              <div
                className="text-4xl font-semibold tracking-tight sm:text-5xl"
                style={{
                  background: 'var(--site-gradient)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {x.value}
              </div>
              <div
                className="mt-3 text-xs font-medium uppercase tracking-[0.14em]"
                style={{ color: 'var(--site-muted)' }}
              >
                {x.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CARDS                                                               */
/* ------------------------------------------------------------------ */

function CardsBlock({ s, pad }: { s: any; pad: string }) {
  const items = s.items || []
  return (
    <section className={pad}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x: any, i: number) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: 'var(--site-border)',
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--site-surface) 96%, transparent), color-mix(in srgb, var(--site-surface) 88%, transparent))',
                boxShadow: 'inset 0 1px 0 0 color-mix(in srgb, white 55%, transparent)',
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'var(--site-glow)' }}
              />
              <div
                className="relative mb-5 flex size-11 items-center justify-center rounded-2xl"
                style={{
                  background: 'var(--site-primary-soft)',
                  color: 'var(--site-primary)',
                }}
              >
                <Check className="size-5" />
              </div>
              <h3
                className="relative text-lg font-semibold tracking-tight"
                style={{ color: 'var(--site-text)' }}
              >
                {x.title}
              </h3>
              <p className="relative mt-2 text-sm leading-6" style={{ color: 'var(--site-muted)' }}>
                {x.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* IMAGE                                                               */
/* ------------------------------------------------------------------ */

function ImageBlock({ s, pad }: { s: any; pad: string }) {
  return (
    <section className={pad}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[var(--site-radius)] p-1"
          style={{ background: 'var(--site-gradient)' }}
        >
          <div
            className="overflow-hidden rounded-[calc(var(--site-radius)-4px)]"
            style={{ background: 'var(--site-surface)' }}
          >
            {s.src ? (
              <img src={s.src} alt={s.alt || ''} className="max-h-[720px] w-full object-cover" />
            ) : (
              <div
                className="flex h-72 items-center justify-center"
                style={{ color: 'var(--site-muted)' }}
              >
                <ImageIcon className="size-10" />
              </div>
            )}
          </div>
        </div>
        {s.caption && (
          <p className="mt-4 text-sm" style={{ color: 'var(--site-muted)' }}>
            {s.caption}
          </p>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SERVICES                                                            */
/* ------------------------------------------------------------------ */

function ServicesBlock({ s }: { s: any }) {
  const q = useServices()
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Eyebrow>Services</Eyebrow>
        <h2
          className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          style={{ color: 'var(--site-text)' }}
        >
          {s.title || 'What we do'}
        </h2>
        {s.body && (
          <p
            className="mt-4 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--site-muted)' }}
          >
            {s.body}
          </p>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {q.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card h-48 animate-pulse" />
            ))}
          {q.data?.map((svc) => (
            <Link
              key={svc.id}
              to={`/services/${svc.slug}`}
              className="group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: 'var(--site-border)',
                background: 'color-mix(in srgb, var(--site-surface) 92%, transparent)',
              }}
            >
              <h3 className="font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>
                {svc.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--site-muted)' }}>
                {svc.summary}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em]"
                style={{ color: 'var(--site-primary)' }}
              >
                Learn more{' '}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CONTACT                                                             */
/* ------------------------------------------------------------------ */

function ContactBlock({ s }: { s: any }) {
  const c = useSubmitContact()

  const submit = (e: any) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    c.mutate({
      name: String(f.get('name')),
      email: String(f.get('email')),
      company: String(f.get('company') || ''),
      message: String(f.get('message')),
    })
  }

  const inputStyle: React.CSSProperties = {
    borderColor: 'var(--site-border)',
    background: 'color-mix(in srgb, var(--site-surface) 88%, transparent)',
    color: 'var(--site-text)',
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Eyebrow>Contact</Eyebrow>
        <h2
          className="mt-5 text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--site-text)' }}
        >
          {s.title || 'Get in touch'}
        </h2>
        {s.body && (
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--site-muted)' }}>
            {s.body}
          </p>
        )}

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input
            required
            name="name"
            placeholder="Name"
            className="rounded-2xl border px-4 py-3 outline-none transition-shadow"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px var(--site-primary-soft)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            className="rounded-2xl border px-4 py-3 outline-none transition-shadow"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px var(--site-primary-soft)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
          <input
            name="company"
            placeholder="Company"
            className="rounded-2xl border px-4 py-3 outline-none transition-shadow"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px var(--site-primary-soft)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
          <textarea
            required
            name="message"
            rows={6}
            placeholder="Tell us about your project"
            className="rounded-2xl border px-4 py-3 outline-none transition-shadow"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px var(--site-primary-soft)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
          <button disabled={c.isPending} className="btn-primary w-fit disabled:opacity-60">
            {c.isPending ? 'Sending…' : c.isSuccess ? 'Sent!' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* QUOTE                                                               */
/* ------------------------------------------------------------------ */

function QuoteBlock({ s, pad }: { s: any; pad: string }) {
  return (
    <section className={pad}>
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="glass glass-spec relative overflow-hidden rounded-3xl p-10 sm:p-14">
          <QuoteIcon className="mx-auto size-10" style={{ color: 'var(--site-primary)' }} />
          <blockquote
            className="mt-6 text-2xl font-medium leading-relaxed tracking-tight text-balance sm:text-4xl sm:leading-[1.2]"
            style={{ color: 'var(--site-text)' }}
          >
            “{s.quote}”
          </blockquote>
          <p className="mt-6 text-sm" style={{ color: 'var(--site-muted)' }}>
            {s.name}
            {s.role ? ` · ${s.role}` : ''}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

function CtaBlock({ s, pad }: { s: any; pad: string }) {
  return (
    <section className={pad}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[var(--site-radius-lg)] p-8 text-white sm:p-14"
          style={{ background: 'var(--site-gradient)' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 mix-blend-overlay dotted-bg"
            style={{ color: 'white' }}
          />
          <div className="relative">
            <Sparkles className="size-6 opacity-80" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {s.title}
            </h2>
            {s.body && <p className="mt-3 max-w-2xl text-white/85">{s.body}</p>}
            <div className="mt-8">
              <Link
                to={s.href || '/contact'}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900 shadow-xl transition-transform hover:-translate-y-0.5"
              >
                {s.label || 'Get started'}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* HTML                                                                */
/* ------------------------------------------------------------------ */

function HtmlBlock({ s, pad }: { s: any; pad: string }) {
  return (
    <section className={pad}>
      <div
        className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        dangerouslySetInnerHTML={{ __html: s.html || '' }}
      />
    </section>
  )
}