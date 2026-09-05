import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

type Event = {
  type: "Masterclass" | "Bootcamp";
  title: string;
  date: string;
  link: string;
  time: string;
};

// Dummy data for events
const dummyEvents: Record<string, Event[]> = {
  "2025-08-05": [
    {
      type: "Masterclass",
      title: "Advanced React Patterns",
      date: "2025-08-05T10:00:00",
      link: "https://meet.google.com/abc-defg-hij",
      time: "10:00 AM"
    }
  ],
  "2025-08-08": [
    {
      type: "Bootcamp",
      title: "JavaScript Fundamentals - Module 1",
      date: "2025-08-08T14:00:00",
      link: "https://zoom.us/j/123456789",
      time: "2:00 PM"
    }
  ],
  "2025-08-12": [
    {
      type: "Masterclass",
      title: "UI/UX Design Principles",
      date: "2025-08-12T11:30:00",
      link: "https://meet.google.com/xyz-uvwx-rst",
      time: "11:30 AM"
    },
    {
      type: "Bootcamp",
      title: "CSS Grid and Flexbox Workshop",
      date: "2025-08-12T15:00:00",
      link: "https://zoom.us/j/987654321",
      time: "3:00 PM"
    }
  ],
  "2025-08-15": [
    {
      type: "Bootcamp",
      title: "Node.js Backend Development",
      date: "2025-08-15T13:00:00",
      link: "https://teams.microsoft.com/l/meetup-join/xyz",
      time: "1:00 PM"
    }
  ],
  "2025-08-18": [
    {
      type: "Masterclass",
      title: "Database Design Best Practices",
      date: "2025-08-18T16:00:00",
      link: "https://meet.google.com/database-masterclass",
      time: "4:00 PM"
    }
  ],
  "2025-08-22": [
    {
      type: "Bootcamp",
      title: "React Testing with Jest & RTL",
      date: "2025-08-22T10:30:00",
      link: "https://zoom.us/j/testing-bootcamp",
      time: "10:30 AM"
    }
  ],
  "2025-08-25": [
    {
      type: "Masterclass",
      title: "Performance Optimization Techniques",
      date: "2025-08-25T14:30:00",
      link: "https://meet.google.com/perf-optimization",
      time: "2:30 PM"
    }
  ],
  "2025-08-28": [
    {
      type: "Bootcamp",
      title: "Full-Stack Project Workshop",
      date: "2025-08-28T09:00:00",
      link: "https://zoom.us/j/fullstack-workshop",
      time: "9:00 AM"
    }
  ],
  "2025-09-03": [
    {
      type: "Masterclass",
      title: "Advanced CSS Animations",
      date: "2025-09-03T11:00:00",
      link: "https://meet.google.com/css-animations",
      time: "11:00 AM"
    }
  ],
  "2025-09-07": [
    {
      type: "Bootcamp",
      title: "API Development with Express",
      date: "2025-09-07T14:30:00",
      link: "https://zoom.us/j/api-development",
      time: "2:30 PM"
    }
  ],
  "2025-09-10": [
    {
      type: "Masterclass",
      title: "GraphQL Deep Dive",
      date: "2025-09-10T10:00:00",
      link: "https://meet.google.com/graphql-deepdive",
      time: "10:00 AM"
    },
    {
      type: "Bootcamp",
      title: "MongoDB Fundamentals",
      date: "2025-09-10T16:00:00",
      link: "https://zoom.us/j/mongodb-fundamentals",
      time: "4:00 PM"
    }
  ],
  "2025-07-28": [
    {
      type: "Masterclass",
      title: "TypeScript Advanced Types",
      date: "2025-07-28T15:00:00",
      link: "https://meet.google.com/typescript-advanced",
      time: "3:00 PM"
    }
  ],
  "2025-07-31": [
    {
      type: "Bootcamp",
      title: "React Hooks Masterclass",
      date: "2025-07-31T13:00:00",
      link: "https://zoom.us/j/react-hooks",
      time: "1:00 PM"
    }
  ]
};

// Utility functions to replace date-fns
const addMonths = (date: Date, amount: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
};

const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  return new Date(result.setDate(diff));
};

const endOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() + (6 - day);
  return new Date(result.setDate(diff));
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

const isBefore = (date1: Date, date2: Date): boolean => {
  return date1.getTime() < date2.getTime();
};

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDate = (date: Date, formatStr: string): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthShort = months[date.getMonth()].slice(0, 3);
  const monthFull = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Simple format handling
  if (formatStr === "LLLL") return monthFull;
  if (formatStr === "yyyy-MM-dd") {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  }
  if (formatStr === "do LLLL, yyyy") {
    const ordinal = getOrdinal(day);
    return `${day}${ordinal} ${monthFull}, ${year}`;
  }
  
  return date.toDateString();
};

const getOrdinal = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const addDays = (date: Date, amount: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

function getEventDatesForMonth(
  events: Record<string, Event[]>,
  month: number,
  year: number
) {
  const masterclass: number[] = [];
  const bootcamp: number[] = [];

  Object.entries(events).forEach(([dateStr, eventArr]) => {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      if (date.getMonth() === month && date.getFullYear() === year) {
        const dayOfMonth = date.getDate();

        if (eventArr.some((e) => e.type === "Masterclass")) {
          if (!masterclass.includes(dayOfMonth)) {
            masterclass.push(dayOfMonth);
          }
        }
        if (eventArr.some((e) => e.type === "Bootcamp")) {
          if (!bootcamp.includes(dayOfMonth)) {
            bootcamp.push(dayOfMonth);
          }
        }
      }
    }
  });

  return { masterclass, bootcamp };
}

function getMonthMatrix(month: number, year: number) {
  const firstDay = startOfMonth(new Date(year, month));
  const lastDay = endOfMonth(firstDay);
  const startDate = startOfWeek(firstDay);
  const endDate = endOfWeek(lastDay);

  const matrix = [];
  let day = startDate;

  while (day <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(day));
      day = addDays(day, 1);
    }
    matrix.push(week);
  }

  return matrix;
}

