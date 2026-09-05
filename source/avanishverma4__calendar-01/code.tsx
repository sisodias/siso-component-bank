import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sun, Moon, Info } from 'lucide-react';

const PremiumCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [isDark, setIsDark] = useState(true);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: clickedDate, end: null });
    } else {
      if (clickedDate < selectedRange.start) {
        setSelectedRange({ start: clickedDate, end: selectedRange.start });
      } else {
        setSelectedRange({ ...selectedRange, end: clickedDate });
      }
    }
  };

  const isInRange = (day: number) => {
    if (!selectedRange.start) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (selectedRange.end) {
      return date >= selectedRange.start && date <= selectedRange.end;
    }
    
    if (hoverDate && hoverDate > selectedRange.start) {
      return date >= selectedRange.start && date <= hoverDate;
    }
    
    return false;
  };

  const isSelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (selectedRange.start && date.toDateString() === selectedRange.start.toDateString()) ||
           (selectedRange.end && date.toDateString() === selectedRange.end.toDateString());
  };

  const isSunday = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.getDay() === 0;
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const bgClass = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-900/80' : 'bg-white/80';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`w-full min-h-screen ${bgClass} transition-colors duration-500 relative overflow-hidden`}>
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 gap-6 sm:gap-8">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full ${cardBg} backdrop-blur-xl border ${borderColor} shadow-2xl`}
        >
          {isDark ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />}
        </motion.button>

        {/* Calendar */}
        <motion.div
          whileHover={{ rotateX: 5, rotateY: 5, scale: 1.01 }}
          className={`w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${cardBg} backdrop-blur-xl border ${borderColor} shadow-2xl`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevMonth}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ChevronLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${textPrimary}`} />
            </motion.button>
            
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${textPrimary}`}>{monthYear}</h2>
            
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ChevronRight className={`w-5 h-5 sm:w-6 sm:h-6 ${textPrimary}`} />
            </motion.button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div
                key={day}
                className={`text-center text-xs sm:text-sm font-semibold py-1 sm:py-2 ${idx === 0 ? 'text-red-500' : textSecondary}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const inRange = isInRange(day);
              const selected = isSelected(day);
              const sunday = isSunday(day);
              const today = isToday(day);
              
              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => {
                    if (selectedRange.start && !selectedRange.end) {
                      setHoverDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                    }
                  }}
                  onMouseLeave={() => setHoverDate(null)}
                  className={`
                    aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-medium transition-all
                    ${selected 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' 
                      : today
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 ring-2 ring-green-400'
                      : inRange
                      ? isDark ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-500/20 text-blue-700'
                      : sunday
                      ? isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-500/10'
                      : isDark 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {day}
                </motion.button>
              );
            })}
          </div>

          {/* Selected Range Display */}
          {(selectedRange.start || selectedRange.end) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}
            >
              <p className={`text-xs sm:text-sm ${textSecondary} mb-1`}>Selected Range:</p>
              <p className={`text-sm sm:text-base font-semibold ${textPrimary}`}>
                {selectedRange.start?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {selectedRange.end && ` - ${selectedRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Pro Tip */}
        <motion.div
          whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
          className={`w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${cardBg} backdrop-blur-xl border ${borderColor} shadow-2xl`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
              <Info className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${textPrimary}`}>Pro Tip: Range Selection</h3>
              <p className={`text-xs sm:text-sm ${textSecondary}`}>
                Click on any date to start your selection, then click another date to complete the range. 
                Sundays are highlighted in red. Hover over dates to preview your selection range.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumCalendar;
