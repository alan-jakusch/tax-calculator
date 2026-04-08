import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from '@/app'
import { TaxApiError } from '@/features'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!(error instanceof TaxApiError)) return failureCount < 2
        if (!error.retryable) return false
        if (error.code === 'timeout') return failureCount < 3
        if (error.code === 'network') return failureCount < 2
        if (error.code === 'http' && error.status && error.status >= 500) return failureCount < 3
        return false
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
