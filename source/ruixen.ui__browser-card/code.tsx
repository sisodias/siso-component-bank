"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Minus,
  Square,
  X,
  Star,
} from "lucide-react";

export interface BrowserCardProps {
  /** Shown on the active tab */
  tabTitle?: string;
  /** Address bar value */
  url?: string;
  /** Disable forward button */
  canGoForward?: boolean;
  /** Disable back button */
  canGoBack?: boolean;
  /** Width/height via Tailwind classes */
  className?: string;
}

export function BrowserCard({
  tabTitle = "Ruixen",
  url = "ruixen.com",
  canGoBack = true,
  canGoForward = false,
  className,
}: BrowserCardProps) {
  return (
    <Card
      className={cn(
        // base size matches your original (300x250); override via className if needed
        "relative flex h-[250px] w-[300px] flex-col overflow-hidden rounded-md shadow",
        "bg-muted",
        className
      )}
    >
      {/* Tabs head */}
      <div className="flex h-10 items-end justify-between bg-neutral-800 pl-4">
        {/* Active tab */}
        <div
          className={cn(
            "relative ml-2 flex h-8 w-[120px] items-center gap-2 rounded-t-md",
            "bg-neutral-700 px-2 text-neutral-100 shadow-inner"
          )}
        >
          {/* Left “mask” to simulate curved seam */}
          <span className="pointer-events-none absolute -left-4 top-0 h-6 w-4 rounded-br-md bg-neutral-800 content-['']" />
          {/* Right “mask” */}
          <span className="pointer-events-none absolute -right-4 top-0 h-6 w-4 rounded-bl-md bg-neutral-800 content-['']" />

          <Badge
            variant="secondary"
            className="h-5 shrink-0 rounded-sm px-1.5 text-[10px] leading-4"
          >
            Tab
          </Badge>
          <span className="truncate text-[11px]">{tabTitle}</span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto h-6 w-6 rounded-full text-neutral-100 hover:bg-neutral-600"
            aria-label="Close tab"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Window controls */}
        <div className="mb-2 flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-none text-neutral-100 hover:bg-neutral-700"
            aria-label="Minimize"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-none text-neutral-100 hover:bg-neutral-700"
            aria-label="Maximize"
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-none text-neutral-100 hover:bg-red-600/80"
            aria-label="Close window"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Browser controls / address bar */}
      <div className="z-10 flex h-10 items-center gap-1 rounded-t-md bg-neutral-700 px-2 text-neutral-100">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-neutral-600"
          aria-label="Back"
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-neutral-600"
          aria-label="Forward"
          disabled={!canGoForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Input
          defaultValue={url}
          placeholder="Search Google or type URL"
          className={cn(
            "h-7 flex-1 rounded-full border-0 bg-neutral-600 px-3 text-[12px] text-neutral-100",
            "placeholder:text-neutral-200/80 focus-visible:ring-1 focus-visible:ring-sky-300"
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-neutral-600"
          aria-label="More"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-neutral-600"
          aria-label="Star"
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>

      {/* Page area (blank mock surface). You can slot children here if needed. */}
      <div className="relative flex-1 bg-neutral-200 dark:bg-neutral-900">
        {/* Example of content overlay / watermark */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="rounded-md border border-dashed border-neutral-300 px-3 py-1 text-[10px] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            Page content
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BrowserCard;
