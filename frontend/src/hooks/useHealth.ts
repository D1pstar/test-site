import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api-client'


export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
  })
}