const CalendarComponent = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(startOfDay(today));

  const navigateToPreviousMonth = () => {
    const prevDate = addMonths(new Date(currentYear, currentMonth), -1);
    setCurrentMonth(prevDate.getMonth());
    setCurrentYear(prevDate.getFullYear());
  };

  const navigateToNextMonth = () => {
    const nextDate = addMonths(new Date(currentYear, currentMonth), 1);
    setCurrentMonth(nextDate.getMonth());
    setCurrentYear(nextDate.getFullYear());
  };

  const monthMatrix = getMonthMatrix(currentMonth, currentYear);
  const monthName = formatDate(new Date(currentYear, currentMonth), "LLLL");
  const yearNum = currentYear;

  const { masterclass: masterclassDates, bootcamp: bootcampDates } =
    getEventDatesForMonth(dummyEvents, currentMonth, currentYear);

  const getDateKey = (date: Date): string =>
    formatDate(startOfDay(date), "yyyy-MM-dd");

  const getEventsForDate = (date: Date): Event[] => {
    const dateKey = getDateKey(date);
    const dayEvents = dummyEvents[dateKey] || [];

    return dayEvents.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col p-0 md:p-8">
      <div className="max-w-6xl mx-auto w-full rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden relative bg-white">
        <div className="flex-1 p-8 md:p-12 bg-gray-50 rounded-3xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              Calendar
            </h2>
          </div>
          <div
            className="bg-white rounded-2xl p-6 shadow-md"
            style={{ minWidth: 340 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {monthName}
                </div>
                <div className="text-gray-500 text-lg font-medium">
                  {yearNum}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full p-2 hover:bg-gray-100 text-gray-700 transition-colors"
                  onClick={navigateToPreviousMonth}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className="rounded-full p-2 hover:bg-gray-100 text-gray-700 transition-colors"
                  onClick={navigateToNextMonth}
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center mt-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (dayName, index) => (
                  <div
                    key={`day-${index}-${dayName}`}
                    className="text-gray-400 font-medium text-sm pb-2"
                  >
                    {dayName.charAt(0)}
                  </div>
                )
              )}
              {monthMatrix.map((week, weekIndex) =>
                week.map((date, dayIndex) => {
                  const isCurrentMonth = isSameMonth(
                    date,
                    new Date(currentYear, currentMonth)
                  );
                  const isSelected = isSameDay(date, selectedDate);
                  const isTodayDate = isToday(date);
                  const isPastDate = isBefore(
                    startOfDay(date),
                    startOfDay(today)
                  );

                  const dayEvents = getEventsForDate(date);
                  const hasMasterclass = dayEvents.some(
                    (e) => e.type === "Masterclass"
                  );
                  const hasBootcamp = dayEvents.some(
                    (e) => e.type === "Bootcamp"
                  );

                  let highlightClass = "";
                  let textClass = "";

                  if (hasBootcamp && hasMasterclass) {
                    highlightClass =
                      "bg-gradient-to-br from-purple-400 to-green-600 text-white";
                    textClass = "text-white font-semibold";
                  } else if (hasBootcamp) {
                    highlightClass = "bg-purple-400 text-white";
                    textClass = "text-white font-semibold";
                  } else if (hasMasterclass) {
                    highlightClass = "bg-green-600 text-white";
                    textClass = "text-white font-semibold";
                  } else if (isTodayDate && isCurrentMonth) {
                    highlightClass = "bg-blue-500 text-white";
                    textClass = "text-white font-semibold";
                  } else if (isCurrentMonth) {
                    textClass = isPastDate ? "text-gray-400" : "text-gray-700";
                  } else {
                    textClass = "text-gray-300";
                  }

                  return (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      className={`relative w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all duration-200 ${
                        isSelected ? "ring-2 ring-green-600 ring-offset-2" : ""
                      } ${highlightClass} ${textClass} ${
                        !highlightClass && isCurrentMonth && !isPastDate
                          ? "hover:bg-gray-100 hover:scale-110"
                          : highlightClass
                          ? "hover:scale-110 hover:shadow-lg"
                          : ""
                      }`}
                      onClick={() => setSelectedDate(startOfDay(date))}
                    >
                      {date.getDate()}
                    </button>
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6 items-center">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                Masterclass
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-400">
                <span className="w-3 h-3 rounded-full bg-purple-400 inline-block" />
                Bootcamp
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col gap-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl border-l border-gray-200 min-w-[340px] max-h-screen overflow-y-auto">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            {formatDate(selectedDate, "do LLLL, yyyy")}
            {isToday(selectedDate) && (
              <span className="text-blue-500 text-lg font-medium ml-2">
                (Today)
              </span>
            )}
          </div>

          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-center text-lg text-gray-400 font-medium py-12">
              {isBefore(selectedDate, startOfDay(today))
                ? "No classes were scheduled on this day."
                : isToday(selectedDate)
                ? "No classes scheduled for today. Enjoy your free time!"
                : "No classes scheduled on this day."}
            </div>
          ) : (
            <div className="space-y-4">
              {getEventsForDate(selectedDate).map(
                (event: Event, idx: number) => (
                  <Card
                    key={`${event.type}-${idx}`}
                    className={`border ${
                      event.type === "Masterclass"
                        ? "border-green-600 bg-green-50/30"
                        : "border-purple-400 bg-purple-50/30"
                    } shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            event.type === "Masterclass"
                              ? "text-green-600"
                              : "text-purple-400"
                          }`}
                        >
                          ●
                        </span>
                        {event.type === "Masterclass"
                          ? "Masterclass"
                          : "Bootcamp Class"}
                      </CardTitle>
                      <div className="text-sm text-gray-700 font-medium mt-1">
                        {event.title}
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 text-lg font-semibold text-gray-900">
                        <span>{event.time}</span>
                      </div>
                      <button
                        className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                          event.type === "Masterclass"
                            ? "border-green-600 text-green-700 bg-white hover:bg-green-50 hover:border-green-700"
                            : "border-purple-400 text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-500"
                        } ${
                          !event.link 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:shadow-md cursor-pointer"
                        }`}
                        disabled={!event.link}
                        onClick={() => event.link && window.open(event.link, '_blank', 'noopener,noreferrer')}
                      >
                        {event.link ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Join Meeting
                          </>
                        ) : (
                          <span className="text-gray-400">
                            Meeting link not available
                          </span>
                        )}
                      </button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;