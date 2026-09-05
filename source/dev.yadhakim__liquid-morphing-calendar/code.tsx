'use client';

import React, { useState, useRef } from 'react';
import '../../index.css';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  category: 'work' | 'personal' | 'travel' | 'health';
}

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Design Sprint Workshop',
    startDate: new Date(2026, 1, 5),
    endDate: new Date(2026, 1, 5),
    color: '#FF6B9D',
    category: 'work'
  },
  {
    id: '2',
    title: 'Bali Retreat',
    startDate: new Date(2026, 1, 12),
    endDate: new Date(2026, 1, 19),
    color: '#4ECDC4',
    category: 'travel'
  },
  {
    id: '3',
    title: 'Product Launch',
    startDate: new Date(2026, 1, 20),
    endDate: new Date(2026, 1, 20),
    color: '#FFE66D',
    category: 'work'
  },
  {
    id: '4',
    title: 'Yoga Challenge',
    startDate: new Date(2026, 1, 1),
    endDate: new Date(2026, 1, 28),
    color: '#A8E6CF',
    category: 'health'
  },
  {
    id: '5',
    title: 'Client Meeting',
    startDate: new Date(2026, 1, 14),
    endDate: new Date(2026, 1, 14),
    color: '#C7CEEA',
    category: 'work'
  },
  {
    id: '6',
    title: 'Birthday Party',
    startDate: new Date(2026, 1, 22),
    endDate: new Date(2026, 1, 22),
    color: '#FFDAC1',
    category: 'personal'
  }
];

export default function LiquidCalendar() {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateInRange = (date: Date, start: Date, end: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return d >= s && d <= e;
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return SAMPLE_EVENTS.filter(event => 
      isDateInRange(date, event.startDate, event.endDate)
    );
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDay(day);
      const isToday = isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day));

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${hoveredDay === day ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          <div className="day-number">{day}</div>
          
          {events.length > 0 && (
            <div className="day-events">
              {events.slice(0, 3).map((event, idx) => (
                <div
                  key={event.id}
                  className="event-blob"
                  style={{
                    backgroundColor: event.color,
                    animationDelay: `${idx * 0.1}s`
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <span className="event-title">{event.title}</span>
                </div>
              ))}
              {events.length > 3 && (
                <div className="more-events">+{events.length - 3} more</div>
              )}
            </div>
          )}

          {/* Organic blob background on hover */}
          {hoveredDay === day && (
            <div className="day-blob-bg" />
          )}
        </div>
      );
    }

    return days;
  };

  const renderYearView = () => {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentDate.getFullYear(), month, 1);
      const daysInMonth = getDaysInMonth(monthDate);
      const firstDay = getFirstDayOfMonth(monthDate);
      
      months.push(
        <div key={month} className="year-month">
          <div className="year-month-header">
            <h3>{monthNames[month]}</h3>
          </div>
          <div className="year-month-grid">
            <div className="weekday-labels-mini">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="weekday-mini">{day}</div>
              ))}
            </div>
            <div className="days-grid-mini">
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="mini-day empty" />
              ))}
              {Array(daysInMonth).fill(null).map((_, day) => {
                const date = new Date(currentDate.getFullYear(), month, day + 1);
                const events = SAMPLE_EVENTS.filter(event => 
                  isDateInRange(date, event.startDate, event.endDate)
                );
                const hasEvents = events.length > 0;
                
                return (
                  <div 
                    key={day}
                    className={`mini-day ${hasEvents ? 'has-events' : ''}`}
                    onClick={() => {
                      setCurrentDate(date);
                      setViewMode('month');
                    }}
                  >
                    {day + 1}
                    {hasEvents && (
                      <div className="mini-event-indicator" style={{ backgroundColor: events[0].color }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    
    return months;
  };

  return (
    <div className="liquid-calendar-container">
      {/* Animated background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="calendar-wrapper" ref={calendarRef}>
        {/* Header */}
        <div className="calendar-header">
          <div className="header-left">
            <h1 className="calendar-title">
              {viewMode === 'month' 
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : currentDate.getFullYear()
              }
            </h1>
            <p className="calendar-subtitle">Your liquid schedule</p>
          </div>

          <div className="header-controls">
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
              <button
                className={`toggle-btn ${viewMode === 'year' ? 'active' : ''}`}
                onClick={() => setViewMode('year')}
              >
                Year
              </button>
              <div className="toggle-slider" style={{ transform: viewMode === 'year' ? 'translateX(100%)' : 'translateX(0)' }} />
            </div>

            {viewMode === 'month' && (
              <div className="nav-buttons">
                <button className="nav-btn" onClick={prevMonth}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="nav-btn" onClick={nextMonth}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'month' ? (
          <>
            <div className="weekday-labels">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                <div key={i} className="weekday-label">{day}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {renderMonthView()}
            </div>
          </>
        ) : (
          <div className="year-grid">
            {renderYearView()}
          </div>
        )}

        {/* Event Detail Popup */}
        {selectedEvent && (
          <div className="event-popup" onClick={() => setSelectedEvent(null)}>
            <div className="event-popup-content" onClick={(e) => e.stopPropagation()}>
              <div className="popup-blob" style={{ backgroundColor: selectedEvent.color }} />
              <button className="close-popup" onClick={() => setSelectedEvent(null)}>×</button>
              <div className="popup-badge">{selectedEvent.category}</div>
              <h3>{selectedEvent.title}</h3>
              <p className="popup-dates">
                {selectedEvent.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                {!isSameDay(selectedEvent.startDate, selectedEvent.endDate) && (
                  <> - {selectedEvent.endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-blob" style={{ backgroundColor: '#FF6B9D' }} />
          <span>Work</span>
        </div>
        <div className="legend-item">
          <div className="legend-blob" style={{ backgroundColor: '#4ECDC4' }} />
          <span>Travel</span>
        </div>
        <div className="legend-item">
          <div className="legend-blob" style={{ backgroundColor: '#A8E6CF' }} />
          <span>Health</span>
        </div>
        <div className="legend-item">
          <div className="legend-blob" style={{ backgroundColor: '#FFE66D' }} />
          <span>Events</span>
        </div>
      </div>
    </div>
  );
}