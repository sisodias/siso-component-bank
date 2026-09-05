'use client';

import React, { useEffect, useState } from 'react';
import {
  FunnelChart,
  FunnelSeries,
  FunnelArc,
  TooltipArea,
  FunnelAxis,
  FunnelAxisLine,
} from 'reaviz';

// Hook to detect dark mode preference
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state directly from media query on client
    if (typeof window === 'undefined') {
      return false; // Default for SSR, actual value determined on client
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // This effect runs only on the client
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Listener for changes in color scheme preference
    const handler = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);
    mediaQuery.addEventListener('change', handler);
    
    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handler);
  }, []); // Empty dependency array ensures this effect runs only once on mount and unmount

  return isDarkMode;
}

// TypeScript type for funnel chart data points
interface FunnelChartDataPoint {
  key: string;
  data: number | undefined; // Allow undefined initially to demonstrate validation
  // Reaviz allows optional metadata, fill, stroke, etc. per data point
  // metadata?: any; 
}

// Sample raw data for the funnel chart, including potentially invalid entries
const rawSimpleFunnelData: FunnelChartDataPoint[] = [
  { key: 'Prospects', data: 1500 },
  { key: 'Leads', data: 1200 },
  { key: 'Qualified Leads', data: 800 },
  { key: 'Proposals', data: 500 },
  { key: 'Negotiations', data: 250 },
  { key: 'Closed Won', data: 150 },
  { key: 'Invalid Entry', data: Number('abc') }, // Example of NaN data
  { key: 'Missing Data Point', data: undefined }, // Example of undefined data
];

// Data validation function: ensures 'data' property is a valid number, defaults to 0 if not.
const validateFunnelData = (inputData: FunnelChartDataPoint[]): { key: string; data: number }[] => {
  return inputData.map(point => ({
    ...point,
    data: (typeof point.data === 'number' && !isNaN(point.data)) ? point.data : 0,
  }));
};

// Prepare validated data once, outside the component scope
const validatedSimpleFunnelData = validateFunnelData(rawSimpleFunnelData);

// Props for the component (currently none, but good for future extensibility)
interface IncidentReportCardProps {}

const IncidentReportCard: React.FC<IncidentReportCardProps> = () => {
  const isDarkMode = useDarkMode();
  
  // Dynamically set axis line color based on theme for better visibility
  const axisLineColor = isDarkMode ? '#E5E7EB' : '#000000'; // Tailwind's gray-200 for dark, black for light

  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl w-[300px] h-[386px] shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] overflow-hidden transition-colors duration-300">
      <h3 className="text-3xl text-left px-7 pt-6 pb-8 font-bold text-black dark:text-white transition-colors duration-300">
        Incident Report
      </h3>
      <FunnelChart
        id="interpolation" // Preserving original ID attribute
        data={validatedSimpleFunnelData}
        height={200} // Explicit chart height for better layout control
        series={
          <FunnelSeries
            arc={
              <FunnelArc
                colorScheme={'#40D3F4'} // Original color scheme
                interpolation="step" // Original interpolation
                gradient={null} // No gradient as per original
                tooltip={<TooltipArea />} // Standard tooltip for interactivity
                glow={{ // Glow effect as per original
                  blur: 15,
                  color: '#40D3F475',
                }}
              />
            }
            axis={
              <FunnelAxis
                label={null} // No axis labels as per original
                line={
                  <FunnelAxisLine 
                    strokeColor={axisLineColor} // Theme-aware stroke color
                  />
                }
              />
            }
          />
        }
      />
    </div>
  );
};

export default IncidentReportCard;