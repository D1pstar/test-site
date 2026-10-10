import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import SmartLink from './SmartLink'
import { useAdminMe } from '../hooks/useAdmin'
import { useSiteContent } from '../hooks/useSite'
import { classifyLink, safeImage } from '../lib/links'
import type { LinkItem } from '../lib/site-types'

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-500/10 text-brand-700 dark:bg-white/10 dark:text-white'
      : 'text-ink-600 hover:bg-ink-900/5 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white',
  ].join(' ')
}
const plainLinkClass = linkClass({ isActive: false })

function NavItem({ link, onClick }: { link: LinkItem; onClick?: () => void }) {
  const kind = classifyLink(link.to)
  if (!link.label || kind === 'none') return null
  if (kind === 'internal')
    return (
      <NavLink to={link.to} end={link.to === '/'} className={linkClass} onClick={onClick}>
        {link.label}
      </NavLink>
    )
  return (
    <SmartLink to={link.to} className={plainLinkClass} onClick={onClick}>
      {link.label}
    </SmartLink>
  )
}

export default function NavBar() {
  const { theme, nav } = useSiteContent()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Only resolves for a browser that has signed in as admin; null for everyone else.
  const isAdmin = Boolean(useAdminMe().data)
  const links = isAdmin ? [...nav.links, { label: 'Admin', to: '/admin' }] : nav.links
  const logo = safeImage(theme.logoUrl)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className={`flex h-16 items-center justify-between rounded-full border px-3 pl-4 backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? 'border-ink-200/80 bg-white/80 shadow-lg shadow-ink-900/5 dark:border-white/10 dark:bg-ink-900/70'
              : 'border-transparent bg-transparent dark:border-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            {logo ? (
              <img src={logo} alt="" className="h-9 w-auto max-w-[8rem] object-contain" />
            ) : (
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-md shadow-brand-900/30">
                <Sparkles className="size-[18px]" />
              </span>
            )}
            <span className="text-[17px]">{theme.siteName}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l, i) => (
              <NavItem key={`${i}-${l.to}`} link={l} />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {nav.cta.label && classifyLink(nav.cta.to) !== 'none' && (
              <SmartLink to={nav.cta.to} className="btn-primary hidden !py-2 md:inline-flex">
                {nav.cta.label}
                <ArrowRight className="size-4" />
              </SmartLink>
            )}
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-full text-ink-700 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-white/10 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-2 rounded-3xl border border-ink-200/80 bg-white/90 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-ink-800/90 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((l, i) => (
                <NavItem key={`${i}-${l.to}`} link={l} onClick={() => setOpen(false)} />
              ))}
              {nav.cta.label && classifyLink(nav.cta.to) !== 'none' && (
                <SmartLink to={nav.cta.to} onClick={() => setOpen(false)} className="btn-primary mt-2">
                  {nav.cta.label}
                </SmartLink>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
