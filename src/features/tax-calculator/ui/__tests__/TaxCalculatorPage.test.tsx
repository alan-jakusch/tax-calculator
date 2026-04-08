import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { http, HttpResponse } from 'msw'
import { TaxCalculatorPage } from '../TaxCalculatorPage'
import { server } from '@/test/server'
import { mockBrackets } from '@/test/handlers'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: 0,
      },
    },
  })

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('TaxCalculatorPage', () => {
  it('recovers from intermittent 2022 API failures and renders result', async () => {
    let callCount = 0
    server.use(
      http.get('http://localhost:5001/tax-calculator/tax-year/2022', () => {
        callCount++
        if (callCount < 3) {
          return HttpResponse.json({ error: 'random error' }, { status: 500 })
        }
        return HttpResponse.json(mockBrackets)
      }),
    )

    const user = userEvent.setup()
    render(<TaxCalculatorPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText(/annual income/i), '60000')
    await user.selectOptions(screen.getByLabelText(/tax year/i), '2022')
    await user.click(screen.getByRole('button', { name: /calculate tax/i }))

    await waitFor(() => {
      expect(screen.getByText(/total tax/i)).toBeInTheDocument()
    })
    expect(callCount).toBeGreaterThanOrEqual(3)
  })
})
