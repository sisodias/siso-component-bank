'use client';

import React from 'react';
import {
  StackedBarChart,
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  StackedBarSeries,
  Bar,
  GridlineSeries,
  Gridline,
} from 'reaviz';

// Data Definitions and Validation
interface StackSegment {
  key: string; // Series name, e.g., 'Low', 'Medium'
  data: number | null;
}

interface ChartCategoryData {
  key: string; // Category on X-axis, e.g., 'Phishing'
  data: StackSegment[];
}

const multiCategoryRaw: ChartCategoryData[] = [
  {
    key: 'Phishing',
    data: [
      { key: 'Low', data: 20 },
      { key: 'Medium', data: 30 },
      { key: 'High', data: 10 },
      { key: 'Critical', data: 5 },
    ],
  },
  {
    key: 'Malware',
    data: [
      { key: 'Low', data: 15 },
      { key: 'Medium', data: 25 },
      { key: 'High', data: 15 },
      { key: 'Critical', data: 8 },
    ],
  },
  {
    key: 'Ransomware',
    data: [
      { key: 'Low', data: 10 },
      { key: 'Medium', data: 20 },
      { key: 'High', data: 25 },
      { key: 'Critical', data: 12 },
    ],
  },
  {
    key: 'Spyware',
    data: [
      { key: 'Low', data: 25 },
      { key: 'Medium', data: 15 },
      { key: 'High', data: 8 },
      { key: 'Critical', data: 3 },
    ],
  },
];

// Validate and prepare chart data
const validatedMultiCategoryData = multiCategoryRaw.map(category => ({
  ...category,
  data: category.data.map(segment => ({
    ...segment,
    data: (typeof segment.data === 'number' && !isNaN(segment.data)) ? segment.data : 0,
  })),
}));

const legendItems = [
    { name: 'Low', color: '#4C86FF' },
    { name: 'Medium', color: '#40E5D1' },
    { name: 'High', color: '#40D3F4' },
    { name: 'Critical', color: '#9152EE' },
];
const chartColors = legendItems.map(item => item.color);


interface StackedIncidentReportWidgetProps {
  title?: string;
}

function StackedIncidentReportWidget({ title = "Incident Report" }: StackedIncidentReportWidgetProps): JSX.Element {
  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-[350px] h-[420px] overflow-hidden transition-colors duration-300">
      <h3 className="text-3xl text-left p-7 pt-6 pb-4 font-bold text-neutral-800 dark:text-white">
        {title}
      </h3>
       <div className="flex justify-around w-full px-4 mb-4 text-xs">
        {legendItems.map(item => (
          <div key={item.name} className="flex gap-1 items-center">
            <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
            <span className="text-neutral-600 dark:text-neutral-400">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="flex-grow px-2">
        <StackedBarChart
          height={280} // Adjusted chart height
          data={validatedMultiCategoryData}
          yAxis={
            <LinearYAxis
              axisLine={null}
              tickSeries={<LinearYAxisTickSeries line={null} label={null} />}
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
                      format={(text: string) => (text.length > 5 ? `${text.slice(0, 5)}...` : text)}
                      fill="#9A9AAF" // Theme-agnostic color for ticks
                    />
                  }
                  tickSize={15} // Optimized tickSize
                />
              }
            />
          }
          series={
            <StackedBarSeries
              bar={
                <Bar
                  glow={{
                    blur: 20,
                    opacity: 0.5,
                  }}
                  gradient={null}
                />
              }
              colorScheme={chartColors}
              padding={0.35}
            />
          }
          gridlines={
            <GridlineSeries
              line={<Gridline strokeColor="#7E7E8F75" />} // Theme-agnostic gridline color
            />
          }
        />
      </div>
    </div>
  );
}

export default StackedIncidentReportWidget;