// src/components/ui/component.tsx

import React from 'react';
import { Group } from '@visx/group';
import { ViolinPlot, BoxPlot } from '@visx/stats';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { genStats, Stats, getSeededRandom, getRandomNormal } from '@visx/mock-data';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@visx/pattern';

const seededRandom = getSeededRandom(0.1);
const randomNormal = getRandomNormal.source(getSeededRandom(0.789))(4, 3);
const defaultData: Stats[] = genStats(5, randomNormal, () => 10 * seededRandom());

const xAccessor = (d: Stats) => d.boxPlot.x;
const minAccessor = (d: Stats) => d.boxPlot.min;
const maxAccessor = (d: Stats) => d.boxPlot.max;
const medianAccessor = (d: Stats) => d.boxPlot.median;
const firstQuartileAccessor = (d: Stats) => d.boxPlot.firstQuartile;
const thirdQuartileAccessor = (d: Stats) => d.boxPlot.thirdQuartile;
const outliersAccessor = (d: Stats) => d.boxPlot.outliers;

interface TooltipData {
  name?: string;
  min?: number;
  median?: number;
  max?: number;
  firstQuartile?: number;
  thirdQuartile?: number;
}

export interface ComponentProps {
  width: number;
  height: number;
  data?: Stats[];
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

const StatsPlotBase: React.FC<ComponentProps & WithTooltipProvidedProps<TooltipData>> = ({
  width,
  height,
  data = defaultData,
  marginTop = 40,
  marginBottom = 80,
  marginLeft = 0,
  marginRight = 0,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  showTooltip,
  hideTooltip,
}) => {
  const xMax = width - marginLeft - marginRight;
  const yMax = height - marginTop - marginBottom;

  if (width < 10 || height < 10 || xMax <= 0 || yMax <= 0) return null;

  const xScale = scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: data.map(xAccessor),
    padding: 0.4,
  });

  const values = data.reduce((allValues, { boxPlot }) => {
    allValues.push(boxPlot.min, boxPlot.max);
    return allValues;
  }, [] as number[]);
  const minYValue = Math.min(...values, 0);
  const maxYValue = Math.max(...values, 0);

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [minYValue, maxYValue],
  });

  const boxWidth = xScale.bandwidth();
  const constrainedWidth = Math.min(50, boxWidth);

  const handleMouseOver = (datum: Stats, valueAccessor: (d: Stats) => number, fieldName: keyof TooltipData) => {
    const value = valueAccessor(datum);
    showTooltip({
      tooltipTop: (yScale(value) ?? 0) + marginTop,
      tooltipLeft: (xScale(xAccessor(datum)) ?? 0) + constrainedWidth / 2 + marginLeft + 5,
      tooltipData: {
        name: xAccessor(datum),
        [fieldName]: value,
      },
    });
  };
  const handleBoxMouseOver = (datum: Stats) => {
    showTooltip({
      tooltipTop: (yScale(medianAccessor(datum)) ?? 0) + marginTop,
      tooltipLeft: (xScale(xAccessor(datum)) ?? 0) + constrainedWidth / 2 + marginLeft + 5,
      tooltipData: {
        ...datum.boxPlot,
        name: xAccessor(datum),
      },
    });
  };


  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <LinearGradient id="statsplot-gradient" to="#8b6ce7" from="#87f2d4" />
        <rect x={0} y={0} width={width} height={height} fill="url(#statsplot-gradient)" rx={14} />
        <PatternLines
          id="hViolinLinesPattern"
          height={3}
          width={3}
          stroke="#ced4da"
          strokeWidth={1}
          orientation={['horizontal']}
        />
        <Group top={marginTop} left={marginLeft}>
          {data.map((d: Stats) => (
            <g key={`stats-${xAccessor(d)}`}>
              <ViolinPlot
                data={d.binData}
                stroke="#dee2e6"
                left={xScale(xAccessor(d))!}
                width={constrainedWidth}
                valueScale={yScale}
                fill="url(#hViolinLinesPattern)"
              />
              <BoxPlot
                min={minAccessor(d)}
                max={maxAccessor(d)}
                left={(xScale(xAccessor(d)) ?? 0) + 0.3 * constrainedWidth}
                firstQuartile={firstQuartileAccessor(d)}
                thirdQuartile={thirdQuartileAccessor(d)}
                median={medianAccessor(d)}
                boxWidth={constrainedWidth * 0.4}
                fill="#FFFFFF"
                fillOpacity={0.3}
                stroke="#FFFFFF"
                strokeWidth={2}
                valueScale={yScale}
                outliers={outliersAccessor(d)}
                minProps={{
                  onMouseOver: () => handleMouseOver(d, minAccessor, 'min'),
                  onMouseLeave: hideTooltip,
                }}
                maxProps={{
                  onMouseOver: () => handleMouseOver(d, maxAccessor, 'max'),
                  onMouseLeave: hideTooltip,
                }}
                boxProps={{
                  onMouseOver: () => handleBoxMouseOver(d),
                  onMouseLeave: hideTooltip,
                }}
                medianProps={{
                  style: { stroke: 'white' },
                  onMouseOver: () => handleMouseOver(d, medianAccessor, 'median'),
                  onMouseLeave: hideTooltip,
                }}
              />
            </g>
          ))}
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white', zIndex: 1000 }}
        >
          <div>
            <strong>{tooltipData.name}</strong>
          </div>
          <div style={{ marginTop: '5px', fontSize: '12px' }}>
            {typeof tooltipData.max === 'number' && <div>max: {tooltipData.max.toFixed(2)}</div>}
            {typeof tooltipData.thirdQuartile === 'number' && <div>third quartile: {tooltipData.thirdQuartile.toFixed(2)}</div>}
            {typeof tooltipData.median === 'number' && <div>median: {tooltipData.median.toFixed(2)}</div>}
            {typeof tooltipData.firstQuartile === 'number' && <div>first quartile: {tooltipData.firstQuartile.toFixed(2)}</div>}
            {typeof tooltipData.min === 'number' && <div>min: {tooltipData.min.toFixed(2)}</div>}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export const Component = withTooltip<ComponentProps, TooltipData>(StatsPlotBase);