import CTABand from '../CTABand'
import Reveal from '../Reveal'
import type { BlockPropsMap } from '../../lib/site-types'

export default function CtaBandBlock({ title, description, primary, secondary }: BlockPropsMap['cta_band']) {
  return (
    <div className="pt-4 sm:pt-8">
      <Reveal>
        <CTABand title={title} description={description} primary={primary} secondary={secondary} />
      </Reveal>
    </div>
  )
}
