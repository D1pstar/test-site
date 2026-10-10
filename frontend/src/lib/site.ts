import { z } from 'zod'

export type Block = {
  id: string
  type: string
  enabled: boolean
  settings: Record<string, any>
}

export type SitePage = {
  id: string
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  blocks: Block[]
}

export type SiteConfig = {
  version: number
  theme: Record<string, any>
  navigation: { items: { label: string; href: string }[]; ctaLabel: string; ctaHref: string }
  footer: Record<string, any>
  pages: SitePage[]
}

export const emptySite: SiteConfig = {
  version: 1,
  theme: { primary: '#6d5dfc', secondary: '#c15cff', background: '#f8fafc', surface: '#fff', text: '#101828', muted: '#667085', font: 'Inter', radius: '24px', logoText: 'test-site', logoImage: '', darkMode: true },
  navigation: { items: [], ctaLabel: '', ctaHref: '' },
  footer: {},
  pages: [],
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: 'same-origin', ...init, headers: { Accept: 'application/json', ...(init?.body instanceof FormData ? {} : init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers } })
  if (!res.ok) {
    let detail = res.statusText
    try { const body = await res.json(); if (typeof body.detail === 'string') detail = body.detail } catch {}
    throw new Error(detail)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

const SiteEnvelope = z.object({ draft: z.record(z.string(), z.any()), published: z.record(z.string(), z.any()) })

export const siteApi = {
  public: () => request<SiteConfig>('/api/site'),
  admin: async () => SiteEnvelope.parse(await request('/api/admin/site')),
  saveDraft: (config: SiteConfig) => request('/api/admin/site/draft', { method: 'PUT', body: JSON.stringify({ config }) }),
  publish: () => request('/api/admin/site/publish', { method: 'POST' }),
  upload: async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) })
    return request<{ url: string; name: string; size: number }>('/api/admin/media', { method: 'POST', body: JSON.stringify({ name: file.name, data_url: dataUrl }) })
  },
}
