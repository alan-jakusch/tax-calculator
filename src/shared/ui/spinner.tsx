import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span role="status" aria-label="Loading" className="inline-flex">
      <Loader2
        className={cn('animate-spin text-accent', sizeClasses[size], className)}
        aria-hidden="true"
      />
    </span>
  )
}

export { Spinner }
export type { SpinnerProps, SpinnerSize }
