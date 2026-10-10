import PageHeaderBlock from './blocks/PageHeaderBlock'
import HeroBlock from './blocks/HeroBlock'
import MarqueeBlock from './blocks/MarqueeBlock'
import StatsBlock from './blocks/StatsBlock'
import ServicesGridBlock from './blocks/ServicesGridBlock'
import StepsBlock from './blocks/StepsBlock'
import FeaturesBlock from './blocks/FeaturesBlock'
import TestimonialsBlock from './blocks/TestimonialsBlock'
import FaqBlock from './blocks/FaqBlock'
import CtaBandBlock from './blocks/CtaBandBlock'
import TextBlock from './blocks/TextBlock'
import ImageBlock from './blocks/ImageBlock'
import ImageTextBlock from './blocks/ImageTextBlock'
import ContactFormBlock from './blocks/ContactFormBlock'
import SpacerBlock from './blocks/SpacerBlock'
import type { Block, Page } from '../lib/site-types'

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'page_header':
      return <PageHeaderBlock {...block.props} />
    case 'hero':
      return <HeroBlock {...block.props} />
    case 'marquee':
      return <MarqueeBlock {...block.props} />
    case 'stats':
      return <StatsBlock {...block.props} />
    case 'services_grid':
      return <ServicesGridBlock {...block.props} />
    case 'steps':
      return <StepsBlock {...block.props} />
    case 'features':
      return <FeaturesBlock {...block.props} />
    case 'testimonials':
      return <TestimonialsBlock {...block.props} />
    case 'faq':
      return <FaqBlock {...block.props} />
    case 'cta_band':
      return <CtaBandBlock {...block.props} />
    case 'text':
      return <TextBlock {...block.props} />
    case 'image':
      return <ImageBlock {...block.props} />
    case 'image_text':
      return <ImageTextBlock {...block.props} />
    case 'contact_form':
      return <ContactFormBlock {...block.props} />
    case 'spacer':
      return <SpacerBlock {...block.props} />
    default:
      return null // unknown block type from a newer/older document: skip, don't crash
  }
}

export default function PageRenderer({ page }: { page: Page }) {
  return (
    <main>
      {page.blocks
        .filter((b) => !b.hidden)
        .map((b) => (
          <BlockView key={b.id} block={b} />
        ))}
    </main>
  )
}
