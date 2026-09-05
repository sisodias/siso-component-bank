"use client";
/* Area Chart — https://www.subframe.com/library/components/area-chart */

import React from "react";
import * as SubframeCore from "@subframe/core";

/* local utils */
const SubframeUtils = {
  twClassNames: SubframeCore.createTwClassNames([
    "text-caption",
    "text-caption-bold",
    "text-body",
    "text-body-bold",
    "text-heading-3",
    "text-heading-2",
    "text-heading-1",
    "text-monospace-body",
  ]),
};

type DataPoint = Record<string, string | number>;

interface AreaChartRootProps
  extends Omit<
    React.ComponentProps<typeof SubframeCore.AreaChart>,
    "data" | "categories" | "index"
  > {
  data?: DataPoint[];
  categories?: string[];
  index?: string;
  stacked?: boolean;
  className?: string;
}

/* safe defaults */
const defaultIndex = "Year";
const defaultCategories = ["Psychology", "Business", "Biology"];
const defaultData: DataPoint[] = [
  { Year: "2018", Psychology: 125, Business: 120, Biology: 90 },
  { Year: "2019", Psychology: 110, Business: 130, Biology: 85 },
  { Year: "2020", Psychology: 135, Business: 100, Biology: 95 },
  { Year: "2021", Psychology: 105, Business: 115, Biology: 120 },
  { Year: "2022", Psychology: 140, Business: 125, Biology: 130 },
];

const AreaChartRoot = React.forwardRef<
  React.ElementRef<typeof SubframeCore.AreaChart>,
  AreaChartRootProps
>(function AreaChartRoot(
  {
    data = defaultData,
    categories = defaultCategories,
    index = defaultIndex,
    stacked = false,
    className,
    ...otherProps
  }: AreaChartRootProps,
  ref
) {
  return (
    <SubframeCore.AreaChart
      className={SubframeUtils.twClassNames("h-80 w-full", className)}
      ref={ref}
      data={data}
      categories={categories}
      index={index}
      stacked={stacked}
      colors={["#0c6d62", "#12a594", "#10b3a3", "#0b544a"]}
      dark
      {...otherProps}
    />
  );
});

export const AreaChart = AreaChartRoot;
export default AreaChart;
