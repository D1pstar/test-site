import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets window scroll to the top whenever the route path changes.
 * Without this, navigating from a long page leaves you mid-page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}