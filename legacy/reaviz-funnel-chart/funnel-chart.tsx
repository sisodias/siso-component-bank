'use client';

import React from 'react';
import {
  FunnelChart,
  FunnelSeries,
  FunnelArc,
  TooltipArea,
  FunnelAxis,
  FunnelAxisLine,
} from 'reaviz';

// Data Definitions and Validation
interface FunnelDataPoint {
  key: string;
  data: number | null;
}

const simpleFunnelDataRaw: FunnelDataPoint[] = [
  { key: 'All Events', data: 1000 },
  { key: 'Alerts Triggered', data: 750 },
  { key: 'Incidents Created', data: 500 },
  { key: 'Escalated', data: 250 },
  { key: 'Resolved', data: 200 },
];

// Validate and prepare chart data
const validatedSimpleFunnelData = simpleFunnelDataRaw.map(item => ({
  ...item,
  data: (typeof item.data === 'number' && !isNaN(item.data)) ? item.data : 0,
}));

const funnelChartColors = ['#5B14C5', '#6E28D9', '#8B5CF6', '#A78BFA', '#C4B5FD']; // Dark to light purple

interface IncidentFunnelWidgetProps {
  title?: string;
}

function IncidentFunnelWidget({ title = "Incident Report" }: IncidentFunnelWidgetProps): JSX.Element {
  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-[300px] h-[420px] overflow-hidden transition-colors duration-300">
      <h3 className="text-3xl text-left p-7 pt-6 pb-8 font-bold text-neutral-800 dark:text-white">
        {title}
      </h3>
      <div className="flex-grow px-4">
        <FunnelChart
          id="incident-funnel-chart"
          height={280} // Explicit height for the chart
          data={validatedSimpleFunnelData}
          series={
            <FunnelSeries
              arc={
                <FunnelArc
                  colorScheme={funnelChartColors}
                  gradient={null}
                  tooltip={<TooltipArea />} // Tooltip to show data on hover
                  glow={{
                    blur: 15, // Slightly reduced blur
                    color: 'rgba(91, 20, 197, 0.5)', // Use rgba for better control
                  }}
                />
              }
              axis={
                <FunnelAxis
                  label={null} // Labels can be added if desired, for now null as per original
                  line={
                    <FunnelAxisLine 
                      strokeColor={'#4A5568'} // Neutral color for axis line (dark gray)
                      className="dark:stroke-gray-600" // Dark mode specific color
                    />
                  }
                />
              }
            />
          }
        />
      </div>
    </div>
  );
}

export default IncidentFunnelWidget;