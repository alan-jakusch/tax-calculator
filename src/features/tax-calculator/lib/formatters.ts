export const currencyCompact = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

export const currencyDetailed = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const percentDetailed = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatRatePercent(rate: number) {
  return `${(rate * 100).toFixed(0)}%`
}

export function parseEnglishNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return Number.NaN

  const normalized = value.trim()
  if (normalized === '') return Number.NaN

  const englishNumberPattern = /^-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/
  if (!englishNumberPattern.test(normalized)) return Number.NaN

  return Number(normalized.replaceAll(',', ''))
}
