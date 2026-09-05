import { useState, useEffect } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate rotation angles
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  // Generate hour numbers
  const hourNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minute markers
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="relative">
        {/* Clock Face */}
        <div className="relative w-80 h-80 bg-slate-800 rounded-full shadow-2xl border-4 border-slate-600">
          
          {/* Hour Numbers */}
          {hourNumbers.map((num) => {
            const angle = (num * 30) - 90;
            const x = Math.cos(angle * Math.PI / 180) * 120;
            const y = Math.sin(angle * Math.PI / 180) * 120;
            
            return (
              <div
                key={num}
                className="absolute w-8 h-8 flex items-center justify-center text-emerald-400 font-bold text-lg"
                style={{
                  left: `calc(50% + ${x}px - 16px)`,
                  top: `calc(50% + ${y}px - 16px)`,
                }}
              >
                {num}
              </div>
            );
          })}

          {/* Minute Markers */}
          {minuteMarkers.map((marker) => {
            const angle = (marker * 6) - 90;
            const isHourMarker = marker % 5 === 0;
            const radius = isHourMarker ? 140 : 145;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <div
                key={marker}
                className={`absolute rounded-full bg-emerald-400 ${
                  isHourMarker ? 'w-1 h-4' : 'w-0.5 h-2'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}

          {/* Clock Hands */}
          
          {/* Hour Hand */}
          <div
            className="absolute w-1 bg-emerald-400 rounded-full origin-bottom shadow-lg"
            style={{
              height: '70px',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            }}
          />

          {/* Minute Hand */}
          <div
            className="absolute w-0.5 bg-emerald-400 rounded-full origin-bottom shadow-lg"
            style={{
              height: '90px',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            }}
          />

          {/* Second Hand */}
          <div
            className="absolute w-0.5 bg-red-400 rounded-full origin-bottom shadow-lg transition-transform duration-75"
            style={{
              height: '100px',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            }}
          />

          {/* Center Dot */}
          <div className="absolute w-4 h-4 bg-emerald-400 rounded-full shadow-lg" 
               style={{
                 left: '50%',
                 top: '50%',
                 transform: 'translate(-50%, -50%)',
               }}
          />
        </div>

        {/* Digital Time Display */}
        <div className="mt-8 text-center">
          <div className="text-2xl font-mono text-emerald-400 bg-slate-800 px-4 py-2 rounded-lg inline-block shadow-lg">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}