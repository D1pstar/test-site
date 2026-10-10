/**
 * Schema-driven form. Block editors, theme, navigation, footer and services are
 * all described as FieldSpec lists and rendered by <FieldForm>.
 */
import { createContext, useContext, useEffect, useId, useState } from 'react'
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2, X } from 'lucide-react'
import { ICON_NAMES, getIcon } from '../lib/icons'
import { safeImage } from '../lib/links'
import MediaLibrary from './MediaLibrary'
import Modal from './Modal'
import { helpClass, iconBtn, inputClass, labelClass, smallBtn } from './ui'

/** Internal page paths offered as suggestions in link fields. */
export const PagePathsContext = createContext<string[]>([])

export type Obj = Record<string, unknown>
type Base = { key: string; label: string; help?: string }

export type FieldSpec =
  | (Base & { kind: 'text'; max?: number; placeholder?: string })
  | (Base & { kind: 'url'; placeholder?: string })
  | (Base & { kind: 'textarea'; max?: number; rows?: number })
  | (Base & { kind: 'select'; options: { value: string | number; label: string }[] })
  | (Base & { kind: 'boolean' })
  | (Base & { kind: 'number'; min?: number; max?: number })
  | (Base & { kind: 'color' })
  | (Base & { kind: 'icon'; allowNone?: boolean })
  | (Base & { kind: 'image' })
  | (Base & { kind: 'link' })
  | (Base & {
      kind: 'list'
      itemName: string
      fields: FieldSpec[]
      create: () => Obj
      max?: number
      /** Show each item's fields side by side (for short items such as links). */
      row?: boolean
    })

