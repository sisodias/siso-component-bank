// src/components/ui/component.tsx

import React from 'react';
import { Polygon } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand } from '@visx/scale';
import { GradientPinkRed } from '@visx/gradient';

const defaultBackgroundColor = '#7f82e3';
const defaultPolygonSize = 35;
const defaultMarginValues = { top: 20, right: 20, bottom: 20, left: 20 };

const polygonsData = [
  { sides: 3, fill: '#aeeef8', rotate: 0, id: 'tri' },
  { sides: 4, fill: '#e5fd3d', rotate: 0, id: 'sqr' },
  { sides: 6, fill: '#e582ff', rotate: 0, id: 'hex' },
  { sides: 8, fill: 'url(#polygon-gradient-pink-red)', rotate: 0, id: 'oct' },
];

export interface ComponentProps {
  width: number;
  height: number;
  margin?: typeof defaultMarginValues;
  backgroundColor?: string;
  polygonSize?: number;
}

export const Component: React.FC<ComponentProps> = ({
  width,
  height,
  margin = defaultMarginValues,
  backgroundColor = defaultBackgroundColor,
  polygonSize = defaultPolygonSize,
}) => {
  if (width < 10 || height < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (innerHeight <= 0 || innerWidth <= 0) return null;

  const yScale = scaleBand<number>({
    domain: polygonsData.map((_, i) => i),
    range: [0, innerHeight],
    paddingInner: 0.5, 
    paddingOuter: 0.25, 
  });

  const centerX = innerWidth / 2;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <rect width={width} height={height} fill={backgroundColor} rx={14} />
      <GradientPinkRed id="polygon-gradient-pink-red" />
      {polygonsData.map((polygon, i) => {
        const yBandStart = yScale(i) || 0;
        const bandHeight = yScale.bandwidth();
        const polygonCenterYInBand = bandHeight / 2;
        const groupTopPosition = margin.top + yBandStart + polygonCenterYInBand;

        return (
          <Group
            key={`polygon-group-${polygon.id}-${i}`}
            top={groupTopPosition}
            left={margin.left + centerX}
          >
            <Polygon
              sides={polygon.sides}
              size={polygonSize}
              fill={polygon.fill}
              rotate={polygon.rotate}
            />
          </Group>
        );
      })}
    </svg>
  );
};