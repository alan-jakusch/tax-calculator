import { z } from 'zod'

export const taxFormSchema = z.object({
  income: z
    .number({ invalid_type_error: 'Income must be a number' })
    .min(0, 'Income must be non-negative'),
  taxYear: z.union([
    z.literal(2019),
    z.literal(2020),
    z.literal(2021),
    z.literal(2022),
  ]),
})

export type TaxFormSchema = z.infer<typeof taxFormSchema>
