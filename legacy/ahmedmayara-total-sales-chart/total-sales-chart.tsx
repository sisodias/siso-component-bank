import React from "react";

import { cn } from "../_utils/cn";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";

const generateSalesData = (period: "1d" | "1w" | "1m" | "3m" | "1y") => {
  const baseSales = 100;
  const dataPoints =
    period === "1d"
      ? 24
      : period === "1w"
        ? 7
        : period === "1m"
          ? 30
          : period === "3m"
            ? 90
            : 365;

  return Array.from({ length: dataPoints }, (_, i) => ({
    time: i,
    sales: baseSales + (Math.random() - 0.3) * 40 + Math.sin(i * 0.2) * 15,
    timestamp: new Date(
      Date.now() - (dataPoints - i) * (period === "1d" ? 3600000 : 86400000),
    ).toISOString(),
  }));
};

const salesChannels: {
  name: string;
  icon: React.ReactNode;
  amount: number;
  change: string;
  isPositive: boolean;
}[] = [
  {
    name: "Online Store",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-4 text-muted-foreground"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          color="currentColor"
        >
          <path d="M3 10.987v4.506c0 2.831 0 4.247.879 5.127c.878.88 2.293.88 5.121.88h6c2.828 0 4.243 0 5.121-.88S21 18.324 21 15.492v-4.505" />
          <path d="M15 16.977c-.684.607-1.773 1-3 1s-2.316-.393-3-1m8.796-14.474L6.15 2.532c-1.738-.09-2.184 1.25-2.184 1.906c0 .586-.075 1.44-1.14 3.045c-1.066 1.605-.986 2.082-.385 3.194c.498.922 1.766 1.282 2.428 1.343c2.1.048 3.122-1.768 3.122-3.045c1.042 3.207 4.005 3.207 5.325 2.84c1.322-.367 2.456-1.682 2.723-2.84c.156 1.44.63 2.279 2.027 2.856c1.449.597 2.694-.316 3.319-.902c.625-.585 1.026-1.885-.088-3.314c-.768-.985-1.089-1.913-1.194-2.875c-.06-.558-.114-1.157-.506-1.538c-.572-.557-1.394-.726-1.801-.7" />
        </g>
      </svg>
    ),
    amount: 52.12,
    change: "+4.5%",
    isPositive: true,
  },
  {
    name: "Facebook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-4 text-muted-foreground"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          color="currentColor"
        >
          <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
          <path d="M16.927 8.026h-2.945a1.9 1.9 0 0 0-1.9 1.886l-.086 11.515m-1.914-7.425h4.803" />
        </g>
      </svg>
    ),
    amount: 38.45,
    change: "-2.8%",
    isPositive: false,
  },
  {
    name: "Instagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className="size-4 text-muted-foreground"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          color="currentColor"
        >
          <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
          <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01" />
        </g>
      </svg>
    ),
    amount: 37.75,
    change: "+3.2%",
    isPositive: true,
  },
];

const chartConfig: ChartConfig = {
  sales: {
    label: "Sales",
    color: "#f97316",
  },
};

export const Component = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "1d" | "1w" | "1m" | "3m" | "1y"
  >("1m");

  const salesData = generateSalesData(selectedPeriod);

  const periods: { label: string; value: "1d" | "1w" | "1m" | "3m" | "1y" }[] =
    [
      { label: "1D", value: "1d" },
      { label: "1W", value: "1w" },
      { label: "1M", value: "1m" },
      { label: "3M", value: "3m" },
      { label: "1Y", value: "1y" },
    ];

  return (
    <Card className="flex w-full max-w-[400px] flex-col gap-0 p-5 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-base font-medium leading-none font-semibold text-muted-foreground">
          Total Sales
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-7.5 px-2.5 text-muted-foreground"
        >
          Report
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex items-center gap-2 pb-2">
          <span className="text-3xl font-medium tracking-tight tabular-nums">
            $128.32
          </span>
          <Badge
            variant="outline"
            className="rounded-full bg-green-100 text-xs text-green-800 dark:bg-green-950 dark:text-green-600"
          >
            +2%
          </Badge>
        </div>

        <div className="group flex w-full -space-x-[1.5px] divide-x overflow-hidden rounded-lg border">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              data-active={selectedPeriod === period.value}
              className="relative flex h-7 flex-1 items-center justify-center bg-transparent text-sm font-semibold tracking-[-0.006em] text-muted-foreground outline-none first:rounded-l-lg last:rounded-r-lg hover:bg-accent/50 data-[active=true]:bg-muted/60 data-[active=true]:text-foreground"
            >
              {period.label}
            </button>
          ))}
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[180px] w-full"
        >
          <LineChart accessibilityLayer data={salesData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--color-border)"
            />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  hideLabel
                  labelFormatter={(value) => {
                    return new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value);
                  }}
                />
              }
              cursor={{ stroke: "#f97316", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#f97316",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>

        <div className="flex flex-col gap-3">
          {salesChannels.map((channel, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {channel.icon}
                <span className="text-sm font-medium text-muted-foreground">
                  {channel.name}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(channel.amount)}
                </span>
                <div className="flex items-center gap-1">
                  {channel.isPositive ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="size-3.5 text-green-600"
                    >
                      <path
                        fill="currentColor"
                        d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="size-3.5 text-destructive"
                    >
                      <path
                        fill="currentColor"
                        d="M11 16.175V5q0-.425.288-.712T12 4t.713.288T13 5v11.175l4.9-4.9q.3-.3.7-.288t.7.313q.275.3.287.7t-.287.7l-6.6 6.6q-.15.15-.325.213t-.375.062t-.375-.062t-.325-.213l-6.6-6.6q-.275-.275-.275-.687T4.7 11.3q.3-.3.713-.3t.712.3z"
                      />
                    </svg>
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      channel.isPositive
                        ? "text-green-600"
                        : "text-destructive",
                    )}
                  >
                    {channel.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
};
