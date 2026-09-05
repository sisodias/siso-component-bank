import React from 'react';
import { motion } from 'framer-motion';

// Component for a single animated bar in the chart
const ChartBar = ({ day, sale, maxSale, highlight, index }) => {
  const barHeight = sale > 0 ? (sale / maxSale) * 100 : 0;

  // Animation variants for the bar
  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: `${barHeight}%`,
      opacity: 1,
      transition: {
        delay: 0.5 + index * 0.1, // Stagger the animation of each bar
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 h-full">
      <div className="w-8 h-full flex items-end bg-gray-700/50 rounded-md overflow-hidden">
        <motion.div
          className={`w-full rounded-md ${highlight ? 'bg-red-500' : 'bg-purple-500'}`}
          variants={barVariants}
          initial="hidden"
          animate="visible"
        />
      </div>
      <p className="text-sm text-gray-400 font-medium">{day}</p>
    </div>
  );
};

// Main Daily Sale Chart Component
const DailySaleChart = () => {
  const salesData = [
    { day: 'SA', sale: 1900 },
    { day: 'SU', sale: 2400 },
    { day: 'MO', sale: 900 },
    { day: 'TU', sale: 2750, highlight: true },
    { day: 'WE', sale: 1600 },
    { day: 'TH', sale: 1000 },
    { day: 'FR', sale: 2150 },
  ];

  const maxSale = 3000;

  const yAxisLabels = ['3K', '2K', '1K', '0K'];

  return (
    <div className="bg-[#2c2c38] p-6 rounded-2xl shadow-lg w-full max-w-md text-white font-sans">
      <motion.h3
        className="text-lg font-semibold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Daily Sale
      </motion.h3>

      <div className="flex gap-4 h-52">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-full text-sm text-gray-400">
          {yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart Bars */}
        <div className="flex-1 grid grid-cols-7 gap-4 items-end h-full border-l border-gray-700 pl-4">
          {salesData.map((data, index) => (
            <ChartBar
              key={data.day}
              day={data.day}
              sale={data.sale}
              maxSale={maxSale}
              highlight={data.highlight}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailySaleChart;