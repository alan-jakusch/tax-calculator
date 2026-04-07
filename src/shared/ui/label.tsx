import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-text-primary',
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
    )
  },
)

Label.displayName = 'Label'

export { Label }
export type { LabelProps }
