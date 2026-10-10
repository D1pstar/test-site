/**
 * Admin API. Auth is a server-set HttpOnly cookie, so the browser attaches it
 * automatically (same-origin) and no token ever touches JavaScript.
 */
import { z } from 'zod'
import { ApiError, ContactMessageSchema } from './api-client'
import type { ContactMessage } from './types'

const AdminMeSchema = z.object({ username: z.string() })
export type AdminMe = z.infer<typeof AdminMeSchema>

async function call<T>(path: string, init?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    credentials: 'same-origin',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = (await res.json()) as { detail?: unknown }
      if (typeof body?.detail === 'string') detail = body.detail
    } catch {
      // non-JSON error body
    }
    throw new ApiError(res.status, detail)
  }
  if (res.status === 204 || !schema) return undefined as T
  return schema.parse(await res.json())
}

export const adminApi = {
  /** Resolves to null (not an error) when nobody is signed in. */
  me: async (): Promise<AdminMe | null> => {
    try {
      return await call('/me', undefined, AdminMeSchema)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null
      throw e
    }
  },
  login: (username: string, password: string) =>
    call('/login', { method: 'POST', body: JSON.stringify({ username, password }) }, AdminMeSchema),
  logout: () => call<void>('/logout', { method: 'POST' }),
  messages: (): Promise<ContactMessage[]> =>
    call('/messages', undefined, z.array(ContactMessageSchema)),
  setRead: (id: number, isRead: boolean) =>
    call(`/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ is_read: isRead }) }, ContactMessageSchema),
  remove: (id: number) => call<void>(`/messages/${id}`, { method: 'DELETE' }),
}
