import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// --- Data for the steps ---
const stepsData = [
  {
    id: 1,
    number: '01',
    title: 'Analyze',
    description: 'In the initial phase, we thoroughly analyze the project requirements, goals, and target audience to build a strong foundation.',
  },
  {
    id: 2,
    number: '02',
    title: 'Proposal',
    description: 'Based on our analysis, we craft a detailed proposal outlining the project scope, timeline, and deliverables.',
  },
  {
    id: 3,
    number: '03',
    title: 'First Version',
    description: 'We develop and deliver the first functional version of the project, ready for initial review and feedback.',
  },
  {
    id: 4,
    number: '04',
    title: 'Feedback',
    description: 'We collect feedback on the first version and iterate on the design and functionality to refine the final product.',
  },
];

// --- Custom Hook for Theme Detection ---
const useSystemTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      console.warn('window.matchMedia is not supported by this browser.');
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = (e) => setTheme(e.matches ? 'dark' : 'light');
    updateTheme(mediaQuery);

    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return theme;
};


// --- Step Component ---
const Step = ({ step, isActive, onStepClick }) => {
  const { number, title, description } = step;

  // --- Animation Variants ---
  // UPDATE: The animation is now orchestrated with parent/child variants for a two-step effect.

  // 1. Parent Container Variant: Handles rotation and orchestrates children.
  const containerVariants = {
    hidden: { rotateY: -90, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: {
        rotateY: { duration: 0.4, ease: "easeOut" },
        opacity: { duration: 0.3 },
        when: "beforeChildren", // Animate parent before children
        staggerChildren: 0.1, // Delay between children animations
      },
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      transition: {
        rotateY: { duration: 0.3, ease: "easeIn" },
        opacity: { duration: 0.2 },
        when: "afterChildren", // Animate parent after children
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // 2. Child Item Variant: Handles fade and slide for the text content.
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };


  return (
    <motion.div
      layout
      onClick = {() => onStepClick(step.id)}
style = {{ flex: isActive ? 4 : 1, perspective: '800px' }}
className = "relative h-[24rem] md:h-[28rem] p-6 md:p-8 cursor-pointer overflow-hidden"
  >
  {/* --- Vertical Line Separator --- */ }
  < div className = "absolute top-0 left-0 h-full w-px bg-gray-900/10 dark:bg-gray-50/10" > </div>

{/* --- Step Number --- */ }
<motion.div 
        layout="position"
className = {`absolute top-6 md:top-8 right-6 md:right-8 text-5xl md:text-6xl font-bold transition-colors duration-500 
                    ${isActive ? 'text-gray-900/20 dark:text-gray-50/20' : 'text-gray-900 dark:text-gray-50'}`}
      >
  { number }
  < /motion.div>

{/* --- Step Content --- */ }
<div className={ `relative z-10 h-full flex flex-col justify-end ${!isActive ? 'items-end' : ''}` }>
  <AnimatePresence mode="wait" initial = { false} >
  {
    isActive?(
            // --- Active Step Content (Expanded) ---
            <motion.div
              key="content-active"
              variants={ containerVariants }
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ originX: 0 }} // Set rotation origin to the left edge
className = "h-full flex flex-col justify-end"
  >
  <motion.h2 variants={ itemVariants } className = "text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4" > { title } < /motion.h2>
    < motion.p variants = { itemVariants } className = "text-base md:text-lg text-gray-900/70 dark:text-gray-50/70 max-w-sm" > { description } < /motion.p>
      < /motion.div>
          ) : (
  // --- Inactive Step Content (Vertical Title) ---
  <motion.h2 
              key= "title-inactive"
layout = "position"
className = "text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 whitespace-nowrap"
style = {{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
  { title }
  < /motion.h2>
          )}
</AnimatePresence>
  < /div>
  < /motion.div>
  );
};


// --- Main Horizontal Steps Component ---
const HorizontalSteps = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(steps[0]?.id || null);

  return (
    <div className= "flex" >
    {
      steps.map((step) => (
        <Step
        key= { step.id }
        step = { step }
        isActive = { activeStep === step.id}
  onStepClick = { setActiveStep }
    />
    ))}
</div>
  );
};


// --- App Component (Main Entry Point) ---
export function Component() {

  return (
    <HorizontalSteps steps= { stepsData } />    
  );
}
