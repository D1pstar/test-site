import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { iconBtn } from './ui'

export default function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} rounded-3xl bg-white p-6 shadow-2xl dark:bg-ink-800`}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className={iconBtn}>
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}
