import { cn } from '@/shared/lib'

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('bg-border animate-pulse rounded-md', className)}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
