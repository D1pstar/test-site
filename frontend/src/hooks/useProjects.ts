import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Project } from '../lib/types'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/api/projects'),
  })
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => api.get<Project>(`/api/projects/${slug}`),
    enabled: Boolean(slug),
  })
}