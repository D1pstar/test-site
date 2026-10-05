import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Testimonial } from '../lib/types'

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get<Testimonial[]>('/api/testimonials'),
  })
}