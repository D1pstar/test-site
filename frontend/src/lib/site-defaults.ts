/**
 * Built-in content: a faithful copy of the original hard-coded site. It is what
 * visitors see until an admin publishes their own, and what the editor starts
 * from the first time it opens.
 */
import type { Block, BlockPropsMap, BlockType, SiteContent } from './site-types'

export const DEFAULT_BRAND = '#3f82f0'

function b<T extends BlockType>(id: string, type: T, props: BlockPropsMap[T]): Block {
  return { id, type, hidden: false, props } as Block
}

const noLink = { label: '', to: '' }

const CTA_BAND = (id: string, title?: string, description?: string): Block =>
  b(id, 'cta_band', {
    title: title ?? 'Have a project in mind?',
    description:
      description ??
      "Let's talk about what you're trying to build and whether we're a good fit.",
    primary: { label: 'Start a project', to: '/contact' },
    secondary: { label: 'Email us', to: 'mailto:hello@test-site.dev' },
  })

export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  theme: {
    siteName: 'test-site',
    logoUrl: '',
    faviconUrl: '',
    brandColor: DEFAULT_BRAND,
    headingFont: 'inter',
    bodyFont: 'inter',
  },
  contact: {
    email: 'hello@test-site.dev',
    phone: '+1 (555) 555-0100',
    location: 'Remote · Worldwide',
    responseTime: 'Typical response time: under 24 hours',
  },
  nav: {
    links: [
      { label: 'Home', to: '/' },
      { label: 'Services', to: '/services' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
    cta: { label: 'Start a project', to: '/contact' },
  },
  footer: {
    tagline:
      'A demo studio site used to show prospective clients what a modern, polished web presence looks like. Not a real agency — but the stack, the patterns, and the polish all are.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/services' },
          { label: 'About', to: '/about' },
          { label: 'Contact', to: '/contact' },
        ],
      },
      {
        title: 'Studio',
        links: [
          { label: 'Design & development', to: '' },
          { label: 'Brand & strategy', to: '' },
          { label: 'Ongoing support', to: '' },
        ],
      },
    ],
    showContact: true,
    contactTitle: 'Get in touch',
    bottomLeft: '© {year} test-site. Demo only. No real services rendered.',
    bottomRight: 'Built with React, TypeScript & Tailwind.',
  },
  pages: [
    {
      id: 'home',
      path: '/',
      title: 'Home',
      description: 'A demo studio site showing a modern, polished web presence.',
      blocks: [
        b('home-hero', 'hero', {
          badgeTag: 'New',
          badge: 'Taking on projects for next quarter',
          title: 'A web presence that does your work',
          highlight: 'justice.',
          subtitle:
            'We design and build fast, modern websites that look sharp, read clearly, and turn visitors into customers. This page is a live demo of what that looks like.',
          primaryCta: { label: 'Start a project', to: '/contact' },
          secondaryCta: { label: 'What we do', to: '/services' },
          ratingValue: '4.9 / 5',
          trustText: 'Trusted on 120+ projects',
          showMockup: true,
          mockupDomain: 'yourbrand.com',
          imageUrl: '',
          imageAlt: '',
        }),
        b('home-marquee', 'marquee', {
          label: 'Built on a modern, proven stack',
          items: [
            'React',
            'TypeScript',
            'Tailwind CSS',
            'FastAPI',
            'PostgreSQL',
            'Vite',
            'SQLAlchemy',
            'Docker',
          ].map((text) => ({ text })),
        }),
        b('home-stats', 'stats', {
          items: [
            { value: '120+', label: 'Projects shipped' },
            { value: '8', label: 'Years in business' },
            { value: '4.9', label: 'Avg. client rating' },
          ],
        }),
        b('home-services', 'services_grid', {
          eyebrow: 'Services',
          title: 'Everything you need to launch and grow',
          description: 'A focused set of capabilities, done well. Click any card to read more.',
          columns: 4,
          limit: 0,
          showLink: true,
          linkLabel: 'All services',
          linkTo: '/services',
          emptyText: 'No services yet.',
        }),
        b('home-steps', 'steps', {
          eyebrow: 'Process',
          title: 'Simple, transparent, and fast',
          description: 'No black boxes. You’ll always know what’s happening and what’s next.',
          align: 'center',
          items: [
            {
              icon: 'Search',
              title: 'Discover',
              body: 'We learn your goals, audience, and constraints, then agree on a clear scope before any pixels move.',
            },
            {
              icon: 'Wand2',
              title: 'Design',
              body: 'Wireframes and high-fidelity mockups you can react to, refined in quick, honest feedback loops.',
            },
            {
              icon: 'Rocket',
              title: 'Build & launch',
              body: 'Fast, accessible, well-tested code shipped in small increments, so you see real progress every week.',
            },
          ],
        }),
        b('home-testimonials', 'testimonials', {
          eyebrow: 'Testimonials',
          title: 'Loved by teams who care about the details',
          description: '',
          items: [
            {
              quote:
                'They turned a fuzzy idea into a site we’re proud to send people to. Our inquiries doubled within two months.',
              name: 'Maya Chen',
              role: 'Founder, Lumen Studio',
              avatarUrl: '',
            },
            {
              quote:
                'Fast, clear communication and zero surprises. The best agency experience we’ve had, by a wide margin.',
              name: 'Daniel Okafor',
              role: 'COO, Northwind Logistics',
              avatarUrl: '',
            },
            {
              quote:
                'The attention to detail is unreal. Every interaction feels intentional, and the site loads instantly.',
              name: 'Priya Raman',
              role: 'Head of Marketing, Fieldnote',
              avatarUrl: '',
            },
          ],
        }),
        b('home-faq', 'faq', {
          eyebrow: 'FAQ',
          title: 'Questions, answered',
          description: 'Can’t find what you’re looking for? Reach out and we’ll get back within a day.',
          items: [
            {
              q: 'How long does a typical project take?',
              a: 'Most marketing sites ship in 3–6 weeks from kickoff. Larger products with custom back-end work are scoped individually, and we’ll give you a realistic timeline before you commit.',
            },
            {
              q: 'What does it cost?',
              a: 'Every engagement is scoped to your needs, so pricing varies. After a short intro call we send a fixed-price proposal with no hidden extras.',
            },
            {
              q: 'Do you work with existing brands and codebases?',
              a: 'Yes. We can build on top of your current brand guidelines, design system, or code, or help you create new ones from scratch.',
            },
            {
              q: 'What happens after launch?',
              a: 'We stick around. Every project includes a support window, and ongoing maintenance plans are available if you want us to keep improving things.',
            },
          ],
        }),
        CTA_BAND('home-cta'),
      ],
    },
    {
      id: 'services',
      path: '/services',
      title: 'Services',
      description: 'A focused set of capabilities, done well.',
      blocks: [
        b('services-header', 'page_header', {
          eyebrow: 'Services',
          title: 'What we do',
          description:
            'A focused set of capabilities, done well. Every engagement is scoped to what actually moves your business forward.',
          align: 'left',
        }),
        b('services-grid', 'services_grid', {
          eyebrow: '',
          title: '',
          description: '',
          columns: 3,
          limit: 0,
          showLink: false,
          linkLabel: '',
          linkTo: '',
          emptyText: 'No services yet.',
        }),
        CTA_BAND(
          'services-cta',
          'Not sure which service fits?',
          "Tell us what you're trying to accomplish and we'll suggest a scope.",
        ),
      ],
    },
    {
      id: 'about',
      path: '/about',
      title: 'About',
      description: 'A small studio with a long attention span.',
      blocks: [
        b('about-header', 'page_header', {
          eyebrow: 'About',
          title: 'A small studio with a long attention span',
          description:
            "We're a tight team of designers and engineers who like doing the work properly. No account managers between you and the people building your site.",
          align: 'left',
        }),
        b('about-stats', 'stats', {
          items: [
            { value: '120+', label: 'Projects shipped' },
            { value: '8', label: 'Years in business' },
            { value: '4.9', label: 'Avg. client rating' },
            { value: '< 24h', label: 'Response time' },
          ],
        }),
        b('about-values', 'features', {
          eyebrow: 'How we work',
          title: 'Principles we actually follow',
          description:
            'Not a values page written by a committee. These are the ones that show up in the work.',
          columns: 2,
          cta: noLink,
          items: [
            {
              icon: '',
              title: 'Clarity over cleverness',
              body: 'Interfaces that say what they mean. Copy that reads in one pass. Code the next developer can pick up on a Monday.',
            },
            {
              icon: '',
              title: 'Ship small, ship often',
              body: 'Working software in front of real users beats a perfect plan that never leaves the whiteboard.',
            },
            {
              icon: '',
              title: 'Design is not decoration',
              body: 'Every spacing decision, every color choice, every transition earns its place or it goes.',
            },
            {
              icon: '',
              title: 'Own the outcome',
              body: "We don't hand off and disappear. If something isn't working after launch, that's our problem to solve.",
            },
          ],
        }),
        b('about-capabilities', 'features', {
          eyebrow: 'Capabilities',
          title: 'Design, build, and support — under one roof',
          description: '',
          columns: 3,
          cta: { label: 'Work with us', to: '/contact' },
          items: [
            {
              icon: 'PenTool',
              title: 'Design',
              body: 'Wireframes, high-fidelity mockups, design systems, and the handoff docs that keep them honest.',
            },
            {
              icon: 'CodeXml',
              title: 'Build',
              body: 'React, TypeScript, Tailwind on the front. FastAPI, SQLAlchemy, Postgres on the back. Nothing exotic, everything solid.',
            },
            {
              icon: 'LifeBuoy',
              title: 'Support',
              body: 'Launch is the start. We stick around for the bug reports, the tweaks, and the "can we add one more thing" requests.',
            },
          ],
        }),
        CTA_BAND('about-cta'),
      ],
    },
    {
      id: 'contact',
      path: '/contact',
      title: 'Contact',
      description: "Tell us about your project and we'll get back to you within one business day.",
      blocks: [
        b('contact-form', 'contact_form', {
          eyebrow: 'Contact',
          title: "Let's talk about your project",
          intro:
            "Tell us a bit about what you're working on. We'll get back to you within one business day with next steps or a suggestion.",
          showDetails: true,
          formTitle: 'Send us a message',
          formNote: 'Fields marked * are required.',
          submitLabel: 'Send message',
          successTitle: 'Message received',
          successBody: "Thanks, {name}. We'll be in touch soon — usually within a business day.",
          privacyNote: "We'll only use this to reply. No lists, no spam.",
        }),
      ],
    },
  ],
}
