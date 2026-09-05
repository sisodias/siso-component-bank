'use client';

import React from 'react';
import {
  BarChart,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxis,
  LinearYAxisTickSeries,
  BarSeries,
  Bar,
  GridlineSeries,
  Gridline,
  ChartDataTypes,
} from 'reaviz';

// Type definitions for Grouped Bar Chart
interface GroupedBarChartDataPoint {
  key: string; // Category name (e.g., 'Q1', 'Q2')
  data: Array<{ key: string; data: number | null | undefined }>; // Array of series data for this category
}

// Data and Constants
// Sample data for a grouped bar chart.
// Each object in the array represents a category on the X-axis.
// The 'data' array within each object represents the different series for that category.
const initialMultiCategoryXSmallBlock: GroupedBarChartDataPoint[] = [
  {
    key: 'Firewall',
    data: [
      { key: 'Blocked', data: 45 },
      { key: 'Allowed', data: 80 },
      { key: 'Monitored', data: 20 },
    ],
  },
  {
    key: 'Endpoint',
    data: [
      { key: 'Blocked', data: 60 },
      { key: 'Allowed', data: 50 },
      { key: 'Monitored', data: 35 },
    ],
  },
  {
    key: 'Network',
    data: [
      { key: 'Blocked', data: 30 },
      { key: 'Allowed', data: 70 },
      { key: 'Monitored', data: 25 },
    ],
  },
  {
    key: 'Cloud',
    data: [
      { key: 'Blocked', data: 55 },
      { key: 'Allowed', data: 60 },
      { key: 'Monitored', data: 40 },
    ],
  },
];

// Data validation utility for GroupedBarChartData
const validateGroupedBarChartData = (data: GroupedBarChartDataPoint[]): ChartDataTypes[] => {
  return data.map(category => ({
    ...category,
    data: category.data.map(seriesItem => ({
      ...seriesItem,
      data: (typeof seriesItem.data !== 'number' || isNaN(seriesItem.data)) ? 0 : seriesItem.data,
    })),
  }));
};

const validatedChartData = validateGroupedBarChartData(initialMultiCategoryXSmallBlock);

const BAR_CHART_COLOR_SCHEME = ['#DAC5F9', '#40E5D1', '#9152EE', '#5B14C5']; // Colors for each series within a group

const GroupedBarIncidentReport: React.FC = () => {
  return (
    <>
      {/* CSS Variables for Reaviz dark mode theming */}
      <style jsx global>{`
        :root {
          --reaviz-tick-fill: #9A9AAF;
          --reaviz-gridline-stroke: #7E7E8F75;
          --reaviz-x-axis-label-fill: #9A9AAF; 
        }
        .dark {
          --reaviz-tick-fill: #A0AEC0; 
          --reaviz-gridline-stroke: rgba(74, 85, 104, 0.6);
          --reaviz-x-axis-label-fill: #A0AEC0;
        }
      `}</style>
      <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-full max-w-sm min-h-[400px] overflow-hidden transition-colors duration-300">
        <h3 className="text-3xl text-left p-7 pt-6 pb-8 font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Incident Report
        </h3>
        
        <div className={'flex-grow px-4 reaviz-chart-container'}> {/* flex-grow for chart, padding for labels */}
          <BarChart
            height={250} // Explicit height for the chart
            id="grouped-vertical-bar-report"
            data={validatedChartData}
            yAxis={
              <LinearYAxis
                axisLine={null}
                tickSeries={
                  <LinearYAxisTickSeries
                    line={null}
                    label={null} // Y-axis labels can be hidden if context is clear
                    tickSize={10} // Optimized
                  />
                }
              />
            }
            xAxis={
              <LinearXAxis
                type="category"
                tickSeries={
                  <LinearXAxisTickSeries
                    label={
                      <LinearXAxisTickLabel
                        padding={10}
                        rotation={-45}
                        format={text => typeof text === 'string' ? `${text.slice(0, 5)}...` : ''}
                        fill="var(--reaviz-x-axis-label-fill)" // Use CSS variable
                      />
                    }
                    tickSize={10} // Optimized
                  />
                }
              />
            }
            series={
              <BarSeries
                type="grouped" // Specifies that this is a grouped bar chart
                layout="vertical" // Default, but explicit
                bar={
                  <Bar
                    width={6} // As per original example
                    glow={{ blur: 20, opacity: 0.7 }}
                    gradient={null} // No gradient as per original
                  />
                }
                colorScheme={BAR_CHART_COLOR_SCHEME}
              />
            }
            gridlines={<GridlineSeries line={<Gridline strokeColor="var(--reaviz-gridline-stroke)" />} />}
          />
        </div>
      </div>
    </>
  );
};

export default GroupedBarIncidentReport;