import { useQuery } from '@tanstack/react-query'
import { fetchTaxBrackets, TaxApiError } from '../api'
import { calculateTax } from '../model'
import type { TaxBracketsResponse, TaxResult, TaxYear } from '../model'

export function useTaxCalculator(income: number, taxYear: TaxYear, enabled: boolean) {
  return useQuery<TaxBracketsResponse, TaxApiError, TaxResult>({
    queryKey: ['tax-brackets', taxYear],
    queryFn: ({ signal }) => fetchTaxBrackets(taxYear, signal),
    select: (data) => calculateTax(income, data.tax_brackets),
    enabled,
  })
}
