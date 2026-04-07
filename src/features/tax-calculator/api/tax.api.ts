import type { TaxBracketsResponse, TaxYear } from '../model/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchTaxBrackets(taxYear: TaxYear): Promise<TaxBracketsResponse> {
  const res = await fetch(`${API_BASE_URL}/tax-calculator/tax-year/${taxYear}`)
  if (!res.ok) throw new Error(`Failed to fetch tax brackets (${res.status})`)
  return res.json() as Promise<TaxBracketsResponse>
}
