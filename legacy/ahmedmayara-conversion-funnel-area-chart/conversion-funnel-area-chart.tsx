import { cn } from "../_utils/cn";
import { useTheme } from "next-themes";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";

const conversionData = [
  { month: "JAN", addedToCart: 2000, reachedCheckout: 1000 },
  { month: "FEB", addedToCart: 1200, reachedCheckout: 800 },
  { month: "MAR", addedToCart: 2200, reachedCheckout: 1500 },
  { month: "APR", addedToCart: 800, reachedCheckout: 500 },
  { month: "MAY", addedToCart: 2400, reachedCheckout: 2000 },
  { month: "JUN", addedToCart: 1500, reachedCheckout: 1100 },
  { month: "JUL", addedToCart: 4200, reachedCheckout: 3000 },
  { month: "AUG", addedToCart: 3500, reachedCheckout: 2500 },
  { month: "SEP", addedToCart: 5800, reachedCheckout: 4500 },
  { month: "OCT", addedToCart: 1000, reachedCheckout: 800 },
  { month: "NOV", addedToCart: 3500, reachedCheckout: 2500 },
  { month: "DEC", addedToCart: 200, reachedCheckout: 100 },
];

const conversionMetrics = [
  {
    name: "Added to Cart",
    value: 3842,
    change: "+1.8%",
    isPositive: true,
  },
  {
    name: "Reached Checkout",
    value: 1256,
    change: "-1.2%",
    isPositive: false,
  },
];

const chartConfig: ChartConfig = {
  addedToCart: {
    label: "Added to Cart",
    color: "#10b981",
  },
  reachedCheckout: {
    label: "Reached Checkout",
    color: "#a7f3d0",
  },
};

const monthMap: Record<string, string> = {
  JAN: "January",
  FEB: "February",
  MAR: "March",
  APR: "April",
  MAY: "May",
  JUN: "June",
  JUL: "July",
  AUG: "August",
  SEP: "September",
  OCT: "October",
  NOV: "November",
  DEC: "December",
};

export const Component = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { theme } = useTheme();
  return (
    <Card 
      className={cn(
        "flex w-full flex-col h-[310px] gap-0 p-6 shadow-none",
        className,
      )}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-base font-medium text-muted-foreground">
          Conversion Rate
        </CardTitle>
        <Button variant="outline" size="sm" className="h-8 px-3 text-sm">
          Details
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-medium leading-none tracking-tight tabular-nums">
            16.9%
          </span>
          <Badge className="rounded-full bg-green-100 text-xs text-green-800 dark:bg-green-950 dark:text-green-600 hover:bg-green-200">
            +2.1%
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {conversionMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-sm font-medium tracking-[-0.006em] text-muted-foreground">
                {metric.name}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {metric.value.toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  {metric.isPositive ? (
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
                      metric.isPositive ? "text-green-600" : "text-destructive",
                    )}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative w-full">
          <div
            className="absolute inset-0 h-[112px] overflow-hidden rounded-lg ring-1 ring-border ring-inset"
            style={{
              background:
                "linear-gradient(90deg, var(--color-border) 1px, #0000 1px 100%) 0 0 / calc(100% / 6) 112px repeat no-repeat, linear-gradient(180deg, var(--color-border) 1px, #0000 1px 100%) 0 0 / 100% calc(112px / 4) no-repeat repeat",
            }}
          >
            <ChartContainer
              id="conversion-rate-chart"
              config={chartConfig}
              className="aspect-auto h-[120px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={conversionData}
                margin={{ right: 4 }}
              >
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        monthMap[value as keyof typeof monthMap]
                      }
                      indicator="line"
                      className="min-w-[200px]"
                    />
                  }
                />
                <Area
                  dataKey="addedToCart"
                  type="linear"
                  fill={chartConfig.addedToCart.color}
                  fillOpacity={0.8}
                  stroke={chartConfig.addedToCart.color}
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="reachedCheckout"
                  type="linear"
                  fill={chartConfig.reachedCheckout.color}
                  fillOpacity={theme === "dark" ? 0.6 : 1}
                  stroke={chartConfig.reachedCheckout.color}
                  strokeWidth={2}
                  strokeOpacity={0.2}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
