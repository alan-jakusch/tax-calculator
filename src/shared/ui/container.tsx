import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
}

function Container({ size = 'lg', className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Container }
export type { ContainerProps, ContainerSize }
