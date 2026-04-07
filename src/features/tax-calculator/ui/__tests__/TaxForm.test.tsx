import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaxForm } from '../TaxForm'
import type { TaxFormValues } from '../../model/types'

describe('TaxForm', () => {
  it('renders income input and tax year select', () => {
    render(<TaxForm onSubmit={vi.fn()} isLoading={false} />)
    expect(screen.getByLabelText(/annual income/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tax year/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument()
  })

  it('shows validation error when income is negative on submit', async () => {
    render(<TaxForm onSubmit={vi.fn()} isLoading={false} />)
    await userEvent.type(screen.getByLabelText(/annual income/i), '-100')
    await userEvent.selectOptions(screen.getByLabelText(/tax year/i), '2022')
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }))
    await waitFor(() =>
      expect(screen.getByText(/non-negative/i)).toBeInTheDocument()
    )
  })

  it('shows validation error when no tax year is selected', async () => {
    render(<TaxForm onSubmit={vi.fn()} isLoading={false} />)
    await userEvent.type(screen.getByLabelText(/annual income/i), '50000')
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }))
    await waitFor(() =>
      expect(screen.getByText(/tax year/i)).toBeInTheDocument()
    )
  })

  it('calls onSubmit with correct values on valid submit', async () => {
    const onSubmit = vi.fn()
    render(<TaxForm onSubmit={onSubmit} isLoading={false} />)
    await userEvent.type(screen.getByLabelText(/annual income/i), '75000')
    await userEvent.selectOptions(screen.getByLabelText(/tax year/i), '2021')
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith<[TaxFormValues]>({
        income: 75000,
        taxYear: 2021,
      })
    )
  })

  it('disables submit button while isLoading is true', () => {
    render(<TaxForm onSubmit={vi.fn()} isLoading={true} />)
    expect(screen.getByRole('button', { name: /calculate/i })).toBeDisabled()
  })
})
