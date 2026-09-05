// component.tsx
'use client';

// @tailwind theme: extend colors.highlight = '#454ADE'
// @tailwind theme: extend colors.hightlight_light = '#DADBF8'
// @tailwind theme: extend colors.accent_light = '#D9EAE3'
// @tailwind theme: extend colors.primary_light = '#FFCFE1'
// @tailwind theme: extend colors.secondary_light = '#FFFCE5'
// @tailwind theme: extend boxShadow.button = '6px 6px 0px #620337'
// @tailwind theme: extend fontFamily.sans = ['var(--font-outfit)', 'var(--font-inter-tight)', 'sans-serif']
// @tailwind theme: extend fontFamily.display = ['var(--font-inter-tight)', 'var(--font-outfit)']
// @tailwind theme: extend animation.wiggle = 'wiggle 1.5s ease-in-out infinite'
// @tailwind theme: extend animation.float = 'float 8s ease-in-out infinite'
// @tailwind plugin: daisyui



import Image from 'next/image';
import { Sparkle } from 'lucide-react';

export interface FeatureCard {
  title: string;
  description: string;
  image: any;
}

export interface FeatureSectionProps {
  caption: string;
  headline: string;
  subheadline: string;
  features: FeatureCard[];
  stats: string[];
}

export function FeatureSection({
  caption,
  subheadline,
  features,
  stats,
}: FeatureSectionProps) {
  return (
    <section id='how-it-works' className='max-w-5xl mx-auto flex-col justify-center items-center gap-4 px-4 py-12'>
      <div className='flex flex-col gap-4 items-start my-8 justify-between'>
        <p className='flex items-center justify-center  px-4 py-2 bg-white/25 border-2 border-white/25  rounded-[8px] text-primary font-medium text-sm'>{caption}</p>
        <div className='flex flex-col md:flex-row gap-2 items-between w-full justify-between'>
          <h2 className="relative text-4xl md:text-5xl font-sans font-semibold max-w-xl text-left leading-[1em] text-base-content">We make it <br/> <span><Sparkle className="inline-flex text-primary fill-primary/20 rotate-12" size={40} strokeWidth={2} /></span> super easy.</h2>
          <p className='max-w-sm font-medium font-display text-base text-right text-[#222222] opacity-50'>{subheadline}</p>
        </div>
      </div>

      <div className='flex flex-row items-center overflow-x-auto lg:overflow-visible py-4 md:py-10 gap-4'>
        {features.map((feature, idx) => (
          <div key={idx} className='flex md:hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-[-6px_6px_32px_8px_rgba(192,192,192,0.2)] min-w-80 flex-col gap-4 items-center justify-center max-w-xs bg-white px-3 pt-3 pb-6 rounded-2xl'>
            <div className='w-full h-60 bg-secondary/20 rounded-2xl'>
              
            </div>
            <div className='flex flex-col gap-2 items-center justify-start py-2'>
              <h3 className='text-xl font-semibold text-center'>{feature.title}</h3>
              <p className='text-base text-center text-neutral/50'>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-row justify-center gap-4 md:gap-0 md:justify-between md:max-w-2xl md:px-8 py-2 md:py-0 items-center mx-auto'>
        {stats.map((stat, idx) => (
          <p key={idx} className='flex flex-row gap-2 items-center justify-center text-base-content font-medium text-base'>
            <Sparkle className='fill-accent text-accent rotate-6' />
            {stat}
          </p>
        ))}
      </div>
    </section>
  );
}