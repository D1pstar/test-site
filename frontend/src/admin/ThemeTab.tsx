import { FieldForm, type FieldSpec, type Obj } from './fields'
import { useEditor } from './editor'
import { brandScale } from '../lib/theme'
import { DEFAULT_BRAND } from '../lib/site-defaults'
import { FONTS } from '../lib/site-types'
import { panel, smallBtn } from './ui'

const fontOptions = Object.entries(FONTS).map(([value, f]) => ({ value, label: f.label }))

const FIELDS: FieldSpec[] = [
  { kind: 'text', key: 'siteName', label: 'Site name', max: 60, help: 'Shown in the menu, footer and browser tab.' },
  { kind: 'image', key: 'logoUrl', label: 'Logo', help: 'Shown next to the site name. Leave empty for the default sparkle icon.' },
  { kind: 'image', key: 'faviconUrl', label: 'Browser tab icon (favicon)', help: 'A small square image works best.' },
  {
    kind: 'color',
    key: 'brandColor',
    label: 'Brand colour',
    help: 'Buttons, links, highlights and gradients all follow this colour.',
  },
  { kind: 'select', key: 'headingFont', label: 'Heading font', options: fontOptions },
  {
    kind: 'select',
    key: 'bodyFont',
    label: 'Body font',
    options: fontOptions,
    help: 'Fonts other than Inter and System are loaded from Google Fonts.',
  },
]

export default function ThemeTab() {
  const { content, setContent } = useEditor()
  const { theme } = content
  const scale = /^#[0-9a-fA-F]{6}$/.test(theme.brandColor) ? brandScale(theme.brandColor) : []

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className={panel}>
        <FieldForm
          fields={FIELDS}
          value={theme as unknown as Obj}
          onChange={(v) => setContent((c) => ({ ...c, theme: v as unknown as typeof c.theme }))}
        />
      </div>

      <div className={panel}>
        <h2 className="text-sm font-semibold">Colour shades</h2>
        <p className="mt-1 text-xs text-ink-500">
          Ten shades are generated from your brand colour’s hue and vividness. Light shades are used for
          backgrounds, dark ones for gradients and the call-to-action banner.
        </p>
        <div className="mt-4 flex overflow-hidden rounded-xl border border-ink-200 dark:border-white/10">
          {scale.map((s) => (
            <div key={s.step} className="h-14 flex-1" style={{ background: s.hex }} title={`${s.step}: ${s.hex}`} />
          ))}
        </div>
        <button
          type="button"
          className={`${smallBtn} mt-4`}
          onClick={() => setContent((c) => ({ ...c, theme: { ...c.theme, brandColor: DEFAULT_BRAND } }))}
        >
          Reset to the original blue
        </button>
      </div>
    </div>
  )
}
