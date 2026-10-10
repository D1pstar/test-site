import { useState } from 'react'
import { Plus } from 'lucide-react'

type Item = { q: string; a: string }

type Props = {
  items: Item[]
}

export default function FAQ({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="divide-y divide-ink-200 overflow-hidden rounded-3xl border border-ink-200 bg-white/70 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={`${i}-${item.q}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-base font-semibold tracking-tight">{item.q}</span>
              <span
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-ink-200 transition-all dark:border-white/10 ${
                  isOpen ? 'rotate-45 border-brand-500 bg-brand-500 text-white' : 'text-ink-500'
                }`}
              >
                <Plus className="size-4" />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
