import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSite } from '../hooks/useSite'
import SiteTheme from '../components/SiteTheme'
import BlockRenderer from '../components/BlockRenderer'
import { Skeleton } from '../components/Skeleton'

export default function SitePage({ forcedSlug }: { forcedSlug?: string }) {
  const params = useParams()
  const site = useSite()
  const slug = forcedSlug || `/${params['*'] || ''}`
  const normalized = slug === '/' || slug === '' ? '/' : slug.startsWith('/') ? slug : `/${slug}`
  const page = site.data?.pages.find(p => p.slug === normalized)

  useEffect(() => {
    if (page?.seoTitle) {
      document.title = page.seoTitle
    }
  }, [page?.seoTitle])

  if (site.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20">
        <Skeleton className="h-96 w-full" />
      </main>
    )
  }

  if (!site.data || !page) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-4xl font-bold">Page not found</h1>
      </main>
    )
  }

  return (
    <>
      <SiteTheme site={site.data} />
      <main className="site-bg min-h-full">
        {page.blocks
          .filter(block => block.enabled)
          .map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
      </main>
    </>
  )
}