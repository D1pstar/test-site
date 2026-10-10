import { useState, type FormEvent } from 'react'
import { CheckCircle2, Clock, Loader2, Mail, Phone, Send, ShieldCheck } from 'lucide-react'
import { Section } from '../components/Section'
import ErrorState from '../components/ErrorState'
import { useSubmitContact } from '../hooks/useContact'
import { usePageTitle } from '../hooks/usePageTitle'
import type { ContactMessageCreate } from '../lib/types'

type FormState = { name: string; email: string; company: string; message: string }
const INITIAL: FormState = { name: '', email: '', company: '', message: '' }

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.message.trim()) errors.message = 'Message is required.'
  else if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

const baseInput: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '0.375rem',
  borderRadius: '1rem',
  border: '1px solid var(--site-border)',
  background: 'color-mix(in srgb, var(--site-surface) 90%, transparent)',
  color: 'var(--site-text)',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'box-shadow 150ms ease, border-color 150ms ease',
}

function fieldStyle(error?: string): React.CSSProperties {
  if (error) return { ...baseInput, borderColor: '#ef4444' }
  return baseInput
}

export default function ContactPage() {
  usePageTitle('Contact')
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
    const next = validate(form)
    setErrors(next)
    setTouched({ name: true, email: true, company: true, message: true })
    if (Object.keys(next).length > 0) return
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

  return (
    <main className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 h-[34rem]" style={{ color: 'var(--site-text)' }} />
        <div
          className="absolute inset-x-0 top-0 mx-auto h-[28rem] max-w-4xl rounded-full opacity-60 blur-3xl animate-pulse-glow"
          style={{ background: 'radial-gradient(50% 50% at 40% 40%, var(--site-glow), transparent 70%)' }}
        />
      </div>

      <Section className="pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-5 lg:gap-16">
          <div className="animate-fade-up lg:col-span-2">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor: 'color-mix(in srgb, var(--site-primary) 28%, transparent)',
                background: 'var(--site-primary-soft)',
                color: 'var(--site-primary)',
              }}
            >
              <span className="size-1.5 rounded-full" style={{ background: 'var(--site-primary)' }} />
              Contact
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl" style={{ color: 'var(--site-text)' }}>
              Let's talk about your project
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--site-muted)' }}>
              Tell us a bit about what you're working on. We'll get back to you
              within one business day with next steps or a suggestion.
            </p>

            <ul className="mt-10 space-y-3 text-sm">
              <li>
                <a href="mailto:hello@test-site.dev" className="glass glass-spec flex items-center gap-4 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                  <span
                    className="inline-flex size-11 items-center justify-center rounded-2xl text-white"
                    style={{ background: 'var(--site-gradient)', boxShadow: '0 8px 20px -8px var(--site-glow)' }}
                  >
                    <Mail className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs" style={{ color: 'var(--site-muted)' }}>Email</span>
                    <span className="font-medium" style={{ color: 'var(--site-text)' }}>hello@test-site.dev</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:+15555550100" className="glass glass-spec flex items-center gap-4 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                  <span
                    className="inline-flex size-11 items-center justify-center rounded-2xl text-white"
                    style={{ background: 'var(--site-gradient)', boxShadow: '0 8px 20px -8px var(--site-glow)' }}
                  >
                    <Phone className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs" style={{ color: 'var(--site-muted)' }}>Phone</span>
                    <span className="font-medium" style={{ color: 'var(--site-text)' }}>+1 (555) 555-0100</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-2 px-1 pt-2 text-xs" style={{ color: 'var(--site-muted)' }}>
                <Clock className="size-4" /> Typical response time: under 24 hours
              </li>
            </ul>
          </div>

          <div className="animate-fade-up lg:col-span-3" style={{ animationDelay: '120ms' }}>
            {submitted ? (
              <div
                role="status"
                className="rounded-3xl border p-8"
                style={{
                  borderColor: 'color-mix(in srgb, #10b981 30%, transparent)',
                  background: 'color-mix(in srgb, #10b981 8%, transparent)',
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'color-mix(in srgb, #10b981 20%, transparent)', color: '#059669' }}
                  >
                    <CheckCircle2 className="size-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight" style={{ color: '#065f46' }}>
                      Message received
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: '#047857' }}>
                      Thanks, {form.name.split(' ')[0] || 'friend'}. We'll be in touch soon — usually within a business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setForm(INITIAL); setTouched({}); setErrors({}); mutation.reset() }}
                      className="btn-secondary mt-5 !px-4 !py-2 text-sm"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={onSubmit}
                className="glass glass-spec rounded-3xl p-6 sm:p-9"
              >
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--site-text)' }}>
                  Send us a message
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--site-muted)' }}>
                  Fields marked * are required.
                </p>

                {submitError && (
                  <div className="mt-6">
                    <ErrorState title="Couldn’t send your message" message={submitError} />
                  </div>
                )}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Name" id="name" value={form.name}
                    error={touched.name ? errors.name : undefined}
                    onChange={(v) => update('name', v)} onBlur={() => blur('name')}
                    placeholder="Jane Doe" required />
                  <Field label="Email" id="email" type="email" value={form.email}
                    error={touched.email ? errors.email : undefined}
                    onChange={(v) => update('email', v)} onBlur={() => blur('email')}
                    placeholder="jane@company.com" required />
                </div>

                <div className="mt-5">
                  <Field label="Company" id="company" value={form.company}
                    onChange={(v) => update('company', v)} onBlur={() => blur('company')}
                    placeholder="Acme Inc." optional />
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="block text-sm font-medium" style={{ color: 'var(--site-text)' }}>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message" rows={6} value={form.message}
                    placeholder="What are you building, and what does success look like?"
                    onChange={(e) => update('message', e.target.value)}
                    onBlur={() => blur('message')}
                    aria-invalid={touched.message && !!errors.message}
                    style={fieldStyle(touched.message ? errors.message : undefined)}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px var(--site-primary-soft)')}
                    onBlurCapture={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-xs" style={{ color: 'var(--site-muted)' }}>
                    <ShieldCheck className="size-4 text-emerald-500" />
                    We'll only use this to reply. No lists, no spam.
                  </p>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mutation.isPending ? (
                      <><Loader2 className="size-4 animate-spin" /> Sending…</>
                    ) : (
                      <>Send message <Send className="size-4" /></>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </main>
  )
}

type FieldProps = {
  label: string; id: string; value: string
  onChange: (value: string) => void; onBlur: () => void
  error?: string; type?: string; placeholder?: string
  required?: boolean; optional?: boolean
}

function Field({ label, id, value, onChange, onBlur, error, type = 'text', placeholder, required = false, optional = false }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: 'var(--site-text)' }}>
        {label} {required && <span className="text-red-500">*</span>}
        {optional && <span style={{ color: 'var(--site-muted)' }}> (optional)</span>}
      </label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        style={fieldStyle(error)}
        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px var(--site-primary-soft)')}
        onBlurCapture={(e) => (e.currentTarget.style.boxShadow = 'none')}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}