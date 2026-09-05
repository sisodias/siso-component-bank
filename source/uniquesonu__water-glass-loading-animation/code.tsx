import React from 'react';
import PropTypes from 'prop-types';

const WaterGlassLoader = ({
  progress = 0,
  loadingText = 'Loading...',
  showPercentage = true,
  className = '',
}) => {
  // Clamp the progress value between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`flex flex-col items-center gap-6 text-center ${className}`}>
      {/* The Glass Container */}
      <div className="relative h-[180px] w-[120px] overflow-hidden rounded-t-lg rounded-b-[40px] border-[3px] border-white/80 bg-white/25 shadow-lg">
        
        {/* The Water */}
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 to-sky-500 transition-[height] duration-300 ease-in-out"
          style={{ height: `${clampedProgress}%` }}
        ></div>
        
        {/* Glass Structure - Base and Foot */}
        <div className="absolute -bottom-[12px] left-1/2 h-[15px] w-[140px] -translate-x-1/2 rounded-b-lg bg-white/70"></div>
        <div className="absolute -bottom-[27px] left-1/2 h-[15px] w-[80px] -translate-x-1/2 rounded-b-md bg-white/90"></div>
      </div>

      {/* Loading Text and Percentage */}
      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold uppercase tracking-wider text-sky-800">
          {loadingText}
        </div>
        {showPercentage && (
          <div className="text-3xl font-bold text-sky-900">
            {`${Math.round(clampedProgress)}%`}
          </div>
        )}
      </div>
    </div>
  );
};

WaterGlassLoader.propTypes = {
  progress: PropTypes.number,
  loadingText: PropTypes.string,
  showPercentage: PropTypes.bool,
  className: PropTypes.string,
};

export default WaterGlassLoader;

