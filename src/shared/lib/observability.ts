type TaxApiFailurePayload = {
  code: string
  status?: number
  retryable: boolean
  taxYear: number
}

type TaxRetryPayload = {
  failureCount: number
  nextAttempt: number
  code?: string
  status?: number
}

function logEvent(event: string, payload: Record<string, unknown>) {
  if (import.meta.env.PROD) {
    console.warn(`[telemetry] ${event}`, payload)
    return
  }

  console.info(`[telemetry] ${event}`, payload)
}

export function logTaxApiFailure(payload: TaxApiFailurePayload) {
  logEvent('tax_api_failure', payload)
}

export function logTaxRetry(payload: TaxRetryPayload) {
  logEvent('tax_query_retry', payload)
}
