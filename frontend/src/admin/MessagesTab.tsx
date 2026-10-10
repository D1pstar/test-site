import { Loader2, Mail, Trash2 } from 'lucide-react'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeleton'
import { useAdminMessages, useDeleteMessage, useSetRead } from '../hooks/useAdmin'
import type { ContactMessage } from '../lib/types'

/** The API returns UTC timestamps without a zone suffix; treat them as UTC. */
function formatDate(value: string) {
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value)
  const d = new Date(hasZone ? value : `${value}Z`)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function MessagesTab() {
  const messages = useAdminMessages(true)
  const unread = messages.data?.filter((m) => !m.is_read).length ?? 0

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-ink-500">
        {messages.data ? `${unread} unread of ${messages.data.length}` : ' '}
      </p>
      <div className="mt-4 space-y-4">
        {messages.isLoading && <Skeleton className="h-32 w-full" />}
        {messages.isError && <ErrorState title="Couldn’t load messages" message={(messages.error as Error).message} />}
        {messages.data?.length === 0 && (
          <p className="card p-6 text-sm text-ink-600 dark:text-ink-400">No messages yet.</p>
        )}
        {messages.data?.map((m) => <MessageCard key={m.id} message={m} />)}
      </div>
    </div>
  )
}

function MessageCard({ message: m }: { message: ContactMessage }) {
  const setRead = useSetRead()
  const remove = useDeleteMessage()
  const busy = setRead.isPending || remove.isPending

  return (
    <article className={`card p-6 ${m.is_read ? 'opacity-75' : 'ring-2 ring-brand-500/40'}`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">
            {m.name}
            {m.company && <span className="font-normal text-ink-500"> · {m.company}</span>}
            {!m.is_read && (
              <span className="ml-3 rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-white">New</span>
            )}
          </h2>
          <a
            href={`mailto:${m.email}`}
            className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline dark:text-brand-400"
          >
            <Mail className="size-4" />
            {m.email}
          </a>
        </div>
        <time className="text-xs text-ink-500">{formatDate(m.created_at)}</time>
      </header>

      {/* Rendered as plain text by React; whitespace preserved. */}
      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-700 dark:text-ink-300">
        {m.message}
      </p>

      <footer className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => setRead.mutate({ id: m.id, isRead: !m.is_read })}
          className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-60"
        >
          {setRead.isPending && <Loader2 className="size-4 animate-spin" />}
          Mark as {m.is_read ? 'unread' : 'read'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (window.confirm(`Delete the message from ${m.name}? This can’t be undone.`)) remove.mutate(m.id)
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      </footer>
    </article>
  )
}
