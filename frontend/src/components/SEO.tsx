import { useEffect } from 'react'

type SEOProps = {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

/**
 * Manages document <title> and meta tags for SEO and social sharing.
 * Call once per page; updates are applied via useEffect.
 *
 * Usage:
 *   <SEO
 *     title="About Us"
 *     description="A small studio with a long attention span."
 *     url="/about"
 *   />
 */
const BASE_URL = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173'
const DEFAULT_IMAGE = '/og-default.png'

export function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const fullTitle = title ? `${title} \u00b7 test-site` : 'test-site'
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL
  const ogImage = image ? `${BASE_URL}${image}` : `${BASE_URL}${DEFAULT_IMAGE}`
  const defaultDesc = 'A demo studio site showing a modern, polished web presence.'

  useEffect(() => {
    document.title = fullTitle

    updateMeta('description', description ?? defaultDesc)
    updateMeta('og:title', fullTitle)
    updateMeta('og:description', description ?? defaultDesc)
    updateMeta('og:image', ogImage)
    updateMeta('og:url', fullUrl)
    updateMeta('og:type', type)
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', fullTitle)
    updateMeta('twitter:description', description ?? defaultDesc)
    updateMeta('twitter:image', ogImage)
  }, [fullTitle, description, ogImage, fullUrl, type])

  return null
}

function updateMeta(name: string, content: string) {
  let el = document.querySelector(
    `meta[name="${name}"], meta[property="${name}"]`
  ) as HTMLMetaElement | null

  if (!el) {
    el = document.createElement('meta')
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      el.setAttribute('property', name)
    } else {
      el.setAttribute('name', name)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}