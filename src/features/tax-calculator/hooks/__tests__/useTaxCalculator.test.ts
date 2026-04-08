import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { createElement, type ReactNode } from 'react'
import { server } from '@/test/server'
import { useTaxCalculator } from '../useTaxCalculator'
import { mockBrackets } from '@/test/handlers'
import { TaxApiError } from '../../api'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useTaxCalculator', () => {
  it('does not fetch until enabled is true', async () => {
    let callCount = 0
    server.use(
      http.get('http://localhost:5001/tax-calculator/tax-year/:year', () => {
        callCount++
        return HttpResponse.json(mockBrackets)
      }),
    )

    const { result } = renderHook(() => useTaxCalculator(50000, 2022, false), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(result.current.isLoading).toBe(false)
    expect(callCount).toBe(0)
  })

  it('returns isLoading true while fetching', () => {
    const { result } = renderHook(() => useTaxCalculator(50000, 2022, true), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns TaxResult on successful fetch', async () => {
    const { result } = renderHook(() => useTaxCalculator(60000, 2022, true), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBeDefined()
    expect(result.current.data?.totalTax).toBeGreaterThan(0)
    expect(result.current.data?.bracketResults).toHaveLength(
      mockBrackets.tax_brackets.length
    )
  })

  it('returns isError true on API failure', async () => {
    server.use(
      http.get('http://localhost:5001/tax-calculator/tax-year/:year', () =>
        HttpResponse.error()
      )
    )
    const { result } = renderHook(() => useTaxCalculator(50000, 2022, true), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(TaxApiError)
    expect(result.current.error?.code).toBe('network')
  })

  it('returns valid TaxResult with totalTax 0 when income is 0', async () => {
    const { result } = renderHook(() => useTaxCalculator(0, 2021, true), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data?.totalTax).toBe(0)
    expect(result.current.data?.effectiveRate).toBe(0)
  })

  it('retries on failure for year 2022 (retry: 3)', async () => {
    let callCount = 0
    server.use(
      http.get('http://localhost:5001/tax-calculator/tax-year/2022', () => {
        callCount++
        if (callCount < 3) return HttpResponse.json({ error: 'random error' }, { status: 500 })
        return HttpResponse.json(mockBrackets)
      })
    )

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 3, retryDelay: 0 } },
    })
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const { result } = renderHook(() => useTaxCalculator(50000, 2022, true), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 5000 })
    expect(result.current.data).toBeDefined()
    expect(callCount).toBeGreaterThanOrEqual(3)
  })
})
