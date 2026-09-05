"use client";

import * as React from "react";
import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import * as RechartsPrimitive from "recharts";
import type { TooltipValueType } from "recharts";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/ui/delta";

// ─────────────────────────────────────────────────────────────
// inlined from shadcn chart.tsx — only the bits sales-chart uses
// ─────────────────────────────────────────────────────────────

type ClassValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| ClassValue[]
	| { [key: string]: unknown };

function cn(...inputs: ClassValue[]): string {
	const classes: string[] = [];
	for (const input of inputs) {
		if (!input) continue;
		if (typeof input === "string" || typeof input === "number") {
			classes.push(String(input));
		} else if (Array.isArray(input)) {
			const inner = cn(...input);
			if (inner) classes.push(inner);
		} else if (typeof input === "object") {
			for (const [key, value] of Object.entries(input)) {
				if (value) classes.push(key);
			}
		}
	}
	return classes.join(" ");
}

const THEMES = { light: "", dark: ".dark" } as const;
const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
type TooltipNameType = number | string;

type ChartConfig = Record<
	string,
	{
		label?: React.ReactNode;
		icon?: React.ComponentType;
	} & (
		| { color?: string; theme?: never }
		| { color?: never; theme: Record<keyof typeof THEMES, string> }
	)
>;

type ChartContextProps = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
	const context = React.useContext(ChartContext);
	if (!context) {
		throw new Error("useChart must be used within a <ChartContainer />");
	}
	return context;
}

