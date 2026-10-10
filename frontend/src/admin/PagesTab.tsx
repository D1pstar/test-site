import { useCallback, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { FieldForm, type Obj } from './fields'
import { BLOCK_SPECS, BLOCK_TYPES, newBlock, summarize } from './block-specs'
import Modal from './Modal'
import PreviewFrame from './PreviewFrame'
import { useEditor } from './editor'
import { dangerBtn, iconBtn, inputClass, labelClass, helpClass, panel, slugify, smallBtn } from './ui'
import { makeId, type Block, type BlockType, type Page } from '../lib/site-types'
import { pathError } from '../lib/site-validate'

export default function PagesTab() {
  const { content, setContent } = useEditor()
  const [pageId, setPageId] = useState(content.pages[0]?.id ?? '')
  const [openBlock, setOpenBlock] = useState<string | null>(null)
  const [adding, setAdding] = useState<number | null>(null) // insert index
  const [newPage, setNewPage] = useState(false)

  const page = content.pages.find((p) => p.id === pageId) ?? content.pages[0]

  const updatePage = useCallback(
    (fn: (p: Page) => Page) => {
      setContent((c) => ({ ...c, pages: c.pages.map((p) => (p.id === page.id ? fn(p) : p)) }))
    },
    [setContent, page.id],
  )
  const setBlocks = (fn: (b: Block[]) => Block[]) => updatePage((p) => ({ ...p, blocks: fn(p.blocks) }))

  const onNavigate = useCallback(
    (path: string) => {
      const target = content.pages.find((p) => p.path === path)
      if (target) setPageId(target.id)
    },
    [content.pages],
  )

  function move(i: number, d: -1 | 1) {
    setBlocks((blocks) => {
      const j = i + d
      if (j < 0 || j >= blocks.length) return blocks
      const next = [...blocks]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }
  function duplicate(i: number) {
    const copy = { ...JSON.parse(JSON.stringify(page.blocks[i])), id: makeId() } as Block
    setBlocks((b) => [...b.slice(0, i + 1), copy, ...b.slice(i + 1)])
    setOpenBlock(copy.id)
  }
  function remove(i: number) {
    if (!window.confirm('Remove this block from the page?')) return
    setBlocks((b) => b.filter((_, j) => j !== i))
  }
  function insert(type: BlockType, at: number) {
    const block = newBlock(type)
    setBlocks((b) => [...b.slice(0, at), block, ...b.slice(at)])
    setOpenBlock(block.id)
    setAdding(null)
  }
  function deletePage() {
    if (page.path === '/') return
    if (!window.confirm(`Delete the page “${page.title}” (${page.path})? This can’t be undone after you publish.`)) return
    const rest = content.pages.filter((p) => p.id !== page.id)
    setContent((c) => ({ ...c, pages: rest }))
    setPageId(rest[0].id)
  }

  const otherPaths = content.pages.filter((p) => p.id !== page.id).map((p) => p.path)
  const pathProblem = pathError(page.path, otherPaths)

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        {/* Page picker */}
        <div className={panel}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[12rem] flex-1">
              <label htmlFor="page-select" className={labelClass}>
                Page
              </label>
              <select id="page-select" value={page.id} onChange={(e) => setPageId(e.target.value)} className={inputClass}>
                {content.pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.path}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" onClick={() => setNewPage(true)} className={smallBtn}>
              <Plus className="size-4" /> New page
            </button>
            <button
              type="button"
              onClick={deletePage}
              disabled={page.path === '/'}
              title={page.path === '/' ? 'The home page can’t be deleted' : 'Delete this page'}
              className={dangerBtn}
            >
              <Trash2 className="size-4" /> Delete page
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="page-title" className={labelClass}>
                Page name
              </label>
              <input
                id="page-title"
                value={page.title}
                maxLength={120}
                onChange={(e) => updatePage((p) => ({ ...p, title: e.target.value }))}
                className={inputClass}
              />
              <p className={helpClass}>Shown in the browser tab and search results.</p>
            </div>
            <div>
              <label htmlFor="page-path" className={labelClass}>
                Web address
              </label>
              <input
                id="page-path"
                value={page.path}
                disabled={page.path === '/'}
                maxLength={120}
                aria-invalid={Boolean(pathProblem)}
                onChange={(e) => updatePage((p) => ({ ...p, path: e.target.value.toLowerCase() }))}
                className={`${inputClass} font-mono disabled:opacity-60`}
              />
              {pathProblem ? (
                <p className="mt-1 text-xs text-red-600">{pathProblem}</p>
              ) : (
                <p className={helpClass}>
                  {page.path === '/' ? 'The home page always lives at /.' : 'Links to the old address will stop working.'}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="page-desc" className={labelClass}>
                Search description
              </label>
              <textarea
                id="page-desc"
                rows={2}
                value={page.description}
                maxLength={300}
                onChange={(e) => updatePage((p) => ({ ...p, description: e.target.value }))}
                className={inputClass}
              />
              <p className={helpClass}>One or two sentences shown by Google and when the link is shared.</p>
            </div>
          </div>
        </div>

        {/* Blocks */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-500">
            Sections on this page ({page.blocks.length})
          </h2>
          <ol className="mt-3 space-y-2">
            <InsertRow onClick={() => setAdding(0)} />
            {page.blocks.map((b, i) => (
              <li key={b.id}>
                <BlockCard
                  block={b}
                  index={i}
                  count={page.blocks.length}
                  open={openBlock === b.id}
                  onToggleOpen={() => setOpenBlock(openBlock === b.id ? null : b.id)}
                  onChange={(next) => setBlocks((bl) => bl.map((x) => (x.id === b.id ? next : x)))}
                  onMove={(d) => move(i, d)}
                  onDuplicate={() => duplicate(i)}
                  onDelete={() => remove(i)}
                />
                <InsertRow onClick={() => setAdding(i + 1)} />
              </li>
            ))}
          </ol>
          {page.blocks.length === 0 && (
            <p className="mt-3 rounded-2xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-500 dark:border-white/15">
              This page is empty. Add your first section.
            </p>
          )}
        </div>
      </div>

      <div className="hidden xl:block">
        <div className="sticky top-24 h-[calc(100vh-8rem)]">
          <PreviewFrame content={content} path={page.path} onNavigate={onNavigate} />
        </div>
      </div>

      {adding !== null && (
        <Modal title="Add a section" wide onClose={() => setAdding(null)}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {BLOCK_TYPES.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => insert(t, adding)}
                  className="h-full w-full rounded-2xl border border-ink-200 p-4 text-left transition-colors hover:border-brand-500 hover:bg-brand-500/5 dark:border-white/10"
                >
                  <span className="block font-semibold">{BLOCK_SPECS[t].label}</span>
                  <span className="mt-1 block text-xs text-ink-500">{BLOCK_SPECS[t].description}</span>
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {newPage && (
        <NewPageDialog
          existing={content.pages.map((p) => p.path)}
          onClose={() => setNewPage(false)}
          onCreate={(p) => {
            setContent((c) => ({ ...c, pages: [...c.pages, p] }))
            setPageId(p.id)
            setNewPage(false)
          }}
        />
      )}
    </div>
  )
}

function InsertRow({ onClick }: { onClick: () => void }) {
  return (
    <div className="group flex h-5 items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label="Add a section here"
        className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-[11px] font-medium text-transparent transition-all group-hover:border-ink-200 group-hover:text-ink-500 focus-visible:border-ink-300 focus-visible:text-ink-600 dark:group-hover:border-white/15"
      >
        <Plus className="size-3" /> add section here
      </button>
    </div>
  )
}

function BlockCard({
  block,
  index,
  count,
  open,
  onToggleOpen,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
}: {
  block: Block
  index: number
  count: number
  open: boolean
  onToggleOpen: () => void
  onChange: (b: Block) => void
  onMove: (d: -1 | 1) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const spec = BLOCK_SPECS[block.type]
  const summary = summarize(block)

  return (
    <div
      className={`rounded-2xl border bg-white/80 dark:bg-white/[0.04] ${
        open ? 'border-brand-500/60 shadow-lg shadow-brand-900/5' : 'border-ink-200 dark:border-white/10'
      } ${block.hidden ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          {open ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {spec.label}
              {block.hidden && <span className="ml-2 rounded-full bg-ink-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-600">Hidden</span>}
            </span>
            {summary && <span className="block truncate text-xs text-ink-500">{summary}</span>}
          </span>
        </button>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" className={iconBtn} aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="size-4" />
          </button>
          <button type="button" className={iconBtn} aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
            <ArrowDown className="size-4" />
          </button>
          <button
            type="button"
            className={iconBtn}
            aria-label={block.hidden ? 'Show on the site' : 'Hide from the site'}
            title={block.hidden ? 'Show on the site' : 'Hide from the site'}
            onClick={() => onChange({ ...block, hidden: !block.hidden })}
          >
            {block.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
          <button type="button" className={iconBtn} aria-label="Duplicate" title="Duplicate" onClick={onDuplicate}>
            <Copy className="size-4" />
          </button>
          <button type="button" className={iconBtn} aria-label="Delete section" title="Delete" onClick={onDelete}>
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-200 p-4 dark:border-white/10">
          <FieldForm
            fields={spec.fields}
            value={block.props as unknown as Obj}
            onChange={(props) => onChange({ ...block, props } as Block)}
          />
        </div>
      )}
    </div>
  )
}

function NewPageDialog({
  existing,
  onClose,
  onCreate,
}: {
  existing: string[]
  onClose: () => void
  onCreate: (p: Page) => void
}) {
  const [title, setTitle] = useState('')
  const [path, setPath] = useState('')
  const [touchedPath, setTouchedPath] = useState(false)
  const [template, setTemplate] = useState<'basic' | 'blank'>('basic')

  const effectivePath = touchedPath ? path : `/${slugify(title)}`
  const problem = title.trim() ? pathError(effectivePath, existing) : null
  const canCreate = title.trim().length > 0 && !pathError(effectivePath, existing) && effectivePath !== '/'

  function create() {
    const blocks: Block[] =
      template === 'blank'
        ? []
        : [
            { ...newBlock('page_header'), props: { eyebrow: '', title: title.trim(), description: '', align: 'left' } } as Block,
            newBlock('text'),
            newBlock('cta_band'),
          ]
    onCreate({ id: makeId(), path: effectivePath, title: title.trim(), description: '', blocks })
  }

  return (
    <Modal title="New page" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canCreate) create()
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="np-title" className={labelClass}>
            Page name
          </label>
          <input id="np-title" autoFocus value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="np-path" className={labelClass}>
            Web address
          </label>
          <input
            id="np-path"
            value={effectivePath}
            maxLength={120}
            onChange={(e) => {
              setTouchedPath(true)
              setPath(e.target.value.toLowerCase())
            }}
            className={`${inputClass} font-mono`}
          />
          {problem && <p className="mt-1 text-xs text-red-600">{problem}</p>}
        </div>
        <div>
          <label htmlFor="np-template" className={labelClass}>
            Start with
          </label>
          <select id="np-template" value={template} onChange={(e) => setTemplate(e.target.value as 'basic' | 'blank')} className={inputClass}>
            <option value="basic">A heading, a text section and a call-to-action banner</option>
            <option value="blank">An empty page</option>
          </select>
        </div>
        <p className="text-xs text-ink-500">
          Remember to add the page to the menu under <strong>Navigation &amp; footer</strong>.
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={smallBtn}>
            Cancel
          </button>
          <button type="submit" disabled={!canCreate} className="btn-primary !px-5 !py-2 disabled:opacity-50">
            Create page
          </button>
        </div>
      </form>
    </Modal>
  )
}
