// component.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../_utils/cn"; // <-- Убедитесь, что импорт правильный

export type Step = 1 | 2 | 3;

// ... (интерфейс StepStyle и объект stepStyles остаются без изменений)
export interface StepStyle {
   containerWidth: number;
   containerHeight: string | number;
   imageHeight: number;
   contentDirection: 'row' | 'column';
   contentAlign: 'flex-start' | 'center';
   contentJustify: 'flex-start' | 'space-between';
   infoDirection: 'row' | 'column';
   infoAlign: 'flex-start' | 'center';
   infoJustify: 'flex-start' | 'space-between';
   infoWidth: string;
}

const stepStyles: Record<Step, StepStyle> = {
   1: {
      containerWidth: 400,
      containerHeight: 'auto',
      imageHeight: 230,
      contentDirection: 'column',
      contentAlign: 'flex-start',
      contentJustify: 'flex-start',
      infoDirection: 'column',
      infoAlign: 'flex-start',
      infoJustify: 'flex-start',
      infoWidth: '100%',
   },
   2: {
      containerWidth: 550,
      containerHeight: 'auto',
      imageHeight: 280,
      contentDirection: 'column',
      contentAlign: 'flex-start',
      contentJustify: 'flex-start',
      infoDirection: 'row',
      infoAlign: 'center',
      infoJustify: 'space-between',
      infoWidth: '100%',
   },
   3: {
      containerWidth: 700,
      containerHeight: 600,
      imageHeight: 330,
      contentDirection: 'row',
      contentAlign: 'center',
      contentJustify: 'space-between',
      infoDirection: 'row',
      infoAlign: 'center',
      infoJustify: 'space-between',
      infoWidth: 'auto',
   },
};

const cardVariants = {
   hidden: {
      y: 120,
      transition: {
         duration: 0.2,
         ease: 'easeIn',
      },
   },
   visible: {
      y: 0,
      transition: {
         duration: 0.3,
         ease: 'easeOut',
      },
   },
};

const AutoLayoutCard = React.forwardRef<
   HTMLDivElement,
   React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
   const [step, setStep] = useState<Step>(1);

   const handleClick = () => setStep((prevStep) => ((prevStep % 3) + 1) as Step);

   const currentStyle = stepStyles[step];

   return (
      <motion.div
         ref={ref}
         // ИЗМЕНЕНИЕ: Используем cn, заменяем bg-white на bg-card и объединяем с входящим className
         className={cn(
            'relative cursor-pointer overflow-hidden bg-card p-2',
            className,
         )}
         style={{
            width: currentStyle.containerWidth,
            height: currentStyle.containerHeight,
            borderRadius: 24,
         }}
         layout
         onClick={handleClick}
         {...props}
      >
         <motion.div
            layout
            style={{
               height: currentStyle.imageHeight,
               borderRadius: 18,
            }}
            className="relative w-full cursor-pointer overflow-hidden"
         >
            <motion.img
               src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1740&auto=format&fit=crop"
               alt="main-image"
               // ИЗМЕНЕНИЕ: Исправлена опечатка 'bg-slte-50' -> 'bg-slate-50'
               className="bg-slate-50 h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <motion.img
                  layout
                  src="https://plus.unsplash.com/premium_vector-1689096823292-bc4683889961?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9nbyUyMHBuZ3xlbnwwfHwwfHx8MA%3D%3D"
                  alt="logo-lndevui"
                  className="w-20"
               />
            </div>
         </motion.div>
         <motion.div
            // ИЗМЕНЕНИЕ: Добавляем text-card-foreground, чтобы текст адаптировался к теме
            className="flex items-start gap-10 px-5 pb-8 pt-10 text-card-foreground"
            style={{
               flexDirection: currentStyle.contentDirection,
               alignItems: currentStyle.contentAlign,
               justifyContent: currentStyle.contentJustify,
            }}
            layout
         >
            <motion.h1 layout className="text-4xl">
               Auto-layout <br /> Interaction
            </motion.h1>
            <motion.div
               className="flex"
               style={{
                  flexDirection: currentStyle.infoDirection,
                  justifyContent: currentStyle.infoJustify,
                  alignItems: currentStyle.infoAlign,
                  width: currentStyle.infoWidth,
               }}
            >
               <motion.p layout className="mr-6">
                  www.config.com
               </motion.p>
               <motion.p layout>Last update 2024</motion.p>
            </motion.div>
         </motion.div>
         <AnimatePresence mode="wait">
            {step === 3 && (
               <motion.div
                  className="absolute -bottom-40 left-0 right-0 flex w-full items-center justify-center gap-4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={cardVariants}
               >
                  <motion.img
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1742&auto=format&fit=crop"
                     alt="card-image-1"
                     className="bg-slate-50 mt-10 cursor-pointer object-cover"
                     style={{
                        width: 220,
                        height: 250,
                        borderRadius: 14,
                     }}
                     initial={{ rotate: -6 }}
                     layout
                  />
                  <motion.img
                     src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1740&auto=format&fit=crop"
                     alt="card-image-2"
                     className="bg-slate-50 cursor-pointer object-cover"
                     style={{
                        width: 220,
                        height: 250,
                        borderRadius: 14,
                     }}
                     layout
                  />
                  <motion.img
                     src="https://images.unsplash.com/photo-1747138593244-0922d4f9d649?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
                     alt="card-image-3"
                     className="bg-slate-50 mt-10 cursor-pointer object-cover"
                     style={{
                        width: 220,
                        height: 250,
                        borderRadius: 14,
                     }}
                     initial={{ rotate: 6 }}
                     layout
                  />
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
});

AutoLayoutCard.displayName = 'AutoLayoutCard';

export default AutoLayoutCard;