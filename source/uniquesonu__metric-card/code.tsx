import React from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Main App component that renders the three metric cards
function StatsCard() {
  // Animation variants for the container grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the animation of child components
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 font-sans">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Productive Time Card */}
        <MetricCard
          title="Productive Time"
          value="12.4 hr"
          change="+23%"
          changeText="last week"
          isPositive={true}
          graphColor="stroke-blue-500" // Tailwind class for blue
          fillColor="fill-blue-100" // Tailwind class for light blue fill for the graph area
        />

        {/* Focused Time Card */}
        <MetricCard
          title="Focused Time"
          value="8.5 hr"
          change="+18%"
          changeText="last week"
          isPositive={true}
          graphColor="stroke-yellow-500" // Tailwind class for yellow
          fillColor="fill-yellow-100" // Tailwind class for light yellow fill
        />

        {/* Available Time Card */}
        <MetricCard
          title="Available Time" // Corrected title as it was "6.5 hr" previously
          value="6.5 hr"
          change="+15%"
          changeText="last week"
          isPositive={true}
          graphColor="stroke-sky-500" // Tailwind class for sky blue
          fillColor="fill-sky-100" // Tailwind class for light sky blue fill
        />
      </motion.div>
    </div>
  );
}

// Reusable MetricCard component
const MetricCard = ({ title, value, change, changeText, isPositive, graphColor, fillColor }) => {
  // Determine text color based on isPositive prop
  const textColorClass = isPositive ? 'text-green-500' : 'text-red-500';

  // Animation variants for individual cards
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring', // Use a spring animation for a bouncy effect
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Animation variants for the value (number counter effect)
  const valueVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2, // Delay the value animation slightly after the card appears
        duration: 0.5,
      },
    },
  };

  // Animation variants for the graph paths
  const graphVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5, // Animate path drawing over 1.5 seconds
        ease: 'easeInOut',
      },
    },
  };

  // Animation variants for the change text
  const changeTextVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5, // Delay the change text animation
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between"
      variants={cardVariants}
    >
      {/* Card Header */}
      <motion.div className="text-gray-500 text-sm mb-4" initial="hidden" animate="visible" variants={valueVariants}>
        {title} / Day
      </motion.div>

      {/* Main Value and Graph */}
      <div className="flex items-end justify-between mb-4">
        <motion.div
          className="text-4xl font-semibold text-gray-800"
          variants={valueVariants}
        >
          {value}
        </motion.div>
        {/* SVG for the graph - simplified to match the visual style */}
        <div className="w-24 h-12">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Graph area fill */}
            <motion.path
              d="M0 40 Q25 10 50 30 T100 20 L100 50 L0 50 Z"
              className={fillColor}
              fillOpacity="0.7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
            {/* Graph line */}
            <motion.path
              d="M0 40 Q25 10 50 30 T100 20"
              className={`${graphColor} stroke-2`}
              fill="none"
              variants={graphVariants}
            />
            {/* Percentage label on the graph line */}
            <motion.text
              x="90"
              y="15"
              className={`text-xs font-medium ${graphColor.replace('stroke', 'text')}`}
              textAnchor="end"
              variants={changeTextVariants}
            >
              {change.replace('+', '')}
            </motion.text>
          </svg>
        </div>
      </div>

      {/* Change Percentage */}
      <motion.div className="flex items-center text-sm" variants={changeTextVariants}>
        {/* Icon for change - using a simple checkmark for positive, could be an arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 mr-1 ${textColorClass}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          {isPositive ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
        <span className={`${textColorClass} font-medium`}>{change}</span>
        <span className="text-gray-500 ml-1">{changeText}</span>
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;