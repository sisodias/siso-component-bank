// src/components/SaleStatusChart.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


interface ChartDataItem {
  name: string;
  value: number;
  strokeColor: string;
  bgColor: string;
}


type Timeframe = 'Monthly' | 'Weekly' | 'Yearly';

const timeframeData: Record<Timeframe, ChartDataItem[]> = {
  Monthly: [
    { name: 'Active', value: 45, strokeColor: 'stroke-indigo-500', bgColor: 'bg-indigo-500' },
    { name: 'Complete', value: 40, strokeColor: 'stroke-emerald-400', bgColor: 'bg-emerald-400' },
    { name: 'On hold', value: 15, strokeColor: 'stroke-rose-500', bgColor: 'bg-rose-500' },
  ],
  Weekly: [
    { name: 'Active', value: 12, strokeColor: 'stroke-indigo-500', bgColor: 'bg-indigo-500' },
    { name: 'Complete', value: 15, strokeColor: 'stroke-emerald-400', bgColor: 'bg-emerald-400' },
    { name: 'On hold', value: 3, strokeColor: 'stroke-rose-500', bgColor: 'bg-rose-500' },
  ],
  Yearly: [
    { name: 'Active', value: 250, strokeColor: 'stroke-indigo-500', bgColor: 'bg-indigo-500' },
    { name: 'Complete', value: 380, strokeColor: 'stroke-emerald-400', bgColor: 'bg-emerald-400' },
    { name: 'On hold', value: 95, strokeColor: 'stroke-rose-500', bgColor: 'bg-rose-500' },
  ],
};

const SaleStatusChart: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('Monthly');
  
  const currentData = timeframeData[selectedTimeframe];
  const totalValue = currentData.reduce((sum, item) => sum + item.value, 0);

  const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeframe(event.target.value as Timeframe);
  };

  const radius = 80;
  const strokeWidth = 25;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const chartContainerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const legendItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const totalValueVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
      >
        <motion.h2 
          className="text-xl font-bold text-gray-100"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Sale Status
        </motion.h2>
        <div className="relative">
          <motion.select 
            value={selectedTimeframe}
            onChange={handleTimeframeChange}
            className="bg-gray-800 text-gray-200 rounded-lg pl-4 pr-10 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Yearly">Yearly</option>
          </motion.select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </motion.div>

      {/* Chart and Legend Container */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedTimeframe}
          className="flex items-center justify-center space-x-12"
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative w-48 h-48">
            <motion.svg 
              className="w-full h-full" 
              viewBox="0 0 200 200"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Background Track */}
              <motion.circle 
                cx="100" 
                cy="100" 
                r={radius} 
                fill="transparent" 
                stroke="#374151" 
                strokeWidth={strokeWidth}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              {/* Data Segments */}
              {currentData.map((item, index) => {
                const percentage = (item.value / totalValue) * 100;
                const arcLength = isNaN(percentage) ? 0 : (circumference * percentage) / 100;
                const rotation = (accumulatedPercentage / 100) * 360;
                accumulatedPercentage += percentage;

                return (
                  <motion.circle
                    key={`${selectedTimeframe}-${index}`}
                    cx="100" 
                    cy="100" 
                    r={radius} 
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={item.strokeColor}
                    strokeDasharray={circumference}
                    initial={{ 
                      strokeDashoffset: circumference,
                      rotate: rotation - 90
                    }}
                    animate={{ 
                      strokeDashoffset: circumference - arcLength + 1,
                      rotate: rotation - 90
                    }}
                    transition={{ 
                      duration: 1.2, 
                      ease: "easeOut",
                      delay: index * 0.2
                    }}
                    style={{
                      transformOrigin: '50% 50%',
                    }}
                  />
                );
              })}
            </motion.svg>
            
            {/* Center Total Value */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center"
              variants={totalValueVariants}
            >
              <motion.span 
                className="text-3xl font-bold text-white"
                key={`total-${selectedTimeframe}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.5
                }}
              >
                {isNaN(totalValue) ? 0 : totalValue}
              </motion.span>
              <motion.span 
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Total Sales
              </motion.span>
            </motion.div>
          </div>
          
          {/* Legend */}
          <motion.div 
            className="flex flex-col space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            {currentData.map((item, index) => (
              <motion.div 
                key={`${selectedTimeframe}-legend-${index}`}
                className="flex items-center space-x-3"
                variants={legendItemVariants}
                whileHover={{ 
                  scale: 1.05,
                  x: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.div 
                  className={`w-3 h-3 rounded-full ${item.bgColor}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    delay: 0.6 + index * 0.1
                  }}
                  whileHover={{ scale: 1.3 }}
                ></motion.div>
                <motion.span 
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  {item.name}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SaleStatusChart;