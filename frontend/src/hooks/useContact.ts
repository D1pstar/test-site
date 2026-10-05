import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ContactMessage, ContactMessageCreate } from '../lib/types'

export function useSubmitContact() {
  return useMutation({
    mutationFn: (payload: ContactMessageCreate) =>
      api.post<ContactMessage>('/api/contact', payload),
  })
}