// component.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         data-slot="card"
         className={cn(
            'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
            className
         )}
         {...props}
      />
   )
);
Card.displayName = 'Card';

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
   return (
      <div
         data-slot="card-header"
         className={cn('flex flex-col gap-1.5 px-6', className)}
         {...props}
      />
   );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
   return (
      <div
         data-slot="card-title"
         className={cn('font-semibold leading-none', className)}
         {...props}
      />
   );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
   return (
      <div
         data-slot="card-description"
         className={cn('text-sm text-muted-foreground', className)}
         {...props}
      />
   );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
   return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
   return (
      <div data-slot="card-footer" className={cn('flex items-center px-6', className)} {...props} />
   );
}

export default Card;
export { CardHeader, CardFooter, CardTitle, CardDescription, CardContent };