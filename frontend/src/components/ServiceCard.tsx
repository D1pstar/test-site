import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getIcon } from '../lib/icons'
import type { Service } from '../lib/types'

type Props = {
  service: Service
}

export default function ServiceCard({ service }: Props) {
  const Icon = getIcon(service.icon)

  return (
    <Link
      to={`/services/${service.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-brand-500/10 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-0"
      />
      <div className="relative flex items-start justify-between">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-900/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
          <Icon className="size-6" />
        </span>
        <span className="inline-flex size-9 items-center justify-center rounded-full border border-ink-200 text-ink-400 transition-all group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white dark:border-white/10">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <h3 className="relative mt-6 text-lg font-semibold tracking-tight">{service.title}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
        {service.summary}
      </p>
      <span className="relative mt-6 text-sm font-medium text-brand-600 dark:text-brand-400">
        Learn more
      </span>
    </Link>
  )
}
