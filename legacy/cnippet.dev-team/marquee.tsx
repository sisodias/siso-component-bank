"use client"
export function Marquee({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & { pauseOnHover?: boolean }) {
  return <div className={className} {...props}>{children}</div>
}
