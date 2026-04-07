import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BracketTable } from '../BracketTable'
import type { BracketResult } from '../../model/types'

const bracketResults: BracketResult[] = [
  { min: 0, max: 50197, rate: 0.15, taxable: 50197, tax: 7529.55 },
  { min: 50197, max: 100392, rate: 0.205, taxable: 9803, tax: 2009.615 },
  { min: 100392, max: 155625, rate: 0.26, taxable: 0, tax: 0 },
  { min: 155625, max: 221708, rate: 0.29, taxable: 0, tax: 0 },
  { min: 221708, max: null, rate: 0.33, taxable: 0, tax: 0 },
]

describe('BracketTable', () => {
  it('renders a row per bracket result', () => {
    render(<BracketTable bracketResults={bracketResults} />)
    const rows = screen.getAllByRole('row')
    // header + 5 data rows
    expect(rows).toHaveLength(6)
  })

  it('each row shows rate, taxable income, and tax amount', () => {
    render(<BracketTable bracketResults={bracketResults} />)
    const rows = screen.getAllByRole('row')
    const firstDataRow = rows[1]
    expect(within(firstDataRow).getByText(/15%/)).toBeInTheDocument()
    expect(within(firstDataRow).getByText(/50,197/)).toBeInTheDocument()
    expect(within(firstDataRow).getByText(/7,529/)).toBeInTheDocument()
  })

  it('highlights the highest bracket with taxable amount > 0', () => {
    render(<BracketTable bracketResults={bracketResults} />)
    const rows = screen.getAllByRole('row')
    // second bracket (index 1 in bracketResults, row index 2) is the active one
    expect(rows[2]).toHaveAttribute('data-active', 'true')
    expect(rows[1]).not.toHaveAttribute('data-active', 'true')
  })

  it('renders correctly with a single bracket', () => {
    const single: BracketResult[] = [
      { min: 0, max: null, rate: 0.15, taxable: 30000, tax: 4500 },
    ]
    render(<BracketTable bracketResults={single} />)
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getByText(/15%/)).toBeInTheDocument()
  })

  it('renders zero-taxable brackets without highlighting', () => {
    render(<BracketTable bracketResults={bracketResults} />)
    const rows = screen.getAllByRole('row')
    // brackets at index 2, 3, 4 have taxable = 0 → not active
    expect(rows[3]).not.toHaveAttribute('data-active', 'true')
    expect(rows[4]).not.toHaveAttribute('data-active', 'true')
    expect(rows[5]).not.toHaveAttribute('data-active', 'true')
  })
})
