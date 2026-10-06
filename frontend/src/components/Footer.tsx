import { Link } from 'react-router-dom'
import { Globe, Mail, Phone, Sparkles } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <Sparkles className="size-4" />
            </span>
            <span>test-site</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-400">
            A demo studio site used to show prospective clients what a modern,
            polished web presence looks like. Not a real agency — but the
            stack, the patterns, and the polish all are.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href="mailto:hello@test-site.dev"
              aria-label="Email"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900 dark:border-ink-700 dark:text-ink-400 dark:hover:border-ink-600 dark:hover:text-ink-100"
            >
              <Mail className="size-4" />
            </a>
            <a
              href="tel:+15555550100"
              aria-label="Phone"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900 dark:border-ink-700 dark:text-ink-400 dark:hover:border-ink-600 dark:hover:text-ink-100"
            >
              <Phone className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Website"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900 dark:border-ink-700 dark:text-ink-400 dark:hover:border-ink-600 dark:hover:text-ink-100"
            >
              <Globe className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-600 dark:text-ink-400">
            <li><Link to="/services" className="hover:text-ink-900 dark:hover:text-ink-100">Services</Link></li>
            <li><Link to="/about" className="hover:text-ink-900 dark:hover:text-ink-100">About</Link></li>
            <li><Link to="/contact" className="hover:text-ink-900 dark:hover:text-ink-100">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">Get in touch</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-600 dark:text-ink-400">
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-ink-400" />
              <a href="mailto:hello@test-site.dev" className="hover:text-ink-900 dark:hover:text-ink-100">
                hello@test-site.dev
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-ink-400" />
              <a href="tel:+15555550100" className="hover:text-ink-900 dark:hover:text-ink-100">
                +1 (555) 555-0100
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-200 dark:border-ink-800">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:px-6 lg:px-8 dark:text-ink-500">
          <p>© {year} test-site. Demo only. No real services rendered.</p>
          <p>Built with React, Vite, Tailwind, FastAPI.</p>
        </div>
      </div>
    </footer>
  )
}