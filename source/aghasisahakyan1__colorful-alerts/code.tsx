import { cn } from '@/lib/utils'

const AlertIcon = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20L10 80H90L50 20Z" stroke="#282828" strokeWidth="15" strokeLinejoin="round"/>
        <line x1="50" y1="45" x2="50" y2="65" stroke="#282828" strokeWidth="15"/>
        <circle cx="50" cy="80" r="5" fill="#282828"/>
    </svg>
)

export const AlertWrapper: React.FC<{
  children: React.ReactNode
  className?: string
  type?: 'info' | 'warning' | 'success'
}> = ({ children, className, type = 'info' }) => {
    const bgColors = {
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
        success: 'bg-green-500'
    }
    const textColors = {
        info: 'text-white',
        warning: 'text-neutral-900',
        success: 'text-white'
    }

  return (
    <div
      className={cn(
        'w-full relative overflow-hidden rounded-lg p-4 flex items-center gap-4',
        bgColors[type],
        textColors[type],
        className
      )}
    >
      <div className={'absolute -left-4 -top-4 z-0 opacity-10'}>
          <AlertIcon />
      </div>
      <div className="relative z-[2] w-full">{children}</div>
    </div>
  )
}

export const AlertText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={cn('text-lg font-semibold', className)}>
    {children}
  </p>
)