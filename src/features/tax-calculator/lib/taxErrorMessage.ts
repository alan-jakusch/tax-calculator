import type { TaxApiError } from '../api/tax.api'

export function getTaxErrorMessage(error?: TaxApiError): string {
  if (!error) return 'An unexpected error occurred.'

  if (error.code === 'config') {
    return 'API base URL is not configured. Set VITE_API_BASE_URL in your environment.'
  }

  if (error.code === 'invalid_payload') {
    return 'The tax service returned invalid data. Please contact support if this keeps happening.'
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
