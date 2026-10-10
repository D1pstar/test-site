import { useEffect } from 'react'
import { useOptionalSiteContent } from './useSite'

/** Sets the browser tab title: "Title · Site name". Works with or without site content. */
export function usePageTitle(title?: string) {
  const siteName = useOptionalSiteContent()?.theme.siteName ?? 'test-site'
  useEffect(() => {
    document.title = title ? `${title} · ${siteName}` : siteName
  }, [title, siteName])
}
