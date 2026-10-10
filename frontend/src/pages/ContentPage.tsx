import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageRenderer from '../components/PageRenderer'
import NotFoundPage from './NotFoundPage'
import { findPage, useSiteContent } from '../hooks/useSite'
import { usePageTitle } from '../hooks/usePageTitle'

function setMeta(name: string, content: string) {
  const isProp = name.startsWith('og:')
  let el = document.head.querySelector<HTMLMetaElement>(
    isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(isProp ? 'property' : 'name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Renders whichever page in the site content matches the URL (or the 404 page). */
export default function ContentPage() {
  const content = useSiteContent()
  const { pathname } = useLocation()
  const page = findPage(content, pathname)

  usePageTitle(page && page.path !== '/' ? page.title : undefined)

  useEffect(() => {
    if (!page?.description) return
    setMeta('description', page.description)
    setMeta('og:description', page.description)
    setMeta('og:title', page.path === '/' ? content.theme.siteName : `${page.title} · ${content.theme.siteName}`)
  }, [page, content.theme.siteName])

  if (!page) return <NotFoundPage />
  return <PageRenderer page={page} />
}
