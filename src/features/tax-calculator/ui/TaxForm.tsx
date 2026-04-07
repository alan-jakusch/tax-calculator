import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taxFormSchema } from '../model/tax.schema'
import type { TaxFormSchema } from '../model/tax.schema'
import type { TaxFormValues } from '../model/types'
import { Button, FormField, Select } from '@/shared/ui'

const TAX_YEAR_OPTIONS = [
  { value: '2019', label: '2019' },
  { value: '2020', label: '2020' },
  { value: '2021', label: '2021' },
  { value: '2022', label: '2022' },
]

interface TaxFormProps {
  onSubmit: (values: TaxFormValues) => void
  isLoading: boolean
}

export function TaxForm({ onSubmit, isLoading }: TaxFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaxFormSchema>({
    resolver: zodResolver(taxFormSchema),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (data.taxYear === undefined) return
        onSubmit({ income: data.income, taxYear: data.taxYear })
      })}
      noValidate
      className="flex flex-col gap-5"
    >
      <FormField
        label="Annual Income"
        type="number"
        min="0"
        step="1"
        placeholder="e.g. 75000"
        error={errors.income?.message}
        required
        {...register('income', { valueAsNumber: true })}
      />

      <Select
        label="Tax Year"
        options={TAX_YEAR_OPTIONS}
        placeholder="Select a year"
        error={errors.taxYear?.message}
        required
        {...register('taxYear', { valueAsNumber: true })}
      />

      <Button
        type="submit"
        size="lg"
        loading={isLoading}
        disabled={isLoading}
        className="w-full mt-1"
      >
        Calculate Tax
      </Button>
    </form>
  )
}
