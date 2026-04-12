const HEALTHCHECK_URL = 'http://localhost:5001/tax-calculator/tax-year/2019'
const SETUP_ATTEMPTS = 5
const SETUP_RETRY_MS = 1000

export default async function globalSetup() {
  let lastStatus = 0
  for (let attempt = 1; attempt <= SETUP_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(HEALTHCHECK_URL, { signal: AbortSignal.timeout(10_000) })
      if (res.ok) return
      lastStatus = res.status
    } catch {
      lastStatus = 0
    }
    if (attempt < SETUP_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, SETUP_RETRY_MS))
    }
  }

  if (lastStatus === 0) {
    throw new Error(
      `Tax API is not reachable at ${HEALTHCHECK_URL}. Start the backend first, for example:\n` +
        'docker run --init -p 5001:5001 ptsdocker16/interview-test-server',
    )
  }

  throw new Error(
    `Tax API health check failed after ${SETUP_ATTEMPTS} attempts (last HTTP ${lastStatus}). Expected 200 from ${HEALTHCHECK_URL}.`,
  )
}
