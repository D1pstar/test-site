import { AlertTriangle } from 'lucide-react'

type Props = {
  title?: string
  message?: string
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this content. Please try again.',
}: Props) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/30"
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
        <AlertTriangle className="size-4" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">{title}</h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
      </div>
    </div>
  )
}
