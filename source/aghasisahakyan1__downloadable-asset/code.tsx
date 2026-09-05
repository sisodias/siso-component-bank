import Link from 'next/link'
import { cn } from '@/lib/utils'

const DownloadIcon = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 10V80M60 80L40 60M60 80L80 60M10 110H110" stroke="#282828" strokeWidth="15"/>
    </svg>
)

export const DownloadWrapper: React.FC<{
  children: React.ReactNode
  downloadHref: string
  className?: string
}> = ({ children, downloadHref, className }) => (
  <div
    className={cn(
      'h-[480px] max-w-sm w-full bg-pink-500 relative overflow-hidden rounded-2xl text-white p-6 flex flex-col items-center justify-around text-center',
      className
    )}
  >
    <div className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 scale-125'}>
        <DownloadIcon />
    </div>
    <div className="z-[2]">{children}</div>
    <Link href={downloadHref} className={'w-full h-fit z-[2]'}>
      <button className={'h-12 w-full bg-white rounded-lg text-neutral-900 font-bold'}>
        Download Now
      </button>
    </Link>
  </div>
)

export const AssetThumbnail: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
    <div className={cn('w-40 h-48 bg-white/20 rounded-lg flex items-center justify-center', className)}>
        {children}
    </div>
)

export const AssetHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn('text-2xl font-bold mt-4', className)}>
    {children}
  </h3>
)