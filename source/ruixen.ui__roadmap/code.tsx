"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle2, Wrench, Archive, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type RoadmapStatus = "planned" | "in-progress" | "shipped" | "deprecated";

export interface RoadmapItem {
  date: string;           // ISO date: "2025-11-01"
  title: string;
  description?: string;
  href?: string;
  status?: RoadmapStatus; // default: "planned"
  group?: string;         // optional manual group label (e.g., "Q4 2025")
}

export interface RoadmapProps {
  items: RoadmapItem[];
  className?: string;
  /** max items shown per group before “Show more” */
  initialVisiblePerGroup?: number;
  /** default tab: "all" | status */
  defaultFilter?: "all" | RoadmapStatus;
  /** date locale options for rendering */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** show a subtle dot & line timeline decoration (true by default) */
  showTimelineDecoration?: boolean;
}

const STATUS_META: Record<
  Exclude<RoadmapStatus, never>,
  { label: string; badgeClass?: string; icon: React.ReactNode }
> = {
  planned: {
    label: "Planned",
    badgeClass: "bg-muted text-foreground",
    icon: <Clock className="h-4 w-4" />,
  },
  "in-progress": {
    label: "In Progress",
    badgeClass: "bg-primary text-primary-foreground",
    icon: <Wrench className="h-4 w-4" />,
  },
  shipped: {
    label: "Shipped",
    badgeClass: "bg-green-600 text-white dark:bg-green-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  deprecated: {
    label: "Deprecated",
    badgeClass: "bg-destructive text-destructive-foreground",
    icon: <Archive className="h-4 w-4" />,
  },
};

function toQuarterLabel(d: Date) {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

function getGroupLabel(item: RoadmapItem) {
  const d = new Date(item.date);
  return item.group?.trim() || toQuarterLabel(d);
}

function formatDate(date: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(opts || {}),
  });
}

function StatusBadge({ status = "planned" }: { status?: RoadmapStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge className={cn("gap-1", meta.badgeClass)}>
      {meta.icon}
      {meta.label}
    </Badge>
  );
}

function ItemRow({
  item,
  showTimelineDecoration = true,
  dateFormat,
}: {
  item: RoadmapItem;
  showTimelineDecoration?: boolean;
  dateFormat?: Intl.DateTimeFormatOptions;
}) {
  const content = (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-medium leading-tight">
            {item.title}
          </CardTitle>
          <StatusBadge status={item.status || "planned"} />
        </div>
        {item.description ? (
          <CardDescription className="mt-1 text-sm">
            {item.description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={item.date}>{formatDate(item.date, dateFormat)}</time>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <li className="relative pl-6">
      {showTimelineDecoration && (
        <>
          <span className="absolute left-0 top-3 h-2 w-2 rounded-full bg-primary" />
          <span className="absolute left-0 top-3 -translate-x-[5px] translate-y-2 block h-[calc(100%-0.75rem)] w-px bg-border" />
        </>
      )}
      {item.href ? (
        <Link href={item.href} className="block transition hover:opacity-95">
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

export function Roadmap({
  items,
  className,
  initialVisiblePerGroup = 4,
  defaultFilter = "all",
  dateFormat,
  showTimelineDecoration = true,
}: RoadmapProps) {
  // Normalize & sort DESC by date
  const normalized = React.useMemo(() => {
    return [...items]
      .map((it) => ({ ...it, status: (it.status || "planned") as RoadmapStatus }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [items]);

  // Build groups
  const groups = React.useMemo(() => {
    const map = new Map<string, RoadmapItem[]>();
    for (const it of normalized) {
      const label = getGroupLabel(it);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(it);
    }
    // keep order by group date descending
    const withMeta = [...map.entries()].map(([label, list]) => {
      // parse one date to infer quarter start
      const sample = list[0];
      const d = new Date(sample.date);
      const key = d.getFullYear() * 10 + Math.floor(d.getMonth() / 3) + 1;
      return { label, key, list };
    });
    return withMeta.sort((a, b) => b.key - a.key);
  }, [normalized]);

  const [openGroups, setOpenGroups] = React.useState<string[]>(
    groups.slice(0, 1).map((g) => g.label) // open the most recent quarter by default
  );
  const [showCount, setShowCount] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // initialize show counts
    const init: Record<string, number> = {};
    for (const g of groups) init[g.label] = initialVisiblePerGroup;
    setShowCount(init);
  }, [groups, initialVisiblePerGroup]);

  const [tab, setTab] = React.useState<string>(defaultFilter);

  function filtered(list: RoadmapItem[]) {
    if (tab === "all") return list;
    return list.filter((it) => it.status === tab);
  }

  return (
    <div className={cn("w-full", className)}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Product Roadmap</CardTitle>
            <StatusLegend />
          </div>
          <CardDescription>
            Grouped by quarter, filter by status, and expand to view more.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="deprecated">Deprecated</TabsTrigger>
            </TabsList>

            {/* We reuse the same content area; the filter applies within each group */}
            <TabsContent value={tab} className="m-0">
              <Accordion
                type="multiple"
                value={openGroups}
                onValueChange={(v) => setOpenGroups(v as string[])}
                className="w-full"
              >
                {groups.map(({ label, list }) => {
                  const flist = filtered(list);
                  const visible = Math.min(
                    showCount[label] ?? initialVisiblePerGroup,
                    flist.length
                  );
                  const hasMore = visible < flist.length;

                  if (flist.length === 0) return null;

                  return (
                    <AccordionItem key={label} value={label} className="border-b">
                      <AccordionTrigger className="text-left">
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {flist.length} item{flist.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ScrollArea className="max-h-[520px] pr-4">
                          <ul className="space-y-4">
                            {flist.slice(0, visible).map((it, i) => (
                              <ItemRow
                                key={`${it.title}-${it.date}-${i}`}
                                item={it}
                                dateFormat={dateFormat}
                                showTimelineDecoration={showTimelineDecoration}
                              />
                            ))}
                          </ul>
                          {hasMore && (
                            <div className="mt-4 flex justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setShowCount((s) => ({
                                    ...s,
                                    [label]: (s[label] ?? initialVisiblePerGroup) + initialVisiblePerGroup,
                                  }))
                                }
                              >
                                Show more
                              </Button>
                            </div>
                          )}
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusLegend() {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Badge className={cn("bg-muted text-foreground")}>Planned</Badge>
      <Badge className={cn("bg-primary text-primary-foreground")}>In Progress</Badge>
      <Badge className={cn("bg-green-600 text-white dark:bg-green-500")}>Shipped</Badge>
      <Badge className={cn("bg-destructive text-destructive-foreground")}>Deprecated</Badge>
    </div>
  );
}
