import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { Label } from './label'
import { cn } from '@/shared/lib'

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  currency?: string
  error?: string
  required?: boolean
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, currency = 'R$', error, required, id, className, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const errorId = `${fieldId}-error`

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <Label htmlFor={fieldId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium pointer-events-none select-none">
            {currency}
          </span>
          <input
            ref={ref}
            id={fieldId}
            type="text"
            inputMode="decimal"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full h-10 pl-10 pr-3 text-base bg-surface text-text-primary rounded-md border',
              'placeholder:text-text-muted',
              'transition-colors duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-border-focus/25 focus:border-border-focus',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-error focus:ring-error/25 focus:border-error'
                : 'border-border',
            )}
            {...props}
          />
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-error animate-slide-up"
          >
            {error}
          </p>
        )}
      </div>
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
export type { CurrencyInputProps }
