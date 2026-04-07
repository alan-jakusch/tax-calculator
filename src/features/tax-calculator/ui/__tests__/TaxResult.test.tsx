import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaxResult } from '../TaxResult'
import type { TaxResult as TaxResultType } from '../../model/types'

const mockResult: TaxResultType = {
  totalTax: 15000,
  effectiveRate: 0.2,
  bracketResults: [
    { min: 0, max: 50197, rate: 0.15, taxable: 50197, tax: 7529.55 },
    { min: 50197, max: 100392, rate: 0.205, taxable: 24803, tax: 5084.615 },
    { min: 100392, max: 155625, rate: 0.26, taxable: 0, tax: 0 },
    { min: 155625, max: 221708, rate: 0.29, taxable: 0, tax: 0 },
    { min: 221708, max: null, rate: 0.33, taxable: 0, tax: 0 },
  ],
}

describe('TaxResult', () => {
  it('shows loading skeleton when isLoading is true', () => {
    const { container } = render(
      <TaxResult isLoading={true} isError={false} data={undefined} />
    )
    expect(container.querySelector('[data-testid="tax-result-skeleton"]')).toBeInTheDocument()
  })

  it('shows error alert when isError is true', () => {
    render(
      <TaxResult
        isLoading={false}
        isError={true}
        error={new Error('API error')}
        data={undefined}
      />
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/API error/i)).toBeInTheDocument()
  })

  it('renders totalTax formatted as currency', () => {
    render(<TaxResult isLoading={false} isError={false} data={mockResult} />)
    expect(screen.getByText(/\$15,000/)).toBeInTheDocument()
  })

  it('renders effectiveRate as a percentage', () => {
    render(<TaxResult isLoading={false} isError={false} data={mockResult} />)
    expect(screen.getByText(/20(\.00)?%/)).toBeInTheDocument()
  })

  it('renders nothing when data is undefined and no loading/error', () => {
    const { container } = render(
      <TaxResult isLoading={false} isError={false} data={undefined} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows retry message for 2022 year errors', () => {
    render(
      <TaxResult
        isLoading={false}
        isError={true}
        error={new Error('Server error')}
        data={undefined}
        taxYear={2022}
      />
    )
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
  })
})
