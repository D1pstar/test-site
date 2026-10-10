import { Section, SectionHeader } from '../Section'
import type { BlockPropsMap } from '../../lib/site-types'

export default function PageHeaderBlock({ eyebrow, title, description, align }: BlockPropsMap['page_header']) {
  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 h-[28rem]" />
      <Section className="pb-8 pt-14 sm:pb-12 sm:pt-24">
        <div className="animate-fade-up">
          <SectionHeader as="h1" eyebrow={eyebrow} title={title} description={description} align={align} />
        </div>
      </Section>
    </div>
  )
}
