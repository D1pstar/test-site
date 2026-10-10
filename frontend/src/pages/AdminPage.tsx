import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Skeleton } from '../components/Skeleton'
import AdminShell from '../admin/AdminShell'
import { inputClass } from '../admin/ui'
import { useAdminLogin, useAdminMe } from '../hooks/useAdmin'
import { usePageTitle } from '../hooks/usePageTitle'

/** Keep the admin area out of search results. */
function useNoIndex() {
  useEffect(() => {
    const el = document.createElement('meta')
    el.name = 'robots'
    el.content = 'noindex, nofollow'
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
}

export default function AdminPage() {
  usePageTitle('Admin')
  useNoIndex()
  const me = useAdminMe(true)

  if (me.isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (me.data) return <AdminShell username={me.data.username} />
  return <LoginForm />
}

function LoginForm() {
  const login = useAdminLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login.mutate({ username: username.trim(), password })
  }

  return (
    <div className="px-4 py-16 sm:py-24">
      <form onSubmit={onSubmit} className="card mx-auto max-w-md p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-500">Authorized users only.</p>

        {login.isError && (
          <p role="alert" className="mt-5 text-sm text-red-600 dark:text-red-400">
            {(login.error as { status?: number }).status === 429
              ? 'Too many attempts. Wait a minute and try again.'
              : (login.error as Error).message}
          </p>
        )}

        <label htmlFor="username" className="mt-6 block text-sm font-medium">
          Username
          <input
            id="username"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </label>
        <label htmlFor="password" className="mt-4 block text-sm font-medium">
          Password
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>

        <button type="submit" disabled={login.isPending} className="btn-primary mt-7 w-full !py-3.5 disabled:opacity-60">
          {login.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
