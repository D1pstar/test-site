import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getIcon } from '../lib/icons'
import type { Service } from '../lib/types'

export default function ServiceCard({ service }: { service: Service }) {
  const Icon = getIcon(service.icon)

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: 'var(--site-border)',
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--site-surface) 96%, transparent), color-mix(in srgb, var(--site-surface) 88%, transparent))',
        boxShadow:
          'inset 0 1px 0 0 color-mix(in srgb, white 55%, transparent), 0 20px 40px -24px rgb(15 23 42 / 0.14)',
      }}
    >
      {/* Hover glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'var(--site-glow)' }}
      />

      <div className="relative flex items-start justify-between">
        <span
          className="inline-flex size-12 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
          style={{
            background: 'var(--site-gradient)',
            boxShadow: '0 10px 24px -10px var(--site-glow), inset 0 1px 0 0 rgb(255 255 255 / 0.35)',
          }}
        >
          <Icon className="size-6" />
        </span>
        <span
          className="inline-flex size-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:text-white"
          style={{
            borderColor: 'var(--site-border)',
            color: 'var(--site-muted)',
          }}
        >
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </div>

      <h3 className="relative mt-6 text-lg font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>
        {service.title}
      </h3>
      <p
        className="relative mt-2 flex-1 text-sm leading-relaxed"
        style={{ color: 'var(--site-muted)' }}
      >
        {service.summary}
      </p>
      <span
        className="relative mt-6 inline-flex items-center gap-1 text-sm font-medium"
        style={{ color: 'var(--site-primary)' }}
      >
        Learn more
        <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  )
}