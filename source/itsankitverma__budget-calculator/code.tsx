'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PriceRangeDemoProps {
  minPrice?: number;
  maxPrice?: number;
  defaultMin?: number;
  defaultMax?: number;
}

export default function PriceRangeDemo({
  minPrice = 0,
  maxPrice = 10000,
  defaultMin = 0,
  defaultMax = 5000
}: PriceRangeDemoProps = {}) {
  const [minValue, setMinValue] = useState(defaultMin);
  const [maxValue, setMaxValue] = useState(defaultMax);
  const [minInput, setMinInput] = useState(defaultMin.toString());
  const [maxInput, setMaxInput] = useState(defaultMax.toString());
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const [dynamicMaxPrice, setDynamicMaxPrice] = useState(maxPrice);
  const sliderRef = useRef<HTMLDivElement>(null);

  const MIN_PRICE = minPrice;
  const MAX_PRICE = dynamicMaxPrice;

  // Generate bar chart data (histogram bars) with more realistic distribution
  const bars = Array.from({ length: 50 }, (_, index) => {
    // Create a bell curve-like distribution
    const center = 25;
    const distance = Math.abs(index - center);
    const baseHeight = 100 - (distance * 2.5);
    const randomVariation = Math.random() * 15 - 7.5;
    return Math.max(20, Math.min(100, baseHeight + randomVariation));
  });

  // Update input fields when slider values change
  useEffect(() => {
    setMinInput(minValue.toString());
    setMaxInput(maxValue.toString());
  }, [minValue, maxValue]);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string and numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setMinInput(value);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string and numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setMaxInput(value);
    }
  };

  const handleMinInputBlur = () => {
    const numValue = parseInt(minInput) || 0;
    const clampedValue = Math.max(MIN_PRICE, Math.min(numValue, maxValue - 100));
    setMinValue(clampedValue);
    setMinInput(clampedValue.toString());
  };

  const handleMaxInputBlur = () => {
    const numValue = parseInt(maxInput) || 0;
    const clampedValue = Math.max(numValue, minValue + 100);

    // Always update MAX_PRICE dynamically to match the entered max value
    setDynamicMaxPrice(clampedValue);
    setMaxValue(clampedValue);
    setMaxInput(clampedValue.toString());
  };

  const handleMinInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMinInputBlur();
      e.currentTarget.blur();
    }
  };

  const handleMaxInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMaxInputBlur();
      e.currentTarget.blur();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const value = Math.round(MIN_PRICE + percentage * (MAX_PRICE - MIN_PRICE));

    if (isDraggingMin) {
      setMinValue(Math.min(value, maxValue - 100));
    } else if (isDraggingMax) {
      setMaxValue(Math.max(value, minValue + 100));
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const value = Math.round(MIN_PRICE + percentage * (MAX_PRICE - MIN_PRICE));

    if (isDraggingMin) {
      setMinValue(Math.min(value, maxValue - 100));
    } else if (isDraggingMax) {
      setMaxValue(Math.max(value, minValue + 100));
    }
  };

  const handleMouseUp = () => {
    setIsDraggingMin(false);
    setIsDraggingMax(false);
  };

  useEffect(() => {
    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDraggingMin, isDraggingMax, minValue, maxValue]);

  const minPosition = ((minValue - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPosition = ((maxValue - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-black dark:to-zinc-900 flex items-center justify-center p-4 sm:p-6 md:p-8 w-full" style={{ perspective: '1000px' }}>
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl border-2 border-zinc-300/80 dark:border-zinc-800/50 p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl" style={{
          transform: 'translateZ(20px)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
        }}>
          {/* Header */}
          <div className="mb-4 sm:mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Set Your Budget
            </h2>
          </div>

          {/* Value Display Boxes on Top */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Minimum Box */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-600/10 dark:to-blue-600/10 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ transform: 'translateZ(-10px)' }}></div>
              <div className="relative bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-900/80 border-2 border-zinc-300/80 dark:border-zinc-700/50 rounded-lg sm:rounded-xl p-3 sm:p-5 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] shadow-lg" style={{
                transform: 'translateZ(10px)',
                boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.25), 0 5px 15px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              }}>
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 sm:mb-2">
                  Minimum
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">$</span>
                  <input
                    type="text"
                    value={minInput}
                    onChange={handleMinInputChange}
                    onBlur={handleMinInputBlur}
                    onKeyDown={handleMinInputKeyDown}
                    className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white bg-transparent border-none outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 rounded py-1 text-center min-w-[4rem] max-w-full drop-shadow-sm"
                    placeholder="0"
                    style={{ width: `${Math.max(5, (minInput.length || 1) + 1.5)}ch` }}
                  />
                </div>
              </div>
            </div>

            {/* Maximum Box */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-600/10 dark:to-blue-600/10 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ transform: 'translateZ(-10px)' }}></div>
              <div className="relative bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800/80 dark:to-zinc-900/80 border-2 border-zinc-300/80 dark:border-zinc-700/50 rounded-lg sm:rounded-xl p-3 sm:p-5 text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] shadow-lg" style={{
                transform: 'translateZ(10px)',
                boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.25), 0 5px 15px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              }}>
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 sm:mb-2">
                  Maximum
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">$</span>
                  <input
                    type="text"
                    value={maxInput}
                    onChange={handleMaxInputChange}
                    onBlur={handleMaxInputBlur}
                    onKeyDown={handleMaxInputKeyDown}
                    className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white bg-transparent border-none outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 rounded py-1 text-center min-w-[4rem] max-w-full drop-shadow-sm"
                    placeholder={MAX_PRICE.toString()}
                    style={{ width: `${Math.max(5, (maxInput.length || 1) + 1.5)}ch` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Slider Section */}
          <div className="mb-4 sm:mb-6">
            {/* Range Display */}
            <div className="flex items-center justify-between px-2 sm:px-3 mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>${minPrice.toLocaleString()}</span>
              <span>${MAX_PRICE.toLocaleString()}</span>
            </div>
            {/* Slider Container */}
            <div className="relative px-2 sm:px-3">
              {/* Slider Track */}
              <div
                ref={sliderRef}
                className="relative h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full cursor-pointer"
              >
                {/* Active Range */}
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-full shadow-lg shadow-purple-500/30"
                  style={{
                    left: `${minPosition}%`,
                    width: `${maxPosition - minPosition}%`,
                  }}
                />

                {/* Min Handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-100 dark:to-zinc-300 border-3 border-purple-500 dark:border-purple-600 rounded-full cursor-grab active:cursor-grabbing hover:scale-125 transition-all duration-200 z-10 touch-none"
                  style={{
                    left: `${minPosition}%`,
                    transform: 'translate(-50%, -50%) translateZ(20px)',
                    boxShadow: '0 8px 20px -5px rgba(168, 85, 247, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset, 0 2px 4px rgba(0, 0, 0, 0.1) inset'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDraggingMin(true);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setIsDraggingMin(true);
                  }}
                />

                {/* Max Handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-100 dark:to-zinc-300 border-3 border-purple-500 dark:border-purple-600 rounded-full cursor-grab active:cursor-grabbing hover:scale-125 transition-all duration-200 z-10 touch-none"
                  style={{
                    left: `${maxPosition}%`,
                    transform: 'translate(-50%, -50%) translateZ(20px)',
                    boxShadow: '0 8px 20px -5px rgba(168, 85, 247, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset, 0 2px 4px rgba(0, 0, 0, 0.1) inset'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDraggingMax(true);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setIsDraggingMax(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="relative" style={{ transform: 'translateZ(5px)' }}>
            {/* Bars Container */}
            <div className="flex items-end justify-between h-20 sm:h-24 gap-[2px] rounded-lg overflow-hidden bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-black p-3 sm:p-4 border-2 border-zinc-300/80 dark:border-zinc-800/50 shadow-inner" style={{
              boxShadow: '0 6px 20px -3px rgba(0, 0, 0, 0.15) inset, 0 2px 8px -2px rgba(0, 0, 0, 0.1) inset, 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
            }}>
              {bars.map((height, index) => {
                const position = (index / bars.length) * 100;
                const isInRange = position >= minPosition && position <= maxPosition;

                return (
                  <div
                    key={index}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ease-out ${
                      isInRange
                        ? 'bg-purple-500 dark:bg-purple-600 opacity-100'
                        : 'bg-zinc-300 dark:bg-zinc-700 opacity-30'
                    }`}
                    style={{
                      height: `${height}%`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
