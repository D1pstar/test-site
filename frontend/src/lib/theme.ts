/**
 * Turns the admin's brand colour + font choices into CSS variables. Only values
 * that passed validation (#rrggbb, a font key from the allow-list) reach here.
 */
import { DEFAULT_BRAND } from './site-defaults'
import { FONTS, type FontKey, type Theme } from './site-types'

// Lightness / chroma of each brand step in the built-in palette (see index.css).
const STEPS = [
  [50, 0.97, 0.02],
  [100, 0.94, 0.04],
  [200, 0.88, 0.07],
  [300, 0.8, 0.11],
  [400, 0.71, 0.15],
  [500, 0.62, 0.18],
  [600, 0.54, 0.19],
  [700, 0.46, 0.17],
  [800, 0.38, 0.14],
  [900, 0.3, 0.11],
] as const

function srgbToLinear(v: number) {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
function linearToSrgb(v: number) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
}

/** #rrggbb -> OKLCH hue (degrees) and chroma. */
export function hexToOklch(hex: string): { h: number; c: number } {
  const n = parseInt(hex.slice(1), 16)
  const r = srgbToLinear(((n >> 16) & 255) / 255)
  const g = srgbToLinear(((n >> 8) & 255) / 255)
  const b = srgbToLinear((n & 255) / 255)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { c: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 }
}

/** OKLCH -> #rrggbb (clipped to sRGB). Used for swatches and the default colour. */
export function oklchToHex(L: number, C: number, H: number): string {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  return (
    '#' +
    lin
      .map((v) => Math.round(Math.min(1, Math.max(0, linearToSrgb(Math.min(1, Math.max(0, v))))) * 255))
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  )
}

export type BrandScale = { step: number; css: string; hex: string }[]

/** The ten brand shades for a given brand colour (hue and vividness are taken from it). */
export function brandScale(hex: string): BrandScale {
  const { h, c } = hexToOklch(hex)
  const factor = Math.min(1.6, Math.max(0.08, c / 0.18))
  return STEPS.map(([step, L, C]) => {
    const chroma = Math.min(0.32, C * factor)
    return {
      step,
      css: `oklch(${L} ${chroma.toFixed(4)} ${h.toFixed(1)})`,
      hex: oklchToHex(L, chroma, h),
    }
  })
}

const loadedFonts = new Set<string>()

function loadFont(key: FontKey) {
  const google = FONTS[key].google
  if (!google || loadedFonts.has(google)) return
  loadedFonts.add(google)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${google}&display=swap`
  link.dataset.themeFont = google
  document.head.appendChild(link)
}

const BRAND_VARS = STEPS.map(([step]) => `--color-brand-${step}`)

export function applyTheme(theme: Theme) {
  const root = document.documentElement

  if (theme.brandColor.toLowerCase() === DEFAULT_BRAND.toLowerCase()) {
    // Built-in palette from index.css: remove any overrides.
    for (const v of [...BRAND_VARS, '--accent-2', '--accent-3']) root.style.removeProperty(v)
  } else {
    const scale = brandScale(theme.brandColor)
    for (const { step, css } of scale) root.style.setProperty(`--color-brand-${step}`, css)
    const { h } = hexToOklch(theme.brandColor)
    root.style.setProperty('--accent-2', `oklch(0.62 0.2 ${((h + 40) % 360).toFixed(1)})`)
    root.style.setProperty('--accent-3', `oklch(0.7 0.17 ${((h + 80) % 360).toFixed(1)})`)
  }

  loadFont(theme.bodyFont)
  loadFont(theme.headingFont)
  root.style.setProperty('--font-sans', FONTS[theme.bodyFont].family)
  root.style.setProperty('--font-heading', FONTS[theme.headingFont].family)

  // Favicon
  const href = theme.faviconUrl
  let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-site-theme]')
  if (href) {
    if (!icon) {
      icon = document.createElement('link')
      icon.rel = 'icon'
      icon.dataset.siteTheme = '1'
      document.head.appendChild(icon)
    }
    icon.href = href
  } else {
    icon?.remove()
  }
}
