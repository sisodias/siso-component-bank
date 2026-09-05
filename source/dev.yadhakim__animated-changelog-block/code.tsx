"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Sparkles, Zap, Bug, Wrench, Rocket } from "lucide-react";

/* ─── Types ─── */

type EntryCategory = "feature" | "improvement" | "fix" | "breaking" | "launch";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  category: EntryCategory;
  highlights?: string[];
}

interface ChangelogBlockProps {
  entries?: ChangelogEntry[];
  className?: string;
}

/* ─── Category Config ─── */

const categoryConfig: Record<
  EntryCategory,
  { label: string; icon: ReactNode; color: string; glow: string }
> = {
  feature: {
    label: "Feature",
    icon: <Sparkles className="size-3" />,
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glow: "rgb(139 92 246)",
  },
  improvement: {
    label: "Improvement",
    icon: <Zap className="size-3" />,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glow: "rgb(59 130 246)",
  },
  fix: {
    label: "Bug Fix",
    icon: <Bug className="size-3" />,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "rgb(245 158 11)",
  },
  breaking: {
    label: "Breaking",
    icon: <Wrench className="size-3" />,
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    glow: "rgb(239 68 68)",
  },
  launch: {
    label: "Launch",
    icon: <Rocket className="size-3" />,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "rgb(16 185 129)",
  },
};

/* ─── Single Entry ─── */

function TimelineEntry({
  entry,
  index,
  isLast,
}: {
  entry: ChangelogEntry;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const config = categoryConfig[entry.category];

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-10">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        {/* Glowing node */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: index * 0.15,
          }}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute size-10 rounded-full"
            style={{ background: config.glow, opacity: 0 }}
            animate={
              isInView
                ? {
                    opacity: [0, 0.15, 0.08],
                    scale: [0.8, 1.5, 1.2],
                  }
                : {}
            }
            transition={{
              duration: 2,
              delay: index * 0.15 + 0.3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          {/* Core dot */}
          <div
            className="relative size-4 rounded-full border-2"
            style={{
              borderColor: config.glow,
              backgroundColor: config.glow,
              boxShadow: `0 0 12px ${config.glow}40`,
            }}
          />
        </motion.div>

        {/* Connecting beam line */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 min-h-[40px]"
            style={{ background: `linear-gradient(to bottom, ${config.glow}40, transparent)` }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: index * 0.15 + 0.2,
              ease: [0.25, 0.4, 0, 1],
            }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className="flex-1 pb-12"
        initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
        animate={
          isInView
            ? { opacity: 1, x: 0, filter: "blur(0px)" }
            : {}
        }
        transition={{
          duration: 0.6,
          delay: index * 0.15 + 0.1,
          ease: [0.25, 0.4, 0, 1],
        }}
      >
        {/* Top row — version + date + category */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-md bg-foreground/5 border border-border px-2 py-0.5 text-xs font-mono font-semibold text-foreground">
            {entry.version}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              config.color
            )}
          >
            {config.icon}
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">{entry.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-2 leading-snug">
          {entry.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-lg">
          {entry.description}
        </p>

        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {entry.highlights.map((h, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15 + 0.3 + i * 0.08,
                }}
              >
                <div
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: config.glow }}
                />
                {h}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Defaults ─── */

const DEFAULT_ENTRIES: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "Feb 2026",
    title: "AI-Powered Code Review",
    description:
      "Intelligent pull request analysis that catches bugs, suggests optimizations, and enforces your team's conventions automatically.",
    category: "launch",
    highlights: [
      "Reviews PRs in under 8 seconds",
      "Learns your codebase patterns over time",
      "Supports 12 languages including Rust and Go",
    ],
  },
  {
    version: "v2.3.2",
    date: "Jan 2026",
    title: "Edge Caching Layer",
    description:
      "Responses now served from the nearest edge node. Median latency dropped from 120ms to 14ms globally.",
    category: "improvement",
    highlights: [
      "150+ edge locations worldwide",
      "Automatic cache invalidation",
      "Zero config required",
    ],
  },
  {
    version: "v2.3.0",
    date: "Dec 2025",
    title: "Team Workspaces",
    description:
      "Collaborate in shared workspaces with role-based access, shared environment variables, and unified billing.",
    category: "feature",
    highlights: [
      "Admin, Developer, and Viewer roles",
      "SSO integration with Okta and Auth0",
    ],
  },
  {
    version: "v2.2.4",
    date: "Nov 2025",
    title: "Memory Leak in WebSocket Handler",
    description:
      "Fixed a critical memory leak affecting long-running WebSocket connections that caused gradual memory growth over 48+ hours.",
    category: "fix",
  },
  {
    version: "v2.2.0",
    date: "Oct 2025",
    title: "Config Schema v3 Migration",
    description:
      "New configuration format with stricter validation. Existing v2 configs will auto-migrate but manual review is recommended.",
    category: "breaking",
    highlights: [
      "Run `npx migrate-config` to auto-upgrade",
      "v2 format deprecated, removed in v3.0",
    ],
  },
];

/* ─── Main Block ─── */

export function Component({
  entries = DEFAULT_ENTRIES,
  className,
}: ChangelogBlockProps) {
  return (
    <section
      className={cn("w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Changelog
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Everything that shipped. New features, improvements, fixes, and breaking changes — all in one place.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {entries.map((entry, i) => (
            <TimelineEntry
              key={entry.version}
              entry={entry}
              index={i}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}