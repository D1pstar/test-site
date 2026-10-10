import { useState, type FormEvent } from 'react'
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react'
import { Section } from '../Section'
import ErrorState from '../ErrorState'
import { useSubmitContact } from '../../hooks/useContact'
import { useSiteContent } from '../../hooks/useSite'
import { phoneHref } from '../../lib/links'
import type { BlockPropsMap } from '../../lib/site-types'
import type { ContactMessageCreate } from '../../lib/types'

type FormState = { name: string; email: string; company: string; message: string }
const INITIAL: FormState = { name: '', email: '', company: '', message: '' }

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.message.trim()) errors.message = 'Message is required.'
  else if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

const inputBase =
  'mt-1.5 block w-full rounded-2xl border bg-white px-4 text-sm text-ink-900 shadow-sm outline-none transition-all placeholder:text-ink-400 focus:ring-4 dark:bg-white/5 dark:text-ink-100 dark:placeholder:text-ink-500'
const inputOk =
  'border-ink-200 focus:border-brand-500 focus:ring-brand-500/15 dark:border-white/10 dark:focus:border-brand-400 dark:focus:ring-brand-400/20'
const inputBad =
  'border-red-300 focus:border-red-400 focus:ring-red-200/60 dark:border-red-800 dark:focus:ring-red-900/40'

export default function ContactFormBlock(p: BlockPropsMap['contact_form']) {
  const { contact } = useSiteContent()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const mutation = useSubmitContact()

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (touched[key]) setErrors(validate({ ...form, [key]: value }))
  }
  function blur(key: keyof FormState) {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors(validate(form))
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setTouched({ name: true, email: true, company: true, message: true })
    if (Object.keys(nextErrors).length > 0) return
    const payload: ContactMessageCreate = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      message: form.message.trim(),
    }
    mutation.mutate(payload)
  }

  const submitted = mutation.isSuccess
  const submitError = mutation.isError ? (mutation.error as Error).message : null
  const firstName = form.name.trim().split(' ')[0] || 'friend'
  const tel = phoneHref(contact.phone)

  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 h-[32rem]" />
      <Section className="pt-14 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="animate-fade-up lg:col-span-2">
            {p.eyebrow && (
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-300">
                <span className="size-1.5 rounded-full bg-brand-500" />
                {p.eyebrow}
              </p>
            )}
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{p.title}</h1>
            {p.intro && (
              <p className="mt-5 text-base leading-relaxed text-ink-600 dark:text-ink-400">{p.intro}</p>
            )}

            {p.showDetails && (
              <ul className="mt-10 space-y-3 text-sm">
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="card card-hover flex items-center gap-4 p-4">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-md shadow-brand-900/20">
                        <Mail className="size-5" />
                      </span>
                      <span>
                        <span className="block text-xs text-ink-500">Email</span>
                        <span className="font-medium">{contact.email}</span>
                      </span>
                    </a>
                  </li>
                )}
                {contact.phone && tel && (
                  <li>
                    <a href={tel} className="card card-hover flex items-center gap-4 p-4">
                      <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-md shadow-brand-900/20">
                        <Phone className="size-5" />
                      </span>
                      <span>
                        <span className="block text-xs text-ink-500">Phone</span>
                        <span className="font-medium">{contact.phone}</span>
                      </span>
                    </a>
                  </li>
                )}
                {contact.location && (
                  <li className="card flex items-center gap-4 p-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-md shadow-brand-900/20">
                      <MapPin className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-ink-500">Location</span>
                      <span className="font-medium">{contact.location}</span>
                    </span>
                  </li>
                )}
                {contact.responseTime && (
                  <li className="flex items-center gap-2 px-1 pt-2 text-xs text-ink-500">
                    <Clock className="size-4" /> {contact.responseTime}
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="animate-fade-up lg:col-span-3" style={{ animationDelay: '120ms' }}>
            {submitted ? (
              <div
                role="status"
                className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/40 dark:bg-emerald-950/30"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-emerald-900 dark:text-emerald-200">
                      {p.successTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-800 dark:text-emerald-300">
                      {p.successBody.replace('{name}', firstName)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(INITIAL)
                        setTouched({})
                        setErrors({})
                        mutation.reset()
                      }}
                      className="mt-5 inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-all hover:bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="card p-6 shadow-xl shadow-ink-900/5 sm:p-9">
                {p.formTitle && <h2 className="text-lg font-semibold tracking-tight">{p.formTitle}</h2>}
                {p.formNote && <p className="mt-1 text-sm text-ink-500">{p.formNote}</p>}

                {submitError && (
                  <div className="mt-6">
                    <ErrorState
                      title="Couldn’t send your message"
                      message={
                        (mutation.error as { status?: number }).status === 429
                          ? 'You’re sending messages too quickly. Please wait a minute and try again.'
                          : submitError
                      }
                    />
                  </div>
                )}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    id="name"
                    value={form.name}
                    error={touched.name ? errors.name : undefined}
                    onChange={(v) => update('name', v)}
                    onBlur={() => blur('name')}
                    placeholder="Jane Doe"
                    required
                  />
                  <Field
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    error={touched.email ? errors.email : undefined}
                    onChange={(v) => update('email', v)}
                    onBlur={() => blur('email')}
                    placeholder="jane@company.com"
                    required
                  />
                </div>

                <div className="mt-5">
                  <Field
                    label="Company"
                    id="company"
                    value={form.company}
                    onChange={(v) => update('company', v)}
                    onBlur={() => blur('company')}
                    placeholder="Acme Inc."
                    optional
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="block text-sm font-medium text-ink-800 dark:text-ink-200">
                    Message <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    maxLength={5000}
                    placeholder="What are you building, and what does success look like?"
                    onChange={(e) => update('message', e.target.value)}
                    onBlur={() => blur('message')}
                    aria-invalid={touched.message && !!errors.message}
                    className={`${inputBase} py-3 ${touched.message && errors.message ? inputBad : inputOk}`}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.message}</p>
                  )}
                </div>

                <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {p.privacyNote ? (
                    <p className="flex items-center gap-2 text-xs text-ink-500">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      {p.privacyNote}
                    </p>
                  ) : (
                    <span />
                  )}
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn-primary !px-6 !py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        {p.submitLabel || 'Send message'}
                        <Send className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}

type FieldProps = {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  optional?: boolean
}

function Field({
  label,
  id,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  required = false,
  optional = false,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800 dark:text-ink-200">
        {label} {required && <span className="text-red-600 dark:text-red-400">*</span>}
        {optional && <span className="text-ink-400"> (optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={id === 'email' ? 240 : 120}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={`${inputBase} py-3 ${error ? inputBad : inputOk}`}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
