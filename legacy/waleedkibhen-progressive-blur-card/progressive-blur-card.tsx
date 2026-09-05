import { ArrowRight } from 'lucide-react';
import { cn } from "../_utils/cn";

interface ProgressiveBlurProps {
  className?: string;
  blurIntensity?: number;
}

function ProgressiveBlur({ 
  className = '', 
  blurIntensity = 10 
}: ProgressiveBlurProps) {
  return (
    <div 
      className={cn(className)}
      style={{
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        mask: 'linear-gradient(to top, black 0%, black 60%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.1) 95%, transparent 100%)',
        WebkitMask: 'linear-gradient(to top, black 0%, black 60%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.1) 95%, transparent 100%)',
      }}
    />
  );
}

export function ProgressiveBlurCard() {
  return (
    <div className='relative my-4 aspect-square w-[380px] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border-8 border-white transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] animate-pulse-subtle overflow-hidden'>
      <img
        src='https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        alt='Golden Gate Bridge, San Francisco'
        className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105'
      />
      <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[40%] w-full rounded-b-[20px]'
        blurIntensity={8}
      />
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent transition-all duration-300 hover:from-black/60'>
        <div className='flex items-end justify-between px-6 py-6 group'>
          <div className='flex flex-col transform transition-all duration-300 group-hover:translate-y-[-2px]'>
            <h2 className='text-lg font-semibold text-white transition-all duration-300 group-hover:text-xl'>San Francisco,</h2>
            <p className='text-sm text-white/90 transition-all duration-300 group-hover:text-white'>United States of America</p>
          </div>
          
          <button className="h-10 w-10 rounded-full bg-white shadow-lg ring-1 ring-black/5 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-110 hover:rotate-12 active:scale-95 group/button">
            <ArrowRight className="w-5 h-5 text-gray-800 transition-all duration-300 group-hover/button:text-blue-600 group-hover/button:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}