'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from "../_utils/cn";

type MorphingArrowButtonProps = {
  direction: 'left' | 'right';
};

const MorphingArrowButton = ({ direction }: MorphingArrowButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLeft = direction === 'left';

  const containerVariants = {
    initial: { width: '64px', x: 0 },
    hover: {
      width: '120px',
      x: isLeft ? '-56px' : 0,
    },
  };

  const buttonVariants = {
    initial: {
      borderRadius: '50%',
      height: '64px',
      padding: '0',
    },

    hover: {
      borderRadius: isLeft ? '50px 14px 14px 50px' : '14px 50px 50px 14px',
      height: '64px',
      padding: '0 10px',
    },
  };

  const lineVariants = {
    initial: { width: 0 },
    hover: { width: 'calc(100% - 50px)' },
  };

  const arrowVariants = {
    initial: { x: '-50%' },
    hover: { x: isLeft ? '-120%' : '20%' },
  };

  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <div className='inline-block w-[120px] overflow-visible'>
      <motion.div
        className={cn(
          'flex items-center',
          isLeft ? 'justify-end' : 'justify-start'
        )}
        variants={containerVariants}
        initial='initial'
        animate={isHovered ? 'hover' : 'initial'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.button
          className={cn(
            'w-full flex items-center justify-center border border-black dark:border-white',
            'relative overflow-hidden cursor-pointer bg-transparent'
          )}
          variants={buttonVariants}
          initial='initial'
          animate={isHovered ? 'hover' : 'initial'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className='relative w-full h-full flex items-center'>
            <motion.div
              className={cn(
                'h-0.5 bg-black dark:bg-white absolute top-1/2 -translate-y-1/2',
                isLeft ? 'right-5' : 'left-5'
              )}
              variants={lineVariants}
              initial='initial'
              animate={isHovered ? 'hover' : 'initial'}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />

            <motion.div
              className='absolute top-1/2 left-1/2 -translate-y-1/2'
              variants={arrowVariants}
              initial='initial'
              animate={isHovered ? 'hover' : 'initial'}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Icon className='w-6 h-6 text-black dark:text-white' />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MorphingArrowButton;
