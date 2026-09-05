import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Component() {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    const handleIncrement = (prev) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-32 h-32">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="8"
            className="drop-shadow-sm"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(79 70 229)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="drop-shadow-sm"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-indigo-600"
          >
            {value}%
          </motion.span>
        </div>
      </div>
    </div>
  );
}