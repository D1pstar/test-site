/** What each block type is called, how to create one, and which fields the editor shows. */
import type { Block, BlockPropsMap, BlockType } from '../lib/site-types'
import { makeId } from '../lib/site-types'
import type { FieldSpec } from './fields'

const ALIGN = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Centered' },
]
const emptyLink = { label: '', to: '' }

const iconCardFields = (allowNone: boolean): FieldSpec[] => [
  { kind: 'icon', key: 'icon', label: 'Icon', allowNone, help: allowNone ? 'No icon = a numbered card.' : undefined },
  { kind: 'text', key: 'title', label: 'Title' },
  { kind: 'textarea', key: 'body', label: 'Text' },
]

export type BlockSpec<T extends BlockType = BlockType> = {
  label: string
  description: string
  fields: FieldSpec[]
  create: () => BlockPropsMap[T]
}

export const BLOCK_SPECS: { [K in BlockType]: BlockSpec<K> } = {
  page_header: {
    label: 'Page heading',
    description: 'Big title with a small label and intro text. Use once at the top of a page.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label above the title' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'description', label: 'Intro text' },
      { kind: 'select', key: 'align', label: 'Alignment', options: ALIGN },
    ],
    create: () => ({ eyebrow: 'New page', title: 'Page title', description: 'A short introduction.', align: 'left' }),
  },
  hero: {
    label: 'Hero (home banner)',
    description: 'Large headline, two buttons, rating line, and a picture or browser mockup.',
    fields: [
      { kind: 'text', key: 'badgeTag', label: 'Badge tag', max: 30, help: 'The small coloured pill, e.g. “New”. Empty hides it.' },
      { kind: 'text', key: 'badge', label: 'Badge text', help: 'Empty hides the whole badge.' },
      { kind: 'text', key: 'title', label: 'Headline' },
      { kind: 'text', key: 'highlight', label: 'Highlighted last word(s)', help: 'Shown with the colour gradient.' },
      { kind: 'textarea', key: 'subtitle', label: 'Subtitle' },
      { kind: 'link', key: 'primaryCta', label: 'Main button' },
      { kind: 'link', key: 'secondaryCta', label: 'Second button' },
      { kind: 'text', key: 'ratingValue', label: 'Rating text', max: 20, help: 'e.g. “4.9 / 5”. Empty hides the stars.' },
      { kind: 'text', key: 'trustText', label: 'Trust line', help: 'e.g. “Trusted on 120+ projects”.' },
      { kind: 'image', key: 'imageUrl', label: 'Picture', help: 'Replaces the browser mockup when set.' },
      { kind: 'text', key: 'imageAlt', label: 'Picture description (for screen readers)' },
      { kind: 'boolean', key: 'showMockup', label: 'Show browser mockup (when no picture is set)' },
      { kind: 'text', key: 'mockupDomain', label: 'Mockup address bar text', max: 60 },
    ],
    create: () => ({
      badgeTag: 'New',
      badge: 'Announcement goes here',
      title: 'A headline that says what you do',
      highlight: 'clearly.',
      subtitle: 'One or two sentences that explain it in more detail.',
      primaryCta: { label: 'Get started', to: '/contact' },
      secondaryCta: { label: 'Learn more', to: '/about' },
      ratingValue: '',
      trustText: '',
      showMockup: true,
      mockupDomain: 'yourbrand.com',
      imageUrl: '',
      imageAlt: '',
    }),
  },
  marquee: {
    label: 'Scrolling word strip',
    description: 'A row of words (tools, clients, keywords) that scrolls sideways.',
    fields: [
      { kind: 'text', key: 'label', label: 'Caption above the strip' },
      {
        kind: 'list',
        key: 'items',
        label: 'Words',
        itemName: 'Word',
        max: 30,
        row: false,
        fields: [{ kind: 'text', key: 'text', label: 'Text', max: 60 }],
        create: () => ({ text: 'New word' }),
      },
    ],
    create: () => ({ label: 'Trusted by', items: [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }] }),
  },
  stats: {
    label: 'Numbers / stats',
    description: 'Up to four big numbers with labels.',
    fields: [
      {
        kind: 'list',
        key: 'items',
        label: 'Stats',
        itemName: 'Stat',
        max: 4,
        row: true,
        fields: [
          { kind: 'text', key: 'value', label: 'Number', max: 20 },
          { kind: 'text', key: 'label', label: 'Label', max: 60 },
        ],
        create: () => ({ value: '100', label: 'Happy clients' }),
      },
    ],
    create: () => ({
      items: [
        { value: '100+', label: 'Projects' },
        { value: '5', label: 'Years' },
        { value: '4.9', label: 'Rating' },
      ],
    }),
  },
  services_grid: {
    label: 'Services cards',
    description: 'Cards for your services. Manage the services themselves in the Services tab.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title', help: 'Empty hides the whole heading area.' },
      { kind: 'textarea', key: 'description', label: 'Intro text' },
      {
        kind: 'select',
        key: 'columns',
        label: 'Cards per row',
        options: [
          { value: 3, label: '3' },
          { value: 4, label: '4' },
        ],
      },
      { kind: 'number', key: 'limit', label: 'Maximum cards', min: 0, max: 24, help: '0 shows all services.' },
      { kind: 'boolean', key: 'showLink', label: 'Show “see all” link' },
      { kind: 'text', key: 'linkLabel', label: 'Link text', max: 60 },
      { kind: 'url', key: 'linkTo', label: 'Link goes to' },
      { kind: 'text', key: 'emptyText', label: 'Message when there are no services' },
    ],
    create: () => ({
      eyebrow: 'Services',
      title: 'What we do',
      description: '',
      columns: 3,
      limit: 0,
      showLink: false,
      linkLabel: 'All services',
      linkTo: '/services',
      emptyText: 'No services yet.',
    }),
  },
  steps: {
    label: 'Numbered steps',
    description: 'A process shown as numbered cards with icons.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'description', label: 'Intro text' },
      { kind: 'select', key: 'align', label: 'Heading alignment', options: ALIGN },
      {
        kind: 'list',
        key: 'items',
        label: 'Steps',
        itemName: 'Step',
        max: 12,
        fields: iconCardFields(false),
        create: () => ({ icon: 'Sparkles', title: 'New step', body: 'Describe this step.' }),
      },
    ],
    create: () => ({
      eyebrow: 'Process',
      title: 'How it works',
      description: '',
      align: 'center',
      items: [
        { icon: 'Search', title: 'Step one', body: 'Describe the first step.' },
        { icon: 'Wand2', title: 'Step two', body: 'Describe the second step.' },
        { icon: 'Rocket', title: 'Step three', body: 'Describe the third step.' },
      ],
    }),
  },
  features: {
    label: 'Feature cards',
    description: 'A grid of cards. Give each an icon, or leave the icon off for numbered cards.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'description', label: 'Intro text' },
      {
        kind: 'select',
        key: 'columns',
        label: 'Cards per row',
        options: [
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
        ],
      },
      { kind: 'link', key: 'cta', label: 'Button under the cards' },
      {
        kind: 'list',
        key: 'items',
        label: 'Cards',
        itemName: 'Card',
        max: 12,
        fields: iconCardFields(true),
        create: () => ({ icon: 'Star', title: 'New card', body: 'Describe this feature.' }),
      },
    ],
    create: () => ({
      eyebrow: 'Why us',
      title: 'What sets us apart',
      description: '',
      columns: 3,
      cta: emptyLink,
      items: [
        { icon: 'Star', title: 'Feature one', body: 'Describe it.' },
        { icon: 'Zap', title: 'Feature two', body: 'Describe it.' },
        { icon: 'Heart', title: 'Feature three', body: 'Describe it.' },
      ],
    }),
  },
  testimonials: {
    label: 'Testimonials',
    description: 'Customer quotes with name, role and optional photo.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'description', label: 'Intro text' },
      {
        kind: 'list',
        key: 'items',
        label: 'Quotes',
        itemName: 'Quote',
        max: 12,
        fields: [
          { kind: 'textarea', key: 'quote', label: 'Quote' },
          { kind: 'text', key: 'name', label: 'Name' },
          { kind: 'text', key: 'role', label: 'Role / company' },
          { kind: 'image', key: 'avatarUrl', label: 'Photo (optional)' },
        ],
        create: () => ({ quote: 'What they said.', name: 'Customer name', role: 'Role, Company', avatarUrl: '' }),
      },
    ],
    create: () => ({
      eyebrow: 'Testimonials',
      title: 'What people say',
      description: '',
      items: [{ quote: 'A great quote goes here.', name: 'Jane Doe', role: 'CEO, Acme', avatarUrl: '' }],
    }),
  },
  faq: {
    label: 'FAQ',
    description: 'Questions that open to show their answers.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'description', label: 'Intro text' },
      {
        kind: 'list',
        key: 'items',
        label: 'Questions',
        itemName: 'Question',
        max: 30,
        fields: [
          { kind: 'text', key: 'q', label: 'Question' },
          { kind: 'textarea', key: 'a', label: 'Answer', max: 2000, rows: 4 },
        ],
        create: () => ({ q: 'New question?', a: 'The answer.' }),
      },
    ],
    create: () => ({
      eyebrow: 'FAQ',
      title: 'Questions, answered',
      description: '',
      items: [{ q: 'A common question?', a: 'Its answer.' }],
    }),
  },
  cta_band: {
    label: 'Call-to-action banner',
    description: 'A bold coloured banner with a headline and one or two buttons.',
    fields: [
      { kind: 'text', key: 'title', label: 'Headline' },
      { kind: 'textarea', key: 'description', label: 'Text' },
      { kind: 'link', key: 'primary', label: 'Main button' },
      { kind: 'link', key: 'secondary', label: 'Second button' },
    ],
    create: () => ({
      title: 'Ready to get started?',
      description: 'Tell us about your project.',
      primary: { label: 'Start a project', to: '/contact' },
      secondary: emptyLink,
    }),
  },
  text: {
    label: 'Text section',
    description: 'A heading and paragraphs of text.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'body', label: 'Text', max: 20000, rows: 10, help: 'Leave a blank line between paragraphs.' },
      { kind: 'select', key: 'align', label: 'Alignment', options: ALIGN },
    ],
    create: () => ({ eyebrow: '', title: 'Section title', body: 'Write your text here.', align: 'left' }),
  },
  image: {
    label: 'Image',
    description: 'A single picture with an optional caption.',
    fields: [
      { kind: 'image', key: 'imageUrl', label: 'Picture' },
      { kind: 'text', key: 'alt', label: 'Picture description (for screen readers)' },
      { kind: 'text', key: 'caption', label: 'Caption' },
      {
        kind: 'select',
        key: 'size',
        label: 'Width',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'wide', label: 'Wide' },
        ],
      },
    ],
    create: () => ({ imageUrl: '', alt: '', caption: '', size: 'normal' }),
  },
  image_text: {
    label: 'Image + text',
    description: 'A picture next to a heading, paragraphs and an optional button.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'body', label: 'Text', max: 5000, rows: 6, help: 'Leave a blank line between paragraphs.' },
      { kind: 'image', key: 'imageUrl', label: 'Picture' },
      { kind: 'text', key: 'alt', label: 'Picture description (for screen readers)' },
      {
        kind: 'select',
        key: 'imageSide',
        label: 'Picture position',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
      },
      { kind: 'link', key: 'cta', label: 'Button' },
    ],
    create: () => ({
      eyebrow: '',
      title: 'Title',
      body: 'Write about it here.',
      imageUrl: '',
      alt: '',
      imageSide: 'right',
      cta: emptyLink,
    }),
  },
  contact_form: {
    label: 'Contact form',
    description: 'The message form, plus your email, phone and location from Navigation & footer.',
    fields: [
      { kind: 'text', key: 'eyebrow', label: 'Small label' },
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'intro', label: 'Intro text' },
      { kind: 'boolean', key: 'showDetails', label: 'Show email / phone / location cards' },
      { kind: 'text', key: 'formTitle', label: 'Form heading' },
      { kind: 'text', key: 'formNote', label: 'Note under the form heading' },
      { kind: 'text', key: 'submitLabel', label: 'Send button text', max: 40 },
      { kind: 'text', key: 'privacyNote', label: 'Small privacy note next to the button' },
      { kind: 'text', key: 'successTitle', label: '“Sent” heading' },
      { kind: 'textarea', key: 'successBody', label: '“Sent” message', help: '{name} is replaced with the visitor’s first name.' },
    ],
    create: () => ({
      eyebrow: 'Contact',
      title: 'Get in touch',
      intro: 'Tell us about your project.',
      showDetails: true,
      formTitle: 'Send us a message',
      formNote: 'Fields marked * are required.',
      submitLabel: 'Send message',
      successTitle: 'Message received',
      successBody: 'Thanks, {name}. We’ll be in touch soon.',
      privacyNote: 'We’ll only use this to reply.',
    }),
  },
  spacer: {
    label: 'Empty space',
    description: 'Adds blank space between sections.',
    fields: [
      {
        kind: 'select',
        key: 'size',
        label: 'Size',
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
    ],
    create: () => ({ size: 'md' }),
  },
}

export const BLOCK_TYPES = Object.keys(BLOCK_SPECS) as BlockType[]

export function newBlock(type: BlockType): Block {
  return { id: makeId(), type, hidden: false, props: BLOCK_SPECS[type].create() } as Block
}

/** A short description of a block for its collapsed header. */
export function summarize(block: Block): string {
  const p = block.props as unknown as Record<string, unknown>
  for (const key of ['title', 'badge', 'label', 'eyebrow', 'caption']) {
    const v = p[key]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  const items = p.items
  if (Array.isArray(items)) return `${items.length} item${items.length === 1 ? '' : 's'}`
  return ''
}
