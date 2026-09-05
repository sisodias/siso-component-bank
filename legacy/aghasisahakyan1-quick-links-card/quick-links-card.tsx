import Link from 'next/link'
import { cn } from "../_utils/cn"

// Re-using the Cross SVG from the original example
const Cross = () => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 130 130"
    fill="none"
    className={'scale-125'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 11L118.899 119M11.101 119L119 11" stroke="#282828" strokeWidth="31" />
  </svg>
)

export const NavCardWrapper: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div
    className={cn(
      'min-h-[300px] h-auto max-w-sm w-full bg-purple-500 relative overflow-hidden rounded-2xl text-white p-6',
      className
    )}
  >
    <div className={'absolute top-0 left-0 w-full h-full z-[0]'}>
        <div className={'w-fit h-fit absolute top-0 -left-10 z-0 animate-[spin_5s_linear_infinite]'}> <Cross /> </div>
        <div className={'w-fit h-fit absolute top-1/2 -right-12 z-0 animate-[spin_5s_linear_infinite]'}> <Cross /> </div>
        <div className={'w-fit h-fit absolute top-[85%] -left-5 z-0 animate-[spin_5s_linear_infinite]'}> <Cross /> </div>
    </div>
    <div className="relative z-[2]">{children}</div>
  </div>
)

export const NavCardHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h2 className={cn('text-3xl font-bold border-b-4 border-white/50 pb-2 mb-4', className)}>
    {children}
  </h2>
)

export const NavCardLink: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({
  href,
  children,
  className
}) => (
  <Link href={href}>
    <a className={cn('block text-xl font-semibold py-2 hover:bg-white/10 rounded-md px-2 transition-colors', className)}>
        {children}
    </a>
  </Link>
)