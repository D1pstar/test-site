import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
      className="glass glass-spec group flex flex-col rounded-3xl border border-white/40 bg-white/50 p-6 transition-all hover:-translate-y-0.5 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-900/20">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
        {service.summary}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:text-brand-700 dark:text-brand-400 dark:group-hover:text-brand-300">
        Learn more
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}