import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
}

export function Section({ children, className = '', id }: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${className}`}
    >
      {children}
    </section>
  )
}

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  /** Use 'h1' for the main heading of a page. */
  as?: 'h1' | 'h2'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : ''
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-300`}
        >
          <span className="size-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </p>
      )}
      <Heading className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg dark:text-ink-400">
          {description}
        </p>
      )}
    </div>
  )
}
