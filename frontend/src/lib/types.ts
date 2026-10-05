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

export type Project = {
  id: number
  slug: string
  title: string
  client: string
  summary: string
  description: string
  cover_image_url: string
  tags: string
  year: number
  sort_order: number
  created_at: string
}

export type Testimonial = {
  id: number
  author_name: string
  author_role: string
  author_company: string
  quote: string
  avatar_url: string
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