/**
 * Type-safe API client with Zod runtime validation.
 * All API contracts defined here as single source of truth.
 */
import { z } from 'zod'
import type { Service, ContactMessageCreate, ContactMessage, Health } from './types'

// ============================================================
// Zod Schemas = API Contracts (single source of truth)
// ============================================================

export const ServiceSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  icon: z.string(),
  sort_order: z.number(),
  created_at: z.string(),
}) satisfies z.ZodType<Service>

export const ContactMessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  company: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.string(),
}) satisfies z.ZodType<ContactMessage>

export const HealthSchema = z.object({
  status: z.string(),
  app: z.string(),
  env: z.string(),
  database: z.string().optional(),
}) satisfies z.ZodType<Health>

// ============================================================
// Error Class
// ============================================================

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ============================================================
// Response Parser with Runtime Validation
// ============================================================

async function parseResponse<T>(res: Response, schema: z.ZodType<T>): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = (await res.json()) as { detail?: unknown }
      if (typeof body?.detail === 'string') detail = body.detail
    } catch {
      // non-JSON error body; keep statusText
    }
    throw new ApiError(res.status, detail)
  }
  if (res.status === 204) return undefined as T
  const json = await res.json()
  return schema.parse(json) // Runtime validation!
}

// ============================================================
// API Methods
// ============================================================

export const api = {
  getServices: () =>
    fetch('/api/services').then(r => parseResponse(r, z.array(ServiceSchema))),

  getService: (slug: string) =>
    fetch(`/api/services/${encodeURIComponent(slug)}`).then(r => parseResponse(r, ServiceSchema)),

  getHealth: () =>
    fetch('/api/health').then(r => parseResponse(r, HealthSchema)),

  submitContact: (payload: ContactMessageCreate) =>
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => parseResponse(r, ContactMessageSchema)),
}