import { Section } from '../Section'
import Reveal from '../Reveal'
import { safeImage } from '../../lib/links'
import type { BlockPropsMap } from '../../lib/site-types'

export default function ImageBlock({ imageUrl, alt, caption, size }: BlockPropsMap['image']) {
  const src = safeImage(imageUrl)
  if (!src) return null
  return (
    <Section className="py-8 sm:py-12">
      <Reveal>
        <figure className={size === 'normal' ? 'mx-auto max-w-4xl' : ''}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full rounded-3xl border border-ink-200 object-cover shadow-xl shadow-ink-900/5 dark:border-white/10"
          />
          {caption && <figcaption className="mt-3 text-center text-sm text-ink-500">{caption}</figcaption>}
        </figure>
      </Reveal>
    </Section>
  )
}
