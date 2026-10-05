import { Quote } from 'lucide-react'
import type { Testimonial } from '../lib/types'

type Props = {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
      <Quote className="size-6 text-brand-500" aria-hidden />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
        <img
          src={testimonial.avatar_url}
          alt=""
          loading="lazy"
          className="size-10 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-medium text-ink-900">{testimonial.author_name}</div>
          <div className="text-xs text-ink-500">
            {testimonial.author_role}, {testimonial.author_company}
          </div>
        </div>
      </figcaption>
    </figure>
  )
}