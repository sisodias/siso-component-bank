// src/components/ui/radial-bars-component.tsx
import React, { useMemo, useState } from 'react';
import { Arc } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientLightgreenGreen } from '@visx/gradient';
import { scaleBand, scaleRadial } from '@visx/scale';
import { Text } from '@visx/text';
import { cn } from "../_utils/cn"; 
const toRadians = (x: number) => (x * Math.PI) / 180;
const toDegrees = (x: number) => (x * 180) / Math.PI;

const defaultMargin = { top: 20, bottom: 20, left: 20, right: 20 };
const defaultBarColor = '#93F9B9';
const defaultInnerRadiusRatio = 1 / 3;

export interface RadialBarsComponentProps<Datum> {
  width: number;
  height: number;
  data: Datum[];
  getCategory: (d: Datum) => string;
  getValue: (d: Datum) => number;
  showControls?: boolean;
  margin?: { top: number; bottom: number; left: number; right: number };
  barColor?: string;
  innerRadiusRatio?: number; 
  initialRotation?: number; 
  initialSortByCategory?: boolean;
}

export const Component = <Datum,>({
  width,
  height,
  data,
  getCategory,
  getValue,
  showControls = true,
  margin = defaultMargin,
  barColor = defaultBarColor,
  innerRadiusRatio = defaultInnerRadiusRatio,
  initialRotation = 0, 
  initialSortByCategory = true,
}: RadialBarsComponentProps<Datum>) => {
  const [rotation, setRotation] = useState(toRadians(initialRotation)); 
  const [sortByCategory, setSortByCategory] = useState(initialSortByCategory);

  const categorySort = (a: Datum, b: Datum) => getCategory(a).localeCompare(getCategory(b));
  const valueSort = (a: Datum, b: Datum) => getValue(b) - getValue(a);

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radiusMax = Math.min(xMax, yMax) / 2;
  const innerRadius = radiusMax * innerRadiusRatio;

  const xDomain = useMemo(
    () => data.slice().sort(sortByCategory ? categorySort : valueSort).map(getCategory),
    [data, sortByCategory, categorySort, valueSort, getCategory], 
  );

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0 + rotation, 2 * Math.PI + rotation],
        domain: xDomain,
        padding: 0.2,
      }),
    [rotation, xDomain],
  );

  const yScale = useMemo(
    () =>
      scaleRadial<number>({
        range: [innerRadius, radiusMax],
        domain: [0, Math.max(...data.map(getValue), 0)],
      }),
    [innerRadius, radiusMax, data, getValue], 
  );

  if (width < 10 || height < 10 || radiusMax <= 0) return null;

  return (
    <>
      <svg width={width} height={height}>
        <GradientLightgreenGreen id="radial-bars-green-gradient" />
        <rect width={width} height={height} fill="url(#radial-bars-green-gradient)" rx={14} />
        <Group top={yMax / 2 + margin.top} left={xMax / 2 + margin.left}>
          {data.map((d, i) => {
            const category = getCategory(d);
            const value = getValue(d);

            const startAngle = xScale(category);
            if (startAngle === undefined) return null;

            const midAngle = startAngle + xScale.bandwidth() / 2;
            const endAngle = startAngle + xScale.bandwidth();
            const outerRadius = yScale(value) ?? innerRadius; 
            const textRadius = outerRadius + 4; 
            const textX = textRadius * Math.cos(midAngle - Math.PI / 2);
            const textY = textRadius * Math.sin(midAngle - Math.PI / 2);

            return (
              <React.Fragment key={`bar-segment-${category}-${i}`}>
                <Arc
                  cornerRadius={4}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius > 0 ? innerRadius : 0.1} 
                  fill={barColor}
                />
                <Text
                  x={textX}
                  y={textY}
                  dominantBaseline="middle" 
                  textAnchor="middle"
                  fontSize={10} 
                  fontWeight="bold"
                  fill={barColor} 
                  angle={toDegrees(midAngle)}
                  angleDeg={toDegrees(midAngle)} 
                >
                  {category}
                </Text>
              </React.Fragment>
            );
          })}
        </Group>
      </svg>
      {showControls && (
        <div className={cn("radial-bars-controls p-4 space-y-2 text-sm bg-gray-50 rounded-b-lg")}>
          <div>
            <label className="flex items-center space-x-2">
              <strong>Rotate:</strong>
              <input
                type="range"
                min="0"
                max="360"
                className="w-full"
                value={toDegrees(rotation)}
                onChange={(e) => setRotation(toRadians(Number(e.target.value)))}
              />
              <span>{toDegrees(rotation).toFixed(0)}°</span>
            </label>
          </div>
          <div>
            <strong>Sort bars:</strong>
            <div className="flex space-x-4 mt-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name={`sort-type-${width}-${height}`} 
                  checked={sortByCategory}
                  onChange={() => setSortByCategory(true)}
                />
                <span>By Category</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name={`sort-type-${width}-${height}`} 
                  checked={!sortByCategory}
                  onChange={() => setSortByCategory(false)}
                />
                <span>By Value</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};