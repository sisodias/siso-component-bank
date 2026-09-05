import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Clock, RefreshCw, MapPin, Globe, Calendar, LayoutGrid, LayoutList } from 'lucide-react';

interface BookingCalendarProps {
  userName: string;
  eventTitle: string;
  eventDescription: string;
  durations: string[];
  locationOptions: number;
  timezone: string;
  recurrence?: {
    interval: string;
    count: number;
  };
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  userName,
  eventTitle,
  eventDescription,
  durations,
  locationOptions,
  timezone,
  recurrence
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1));
  const [selectedDate, setSelectedDate] = useState(25);
  const [viewMode, setViewMode] = useState<'12h' | '24h'>('12h');

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const timeSlots = [
    '9:00am', '10:00am', '11:00am', '12:00pm', 
    '1:00pm', '2:00pm', '3:00pm', '4:00pm'
  ];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
      <div className="max-w-[1400px] mx-auto">
        {/* Top Navigation */}
        <div className="flex justify-end mb-6 gap-2">
          <Button variant="default" className="bg-foreground hover:bg-foreground/90 text-background rounded-lg h-9 px-4 font-medium">
            Need help?
          </Button>
          <Button variant="outline" size="icon" className="rounded-lg h-9 w-9 border-border bg-card hover:bg-accent">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-lg h-9 w-9 border-border bg-card hover:bg-accent">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-lg h-9 w-9 border-border bg-card hover:bg-accent">
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5 items-start">
          {/* Left Panel - Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full lg:col-span-2"
          >
            <Card className="p-6 bg-card rounded-2xl shadow-lg border-0 h-full">
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-10 w-10 bg-foreground text-background">
                  <AvatarFallback className="text-sm font-semibold">A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{userName}</p>
                </div>
              </div>

              <h2 className="text-[21px] font-semibold mb-4 leading-tight text-foreground">
                {eventTitle}
              </h2>

              <p className="text-[13px] text-muted-foreground mb-8 leading-relaxed">
                {eventDescription}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-[18px] w-[18px] text-muted-foreground mt-[2px] flex-shrink-0" />
                  <div className="flex flex-wrap gap-2 items-center">
                    {durations.map((duration, index) => (
                      <Button
                        key={index}
                        variant={index === 0 ? "secondary" : "outline"}
                        size="sm"
                        className="rounded-lg text-xs h-8 px-3.5 border-border font-medium"
                      >
                        {duration}
                      </Button>
                    ))}
                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 hover:bg-accent">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {recurrence && (
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-[18px] w-[18px] text-muted-foreground mt-[2px] flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-wrap text-sm text-foreground">
                      <span>Every week for</span>
                      <div className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 h-7 text-sm font-medium">
                        {recurrence.count}
                      </div>
                      <span>occurrences</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{locationOptions} location options</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
                  <Button variant="ghost" className="text-sm p-0 h-auto hover:bg-transparent text-foreground font-normal justify-start -ml-1">
                    {timezone}
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Center Panel - Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full lg:col-span-2"
          >
            <Card className="p-8 bg-card rounded-2xl shadow-lg border-0">
              <div className="flex items-center justify-between mb-7">
                <h3 className="text-[17px] font-semibold text-foreground">{monthYear}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMonth}
                    className="h-8 w-8 rounded-lg hover:bg-accent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextMonth}
                    className="h-8 w-8 rounded-lg hover:bg-accent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-semibold text-muted-foreground/70 py-2 tracking-wide"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth().map((day, index) => (
                  <motion.button
                    key={index}
                    whileHover={day ? { scale: 1.05 } : {}}
                    whileTap={day ? { scale: 0.95 } : {}}
                    onClick={() => day && setSelectedDate(day)}
                    disabled={!day}
                    className={`
                      aspect-square flex items-center justify-center rounded-xl text-[14px] font-medium
                      transition-all duration-200
                      ${!day ? 'invisible' : ''}
                      ${day === selectedDate
                        ? 'bg-foreground text-background shadow-md scale-[1.02]'
                        : day && [28, 29, 30].includes(day)
                        ? 'bg-accent/70 text-foreground hover:bg-accent'
                        : 'text-foreground hover:bg-accent/50'
                      }
                    `}
                  >
                    {day}
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Panel - Time Slots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full md:col-span-2 lg:col-span-1"
          >
            <Card className="p-6 bg-card rounded-2xl shadow-lg border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground text-[15px]">Fri {selectedDate}</h3>
                <div className="flex gap-0.5 bg-accent/80 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('12h')}
                    className={`h-7 px-3.5 text-xs rounded-md font-medium transition-all ${
                      viewMode === '12h' 
                        ? 'bg-background shadow-sm' 
                        : 'hover:bg-background/50'
                    }`}
                  >
                    12h
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('24h')}
                    className={`h-7 px-3.5 text-xs rounded-md font-medium transition-all ${
                      viewMode === '24h' 
                        ? 'bg-background shadow-sm' 
                        : 'hover:bg-background/50'
                    }`}
                  >
                    24h
                  </Button>
                </div>
              </div>

              <div className="space-y-2.5">
                {timeSlots.map((time, index) => (
                  <motion.button
                    key={time}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-accent/30 transition-all duration-200 bg-background/50 group"
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[13.5px] text-foreground font-medium">{time}</span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm font-bold text-foreground/80">Cal.com</p>
        </div>
      </div>
  );
};

export default BookingCalendar;