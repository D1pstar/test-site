import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Download,
  FileUp,
  Loader2,
  PenLine,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { api } from '../lib/api-client'
import { siteApi } from '../lib/site-api'
import {
  EMPTY_BRIEF,
  FONT_STYLES,
  PAGE_CHOICES,
  TONES,
  briefProblem,
  briefToJson,
  buildFixPrompt,
  buildPrompt,
  extractJson,
  normalizeConfig,
  type Brief,
  type Generated,
} from '../lib/site-config'
import { useEditor } from './editor'
import PreviewFrame from './PreviewFrame'
import { inputClass, labelClass, helpClass, panel, smallBtn } from './ui'

const STORAGE_KEY = 'site-generator-brief-v1'

const EXAMPLE: Brief = {
  ...EMPTY_BRIEF,
  businessName: 'Sunrise Bakery',
  industry: 'Neighbourhood bakery and café',
  description:
    'Family-run bakery baking sourdough, pastries and custom celebration cakes every morning from scratch. Dine-in café with ten seats.',
  location: 'Louisville, KY',
  audience: 'Local families, office workers on their way in, and people ordering cakes for birthdays and weddings.',
  tone: 'friendly',
  goal: 'Order a custom cake or visit the shop',
  pages: ['about', 'services', 'faq', 'contact'],
  services: 'Sourdough & everyday breads — baked fresh each morning\nPastries & breakfast — croissants, muffins, coffee\nCustom celebration cakes — birthdays, weddings, order 1 week ahead\nCatering boxes — for offices and events',
  about: 'Started in 2016 by two sisters who wanted bread like their grandmother made. Everything is baked on site, using flour from a local mill.',
  email: 'hello@sunrisebakery.example',
  phone: '(502) 555-0142',
  responseTime: 'Cake enquiries are answered within a day.',
  brandColor: '#d9822b',
  fontStyle: 'friendly',
  mustInclude: 'Opening hours: Tue–Sat 7am–3pm, Sun 8am–1pm. Closed Mondays.',
  avoid: 'Do not mention gluten-free (we do not offer it).',
}

function loadBrief(): Brief {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...EMPTY_BRIEF, ...(JSON.parse(raw) as Partial<Brief>) }
  } catch {
    // storage unavailable or corrupt: start empty
  }
  return EMPTY_BRIEF
}

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

const STEPS = [
  { n: 1, label: 'Describe the client' },
  { n: 2, label: 'Ask an AI' },
  { n: 3, label: 'Review & apply' },
] as const

