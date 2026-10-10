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
      className="flex items-start gap-3 rounded-2xl border p-5"
      style={{
        borderColor: 'color-mix(in srgb, #ef4444 35%, transparent)',
        background: 'color-mix(in srgb, #ef4444 8%, transparent)',
      }}
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'color-mix(in srgb, #ef4444 18%, transparent)', color: '#ef4444' }}
      >
        <AlertTriangle className="size-4" />
      </span>
      <div>
        <h3 className="text-sm font-semibold" style={{ color: '#b91c1c' }}>{title}</h3>
        <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>{message}</p>
      </div>
    </div>
  )
}