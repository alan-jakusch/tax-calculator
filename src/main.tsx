import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from '@/app'
import { TaxApiError } from '@/features'
import { logTaxRetry } from '@/shared/lib'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        if (!(error instanceof TaxApiError)) return failureCount < 2
        if (!error.retryable) return false

        const shouldRetry =
          (error.code === 'timeout' && failureCount < 3) ||
          (error.code === 'network' && failureCount < 2) ||
          (error.code === 'http' && Boolean(error.status && error.status >= 500) && failureCount < 3)

        if (shouldRetry) {
          logTaxRetry({
            failureCount,
            nextAttempt: failureCount + 1,
            code: error.code,
            status: error.status,
          })
        }

        return shouldRetry
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
