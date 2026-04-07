export type TaxBracket = { min: number; max?: number; rate: number }

export type TaxBracketsResponse = { tax_brackets: TaxBracket[] }

export type BracketResult = {
  min: number
  max: number | null
  rate: number
  taxable: number
  tax: number
}

export type TaxResult = {
  bracketResults: BracketResult[]
  totalTax: number
  effectiveRate: number
}

export type TaxYear = 2019 | 2020 | 2021 | 2022

export type TaxFormValues = { income: number; taxYear: TaxYear }
