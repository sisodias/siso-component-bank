'use client';

import React from 'react';
import {
  StackedNormalizedAreaChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  StackedNormalizedAreaSeries,
  Line,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
  ChartDataTypes, // For chart data types
} from 'reaviz';

// Type definitions
interface ChartDataPoint {
  key: Date;
  data: number | null | undefined; // Allow null/undefined for initial data
}

interface ChartSeries {
  key: string;
  data: ChartDataPoint[];
}

// Data and Constants
const now = new Date();
const generateDate = (offsetDays: number): Date => {
  const date = new Date(now);
  date.setDate(now.getDate() - offsetDays);
  return date;
};

// Sample data for the stacked normalized area chart
// Order of series here will determine stacking order (first series at the bottom)
// and will map to the colorScheme accordingly.
const initialMultiDateData: ChartSeries[] = [
  {
    key: 'Category A', // Will use the first color in colorScheme
    data: Array.from({ length: 7 }, (_, i) => ({ key: generateDate(6 - i), data: Math.floor(Math.random() * 30) + 10 })),
  },
  {
    key: 'Category B', // Will use the second color
    data: Array.from({ length: 7 }, (_, i) => ({ key: generateDate(6 - i), data: Math.floor(Math.random() * 40) + 15 })),
  },
  {
    key: 'Category C', // Will use the third color
    data: Array.from({ length: 7 }, (_, i) => ({ key: generateDate(6 - i), data: Math.floor(Math.random() * 20) + 5 })),
  },
];

// Data validation utility
const validateChartData = (data: ChartSeries[]): ChartDataTypes[] => {
  return data.map(series => ({
    ...series,
    data: series.data.map(item => ({
      ...item,
      data: (typeof item.data !== 'number' || isNaN(item.data)) ? 0 : item.data,
    })),
  }));
};

const validatedChartData = validateChartData(initialMultiDateData);

const chartColorScheme = ['#FAE5F6', '#EE4094', '#BB015A']; // Light pink, Medium pink, Dark pink

const StackedNormalizedIncidentChart: React.FC = () => {
  return (
    <>
      {/* CSS Variables for Reaviz dark mode theming */}
      <style jsx global>{`
        :root {
          --reaviz-tick-fill: #9A9AAF; /* Original light mode tick fill */
          --reaviz-gridline-stroke: #7E7E8F75; /* Original light mode gridline */
        }
        .dark {
          --reaviz-tick-fill: #A0AEC0; /* Lighter gray for dark mode */
          --reaviz-gridline-stroke: rgba(74, 85, 104, 0.6); /* Darker, less opaque gridline for dark mode */
        }
      `}</style>
      <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-full max-w-sm min-h-[400px] overflow-hidden transition-colors duration-300">
        <h3 className="text-3xl text-left p-7 pt-6 pb-8 font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Incident Report
        </h3>
        <div className="reaviz-chart-container flex-grow px-2"> {/* Container for CSS vars, flex-grow for chart, padding for labels */}
          <StackedNormalizedAreaChart
            height={250} // Explicit height for the chart
            id="stacked-normalized-incident-report"
            data={validatedChartData}
            xAxis={
              <LinearXAxis
                type="time"
                tickSeries={
                  <LinearXAxisTickSeries
                    tickSize={10} // Optimized tickSize
                    label={
                      <LinearXAxisTickLabel
                        format={v => new Date(v).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        fill="var(--reaviz-tick-fill)" // Use CSS variable
                      />
                    }
                  />
                }
              />
            }
            yAxis={
              <LinearYAxis
                axisLine={null} // Y-axis line often hidden for normalized charts
                tickSeries={
                  <LinearYAxisTickSeries
                    line={null}
                    label={null} // Y-axis labels often hidden for normalized (0-100%)
                    tickSize={10} // Optimized tickSize
                  />
                }
              />
            }
            series={
              <StackedNormalizedAreaSeries
                line={
                  <Line
                    strokeWidth={3}
                    glow={{ blur: 10 }}
                  />
                }
                area={
                  <Area // Area color will be determined by colorScheme, gradient applied on top
                    glow={{ blur: 20 }}
                    gradient={
                      <Gradient
                        stops={[
                          <GradientStop key={1} stopOpacity={0} />,
                          <GradientStop key={2} offset="80%" stopOpacity={0.2} />,
                        ]}
                      />
                    }
                  />
                }
                colorScheme={chartColorScheme}
              />
            }
            gridlines={
              <GridlineSeries
                line={<Gridline strokeColor="var(--reaviz-gridline-stroke)" />} // Use CSS variable
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default StackedNormalizedIncidentChart;