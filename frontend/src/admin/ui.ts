/** Shared class names for the admin UI. */
export const inputClass =
  'mt-1 block w-full rounded-xl border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition-all placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-white/15 dark:bg-white/5 dark:text-ink-100'
export const labelClass = 'block text-sm font-medium text-ink-800 dark:text-ink-200'
export const helpClass = 'mt-1 text-xs text-ink-500'
export const iconBtn =
  'inline-flex size-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors hover:bg-ink-900/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-ink-300 dark:hover:bg-white/10'
export const smallBtn =
  'inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-ink-200 dark:hover:bg-white/10'
export const dangerBtn =
  'inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/40'
export const panel = 'rounded-2xl border border-ink-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]'

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
