import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api-client'


export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: api.getServices,
    staleTime: 0, // always re-check on mount so admin changes show up right away
  })
}

export function useService(slug: string | undefined) {
  return useQuery({
    queryKey: ['services', slug],
    queryFn: () => api.getService(slug as string),
    staleTime: 0,
    enabled: Boolean(slug),
  })
}