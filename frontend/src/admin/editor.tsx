/**
 * Holds the working copy of the site document while an admin edits it, and
 * implements Save draft / Publish / Discard against the server.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeleton'
import { ApiError } from '../lib/api-client'
import { siteApi, type AdminSite } from '../lib/site-api'
import { DEFAULT_CONTENT } from '../lib/site-defaults'
import { firstProblem } from '../lib/site-validate'
import type { SiteContent } from '../lib/site-types'
import { PagePathsContext } from './fields'

type Busy = 'save' | 'publish' | 'discard' | null

export type Editor = {
  content: SiteContent
  setContent: (update: (c: SiteContent) => SiteContent) => void
  dirty: boolean
  status: 'unsaved' | 'defaults' | 'draft' | 'published'
  busy: Busy
  /** Something in the draft the server would refuse (e.g. a bad page address). */
  problem: string | null
  error: string | null
  clearError: () => void
  save: () => Promise<boolean>
  publish: () => Promise<void>
  discard: () => Promise<void>
}

type Ctx = { editor: Editor | null; loadError: Error | null }
const EditorContext = createContext<Ctx>({ editor: null, loadError: null })

/** Only call below <EditorGate>, which guarantees the editor has loaded. */
export function useEditor(): Editor {
  const { editor } = useContext(EditorContext)
  if (!editor) throw new Error('useEditor used outside <EditorGate>')
  return editor
}

/** Shows a loading/error state until the draft has loaded, then renders the editor tabs. */
export function EditorGate({ children }: { children: ReactNode }) {
  const { editor, loadError } = useContext(EditorContext)
  if (loadError) return <ErrorState title="Couldn’t load the site editor" message={loadError.message} />
  if (!editor) return <Skeleton className="h-64 w-full" />
  return <PagePathsContext.Provider value={editor.content.pages.map((p) => p.path)}>{children}</PagePathsContext.Provider>
}

const ADMIN_SITE_KEY = ['admin', 'site'] as const

export function EditorProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ADMIN_SITE_KEY,
    queryFn: siteApi.admin.get,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const [working, setWorking] = useState<SiteContent | null>(null)
  const [baseline, setBaseline] = useState('')
  const [hasDraft, setHasDraft] = useState(false)
  const [hasUnpublished, setHasUnpublished] = useState(false)
  const [hasPublished, setHasPublished] = useState(false)
  const [busy, setBusy] = useState<Busy>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback((data: AdminSite) => {
    const initial = data.draft ?? data.published ?? DEFAULT_CONTENT
    setWorking(initial)
    setBaseline(JSON.stringify(initial))
    setHasDraft(data.draft !== null)
    setHasUnpublished(data.has_unpublished)
    setHasPublished(data.published !== null)
  }, [])

  useEffect(() => {
    if (query.data && working === null) load(query.data)
  }, [query.data, working, load])

  // Session expired while the editor was open: fall back to the login form.
  useEffect(() => {
    if (query.error instanceof ApiError && query.error.status === 401) qc.setQueryData(['admin', 'me'], null)
  }, [query.error, qc])

  const dirty = working !== null && JSON.stringify(working) !== baseline

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const setContent = useCallback((update: (c: SiteContent) => SiteContent) => {
    setWorking((c) => (c ? update(c) : c))
  }, [])

  const run = useCallback(async (kind: Exclude<Busy, null>, fn: () => Promise<void>): Promise<boolean> => {
    setBusy(kind)
    setError(null)
    try {
      await fn()
      return true
    } catch (e) {
      setError((e as Error).message)
      return false
    } finally {
      setBusy(null)
    }
  }, [])

  const save = useCallback(async () => {
    if (!working) return false
    return run('save', async () => {
      const res = await siteApi.admin.saveDraft(working)
      setBaseline(JSON.stringify(working))
      setHasDraft(true)
      setHasUnpublished(res.has_unpublished)
    })
  }, [working, run])

  const publish = useCallback(async () => {
    if (!working) return
    await run('publish', async () => {
      if (dirty || !hasDraft) await siteApi.admin.saveDraft(working)
      const res = await siteApi.admin.publish()
      setBaseline(JSON.stringify(working))
      setHasDraft(true)
      setHasUnpublished(res.has_unpublished)
      setHasPublished(true)
      // Update this browser's copy of the public site immediately.
      if (res.published) qc.setQueryData(['site'], res.published)
      qc.invalidateQueries({ queryKey: ['site'] })
    })
  }, [working, dirty, hasDraft, run, qc])

  const discard = useCallback(async () => {
    await run('discard', async () => {
      const res = await siteApi.admin.discard()
      load(res)
    })
  }, [run, load])

  const value = useMemo<Editor | null>(() => {
    if (!working) return null
    const status: Editor['status'] = dirty
      ? 'unsaved'
      : !hasDraft && !hasPublished
        ? 'defaults'
        : hasUnpublished
          ? 'draft'
          : 'published'
    return {
      content: working,
      setContent,
      dirty,
      status,
      busy,
      problem: firstProblem(working),
      error,
      clearError: () => setError(null),
      save,
      publish,
      discard,
    }
  }, [working, dirty, hasDraft, hasPublished, hasUnpublished, busy, error, setContent, save, publish, discard])

  return (
    <EditorContext.Provider value={{ editor: value, loadError: query.isError ? (query.error as Error) : null }}>
      {children}
    </EditorContext.Provider>
  )
}
