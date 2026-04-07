import { BracketTable } from './BracketTable'
import type { TaxResult as TaxResultType, TaxYear } from '../model/types'
import { Alert, Skeleton, Separator } from '@/shared/ui'

interface TaxResultProps {
  isLoading: boolean
  isError: boolean
  error?: Error
  data?: TaxResultType
  taxYear?: TaxYear
}

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const percentFmt = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function TaxResult({ isLoading, isError, error, data, taxYear }: TaxResultProps) {
  if (isLoading) {
    return (
      <div data-testid="tax-result-skeleton" className="flex flex-col gap-4 animate-pulse">
        <div className="flex gap-4">
          <Skeleton className="h-20 flex-1 rounded-xl" />
          <Skeleton className="h-20 flex-1 rounded-xl" />
        </div>
        <Skeleton className="h-6 w-1/3 rounded" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="error" title="Unable to load tax data">
        <p>{error?.message ?? 'An unexpected error occurred.'}</p>
        {taxYear === 2022 && (
          <p className="mt-1 font-medium">
            The 2022 endpoint is unstable. Please try again.
          </p>
        )}
      </Alert>
    )
  }

  if (!data) return null

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 p-5 rounded-xl bg-accent/5 border border-accent/20">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Total Tax
          </span>
          <span className="text-2xl font-bold text-accent">
            {currencyFmt.format(data.totalTax)}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-5 rounded-xl bg-secondary/5 border border-secondary/20">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Effective Rate
          </span>
          <span className="text-2xl font-bold text-secondary">
            {percentFmt.format(data.effectiveRate)}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Bracket Breakdown
        </h3>
        <BracketTable bracketResults={data.bracketResults} />
      </div>
    </div>
  )
}
