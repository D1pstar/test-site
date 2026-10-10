/**
 * The "generator" pipeline:
 *   client brief  ->  AI prompt  ->  AI's config (JSON)  ->  normalised site + services.
 *
 * The AI only has to write the parts that matter (text, structure). Everything
 * it leaves out is filled with neutral blanks, ids are generated here, and the
 * server's real validator has the final say before anything is saved.
 */
import { BLOCK_SPECS, BLOCK_TYPES } from '../admin/block-specs'
import type { FieldSpec } from '../admin/fields'
import { slugify } from '../admin/ui'
import { DEFAULT_CONTENT } from './site-defaults'
import { ICON_NAMES } from './icons'
import type { ServiceInput } from './site-api'
import { FONTS, makeId, type Block, type BlockType, type Page, type SiteContent } from './site-types'

// --------------------------------------------------------------------------
// The brief (what you know about the client)
// --------------------------------------------------------------------------

export const TONES = [
  { id: 'friendly', label: 'Friendly', hint: 'Warm, approachable' },
  { id: 'professional', label: 'Professional', hint: 'Clear, trustworthy' },
  { id: 'bold', label: 'Bold', hint: 'Confident, punchy' },
  { id: 'premium', label: 'Premium', hint: 'Refined, understated' },
  { id: 'playful', label: 'Playful', hint: 'Fun, light-hearted' },
  { id: 'calm', label: 'Calm', hint: 'Gentle, reassuring' },
] as const

export const FONT_STYLES = [
  { id: 'auto', label: 'Let the AI choose' },
  { id: 'modern', label: 'Modern & clean' },
  { id: 'classic', label: 'Classic & elegant (serif headings)' },
  { id: 'friendly', label: 'Friendly & rounded' },
  { id: 'bold', label: 'Bold & techy' },
] as const

export const PAGE_CHOICES = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const

export type Brief = {
  businessName: string
  industry: string
  description: string
  location: string
  audience: string
  tone: (typeof TONES)[number]['id']
  goal: string
  pages: string[]
  otherPages: string
  services: string
  about: string
  email: string
  phone: string
  responseTime: string
  brandColor: string
  fontStyle: (typeof FONT_STYLES)[number]['id']
  mustInclude: string
  avoid: string
  extra: string
}

export const EMPTY_BRIEF: Brief = {
  businessName: '',
  industry: '',
  description: '',
  location: '',
  audience: '',
  tone: 'friendly',
  goal: '',
  pages: ['about', 'services', 'contact'],
  otherPages: '',
  services: '',
  about: '',
  email: '',
  phone: '',
  responseTime: '',
  brandColor: '',
  fontStyle: 'auto',
  mustInclude: '',
  avoid: '',
  extra: '',
}

/** The brief as a compact object: empty answers are left out. */
export function briefToJson(b: Brief): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(b)) {
    if (Array.isArray(v) ? v.length === 0 : typeof v === 'string' ? v.trim() === '' : false) continue
    if (k === 'fontStyle' && v === 'auto') continue
    out[k] = typeof v === 'string' ? v.trim() : v
  }
  if (out.services) out.services = String(out.services).split('\n').map((s) => s.trim()).filter(Boolean)
  return out
}

