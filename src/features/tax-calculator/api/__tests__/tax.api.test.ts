import { beforeEach, describe, expect, it, vi } from 'vitest'

async function loadApi() {
  return import('../tax.api')
}

describe('tax.api', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('throws config error when VITE_API_BASE_URL is missing', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const { fetchTaxBrackets, TaxApiError } = await loadApi()

    await expect(fetchTaxBrackets(2022)).rejects.toBeInstanceOf(TaxApiError)
    await expect(fetchTaxBrackets(2022)).rejects.toMatchObject({
      code: 'config',
      retryable: false,
    })
  })

  it('maps 500 responses to retryable http errors', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5001')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const { fetchTaxBrackets, TaxApiError } = await loadApi()

    await expect(fetchTaxBrackets(2022)).rejects.toBeInstanceOf(TaxApiError)
    await expect(fetchTaxBrackets(2022)).rejects.toMatchObject({
      code: 'http',
      status: 500,
      retryable: true,
    })
  })

  it('maps timeout abort errors correctly', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5001')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    const { fetchTaxBrackets } = await loadApi()

    await expect(fetchTaxBrackets(2022)).rejects.toMatchObject({
      code: 'timeout',
      retryable: true,
    })
  })

  it('rethrows external aborts without mapping to timeout', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5001')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    const { fetchTaxBrackets } = await loadApi()
    const controller = new AbortController()
    controller.abort()

    await expect(fetchTaxBrackets(2022, controller.signal)).rejects.toBeInstanceOf(DOMException)
  })

  it('maps malformed payloads to invalid_payload errors', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5001')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        tax_brackets: [{ min: 0, max: 50000, rate: 0.15 }, { min: 60000, rate: 0.2 }],
      }),
    )
    const { fetchTaxBrackets } = await loadApi()

    await expect(fetchTaxBrackets(2022)).rejects.toMatchObject({
      code: 'invalid_payload',
      retryable: false,
    })
  })

  it('returns brackets when payload is valid', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5001')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        tax_brackets: [
          { min: 0, max: 50197, rate: 0.15 },
          { min: 50197, max: 100392, rate: 0.205 },
          { min: 100392, rate: 0.26 },
        ],
      }),
    )
    const { fetchTaxBrackets } = await loadApi()

    await expect(fetchTaxBrackets(2022)).resolves.toEqual({
      tax_brackets: [
        { min: 0, max: 50197, rate: 0.15 },
        { min: 50197, max: 100392, rate: 0.205 },
        { min: 100392, rate: 0.26 },
      ],
    })
  })
})
