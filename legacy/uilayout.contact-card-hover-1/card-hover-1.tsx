import React from 'react';
import {
  ChevronRight,
  MoveUpRight,
} from 'lucide-react';

type ComponentProps = React.HTMLAttributes<HTMLDivElement>;

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-[400px] relative mt-4 h-[430px] group mx-auto dark:bg-black  bg-white dark:border-0 border rounded-md dark:text-white text-black flex flex-col ${className || ''}`}
        {...props}
      >
        <div className='w-full  rounded-t-md h-[350px] group-hover:h-[410px] overflow-hidden transition-all duration-300'>
          <img
            src={'https://images.unsplash.com/photo-1626639900752-3ea9001925ae?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            alt='person'
            width={600}
            height={600}
            className='h-full w-full  scale-105 group-hover:scale-100 grayscale group-hover:grayscale-0 object-cover transition-all duration-300'
          />
        </div>
        <article className='relative overflow-hidden  flex-grow'>
          <div className='info p-2 translate-y-0 group-hover:-translate-y-20 transition-all duration-300'>
            <p className='md:text-2xl font-semibold'>Naymur Rahman</p>
            <p className='sm:text-base text-sm'>CEO & Design Engineer</p>
          </div>
          <button className='absolute h-10 -bottom-8 opacity-0 group-hover:opacity-100 cursor-pointer group-hover:bottom-3  text-3xl font-medium transition-all duration-300 w-full text-center'>
            CEO & Design Engineer
          </button>
        </article>
      </div>
    );
  }
);

Component.displayName = 'Component';

export default Component;