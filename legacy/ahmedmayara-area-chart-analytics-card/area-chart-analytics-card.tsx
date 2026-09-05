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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const generateCampaignData = () => {
  const days = 28;
  return Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    spend: 1500 + (Math.random() - 0.5) * 400,
  }));
};

const chartConfig: ChartConfig = {
  spend: {
    label: "Ad Spend",
    color: "var(--color-cyan-600)",
  },
};

export const Component = () => {
  const campaignData = generateCampaignData();
  return (
    <Card className="flex h-full w-full max-w-[450px] flex-col gap-0 overflow-hidden p-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between px-5 pt-4.5 pb-0">
        <div className="flex flex-row items-center gap-1">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Campaign Data
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 text-muted-foreground/50"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 16.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm1.116-3.041l.1-.408a1.709 1.709 0 01-.25.083 1.176 1.176 0 01-.308.048c-.193 0-.329-.032-.407-.095-.079-.064-.118-.184-.118-.359a3.514 3.514 0 01.118-.672l.373-1.318c.037-.121.062-.255.075-.4a3.73 3.73 0 00.02-.304.866.866 0 00-.292-.678c-.195-.174-.473-.26-.833-.26-.2 0-.412.035-.636.106-.224.07-.459.156-.704.256l-.1.409c.073-.028.16-.057.262-.087.101-.03.2-.045.297-.045.198 0 .331.034.4.1.07.066.105.185.105.354 0 .093-.01.197-.034.31a6.216 6.216 0 01-.084.36l-.374 1.325c-.033.14-.058.264-.073.374-.015.11-.022.22-.022.325 0 .272.1.496.301.673.201.177.483.265.846.265.236 0 .443-.03.621-.092s.417-.152.717-.27zM11.05 7.85a.772.772 0 00.26-.587.78.78 0 00-.26-.59.885.885 0 00-.628-.244.893.893 0 00-.63.244.778.778 0 00-.264.59c0 .23.088.426.263.587a.897.897 0 00.63.243.888.888 0 00.629-.243z"
                    fill="currentColor"
                  />
                </svg>
              </TooltipTrigger>
              <TooltipContent showArrow className="max-w-70">
                <p className="text-xs">
                  This chart shows your ad spend for the last 28 days. Hover over each point
                  to see the exact daily spend. Use this data to track trends and optimize
                  your campaign performance.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button variant="outline" size="sm" className="h-8 px-3 text-sm">
          Details
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex items-center gap-3 px-5">
          <span className="text-2xl font-medium tracking-tight tabular-nums">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(17.5e2)}
          </span>
          <Badge className="rounded-full bg-green-100 text-xs text-green-800 dark:bg-green-950 dark:text-green-600">
            Last 28 days
          </Badge>
        </div>

        <div className="grid h-[95px] grid-cols-[1fr_150px] border-t border-border">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-auto w-full"
          >
            <AreaChart
              accessibilityLayer
              data={campaignData}
              margin={{
                right: -5,
              }}
            >
              <XAxis hide />
              <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(value as number)
                    }
                  />
                }
                cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
              />
              <Area
                type="linear"
                dataKey="spend"
                stroke={chartConfig.spend.color}
                fill={chartConfig.spend.color}
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: chartConfig.spend.color,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
          <div className="flex flex-col items-start justify-end border-l-2 border-cyan-600 px-4 pb-4">
            <div className="text-sm font-semibold tracking-[-0.006em] text-foreground">
              45%
            </div>
            <div className="text-xs font-medium tracking-[-0.006em] text-muted-foreground">
              $32.9K used
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
