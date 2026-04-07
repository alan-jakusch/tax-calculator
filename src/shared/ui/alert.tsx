import type { ReactNode } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { cn } from '@/shared/lib'

type AlertVariant = 'success' | 'warning' | 'error' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  className?: string
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; text: string; icon: typeof Info }> = {
  success: {
    bg: 'bg-success-light',
    border: 'border-l-success',
    text: 'text-success',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-warning-light',
    border: 'border-l-warning',
    text: 'text-warning',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-error-light',
    border: 'border-l-error',
    text: 'text-error',
    icon: XCircle,
  },
  info: {
    bg: 'bg-info-light',
    border: 'border-l-info',
    text: 'text-info',
    icon: Info,
  },
}

function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 p-4 rounded-md border border-l-4 border-border backdrop-blur-md animate-fade-in',
        config.bg,
        config.border,
        className,
      )}
    >
      <Icon className={cn('size-5 shrink-0 mt-0.5', config.text)} aria-hidden="true" />
      <div className="flex flex-col gap-1">
        {title && (
          <p className={cn('text-sm font-semibold', config.text)}>{title}</p>
        )}
        <div className="text-sm text-text-primary">{children}</div>
      </div>
    </div>
  )
}

export { Alert }
export type { AlertProps, AlertVariant }
