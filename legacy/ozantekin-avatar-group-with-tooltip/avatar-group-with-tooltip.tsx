"use client";

import * as React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { cn } from "../_utils/cn"

const DEFAULT_AVATARS = [
  {
    src: "https://randomuser.me/api/portraits/men/32.jpg",
    alt: "John Doe",
    name: "John Doe",
    initials: "JD",
  },
  {
    src: "https://randomuser.me/api/portraits/women/44.jpg",
    alt: "Sarah Smith",
    name: "Sarah Smith",
    initials: "SS",
  },
  {
    src: "https://randomuser.me/api/portraits/men/91.jpg",
    alt: "Alex Wong",
    name: "Alex Wong",
    initials: "AW",
  },
  {
    src: "https://randomuser.me/api/portraits/women/17.jpg",
    alt: "Emma Johnson",
    name: "Emma Johnson",
    initials: "EJ",
  },
];

export function AvatarGroupWithTooltips() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-background flex items-center justify-center rounded-full border p-1">
        <div className="flex items-center relative">
          {DEFAULT_AVATARS.map((avatar, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn("relative hover:z-10", index > 0 && "-ml-2")}
                >
                  <Avatar className="transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg border-2 border-background">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                    <AvatarFallback>{avatar.initials}</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                {avatar.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
