'use client'

import Image from 'next/image'
import { Activity, ArrowRight, Files, Flower, GalleryVerticalEnd, MapPin } from 'lucide-react'
import DottedMap from 'dotted-map'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from "./card"
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "../_utils/cn"

export default function CombinedFeaturedSection() {
  const featuredCasestudy = {
    logo: '/ruixen_dark.png',
    company: 'Ruixen',
    tags: 'Enterprise',
    title: 'How we scaled to 1M+ users',
    subtitle: 'without a single second of downtime, using smart architecture and real-time monitoring',
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">

        {/* 1. MAP - Top Left */}
        <div className="relative rounded-none overflow-hidden bg-muted border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            Ruixen Analytics
          </div>
          <h3 className="text-xl font-normal text-gray-900 dark:text-white">
            Visualize user activity across regions.{" "}
            <span className="text-gray-500 dark:text-gray-400">Track, analyze, and optimize geographically.</span>
          </h3>

          <div className="relative mt-4">
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-white dark:bg-black text-black dark:text-white rounded-md text-xs font-medium shadow flex items-center gap-2">
              🌍 Last connection from US
            </div>
            <Map />
          </div>
        </div>

        {/* ✅ 2. FEATURED CASE STUDY BLOCK - Top Right */}
        <div className="flex flex-col justify-between gap-4 p-6 rounded-none border border-gray-200 dark:border-gray-800 bg-card">
          <div>
            <span className="text-xs flex items-center gap-2 text-sm text-gray-500">
              <GalleryVerticalEnd className="w-4 h-4" /> {featuredCasestudy.tags}
            </span>
            <h3 className="text-xl font-normal text-gray-900 dark:text-white">
              {featuredCasestudy.title}{" "}
              <span className="text-gray-500 dark:text-gray-400">{featuredCasestudy.subtitle}</span>
            </h3>
          </div>
          <div className="flex justify-center items-center w-full">
            <RuixenFeaturedMessageCard />
          </div>
        </div>

        {/* 3. CHART - Bottom Left */}
        <div className="rounded-none border border-gray-200 dark:border-gray-800 bg-muted p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Activity className="w-4 h-4" />
            Ruixen Analytics
          </div>
          <h3 className="text-xl font-normal text-gray-900 dark:text-white">
            Real-time performance tracking for Ruixen.{" "}
            <span className="text-gray-500 dark:text-gray-400">Optimize your UI decisions instantly.</span>
          </h3>
          <MonitoringChart />
        </div>

        {/* ✅ 4. ALL FEATURE CARDS - Bottom Right */}
        <div className="grid sm:grid-cols-2 rounded-none bg-card">
          <FeatureCard
            icon={<Files className="w-4 h-4" />}
            image="/1.png"
            title="Ready to use blocks"
            subtitle="Copy & Paste"
            description="Plug-n-play UI blocks you can drop right into any project."
          />
          <FeatureCard
            icon={<Flower className="w-4 h-4" />}
            image="/2.png"
            title="Customize with ease"
            subtitle="Easy to Use"
            description="Design your layout exactly the way you want with full flexibility."
          />
        </div>
      </div>
    </section>
  )
}

// ----------------- Feature Card Component -------------------
function FeatureCard({ icon, image, title, subtitle, description }: { icon: React.ReactNode, image: string, title: string, subtitle: string, description: string }) {
  return (
    <div className="relative flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-800 bg-background transition">
      <div className="flex items-center gap-4">
        <div>
          <span className="text-xs flex items-center gap-2 text-sm text-gray-500 mb-4">
            {icon}
            {title}
          </span>
          <h3 className="text-lg font-normal text-gray-900 dark:text-white">
            {subtitle}{" "}
            <span className="text-gray-500 dark:text-gray-400">{description}</span>
          </h3>
        </div>
      </div>

      {/* Card pinned to bottom right */}
      <Card className="absolute bottom-0 right-0 w-24 h-20 sm:w-32 sm:h-28 md:w-40 md:h-32 border-8 border-r-0 border-b-0 rounded-tl-xl rounded-br-none rounded-tr-none rounded-bl-none overflow-hidden">
      </Card>

      {/* Arrow icon on top of Card (optional) */}
      <div className="absolute bottom-2 right-2 p-3 flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-full hover:-rotate-45 transition z-10 bg-background">
        <ArrowRight className="w-4 h-4 text-primary" />
      </div>
    </div>

  )
}

// ----------------- Map -------------------
const map = new DottedMap({ height: 55, grid: 'diagonal' })
const points = map.getPoints()

