import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

const items = [
  {
    id: 1,
    url: 'https://plus.unsplash.com/premium_photo-1712685912272-96569030d1d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1175',
    title: 'A large body of water surrounded by mountains',
  },
  {
    id: 2,
    url: 'https://plus.unsplash.com/premium_photo-1761478617343-12a3dd981cf6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1175',
    title: 'Abstract streaks of pink and blue on black',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=880&h=600&fit=crop',
    title: 'Mountain Summit',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=880&h=600&fit=crop',
    title: 'Alpine Landscape',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=880&h=600&fit=crop',
    title: 'Mountain Range',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=880&h=600&fit=crop',
    title: 'Mountain Wilderness',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=880&h=600&fit=crop',
    title: 'Mountain Trail',
  },
  {
    id: 8,
    url: 'https://plus.unsplash.com/premium_photo-1761940415449-c09ef466c698?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715',
    title: 'A lone figure stands on a futuristic, reflective surface.',
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=880&h=600&fit=crop',
    title: 'Rocky Cliffs',
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=880&h=600&fit=crop',
    title: 'Forest Path',
  },
  {
    id: 11,
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=880&h=600&fit=crop',
    title: 'Green Hills',
  },
  {
    id: 12,
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=880&h=600&fit=crop',
    title: 'Sunrise Peak',
  },
];

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

function Thumbnails({ index, setIndex }) {
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    if (thumbnailsRef.current) {
      let scrollPosition = 0;
      for (let i = 0; i < index; i++) {
        scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
      }

      scrollPosition += MARGIN_PX;

      const containerWidth = thumbnailsRef.current.offsetWidth;
      const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;
      scrollPosition -= centerOffset;

      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [index]);

  return (
    <div
      ref={thumbnailsRef}
      className='overflow-x-auto'
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className='flex gap-0.5 h-20 pb-2' style={{ width: 'fit-content' }}>
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? 'active' : 'inactive'}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                marginLeft: MARGIN_PX,
                marginRight: MARGIN_PX,
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='relative shrink-0 h-full overflow-hidden rounded'
          >
            <img
              src={item.url}
              alt={item.title}
              className='w-full h-full object-cover pointer-events-none select-none'
              draggable={false}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Component() {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const x = useMotionValue(0);

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, isDragging]);

  return (
    <div className='w-full max-w-3xl mx-auto p-4 lg:p-10'>
      <div className='flex flex-col gap-3'>
        {/* Main Carousel */}
        <div className='relative overflow-hidden rounded-lg bg-gray-100' ref={containerRef}>
          <motion.div
            className='flex'
            drag='x'
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              const containerWidth = containerRef.current?.offsetWidth || 1;
              const offset = info.offset.x;
              const velocity = info.velocity.x;

              let newIndex = index;

              // If fast swipe, use velocity
              if (Math.abs(velocity) > 500) {
                newIndex = velocity > 0 ? index - 1 : index + 1;
              }
              // Otherwise use offset threshold (30% of container width)
              else if (Math.abs(offset) > containerWidth * 0.3) {
                newIndex = offset > 0 ? index - 1 : index + 1;
              }

              // Clamp index
              newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
              setIndex(newIndex);
            }}
            style={{ x }}
          >
            {items.map((item) => (
              <div key={item.id} className='shrink-0 w-full h-[400px]'>
                <img
                  src={item.url}
                  alt={item.title}
                  className='w-full h-full object-cover rounded-lg select-none pointer-events-none'
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>

          {/* Previous Button */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-4 text-black top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10
              ${
                index === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-white hover:scale-110 hover:opacity-100 opacity-70'
              }`}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </motion.button>

          {/* Next Button */}
          <motion.button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`absolute text-black right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10
              ${
                index === items.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-white hover:scale-110 hover:opacity-100 opacity-70'
              }`}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </motion.button>

          {/* Image Counter */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
            {index + 1} / {items.length}
          </div>
        </div>

        <Thumbnails index={index} setIndex={setIndex} />
      </div>
    </div>
  );
}