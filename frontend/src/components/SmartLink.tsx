import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { classifyLink } from '../lib/links'

type Props = {
  to: string
  className?: string
  children: ReactNode
  onClick?: () => void
}

/** Renders a router link, a plain anchor, or (for empty/invalid targets) just the text. */
export default function SmartLink({ to, className, children, onClick }: Props) {
  const kind = classifyLink(to)
  if (kind === 'internal')
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  if (kind === 'anchor' || kind === 'external') {
    const isWeb = /^https?:/i.test(to)
    return (
      <a
        href={to}
        className={className}
        onClick={onClick}
        {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return <span className={className}>{children}</span>
}
