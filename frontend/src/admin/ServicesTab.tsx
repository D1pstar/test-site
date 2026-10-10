import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeleton'
import { useServices } from '../hooks/useServices'
import { getIcon } from '../lib/icons'
import { siteApi, type ServiceInput } from '../lib/site-api'
import { FieldForm, type FieldSpec, type Obj } from './fields'
import { dangerBtn, panel, slugify, smallBtn } from './ui'

const FIELDS: FieldSpec[] = [
  { kind: 'text', key: 'title', label: 'Title', max: 120 },
  { kind: 'text', key: 'slug', label: 'Web address ending', max: 80, help: 'Lowercase letters, numbers and dashes. The page will be /services/<this>.' },
  { kind: 'text', key: 'summary', label: 'Short summary', max: 240, help: 'Shown on the service card.' },
  {
    kind: 'textarea',
    key: 'description',
    label: 'Full description',
    max: 10000,
    rows: 8,
    help: 'Shown on the service’s own page. Leave a blank line between paragraphs.',
  },
  { kind: 'icon', key: 'icon', label: 'Icon' },
  { kind: 'number', key: 'sort_order', label: 'Order', min: 0, max: 10000, help: 'Smaller numbers come first.' },
]

const EMPTY: ServiceInput = { slug: '', title: '', summary: '', description: '', icon: 'Sparkles', sort_order: 0 }

export default function ServicesTab() {
  const qc = useQueryClient()
  const services = useServices()
  const [editing, setEditing] = useState<{ id: number | null; data: ServiceInput } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const save = useMutation({
    mutationFn: ({ id, data }: { id: number | null; data: ServiceInput }) =>
      id === null ? siteApi.services.create(data) : siteApi.services.update(id, data),
    onSuccess: () => {
      setEditing(null)
      setError(null)
      qc.invalidateQueries({ queryKey: ['services'] })
    },
    onError: (e) => setError((e as Error).message),
  })
  const remove = useMutation({
    mutationFn: (id: number) => siteApi.services.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
    onError: (e) => setError((e as Error).message),
  })

  function change(next: Obj) {
    setEditing((cur) => {
      if (!cur) return cur
      const prev = cur.data
      const data = next as unknown as ServiceInput
      // While creating, keep the address in step with the title until it is edited by hand.
      if (cur.id === null && prev.slug === slugify(prev.title)) data.slug = slugify(data.title)
      return { ...cur, data }
    })
  }

  const sorted = [...(services.data ?? [])].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-600 dark:text-ink-400">
          Services have their own pages, so changes here go live <strong>immediately</strong> (no draft step).
        </p>
        <button
          type="button"
          className="btn-primary !px-5 !py-2"
          onClick={() => {
            setError(null)
            setEditing({ id: null, data: { ...EMPTY, sort_order: (sorted.at(-1)?.sort_order ?? 0) + 1 } })
          }}
        >
          <Plus className="size-4" /> New service
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {editing && (
        <form
          className={panel}
          onSubmit={(e) => {
            e.preventDefault()
            setError(null)
            save.mutate(editing)
          }}
        >
          <h2 className="mb-4 text-lg font-semibold tracking-tight">{editing.id === null ? 'New service' : 'Edit service'}</h2>
          <FieldForm fields={FIELDS} value={editing.data as unknown as Obj} onChange={change} />
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className={smallBtn} onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button type="submit" disabled={save.isPending} className="btn-primary !px-5 !py-2 disabled:opacity-60">
              {save.isPending ? 'Saving…' : 'Save service'}
            </button>
          </div>
        </form>
      )}

      {services.isLoading && <Skeleton className="h-24 w-full" />}
      {services.isError && <ErrorState title="Couldn’t load services" message={(services.error as Error).message} />}
      <ul className="space-y-3">
        {sorted.map((s) => {
          const Icon = getIcon(s.icon)
          return (
            <li key={s.id} className={`${panel} flex items-start gap-4`}>
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.title}</p>
                <p className="truncate text-xs text-ink-500">/services/{s.slug}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-600 dark:text-ink-400">{s.summary}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className={smallBtn}
                  onClick={() => {
                    setError(null)
                    setEditing({
                      id: s.id,
                      data: {
                        slug: s.slug,
                        title: s.title,
                        summary: s.summary,
                        description: s.description,
                        icon: s.icon,
                        sort_order: s.sort_order,
                      },
                    })
                  }}
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                <button
                  type="button"
                  className={dangerBtn}
                  disabled={remove.isPending}
                  onClick={() => {
                    if (window.confirm(`Delete the service “${s.title}”? Its page will disappear.`)) remove.mutate(s.id)
                  }}
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      {services.data?.length === 0 && <p className="text-sm text-ink-500">No services yet.</p>}
    </div>
  )
}
