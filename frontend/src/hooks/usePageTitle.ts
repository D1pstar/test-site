import { useEffect } from 'react'

const BASE = 'test-site'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE
  }, [title])
}