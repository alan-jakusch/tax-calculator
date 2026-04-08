import type { TaxBracketsResponse, TaxYear } from '../model/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const REQUEST_TIMEOUT_MS = 10_000

export class TaxApiError extends Error {
  status?: number
  code: 'config' | 'network' | 'timeout' | 'http' | 'unknown'
  retryable: boolean

  constructor(
    message: string,
    options: {
      status?: number
      code: 'config' | 'network' | 'timeout' | 'http' | 'unknown'
      retryable: boolean
    },
  ) {
    super(message)
    this.name = 'TaxApiError'
    this.status = options.status
    this.code = options.code
    this.retryable = options.retryable
  }
}

function getStatusMessage(status: number): string {
  if (status === 400) return 'Invalid tax year request.'
  if (status === 404) return 'Tax data not found for the selected year.'
  if (status >= 500) return 'Server error while loading tax data. Please try again.'
  return `Unexpected server response (${status}).`
}

export async function fetchTaxBrackets(taxYear: TaxYear): Promise<TaxBracketsResponse> {
  if (typeof API_BASE_URL !== 'string' || API_BASE_URL.trim() === '') {
    throw new TaxApiError('Missing VITE_API_BASE_URL. Set it in your environment file.', {
      code: 'config',
      retryable: false,
    })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE_URL}/tax-calculator/tax-year/${taxYear}`, {
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new TaxApiError(getStatusMessage(res.status), {
        status: res.status,
        code: 'http',
        retryable: res.status >= 500,
      })
    }

    const payload = (await res.json()) as unknown
    if (
      !payload ||
      typeof payload !== 'object' ||
      !('tax_brackets' in payload) ||
      !Array.isArray(payload.tax_brackets)
    ) {
      throw new TaxApiError('Invalid tax data format received from API.', {
        code: 'unknown',
        retryable: false,
      })
    }

    return payload as TaxBracketsResponse
  } catch (error) {
    if (error instanceof TaxApiError) throw error

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TaxApiError('Request timed out while loading tax data.', {
        code: 'timeout',
        retryable: true,
      })
    }

    if (error instanceof Error) {
      throw new TaxApiError('Network error while loading tax data. Check your connection.', {
        code: 'network',
        retryable: true,
      })
    }

    throw new TaxApiError('Unexpected error while loading tax data.', {
      code: 'unknown',
      retryable: false,
    })
  } finally {
    clearTimeout(timeout)
  }
}
