import { Section, SectionHeader } from '../Section'
import Reveal from '../Reveal'
import FAQ from '../FAQ'
import type { BlockPropsMap } from '../../lib/site-types'

export default function FaqBlock({ eyebrow, title, description, items }: BlockPropsMap['faq']) {
  return (
    <Section className="border-t border-ink-200/70 dark:border-white/10">
      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
        <Reveal className="lg:col-span-3" delay={100}>
          <FAQ items={items} />
        </Reveal>
      </div>
    </Section>
  )
}
