import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../lib/admin-api'
import { ApiError } from '../lib/api-client'

/**
 * Every admin query key starts with 'admin' so main.tsx can keep them out of
 * the persisted (localStorage) cache.
 */
const ME_KEY = ['admin', 'me'] as const
const MESSAGES_KEY = ['admin', 'messages'] as const

// A cosmetic hint ("this browser signed in before") so ordinary visitors don't
// ping /api/admin/me on every page. It is NOT security: the server decides.
const HINT = 'test-site:admin-hint'
function hasHint() {
  try {
    return localStorage.getItem(HINT) === '1'
  } catch {
    return false
  }
}
function setHint(on: boolean) {
  try {
    if (on) localStorage.setItem(HINT, '1')
    else localStorage.removeItem(HINT)
  } catch {
    // storage unavailable; the hint is optional
  }
}

/** `always` is for the /admin page itself; the nav uses the hint. */
export function useAdminMe(always = false) {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      const me = await adminApi.me()
      if (!me) setHint(false)
      return me
    },
    enabled: always || hasHint(),
    retry: false,
    staleTime: 60_000,
  })
}

export function useAdminLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      adminApi.login(username, password),
    onSuccess: (me) => {
      setHint(true)
      qc.setQueryData(ME_KEY, me)
    },
  })
}

export function useAdminLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminApi.logout,
    onSettled: () => {
      setHint(false)
      qc.setQueryData(ME_KEY, null)
      qc.removeQueries({ queryKey: MESSAGES_KEY })
    },
  })
}

export function useAdminMessages(enabled: boolean) {
  const qc = useQueryClient()
  return useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: async () => {
      try {
        return await adminApi.messages()
      } catch (e) {
        // Session expired: drop back to the login form.
        if (e instanceof ApiError && e.status === 401) {
          setHint(false)
          qc.setQueryData(ME_KEY, null)
        }
        throw e
      }
    },
    enabled,
    retry: false,
    staleTime: 0,
  })
}

export function useSetRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isRead }: { id: number; isRead: boolean }) => adminApi.setRead(id, isRead),
    onSuccess: () => qc.invalidateQueries({ queryKey: MESSAGES_KEY }),
  })
}

export function useDeleteMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MESSAGES_KEY }),
  })
}
