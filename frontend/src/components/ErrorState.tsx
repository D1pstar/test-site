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
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-950/40">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 text-red-600 dark:text-red-400" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">{title}</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
        </div>
      </div>
    </div>
  )
}