import { useSearchParams } from 'react-router-dom'
import { ExternalLink, Image as ImageIcon, LayoutTemplate, LogOut, MessageSquare, Navigation, Palette, Wrench } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { useAdminLogout, useAdminMessages } from '../hooks/useAdmin'
import { EditorGate, EditorProvider } from './editor'
import DraftBar from './DraftBar'
import MessagesTab from './MessagesTab'
import PagesTab from './PagesTab'
import ThemeTab from './ThemeTab'
import NavFooterTab from './NavFooterTab'
import ServicesTab from './ServicesTab'
import MediaTab from './MediaTab'

const TABS = [
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'pages', label: 'Pages', icon: LayoutTemplate },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'nav', label: 'Navigation & footer', icon: Navigation },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'media', label: 'Images', icon: ImageIcon },
] as const
type TabId = (typeof TABS)[number]['id']

// Tabs that edit the draft/publish document.
const DRAFT_TABS: TabId[] = ['pages', 'theme', 'nav']

export default function AdminShell({ username }: { username: string }) {
  return (
    // The editor state lives above the tabs so unsaved edits survive switching tabs.
    <EditorProvider>
      <Shell username={username} />
    </EditorProvider>
  )
}

function Shell({ username }: { username: string }) {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab') as TabId | null
  const tab: TabId = TABS.some((t) => t.id === requested) ? (requested as TabId) : 'messages'
  const logout = useAdminLogout()
  const messages = useAdminMessages(true)
  const unread = messages.data?.filter((m) => !m.is_read).length ?? 0

  return (
    <div className="min-h-full">
      <header className="border-b border-ink-200 bg-white/80 dark:border-white/10 dark:bg-ink-900/60">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Site admin</h1>
          <span className="text-xs text-ink-500">Signed in as {username}</span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-900/5 dark:text-ink-300 dark:hover:bg-white/10"
            >
              <ExternalLink className="size-4" /> View site
            </a>
            <ThemeToggle />
            <button type="button" onClick={() => logout.mutate()} className="btn-secondary !px-4 !py-2">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-4">
          {TABS.map((t) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => setParams({ tab: t.id })}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'border-brand-500 text-brand-700 dark:text-brand-300'
                    : 'border-transparent text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
                {t.id === 'messages' && unread > 0 && (
                  <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-white">{unread}</span>
                )}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6">
        {DRAFT_TABS.includes(tab) ? (
          <EditorGate>
            <DraftBar />
            {tab === 'pages' && <PagesTab />}
            {tab === 'theme' && <ThemeTab />}
            {tab === 'nav' && <NavFooterTab />}
          </EditorGate>
        ) : (
          <>
            {tab === 'messages' && <MessagesTab />}
            {tab === 'services' && <ServicesTab />}
            {tab === 'media' && <MediaTab />}
          </>
        )}
      </main>
    </div>
  )
}
