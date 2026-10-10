import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

type Props = {
  className?: string
}

export default function ThemeToggle({ className = '' }: Props) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex size-10 items-center justify-center rounded-full text-ink-700 transition-all hover:bg-ink-900/5 active:scale-95 dark:text-ink-200 dark:hover:bg-white/10 ${className}`}
    >
      {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  )
}