export default function GeneratorTab() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [brief, setBrief] = useState<Brief>(loadBrief)
  const [reply, setReply] = useState('')
  const [result, setResult] = useState<Checked | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brief))
    } catch {
      // not critical
    }
  }, [brief])

  const problem = briefProblem(brief)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-7 text-white shadow-lg sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="size-3.5" /> Site generator
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Build a client’s site from a brief</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
            Answer a few questions about the client, hand the result to any AI, then paste its answer back. You get a
            complete site in your draft, ready to tweak and publish.
          </p>
        </div>
      </section>

      <ol className="grid gap-3 sm:grid-cols-3" aria-label="Steps">
        {STEPS.map((s) => {
          const done = step > s.n
          const active = step === s.n
          const reachable = s.n === 1 || (s.n === 2 && !problem) || (s.n === 3 && !problem)
          return (
            <li key={s.n}>
              <button
                type="button"
                disabled={!reachable}
                aria-current={active ? 'step' : undefined}
                onClick={() => setStep(s.n)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-ink-200 bg-white/70 hover:bg-ink-900/[0.03] dark:border-white/10 dark:bg-white/[0.03]'
                }`}
              >
                <span
                  className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    done || active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300'
                  }`}
                >
                  {done ? <Check className="size-4" /> : s.n}
                </span>
                <span className="text-sm font-medium">{s.label}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <BriefStep
          brief={brief}
          setBrief={setBrief}
          problem={problem}
          onNext={() => {
            setStep(2)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
      {step === 2 && (
        <PromptStep
          brief={brief}
          onBack={() => setStep(1)}
          onNext={() => {
            setStep(3)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
      {step === 3 && <ImportStep reply={reply} setReply={setReply} result={result} setResult={setResult} onBack={() => setStep(2)} />}
    </div>
  )
}

// --------------------------------------------------------------------------
// Step 1
// --------------------------------------------------------------------------

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className={panel}>
      <h3 className="text-base font-semibold">{title}</h3>
      {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function Field({ id, label, help, children }: { id: string; label: string; help?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {help && <p className={helpClass}>{help}</p>}
    </div>
  )
}

function BriefStep({
  brief,
  setBrief,
  problem,
  onNext,
}: {
  brief: Brief
  setBrief: (b: Brief) => void
  problem: string | null
  onNext: () => void
}) {
  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setBrief({ ...brief, [k]: v })
  const text = (k: keyof Brief, id: string, props: { rows?: number; placeholder?: string; max?: number } = {}) =>
    props.rows ? (
      <textarea
        id={id}
        rows={props.rows}
        value={brief[k] as string}
        maxLength={props.max ?? 2000}
        placeholder={props.placeholder}
        onChange={(e) => set(k, e.target.value as never)}
        className={inputClass}
      />
    ) : (
      <input
        id={id}
        value={brief[k] as string}
        maxLength={props.max ?? 200}
        placeholder={props.placeholder}
        onChange={(e) => set(k, e.target.value as never)}
        className={inputClass}
      />
    )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-600 dark:text-ink-300">The more specific you are, the better the first draft. Only the name and what they do are required.</p>
        <div className="flex gap-2">
          <button type="button" className={smallBtn} onClick={() => setBrief(EXAMPLE)}>
            <Wand2 className="size-4" /> Fill with an example
          </button>
          <button
            type="button"
            className={smallBtn}
            onClick={() => {
              if (window.confirm('Clear everything you typed?')) setBrief(EMPTY_BRIEF)
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <Card title="The business">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="b-name" label="Business name *">
            {text('businessName', 'b-name', { placeholder: 'Sunrise Bakery', max: 60 })}
          </Field>
          <Field id="b-industry" label="What do they do? *" help="A few words.">
            {text('industry', 'b-industry', { placeholder: 'Neighbourhood bakery and café' })}
          </Field>
        </div>
        <Field id="b-desc" label="Tell the story" help="What they offer, what makes them different, anything an outsider wouldn’t know.">
          {text('description', 'b-desc', { rows: 4 })}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="b-loc" label="Where are they?">
            {text('location', 'b-loc', { placeholder: 'City, State' })}
          </Field>
          <Field id="b-aud" label="Who are the customers?">
            {text('audience', 'b-aud', { placeholder: 'Local families, offices…' })}
          </Field>
        </div>
      </Card>

      <Card title="Voice & goal">
        <fieldset>
          <legend className={labelClass}>How should the site sound?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={brief.tone === t.id}
                onClick={() => set('tone', t.id)}
                className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  brief.tone === t.id
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-ink-200 hover:bg-ink-900/[0.03] dark:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="block text-xs text-ink-500">{t.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <Field id="b-goal" label="What should visitors do?" help="The one main action: call, book, request a quote, visit…">
          {text('goal', 'b-goal', { placeholder: 'Order a custom cake or visit the shop' })}
        </Field>
      </Card>

      <Card title="Pages & services" hint="The home page is always included.">
        <fieldset>
          <legend className={labelClass}>Which pages?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {PAGE_CHOICES.map((p) => {
              const on = brief.pages.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set('pages', on ? brief.pages.filter((x) => x !== p.id) : [...brief.pages, p.id])}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    on
                      ? 'border-brand-500 bg-brand-500/10 text-brand-800 dark:text-brand-200'
                      : 'border-ink-200 text-ink-600 hover:bg-ink-900/5 dark:border-white/10 dark:text-ink-300'
                  }`}
                >
                  {on && <Check className="size-3.5" />}
                  {p.label}
                </button>
              )
            })}
          </div>
        </fieldset>
        <Field id="b-other" label="Any other pages?" help="Separate with commas, e.g. Gallery, Careers, Wedding cakes.">
          {text('otherPages', 'b-other')}
        </Field>
        <Field id="b-services" label="Services or products" help="One per line. You can add a short description after a dash.">
          {text('services', 'b-services', { rows: 5, placeholder: 'Custom cakes — birthdays and weddings\nCatering boxes — for offices' })}
        </Field>
        <Field id="b-about" label="About / history / values" help="Used for the About page.">
          {text('about', 'b-about', { rows: 3 })}
        </Field>
      </Card>

      <Card title="Contact details" hint="Shown on the contact page and in the footer. Leave out anything they don’t want public.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="b-email" label="Email">
            {text('email', 'b-email', { placeholder: 'hello@example.com', max: 120 })}
          </Field>
          <Field id="b-phone" label="Phone">
            {text('phone', 'b-phone', { max: 40 })}
          </Field>
          <Field id="b-resp" label="Reply-time note">
            {text('responseTime', 'b-resp', { placeholder: 'We reply within a day.' })}
          </Field>
        </div>
      </Card>

      <Card title="Look & feel">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className={labelClass}>Brand colour</span>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="color"
                aria-label="Pick a brand colour"
                value={/^#[0-9a-fA-F]{6}$/.test(brief.brandColor) ? brief.brandColor : '#3f82f0'}
                onChange={(e) => set('brandColor', e.target.value)}
                className="size-10 cursor-pointer rounded-lg border border-ink-300 bg-transparent p-0.5 dark:border-white/15"
              />
              <input
                aria-label="Brand colour hex"
                value={brief.brandColor}
                placeholder="Let the AI choose"
                maxLength={7}
                onChange={(e) => set('brandColor', e.target.value.trim())}
                className={`${inputClass} !mt-0 font-mono`}
              />
              {brief.brandColor && (
                <button type="button" className={smallBtn} onClick={() => set('brandColor', '')}>
                  Clear
                </button>
              )}
            </div>
            <p className={helpClass}>If they have a logo colour, use it. Otherwise leave blank.</p>
          </div>
          <Field id="b-font" label="Fonts">
            <select id="b-font" value={brief.fontStyle} onChange={(e) => set('fontStyle', e.target.value as Brief['fontStyle'])} className={inputClass}>
              {FONT_STYLES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card title="Anything else?" hint="Optional, but this is where the good details go.">
        <Field id="b-must" label="Must include" help="Opening hours, awards you can prove, delivery area, a slogan…">
          {text('mustInclude', 'b-must', { rows: 3 })}
        </Field>
        <Field id="b-avoid" label="Avoid">
          {text('avoid', 'b-avoid', { rows: 2 })}
        </Field>
        <Field id="b-extra" label="Other notes or competitor sites they like">
          {text('extra', 'b-extra', { rows: 3 })}
        </Field>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-ink-900/90">
        <p role="status" className={`text-sm ${problem ? 'text-amber-700 dark:text-amber-300' : 'text-ink-500'}`}>
          {problem ?? 'Looks good. Saved automatically in this browser.'}
        </p>
        <button type="button" className="btn-primary" disabled={Boolean(problem)} onClick={onNext}>
          Create the AI prompt <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// Step 2
// --------------------------------------------------------------------------

function PromptStep({ brief, onBack, onNext }: { brief: Brief; onBack: () => void; onNext: () => void }) {
  const prompt = useMemo(() => buildPrompt(brief), [brief])
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)
  const [full, setFull] = useState(false)
  const area = useRef<HTMLTextAreaElement>(null)
  const slug = (brief.businessName || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  async function copy() {
    const ok = await copyText(prompt)
    if (!ok) area.current?.select()
    setCopied(ok ? 'ok' : 'fail')
    window.setTimeout(() => setCopied(null), 3000)
  }

  return (
    <div className="space-y-5">
      <section className={panel}>
        <h3 className="text-base font-semibold">Give this to any AI</h3>
        <ol className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-300">
          <li className="flex gap-3">
            <Num n={1} /> Copy the prompt below (it already contains the client details and the exact format to answer in).
          </li>
          <li className="flex gap-3">
            <Num n={2} /> Paste it into an AI chat, such as Claude, ChatGPT or Gemini, and send it.
          </li>
          <li className="flex gap-3">
            <Num n={3} /> Copy the AI’s whole reply and bring it back here.
          </li>
        </ol>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" className="btn-primary" onClick={copy}>
            {copied === 'ok' ? <CheckCircle2 className="size-4" /> : <ClipboardCopy className="size-4" />}
            {copied === 'ok' ? 'Copied' : 'Copy prompt'}
          </button>
          <button type="button" className={smallBtn} onClick={() => download(`${slug}-prompt.txt`, prompt, 'text/plain')}>
            <Download className="size-4" /> Download prompt
          </button>
          <button
            type="button"
            className={smallBtn}
            onClick={() => download(`${slug}-brief.json`, JSON.stringify(briefToJson(brief), null, 2), 'application/json')}
          >
            <Download className="size-4" /> Download brief only (.json)
          </button>
          {copied === 'fail' && (
            <span role="alert" className="text-sm text-amber-700 dark:text-amber-300">
              Couldn’t copy automatically. The text is selected: press Ctrl+C.
            </span>
          )}
        </div>
      </section>

      <section className={panel}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">The prompt</h3>
          <span className="text-xs text-ink-500">{prompt.split(/\s+/).length.toLocaleString()} words</span>
        </div>
        <textarea
          ref={area}
          readOnly
          value={prompt}
          rows={full ? 28 : 8}
          aria-label="Prompt for the AI"
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button type="button" className="mt-2 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300" onClick={() => setFull(!full)}>
          {full ? 'Show less' : 'Show more'}
        </button>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className={smallBtn} onClick={onBack}>
          <ArrowLeft className="size-4" /> Edit the brief
        </button>
        <button type="button" className="btn-primary" onClick={onNext}>
          I have the AI’s answer <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function Num({ n }: { n: number }) {
  return (
    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-800 dark:text-brand-200">
      {n}
    </span>
  )
}

// --------------------------------------------------------------------------
// Step 3
// --------------------------------------------------------------------------

type Checked =
  | { kind: 'error'; message: string }
  | { kind: 'problems'; problems: string[]; notes: string[] }
  | { kind: 'ok'; generated: Generated }

function ImportStep({
  reply,
  setReply,
  result,
  setResult,
  onBack,
}: {
  reply: string
  setReply: (s: string) => void
  result: Checked | null
  setResult: (r: Checked | null) => void
  onBack: () => void
}) {
  const [busy, setBusy] = useState(false)
  const file = useRef<HTMLInputElement>(null)

  async function check() {
    setBusy(true)
    setResult(null)
    try {
      const parsed = extractJson(reply)
      if ('error' in parsed) return setResult({ kind: 'error', message: parsed.error })
      const norm = normalizeConfig(parsed.value)
      if (!norm.ok) return setResult({ kind: 'error', message: norm.error })
      const { content, services, notes } = norm.result
      const res = await siteApi.admin.check(content, services)
      if (!res.ok) {
        return setResult({ kind: 'problems', problems: res.problems.map((p) => `${p.where}: ${p.message}`), notes })
      }
      setResult({ kind: 'ok', generated: norm.result })
    } catch (e) {
      setResult({ kind: 'error', message: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className={panel}>
        <h3 className="text-base font-semibold">Paste the AI’s answer</h3>
        <p className="mt-0.5 text-sm text-ink-500">Paste the whole reply. Extra text around the JSON is fine.</p>
        <textarea
          value={reply}
          onChange={(e) => {
            setReply(e.target.value)
            setResult(null)
          }}
          rows={10}
          aria-label="AI reply"
          placeholder='{ "format": "site-config/1", … }'
          className={`${inputClass} font-mono text-xs`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className="btn-primary" disabled={busy || reply.trim().length < 20} onClick={check}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Check &amp; preview
          </button>
          <input
            ref={file}
            type="file"
            accept=".json,.txt,.md,application/json,text/plain"
            className="sr-only"
            aria-label="Upload the AI’s answer as a file"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              if (f.size > 2_000_000) return setResult({ kind: 'error', message: 'That file is too large to be a site config.' })
              setReply(await f.text())
              setResult(null)
            }}
          />
          <button type="button" className={smallBtn} onClick={() => file.current?.click()}>
            <FileUp className="size-4" /> Upload a file instead
          </button>
          <button type="button" className={smallBtn} onClick={onBack}>
            <ArrowLeft className="size-4" /> Back to the prompt
          </button>
        </div>
      </section>

      {result?.kind === 'error' && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {result.message}
        </div>
      )}
      {result?.kind === 'problems' && <Problems problems={result.problems} notes={result.notes} />}
      {result?.kind === 'ok' && <Review generated={result.generated} />}
    </div>
  )
}

function Problems({ problems, notes }: { problems: string[]; notes: string[] }) {
  const [copied, setCopied] = useState(false)
  return (
    <section role="alert" className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
      <h3 className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
        <AlertTriangle className="size-4" /> The AI’s answer needs a few fixes
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-100">
        {problems.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {notes.length > 0 && <p className="text-xs text-amber-800/80 dark:text-amber-200/70">{notes.join(' ')}</p>}
      <button
        type="button"
        className={smallBtn}
        onClick={async () => {
          setCopied(await copyText(buildFixPrompt(problems)))
          window.setTimeout(() => setCopied(false), 3000)
        }}
      >
        {copied ? <CheckCircle2 className="size-4" /> : <ClipboardCopy className="size-4" />}
        {copied ? 'Copied' : 'Copy a “please fix this” message for the AI'}
      </button>
      <p className="text-xs text-amber-800/80 dark:text-amber-200/70">
        Paste that into the same AI chat, then paste its corrected reply above.
      </p>
    </section>
  )
}

function Review({ generated }: { generated: Generated }) {
  const editor = useEditor()
  const qc = useQueryClient()
  const [, setParams] = useSearchParams()
  const { content, services, notes } = generated
  const [pagePath, setPagePath] = useState('/')
  const [replaceServices, setReplaceServices] = useState(true)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const blocks = content.pages.reduce((n, p) => n + p.blocks.length, 0)

  async function apply() {
    const hasWork = editor.dirty || editor.status === 'draft'
    if (hasWork && !window.confirm('This replaces the pages, theme, menu and footer in your current draft. Continue?')) return
    setBusy(true)
    setError(null)
    const failures: string[] = []
    try {
      if (services.length > 0) {
        const existing = await api.getServices()
        if (replaceServices) {
          for (const s of existing) await siteApi.services.remove(s.id)
        }
        const taken = new Set(replaceServices ? [] : existing.map((s) => s.slug))
        for (const s of services) {
          if (taken.has(s.slug)) {
            failures.push(`“${s.title}” already exists, so I skipped it.`)
            continue
          }
          try {
            await siteApi.services.create(s)
          } catch (e) {
            failures.push(`“${s.title}”: ${(e as Error).message}`)
          }
        }
        await qc.invalidateQueries({ queryKey: ['services'] })
      }
      editor.setContent(() => content)
      setDone(
        `Applied to your draft: ${content.pages.length} pages, ${blocks} sections${services.length ? `, ${services.length} services` : ''}.` +
          (failures.length ? ` Notes: ${failures.join(' ')}` : ''),
      )
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="font-semibold">That config is valid.</p>
          <p className="mt-0.5">
            {content.pages.length} pages · {blocks} sections · {services.length} services · site name “{content.theme.siteName}”
          </p>
        </div>
      </div>

      {notes.length > 0 && (
        <details className="rounded-2xl border border-ink-200 p-4 text-sm dark:border-white/10">
          <summary className="cursor-pointer font-medium">{notes.length} small adjustment{notes.length === 1 ? '' : 's'} made while reading it</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-600 dark:text-ink-300">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </details>
      )}

      <div className={panel}>
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Preview pages">
          {content.pages.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={pagePath === p.path}
              onClick={() => setPagePath(p.path)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                pagePath === p.path ? 'bg-brand-600 text-white' : 'border border-ink-200 text-ink-700 hover:bg-ink-900/5 dark:border-white/10 dark:text-ink-200'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
        <div className="mt-4 h-[640px]">
          <PreviewFrame content={content} path={pagePath} onNavigate={setPagePath} />
        </div>
        <p className="mt-2 text-xs text-ink-500">
          Preview only, nothing is saved yet. Service cards show your current services until you apply.
        </p>
      </div>

      {services.length > 0 && (
        <label className="flex items-start gap-3 rounded-2xl border border-ink-200 p-4 text-sm dark:border-white/10">
          <input type="checkbox" checked={replaceServices} onChange={(e) => setReplaceServices(e.target.checked)} className="mt-0.5 size-4 accent-brand-600" />
          <span>
            <span className="font-medium">Replace the current services with these {services.length}</span>
            <span className="block text-ink-500">Untick to add them alongside the existing ones. Service changes go live immediately, not through Publish.</span>
          </span>
        </label>
      )}

      {done ? (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="size-4" /> {done}
          </p>
          <p className="mt-1">Next: look it over in Pages and Design, add images, then press Publish at the top.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setParams({ tab: 'pages' })} className="btn-primary !px-5 !py-2">
              <PenLine className="size-4" /> Review in Pages
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" disabled={busy} onClick={apply}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Apply to my draft
          </button>
          <span className="text-sm text-ink-500">Nothing goes live until you press Publish.</span>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </section>
  )
}
