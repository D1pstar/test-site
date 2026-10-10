import { useSearchParams } from 'react-router-dom'
import NavFooterTab from './NavFooterTab'
import ThemeTab from './ThemeTab'

const SUBS = [
  { id: 'theme', label: 'Colours & fonts' },
  { id: 'nav', label: 'Menu & footer' },
] as const

/** Theme and navigation/footer, grouped so the top bar stays short. */
export default function DesignTab() {
  const [params, setParams] = useSearchParams()
  const sub = params.get('sub') === 'nav' ? 'nav' : 'theme'
  return (
    <div>
      <div role="tablist" aria-label="Design sections" className="mx-auto mb-6 flex w-fit gap-1 rounded-full bg-ink-100 p-1 dark:bg-white/10">
        {SUBS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={sub === s.id}
            onClick={() => setParams({ tab: 'design', sub: s.id })}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              sub === s.id ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-white' : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {sub === 'theme' ? <ThemeTab /> : <NavFooterTab />}
    </div>
  )
}
