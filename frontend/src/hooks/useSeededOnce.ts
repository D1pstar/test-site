/**
 * Fires POST /api/seed exactly once per browser session (guarded by
 * sessionStorage) so the demo always has fresh content without a manual
 * curl step. Dev convenience; remove before shipping anything real.
 */
import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const KEY = 'test-site:seeded'

export function useSeededOnce() {
  const qc = useQueryClient()
  const ran = useRef(false)

  useEffect(() => {
    // Production never seeds: the backend route doesn't exist there.
    if (!import.meta.env.DEV) return
    if (ran.current) return
    ran.current = true
    if (sessionStorage.getItem(KEY)) return

    fetch('/api/seed', { method: 'POST' })
      .then((res) => {
        if (res.ok) sessionStorage.setItem(KEY, '1')
        qc.invalidateQueries()
      })
      .catch(() => {
        // Backend not up yet; the next request will just return empty lists.
      })
  }, [qc])
}