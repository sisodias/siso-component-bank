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

// Color scheme for layered funnel - ensure colors are distinct enough for layers
const layeredFunnelChartColors = ['#EE409430', '#EE409475', '#EE4094', '#BB015A', '#8A0042'];

interface LayeredFunnelWidgetProps {
  title?: string;
}

function LayeredFunnelWidget({ title = "Incident Report" }: LayeredFunnelWidgetProps): JSX.Element {
  return (
    <div className="flex flex-col pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-[300px] h-[420px] overflow-hidden transition-colors duration-300">
      <h3 className="text-3xl text-left p-7 pt-6 pb-8 font-bold text-neutral-800 dark:text-white">
        {title}
      </h3>
      <div className="flex-grow px-4">
        <FunnelChart
          id="layered-incident-funnel"
          height={280} // Explicit height for the chart
          data={validatedSimpleFunnelData}
          series={
            <FunnelSeries
              arc={
                <FunnelArc
                  colorScheme={layeredFunnelChartColors}
                  gradient={null}
                  tooltip={<TooltipArea />}
                  variant="layered" // Key property for layered effect
                  glow={{
                    blur: 15,
                    color: '#EE409499', // Glow color matching the theme
                  }}
                />
              }
              axis={
                <FunnelAxis
                  label={null}
                  line={
                    <FunnelAxisLine 
                      strokeColor={'#4A5568'} // Neutral color for axis line
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

export default LayeredFunnelWidget;