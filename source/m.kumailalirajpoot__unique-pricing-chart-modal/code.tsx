"use client"

import NumberFlow from "@number-flow/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"
import React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A reusable line chart with step style"

interface ChartLineStepProps {
  data?: { month: string; value: number }[]
  color?: string
}

export function ChartLineStep({ data = [], color = "var(--foreground)" }: ChartLineStepProps) {
  const normalizedData = data.map((item) => ({
    month: item.month,
    desktop: item.value,
  }))

  const chartConfig = {
    desktop: {
      label: "Users",
      color,
    },
  } satisfies ChartConfig

  return (
    <Card className="h-fit border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={normalizedData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.2} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              style={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="step"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


export function PricingInteractionRow({
  starterMonth,
  starterAnnual,
  proMonth,
  proAnnual,
}: {
  starterMonth: number
  starterAnnual: number
  proMonth: number
  proAnnual: number
}) {
  const [active, setActive] = React.useState(1)
  const [period, setPeriod] = React.useState(0)
  const [starter, setStarter] = React.useState(starterMonth)
  const [pro, setPro] = React.useState(proMonth)

  const handleChangePlan = (index: number) => setActive(index)
  const handleChangePeriod = (index: number) => {
    setPeriod(index)
    if (index === 0) {
      setStarter(starterMonth)
      setPro(proMonth)
    } else {
      setStarter(starterAnnual)
      setPro(proAnnual)
    }
  }

  // ✅ Plans with unique chart data
  const plans = [
    {
      name: "Free",
      price: 0,
      isPopular: false,
      color: "hsl(var(--chart-2))",
      chartData: [
        { month: "Jan", value: 20 },
        { month: "Feb", value: 15 },
        { month: "Mar", value: 58 },
        { month: "Apr", value: 25 },
        { month: "May", value: 53 },
        { month: "Jun", value: 97 },
      ],
      features: ["Basic access", "Community support", "Limited downloads"],
    },
    {
      name: "Starter",
      price: starter,
      isPopular: true,
      color: "hsl(var(--chart-1))",
      chartData: [
        { month: "Jan", value: 10 },
        { month: "Feb", value: 32 },
        { month: "Mar", value: 45 },
        { month: "Apr", value: 68 },
        { month: "May", value: 89 },
        { month: "Jun", value: 92 },
      ],
      features: [
        "All Free plan features",
        "Turbo downloads",
        "Email support",
        "Access to new releases",
      ],
    },
    {
      name: "Pro",
      price: pro,
      isPopular: false,
      color: "hsl(var(--chart-3))",
      chartData: [
        { month: "Jan", value: 10 },
        { month: "Feb", value: 65 },
        { month: "Mar", value: 88 },
        { month: "Apr", value: 29 },
        { month: "May", value: 77 },
        { month: "Jun", value: 100 },
      ],
      features: [
        "Everything in Starter",
        "Unlimited downloads",
        "Priority support",
        "Exclusive beta access",
      ],
    },
  ]

  return (
    <div className="w-full max-w-5xl flex bg-card/20 p-5 rounded-2xl flex-col items-center gap-8">
      {/* Toggle */}
      <div className="relative flex items-center w-64 p-1 bg-muted rounded-full shadow-inner">
        {["Monthly", "Yearly"].map((label, i) => (
          <button
            key={i}
            onClick={() => handleChangePeriod(i)}
            className={`z-20 flex-1 text-sm font-medium py-2 rounded-full transition-colors ${
              period === i ? "text-background" : "text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
        <div
          className="absolute inset-0 w-1/2 bg-foreground rounded-full transition-transform duration-300"
          style={{ transform: `translateX(${period * 100}%)` }}
        />
      </div>

      {/* ✅ Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {plans.map((plan, i) => (
          <Card
            key={plan.name}
            onClick={() => handleChangePlan(i)}
            className={`cursor-pointer border-2 rounded-3xl transition-all duration-300 hover:shadow-xl ${
              active === i ? "border-foreground shadow-lg" : "border-border"
            }`}
          >
            <CardContent className="p-6 flex flex-col h-full gap-4">
              {/* Header */}
              <div
                className={`relative flex flex-col border border-foreground rounded-xl p-3 ${
                  active === i ? "bg-gray-100/10 border-border border-2 backdrop-blur-sm" : "border-foreground/50 bg-background/10"
                }`}
              >
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {plan.name}
                      {plan.isPopular && (
                        <span className="text-xs font-medium bg-yellow-100 text-yellow-900 px-2 py-1 rounded-md">
                          Popular
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground flex items-center">
                      <span className="font-medium text-xl">
                        ${plan.price > 0 ? <NumberFlow value={plan.price} /> : 0}
                      </span>
                      <span className="ml-1 text-sm">/month</span>
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="w-full mt-2">
                  <ChartLineStep data={plan.chartData} />
                </div>
                {/* Radio Indicator */}
                  <div
                    className={`size-4 absolute top-3 right-3 border-2 rounded-full flex items-center justify-center ${
                      active === i ? "border-foreground" : "border-muted-foreground"
                    }`}
                  >
                    <div
                      className={`size-2 rounded-full bg-foreground transition-opacity ${
                        active === i ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex p-2 border-border/90 border items-center bg-muted-foreground/10 rounded-[5px] dark:bg-background/20 gap-2"
                  >
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3.5">
        <Button size="lg" variant="outline" className="space-x-2 rounded-full w-full sm:w-auto px-8">
          <ArrowLeft size={20} />
          Back Menu
        </Button>
        <Button size="lg" className="rounded-full w-full sm:w-auto px-8">
          Get Started
        </Button>
      </div>
    </div>
  )
}