export function briefProblem(b: Brief): string | null {
  if (!b.businessName.trim()) return 'Add the business name.'
  if (!b.industry.trim() && !b.description.trim()) return 'Say what the business does.'
  if (b.brandColor && !/^#[0-9a-fA-F]{6}$/.test(b.brandColor)) return 'The brand colour must look like #3f82f0.'
  return null
}

// --------------------------------------------------------------------------
// The prompt for the AI (built from the live block definitions, so it can't go stale)
// --------------------------------------------------------------------------

function describeField(f: FieldSpec): string {
  switch (f.kind) {
    case 'text':
    case 'textarea':
      return `${f.key}: text${f.max ? ` (max ${f.max} chars)` : ''} — ${f.label}${f.help ? `. ${f.help}` : ''}`
    case 'url':
      return `${f.key}: link — ${f.label}`
    case 'image':
      return `${f.key}: ALWAYS "" (images are added later by hand) — ${f.label}`
    case 'icon':
      return `${f.key}: icon name from the icon list${f.allowNone ? ' or "" for none' : ''} — ${f.label}`
    case 'boolean':
      return `${f.key}: true/false — ${f.label}`
    case 'number':
      return `${f.key}: number${f.min !== undefined ? ` ${f.min}-${f.max}` : ''} — ${f.label}${f.help ? `. ${f.help}` : ''}`
    case 'select':
      return `${f.key}: one of ${f.options.map((o) => JSON.stringify(o.value)).join(', ')} — ${f.label}`
    case 'color':
      return `${f.key}: "#rrggbb"`
    case 'link':
      return `${f.key}: {"label": "...", "to": "..."} — ${f.label}. Use {"label":"","to":""} to hide it`
    case 'list':
      return `${f.key}: list${f.max ? ` (max ${f.max})` : ''} of {${f.fields.filter((x) => x.kind !== 'image').map((x) => x.key).join(', ')}} — ${f.label}`
  }
}

export function describeBlocks(): string {
  return BLOCK_TYPES.map((t) => {
    const spec = BLOCK_SPECS[t]
    return `### ${t} — ${spec.label}\n${spec.description}\nprops (all optional; leave out what you don't need):\n${spec.fields.map((f) => `  - ${describeField(f)}`).join('\n')}`
  }).join('\n\n')
}

const EXAMPLE = `{
  "format": "site-config/1",
  "theme": { "siteName": "Example Co", "brandColor": "#2f7d6d", "headingFont": "playfair", "bodyFont": "inter" },
  "contact": { "email": "hello@example.com", "phone": "(555) 010-2030", "location": "Springfield, IL", "responseTime": "We reply within one business day." },
  "pages": [
    { "title": "Home", "path": "/", "description": "One sentence for Google.",
      "blocks": [
        { "type": "hero", "props": { "title": "Headline that says what you do", "highlight": "clearly.", "subtitle": "One or two sentences.", "primaryCta": { "label": "Get a quote", "to": "/contact" } } },
        { "type": "services_grid", "props": { "eyebrow": "Services", "title": "What we do" } },
        { "type": "cta_band", "props": { "title": "Ready to start?", "primary": { "label": "Contact us", "to": "/contact" } } }
      ] },
    { "title": "Contact", "path": "/contact", "description": "How to reach us.",
      "blocks": [ { "type": "contact_form", "props": { "title": "Get in touch" } } ] }
  ],
  "services": [
    { "title": "Service name", "slug": "service-name", "summary": "One line (max 240 chars).", "description": "A few sentences.", "icon": "Sparkles" }
  ]
}`

export function buildPrompt(brief: Brief): string {
  const fonts = Object.entries(FONTS).map(([k, f]) => `${k} (${f.label})`).join(', ')
  return `You are a senior web copywriter and information architect. Design the content and structure of a small-business website from the client brief at the bottom, and answer with ONE JSON "site config" that my website builder will import.

# Output rules
- Reply with the JSON object only (a \`\`\`json code fence is fine). No commentary before or after.
- It must be valid JSON: double quotes, no comments, no trailing commas.
- Use exactly the structure and field names below. Do not invent new block types or fields.

# Structure
\`\`\`json
${EXAMPLE}
\`\`\`
- "theme", "contact" and "services" are as shown. "nav" and "footer" are OPTIONAL; if you leave them out, the menu and footer are built from your pages. If you include them: "nav": {"links":[{"label","to"}], "cta":{"label","to"}} and "footer": {"tagline", "columns":[{"title","links":[{"label","to"}]}], "showContact": true, "bottomLeft": "© {year} Name", "bottomRight": ""}.
- Pages: the first page is the home page with path "/". Other paths are lowercase letters, numbers and dashes with one leading slash, e.g. "/about" or "/our-work". Never use paths starting with /admin, /api or /services/.
- Each page has "blocks", shown top to bottom. Typical pages use 3–7 blocks. Start most pages with "page_header" (the home page starts with "hero"). End with "cta_band" or "contact_form" where it makes sense. Mix block types so the page doesn't feel repetitive.
- "services_grid" blocks automatically show the entries of the top-level "services" list, so include 3–8 services if you use it. Each service needs "title", "slug" (lowercase-with-dashes), "summary" (1 line, max 240 chars), "description" and "icon".
- Links ("to") are internal paths like "/contact", in-page anchors like "#faq", "mailto:you@site.com", "tel:+15550102030" or full https:// addresses.
- Text is plain text only (no HTML or markdown). For multi-paragraph text separate paragraphs with a blank line.
- theme.brandColor is a hex colour like "#2f7d6d". Pick one that fits the business (or use the client's), with enough contrast for white button text. theme.headingFont and theme.bodyFont must be one of: ${fonts}.
- Icons must come from this list: ${ICON_NAMES.join(', ')}.
- Never put anything in image fields: always "". The images are added later.

# Content rules
- Write like the business owner would speak, in the requested tone. Be specific to this business; avoid filler like "cutting-edge solutions" or "world-class".
- NEVER invent facts: no made-up customer quotes, star ratings, statistics, awards, years in business, certifications, prices, team members or street addresses. If the brief doesn't provide it, leave that block or field out. (So: no "testimonials" or "stats" blocks unless the brief gives real material for them, and leave hero.ratingValue and hero.trustText as "".)
- Keep headlines short (under ~70 characters) and intros to one or two sentences. Respect the character limits listed per field.
- Every page needs a clear next step for the visitor, matching the client's main goal.
- Set hero.showMockup to false (there is no screenshot to show).

# Available blocks
${describeBlocks()}

# Client brief
\`\`\`json
${JSON.stringify(briefToJson(brief), null, 2)}
\`\`\`
`
}

/** A follow-up prompt for when the AI's answer failed validation. */
export function buildFixPrompt(problems: string[]): string {
  return `Your site config could not be imported. Please fix these problems and send back the COMPLETE corrected JSON (JSON only, same structure as before):\n\n${problems.map((p) => `- ${p}`).join('\n')}\n`
}

// --------------------------------------------------------------------------
// Reading the AI's answer
// --------------------------------------------------------------------------

/** Pull the JSON object out of whatever the AI sent (code fences, chatter around it, …). */
export function extractJson(text: string): { value: unknown } | { error: string } {
  let src = text.trim()
  const fence = /```(?:json|JSON)?\s*\n([\s\S]*?)```/.exec(src)
  if (fence) src = fence[1].trim()
  const start = src.indexOf('{')
  const end = src.lastIndexOf('}')
  if (start === -1 || end <= start) return { error: 'I couldn’t find a JSON object in that text. Paste the AI’s whole reply.' }
  src = src.slice(start, end + 1)
  try {
    return { value: JSON.parse(src) }
  } catch (e) {
    const m = (e as Error).message
    return { error: `That isn’t valid JSON (${m}). Ask the AI to resend it as valid JSON only.` }
  }
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)

function blankValue(spec: FieldSpec, fallback: unknown): unknown {
  switch (spec.kind) {
    case 'text':
    case 'textarea':
    case 'url':
    case 'image':
      return ''
    case 'color':
      return '#000000'
    case 'icon':
      return spec.allowNone ? '' : 'Sparkles'
    case 'link':
      return { label: '', to: '' }
    case 'list':
      return []
    case 'select':
    case 'boolean':
    case 'number':
      return fallback ?? (spec.kind === 'boolean' ? false : spec.kind === 'number' ? 0 : spec.options[0].value)
  }
}

/** Fill a props/item object from the AI's partial one, dropping unknown keys. */
function fillFields(fields: FieldSpec[], given: unknown, defaults: Obj, notes: string[], where: string): Obj {
  const src = isObj(given) ? given : {}
  const out: Obj = {}
  for (const f of fields) {
    const raw = src[f.key]
    const fallback = blankValue(f, defaults[f.key])
    if (raw === undefined || raw === null) {
      out[f.key] = fallback
      continue
    }
    switch (f.kind) {
      case 'link':
        out[f.key] = isObj(raw)
          ? { label: String(raw.label ?? ''), to: String(raw.to ?? '') }
          : fallback
        break
      case 'list': {
        const arr = Array.isArray(raw) ? raw : []
        const blankItem = (): Obj => fillFields(f.fields, {}, {}, [], '')
        out[f.key] = arr.map((it) => {
          // A list of plain strings (e.g. marquee words) is accepted for single-field items.
          const item = typeof it === 'string' && f.fields.length === 1 ? { [f.fields[0].key]: it } : it
          return { ...blankItem(), ...fillFields(f.fields, item, {}, notes, where) }
        })
        break
      }
      case 'boolean':
        out[f.key] = raw === true || raw === 'true'
        break
      case 'number': {
        const n = Number(raw)
        out[f.key] = Number.isFinite(n) ? n : fallback
        break
      }
      case 'select': {
        const hit = f.options.find((o) => String(o.value) === String(raw))
        if (hit) out[f.key] = hit.value
        else {
          out[f.key] = fallback
          notes.push(`${where}: “${String(raw)}” isn’t a valid choice for ${f.key}; used the default.`)
        }
        break
      }
      case 'image':
        // Only already-uploaded or https images are valid; anything else is dropped.
        out[f.key] = typeof raw === 'string' && /^https:\/\//.test(raw) ? raw : ''
        break
      default:
        out[f.key] = typeof raw === 'string' ? raw : String(raw)
    }
  }
  return out
}

const normPath = (p: unknown, fallback: string): string => {
  let s = String(p ?? '').trim().toLowerCase()
  if (!s) s = fallback
  if (!s.startsWith('/')) s = `/${s}`
  s = s.replace(/\/{2,}/g, '/').replace(/[^a-z0-9/-]+/g, '-')
  if (s.length > 1) s = s.replace(/\/+$/, '')
  return s || '/'
}

export type Generated = {
  content: SiteContent
  services: ServiceInput[]
  /** Things I changed or ignored while reading the config. Shown to the person. */
  notes: string[]
}

/** Turn the AI's loose config into a complete SiteContent (still subject to server validation). */
export function normalizeConfig(raw: unknown): { ok: true; result: Generated } | { ok: false; error: string } {
  if (!isObj(raw)) return { ok: false, error: 'The config must be a JSON object.' }
  const notes: string[] = []
  const base = DEFAULT_CONTENT

  const pagesIn = Array.isArray(raw.pages) ? raw.pages : []
  if (pagesIn.length === 0) return { ok: false, error: 'The config has no "pages". Ask the AI to include at least a home page.' }

  const used = new Set<string>()
  const pages: Page[] = pagesIn.filter(isObj).map((p, i) => {
    const title = String(p.title ?? '').trim() || (i === 0 ? 'Home' : `Page ${i + 1}`)
    let path = i === 0 ? '/' : normPath(p.path, `/${slugify(title) || `page-${i + 1}`}`)
    if (i > 0 && path === '/') path = `/${slugify(title) || `page-${i + 1}`}`
    let n = 2
    const orig = path
    while (used.has(path)) path = `${orig}-${n++}`
    used.add(path)
    const blocksIn = Array.isArray(p.blocks) ? p.blocks : []
    const blocks: Block[] = []
    blocksIn.filter(isObj).forEach((b, j) => {
      const type = String(b.type ?? '') as BlockType
      if (!BLOCK_TYPES.includes(type)) {
        notes.push(`${title}: skipped section #${j + 1} (unknown type “${String(b.type)}”).`)
        return
      }
      const spec = BLOCK_SPECS[type]
      const props = fillFields(spec.fields, b.props, spec.create() as unknown as Obj, notes, `${title} › ${spec.label}`)
      blocks.push({ id: makeId(), type, hidden: b.hidden === true, props } as Block)
    })
    return {
      id: makeId(),
      path,
      title: title.slice(0, 120),
      description: String(p.description ?? '').slice(0, 300),
      blocks,
    }
  })
  if (!pages.some((p) => p.path === '/')) pages[0].path = '/'

  // ---- theme / contact
  const t = isObj(raw.theme) ? raw.theme : {}
  const fontKey = (v: unknown, fallback: keyof typeof FONTS) => (typeof v === 'string' && v in FONTS ? (v as keyof typeof FONTS) : fallback)
  const siteName = String(t.siteName ?? '').trim() || 'My website'
  const theme = {
    ...base.theme,
    siteName: siteName.slice(0, 60),
    logoUrl: '',
    faviconUrl: '',
    brandColor: /^#[0-9a-fA-F]{6}$/.test(String(t.brandColor ?? '')) ? String(t.brandColor).toLowerCase() : base.theme.brandColor,
    headingFont: fontKey(t.headingFont, base.theme.headingFont),
    bodyFont: fontKey(t.bodyFont, base.theme.bodyFont),
  }
  if (t.brandColor && theme.brandColor !== String(t.brandColor).toLowerCase())
    notes.push(`Brand colour “${String(t.brandColor)}” isn’t a valid #rrggbb value; kept the current colour.`)

  const c = isObj(raw.contact) ? raw.contact : {}
  const contact = {
    email: String(c.email ?? '').trim(),
    phone: String(c.phone ?? '').trim().slice(0, 40),
    location: String(c.location ?? '').trim().slice(0, 80),
    responseTime: String(c.responseTime ?? '').trim(),
  }

  // ---- nav / footer (built from the pages if the AI didn't give them)
  const link = (l: unknown) => (isObj(l) ? { label: String(l.label ?? ''), to: String(l.to ?? '') } : { label: '', to: '' })
  const contactPage = pages.find((p) => /contact/.test(p.path)) ?? null
  const nav = isObj(raw.nav)
    ? {
        links: (Array.isArray(raw.nav.links) ? raw.nav.links : []).map(link),
        cta: link(raw.nav.cta),
      }
    : {
        links: pages.map((p) => ({ label: p.title, to: p.path })).slice(0, 12),
        cta: contactPage ? { label: 'Get in touch', to: contactPage.path } : { label: '', to: '' },
      }

  const f = isObj(raw.footer) ? raw.footer : null
  const footer = {
    tagline: String(f?.tagline ?? '').slice(0, 500),
    columns: f && Array.isArray(f.columns)
      ? f.columns.filter(isObj).slice(0, 4).map((col) => ({
          title: String(col.title ?? '').slice(0, 60),
          links: (Array.isArray(col.links) ? col.links : []).map(link),
        }))
      : [{ title: 'Explore', links: pages.map((p) => ({ label: p.title, to: p.path })).slice(0, 12) }],
    showContact: f ? f.showContact !== false : true,
    contactTitle: String(f?.contactTitle ?? 'Get in touch').slice(0, 60),
    bottomLeft: String(f?.bottomLeft ?? `© {year} ${siteName}`).slice(0, 200),
    bottomRight: String(f?.bottomRight ?? '').slice(0, 200),
  }

  // ---- services
  const servicesIn = Array.isArray(raw.services) ? raw.services.filter(isObj) : []
  const seen = new Set<string>()
  const services: ServiceInput[] = servicesIn.map((s, i) => {
    const title = String(s.title ?? '').trim() || `Service ${i + 1}`
    let slug = slugify(String(s.slug ?? '') || title) || `service-${i + 1}`
    let n = 2
    const orig = slug
    while (seen.has(slug)) slug = `${orig}-${n++}`
    seen.add(slug)
    return {
      slug,
      title: title.slice(0, 120),
      summary: (String(s.summary ?? '').trim() || title).slice(0, 240),
      description: String(s.description ?? '').slice(0, 10000),
      icon: /^[A-Za-z0-9]+$/.test(String(s.icon ?? '')) && ICON_NAMES.includes(String(s.icon)) ? String(s.icon) : 'Sparkles',
      sort_order: i,
    }
  })

  const content: SiteContent = { version: 1, theme, contact, nav, footer, pages }
  return { ok: true, result: { content, services, notes } }
}
