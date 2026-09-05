import React, { useState, useRef, useEffect } from 'react';

// Types
type System = 'us' | 'metric';

interface GraphData {
  data: number[];
  threshold: number;
  mode: string;
  name: string;
  ariaLabel: string;
}

interface WeightWidgetProps {
  system?: System;
  height?: number;
  weights?: number[];
  weightThreshold?: number;
  customDataSets?: GraphData[];
  locale?: string;
  className?: string;
}

interface ThinBarGraphProps {
  dataSet: GraphData[];
  className?: string;
}

interface ThinBarGraphButtonProps {
  children?: React.ReactNode;
  pressed?: boolean;
  onClick?: () => void;
}

interface ThinBarGraphDataProps {
  data: number[];
  threshold: number;
  name: string;
  ariaLabel: string;
}

// Utility class
class Utils {
  static formatNumber(n: number, decimalPlaces: number = 1, locale: string = 'en-US') {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: decimalPlaces
    }).format(n);
  }

  static calcBMIInKg(weight: number, height: number): number {
    return weight / ((height / 100) ** 2); // height converted from cm to m
  }

  static calcBMIInLbs(weight: number, height: number): number {
    return (weight * 703) / (height ** 2);
  }
}

// Button component for switching between weight/BMI
const ThinBarGraphButton = ({ children, pressed, onClick }: ThinBarGraphButtonProps) => {
  return (
    <button
      className={`
        bg-transparent cursor-pointer block uppercase transition-colors duration-300
        ${pressed 
          ? 'text-gray-900 dark:text-gray-100' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }
      `}
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// SVG bar chart component
const ThinBarGraphData = ({ data, threshold, name, ariaLabel }: ThinBarGraphDataProps) => {
  const animationRef = useRef(0);
  const [animating, setAnimating] = useState(false);
  
  const GRAPH_WIDTH = 512;
  const GRAPH_HEIGHT = 129;
  const VIEWBOX = `0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`;
  const BARS_MAX = 28;
  const BAR_WIDTH = 4;
  const PADDING_START = 55;
  const PADDING_Y = 2;
  
  const barsSpan = GRAPH_WIDTH - PADDING_START;
  const barSpacing = barsSpan / (BARS_MAX - 1) - BAR_WIDTH / (BARS_MAX - 1);
  const RTL = document.dir === 'rtl';
  const filteredData = data.slice(-BARS_MAX);
  const minValue = Math.min(...data, threshold);
  const maxValue = Math.max(...data, threshold);
  const range = maxValue - minValue || 1;
  const plotHeight = GRAPH_HEIGHT - PADDING_Y * 2;
  
  const getY = (value: number): number => {
    return PADDING_Y + plotHeight * (1 - (value - minValue) / range);
  };
  
  const thresholdY = getY(threshold);
  const baselineY = getY(minValue);
  const labelX = RTL ? GRAPH_WIDTH : 0;
  const barsX = RTL ? 0 : PADDING_START;
  
  const graphDesc = `A vertical bar graph showing ${name} over time. Each bar represents a data point. Bars are black below the threshold of ${Utils.formatNumber(threshold)} and red above it. A red dashed horizontal line represents the threshold value.`;

  useEffect(() => {
    animationRef.current = setTimeout(() => setAnimating(true), 200);
    return () => clearTimeout(animationRef.current);
  }, []);

  return (
    <>
      <svg
        className="block w-full h-auto"
        role="img"
        aria-label={ariaLabel}
        viewBox={VIEWBOX}
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
      >
        <desc>{graphDesc}</desc>
        
        {/* Labels */}
        <g fontSize="18" textAnchor="start" transform={`translate(${labelX}, 0)`}>
          <text y={thresholdY} fill="#ef4444" className="transition-colors duration-300">
            {Utils.formatNumber(threshold)}
          </text>
          <text y={baselineY} fill="currentColor" className="transition-colors duration-300">
            {Utils.formatNumber(minValue)}
          </text>
        </g>
        
        {/* Chart area */}
        <g transform={`translate(${barsX}, 0)`}>
          {/* Threshold line */}
          <line
            x1="0"
            x2={barsSpan}
            y1={thresholdY}
            y2={thresholdY}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth="1"
            className="transition-colors duration-300"
          />
          
          {/* Data bars */}
          <g strokeWidth={BAR_WIDTH}>
            {filteredData.map((value, i) => {
              let x = (BAR_WIDTH / 2) + i * barSpacing;
              if (RTL) x = barsSpan - x;
              
              const isAbove = value > threshold;
              const topY = getY(value);
              const bottomY = Math.max(topY, thresholdY);
              const topLength = thresholdY - topY;
              const bottomLength = baselineY - thresholdY;
              const lineLength = topLength + bottomLength;
              const strokeDasharray = `${lineLength} ${lineLength}`;
              const topStrokeDashoffset = animating ? bottomLength : lineLength + bottomLength;
              const bottomStrokeDashoffset = animating ? 0 : lineLength;

              return (
                <g key={i}>
                  {isAbove && (
                    <line
                      x1={x}
                      x2={x}
                      y1={thresholdY}
                      y2={topY}
                      stroke="#ef4444"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={topStrokeDashoffset}
                      className="transition-all duration-700"
                    />
                  )}
                  <line
                    x1={x}
                    x2={x}
                    y1={baselineY}
                    y2={bottomY}
                    stroke="currentColor"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={bottomStrokeDashoffset}
                    className="transition-all duration-700"
                  />
                  <title>{Utils.formatNumber(value)}</title>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
      
      {/* Screen reader accessible data */}
      <ul className="sr-only">
        {filteredData.map((value, i) => {
          const position = value > threshold ? 'above' : 'below';
          const liText = `${Utils.formatNumber(value)}, ${position} threshold`;
          return <li key={i}>{liText}</li>;
        })}
      </ul>
    </>
  );
};

// Main bar graph component
const ThinBarGraph = ({ dataSet, className = '' }: ThinBarGraphProps) => {
  const [mode, setMode] = useState(dataSet[0]?.mode || '');
  const dataParams = dataSet.find((item) => item.mode === mode) || {} as GraphData;
  const { data = [], threshold = 0, name = '', ariaLabel = '' } = dataParams;
  const diff = (data.at(-1) ?? 0) - threshold;

  return (
    <div className={`
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
      rounded-3xl p-9 w-full max-w-lg transition-all duration-300 font-mono
      ${className}
    `}>
      <div className="flex h-4 gap-3 items-center mb-9">
        {dataSet.map((item, i) => (
          <ThinBarGraphButton
            key={i}
            pressed={mode === item.mode}
            onClick={() => setMode(item.mode)}
          >
            {item.name}
          </ThinBarGraphButton>
        ))}
        <div className="ml-auto text-gray-900 dark:text-gray-100">
          {Utils.formatNumber(diff)}
        </div>
      </div>
      
      <ThinBarGraphData
        data={data}
        threshold={threshold}
        name={name}
        ariaLabel={ariaLabel}
      />
    </div>
  );
};

// Main weight widget component
const WeightWidget = ({
  system = 'us',
  height = 70,
  weights = [140, 145, 147, 154, 154, 152, 153, 154, 149, 147, 148, 149, 145, 147, 147, 152, 148, 153, 147, 145, 147, 148, 145, 146, 148, 146, 144, 144, 147],
  weightThreshold = 150,
  customDataSets,
  locale = 'en-US',
  className = ''
}: WeightWidgetProps) => {
  
  const calcBMI = (weight: number, heightValue: number, systemType: System): number => {
    const bmiFns: Record<System, (weight: number, height: number) => number> = {
      us: Utils.calcBMIInLbs,
      metric: Utils.calcBMIInKg
    };
    return bmiFns[systemType](weight, heightValue);
  };

  const bmiThreshold = calcBMI(weightThreshold, height, system);

  const defaultDataSet: GraphData[] = [
    {
      data: weights,
      threshold: weightThreshold,
      mode: 'weight',
      name: 'Weight',
      ariaLabel: `Weight chart. Threshold is ${Utils.formatNumber(weightThreshold, 1, locale)}. ${weights.length} bars.`
    },
    {
      data: weights.map((weight) => calcBMI(weight, height, system)),
      threshold: bmiThreshold,
      mode: 'bmi',
      name: 'BMI',
      ariaLabel: `BMI chart. Threshold is ${Utils.formatNumber(bmiThreshold, 1, locale)}. ${weights.length} bars.`
    }
  ];

  const dataSet = customDataSets || defaultDataSet;

  return <ThinBarGraph dataSet={dataSet} className={className} />;
};



export default WeightWidget;