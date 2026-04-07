import { cn } from '@/shared/lib'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className,
      )}
    />
  )
}

export { Separator }
export type { SeparatorProps }
