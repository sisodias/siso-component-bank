// components/ui/component.tsx
import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { curveBasis } from '@visx/curve';
import { LinePath } from '@visx/shape';
import { Threshold } from '@visx/threshold';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { cityTemperature, CityTemperature } from '@visx/mock-data/';

export const background = '#f3f3f3';

const date = (d: CityTemperature) => new Date(d.date).valueOf();
const ny = (d: CityTemperature) => Number(d['New York']);
const sf = (d: CityTemperature) => Number(d['San Francisco']);

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };

export type ComponentProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const Component = ({ width, height, margin = defaultMargin }: ComponentProps) => {
  if (width < 10) return null;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const timeScale = useMemo(() => scaleTime<number>({
    domain: [Math.min(...cityTemperature.map(date)), Math.max(...cityTemperature.map(date))],
    range: [0, xMax],
  }), [xMax]);

  const temperatureScale = useMemo(() => scaleLinear<number>({
    domain: [
      Math.min(...cityTemperature.map((d) => Math.min(ny(d), sf(d)))),
      Math.max(...cityTemperature.map((d) => Math.max(ny(d), sf(d)))),
    ],
    nice: true,
    range: [yMax, 0],
  }), [yMax]);

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={temperatureScale} width={xMax} height={yMax} stroke="#e0e0e0" />
          <GridColumns scale={timeScale} width={xMax} height={yMax} stroke="#e0e0e0" />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
          <AxisBottom top={yMax} scale={timeScale} numTicks={width > 520 ? 10 : 5} />
          <AxisLeft scale={temperatureScale} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Temperature (°F)
          </text>
          <Threshold<CityTemperature>
            id={`${Math.random()}`}
            data={cityTemperature}
            x={(d) => timeScale(date(d)) ?? 0}
            y0={(d) => temperatureScale(ny(d)) ?? 0}
            y1={(d) => temperatureScale(sf(d)) ?? 0}
            clipAboveTo={0}
            clipBelowTo={yMax}
            curve={curveBasis}
            belowAreaProps={{
              fill: 'violet',
              fillOpacity: 0.4,
            }}
            aboveAreaProps={{
              fill: 'green',
              fillOpacity: 0.4,
            }}
          />
          <LinePath
            data={cityTemperature}
            curve={curveBasis}
            x={(d) => timeScale(date(d)) ?? 0}
            y={(d) => temperatureScale(sf(d)) ?? 0}
            stroke="#222"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="1,2"
          />
          <LinePath
            data={cityTemperature}
            curve={curveBasis}
            x={(d) => timeScale(date(d)) ?? 0}
            y={(d) => temperatureScale(ny(d)) ?? 0}
            stroke="#222"
            strokeWidth={1.5}
          />
        </Group>
      </svg>
    </div>
  );
};