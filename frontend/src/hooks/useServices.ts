import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Service } from '../lib/types'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.get<Service[]>('/api/services'),
  })
}

export function useService(slug: string | undefined) {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: () => api.get<Service>(`/api/services/${slug}`),
    enabled: Boolean(slug),
  })
}