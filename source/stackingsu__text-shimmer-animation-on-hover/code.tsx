import { cn } from '@/lib/utils';
import * as React from 'react';

export const TextShimmer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span
      className={cn(
        'bg-[linear-gradient(90deg,var(--foreground)_0%,var(--foreground)_var(--highlight-x),#f98dbe_calc(var(--highlight-x)+8%),#edb541_calc(var(--highlight-x)+28%),#54c546_calc(var(--highlight-x)+48%),var(--foreground)_calc(var(--highlight-x)+56%),var(--foreground)_100%)] animate-shimmer [-webkit-text-fill-color:transparent] bg-clip-text inline-block',
        className,
      )}
    >
      {children}
    </span>
  );
};

export default TextShimmer;
