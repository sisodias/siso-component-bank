"use client";

import Link from "next/link";
import { MessageCircle, PersonStanding, User, Users } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";
import { useState } from "react";

const TickerOptions = [
  {
    icon: <MessageCircle className="h-4 w-4" />,
    tooltip: "Chat",
    href: (ticker: string) => `/${ticker}?activeTab=Chat`,
  },
  {
    icon: <PersonStanding className="h-4 w-4" />,
    tooltip: "Persona",
    href: (ticker: string) => `/${ticker}?activeTab=Persona`,
  },
  {
    icon: <Users className="h-4 w-4" />,
    tooltip: "Competitors",
    href: (ticker: string) => `/${ticker}?activeTab=Competitors`,
  },
];

export function QuickTickerOptions({ ticker }: { ticker: string }) {
  return (
    <div className="flex gap-2 justify-center items-center text-foreground border bg-background rounded-xl px-2 py-1.5">
      {TickerOptions.map((option) => (
        <TickerOptionPil
          key={option.tooltip}
          icon={option.icon}
          tooltip={option.tooltip}
          href={option.href}
          ticker={ticker}
        />
      ))}
    </div>
  );
}

function TickerOptionPil({
  icon,
  tooltip,
  href,
  ticker,
}: {
  icon: React.ReactNode;
  tooltip: string;
  href: (ticker: string) => string;
  ticker: string;
}) {
  return (
    <Link
      href={href(ticker)}
      className="p-1 group hover:bg-muted-foreground/10 rounded-full cursor-pointer flex flex-col items-center justify-center"
    >
      {icon}
      <p className="text-xs absolute -top-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-popover px-1 py-0.5 rounded-md text-center border">
        {tooltip}
      </p>
    </Link>
  );
}

export const Component = ()=> {
  const [ticker, setTicker] = useState("AAPL");
  return (
    <div className="flex w-full justify-center items-center h-[400px]">
      <TooltipProvider>
        <Tooltip key={ticker} delayDuration={0.2}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="rounded-full" size={"icon"}>
              <User className={"size-4"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={0}
            align="center"
            className="p-0 bg-popover rounded-xl ml-1"
          >
            <QuickTickerOptions ticker={ticker} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
