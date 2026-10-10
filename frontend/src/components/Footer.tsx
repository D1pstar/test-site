import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import SmartLink from './SmartLink'
import { useSiteContent } from '../hooks/useSite'
import { classifyLink, phoneHref, safeImage } from '../lib/links'

const hover = 'hover:text-brand-600 dark:hover:text-brand-300'

export default function Footer() {
  const { theme, contact, footer } = useSiteContent()
  const year = String(new Date().getFullYear())
  const logo = safeImage(theme.logoUrl)
  const tel = phoneHref(contact.phone)

  return (
    <footer className="mt-24 border-t border-ink-200/70 bg-white/60 dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
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
            {footer.tagline && (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                {footer.tagline}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footer.columns.map((col, ci) => (
              <div key={`${ci}-${col.title}`}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">{col.title}</h3>
                <ul className="mt-4 space-y-3 text-sm text-ink-700 dark:text-ink-300">
                  {col.links.map((l, li) => (
                    <li key={`${li}-${l.label}`}>
                      {classifyLink(l.to) === 'none' ? (
                        l.label
                      ) : (
                        <SmartLink to={l.to} className={hover}>
                          {l.label}
                        </SmartLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {footer.showContact && (
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                  {footer.contactTitle}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-ink-700 dark:text-ink-300">
                  {contact.email && (
                    <li className="flex items-center gap-2.5">
                      <Mail className="size-4 text-brand-500" />
                      <a href={`mailto:${contact.email}`} className={hover}>
                        {contact.email}
                      </a>
                    </li>
                  )}
                  {contact.phone && tel && (
                    <li className="flex items-center gap-2.5">
                      <Phone className="size-4 text-brand-500" />
                      <a href={tel} className={hover}>
                        {contact.phone}
                      </a>
                    </li>
                  )}
                  {contact.location && (
                    <li className="flex items-center gap-2.5">
                      <MapPin className="size-4 text-brand-500" />
                      {contact.location}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {(footer.bottomLeft || footer.bottomRight) && (
          <div className="mt-12 flex flex-col gap-2 border-t border-ink-200/70 pt-6 text-xs text-ink-500 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p>{footer.bottomLeft.replace('{year}', year)}</p>
            <p>{footer.bottomRight}</p>
          </div>
        )}
      </div>
    </footer>
  )
}
