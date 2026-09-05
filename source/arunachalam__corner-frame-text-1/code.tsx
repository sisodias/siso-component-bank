'use client';

import type { FC } from 'react';
import { cn } from '@/lib/utils';

type CornerFrameTextProps = {
  text?: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'span'>;

const CornerFrameText: FC<CornerFrameTextProps> = ({
  text = 'Framed Text',
  className,
  ...props
}) => {
  return (
    <div className={cn('relative inline-block px-6 py-3', className)}>
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          '[background-image:linear-gradient(to_right,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_right,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_left,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_left,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_top,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_top,var(--foreground)_1.5px,transparent_1.5px)]',
          '[background-position:0_0,0_100%,100%_0,100%_100%,0_0,100%_0,0_100%,100%_100%]',
          '[background-size:15px_15px]',
          '[background-repeat:no-repeat]'
        )}
      />
      <span className="relative z-10" {...props}>
        {text}
      </span>
    </div>
  );
};

export default CornerFrameText;