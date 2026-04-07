import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, iconLeft, iconRight, className, ...props }, ref) => {
    return (
      <div className="relative">
        {iconLeft && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          aria-invalid={error}
          className={cn(
            'w-full h-10 px-3 text-base bg-surface text-text-primary rounded-md border',
            'placeholder:text-text-muted',
            'transition-colors duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-border-focus/25 focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error/25 focus:border-error'
              : 'border-border',
            iconLeft ? 'pl-10' : undefined,
            iconRight ? 'pr-10' : undefined,
            className,
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {iconRight}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
