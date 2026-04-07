import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { Label } from './label'
import { cn } from '@/shared/lib'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  error?: string
  required?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, required, id, className, ...props }, ref) => {
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
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full h-10 px-3 pr-10 text-base bg-surface text-text-primary rounded-md border appearance-none',
              'transition-colors duration-200 ease-out cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-border-focus/25 focus:border-border-focus',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-error focus:ring-error/25 focus:border-error'
                : 'border-border',
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none"
            aria-hidden="true"
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

Select.displayName = 'Select'

export { Select }
export type { SelectProps, SelectOption }
