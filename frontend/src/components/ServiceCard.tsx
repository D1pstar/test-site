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
      className="group flex flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-md"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
        {service.summary}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:text-brand-700">
        Learn more
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}