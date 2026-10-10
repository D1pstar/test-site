import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api-client'


export function useSubmitContact() {
  return useMutation({
    mutationFn: api.submitContact,
  })
}