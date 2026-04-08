import { BracketTable } from './BracketTable'
import type { TaxResult as TaxResultType } from '../model'
import { currencyCompact, getTaxErrorMessage, percentDetailed } from '../lib'
import { TaxApiError } from '../api'
import { Alert, Button, Skeleton, Separator } from '@/shared/ui'

interface TaxResultProps {
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error?: TaxApiError
  data?: TaxResultType
  onRetry?: () => void
}

export function TaxResult({ isLoading, isFetching, isError, error, data, onRetry }: TaxResultProps) {
  if (isLoading && !data) {
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
    const canRetry = Boolean(onRetry && error?.retryable)
    const supportText = canRetry
      ? 'You can try again now.'
      : 'If this problem continues, please try again later.'

    return (
      <Alert variant="error" title="Unable to load tax data">
        <p>{getTaxErrorMessage(error)}</p>
        <p className="mt-1 text-xs text-text-secondary">{supportText}</p>
        {canRetry && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={onRetry}
            loading={isFetching}
            disabled={isFetching}
          >
            Try again
          </Button>
        )}
      </Alert>
    )
  }

  if (!data) return null

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-cta/40 bg-cta/10 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Total Tax
          </span>
          <span className="min-w-0 break-all text-xl font-bold leading-tight text-text-primary sm:text-2xl">
            {currencyCompact.format(data.totalTax)}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-primary/40 bg-primary/10 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
            Effective Rate
          </span>
          <span className="min-w-0 break-all text-xl font-bold leading-tight text-text-primary sm:text-2xl">
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
