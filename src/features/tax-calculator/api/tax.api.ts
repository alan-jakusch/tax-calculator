import type { TaxBracketsResponse, TaxYear } from '../model/types'

export async function fetchTaxBrackets(taxYear: TaxYear): Promise<TaxBracketsResponse> {
  const res = await fetch(`http://localhost:5001/tax-calculator/tax-year/${taxYear}`)
  if (!res.ok) throw new Error(`Failed to fetch tax brackets (${res.status})`)
  return res.json() as Promise<TaxBracketsResponse>
}
