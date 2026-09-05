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
      default: 'w-[400px] h-[450px]',
      sm: 'w-[300px] h-[350px]',
      lg: 'w-[500px] h-[550px]',
    };

    const overlayBgClasses = {
      default: 'bg-[#c34c32]',
      primary: 'bg-blue-600',
      secondary: 'bg-purple-600',
    };

    const gradientFromClasses = {
      default: 'from-[#c34c32]',
      primary: 'from-blue-600',
      secondary: 'from-purple-600',
    };

    const Comp = asChild ? React.Fragment : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(
          'relative mt-4 overflow-hidden group mx-auto dark:bg-black bg-white dark:border-0 border rounded-md dark:text-white text-black flex flex-col',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div className='w-full h-full'>
          <Image
            src={
              'https://images.unsplash.com/photo-1583071299210-c6c113f4ac91?q=80&w=800&auto=format&fit=crop'
            }
            alt='Portrait Girl'
            width={600}
            height={600}
            className='h-full w-full scale-105 group-hover:scale-100 object-cover transition-all duration-300 rounded-md'
          />
        </div>
        <article className={cn('p-8 w-full h-full overflow-hidden z-10 absolute top-0 flex flex-col justify-end rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300', overlayBgClasses[variant])}>
          <div className='translate-y-10 group-hover:translate-y-0 transition-all duration-300 space-y-2'>
            <h1 className='md:text-2xl font-semibold'>Who We are</h1>
            <p className='sm:text-base text-sm'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
              consectetur ducimus vel nemo deserunt possimus inventore ipsum
              nostrum. Sapiente, facilis?
            </p>
            <button className='p-2 bg-black flex rounded-md text-white'>
              Learn More <ChevronsRight />
            </button>
          </div>
        </article>
        <article className={cn('p-2 w-full h-[20%] flex flex-col justify-end overflow-hidden absolute bottom-0 rounded-b-md opacity-100 group-hover:opacity-0 group-hover:-bottom-4 transition-all duration-300 bg-gradient-to-t', gradientFromClasses[variant])}>
          <h1 className='md:text-2xl font-semibold'>Naymur Rahman</h1>
          <p className='sm:text-base text-sm'>CEO & Design Engineer</p>
        </article>
      </Comp>
    );
  }
);

Component.displayName = 'Component';

export default Component;