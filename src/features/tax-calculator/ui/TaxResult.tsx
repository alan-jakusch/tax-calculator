import { BracketTable } from './BracketTable'
import type { TaxResult as TaxResultType, TaxYear } from '../model/types'
import { currencyCompact, percentDetailed } from '../lib/formatters'
import { Alert, Skeleton, Separator } from '@/shared/ui'

interface TaxResultProps {
  isLoading: boolean
  isError: boolean
  error?: Error
  data?: TaxResultType
  taxYear?: TaxYear
}

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-accent/20 bg-accent/5 p-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Total Tax
          </span>
          <span className="min-w-0 break-all text-xl font-bold leading-tight text-accent sm:text-2xl">
            {currencyCompact.format(data.totalTax)}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-secondary/20 bg-secondary/5 p-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Effective Rate
          </span>
          <span className="min-w-0 wrap-break-word text-xl font-bold leading-tight text-secondary sm:text-2xl">
            {percentDetailed.format(data.effectiveRate)}
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
