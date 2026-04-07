import { describe, it, expect } from 'vitest'
import { calculateTax } from '../calculateTax'
import type { TaxBracket } from '../types'

const brackets: TaxBracket[] = [
  { min: 0, max: 50197, rate: 0.15 },
  { min: 50197, max: 100392, rate: 0.205 },
  { min: 100392, max: 155625, rate: 0.26 },
  { min: 155625, max: 221708, rate: 0.29 },
  { min: 221708, rate: 0.33 },
]

describe('calculateTax', () => {
  it('returns zero tax for income of 0', () => {
    const result = calculateTax(0, brackets)
    expect(result.totalTax).toBe(0)
    expect(result.effectiveRate).toBe(0)
    result.bracketResults.forEach((b) => expect(b.tax).toBe(0))
  })

  it('correctly taxes income within the first bracket only', () => {
    const income = 30000
    const result = calculateTax(income, brackets)
    expect(result.bracketResults[0].taxable).toBe(30000)
    expect(result.bracketResults[0].tax).toBeCloseTo(30000 * 0.15)
    expect(result.bracketResults[1].taxable).toBe(0)
    expect(result.totalTax).toBeCloseTo(30000 * 0.15)
  })

  it('correctly taxes income spanning multiple brackets', () => {
    const income = 60000
    const result = calculateTax(income, brackets)
    // first bracket: 0 - 50197
    expect(result.bracketResults[0].taxable).toBeCloseTo(50197)
    expect(result.bracketResults[0].tax).toBeCloseTo(50197 * 0.15)
    // second bracket: 50197 - 60000
    expect(result.bracketResults[1].taxable).toBeCloseTo(60000 - 50197)
    expect(result.bracketResults[1].tax).toBeCloseTo((60000 - 50197) * 0.205)
    // higher brackets: no taxable amount
    expect(result.bracketResults[2].taxable).toBe(0)
  })

  it('correctly taxes income in the last bracket (no max)', () => {
    const income = 300000
    const result = calculateTax(income, brackets)
    const lastBracket = result.bracketResults[4]
    expect(lastBracket.taxable).toBeCloseTo(income - 221708)
    expect(lastBracket.tax).toBeCloseTo((income - 221708) * 0.33)
    expect(lastBracket.max).toBeNull()
  })

  it('correctly taxes very high income', () => {
    const income = 1_000_000
    const result = calculateTax(income, brackets)
    const expectedTax =
      50197 * 0.15 +
      (100392 - 50197) * 0.205 +
      (155625 - 100392) * 0.26 +
      (221708 - 155625) * 0.29 +
      (1_000_000 - 221708) * 0.33
    expect(result.totalTax).toBeCloseTo(expectedTax, 2)
  })

  it('computes effectiveRate as totalTax / income', () => {
    const income = 100000
    const result = calculateTax(income, brackets)
    expect(result.effectiveRate).toBeCloseTo(result.totalTax / income, 5)
  })

  it('clamps bracket taxable to 0 when income is below bracket min', () => {
    const income = 10000
    const result = calculateTax(income, brackets)
    result.bracketResults.slice(1).forEach((b) => {
      expect(b.taxable).toBe(0)
      expect(b.tax).toBe(0)
    })
  })

  it('returns bracketResults with correct max (null for last bracket)', () => {
    const result = calculateTax(50000, brackets)
    expect(result.bracketResults[0].max).toBe(50197)
    expect(result.bracketResults[4].max).toBeNull()
  })
})
