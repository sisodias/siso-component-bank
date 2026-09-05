"use client"

import * as React from "react"
import { useState, useEffect } from "react"

interface GlassTimeCardProps {
  showSeconds?: boolean;
  showTimezone?: boolean;
}

export function GlassTimeCard(props: GlassTimeCardProps) {
  const { showSeconds = false, showTimezone = false } = props;
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timezoneName, setTimezoneName] = useState<string>("");
  
  useEffect(() => {
    const timezoneOffset = currentTime.getTimezoneOffset();
    
    const timezoneShorter = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const offset = -timezoneOffset / 60;
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
    
    setTimezoneName(`${timezoneShorter} GMT${offsetStr}`);
    
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: false
    });
  };
  
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[date.getDay()];
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    
    return `${weekday} | ${month} ${day}`;
  };

  return (
    <div className="w-80 text-white bg-neutral-white/20 shadow-xl backdrop-blur-xl p-4 rounded-lg border border-white/10">
      <div className="flex flex-col gap-1 items-center">
        <div className="text-sm">{formatDate(currentTime)}</div>
        <div className="text-5xl font-bold tabular-nums">{formatTime(currentTime)}</div>
        {showTimezone && (
          <div className="text-xs text-muted">{timezoneName}</div>
        )}
      </div>
    </div>
  )
}