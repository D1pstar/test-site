import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-full flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-ink-600">
        The page you're looking for doesn't exist (yet).
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        Back home
      </Link>
    </main>
  )
}