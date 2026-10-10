import { FieldForm, type FieldSpec, type Obj } from './fields'
import { useEditor } from './editor'
import { panel } from './ui'

const linkList = (key: string, label: string, itemName: string): FieldSpec => ({
  kind: 'list',
  key,
  label,
  itemName,
  max: 12,
  row: true,
  fields: [
    { kind: 'text', key: 'label', label: 'Text', max: 80 },
    { kind: 'url', key: 'to', label: 'Goes to' },
  ],
  create: () => ({ label: 'New link', to: '/' }),
})

const NAV_FIELDS: FieldSpec[] = [
  linkList('links', 'Menu links', 'Link'),
  { kind: 'link', key: 'cta', label: 'Menu button (top right)' },
]

const CONTACT_FIELDS: FieldSpec[] = [
  { kind: 'text', key: 'email', label: 'Email', max: 120 },
  { kind: 'text', key: 'phone', label: 'Phone', max: 40 },
  { kind: 'text', key: 'location', label: 'Location', max: 80 },
  { kind: 'text', key: 'responseTime', label: 'Response-time note', help: 'Shown on the contact page.' },
]

const FOOTER_FIELDS: FieldSpec[] = [
  { kind: 'textarea', key: 'tagline', label: 'Short description', max: 500 },
  {
    kind: 'list',
    key: 'columns',
    label: 'Link columns',
    itemName: 'Column',
    max: 4,
    fields: [
      { kind: 'text', key: 'title', label: 'Column title', max: 60 },
      {
        ...linkList('links', 'Links', 'Link'),
        // In a footer column, a link without an address is shown as plain text.
        help: 'A link with no address is shown as plain text.',
      },
    ],
    create: () => ({ title: 'New column', links: [{ label: 'Link', to: '/' }] }),
  },
  { kind: 'boolean', key: 'showContact', label: 'Show email / phone / location column' },
  { kind: 'text', key: 'contactTitle', label: 'Contact column title', max: 60 },
  { kind: 'text', key: 'bottomLeft', label: 'Bottom line (left)', help: '{year} becomes the current year.' },
  { kind: 'text', key: 'bottomRight', label: 'Bottom line (right)' },
]

export default function NavFooterTab() {
  const { content, setContent } = useEditor()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className={panel}>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Menu</h2>
        <FieldForm
          fields={NAV_FIELDS}
          value={content.nav as unknown as Obj}
          onChange={(v) => setContent((c) => ({ ...c, nav: v as unknown as typeof c.nav }))}
        />
      </section>
      <section className={panel}>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Contact details</h2>
        <FieldForm
          fields={CONTACT_FIELDS}
          value={content.contact as unknown as Obj}
          onChange={(v) => setContent((c) => ({ ...c, contact: v as unknown as typeof c.contact }))}
        />
      </section>
      <section className={panel}>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Footer</h2>
        <FieldForm
          fields={FOOTER_FIELDS}
          value={content.footer as unknown as Obj}
          onChange={(v) => setContent((c) => ({ ...c, footer: v as unknown as typeof c.footer }))}
        />
      </section>
    </div>
  )
}
