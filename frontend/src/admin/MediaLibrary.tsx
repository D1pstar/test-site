import { useRef, useState, type DragEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Copy, Loader2, Trash2, Upload } from 'lucide-react'
import { siteApi, type MediaItem } from '../lib/site-api'
import ErrorState from '../components/ErrorState'
import { dangerBtn, formatBytes, smallBtn } from './ui'

const KEY = ['admin', 'media'] as const

/** Upload + browse images. With `onPick`, each tile has a "Use this image" button. */
export default function MediaLibrary({ onPick }: { onPick?: (url: string) => void }) {
  const qc = useQueryClient()
  const media = useQuery({ queryKey: KEY, queryFn: siteApi.media.list, retry: false })
  const [errors, setErrors] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useMutation({
    mutationFn: async (files: File[]) => {
      const failures: string[] = []
      for (const file of files) {
        try {
          await siteApi.media.upload(file)
        } catch (e) {
          failures.push(`${file.name}: ${(e as Error).message}`)
        }
      }
      return failures
    },
    onSuccess: (failures) => {
      setErrors(failures)
      qc.invalidateQueries({ queryKey: KEY })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => siteApi.media.remove(id),
    onSuccess: () => {
      setErrors([])
      qc.invalidateQueries({ queryKey: KEY })
    },
    onError: (e) => setErrors([(e as Error).message]),
  })

  function pick(files: FileList | null) {
    if (files && files.length > 0) upload.mutate(Array.from(files))
  }
  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    pick(e.dataTransfer.files)
  }
  async function copy(m: MediaItem) {
    try {
      await navigator.clipboard.writeText(m.url)
      setCopied(m.id)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      window.prompt('Copy this image address:', m.url)
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging
            ? 'border-brand-500 bg-brand-500/5'
            : 'border-ink-300 dark:border-white/15'
        }`}
      >
        <Upload className="size-6 text-ink-400" />
        <p className="text-sm text-ink-600 dark:text-ink-400">
          Drag images here, or{' '}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            choose files
          </button>
        </p>
        <p className="text-xs text-ink-500">PNG, JPEG, GIF or WebP · up to 5 MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="sr-only"
          onChange={(e) => {
            pick(e.target.files)
            e.target.value = ''
          }}
        />
        {upload.isPending && (
          <p className="inline-flex items-center gap-2 text-sm text-ink-600">
            <Loader2 className="size-4 animate-spin" /> Uploading…
          </p>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 space-y-2" role="alert">
          {errors.map((m, i) => (
            <p key={i} className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {m}
            </p>
          ))}
        </div>
      )}

      <div className="mt-6">
        {media.isLoading && <p className="text-sm text-ink-500">Loading…</p>}
        {media.isError && <ErrorState title="Couldn’t load images" message={(media.error as Error).message} />}
        {media.data?.length === 0 && <p className="text-sm text-ink-500">No images yet. Upload your first one above.</p>}
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.data?.map((m) => (
            <li
              key={m.id}
              className="overflow-hidden rounded-2xl border border-ink-200 bg-white dark:border-white/10 dark:bg-white/5"
            >
              <div className="aspect-[4/3] bg-ink-100 dark:bg-white/5">
                <img src={m.url} alt={m.name} loading="lazy" className="size-full object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium" title={m.name}>
                  {m.name}
                </p>
                <p className="text-[11px] text-ink-500">{formatBytes(m.size)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {onPick ? (
                    <button type="button" onClick={() => onPick(m.url)} className="btn-primary !px-3 !py-1.5 !text-xs">
                      Use this image
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => copy(m)} className={`${smallBtn} !px-2.5 !py-1 !text-xs`}>
                        {copied === m.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        {copied === m.id ? 'Copied' : 'Copy address'}
                      </button>
                      <button
                        type="button"
                        disabled={remove.isPending}
                        onClick={() => {
                          if (window.confirm(`Delete “${m.name}”? This can’t be undone.`)) remove.mutate(m.id)
                        }}
                        className={`${dangerBtn} !px-2.5 !py-1 !text-xs`}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
