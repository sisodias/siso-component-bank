'use client';

import React, { useEffect, useState } from 'react';
import {
  Heatmap,
  HeatmapSeries,
  HeatmapCell,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  SequentialLegend,
} from 'reaviz';

// Hook to detect dark mode preference
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false; 
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDarkMode;
}

// TypeScript types for heatmap data
interface HeatmapCellData {
  key: string; // X-axis identifier (e.g., time)
  data: number | undefined | null; // Cell value, allow undefined/null for validation
}

interface HeatmapRowData {
  key: string; // Y-axis identifier (e.g., day)
  data: HeatmapCellData[];
}

type HeatmapChartDataInput = HeatmapRowData[];

interface ValidatedHeatmapCellData {
  key: string;
  data: number; // Ensure data is a number after validation
}
interface ValidatedHeatmapRowData {
  key: string;
  data: ValidatedHeatmapCellData[];
}
type ValidatedHeatmapChartData = ValidatedHeatmapRowData[];


// Sample raw data for the heatmap, including potentially invalid entries
const rawHeatmapData: HeatmapChartDataInput = [
  { key: 'Mon', data: [
      { key: '0h', data: 10 }, { key: '4h', data: 15 }, { key: '8h', data: 20 },
      { key: '12h', data: 25 }, { key: '16h', data: 30 }, { key: '20h', data: 12 }
  ]},
  { key: 'Tue', data: [
      { key: '0h', data: 5 }, { key: '4h', data: Number('abc') }, { key: '8h', data: 18 }, // NaN data
      { key: '12h', data: 22 }, { key: '16h', data: 28 }, { key: '20h', data: 10 }
  ]},
  { key: 'Wed', data: [
      { key: '0h', data: 12 }, { key: '4h', data: 17 }, { key: '8h', data: undefined }, // undefined data
      { key: '12h', data: 27 }, { key: '16h', data: 32 }, { key: '20h', data: 14 }
  ]},
  { key: 'Thu', data: [
      { key: '0h', data: 8 }, { key: '4h', data: 13 }, { key: '8h', data: 22 },
      { key: '12h', data: 30 }, { key: '16h', data: 25 }, { key: '20h', data: 18 }
  ]},
  { key: 'Fri', data: [
      { key: '0h', data: 20 }, { key: '4h', data: 25 }, { key: '8h', data: 10 },
      { key: '12h', data: 15 }, { key: '16h', data: 5 }, { key: '20h', data: 22 }
  ]}
];

// Data validation function
const validateHeatmapData = (inputData: HeatmapChartDataInput): ValidatedHeatmapChartData => {
  return inputData.map(series => ({
    ...series,
    data: series.data.map(item => ({
      ...item,
      data: (typeof item.data === 'number' && !isNaN(item.data)) ? item.data : 0,
    })),
  }));
};

// Validated data to be used by the chart
const heatmapXSmallSimpleBlocksData: ValidatedHeatmapChartData = validateHeatmapData(rawHeatmapData);

// Color scheme for HeatmapSeries and SequentialLegend
// The first color will have the glow effect as per original snippet
const heatmapVisualizationColorScheme: string[] = ['#FFD440', '#F8A340', '#E84045'];
const heatmapGlowFilter = 'drop-shadow(0px 0px 5px #FFD44070)';

// Props for the component (currently none, but good for future extensibility)
interface IncidentHeatmapReportCardProps {}

const IncidentHeatmapReportCard: React.FC<IncidentHeatmapReportCardProps> = () => {
  const isDarkMode = useDarkMode();

  const xAxisTickLabelFill = isDarkMode ? '#E5E7EB' : '#374151'; // Tailwind gray-200 / gray-700

  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-[350px] h-[450px] overflow-hidden transition-colors duration-300">
      <h3 className="text-3xl text-left px-7 pt-6 pb-8 font-bold text-black dark:text-white transition-colors duration-300">
        Incident Report
      </h3>
      <div className="flex w-full h-full pl-2 pr-2">
        <Heatmap
          height={280} // Increased height for better visualization
          data={heatmapXSmallSimpleBlocksData}
          yAxis={
            <LinearYAxis
              axisLine={null}
              tickSeries={<LinearYAxisTickSeries label={null} line={null} />}
            />
          }
          xAxis={
            <LinearXAxis
              axisLine={null}
              tickSeries={
                <LinearXAxisTickSeries
                  line={null}
                  label={
                    <LinearXAxisTickLabel
                      padding={10}
                      rotation={-60}
                      style={{ fill: xAxisTickLabelFill }} // Dynamic fill for dark mode
                    />
                  }
                  tickSize={10} // Optimized tickSize
                />
              }
            />
          }
          series={
            <HeatmapSeries
              colorScheme={heatmapVisualizationColorScheme}
              padding={0.25}
              cell={ // Custom cell rendering to apply filter
                <HeatmapCell
                  style={(node) => {
                    // node.color is determined by HeatmapSeries based on its colorScheme and node.value
                    const style: React.CSSProperties & { filter?: string } = { fill: node.color };
                    if (node.color === heatmapVisualizationColorScheme[0]) {
                      style.filter = heatmapGlowFilter;
                    }
                    return style;
                  }}
                />
              }
            />
          }
        />
        <SequentialLegend
          data={heatmapXSmallSimpleBlocksData} // Data for range calculation
          colorScheme={heatmapVisualizationColorScheme} // Consistent color scheme
          gradientClassName="!w-[20px]" // Original styling
          className="pl-1 pr-1 mt-6 !h-[135px] text-black dark:text-white transition-colors duration-300" // Original styling + dark mode text
        />
      </div>
    </div>
  );
};

export default IncidentHeatmapReportCard;