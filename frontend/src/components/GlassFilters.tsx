import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Grid classes for the layout — same value applied to both layers. */
  className?: string
  /** Shape + surface styling for each generated tile. */
  tileClassName?: string
}

/**
 * Renders children over an independent goo layer of empty glass tiles
 * that share the same grid geometry. Visible children must NOT apply
 * their own glass surface — the tile does that. Children only carry
 * text, icons, and inner padding.
 */
export default function GlassGroup({
  children,
  className = '',
  tileClassName = 'glass rounded-3xl bg-white/40 dark:bg-white/5',
}: Props) {
  const items = Array.isArray(children) ? children : [children]

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{ filter: 'url(#glass-goo-filter)', isolation: 'isolate' }}
      >
        {items.map((_, i) => (
          <div key={i} className={tileClassName} />
        ))}
      </div>
      <div className={`relative ${className}`}>{children}</div>
    </div>
  )
}