function ChartContainer({
	id,
	className,
	children,
	config,
	initialDimension = INITIAL_DIMENSION,
	...props
}: React.ComponentProps<"div"> & {
	config: ChartConfig;
	children: React.ComponentProps<
		typeof RechartsPrimitive.ResponsiveContainer
	>["children"];
	initialDimension?: { width: number; height: number };
}) {
	const uniqueId = React.useId();
	const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

	return (
		<ChartContext.Provider value={{ config }}>
			<div
				data-slot="chart"
				data-chart={chartId}
				className={cn(
					"flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
					className
				)}
				{...props}
			>
				<ChartStyle id={chartId} config={config} />
				<RechartsPrimitive.ResponsiveContainer
					initialDimension={initialDimension}
				>
					{children}
				</RechartsPrimitive.ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
	const colorConfig = Object.entries(config).filter(
		([, c]) => c.theme ?? c.color
	);
	if (!colorConfig.length) return null;

	return (
		<style
			// biome-ignore lint/security/noDangerouslySetInnerHtml: chart theme css
			dangerouslySetInnerHTML={{
				__html: Object.entries(THEMES)
					.map(
						([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
	.map(([key, itemConfig]) => {
		const color =
			itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
			itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	})
	.join("\n")}
}
`
					)
					.join("\n"),
			}}
		/>
	);
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
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
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
	React.ComponentProps<"div"> & {
		hideLabel?: boolean;
		hideIndicator?: boolean;
		indicator?: "line" | "dot" | "dashed";
		nameKey?: string;
		labelKey?: string;
	} & Omit<
		RechartsPrimitive.DefaultTooltipContentProps<
			TooltipValueType,
			TooltipNameType
		>,
		"accessibilityLayer"
	>) {
	const { config } = useChart();

	const tooltipLabel = React.useMemo(() => {
		if (hideLabel || !payload?.length) return null;
		const [item] = payload;
		const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
		const itemConfig = getPayloadConfigFromPayload(config, item, key);
		const value =
			!labelKey && typeof label === "string"
				? (config[label]?.label ?? label)
				: itemConfig?.label;

		if (labelFormatter) {
			return (
				<div className={cn("font-medium", labelClassName)}>
					{labelFormatter(value, payload)}
				</div>
			);
		}
		if (!value) return null;
		return <div className={cn("font-medium", labelClassName)}>{value}</div>;
	}, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

	if (!active || !payload?.length) return null;
	const nestLabel = payload.length === 1 && indicator !== "dot";

	return (
		<div
			className={cn(
				"grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
				className
			)}
		>
			{!nestLabel ? tooltipLabel : null}
			<div className="grid gap-1.5">
				{payload
					.filter((item) => item.type !== "none")
					.map((item, index) => {
						const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
						const itemConfig = getPayloadConfigFromPayload(config, item, key);
						const indicatorColor = color ?? item.payload?.fill ?? item.color;

						return (
							<div
								key={index}
								className={cn(
									"flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
									indicator === "dot" && "items-center"
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
														"shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
														{
															"h-2.5 w-2.5": indicator === "dot",
															"w-1": indicator === "line",
															"w-0 border-[1.5px] border-dashed bg-transparent":
																indicator === "dashed",
															"my-0.5": nestLabel && indicator === "dashed",
														}
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
												nestLabel ? "items-end" : "items-center"
											)}
										>
											<div className="grid gap-1.5">
												{nestLabel ? tooltipLabel : null}
												<span className="text-muted-foreground">
													{itemConfig?.label ?? item.name}
												</span>
											</div>
											{item.value != null && (
												<span className="font-mono font-medium text-foreground tabular-nums">
													{typeof item.value === "number"
														? item.value.toLocaleString()
														: String(item.value)}
												</span>
											)}
										</div>
									</>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
}

function getPayloadConfigFromPayload(
	config: ChartConfig,
	payload: unknown,
	key: string
) {
	if (typeof payload !== "object" || payload === null) return undefined;
	const payloadPayload =
		"payload" in payload &&
		typeof payload.payload === "object" &&
		payload.payload !== null
			? payload.payload
			: undefined;
	let configLabelKey: string = key;
	if (
		key in payload &&
		typeof payload[key as keyof typeof payload] === "string"
	) {
		configLabelKey = payload[key as keyof typeof payload] as string;
	} else if (
		payloadPayload &&
		key in payloadPayload &&
		typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
	) {
		configLabelKey = payloadPayload[
			key as keyof typeof payloadPayload
		] as string;
	}
	return configLabelKey in config ? config[configLabelKey] : config[key];
}

// ─────────────────────────────────────────────────────────────
// end inlined chart helpers
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// inlined from shadcn select.tsx — only Select, SelectTrigger,
// SelectContent, SelectItem, SelectValue (+ scroll buttons)
// ─────────────────────────────────────────────────────────────

function Select({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
	className,
	size = "default",
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: "sm" | "default";
}) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			data-size={size}
			className={cn(
				"flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
				className
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDownIcon className="size-4 opacity-50" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			data-slot="select-scroll-up-button"
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className
			)}
			{...props}
		>
			<ChevronUpIcon className="size-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			data-slot="select-scroll-down-button"
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className
			)}
			{...props}
		>
			<ChevronDownIcon className="size-4" />
		</SelectPrimitive.ScrollDownButton>
	);
}

function SelectContent({
	className,
	children,
	position = "item-aligned",
	align = "center",
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				data-slot="select-content"
				className={cn(
					"relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className
				)}
				position={position}
				align={align}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				className
			)}
			{...props}
		>
			<span
				data-slot="select-item-indicator"
				className="absolute right-2 flex size-3.5 items-center justify-center"
			>
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="size-4" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

// ─────────────────────────────────────────────────────────────
// end inlined select
// ─────────────────────────────────────────────────────────────

// inlined from formater.ts — only what sales-chart uses

const DASHBOARD_LOCALE = "en-US";

function parseIsoCalendarDate(isoDate: string): Date {
	return new Date(`${isoDate}T12:00:00`);
}

type DashboardDateStyle = "month" | "day-month" | "full";

function formatDate(isoDate: string, style: DashboardDateStyle): string {
	const date = parseIsoCalendarDate(isoDate);
	if (style === "month") {
		return date.toLocaleDateString(DASHBOARD_LOCALE, { month: "short" });
	}
	if (style === "day-month") {
		return date.toLocaleDateString(DASHBOARD_LOCALE, {
			day: "numeric",
			month: "short",
		});
	}
	return date.toLocaleDateString(DASHBOARD_LOCALE, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

type PeriodDays = 7 | 30;

/** One row per day: ISO `date`, `retail` / `online` = sales counts (units sold). */
type SalesChartRow = {
	date: string;
	retail: number;
	online: number;
};

/**
 * Demo Data.
 */
const chartData: SalesChartRow[] = [
	{ date: "2026-03-15", retail: 198, online: 96 },
	{ date: "2026-03-16", retail: 176, online: 82 },
	{ date: "2026-03-17", retail: 184, online: 88 },
	{ date: "2026-03-18", retail: 170, online: 80 },
	{ date: "2026-03-19", retail: 188, online: 90 },
	{ date: "2026-03-20", retail: 180, online: 85 },
	{ date: "2026-03-21", retail: 192, online: 92 },
	{ date: "2026-03-22", retail: 172, online: 78 },
	{ date: "2026-03-23", retail: 166, online: 74 },
	{ date: "2026-03-24", retail: 174, online: 79 },
	{ date: "2026-03-25", retail: 158, online: 72 },
	{ date: "2026-03-26", retail: 168, online: 76 },
	{ date: "2026-03-27", retail: 152, online: 70 },
	{ date: "2026-03-28", retail: 160, online: 74 },
	{ date: "2026-03-29", retail: 146, online: 68 },
	{ date: "2026-03-30", retail: 154, online: 71 },
	{ date: "2026-03-31", retail: 142, online: 65 },
	{ date: "2026-04-01", retail: 140, online: 63 },
	{ date: "2026-04-02", retail: 132, online: 59 },
	{ date: "2026-04-03", retail: 124, online: 56 },
	{ date: "2026-04-04", retail: 128, online: 58 },
	{ date: "2026-04-05", retail: 116, online: 52 },
	{ date: "2026-04-06", retail: 84, online: 40 },
	{ date: "2026-04-07", retail: 82, online: 38 },
	{ date: "2026-04-08", retail: 96, online: 46 },
	{ date: "2026-04-09", retail: 92, online: 69 },
	{ date: "2026-04-10", retail: 96, online: 62 },
	{ date: "2026-04-11", retail: 112, online: 75 },
	{ date: "2026-04-12", retail: 101, online: 77 },
	{ date: "2026-04-13", retail: 112, online: 78 },
];

function parseChartDay(isoDate: string) {
	return new Date(`${isoDate}T12:00:00`);
}

/** Last day in `chartData`; used as the end of the “last N days” window. */
const lastChartRow = chartData.at(-1);
if (lastChartRow === undefined) {
	throw new Error("SalesChart: chartData must include at least one row");
}
const salesChartReferenceDate = parseChartDay(lastChartRow.date);

function rowTotal(row: SalesChartRow) {
	return row.retail + row.online;
}

const chartConfig = {
	retail: {
		label: "Retail",
		color: "var(--chart-2)",
	},
	online: {
		label: "Online",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

const animationConfig = {
	glowWidth: 520,
};

function highlightXFromChartMouseEvent(e: unknown): number | null {
	const ex = e as {
		activeCoordinate?: { x?: number; y?: number };
		chartX?: number;
	};
	const fromActive = ex.activeCoordinate?.x;
	if (typeof fromActive === "number" && Number.isFinite(fromActive)) {
		return fromActive;
	}
	const legacy = ex.chartX;
	if (typeof legacy === "number" && Number.isFinite(legacy)) {
		return legacy;
	}
	return null;
}

export function SalesChart() {
	const chartUid = useId().replace(/:/g, "");
	const idMaskGrad = `sales-chart-mask-grad-${chartUid}`;
	const idMask = `sales-chart-highlight-mask-${chartUid}`;

	const [periodDays, setPeriodDays] = useState<PeriodDays>(7);
	const [xAxis, setXAxis] = useState<number | null>(null);

	const chartRows = useMemo(() => {
		const startDate = new Date(salesChartReferenceDate);
		startDate.setDate(startDate.getDate() - periodDays);
		return chartData.filter((item) => parseChartDay(item.date) >= startDate);
	}, [periodDays]);

	const growthPctNum = useMemo(() => {
		const first = chartRows[0];
		if (!first) {
			return 0;
		}
		const last = chartRows.at(-1);
		if (!last) {
			return 0;
		}
		const a = rowTotal(first);
		const b = rowTotal(last);
		if (!a) {
			return 0;
		}
		return ((b - a) / a) * 100;
	}, [chartRows]);

	const xAxisMinTickGap: number | undefined = periodDays > 7 ? 32 : undefined;

	const idGradOnline = `sales-chart-grad-online-${chartUid}`;
	const idGradRetail = `sales-chart-grad-retail-${chartUid}`;

	return (
		<Card className="rounded-none border-0 bg-background py-4 shadow-none ring-0 lg:col-span-3">
			<CardHeader>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0 space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<CardTitle className="text-base">Sales</CardTitle>
							<Delta value={growthPctNum} variant="badge">
								<DeltaIcon variant="trend" />
								<DeltaValue />
							</Delta>
						</div>
						<CardDescription>
							Daily sales count by channel, last {periodDays} days.
						</CardDescription>
					</div>
					<Select
						onValueChange={(v) => {
							const n = Number(v);
							if (n === 7 || n === 30) {
								setPeriodDays(n);
							}
						}}
						value={String(periodDays)}
					>
						<SelectTrigger
							aria-label="Sales chart time range"
							className="w-full min-w-36 sm:w-fit"
							size="sm"
						>
							<SelectValue placeholder="Range" />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectItem value="7">Last 7 days</SelectItem>
							<SelectItem value="30">Last 30 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className="aspect-21/9 min-h-48 w-full p-0"
					config={chartConfig}
				>
					<AreaChart
						// accessibilityLayer
						data={chartRows}
						margin={{
							left: 4,
							right: 12,
							top: 8,
						}}
						onMouseLeave={() => setXAxis(null)}
						onMouseMove={(e) => setXAxis(highlightXFromChartMouseEvent(e))}
					>
						<CartesianGrid
							className="stroke-border"
							strokeDasharray="3 3"
							vertical={false}
						/>
						<XAxis
							axisLine={false}
							dataKey="date"
							interval={periodDays <= 7 ? 0 : "preserveStartEnd"}
							minTickGap={xAxisMinTickGap}
							tickFormatter={(value) => formatDate(String(value), "day-month")}
							tickLine={false}
							tickMargin={8}
						/>
						<ChartTooltip content={<ChartTooltipContent />} cursor={false} />

						<defs>
							<linearGradient id={idMaskGrad} x1="0" x2="1" y1="0" y2="0">
								<stop offset="0%" stopColor="transparent" />
								<stop offset="28%" stopColor="white" stopOpacity={0.55} />
								<stop offset="50%" stopColor="white" />
								<stop offset="72%" stopColor="white" stopOpacity={0.55} />
								<stop offset="100%" stopColor="transparent" />
							</linearGradient>
							<linearGradient id={idGradOnline} x1="0" x2="0" y1="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-online)"
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-online)"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient id={idGradRetail} x1="0" x2="0" y1="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-retail)"
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-retail)"
									stopOpacity={0}
								/>
							</linearGradient>
							{typeof xAxis === "number" && Number.isFinite(xAxis) ? (
								<mask id={idMask}>
									<rect
										fill={`url(#${idMaskGrad})`}
										height="100%"
										width={animationConfig.glowWidth}
										x={xAxis - animationConfig.glowWidth / 2}
										y={0}
									/>
								</mask>
							) : null}
						</defs>
						<Area
							dataKey="online"
							fill={`url(#${idGradOnline})`}
							fillOpacity={0.4}
							mask={`url(#${idMask})`}
							stackId="a"
							stroke="var(--color-online)"
							strokeWidth={0.8}
							type="linear"
						/>
						<Area
							dataKey="retail"
							fill={`url(#${idGradRetail})`}
							fillOpacity={0.4}
							mask={`url(#${idMask})`}
							stackId="a"
							stroke="var(--color-retail)"
							strokeWidth={0.8}
							type="linear"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default SalesChart;
