import { useState } from 'react'
import { TaxForm } from './TaxForm'
import { TaxResult } from './TaxResult'
import { useTaxCalculator } from '../hooks/useTaxCalculator'
import type { TaxFormValues } from '../model/types'
import { Card, CardContent, CardHeader } from '@/shared/ui'

export function TaxCalculatorPage() {
  const [formValues, setFormValues] = useState<TaxFormValues | null>(null)
  const enabled = formValues !== null

  const { data, isLoading, isError, error, refetch } = useTaxCalculator(
    formValues?.income ?? 0,
    formValues?.taxYear ?? 2022,
    enabled,
  )

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-lg flex flex-col gap-8">

        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Tax Calculator
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            Estimate your Canadian federal income tax for 2019–2022.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-base font-semibold text-text-primary">Enter your details</h2>
          </CardHeader>
          <CardContent>
            <TaxForm onSubmit={(values) => setFormValues(values)} isLoading={enabled && isLoading} />
          </CardContent>
        </Card>

        {enabled && (
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <TaxResult
                isLoading={isLoading}
                isError={isError}
                error={error ?? undefined}
                data={data}
                taxYear={formValues.taxYear}
                onRetry={() => void refetch()}
              />
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
