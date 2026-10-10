import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { siteApi } from '../lib/site-api'
import { DEFAULT_CONTENT } from '../lib/site-defaults'
import { applyTheme } from '../lib/theme'
import type { Page, SiteContent } from '../lib/site-types'

const SiteContext = createContext<SiteContent | null>(null)

export function useSiteContent(): SiteContent {
  const content = useContext(SiteContext)
  if (!content) throw new Error('useSiteContent must be used inside <SiteContentProvider>')
  return content
}

/** Like useSiteContent, but returns null outside a provider (e.g. on the admin page). */
export function useOptionalSiteContent(): SiteContent | null {
  return useContext(SiteContext)
}

export function findPage(content: SiteContent, pathname: string): Page | undefined {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return content.pages.find((p) => p.path === clean)
}

/** Applies the theme and provides `content` to the subtree. Used by the public site and the preview. */
export function SiteContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  useEffect(() => {
    applyTheme(content.theme)
  }, [content.theme])

  return <SiteContext.Provider value={content}>{children}</SiteContext.Provider>
}

/** Loads the published content (falling back to the built-in defaults if the API has none or fails). */
export function PublishedSiteProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ['site'],
    queryFn: siteApi.getPublished,
    // Always revalidate on page load so a Publish reaches visitors immediately.
    // The cached copy still renders instantly while the fresh one loads.
    staleTime: 0,
    retry: 1,
  })

  if (query.isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center" role="status" aria-label="Loading">
        <div className="size-8 animate-spin rounded-full border-2 border-ink-300 border-t-brand-500" />
      </div>
    )
  }

  return <SiteContentProvider content={query.data ?? DEFAULT_CONTENT}>{children}</SiteContentProvider>
}
