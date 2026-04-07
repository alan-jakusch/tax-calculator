import type { TaxBracket, TaxResult } from './types'

export function calculateTax(income: number, brackets: TaxBracket[]): TaxResult {
  const bracketResults = brackets.map((b) => {
    const max = b.max ?? null
    const taxable = Math.max(0, Math.min(income, max ?? Infinity) - b.min)
    return { min: b.min, max, rate: b.rate, taxable, tax: taxable * b.rate }
  })

  const totalTax = bracketResults.reduce((sum, b) => sum + b.tax, 0)
  const effectiveRate = income === 0 ? 0 : totalTax / income

  return { bracketResults, totalTax, effectiveRate }
}
