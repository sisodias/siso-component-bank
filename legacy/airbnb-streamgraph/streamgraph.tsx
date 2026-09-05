import React, { useCallback, useState } from 'react';
import { Stack } from '@visx/shape';
import { PatternCircles, PatternWaves } from '@visx/pattern';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { transpose } from '@visx/vendor/d3-array';
import { animated, useSpring } from '@react-spring/web';


const useForceUpdate = () => {
  const [, update] = useState(0);
  return useCallback(() => update((prev) => prev + 1), []);
};

const generateData = (numSamples: number, numBumps: number) => {
  const data = new Array(numSamples);

  for (let i = 0; i < numSamples; ++i) {
    data[i] = 0;
  }

  for (let i = 0; i < numBumps; ++i) {
    const x = Math.random() * numSamples;
    const y = Math.random() * 0.1 + 0.1;
    const sigma = Math.random() * numSamples * 0.1;
    for (let j = 0; j < numSamples; ++j) {
      data[j] += y * Math.exp(-Math.pow(j - x, 2) / (2 * sigma * sigma));
    }
  }

  return data;
};


const NUM_LAYERS = 20;
const SAMPLES_PER_LAYER = 200;
const BUMPS_PER_LAYER = 10;
export const BACKGROUND = '#ffdede'; 

const range = (n: number) => Array.from(new Array(n), (_, i) => i);

const keys = range(NUM_LAYERS);

const xScale = scaleLinear<number>({
  domain: [0, SAMPLES_PER_LAYER - 1],
});
const yScale = scaleLinear<number>({
  domain: [-5, 5],
});
const colorScale = scaleOrdinal<number, string>({
  domain: keys,
  range: ['#ffc409', '#f14702', '#262d97', 'white', '#036ecd', '#9ecadd', '#51666e'],
});
const patternScale = scaleOrdinal<number, string>({
  domain: keys,
  range: ['mustard', 'cherry', 'navy', 'circles', 'circles', 'circles', 'circles'],
});

// accessors
type Datum = number[];
const getY0 = (d: Datum) => yScale(d[0]) ?? 0;
const getY1 = (d: Datum) => yScale(d[1]) ?? 0;

export type StreamGraphProps = {
  width: number;
  height: number;
  animate?: boolean;
};

export const Streamgraph = ({ width, height, animate = true }: StreamGraphProps) => {
  const forceUpdate = useForceUpdate();
  const handlePress = () => forceUpdate();

  if (width < 10) return null;

  xScale.range([0, width]);
  yScale.range([height, 0]);

  // generate layers in render to update on touch
  const layers = transpose<number>(
    keys.map(() => generateData(SAMPLES_PER_LAYER, BUMPS_PER_LAYER)),
  );

  return (
    <svg width={width} height={height}>
      <PatternCircles id="mustard" height={50} width={50} radius={5} fill="#036ecf" complement />
      <PatternWaves
        id="cherry"
        height={12}
        width={12}
        fill="transparent"
        stroke="#232493"
        strokeWidth={1}
      />
      <PatternCircles id="navy" height={70} width={60} radius={10} fill="white" complement />
      <PatternCircles
        complement
        id="circles"
        height={60}
        width={60}
        radius={10}
        fill="transparent"
      />

      <g onClick={handlePress} onTouchStart={handlePress}>
        <rect x={0} y={0} width={width} height={height} fill={BACKGROUND} rx={14} />
        <Stack<number[], number>
          data={layers}
          keys={keys}
          offset="wiggle"
          color={colorScale}
          x={(_, i) => xScale(i) ?? 0}
          y0={getY0}
          y1={getY1}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => {
              const pathString = path(stack) || '';
              const tweened = animate ? useSpring({ pathString }) : { pathString };
              const color = colorScale(stack.key);
              const pattern = patternScale(stack.key);
              return (
                <g key={`series-${stack.key}`}>
                  <animated.path d={tweened.pathString} fill={color} />
                  <animated.path d={tweened.pathString} fill={`url(#${pattern})`} />
                </g>
              );
            })
          }
        </Stack>
      </g>
    </svg>
  );
};