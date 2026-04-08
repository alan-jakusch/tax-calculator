import { describe, expect, it } from 'vitest'
import { TaxApiError } from '../../api'
import { getTaxErrorMessage } from '../taxErrorMessage'

describe('getTaxErrorMessage', () => {
  it('returns default message when error is undefined', () => {
    expect(getTaxErrorMessage()).toBe('An unexpected error occurred.')
  })

  it('maps config errors', () => {
    const error = new TaxApiError('Tax service is not configured.', {
      code: 'config',
      retryable: false,
    })

    expect(getTaxErrorMessage(error)).toBe('The tax service is unavailable right now. Please try again later.')
  })

  it('maps invalid payload errors', () => {
    const error = new TaxApiError('Invalid tax data format received from API.', {
      code: 'invalid_payload',
      retryable: false,
    })

    expect(getTaxErrorMessage(error)).toBe('The tax service returned an unexpected response. Please try again later.')
  })

  it('maps timeout errors', () => {
    const error = new TaxApiError('Request timed out while loading tax data.', {
      code: 'timeout',
      retryable: true,
    })

    expect(getTaxErrorMessage(error)).toBe('The request took too long. Please try again.')
  })

  it('maps network errors', () => {
    const error = new TaxApiError('Network error while loading tax data. Check your connection.', {
      code: 'network',
      retryable: true,
    })

    expect(getTaxErrorMessage(error)).toBe(
      'Could not reach the tax service. Check your connection and try again.',
    )
  })

  it('maps 5xx http errors', () => {
    const error = new TaxApiError('Server error while loading tax data. Please try again.', {
      code: 'http',
      status: 500,
      retryable: true,
    })

    expect(getTaxErrorMessage(error)).toBe(
      'The tax service is temporarily unavailable. Please try again.',
    )
  })

  it('maps 4xx http errors for unavailable tax year', () => {
    const error = new TaxApiError('Tax data not found for the selected year.', {
      code: 'http',
      status: 404,
      retryable: false,
    })

    expect(getTaxErrorMessage(error)).toBe('Tax data is unavailable for the selected year.')
  })

  it('falls back to error message when no special mapping applies', () => {
    const error = new TaxApiError('Unexpected server response (418).', {
      code: 'http',
      status: 418,
      retryable: false,
    })

    expect(getTaxErrorMessage(error)).toBe('Unexpected server response (418).')
  })
})
