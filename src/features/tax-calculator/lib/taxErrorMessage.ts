import type { TaxApiError } from '../api'

export function getTaxErrorMessage(error?: TaxApiError): string {
  if (!error) return 'An unexpected error occurred.'

  if (error.code === 'config') {
    return 'The tax service is unavailable right now. Please try again later.'
  }

  if (error.code === 'invalid_payload') {
    return 'The tax service returned an unexpected response. Please try again later.'
  }

  if (error.code === 'timeout') {
    return 'The request took too long. Please try again.'
  }

  if (error.code === 'network') {
    return 'Could not reach the tax service. Check your connection and try again.'
  }

  if (error.code === 'http') {
    if (error.status && error.status >= 500) {
      return 'The tax service is temporarily unavailable. Please try again.'
    }

    if (error.status === 400 || error.status === 404) {
      return 'Tax data is unavailable for the selected year.'
    }
  }

  return error.message
}
