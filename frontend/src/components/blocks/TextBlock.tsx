import { Section, SectionHeader } from '../Section'
import Reveal from '../Reveal'
import type { BlockPropsMap } from '../../lib/site-types'

/** Splits on blank lines. Rendered as plain text: no HTML is ever interpreted. */
export function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return (
    <div className={`space-y-5 text-base leading-relaxed text-ink-700 dark:text-ink-300 ${className}`}>
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  )
}

export default function TextBlock({ eyebrow, title, body, align }: BlockPropsMap['text']) {
  return (
    <Section>
      <Reveal>
        <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
          {title && <SectionHeader eyebrow={eyebrow} title={title} align={align} />}
          <Paragraphs text={body} className={title ? 'mt-6' : ''} />
        </div>
      </Reveal>
    </Section>
  )
}
