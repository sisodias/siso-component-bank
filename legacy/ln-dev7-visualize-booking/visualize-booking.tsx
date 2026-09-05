// component.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, Grid } from 'lucide-react';

export type DayType = {
  day: string;
  classNames: string;
  meetingInfo?: {
    date: string;
    time: string;
    title: string;
    participants: string[];
    location: string;
  }[];
};

interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
}

const Day: React.FC<DayProps> = ({ classNames, day, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <motion.div
        className={`relative flex items-center justify-center py-1 ${classNames}`}
        style={{ height: '4rem', borderRadius: 16 }}
        onMouseEnter={() => {
          setIsHovered(true);
          onHover(day.day);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onHover(null);
        }}
        id={`day-${day.day}`}
      >
        <motion.div className="flex flex-col items-center justify-center">
          {!(day.day[0] === '+' || day.day[0] === '-') && (
            <span className="text-sm text-white">{day.day}</span>
          )}
        </motion.div>
        {day.meetingInfo && (
          <motion.div
            className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-zinc-700 p-1 text-[10px] font-bold text-white"
            layoutId={`day-${day.day}-meeting-count`}
            style={{
              borderRadius: 999,
            }}
          >
            {day.meetingInfo.length}
          </motion.div>
        )}

        <AnimatePresence>
          {day.meetingInfo && isHovered && (
            <div className="absolute inset-0 flex size-full items-center justify-center">
              <motion.div
                className="flex size-10 items-center justify-center bg-zinc-700 p-1 text-xs font-bold text-white"
                layoutId={`day-${day.day}-meeting-count`}
                style={{
                  borderRadius: 999,
                }}
              >
                {day.meetingInfo.length}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const CalendarGrid: React.FC<{ onHover: (day: string | null) => void }> = ({
  onHover,
}) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {DAYS.map((day, index) => (
        <Day
          key={`${day.day}-${index}`}
          classNames={day.classNames}
          day={day}
          onHover={onHover}
        />
      ))}
    </div>
  );
};

const InteractiveCalendar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [moreView, setMoreView] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const handleDayHover = (day: string | null) => {
    setHoveredDay(day);
  };

  const sortedDays = React.useMemo(() => {
    if (!hoveredDay) return DAYS;
    return [...DAYS].sort((a, b) => {
      if (a.day === hoveredDay) return -1;
      if (b.day === hoveredDay) return 1;
      return 0;
    });
  }, [hoveredDay]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className="relative mx-auto my-10 flex w-full flex-col items-center justify-center gap-8 lg:flex-row"
        {...props}
      >
        <motion.div layout className="w-full max-w-lg">
          <motion.div
            key="calendar-view"
            className="flex w-full flex-col gap-4"
          >
            <div className="flex w-full items-center justify-between">
              <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-zinc-300">
                LN <span className="opacity-50">2024</span>
              </motion.h2>
              <motion.button
                className="relative flex items-center gap-3 rounded-lg border border-[#323232] px-1.5 py-1 text-[#323232]"
                onClick={() => setMoreView(!moreView)}
              >
                <Columns3 className="z-[2]" />
                <Grid className="z-[2]" />
                <div
                  className="absolute left-0 top-0 h-[85%] w-7 rounded-md bg-white transition-transform duration-300"
                  style={{
                    top: '50%',
                    transform: moreView
                      ? 'translateY(-50%) translateX(40px)'
                      : 'translateY(-50%) translateX(4px)',
                  }}
                ></div>
              </motion.button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="px-0/5 rounded-xl bg-[#323232] py-1 text-center text-xs text-white"
                >
                  {day}
                </div>
              ))}
            </div>
            <CalendarGrid onHover={handleDayHover} />
          </motion.div>
        </motion.div>
        {moreView && (
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              key="more-view"
              className="mt-4 flex w-full flex-col gap-4"
            >
              <div className="flex w-full flex-col items-start justify-between">
                <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-zinc-300">
                  Bookings
                </motion.h2>
                <p className="font-medium text-zinc-300/50">
                  See upcoming and past events booked through your event type
                  links.
                </p>
              </div>
              <motion.div
                className="flex h-[620px] flex-col items-start justify-start overflow-hidden overflow-y-scroll rounded-xl border-2 border-[#323232] shadow-md"
                layout
              >
                <AnimatePresence>
                  {sortedDays
                    .filter((day) => day.meetingInfo)
                    .map((day) => (
                      <motion.div
                        key={day.day}
                        className={`w-full border-b-2 border-[#323232] py-0 last:border-b-0`}
                        layout
                      >
                        {day.meetingInfo &&
                          day.meetingInfo.map((meeting, mIndex) => (
                            <motion.div
                              key={mIndex}
                              className="border-b border-[#323232] p-3 last:border-b-0"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                duration: 0.2,
                                delay: mIndex * 0.05,
                              }}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-white">
                                  {meeting.date}
                                </span>
                                <span className="text-sm text-white">
                                  {meeting.time}
                                </span>
                              </div>
                              <h3 className="mb-1 text-lg font-semibold text-white">
                                {meeting.title}
                              </h3>
                              <p className="mb-1 text-sm text-zinc-600">
                                {meeting.participants.join(', ')}
                              </p>
                              <div className="flex items-center text-blue-500">
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-sm">
                                  {meeting.location}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});
InteractiveCalendar.displayName = 'InteractiveCalendar';

export default InteractiveCalendar;

const DAYS: DayType[] = [
  { day: '-3', classNames: 'bg-zinc-700/20' },
  { day: '-2', classNames: 'bg-zinc-700/20' },
  { day: '-1', classNames: 'bg-zinc-700/20' },
  { day: '01', classNames: 'bg-[#1e1e1e]' },
  {
    day: '02',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Wed, 2 Nov',
        time: '10:00 AM - 11:00 AM',
        title: 'Design Review Meeting',
        participants: ['Alice Johnson', 'Mark Lee'],
        location: 'Zoom',
      },
      {
        date: 'Wed, 2 Nov',
        time: '1:00 PM - 2:00 PM',
        title: 'Sprint Planning',
        participants: ['Tom Hanks', 'Jessica White'],
        location: 'Google Meet',
      },
    ],
  },
  { day: '03', classNames: 'bg-[#1e1e1e]' },
  {
    day: '04',
    classNames: 'bg-zinc-700/20',
  },
  { day: '05', classNames: 'bg-zinc-700/20' },
  {
    day: '06',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Mon, 6 Nov',
        time: '10:00 AM - 11:00 AM',
        title: 'Brainstorming Session',
        participants: ['Sara Parker', 'Kumail Nanji'],
        location: 'Zoom',
      },
    ],
  },
  { day: '07', classNames: 'bg-[#1e1e1e]' },
  {
    day: '08',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Wed, 8 Nov',
        time: '2:00 PM - 3:00 PM',
        title: 'Strategy Meeting',
        participants: ['Robert Green', 'David Lee'],
        location: 'Google Meet',
      },
      {
        date: 'Wed, 8 Nov',
        time: '4:00 PM - 5:00 PM',
        title: 'Budget Review',
        participants: ['Jessica White', 'Tom Hanks'],
        location: 'Microsoft Teams',
      },
      {
        date: 'Wed, 8 Nov',
        time: '5:30 PM - 6:30 PM',
        title: 'Q&A Session',
        participants: ['Bob Smith', 'Emma Stone'],
        location: 'In-person',
      },
    ],
  },
  { day: '09', classNames: 'bg-[#1e1e1e]' },
  {
    day: '10',
    classNames: 'bg-[#1e1e1e]',
  },
  { day: '11', classNames: 'bg-zinc-700/20' },
  {
    day: '12',
    classNames: 'bg-zinc-700/20',
  },
  { day: '13', classNames: 'bg-[#1e1e1e]' },
  { day: '14', classNames: 'bg-[#1e1e1e]' },
  {
    day: '15',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Wed, 15 Nov',
        time: '9:00 AM - 10:00 AM',
        title: 'Client Feedback Session',
        participants: ['Sarah Parker', 'Kumail Nanji'],
        location: 'In-person at Office',
      },
    ],
  },
  { day: '16', classNames: 'bg-[#1e1e1e]' },
  {
    day: '17',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Fri, 17 Nov',
        time: '9:00 AM - 10:00 AM',
        title: 'Weekly Standup',
        participants: ['David Lee', 'Sophia Young'],
        location: 'Microsoft Teams',
      },
      {
        date: 'Fri, 17 Nov',
        time: '11:00 AM - 12:00 PM',
        title: 'Client Update',
        participants: ['Sara Parker', 'Kumail Nanji'],
        location: 'In-person',
      },
      {
        date: 'Fri, 17 Nov',
        time: '2:00 PM - 3:00 PM',
        title: 'Feature Demo',
        participants: ['Bob Smith', 'Emma Stone'],
        location: 'Zoom',
      },
      {
        date: 'Fri, 17 Nov',
        time: '4:00 PM - 5:00 PM',
        title: 'Feedback Session',
        participants: ['Mark Lee', 'Alice Johnson'],
        location: 'Google Meet',
      },
    ],
  },
  { day: '18', classNames: 'bg-zinc-700/20' },
  {
    day: '19',
    classNames: 'bg-zinc-700/20',
  },
  { day: '20', classNames: 'bg-[#1e1e1e]' },
  {
    day: '21',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Tue, 21 Nov',
        time: '11:00 AM - 12:00 PM',
        title: 'Product Launch',
        participants: ['Alice Johnson', 'Mark Lee'],
        location: 'Zoom',
      },
      {
        date: 'Tue, 21 Nov',
        time: '1:00 PM - 2:00 PM',
        title: 'Customer Feedback',
        participants: ['Sara Parker', 'Kumail Nanji'],
        location: 'Google Meet',
      },
      {
        date: 'Tue, 21 Nov',
        time: '3:00 PM - 4:00 PM',
        title: 'Design Iteration',
        participants: ['David Lee', 'Sophia Young'],
        location: 'In-person',
      },
      {
        date: 'Tue, 21 Nov',
        time: '5:00 PM - 6:00 PM',
        title: 'Team Celebration',
        participants: ['Bob Smith', 'Jessica White'],
        location: 'Office Rooftop',
      },
      {
        date: 'Tue, 21 Nov',
        time: '7:00 PM - 8:00 PM',
        title: 'Happy Hour',
        participants: ['Tom Hanks', 'Emma Stone'],
        location: 'Local Bar',
      },
    ],
  },
  { day: '22', classNames: 'bg-[#1e1e1e]' },
  { day: '23', classNames: 'bg-[#1e1e1e]' },
  {
    day: '24',
    classNames: 'bg-[#1e1e1e]',
  },
  { day: '25', classNames: 'bg-zinc-700/20' },
  { day: '26', classNames: 'bg-zinc-700/20' },
  {
    day: '27',
    classNames: 'bg-[#1e1e1e]',
  },
  { day: '28', classNames: 'bg-[#1e1e1e]' },
  {
    day: '29',
    classNames: 'bg-[#1e1e1e]',
  },
  {
    day: '30',
    classNames: 'bg-[#1e1e1e] cursor-pointer',
    meetingInfo: [
      {
        date: 'Thu, 30 Nov',
        time: '11:00 AM - 12:00 PM',
        title: 'Brainstorming Session',
        participants: ['David Lee', 'Sophia Young'],
        location: 'Zoom',
      },
    ],
  },
  { day: '+1', classNames: 'bg-zinc-700/20' },
  { day: '+2', classNames: 'bg-zinc-700/20' },
];

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];