import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

// ============================================================
// Query Client with Persisted Cache (24h)
// ============================================================

const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 // 24 hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // gcTime must be >= the persister's maxAge, or restored data gets garbage collected
      gcTime: CACHE_MAX_AGE,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// persistQueryClient restores the cache from localStorage and then
// subscribes to the cache to save changes (browser only).
if (typeof window !== 'undefined') {
  const persister = createSyncStoragePersister({ storage: window.localStorage })

  persistQueryClient({
    queryClient,
    persister,
    maxAge: CACHE_MAX_AGE,
    dehydrateOptions: {
      // Never write admin data (contact messages, who is signed in) to localStorage.
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) && query.queryKey[0] !== 'admin',
    },
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="ambient-bg" aria-hidden="true" />
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
)
