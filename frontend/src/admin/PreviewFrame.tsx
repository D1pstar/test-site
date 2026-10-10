import { useCallback, useEffect, useRef, useState } from 'react'
import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'
import type { SiteContent } from '../lib/site-types'
import { iconBtn } from './ui'

const WIDTHS = { desktop: '100%', tablet: '768px', mobile: '390px' } as const
type Device = keyof typeof WIDTHS

/** Shows the working copy in a sandboxed-by-origin iframe, updating as you type. */
export default function PreviewFrame({
  content,
  path,
  onNavigate,
}: {
  content: SiteContent
  path: string
  onNavigate: (path: string) => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const ready = useRef(false)
  const [device, setDevice] = useState<Device>('desktop')

  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: 'site-preview', content, path }, window.location.origin)
  }, [content, path])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return
      const data = e.data as { type?: string; path?: string } | null
      if (data?.type === 'preview-ready') {
        ready.current = true
        send()
      } else if (data?.type === 'preview-navigate' && typeof data.path === 'string') {
        onNavigate(data.path)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [send, onNavigate])

  useEffect(() => {
    if (!ready.current) return
    const t = setTimeout(send, 120)
    return () => clearTimeout(t)
  }, [send])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 dark:border-white/10 dark:bg-black/30">
      <div className="flex items-center justify-between gap-2 border-b border-ink-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
        <span className="text-xs font-medium text-ink-500">Live preview · {path}</span>
        <div className="flex items-center gap-1.5">
          {(
            [
              ['desktop', Monitor, 'Desktop'],
              ['tablet', Tablet, 'Tablet'],
              ['mobile', Smartphone, 'Phone'],
            ] as const
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              type="button"
              aria-label={`${label} width`}
              aria-pressed={device === key}
              onClick={() => setDevice(key)}
              className={`${iconBtn} ${device === key ? '!border-brand-500 !bg-brand-500/10 !text-brand-700 dark:!text-brand-300' : ''}`}
            >
              <Icon className="size-4" />
            </button>
          ))}
          <a
            href={`/admin/preview?path=${encodeURIComponent(path)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtn}
            aria-label="Open saved draft in a new tab"
            title="Open saved draft in a new tab"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-ink-100 dark:bg-black/30">
        <iframe
          ref={frame}
          src="/admin/preview"
          title="Live preview of your site"
          style={{ width: WIDTHS[device] }}
          className="h-full min-h-[40rem] max-w-full bg-white dark:bg-ink-900"
        />
      </div>
    </div>
  )
}
