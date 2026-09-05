"use client";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../_utils/cn";

type FeedItem = { id: string; title: string; message: string; time: string };

type NotificationFeedProps = {
  cardTitle?: string;
  cardDescription?: string;
  feed?: FeedItem[];
};

const defaultFeed: FeedItem[] = [
  { id: "1", title: "Stripe", message: "Payment succeeded $29.00", time: "1m" },
  { id: "2", title: "Linear", message: "Issue S-123 assigned", time: "3m" },
  { id: "3", title: "Slack", message: "New mention in #ops", time: "7m" },
  { id: "4", title: "Sentry", message: "New error in prod", time: "10m" },
];

export const NotificationCenterFeed = ({
  cardTitle = "Live feed",
  cardDescription = "Auto-scrolling updates; hover to pause and focus.",
  feed = defaultFeed,
}: NotificationFeedProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState(feed);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 1600);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative",
        "flex max-w-[350px] items-center justify-center",
        "rounded-lg border border-primary/5 bg-neutral-100 p-6 dark:bg-neutral-950",
      )}
    >
      <div className="relative h-[230px] w-[264px] overflow-hidden rounded-[14px] bg-neutral-200 p-2 dark:bg-neutral-900/50">
        <div className="absolute left-3 top-2 text-[9px] text-neutral-500">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
        </div>
        <div className="absolute inset-x-2 bottom-2 top-8">
          {items.map((it, i) => (
            <motion.div
              key={it.id + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="mb-2 rounded-md border bg-neutral-300 p-2 text-xs shadow dark:border-neutral-800 dark:bg-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{it.title}</span>
                <span className="text-[10px] text-neutral-500">{it.time}</span>
              </div>
              <div className="mt-1 truncate text-neutral-700 dark:text-neutral-400">{it.message}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[160px] w-full rounded-b-lg [background-image:linear-gradient(to_top,#0a0a0a_65%,transparent_100%)] dark:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 block h-[160px] w-full rounded-b-lg [background-image:linear-gradient(to_top,#f5f5f5_65%,transparent_100%)] dark:hidden" />
      <div className="absolute bottom-4 left-0 w-full px-6">
        <h3 className="text-sm font-semibold text-primary">{cardTitle}</h3>
        <p className="mt-1 text-xs text-neutral-500">{cardDescription}</p>
      </div>
    </motion.div>
  );
};

export default NotificationCenterFeed;


