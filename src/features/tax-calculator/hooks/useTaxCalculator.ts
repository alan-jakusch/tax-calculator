import { useQuery } from '@tanstack/react-query'
import { fetchTaxBrackets, TaxApiError } from '../api/tax.api'
import { calculateTax } from '../model/calculateTax'
import type { TaxBracketsResponse, TaxResult, TaxYear } from '../model/types'

export function useTaxCalculator(income: number, taxYear: TaxYear, enabled: boolean) {
  return useQuery<TaxBracketsResponse, TaxApiError, TaxResult>({
    queryKey: ['tax-brackets', taxYear],
    queryFn: () => fetchTaxBrackets(taxYear),
    select: (data) => calculateTax(income, data.tax_brackets),
    enabled,
  })
}
