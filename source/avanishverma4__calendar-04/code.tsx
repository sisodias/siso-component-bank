import React from "react";
import { Settings, Plus, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Day {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
}

interface GlassCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

// Date utility functions
const formatDate = (date: Date, format: string): string => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  
  return format
    .replace("MMMM", months[month])
    .replace("MMM", monthsShort[month])
    .replace("yyyy", String(year))
    .replace("EEEE", days[dayOfWeek])
    .replace("EEE", daysShort[dayOfWeek])
    .replace("d", String(day));
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getDay = (date: Date): number => {
  return date.getDay();
};

const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const subMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};

// --- HELPER TO HIDE SCROLLBAR ---
const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .shimmer {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      background-size: 1000px 100%;
      animation: shimmer 3s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
);

// --- MAIN COMPONENT ---
export default function GlassCalendar({ 
  selectedDate: propSelectedDate, 
  onDateSelect,
  className = ""
}: GlassCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(propSelectedDate || new Date());
  const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || new Date());
  const [view, setView] = React.useState<"week" | "month">("month");
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Generate calendar grid (including padding days)
  const calendarDays = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const totalDays = getDaysInMonth(currentMonth);
    const startDay = getDay(start);
    const days: (Day | null)[] = [];
    
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
      days.push({
        date,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
        isCurrentMonth: true
      });
    }
    
    return days;
  }, [currentMonth, selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };
  
  const handlePrevMonth = () => {
    setIsAnimating(true);
    setCurrentMonth(subMonths(currentMonth, 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNextMonth = () => {
    setIsAnimating(true);
    setCurrentMonth(addMonths(currentMonth, 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center p-4 relative"
      style={{ 
        backgroundColor: '#fce7f3'
      }}
    >
      {/* Gradient Grid Background */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(236, 72, 153, 0.4) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(236, 72, 153, 0.4) 1px, transparent 1px),
          linear-gradient(to right, rgba(251, 146, 60, 0.4) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(251, 146, 60, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px, 80px 80px, 40px 40px, 40px 40px',
        backgroundPosition: '0 0, 0 0, 40px 40px, 40px 40px'
      }} />
      <ScrollbarHide />
      
      <div className={`w-full max-w-md ${className}`}>
        {/* Main Glass Card */}
        <div className="rounded-3xl p-6 shadow-2xl backdrop-blur-xl bg-white/40 border border-white/60 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
          
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 shimmer pointer-events-none" />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-3xl shadow-inner pointer-events-none" style={{
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.05)'
          }} />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gray-100 backdrop-blur-sm">
                  <Calendar className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Calendar</h2>
                  <p className="text-xs text-gray-600">Friday, Nov 7</p>
                </div>
              </div>
              
              <button className="p-2.5 rounded-xl bg-gray-100 backdrop-blur-sm hover:bg-gray-200 transition-all duration-200 text-gray-700 hover:text-gray-900">
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {formatDate(currentMonth, "MMMM")}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{formatDate(currentMonth, "yyyy")}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg bg-gray-100 backdrop-blur-sm hover:bg-gray-200 transition-all duration-200 text-gray-700 hover:text-gray-900 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg bg-gray-100 backdrop-blur-sm hover:bg-gray-200 transition-all duration-200 text-gray-700 hover:text-gray-900 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 mb-6 p-1 rounded-xl bg-gray-100 backdrop-blur-sm">
              <button 
                onClick={() => setView("week")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  view === "week" 
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg scale-105" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setView("month")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  view === "month" 
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg scale-105" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Month
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {weekDays.map((day) => (
                  <div key={day} className="text-center">
                    <span className="text-xs font-bold text-gray-500">{day.slice(0, 1)}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className={`grid grid-cols-7 gap-2 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }
                  
                  const dateStr = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateClick(day.date)}
                      className={`
                        aspect-square rounded-xl text-sm font-semibold transition-all duration-200 relative
                        flex items-center justify-center group
                        ${day.isSelected 
                          ? "bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/50 scale-110 z-10" 
                          : "hover:bg-gray-100 text-gray-900 hover:scale-105"
                        }
                      `}
                    >
                      {day.isToday && !day.isSelected && (
                        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 animate-pulse"></span>
                      )}
                      <span className={day.isSelected ? "" : "group-hover:scale-110 transition-transform"}>
                        {day.date.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-5" />

            {/* Event Summary Card */}
            <div className="rounded-2xl p-4 mb-4 bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Today's Schedule</span>
                </div>
                <span className="text-xs text-gray-500">3 events</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-gray-100">
                  <div className="h-2 w-2 rounded-full bg-rose-400"></div>
                  <span className="text-xs text-gray-700 flex-1">Team Meeting</span>
                  <span className="text-xs text-gray-500">10:00 AM</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-white border border-gray-100">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <span className="text-xs text-gray-700 flex-1">Design Review</span>
                  <span className="text-xs text-gray-500">2:30 PM</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/40 active:scale-[0.98] flex items-center justify-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}