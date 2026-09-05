// component.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = React.forwardRef<HTMLOListElement, ToasterProps>(({ ...props }, ref) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      ref={ref}
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium',
        },
      }}
      {...props}
    />
  );
});
Toaster.displayName = 'Toaster';

export default Toaster;