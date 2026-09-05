import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import {cn} from '@/lib/utils'



const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white-one hover:bg-primary/90 dark:bg-white-one dark:text-black-two dark:hover:bg-black-two/90',
        secondary:
          'bg-secondary text-black-one hover:bg-secondary/80 dark:bg-black-two dark:text-white-one dark:hover:bg-black-two/80',
        outline:
          'border border-primary bg-transparent hover:bg-transparent hover:text-black-one dark:border-black-two dark:bg-black-two dark:hover:bg-black-two dark:hover:text-white-one',
        transparent:
          'hover:bg-transparent hover:text-black-one dark:hover:bg-transparent dark:hover:text-white-one',
        link: 'text-black-one underline-offset-4 hover:underline dark:text-white-one',
        error: 'bg-error text-white-one hover:bg-error/90',
        ghost: 'bg-primary/10 hover:bg-primary/20',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'rounded-md px-3',
        lg: 'rounded-md px-8',
        icon: 'size-10 flex-shrink-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
