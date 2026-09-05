import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = () => {
  const [isDark, setIsDark] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return 'Select a date';
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255, 100, 50, 0.1)' : 'rgba(255, 100, 50, 0.15)'}
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
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-colors z-50 ${
          isDark 
            ? 'bg-gray-800 text-amber-400 hover:bg-gray-700' 
            : 'bg-white text-orange-500 hover:bg-gray-100'
        }`}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </motion.div>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent`}>
              Date Picker
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Select your perfect date with style
            </p>
          </motion.div>

          {/* Date Picker Trigger */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full p-4 rounded-xl shadow-xl transition-all flex items-center justify-between ${
              isDark
                ? 'bg-gray-800 text-white hover:bg-gray-750'
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-orange-500" size={24} />
              <span className={selectedDate ? '' : 'opacity-60'}>
                {formatDate(selectedDate)}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="text-orange-500" size={20} />
            </motion.div>
          </motion.button>

          {/* Calendar Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-6 rounded-xl shadow-2xl ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextMonth}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className={`text-center text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => (
                    <motion.button
                      key={index}
                      whileHover={date ? { scale: 1.1 } : {}}
                      whileTap={date ? { scale: 0.95 } : {}}
                      onClick={() => date && handleDateSelect(date)}
                      disabled={!date}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all
                        ${!date ? 'invisible' : ''}
                        ${isSelected(date)
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg'
                          : isToday(date)
                          ? isDark
                            ? 'bg-gray-700 text-orange-400 ring-2 ring-orange-500'
                            : 'bg-orange-50 text-orange-600 ring-2 ring-orange-400'
                          : isDark
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {date && date.getDate()}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`mt-6 p-4 rounded-lg border ${
              isDark 
                ? 'bg-gray-800/50 border-orange-500/30 text-gray-300' 
                : 'bg-orange-50/50 border-orange-300 text-gray-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-orange-500 text-xl">💡</span>
              <div>
                <p className="text-sm font-medium mb-1">Pro Tip:</p>
                <p className="text-xs opacity-80">
                  Today's date is highlighted with a ring. Click any date to select it, and use the arrows to navigate between months.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
