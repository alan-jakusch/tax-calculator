import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-surface rounded-lg shadow-sm border border-border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardContent, CardFooter }
