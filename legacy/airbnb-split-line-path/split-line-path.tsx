// src/components/ui/component.tsx

import React, { useMemo } from 'react';
import { chunk } from 'lodash';
import { curveCardinal } from '@visx/curve';
import { LinePath, SplitLinePath } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import { SplitLinePathRenderer, SplitLinePathStyles } from '@visx/shape/lib/shapes/SplitLinePath';

export type Point = { x: number; y: number };

interface GenerateSinSegmentsProps {
  width: number; height: number; numberOfWaves: number; pointsPerWave: number;
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
}

function generateSinSegments({
  width, height, numberOfWaves, pointsPerWave, direction = 'left-to-right',
}: GenerateSinSegmentsProps): Point[][] {
  const segments: Point[][] = [];
  const totalPoints = numberOfWaves * pointsPerWave;
  if (width <= 0 || height <= 0 || numberOfWaves <= 0 || pointsPerWave <= 0) return [];
  for (let w = 0; w < numberOfWaves; w++) {
    const segment: Point[] = [];
    for (let i = 0; i < pointsPerWave; i++) {
      const p = w * pointsPerWave + i;
      let x = 0, y = 0;
      const progress = totalPoints > 1 ? p / (totalPoints - 1) : 0;
      switch (direction) {
        case 'top-to-bottom':
          x = (width / 2) + (Math.sin((p / pointsPerWave) * 2 * Math.PI + (w * Math.PI / 4)) * width * 0.4);
          y = progress * height;
          break;
        case 'bottom-to-top':
          x = (width / 2) + (Math.sin((p / pointsPerWave) * 2 * Math.PI + (w * Math.PI / 4)) * width * 0.4);
          y = (1 - progress) * height;
          break;
        case 'right-to-left':
          x = (1 - progress) * width;
          y = (height / 2) + (Math.sin((p / pointsPerWave) * 2 * Math.PI + (w * Math.PI / 4)) * height * 0.4);
          break;
        default: // left-to-right
          x = progress * width;
          y = (height / 2) + (Math.sin((p / pointsPerWave) * 2 * Math.PI + (w * Math.PI / 4)) * height * 0.4);
          break;
      }
      segment.push({ x, y });
    }
    segments.push(segment);
  }
  return segments;
}

interface GenerateSnakePathProps { width: number; height: number; step: number; }

function generateSnakePath({ width, height, step }: GenerateSnakePathProps): Point[] {
  const path: Point[] = [];
  let x = 0, y = 0;
  let dx = step, dy = 0;
  if (step <= 0 || width < 0 || height < 0) return [{ x: 0, y: 0 }];
  path.push({ x, y });
  const maxIterations = (Math.ceil(width / step) + Math.ceil(height / step)) * 4 + 10;
  let iterations = 0;
  while (iterations < maxIterations) {
    iterations++;
    let movedInLoop = false;
    const currentX = x; const currentY = y;
    if (dx > 0) { if (x + dx <= width) { x += dx; } else { x = width; dx = 0; dy = step; } }
    else if (dx < 0) { if (x + dx >= 0) { x += dx; } else { x = 0; dx = 0; dy = -step; } }
    else if (dy > 0) { if (y + dy <= height) { y += dy; } else { y = height; dy = 0; dx = -step; } }
    else if (dy < 0) { if (y + dy >= 0) { y += dy; } else { y = 0; dy = 0; dx = step; } }
    if (x !== currentX || y !== currentY) { path.push({ x, y }); movedInLoop = true; }
    if (!movedInLoop && path.length > 1) break;
    if (x === width && y === height && dx === 0 && dy === 0 && path.length > 1) break;
    if (x === 0 && y === 0 && dx === 0 && dy === 0 && path.length > 1) break;
  }
  return path;
}

const getX = (d: Point) => d.x;
const getY = (d: Point) => d.y;
const colorBackground = '#045275';
const colorBackgroundLight = '#089099';
const colorForeground = '#b7e6a5';
const PADDING = 30;

const renderNumberSegment: SplitLinePathRenderer<Point> = ({ segment }) => (
  <g>{segment.map(({ x, y }, i) => i % 25 === 0 ? (<g key={`num-${i}`} transform={`translate(${x},${y})`}><circle r={2} fill="#222" /><text dx={3} dy={3} fontSize={8} fill="white">{i}</text></g>) : null)}</g>
);
const renderCircleSegment: SplitLinePathRenderer<Point> = ({ segment, styles }) => (
  <g>{segment.map(({ x, y }, i) => i % 8 === 0 ? (<circle key={`circle-${i}`} cx={x} cy={y} r={Math.max(0.1, 10 * (i / segment.length))} stroke={styles?.stroke} fill="transparent" strokeWidth={1}/>) : null)}</g>
);

export interface ComponentProps {
  width: number;
  height: number;
  numberOfWaves?: number;
  pointsPerWave?: number;
}

