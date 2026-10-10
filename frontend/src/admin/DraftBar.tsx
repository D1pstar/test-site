import { CheckCircle2, ExternalLink, Loader2, RotateCcw, Save, Upload } from 'lucide-react'
import { useEditor } from './editor'
import { smallBtn } from './ui'

const STATUS = {
  unsaved: { text: 'Unsaved changes', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  defaults: {
    text: 'Showing the built-in content. Nothing saved yet',
    cls: 'bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-300',
  },
  draft: { text: 'Draft saved · not published yet', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300' },
  published: { text: 'Published · up to date', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
} as const

/** Save draft / Publish / Discard. Shown on the tabs that edit the site document. */
export default function DraftBar() {
  const e = useEditor()
  const s = STATUS[e.status]
  const working = e.busy !== null
  const blocked = Boolean(e.problem)
  const canDiscard = e.status === 'unsaved' || e.status === 'draft'

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-ink-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-ink-900/90">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`} role="status">
          {e.status === 'published' && <CheckCircle2 className="size-3.5" />}
          {s.text}
        </span>
        {(e.problem || e.error) && (
          <span role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
            {e.problem ?? e.error}
          </span>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <a
            href="/admin/preview?path=%2F"
            target="_blank"
            rel="noopener noreferrer"
            className={smallBtn}
          >
            <ExternalLink className="size-3.5" /> Preview saved draft
          </a>
          <button
            type="button"
            disabled={!canDiscard || working}
            onClick={() => {
              if (window.confirm('Throw away your unpublished changes and go back to the published site?')) e.discard()
            }}
            className={smallBtn}
          >
            {e.busy === 'discard' ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCcw className="size-3.5" />}
            Discard changes
          </button>
          <button type="button" disabled={!e.dirty || working || blocked} onClick={() => e.save()} className={smallBtn}>
            {e.busy === 'save' ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save draft
          </button>
          <button
            type="button"
            disabled={working || blocked || e.status === 'published'}
            onClick={() => {
              if (window.confirm('Publish these changes? Visitors will see them right away.')) e.publish()
            }}
            className="btn-primary !px-5 !py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {e.busy === 'publish' ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
