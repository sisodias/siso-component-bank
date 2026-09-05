import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 18)); // October 18, 2025
  const [isDark, setIsDark] = useState(true);
  const [direction, setDirection] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 18));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const changeMonth = (increment) => {
    setDirection(increment);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const changeYear = (increment) => {
    setDirection(increment);
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date(2025, 9, 18); // October 18, 2025

  const isToday = (date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isSunday = (date) => {
    return date.getDay() === 0;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0
    })
  };

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-300 relative overflow-hidden`}>
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-8 right-8 p-3 rounded-full ${
          isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
        } backdrop-blur-sm z-10`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* Calendar Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md rounded-3xl p-8 ${
            isDark ? 'bg-zinc-900/50' : 'bg-white/50'
          } backdrop-blur-xl border ${
            isDark ? 'border-white/10' : 'border-black/10'
          } shadow-2xl relative z-10`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => changeMonth(-1)}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'
              } transition-colors`}
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="flex gap-4">
              <motion.select
                whileHover={{ scale: 1.02 }}
                value={currentDate.getMonth()}
                onChange={(e) => {
                  setDirection(1);
                  setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
                }}
                className={`px-6 py-2 rounded-xl text-base font-medium ${
                  isDark ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-black'
                } border ${
                  isDark ? 'border-zinc-700' : 'border-gray-300'
                } cursor-pointer outline-none`}
              >
                {months.map((month, idx) => (
                  <option key={month} value={idx} className={isDark ? 'bg-zinc-900' : 'bg-white'}>
                    {month}
                  </option>
                ))}
              </motion.select>

              <motion.select
                whileHover={{ scale: 1.02 }}
                value={currentDate.getFullYear()}
                onChange={(e) => {
                  setDirection(1);
                  setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
                }}
                className={`px-6 py-2 rounded-xl text-base font-medium ${
                  isDark ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-black'
                } border ${
                  isDark ? 'border-zinc-700' : 'border-gray-300'
                } cursor-pointer outline-none`}
              >
                {[2023, 2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year} className={isDark ? 'bg-zinc-900' : 'bg-white'}>
                    {year}
                  </option>
                ))}
              </motion.select>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => changeMonth(1)}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/10 text-black'
              } transition-colors`}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={`text-center text-sm font-semibold py-2 ${
                  idx === 0
                    ? 'text-red-500'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="grid grid-cols-7 gap-2"
            >
              {days.map((dayInfo, idx) => {
                const isCurrentDay = isToday(dayInfo.date);
                const isSun = isSunday(dayInfo.date);
                const isSelectedDay = isSelected(dayInfo.date);

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(dayInfo.date)}
                    className={`
                      aspect-square rounded-2xl flex items-center justify-center text-base font-medium
                      transition-all relative
                      ${!dayInfo.isCurrentMonth && (isDark ? 'text-gray-700' : 'text-gray-300')}
                      ${dayInfo.isCurrentMonth && !isSun && !isSelectedDay && !isCurrentDay && (isDark ? 'text-white' : 'text-black')}
                      ${dayInfo.isCurrentMonth && isSun && !isSelectedDay && !isCurrentDay && 'text-red-500'}
                      ${isCurrentDay && !isSelectedDay && (isDark ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-black')}
                      ${isCurrentDay && isSun && !isSelectedDay && (isDark ? 'bg-zinc-800 text-red-500' : 'bg-gray-200 text-red-500')}
                      ${isSelectedDay && (isDark ? 'bg-white text-black' : 'bg-black text-white')}
                      ${!isSelectedDay && !isCurrentDay && (isDark ? 'hover:bg-white/10' : 'hover:bg-black/10')}
                    `}
                  >
                    {dayInfo.day}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;
