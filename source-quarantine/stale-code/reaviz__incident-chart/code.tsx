'use client';

import React from 'react';
import {
  BarChart,
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  BarSeries,
  Bar,
  GridlineSeries,
  Gridline,
} from 'reaviz';


interface ChartCategoryData {
  key: string;
  data: number | null; // Allow null for raw data before validation
}

const mediumCategoryDataRaw: ChartCategoryData[] = [
  { key: 'Phishing Attempts', data: 180 },
  { key: 'Malware Detections', data: 150 },
  { key: 'Ransomware Blocks', data: 120 },
  { key: 'DDoS Mitigations', data: 90 },
  { key: 'Insider Incidents', data: 75 },
  { key: 'APT Campaigns', data: 60 },
  { key: 'Data Exfiltration', data: 45 },
];

// Validate and prepare data: ensure `data` properties are valid numbers
const validatedMediumCategoryData = mediumCategoryDataRaw.map(item => ({
  ...item,
  data: (typeof item.data === 'number' && !isNaN(item.data)) ? item.data : 0,
}));

const chartColors = ['#5B14C5', '#9152EE', '#40E5D1', '#A840E8', '#4C86FF', '#0D4ED2', '#40D3F4'];

interface IncidentReportBarChartWidgetProps {
  // Props can be added here if needed for customization, e.g., title, data
}

function IncidentReportBarChartWidget({}: IncidentReportBarChartWidgetProps): JSX.Element {
  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-[350px] h-[386px] overflow-hidden transition-colors duration-300">
      <h3 className="text-3xl text-left p-7 pt-6 pb-8 font-bold text-neutral-800 dark:text-white">
        Incident Report
      </h3>
      <BarChart
        height={250} // Explicit height for the chart
        data={validatedMediumCategoryData}
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
                    fill="#9A9AAF" // Color for tick labels, legible on dark/light
                  />
                }
                tickSize={10} // Optimized tickSize
              />
            }
          />
        }
        series={
          <BarSeries
            bar={
              <Bar
                glow={{
                  blur: 20,
                  opacity: 0.5,
                }}
                gradient={null} // As per original source
              />
            }
            colorScheme={chartColors}
            padding={0.2}
          />
        }
        gridlines={
          <GridlineSeries
            line={<Gridline strokeColor="#7E7E8F75" />} // Specific color for gridlines
          />
        }
      />
    </div>
  );
}

export default IncidentReportBarChartWidget;