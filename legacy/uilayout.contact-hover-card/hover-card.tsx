// component.tsx
import React from 'react';
import Image from 'next/image';
import { ChevronsRight } from 'lucide-react';
import { cn } from "../_utils/cn";

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ variant = 'default', size = 'default', asChild, className, ...props }, ref) => {

    const sizeClasses = {
      default: 'w-[400px] h-[400px]',
      sm: 'w-[300px] h-[300px]',
      lg: 'w-[500px] h-[500px]',
    };

    const gradientVariants = {
      default: 'from-[#02cc6e25] via-[#02cc6e5b] to-[#02cc6e]',
      primary: 'from-[#007bff25] via-[#007bff5b] to-[#007bff]',
      secondary: 'from-[#ffc10725] via-[#ffc1075b] to-[#ffc107]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative mt-4 group mx-auto dark:bg-black bg-white dark:border-0 border overflow-hidden rounded-md dark:text-white text-black',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <figure className='w-full h-full rounded-md overflow-hidden'>
          <Image
            src={
              'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format'
            }
            alt='shoes'
            width={600}
            height={600}
            className='h-full w-full scale-105 group-hover:scale-100 rounded-lg object-cover transition-all duration-300'
          />
        </figure>
        <div className={cn('absolute top-0 left-0 w-full h-full transition-all duration-300 bg-gradient-to-b', gradientVariants[variant])}></div>
        <article className='p-4 space-y-2 absolute -bottom-10 group-hover:bottom-0 transition-all duration-300'>
          <h1 className='text-2xl font-semibold capitalize w-[90%]'>
            Learn why going to the mountains can change your thoughts and
            lifestyle forever
          </h1>
          <a
            href='#'
            className='text-base dark:text-white text-blue-600 font-normal group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0 pt-2 flex gap-1 transition-all duration-300'
          >
            Read Story
            <span>
              <ChevronsRight />
            </span>
          </a>
        </article>
      </div>
    );
  }
);

Component.displayName = 'Component';

export default Component;