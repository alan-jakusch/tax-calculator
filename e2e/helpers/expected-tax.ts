import { calculateTax } from '../../src/features/tax-calculator/model/calculateTax'
import { currencyCompact, percentDetailed } from '../../src/features/tax-calculator/lib/formatters'
import type { TaxBracketsResponse, TaxYear } from '../../src/features/tax-calculator/model/types'

const API_BASE = 'http://localhost:5001'

type FetchOptions = {
  /** Extra GET retries when the API returns non-OK (e.g. 2022 random errors). */
  maxAttempts?: number
  retryMs?: number
}

export async function fetchExpectedTaxDisplay(
  income: number,
  taxYear: TaxYear,
  options?: FetchOptions,
) {
  const maxAttempts = options?.maxAttempts ?? 8
  const retryMs = options?.retryMs ?? 500
  let lastStatus = 0

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(`${API_BASE}/tax-calculator/tax-year/${taxYear}`)
    if (res.ok) {
      const data = (await res.json()) as TaxBracketsResponse
      const result = calculateTax(income, data.tax_brackets)
      return {
        totalTaxLabel: currencyCompact.format(result.totalTax),
        effectiveRateLabel: percentDetailed.format(result.effectiveRate),
      }
    }
    lastStatus = res.status
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, retryMs))
    }
  }

  throw new Error(`Failed to fetch tax brackets for ${taxYear}: ${lastStatus}`)
}