export const Component: React.FC<ComponentProps> = ({
  width,
  height,
  numberOfWaves = 10,
  pointsPerWave = 100,
}) => {
  const data = useMemo(() => {
    const halfWidth = width / 2 - PADDING * 2;
    const halfHeight = height / 2 - PADDING * 2;
    const quarterWidth = width / 4;
    const quarterHeight = height / 4;
    if (halfWidth <= 0 || halfHeight <= 0 || quarterWidth <= 0 || quarterHeight <= 0) {
      return { leftToRight: [], rightToLeft: [], topToBottom: [], bottomToTop: [], snake: [] };
    }
    return {
      leftToRight: generateSinSegments({ width: halfWidth, height: halfHeight, numberOfWaves, pointsPerWave }),
      rightToLeft: generateSinSegments({ width: halfWidth, height: halfHeight, numberOfWaves, pointsPerWave, direction: 'right-to-left' }),
      topToBottom: generateSinSegments({ width: halfWidth, height: halfHeight, numberOfWaves: 5, pointsPerWave, direction: 'top-to-bottom' }),
      bottomToTop: generateSinSegments({ width: halfWidth, height: halfHeight, numberOfWaves: 5, pointsPerWave, direction: 'bottom-to-top' }),
      snake: chunk(generateSnakePath({ width: quarterWidth, height: quarterHeight, step: 20 }), 8),
    };
  }, [width, height, numberOfWaves, pointsPerWave]);

  if (width < 10 || height < 10) return null;

  const commonStyles: SplitLinePathStyles[] = [
    { stroke: colorForeground, strokeWidth: 3 }, { stroke: '#fff', strokeWidth: 2, strokeDasharray: '9,5' }, { stroke: colorBackground, strokeWidth: 2 },
  ];
  const isValidSegmentData = (segmentArray: Point[][]) => segmentArray && segmentArray.length > 0 && segmentArray.flat().length > 0;

  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient id="visx-splitlinepath-gradient-maincomp" from={colorBackground} to={colorBackgroundLight} fromOpacity={0.8} toOpacity={0.8} />
        <rect x={0} y={0} width={width} height={height} fill="url(#visx-splitlinepath-gradient-maincomp)" rx={14} />

        {isValidSegmentData(data.leftToRight) && (
          <g transform={`translate(${PADDING}, ${height / 4})`}>
            <LinePath data={data.leftToRight.flat()} x={getX} y={getY} strokeWidth={8} stroke="#fff" strokeOpacity={0.15} curve={curveCardinal} />
            <SplitLinePath<Point> segments={data.leftToRight} segmentation="x" x={getX} y={getY} curve={curveCardinal} styles={commonStyles}>
              {({ segment, styles, index }) => index === numberOfWaves - 1 || index === 2 ? renderCircleSegment({ segment, styles, index }) : <LinePath data={segment} x={getX} y={getY} {...styles} />}
            </SplitLinePath>
            <text dy="0.3em" fontSize={10} fontWeight="bold" textAnchor="middle" fill="white">Start</text>
          </g>
        )}
        {isValidSegmentData(data.rightToLeft) && (
          <g transform={`translate(${width / 2 + PADDING}, ${height / 4})`}>
            <LinePath data={data.rightToLeft.flat()} x={getX} y={getY} strokeWidth={8} stroke="#fff" strokeOpacity={0.15} curve={curveCardinal} />
            <SplitLinePath<Point> segments={data.rightToLeft} segmentation="x" x={getX} y={getY} curve={curveCardinal} styles={commonStyles}>
              {({ segment, styles, index }) => index === numberOfWaves - 1 || index === 2 ? renderNumberSegment({ segment, styles, index }) : <LinePath data={segment} x={getX} y={getY} {...styles} />}
            </SplitLinePath>
            <text dy="0.3em" fontSize={10} fontWeight="bold" textAnchor="middle" fill="white">Start</text>
          </g>
        )}
        {isValidSegmentData(data.topToBottom) && (
          <g transform={`translate(${PADDING}, ${(height * 3) / 4})`}>
            <LinePath data={data.topToBottom.flat()} x={getX} y={getY} strokeWidth={8} stroke="#fff" strokeOpacity={0.15} curve={curveCardinal} />
            <SplitLinePath<Point> segments={data.topToBottom} segmentation="y" x={getX} y={getY} curve={curveCardinal} styles={commonStyles}>
              {({ segment, styles, index }) => index === 5 - 1 || index === 2 ? renderNumberSegment({ segment, styles, index }) : <LinePath data={segment} x={getX} y={getY} {...styles} />}
            </SplitLinePath>
            <text dy="0.3em" fontSize={10} fontWeight="bold" textAnchor="middle" fill="white">Start</text>
          </g>
        )}
        {isValidSegmentData(data.bottomToTop) && (
          <g transform={`translate(${width / 2 + PADDING}, ${(height * 3) / 4})`}>
            <LinePath data={data.bottomToTop.flat()} x={getX} y={getY} strokeWidth={8} stroke="#fff" strokeOpacity={0.15} curve={curveCardinal} />
            <SplitLinePath<Point> segments={data.bottomToTop} segmentation="y" x={getX} y={getY} curve={curveCardinal} styles={commonStyles}>
              {({ segment, styles, index }) => index === 5 - 1 || index === 2 ? renderCircleSegment({ segment, styles, index }) : <LinePath data={segment} x={getX} y={getY} {...styles} />}
            </SplitLinePath>
            <text dy="0.3em" fontSize={10} fontWeight="bold" textAnchor="middle" fill="white">Start</text>
          </g>
        )}
        {isValidSegmentData(data.snake) && (
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            <g transform={`translate(${-width / 8}, ${-height / 8})`}>
              <LinePath data={data.snake.flat()} x={getX} y={getY} strokeWidth={8} stroke="#fff" strokeOpacity={0.15} />
              <SplitLinePath<Point> segments={data.snake} segmentation="length" x={getX} y={getY} styles={commonStyles} />
              <text dy="0.3em" fontSize={10} fontWeight="bold" textAnchor="middle" fill="white">Start</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};