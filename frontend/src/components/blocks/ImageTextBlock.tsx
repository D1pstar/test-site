import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../Section'
import Reveal from '../Reveal'
import SmartLink from '../SmartLink'
import { Paragraphs } from './TextBlock'
import { safeImage } from '../../lib/links'
import type { BlockPropsMap } from '../../lib/site-types'

export default function ImageTextBlock(p: BlockPropsMap['image_text']) {
  const src = safeImage(p.imageUrl)
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className={p.imageSide === 'right' ? '' : 'lg:order-last'}>
          <div>
            {p.title && <SectionHeader eyebrow={p.eyebrow} title={p.title} />}
            <Paragraphs text={p.body} className={p.title ? 'mt-6' : ''} />
            {p.cta.label && (
              <div className="mt-8">
                <SmartLink to={p.cta.to} className="btn-primary !px-6 !py-3.5">
                  {p.cta.label}
                  <ArrowRight className="size-4" />
                </SmartLink>
              </div>
            )}
          </div>
        </Reveal>
        <Reveal delay={100} className={p.imageSide === 'right' ? '' : 'lg:order-first'}>
          {src ? (
            <img
              src={src}
              alt={p.alt}
              loading="lazy"
              className="w-full rounded-3xl border border-ink-200 object-cover shadow-xl shadow-ink-900/5 dark:border-white/10"
            />
          ) : (
            <div aria-hidden className="card aspect-[4/3] w-full" />
          )}
        </Reveal>
      </div>
    </Section>
  )
}
