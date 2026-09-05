import React from "react";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const generateStockData = (period: "1d" | "1w" | "1m" | "3m" | "1y") => {
  const basePrice = 440;
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
    price: basePrice + (Math.random() - 0.5) * 10 + Math.sin(i * 0.1) * 5,
    timestamp: new Date(
      Date.now() - (dataPoints - i) * (period === "1d" ? 3600000 : 86400000),
    ).toISOString(),
  }));
};

const chartConfig: ChartConfig = {
  price: {
    label: "Price",
    color: "#f43f5e",
  },
};

export const Component = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "1d" | "1w" | "1m" | "3m" | "1y"
  >("3m");
  const [selectedCompany, setSelectedCompany] =
    React.useState<string>("acme-tech-inc");

  const stockData = generateStockData(selectedPeriod);

  const periods: { label: string; value: "1d" | "1w" | "1m" | "3m" | "1y" }[] =
    [
      { label: "1D", value: "1d" },
      { label: "1W", value: "1w" },
      { label: "1M", value: "1m" },
      { label: "3M", value: "3m" },
      { label: "1Y", value: "1y" },
    ];

  const highestPrice = Math.max(...stockData.map((d) => d.price));
  const lowestPrice = Math.min(...stockData.map((d) => d.price));

  return (
    <Card className="flex w-full max-w-[480px] flex-col gap-6 p-5 shadow-none md:p-6">
      <CardHeader className="flex flex-col items-start gap-4.5 p-0 md:flex-row md:items-center md:justify-between md:gap-0">
        <CardTitle className="flex items-center gap-2 text-base leading-none font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="size-5"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
              <path strokeLinecap="round" d="M7 18V9m5 9V6m5 12v-5" />
            </g>
          </svg>

          <span>Stock Market Tracker</span>
        </CardTitle>

        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger size="sm" className="w-full md:w-[150px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="acme-tech-inc">Acme Tech Inc.</SelectItem>
              <SelectItem value="techcorp">TechCorp</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-0">
        <div className="group flex w-full -space-x-[1.5px] divide-x overflow-hidden rounded-lg border">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              data-active={selectedPeriod === period.value}
              className="relative flex h-8 flex-1 items-center justify-center bg-transparent text-sm font-semibold tracking-[-0.006em] text-muted-foreground outline-none first:rounded-l-lg last:rounded-r-lg hover:bg-accent/50 data-[active=true]:bg-muted/60 data-[active=true]:text-foreground"
            >
              {period.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold tracking-[-0.006em] tabular-nums">
              $440,364.20
            </span>
            <span className="inline-flex h-6 items-center justify-center gap-1.5 rounded-md bg-[#E0FAEC] px-2 text-xs font-medium tracking-[-0.006em] whitespace-nowrap text-[#22C55E] dark:bg-emerald-900/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="size-3.5"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M6 18L18 6m0 0H9m9 0v9"
                />
              </svg>
              0.48%
            </span>
          </div>
          <p className="text-sm font-normal tracking-[-0.006em] text-muted-foreground uppercase">
            {selectedCompany === "acme-tech-inc"
              ? "Acme Tech Inc. (ACME)"
              : "TechCorp"}
          </p>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[225px] w-full"
        >
          <LineChart accessibilityLayer data={stockData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator hideLabel />}
              cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>

        <div className="group flex w-full -space-x-[1.5px] divide-x overflow-hidden rounded-lg border">
          <button className="relative flex h-8 flex-1 items-center justify-center bg-transparent text-sm font-semibold tracking-[-0.006em] text-muted-foreground outline-none first:rounded-l-lg last:rounded-r-lg hover:bg-accent/50">
            <span className="font-normal text-muted-foreground">Highest</span>
            <span className="ml-1.5 text-foreground">
              {highestPrice.toFixed(3)}
            </span>
          </button>

          <button className="relative flex h-8 flex-1 items-center justify-center bg-transparent text-sm font-semibold tracking-[-0.006em] text-muted-foreground outline-none first:rounded-l-lg last:rounded-r-lg hover:bg-accent/50">
            <span className="font-normal text-muted-foreground">Lowest</span>
            <span className="ml-1.5 text-foreground">
              {lowestPrice.toFixed(3)}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