const Map = () => (
  <svg viewBox="0 0 120 60" className="w-full h-auto text-primary/70 dark:text-white/30">
    {points.map((point, i) => (
      <circle key={i} cx={point.x} cy={point.y} r={0.15} fill="currentColor" />
    ))}
  </svg>
)

// ----------------- Chart -------------------
const chartData = [
  { month: 'May', desktop: 56, mobile: 224 },
  { month: 'June', desktop: 90, mobile: 300 },
  { month: 'July', desktop: 126, mobile: 252 },
  { month: 'Aug', desktop: 205, mobile: 410 },
  { month: 'Sep', desktop: 200, mobile: 126 },
  { month: 'Oct', desktop: 400, mobile: 800 },
]

const chartConfig = {
  desktop: {
    label: 'Ruixen Dashboard (Desktop)',
    color: '#2563eb', // Primary Blue
  },
  mobile: {
    label: 'Ruixen App (Mobile)',
    color: '#60a5fa', // Lighter Blue
  },
} satisfies ChartConfig


function MonitoringChart() {
  return (
    <ChartContainer className="h-60 aspect-auto" config={chartConfig}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis hide />
        <YAxis hide />
        <CartesianGrid vertical={false} horizontal={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent className="dark:bg-muted" />} />
        <Area strokeWidth={2} dataKey="mobile" type="monotone" fill="url(#fillMobile)" stroke="var(--color-mobile)" />
        <Area strokeWidth={2} dataKey="desktop" type="monotone" fill="url(#fillDesktop)" stroke="var(--color-desktop)" />
      </AreaChart>
    </ChartContainer>
  )
}


interface Message {
  title: string;
  time: string;
  content: string;
  color: string;
}

const messages: Message[] = [
    {
      title: "Ruixen Design",
      time: "1m ago",
      content: "New components added to your team workspace.",
      color: "from-pink-400 to-indigo-500",
    },
    {
      title: "Pro User Feedback",
      time: "3m ago",
      content: "You’ve received 8 new user reviews this week.",
      color: "from-orange-500 to-pink-500",
    },
    {
      title: "Billing Alert",
      time: "6m ago",
      content: "Your subscription was successfully renewed.",
      color: "from-yellow-400 to-red-400",
    },
    {
      title: "Integration Hub",
      time: "10m ago",
      content: "Figma plugin connected to your dashboard.",
      color: "from-sky-400 to-blue-700",
    },
    {
      title: "Product Analytics",
      time: "12m ago",
      content: "Dashboard insights updated with latest metrics.",
      color: "from-orange-300 to-fuchsia-500",
    },
    {
      title: "Weekly Recap",
      time: "15m ago",
      content: "Here’s what your team accomplished this week.",
      color: "from-green-400 to-blue-500",
    },
  ];

const RuixenFeaturedMessageCard = () => {
  return (
    <div className="w-full max-w-sm h-[280px] bg-white dark:bg-gray-900 p-2 overflow-hidden font-sans relative">
      {/* Fade shadow overlay */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
      
      <div className="space-y-2 relative z-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg transform transition duration-300 ease-in-out cursor-pointer animate-scaleUp`}
            style={{
              animationDelay: `${i * 300}ms`,
              animationFillMode: "forwards",
              opacity: 0,
            }}
          >
            <div
              className={`w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-lg bg-gradient-to-br ${msg.color}`}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-white">
                {msg.title}
                <span className="text-xs text-gray-500 before:content-['•'] before:mr-1">
                  {msg.time}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-1">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip as React.FC<RechartsPrimitive.TooltipProps<any, any>>

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean
    payload?: Array<any>
    label?: React.ReactNode
    labelFormatter?: (label: any, payload: Array<any>) => React.ReactNode
    labelClassName?: string
    formatter?: (value: any, name: any, item: any, index: number, payload: any) => React.ReactNode
    color?: string
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & React.ComponentProps<"div">
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            },
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend as unknown as React.FC<RechartsPrimitive.LegendProps>

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: Array<any>
    verticalAlign?: 'top' | 'middle' | 'bottom'
    hideIcon?: boolean
    nameKey?: string
  }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref,
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  },
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadObj = payload as Record<string, unknown>
  
  const payloadPayload =
    "payload" in payloadObj &&
    typeof payloadObj.payload === "object" &&
    payloadObj.payload !== null
      ? payloadObj.payload as Record<string, unknown>
      : undefined

  let configLabelKey: string = key

  if (
    key in payloadObj &&
    typeof payloadObj[key] === "string"
  ) {
    configLabelKey = payloadObj[key] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key] as unknown as (typeof config)[keyof typeof config] | undefined
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