export function FieldForm({
  fields,
  value,
  onChange,
  row = false,
}: {
  fields: FieldSpec[]
  value: Obj
  onChange: (next: Obj) => void
  row?: boolean
}) {
  return (
    <div className={row ? 'grid gap-3 sm:grid-cols-2' : 'space-y-4'}>
      {fields.map((f) => (
        <Field key={f.key} spec={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  )
}

function Field({ spec, value, onChange }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId()

  switch (spec.kind) {
    case 'text':
      return (
        <div>
          <label htmlFor={id} className={labelClass}>
            {spec.label}
          </label>
          <input
            id={id}
            value={String(value ?? '')}
            maxLength={spec.max ?? 200}
            placeholder={spec.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {spec.help && <p className={helpClass}>{spec.help}</p>}
        </div>
      )
    case 'url':
      return <UrlInput id={id} spec={spec} value={String(value ?? '')} onChange={onChange} />
    case 'textarea':
      return (
        <div>
          <label htmlFor={id} className={labelClass}>
            {spec.label}
          </label>
          <textarea
            id={id}
            rows={spec.rows ?? 3}
            value={String(value ?? '')}
            maxLength={spec.max ?? 600}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {spec.help && <p className={helpClass}>{spec.help}</p>}
        </div>
      )
    case 'select': {
      const numeric = typeof spec.options[0]?.value === 'number'
      return (
        <div>
          <label htmlFor={id} className={labelClass}>
            {spec.label}
          </label>
          <select
            id={id}
            value={String(value ?? '')}
            onChange={(e) => onChange(numeric ? Number(e.target.value) : e.target.value)}
            className={inputClass}
          >
            {spec.options.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
          {spec.help && <p className={helpClass}>{spec.help}</p>}
        </div>
      )
    }
    case 'boolean':
      return (
        <div>
          <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="size-4 rounded border-ink-300 accent-brand-600"
            />
            {spec.label}
          </label>
          {spec.help && <p className={helpClass}>{spec.help}</p>}
        </div>
      )
    case 'number':
      return (
        <div>
          <label htmlFor={id} className={labelClass}>
            {spec.label}
          </label>
          <input
            id={id}
            type="number"
            min={spec.min}
            max={spec.max}
            value={Number(value ?? 0)}
            onChange={(e) => {
              const n = Math.trunc(Number(e.target.value))
              if (Number.isFinite(n)) onChange(Math.min(spec.max ?? n, Math.max(spec.min ?? n, n)))
            }}
            className={inputClass}
          />
          {spec.help && <p className={helpClass}>{spec.help}</p>}
        </div>
      )
    case 'color':
      return <ColorInput id={id} spec={spec} value={String(value ?? '#000000')} onChange={onChange} />
    case 'icon':
      return <IconPicker spec={spec} value={String(value ?? '')} onChange={onChange} />
    case 'image':
      return <ImageField spec={spec} value={String(value ?? '')} onChange={onChange} />
    case 'link':
      return <LinkField spec={spec} value={(value ?? { label: '', to: '' }) as { label: string; to: string }} onChange={onChange} />
    case 'list':
      return <ListField spec={spec} value={(value ?? []) as Obj[]} onChange={onChange} />
  }
}

// ---------------------------------------------------------------------------

function UrlInput({
  id,
  spec,
  value,
  onChange,
}: {
  id: string
  spec: Extract<FieldSpec, { kind: 'url' }>
  value: string
  onChange: (v: string) => void
}) {
  const paths = useContext(PagePathsContext)
  const listId = `${id}-paths`
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {spec.label}
      </label>
      <input
        id={id}
        list={listId}
        value={value}
        maxLength={500}
        placeholder={spec.placeholder ?? '/contact, https://…, mailto:…'}
        onChange={(e) => onChange(e.target.value.trim())}
        className={inputClass}
      />
      <datalist id={listId}>
        {paths.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      {spec.help && <p className={helpClass}>{spec.help}</p>}
    </div>
  )
}

function LinkField({
  spec,
  value,
  onChange,
}: {
  spec: Extract<FieldSpec, { kind: 'link' }>
  value: { label: string; to: string }
  onChange: (v: unknown) => void
}) {
  const id = useId()
  const paths = useContext(PagePathsContext)
  return (
    <fieldset>
      <legend className={labelClass}>{spec.label}</legend>
      <div className="mt-1 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-l`} className="text-xs text-ink-500">
            Button text
          </label>
          <input
            id={`${id}-l`}
            value={value.label}
            maxLength={80}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
            className={inputClass.replace('mt-1', 'mt-0.5')}
          />
        </div>
        <div>
          <label htmlFor={`${id}-t`} className="text-xs text-ink-500">
            Goes to
          </label>
          <input
            id={`${id}-t`}
            list={`${id}-paths`}
            value={value.to}
            maxLength={500}
            placeholder="/contact or https://…"
            onChange={(e) => onChange({ ...value, to: e.target.value.trim() })}
            className={inputClass.replace('mt-1', 'mt-0.5')}
          />
          <datalist id={`${id}-paths`}>
            {paths.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
      </div>
      <p className={helpClass}>{spec.help ?? 'Leave the button text empty to hide this button.'}</p>
    </fieldset>
  )
}

function ColorInput({
  id,
  spec,
  value,
  onChange,
}: {
  id: string
  spec: Extract<FieldSpec, { kind: 'color' }>
  value: string
  onChange: (v: string) => void
}) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  const valid = /^#[0-9a-fA-F]{6}$/.test(text)
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {spec.label}
      </label>
      <div className="mt-1 flex items-center gap-3">
        <input
          type="color"
          aria-label={`${spec.label} picker`}
          value={valid ? text : value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-ink-300 bg-transparent p-1 dark:border-white/15"
        />
        <input
          id={id}
          value={text}
          maxLength={7}
          onChange={(e) => {
            setText(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value.toLowerCase())
          }}
          aria-invalid={!valid}
          className={`${inputClass.replace('mt-1', '')} max-w-[8rem] font-mono`}
        />
      </div>
      {!valid && <p className="mt-1 text-xs text-red-600">Use a hex colour like #3f82f0</p>}
      {spec.help && <p className={helpClass}>{spec.help}</p>}
    </div>
  )
}

function IconPicker({
  spec,
  value,
  onChange,
}: {
  spec: Extract<FieldSpec, { kind: 'icon' }>
  value: string
  onChange: (v: string) => void
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{spec.label}</legend>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {spec.allowNone && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-pressed={value === ''}
            className={`rounded-lg border px-2.5 text-xs font-medium ${
              value === ''
                ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300'
                : 'border-ink-200 text-ink-600 dark:border-white/10 dark:text-ink-300'
            }`}
          >
            None
          </button>
        )}
        {ICON_NAMES.map((n) => {
          const Icon = getIcon(n)
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              title={n}
              aria-label={n}
              aria-pressed={selected}
              onClick={() => onChange(n)}
              className={`inline-flex size-9 items-center justify-center rounded-lg border transition-colors ${
                selected
                  ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300'
                  : 'border-ink-200 text-ink-600 hover:bg-ink-900/5 dark:border-white/10 dark:text-ink-300 dark:hover:bg-white/10'
              }`}
            >
              <Icon className="size-4" />
            </button>
          )
        })}
      </div>
      {spec.help && <p className={helpClass}>{spec.help}</p>}
    </fieldset>
  )
}

function ImageField({
  spec,
  value,
  onChange,
}: {
  spec: Extract<FieldSpec, { kind: 'image' }>
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const preview = safeImage(value)
  return (
    <div>
      <span className={labelClass}>{spec.label}</span>
      <div className="mt-1 flex items-start gap-3">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-200 bg-ink-100 dark:border-white/10 dark:bg-white/5">
          {preview ? (
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-ink-400" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setOpen(true)} className={smallBtn}>
              {value ? 'Change image' : 'Choose image'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className={smallBtn}>
                <X className="size-3.5" /> Remove
              </button>
            )}
          </div>
          <label htmlFor={id} className="sr-only">
            {spec.label} address
          </label>
          <input
            id={id}
            value={value}
            maxLength={500}
            placeholder="…or paste an https:// image address"
            onChange={(e) => onChange(e.target.value.trim())}
            className={`${inputClass.replace('mt-1', '')} text-xs`}
          />
          {value && !preview && <p className="text-xs text-red-600">Must be an uploaded image or an https:// address.</p>}
        </div>
      </div>
      {spec.help && <p className={helpClass}>{spec.help}</p>}
      {open && (
        <Modal title="Choose an image" wide onClose={() => setOpen(false)}>
          <MediaLibrary
            onPick={(url) => {
              onChange(url)
              setOpen(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}

function ListField({
  spec,
  value,
  onChange,
}: {
  spec: Extract<FieldSpec, { kind: 'list' }>
  value: Obj[]
  onChange: (v: Obj[]) => void
}) {
  const set = (i: number, item: Obj) => onChange(value.map((v, j) => (j === i ? item : v)))
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const full = spec.max !== undefined && value.length >= spec.max

  return (
    <fieldset>
      <legend className={labelClass}>{spec.label}</legend>
      <div className="mt-2 space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-2xl border border-ink-200 bg-ink-50/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {spec.itemName} {i + 1}
              </span>
              <div className="flex gap-1.5">
                <button type="button" className={iconBtn} aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Move down"
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" className={iconBtn} aria-label={`Remove ${spec.itemName}`} onClick={() => remove(i)}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <FieldForm fields={spec.fields} value={item} row={spec.row} onChange={(v) => set(i, v)} />
          </div>
        ))}
      </div>
      <button type="button" disabled={full} onClick={() => onChange([...value, spec.create()])} className={`${smallBtn} mt-3`}>
        <Plus className="size-4" />
        Add {spec.itemName.toLowerCase()}
        {full ? ` (max ${spec.max})` : ''}
      </button>
    </fieldset>
  )
}
