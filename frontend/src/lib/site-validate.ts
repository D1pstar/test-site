import type { SiteContent } from './site-types'

const PATH_RE = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/

export function pathError(path: string, others: string[]): string | null {
  if (!PATH_RE.test(path)) return 'Use lowercase letters, numbers and dashes, like /about-us'
  if (path === '/admin' || path.startsWith('/admin/') || path === '/api' || path.startsWith('/api/'))
    return 'That address is reserved'
  if (path.startsWith('/services/')) return 'Addresses under /services/ are used by service pages'
  if (others.includes(path)) return 'Another page already uses this address'
  return null
}

/** The first problem that would make the server refuse this document, or null. */
export function firstProblem(content: SiteContent): string | null {
  for (const p of content.pages) {
    const err = pathError(
      p.path,
      content.pages.filter((o) => o.id !== p.id).map((o) => o.path),
    )
    if (err) return `Page “${p.title || p.path}”: ${err}`
    if (!p.title.trim()) return 'Every page needs a name'
  }
  if (!content.theme.siteName.trim()) return 'The site needs a name (Theme tab)'
  if (!/^#[0-9a-fA-F]{6}$/.test(content.theme.brandColor)) return 'Brand colour must look like #3f82f0'
  return null
}
