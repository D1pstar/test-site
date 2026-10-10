/**
 * The page shown inside the editor's preview frame (and "open draft in a new
 * tab"). It renders the site from a draft instead of the published content.
 * Inside the editor it receives the live working copy via postMessage; the
 * message is only accepted from the parent window of the same origin.
 */
import { useEffect, useState, type MouseEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import PageRenderer from '../components/PageRenderer'
import ErrorState from '../components/ErrorState'
import { Section } from '../components/Section'
import { SiteContentProvider, findPage, useSiteContent } from '../hooks/useSite'
import { ApiError } from '../lib/api-client'
import { siteApi } from '../lib/site-api'
import { DEFAULT_CONTENT } from '../lib/site-defaults'
import type { SiteContent } from '../lib/site-types'

type Incoming = { type: 'site-preview'; content: SiteContent; path: string }

function isIncoming(d: unknown): d is Incoming {
  const m = d as Incoming | null
  return !!m && m.type === 'site-preview' && typeof m.path === 'string' && Array.isArray(m.content?.pages)
}

export default function PreviewPage() {
  const embedded = window.parent !== window
  const [live, setLive] = useState<{ content: SiteContent; path: string } | null>(null)

  // Standalone (new tab): load the saved draft instead.
  const saved = useQuery({
    queryKey: ['admin', 'site'],
    queryFn: siteApi.admin.get,
    enabled: !embedded,
    retry: false,
  })

  useEffect(() => {
    if (!embedded) return
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      if (isIncoming(e.data)) setLive({ content: e.data.content, path: e.data.path })
    }
    window.addEventListener('message', onMessage)
    window.parent.postMessage({ type: 'preview-ready' }, window.location.origin)
    return () => window.removeEventListener('message', onMessage)
  }, [embedded])

  if (embedded) {
    return live ? <Shell content={live.content} path={live.path} embedded /> : null
  }

  if (saved.isLoading) return null
  if (saved.isError) {
    const unauthorized = saved.error instanceof ApiError && saved.error.status === 401
    return (
      <Section>
        <ErrorState
          title={unauthorized ? 'Sign in to preview' : 'Couldn’t load the preview'}
          message={unauthorized ? 'Open /admin, sign in, then try again.' : (saved.error as Error).message}
        />
      </Section>
    )
  }
  const content = saved.data?.draft ?? saved.data?.published ?? DEFAULT_CONTENT
  return <Standalone content={content} />
}

function Standalone({ content }: { content: SiteContent }) {
  const [path, setPath] = useState(() => new URLSearchParams(window.location.search).get('path') ?? '/')
  return <Shell content={content} path={path} embedded={false} onNavigate={setPath} />
}

function Shell({
  content,
  path,
  embedded,
  onNavigate,
}: {
  content: SiteContent
  path: string
  embedded: boolean
  onNavigate?: (path: string) => void
}) {
  return (
    <SiteContentProvider content={content}>
      <PreviewBody path={path} embedded={embedded} onNavigate={onNavigate} />
    </SiteContentProvider>
  )
}

function PreviewBody({
  path,
  embedded,
  onNavigate,
}: {
  path: string
  embedded: boolean
  onNavigate?: (path: string) => void
}) {
  const content = useSiteContent()
  const page = findPage(content, path)

  // Keep the preview self-contained: internal links ask the editor to switch
  // pages instead of navigating away.
  function onClickCapture(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest('a')
    if (!a) return
    const href = a.getAttribute('href') ?? ''
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault()
      const target = href.split(/[?#]/)[0]
      if (embedded) window.parent.postMessage({ type: 'preview-navigate', path: target }, window.location.origin)
      else onNavigate?.(target)
    }
  }

  return (
    <div className="flex min-h-full flex-col" onClickCapture={onClickCapture}>
      <NavBar />
      <div className="flex-1">
        {page ? (
          <PageRenderer page={page} />
        ) : (
          <Section>
            <p className="card p-6 text-sm text-ink-600">
              This address isn’t a page you created (it may be a service page, which is managed in the Services tab).
            </p>
          </Section>
        )}
      </div>
      <Footer />
    </div>
  )
}
