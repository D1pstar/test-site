import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
    isActive
      ? 'bg-white/60 text-ink-900 shadow-sm dark:bg-white/10 dark:text-ink-100'
      : 'text-ink-700 hover:bg-white/50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-ink-100',
  ].join(' ')
}

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass glass-spec flex h-14 items-center justify-between rounded-full border border-white/40 bg-white/50 px-3 dark:border-white/10 dark:bg-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 pl-1 pr-2 font-semibold tracking-tight"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-sm">
              <Sparkles className="size-4" />
            </span>
            <span>test-site</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={'end' in l ? l.end : false}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <Link
              to="/contact"
              className="hidden rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-brand-900/20 transition-transform hover:scale-[1.02] active:scale-[0.98] md:inline-flex"
            >
              Start a project
            </Link>

            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-full text-ink-700 hover:bg-white/50 dark:text-ink-200 dark:hover:bg-white/10 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="glass glass-spec mt-2 rounded-3xl border border-white/40 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5 md:hidden">
            <nav className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={'end' in l ? l.end : false}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-900/20"
              >
                Start a project
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}