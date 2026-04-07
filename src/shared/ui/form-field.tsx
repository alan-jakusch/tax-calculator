import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Label } from './label'
import { Input } from './input'
import { cn } from '@/shared/lib'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, iconLeft, iconRight, id, className, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const errorId = `${fieldId}-error`

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={fieldId}
          error={!!error}
          iconLeft={iconLeft}
          iconRight={iconRight}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
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

FormField.displayName = 'FormField'

export { FormField }
export type { FormFieldProps }
