import React, { useState, useEffect } from 'react';

// SVG Icon for the Stop button
const StopIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-white"
  >
    <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="white" strokeWidth="2" />
  </svg>
);

// Main App Component
export function Component() {
  // State to hold the current time. Initialized to 6:00 for visual consistency.
  const [time, setTime] = useState(() => {
    const initialTime = new Date();
    initialTime.setHours(6, 0, 0);
    return initialTime;
  });

  // State to manage the alarm status
  const [alarmState, setAlarmState] = useState('ringing');
  // State for the greeting message
  const [greeting, setGreeting] = useState('Morning Nata,');
  const [subGreeting, setSubGreeting] = useState('Rise and shine!');

  // Effect to update the time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  // Function to format time with leading zeros
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Handler for the Snooze button
  const handleSnooze = () => {
    setAlarmState('snoozed');
    setGreeting('Snoozed...');
    setSubGreeting('Just a few more minutes.');
  };

  // Handler for the Stop button
  const handleStop = () => {
    setAlarmState('stopped');
    setGreeting('Alarm Stopped');
    setSubGreeting('Have a great day!');
  };
  
  const timeString = formatTime(time);
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=2070&auto=format&fit=crop';


  return (
    <div 
        className="relative flex items-center justify-center w-full h-screen font-sans text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      
      {/* Overlay to darken the background image slightly for better text contrast */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full max-w-md h-[85vh] sm:h-[75vh] p-8 text-center">
        
        {/* Greeting Text */}
        <div className={`transition-opacity duration-700 ${alarmState === 'stopped' ? 'opacity-70' : 'opacity-100'}`}>
          <h1 className="text-4xl font-light tracking-wide text-shadow-md">{greeting}</h1>
          <p className="text-4xl font-light tracking-wide text-shadow-md">{subGreeting}</p>
        </div>

        {/* Liquid Glass Clock Display */}
        <div className="relative w-full">
            {/* Background for unlit segments */}
            <p 
                className="absolute inset-0 flex items-center justify-center w-full text-[100px] sm:text-[120px] font-digital text-white opacity-10 select-none"
                aria-hidden="true"
            >
                88:88
            </p>
            {/* Actual time in the liquid glass panel */}
            <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-t border-l border-white/25 transition-opacity duration-700 ${alarmState === 'snoozed' ? 'opacity-40' : 'opacity-100'}`}>
                 <p className="py-2 text-[100px] sm:text-[120px] font-digital text-shadow-lg">
                    {timeString}
                </p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center justify-between w-full transition-opacity duration-700 ${alarmState === 'stopped' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Snooze Button */}
          <button
            onClick={handleSnooze}
            className="px-12 py-4 text-xl font-normal bg-white/15 backdrop-blur-lg rounded-full shadow-lg border-t border-l border-white/20 transition-all duration-300 hover:bg-white/25 active:scale-95"
          >
            Snooze
          </button>

          {/* Stop Button */}
          <div className="flex items-center space-x-4">
            <span className="text-xl font-normal">Stop</span>
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-lg rounded-full shadow-lg border-t border-l border-white/20 transition-all duration-300 hover:bg-white/25 active:scale-95"
            >
              <StopIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
