/**
 * The editable site document. Mirrors backend/app/schemas/site.py exactly:
 * the server validates every save against that schema.
 */

export type LinkItem = { label: string; to: string }
export type Align = 'left' | 'center'

export const FONTS = {
  inter: { label: 'Inter', family: '"Inter Variable", ui-sans-serif, system-ui, sans-serif', google: null },
  system: {
    label: 'System default',
    family: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    google: null,
  },
  poppins: { label: 'Poppins', family: '"Poppins", sans-serif', google: 'Poppins:wght@400;500;600;700' },
  'dm-sans': { label: 'DM Sans', family: '"DM Sans", sans-serif', google: 'DM+Sans:wght@400;500;600;700' },
  'space-grotesk': {
    label: 'Space Grotesk',
    family: '"Space Grotesk", sans-serif',
    google: 'Space+Grotesk:wght@400;500;600;700',
  },
  montserrat: {
    label: 'Montserrat',
    family: '"Montserrat", sans-serif',
    google: 'Montserrat:wght@400;500;600;700',
  },
  playfair: {
    label: 'Playfair Display (serif)',
    family: '"Playfair Display", Georgia, serif',
    google: 'Playfair+Display:wght@400;500;600;700',
  },
  lora: { label: 'Lora (serif)', family: '"Lora", Georgia, serif', google: 'Lora:wght@400;500;600;700' },
  merriweather: {
    label: 'Merriweather (serif)',
    family: '"Merriweather", Georgia, serif',
    google: 'Merriweather:wght@400;700',
  },
} as const
export type FontKey = keyof typeof FONTS

export type Theme = {
  siteName: string
  logoUrl: string
  faviconUrl: string
  brandColor: string
  headingFont: FontKey
  bodyFont: FontKey
}

export type Contact = { email: string; phone: string; location: string; responseTime: string }
export type Nav = { links: LinkItem[]; cta: LinkItem }
export type FooterColumn = { title: string; links: LinkItem[] }
export type Footer = {
  tagline: string
  columns: FooterColumn[]
  showContact: boolean
  contactTitle: string
  bottomLeft: string
  bottomRight: string
}

// ---- block props -----------------------------------------------------------

export type IconCard = { icon: string; title: string; body: string }

export type BlockPropsMap = {
  page_header: { eyebrow: string; title: string; description: string; align: Align }
  hero: {
    badgeTag: string
    badge: string
    title: string
    highlight: string
    subtitle: string
    primaryCta: LinkItem
    secondaryCta: LinkItem
    ratingValue: string
    trustText: string
    showMockup: boolean
    mockupDomain: string
    imageUrl: string
    imageAlt: string
  }
  marquee: { label: string; items: { text: string }[] }
  stats: { items: { value: string; label: string }[] }
  services_grid: {
    eyebrow: string
    title: string
    description: string
    columns: 3 | 4
    limit: number
    showLink: boolean
    linkLabel: string
    linkTo: string
    emptyText: string
  }
  steps: { eyebrow: string; title: string; description: string; align: Align; items: IconCard[] }
  features: {
    eyebrow: string
    title: string
    description: string
    columns: 2 | 3 | 4
    cta: LinkItem
    items: IconCard[]
  }
  testimonials: {
    eyebrow: string
    title: string
    description: string
    items: { quote: string; name: string; role: string; avatarUrl: string }[]
  }
  faq: { eyebrow: string; title: string; description: string; items: { q: string; a: string }[] }
  cta_band: { title: string; description: string; primary: LinkItem; secondary: LinkItem }
  text: { eyebrow: string; title: string; body: string; align: Align }
  image: { imageUrl: string; alt: string; caption: string; size: 'normal' | 'wide' }
  image_text: {
    eyebrow: string
    title: string
    body: string
    imageUrl: string
    alt: string
    imageSide: 'left' | 'right'
    cta: LinkItem
  }
  contact_form: {
    eyebrow: string
    title: string
    intro: string
    showDetails: boolean
    formTitle: string
    formNote: string
    submitLabel: string
    successTitle: string
    successBody: string
    privacyNote: string
  }
  spacer: { size: 'sm' | 'md' | 'lg' }
}

export type BlockType = keyof BlockPropsMap

export type Block<T extends BlockType = BlockType> = {
  [K in T]: { id: string; type: K; hidden: boolean; props: BlockPropsMap[K] }
}[T]

export type Page = {
  id: string
  path: string
  title: string
  description: string
  blocks: Block[]
}

export type SiteContent = {
  version: 1
  theme: Theme
  contact: Contact
  nav: Nav
  footer: Footer
  pages: Page[]
}

export const RESERVED_PREFIXES = ['/admin', '/api']

export function makeId(): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}
