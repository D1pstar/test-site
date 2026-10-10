import type { BlockPropsMap } from '../../lib/site-types'

const SIZE = { sm: 'h-8', md: 'h-16', lg: 'h-28' } as const

export default function SpacerBlock({ size }: BlockPropsMap['spacer']) {
  return <div aria-hidden className={SIZE[size]} />
}
