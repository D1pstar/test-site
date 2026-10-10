import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them, and displays a friendly fallback UI.
 *
 * In production, replace console.error with your error reporting service (Sentry, LogRocket, etc.)
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('💥 Uncaught error:', error, info.componentStack)
    // TODO: Send to error tracking service in production
    // Example: Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="mx-auto size-12 text-ink-300 dark:text-ink-600" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-ink-900 dark:text-ink-100">
              Something went wrong
            </h2>
            <p className="mt-2 text-ink-500 dark:text-ink-400">
              We&apos;ve been notified. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 btn-primary"
              type="button"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Refresh page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}