import * as React from 'react';
import { cn } from "../_utils/cn";

// Helper function to convert a value to its percentage representation within a range
const valueToPercent = (value: number, min: number, max: number) => {
  return ((value - min) / (max - min)) * 100;
};

// Helper function to format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface PriceRangeSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
}

const PriceRangeSlider = React.forwardRef<HTMLDivElement, PriceRangeSliderProps>(
  (
    {
      className,
      data,
      min = 0,
      max = 5000,
      step = 10,
      defaultValue = [1000, 4000],
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [localValues, setLocalValues] = React.useState<[number, number]>(defaultValue);
    const [isMinThumbDragging, setIsMinThumbDragging] = React.useState(false);
    const [isMaxThumbDragging, setIsMaxThumbDragging] = React.useState(false);

    const sliderRef = React.useRef<HTMLDivElement>(null);
    const minThumbRef = React.useRef<HTMLButtonElement>(null);
    const maxThumbRef = React.useRef<HTMLButtonElement>(null);

    const [minVal, maxVal] = localValues;
    const minPercent = valueToPercent(minVal, min, max);
    const maxPercent = valueToPercent(maxVal, min, max);

    // Handles value updates and calls the onValueChange callback
    const handleValueChange = React.useCallback(
      (newValues: [number, number]) => {
        setLocalValues(newValues);
        if (onValueChange) {
          onValueChange(newValues);
        }
      },
      [onValueChange]
    );

    // Effect for handling mouse/touch move events
    React.useEffect(() => {
      const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (!sliderRef.current) return;

        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const newValue = Math.round((min + (percent / 100) * (max - min)) / step) * step;

        if (isMinThumbDragging) {
          handleValueChange([Math.min(newValue, maxVal - step), maxVal]);
        }
        if (isMaxThumbDragging) {
          handleValueChange([minVal, Math.max(newValue, minVal + step)]);
        }
      };

      const handleMouseUp = () => {
        setIsMinThumbDragging(false);
        setIsMaxThumbDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }, [isMinThumbDragging, isMaxThumbDragging, min, max, step, minVal, maxVal, handleValueChange]);

    // Handles keyboard navigation for accessibility
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, thumb: 'min' | 'max') => {
      let newMinValue = minVal;
      let newMaxValue = maxVal;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (thumb === 'min') newMinValue = Math.max(min, minVal - step);
        else newMaxValue = Math.max(minVal + step, maxVal - step);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (thumb === 'min') newMinValue = Math.min(maxVal - step, minVal + step);
        else newMaxValue = Math.min(max, maxVal + step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        if (thumb === 'min') newMinValue = min;
        else newMaxValue = minVal + step;
      } else if (e.key === 'End') {
        e.preventDefault();
        if (thumb === 'min') newMinValue = maxVal - step;
        else newMaxValue = max;
      }
      
      handleValueChange([newMinValue, newMaxValue]);
    };

    return (
      <div className={cn('w-full px-4', className)} {...props} ref={ref}>
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground">Price Range</h3>
        </div>

        <div className="relative w-full h-20" ref={sliderRef}>
          {/* Histogram Bars */}
          <div className="absolute inset-0 flex items-end gap-px">
            {data.map((value, index) => {
              const barPercent = (index / (data.length - 1)) * 100;
              const isInRange = barPercent >= minPercent && barPercent <= maxPercent;
              return (
                <div
                  key={index}
                  className={cn(
                    'w-full rounded-t-sm transition-colors duration-300',
                    isInRange ? 'bg-primary' : 'bg-muted'
                  )}
                  style={{ height: `${value * 100}%` }}
                />
              );
            })}
          </div>

          {/* Slider Thumbs */}
          <div className="relative h-full">
            <button
              ref={minThumbRef}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={maxVal - step}
              aria-valuenow={minVal}
              aria-label="Minimum price"
              onMouseDown={() => setIsMinThumbDragging(true)}
              onTouchStart={() => setIsMinThumbDragging(true)}
              onKeyDown={(e) => handleKeyDown(e, 'min')}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-background rounded-full border-2 border-primary shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ left: `${minPercent}%` }}
            />
            <button
              ref={maxThumbRef}
              role="slider"
              aria-valuemin={minVal + step}
              aria-valuemax={max}
              aria-valuenow={maxVal}
              aria-label="Maximum price"
              onMouseDown={() => setIsMaxThumbDragging(true)}
              onTouchStart={() => setIsMaxThumbDragging(true)}
              onKeyDown={(e) => handleKeyDown(e, 'max')}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-background rounded-full border-2 border-primary shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ left: `${maxPercent}%` }}
            />
          </div>
        </div>

        {/* Value Displays */}
        <div className="grid grid-cols-2 items-center gap-4 mt-4">
          <div className="bg-card p-4 rounded-lg text-center border">
            <p className="text-sm text-muted-foreground">Minimum</p>
            <p className="text-xl font-semibold text-card-foreground">
              {formatCurrency(minVal)}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg text-center border">
            <p className="text-sm text-muted-foreground">Maximum</p>
            <p className="text-xl font-semibold text-card-foreground">
              {formatCurrency(maxVal)}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PriceRangeSlider.displayName = 'PriceRangeSlider';

export { PriceRangeSlider };