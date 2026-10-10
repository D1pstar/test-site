/**
 * Everything that ends up in an href or src goes through here, even though the
 * server already validates it (defense in depth).
 */

const INTERNAL = /^\/(?!\/)[^\s<>"'\\]*$/
const EXTERNAL = /^https?:\/\/[^\s<>"'\\]+$/i
const MAILTO = /^mailto:[^\s<>"'\\]+$/i
const TEL = /^tel:[+0-9()\-.\s]+$/i
const ANCHOR = /^#[A-Za-z0-9_-]+$/
const IMAGE = /^(?:\/api\/media\/[0-9a-f]{32}\.(?:png|jpg|gif|webp)|https:\/\/[^\s<>"'\\]+)$/

export type LinkKind = 'internal' | 'external' | 'anchor' | 'none'

export function classifyLink(to: string): LinkKind {
  if (!to) return 'none'
  if (INTERNAL.test(to)) return 'internal'
  if (ANCHOR.test(to)) return 'anchor'
  if (EXTERNAL.test(to) || MAILTO.test(to) || TEL.test(to)) return 'external'
  return 'none'
}

export function safeImage(url: string): string {
  return IMAGE.test(url) ? url : ''
}

/** "tel:" href from a display phone number. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : ''
}
