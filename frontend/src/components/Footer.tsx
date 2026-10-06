import { Link } from 'react-router-dom'
import { Globe, Mail, Phone, Sparkles } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 px-4 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass glass-spec rounded-[2rem] border border-white/40 bg-white/40 p-8 sm:p-10 dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-10 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-sm">
                  <Sparkles className="size-4" />
                </span>
                <span>test-site</span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                A demo studio site used to show prospective clients what a
                modern, polished web presence looks like. Not a real agency —
                but the stack, the patterns, and the polish all are.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <a
                  href="mailto:hello@test-site.dev"
                  aria-label="Email"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/50 bg-white/40 text-ink-700 transition-all hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
                >
                  <Mail className="size-4" />
                </a>
                <a
                  href="tel:+15555550100"
                  aria-label="Phone"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/50 bg-white/40 text-ink-700 transition-all hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
                >
                  <Phone className="size-4" />
                </a>
                <a
                  href="#"
                  aria-label="Website"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/50 bg-white/40 text-ink-700 transition-all hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
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
        </div>

        <p className="mt-4 px-2 text-center text-xs text-ink-500 dark:text-ink-500">
          © {year} test-site. Demo only. No real services rendered.
        </p>
      </div>
    </footer>
  )
}