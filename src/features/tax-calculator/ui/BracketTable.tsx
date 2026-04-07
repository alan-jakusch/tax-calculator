import type { BracketResult } from '../model/types'
import { cn } from '@/shared/lib'

interface BracketTableProps {
  bracketResults: BracketResult[]
}

const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 })

function formatRate(rate: number) {
  return `${(rate * 100).toFixed(0)}%`
}

export function BracketTable({ bracketResults }: BracketTableProps) {
  const activeIndex = bracketResults.reduce<number>(
    (last, b, i) => (b.taxable > 0 ? i : last),
    -1,
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-background text-text-secondary border-b border-border">
            <th className="px-4 py-3 text-left font-semibold">Rate</th>
            <th className="px-4 py-3 text-right font-semibold">Taxable Income</th>
            <th className="px-4 py-3 text-right font-semibold">Tax Amount</th>
          </tr>
        </thead>
        <tbody>
          {bracketResults.map((b, i) => {
            const isActive = i === activeIndex
            return (
              <tr
                key={i}
                data-active={isActive ? 'true' : undefined}
                className={cn(
                  'border-b border-border last:border-0 transition-colors',
                  isActive
                    ? 'bg-secondary/5 border-l-2 border-l-secondary font-medium'
                    : 'bg-surface text-text-secondary',
                )}
              >
                <td className="px-4 py-3 font-semibold text-text-primary">
                  {formatRate(b.rate)}
                </td>
                <td className="px-4 py-3 text-right">
                  {b.taxable > 0 ? currencyFmt.format(b.taxable) : <span className="text-text-muted">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {b.tax > 0 ? currencyFmt.format(b.tax) : <span className="text-text-muted">—</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
