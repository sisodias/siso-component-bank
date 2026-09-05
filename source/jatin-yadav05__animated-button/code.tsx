'use client';
import { motion } from 'motion/react';

const Content = () => {
  return (
    <div
      className='[perspective:1000px] [transform-style:preserve-3d] flex flex-col items-center justify-center h-screen bg-neutral-900 w-full'
      style={
        {
          backgroundImage: 'radial-gradient(circle at 0.5px 0.5px, rgba(6, 182,212, 0.2) 0.5px, transparent 0)',
          backgroundSize: '8px 8px',
          backgroundPosition: 'repeat',
        }
      }
    >
      <motion.button
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, ease: 'easeInOut' },
        }}
        whileHover={{
          rotateX: 25,
          rotateY: 10,
          boxShadow: '0 20px 50px rgba(6, 182,212, 0.2)',
          backdropFilter: 'blur(10px)',
          transition: { duration: 0.2, ease: 'easeInOut' },
          y: -10,
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.2, ease: 'easeInOut' },
        }}
        style={{
          translateZ: 100,
        }}
        className="text-neutral-500 group relative py-4 px-12 rounded-xl text-xl bg-black shadow-[0_1px_2px_0_rgba(255,255,255,0.1)_inset,0px_-1px_2px_0px_rgba(255,255,255,0.1)_inset]"
      >
        <span className="text-white">
          Explore
        </span>
        <span className='absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 mx-auto'></span>
        <span className='absolute opacity-0 group-hover:opacity-100 bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[3px] blur-sm w-full mx-auto transition-opacity duration-300'></span>
      </motion.button>
    </div>
  );
};

export default Content;
