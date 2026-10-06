import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Mail, Phone, Send } from 'lucide-react'
import { Section } from '../components/Section'
import ErrorState from '../components/ErrorState'
import { useSubmitContact } from '../hooks/useContact'
import { usePageTitle } from '../hooks/usePageTitle'
import type { ContactMessageCreate } from '../lib/types'

type FormState = {
  name: string
  email: string
  company: string
  message: string
}

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
  else if (form.message.trim().length < 10)
    errors.message = 'Message should be at least 10 characters.'
  return errors
}

export default function ContactPage() {
  usePageTitle('Contact')

  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const mutation = useSubmitContact()

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (touched[key]) {
      const nextErrors = validate({ ...form, [key]: value })
      setErrors(nextErrors)
    }
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

  return (
    <main>
      <Section className="pt-14 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Contact
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Let's talk about your project
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-400">
              Tell us a bit about what you're working on. We'll get back to you
              within one business day with next steps or a suggestion.
            </p>

            <ul className="mt-10 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <Mail className="size-4" />
                </span>
                <a
                  href="mailto:hello@test-site.dev"
                  className="font-medium text-ink-800 hover:text-brand-700 dark:text-ink-200 dark:hover:text-brand-300"
                >
                  hello@test-site.dev
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <Phone className="size-4" />
                </span>
                <a
                  href="tel:+15555550100"
                  className="font-medium text-ink-800 hover:text-brand-700 dark:text-ink-200 dark:hover:text-brand-300"
                >
                  +1 (555) 555-0100
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-emerald-900 dark:text-emerald-200">
                      Message received
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-800 dark:text-emerald-300">
                      Thanks, {form.name.split(' ')[0] || 'friend'}. We'll be in
                      touch soon — usually within a business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(INITIAL)
                        setTouched({})
                        setErrors({})
                        mutation.reset()
                      }}
                      className="mt-5 inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
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
                className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm sm:p-8 dark:border-ink-800 dark:bg-ink-800/50"
              >
                {submitError && (
                  <div className="mb-6">
                    <ErrorState
                      title="Couldn’t send your message"
                      message={submitError}
                    />
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    id="name"
                    value={form.name}
                    error={touched.name ? errors.name : undefined}
                    onChange={(v) => update('name', v)}
                    onBlur={() => blur('name')}
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
                    optional
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ink-800 dark:text-ink-200"
                  >
                    Message <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    onBlur={() => blur('message')}
                    className={`mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-ink-900 dark:text-ink-100 ${
                      touched.message && errors.message
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-900/40'
                        : 'border-ink-200 focus:border-brand-400 focus:ring-brand-100 dark:border-ink-700 dark:focus:border-brand-500 dark:focus:ring-brand-900/40'
                    }`}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.message}</p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-xs text-ink-500 dark:text-ink-500">
                    We'll only use this to reply. No lists, no spam.
                  </p>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
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
    </main>
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
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-ink-900 dark:text-ink-100 ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-800 dark:focus:ring-red-900/40'
            : 'border-ink-200 focus:border-brand-400 focus:ring-brand-100 dark:border-ink-700 dark:focus:border-brand-500 dark:focus:ring-brand-900/40'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}