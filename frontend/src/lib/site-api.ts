/** Public + admin API calls for site content, media and services. */
import { z } from 'zod'
import { ApiError } from './api-client'
import { ServiceSchema } from './api-client'
import type { SiteContent } from './site-types'
import type { Service } from './types'

// The server validates the document strictly on every save and again before
// serving it. Here we only confirm the basic shape so a bad response can't
// crash rendering.
const looksLikeSite = (v: unknown): v is SiteContent => {
  const o = v as SiteContent | null
  return (
    !!o &&
    typeof o === 'object' &&
    o.version === 1 &&
    Array.isArray(o.pages) &&
    !!o.theme &&
    !!o.nav &&
    !!o.footer &&
    !!o.contact
  )
}
const SiteSchema = z.custom<SiteContent>(looksLikeSite, 'Unexpected site content')

const PublicSiteSchema = z.object({ content: SiteSchema.nullable() })

const AdminSiteSchema = z.object({
  draft: SiteSchema.nullable(),
  published: SiteSchema.nullable(),
  has_unpublished: z.boolean(),
  draft_updated_at: z.string().nullable(),
  published_at: z.string().nullable(),
})
export type AdminSite = z.infer<typeof AdminSiteSchema>

const DraftSavedSchema = z.object({ has_unpublished: z.boolean(), draft_updated_at: z.string() })

export const MediaSchema = z.object({
  id: z.number(),
  url: z.string(),
  name: z.string(),
  mime: z.string(),
  size: z.number(),
  created_at: z.string(),
})
export type MediaItem = z.infer<typeof MediaSchema>

async function request<T>(path: string, schema: z.ZodType<T> | null, init?: RequestInit): Promise<T> {
  const isForm = init?.body instanceof FormData
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = (await res.json()) as { detail?: unknown }
      if (typeof body?.detail === 'string') detail = body.detail
      else if (Array.isArray(body?.detail)) {
        // FastAPI validation errors: show the first one readably.
        const first = body.detail[0] as { loc?: unknown[]; msg?: string } | undefined
        if (first?.msg) detail = `${(first.loc ?? []).slice(1).join(' › ')}: ${first.msg}`
      }
    } catch {
      // non-JSON error body
    }
    throw new ApiError(res.status, detail)
  }
  if (res.status === 204 || !schema) return undefined as T
  return schema.parse(await res.json())
}

export const siteApi = {
  getPublished: async () => (await request('/api/site', PublicSiteSchema)).content,

  admin: {
    get: () => request('/api/admin/site', AdminSiteSchema),
    saveDraft: (content: SiteContent) =>
      request('/api/admin/site/draft', DraftSavedSchema, { method: 'PUT', body: JSON.stringify(content) }),
    publish: () => request('/api/admin/site/publish', AdminSiteSchema, { method: 'POST' }),
    discard: () => request('/api/admin/site/discard', AdminSiteSchema, { method: 'POST' }),
  },

  media: {
    list: () => request('/api/admin/media', z.array(MediaSchema)),
    upload: (file: File) => {
      const body = new FormData()
      body.append('file', file)
      return request('/api/admin/media', MediaSchema, { method: 'POST', body })
    },
    remove: (id: number) => request(`/api/admin/media/${id}`, null, { method: 'DELETE' }),
  },

  services: {
    create: (s: ServiceInput) =>
      request('/api/admin/services', ServiceSchema, { method: 'POST', body: JSON.stringify(s) }),
    update: (id: number, s: ServiceInput) =>
      request(`/api/admin/services/${id}`, ServiceSchema, { method: 'PUT', body: JSON.stringify(s) }),
    remove: (id: number) => request(`/api/admin/services/${id}`, null, { method: 'DELETE' }),
  },
}

export type ServiceInput = Pick<Service, 'slug' | 'title' | 'summary' | 'description' | 'icon' | 'sort_order'>
