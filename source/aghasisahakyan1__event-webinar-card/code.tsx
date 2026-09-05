import Link from 'next/link'
import { cn } from '@/lib/utils'

const Calendar = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="100" height="90" rx="10" stroke="#282828" strokeWidth="15"/>
        <line x1="10" y1="50" x2="110" y2="50" stroke="#282828" strokeWidth="15"/>
        <line x1="35" y1="10" x2="35" y2="35" stroke="#282828" strokeWidth="15"/>
        <line x1="85" y1="10" x2="85" y2="35" stroke="#282828" strokeWidth="15"/>
    </svg>
)

export const EventWrapper: React.FC<{
  children: React.ReactNode
  registerHref: string
  className?: string
}> = ({ children, registerHref, className }) => (
  <div
    className={cn(
      'h-auto max-w-sm w-full bg-teal-500 relative overflow-hidden rounded-2xl text-white p-6 flex flex-col justify-between',
      className
    )}
  >
    <div className={'absolute -right-8 -top-8 z-0 opacity-20'}>
        <Calendar />
    </div>
    <div className="z-[2]">{children}</div>
    <Link href={registerHref} className={'w-full h-fit z-[2] mt-8'}>
      <button className={'h-12 w-full bg-white rounded-lg text-neutral-900 font-bold'}>
        Register Now
      </button>
    </Link>
  </div>
)

export const EventDate: React.FC<{ day: string; month: string; className?: string }> = ({
  day,
  month,
  className
}) => (
  <div className={cn('text-center bg-white/20 rounded-lg p-2 w-24 mb-4', className)}>
      <p className={'text-4xl font-bold leading-none'}>{day}</p>
      <p className={'text-lg font-semibold uppercase'}>{month}</p>
  </div>
)

export const EventHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn('text-3xl font-bold leading-tight', className)}>
    {children}
  </h3>
)

export const EventParagraph: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={cn('text-lg mt-2', className)}>
    {children}
  </p>
)