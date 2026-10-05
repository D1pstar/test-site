export type Health = {
  status: string
  app: string
  env: string
}

export type Service = {
  id: number
  slug: string
  title: string
  summary: string
  description: string
  icon: string
  sort_order: number
  created_at: string
}

export type ContactMessage = {
  id: number
  name: string
  email: string
  company: string
  message: string
  is_read: boolean
  created_at: string
}

export type ContactMessageCreate = {
  name: string
  email: string
  company?: string
  message: string
}