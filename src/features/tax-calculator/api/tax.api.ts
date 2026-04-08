import type { TaxBracketsResponse, TaxYear } from '../model'
import { logTaxApiFailure } from '@/shared/lib'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const REQUEST_TIMEOUT_MS = 10_000

type TaxApiErrorCode = 'config' | 'network' | 'timeout' | 'http' | 'invalid_payload' | 'unknown'

export class TaxApiError extends Error {
  status?: number
  code: TaxApiErrorCode
  retryable: boolean

  constructor(
    message: string,
    options: {
      status?: number
      code: TaxApiErrorCode
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

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isValidTaxPayload(payload: unknown): payload is TaxBracketsResponse {
  if (!payload || typeof payload !== 'object' || !('tax_brackets' in payload)) {
    return false
  }

  const brackets = payload.tax_brackets
  if (!Array.isArray(brackets) || brackets.length === 0) return false

  let previousMax: number | null = null

  for (const bracket of brackets) {
    if (!bracket || typeof bracket !== 'object') return false
    if (!('min' in bracket) || !('rate' in bracket)) return false

    const min = bracket.min
    const rate = bracket.rate
    const max = 'max' in bracket ? bracket.max : undefined

    if (!isValidNumber(min) || min < 0) return false
    if (!isValidNumber(rate) || rate <= 0 || rate > 1) return false

    if (max !== undefined) {
      if (!isValidNumber(max) || max <= min) return false
    }

    if (previousMax !== null && min !== previousMax) return false
    previousMax = max ?? null
  }

  return true
}

function resolveApiBaseUrl() {
  if (typeof API_BASE_URL !== 'string' || API_BASE_URL.trim() === '') {
    throw new TaxApiError('Tax service is not configured.', {
      code: 'config',
      retryable: false,
    })
  }

  try {
    const parsed = new URL(API_BASE_URL)
    const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    if (import.meta.env.PROD && parsed.protocol !== 'https:' && !isLocalhost) {
      throw new TaxApiError('Tax service configuration is invalid.', {
        code: 'config',
        retryable: false,
      })
    }

    return parsed.toString().replace(/\/$/, '')
  } catch (error) {
    if (error instanceof TaxApiError) throw error
    throw new TaxApiError('Tax service configuration is invalid.', {
      code: 'config',
      retryable: false,
    })
  }
}

export async function fetchTaxBrackets(
  taxYear: TaxYear,
  externalSignal?: AbortSignal,
): Promise<TaxBracketsResponse> {
  const baseUrl = resolveApiBaseUrl()

  const controller = new AbortController()
  let didTimeout = false
  let wasExternallyAborted = false
  const timeout = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)
  const handleExternalAbort = () => {
    wasExternallyAborted = true
    controller.abort()
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      wasExternallyAborted = true
      controller.abort()
    }
    else externalSignal.addEventListener('abort', handleExternalAbort, { once: true })
  }

  try {
    const res = await fetch(`${baseUrl}/tax-calculator/tax-year/${taxYear}`, {
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
    if (!isValidTaxPayload(payload)) {
      throw new TaxApiError('Invalid tax data format received from API.', {
        code: 'invalid_payload',
        retryable: false,
      })
    }

    return payload
  } catch (error) {
    if (error instanceof TaxApiError) {
      logTaxApiFailure({ code: error.code, status: error.status, retryable: error.retryable, taxYear })
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      if (!didTimeout && wasExternallyAborted) {
        throw error
      }

      const apiError = new TaxApiError('Request timed out while loading tax data.', {
        code: 'timeout',
        retryable: true,
      })
      logTaxApiFailure({ code: apiError.code, retryable: apiError.retryable, taxYear })
      throw apiError
    }

    if (error instanceof SyntaxError) {
      const apiError = new TaxApiError('Invalid tax data format received from API.', {
        code: 'invalid_payload',
        retryable: false,
      })
      logTaxApiFailure({ code: apiError.code, retryable: apiError.retryable, taxYear })
      throw apiError
    }

    if (error instanceof Error) {
      const apiError = new TaxApiError('Network error while loading tax data. Check your connection.', {
        code: 'network',
        retryable: true,
      })
      logTaxApiFailure({ code: apiError.code, retryable: apiError.retryable, taxYear })
      throw apiError
    }

    const apiError = new TaxApiError('Unexpected error while loading tax data.', {
      code: 'unknown',
      retryable: false,
    })
    logTaxApiFailure({ code: apiError.code, retryable: apiError.retryable, taxYear })
    throw apiError
  } finally {
    if (externalSignal) {
      externalSignal.removeEventListener('abort', handleExternalAbort)
    }
    clearTimeout(timeout)
  }
}
