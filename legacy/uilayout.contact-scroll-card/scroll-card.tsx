// component.tsx
'use client';
import { ReactLenis } from 'lenis/react';
import React, { useRef, forwardRef } from 'react';

interface ArticleCardData {
  title: string;
  description: string;
  link: string;
  color: string;
  rotation: string;
}

const articleCardsData: ArticleCardData[] = [
  {
    title: 'Image MouseTrail',
    description:
      "An Mouse who is running with couple of images and the best part is you can hide all the images when you don't move your mouse. I hope you'll love it",
    link: 'https://ui-layout.com/components/image-mousetrail',
    color: '#E0E0E0', // Light Gray
    rotation: 'rotate-6',
  },
  {
    title: 'Progressive Carousel',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequatur explicabo assumenda odit necessitatibus possimus ducimus aliquam. Ullam dignissimos animi officiis, in sequi et inventore harum ipsam sed.',
    link: 'https://ui-layout.com/components/progressive-carousel',
    color: '#C0C0C0', // Medium Gray
    rotation: 'rotate-0',
  },
  {
    title: 'Responsive Drawer',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequatur explicabo assumenda odit necessitatibus possimus ducimus aliquam. Ullam dignissimos animi officiis, in sequi et inventore harum ipsam sed.',
    link: 'https://ui-layout.com/components/drawer',
    color: '#A0A0A0', // Darker Gray
    rotation: '-rotate-6',
  },
  {
    title: 'Animated Globe',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequatur explicabo assumenda odit necessitatibus possimus ducimus aliquam. Ullam dignissimos animi officiis, in sequi et inventore harum ipsam sed.',
    link: 'https://ui-layout.com/components/globe',
    color: '#808080', // Even Darker Gray
    rotation: 'rotate-0',
  },
];

const Component = forwardRef<HTMLElement>((props, ref) => {
  return (
    <ReactLenis root>
      <main className='bg-black' ref={ref}>
        <div className='wrapper'>
          <section className='text-white h-screen w-full bg-slate-950 grid place-content-center sticky top-0'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

            <h1 className='2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]'>
              CSS Sticky Properties for <br /> Stacking Cards. Scroll down! 👇
            </h1>
          </section>
        </div>

        <section className='text-white w-full bg-slate-950'>
          <div className='flex justify-between px-16'>
            <div className='grid gap-2'>
              {articleCardsData.map((card, i) => (
                <figure key={i} className='sticky top-0 h-screen grid place-content-center'>
                  <article
                    className={`${card.color} h-72 w-[30rem] rounded-lg ${card.rotation} p-4 grid place-content-center gap-4`}
                    style={{ backgroundColor: card.color }}
                  >
                    <h1 className='text-2xl font-semibold'>{card.title}</h1>
                    <p>{card.description}</p>
                    <a
                      href={card.link}
                      target='_blank'
                      className='w-fit bg-black p-3 rounded-md cursor-pointer text-white'
                    >
                      Click to View
                    </a>
                  </article>
                </figure>
              ))}
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-4xl px-8 font-medium text-center tracking-tight leading-[120%]'>
                What We <br /> Have Now😎
              </h1>
            </div>
          </div>
        </section>

        <footer className='group bg-slate-950 '>
          <h1 className='text-[16vw] translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
            ui-layout
          </h1>
          <div className='bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full text-white'></div>
        </footer>
      </main>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;