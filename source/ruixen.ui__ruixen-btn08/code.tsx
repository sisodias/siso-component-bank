"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Share2,
  ExternalLink,
  MessageSquareShare,
  X,
  Boxes,
} from "lucide-react";

const shareButtons = [
    {
      icon: Twitter,
      bg: "bg-slate-100 text-slate-600 hover:bg-slate-200",
      angle: 0,
    },
    {
      icon: Facebook,
      bg: "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
      angle: 45,
    },
    {
      icon: Linkedin,
      bg: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
      angle: 90,
    },
    {
      icon: Mail,
      bg: "bg-stone-100 text-stone-600 hover:bg-stone-200",
      angle: 135,
    },
    {
      icon: Boxes,
      bg: "bg-gray-100 text-gray-600 hover:bg-gray-200",
      angle: 180,
    },
    {
      icon: X,
      bg: "bg-slate-100 text-slate-500 hover:bg-slate-200",
      angle: 225,
    },
    {
      icon: MessageSquareShare,
      bg: "bg-zinc-100 text-zinc-500 hover:bg-zinc-200",
      angle: 270,
    },
    {
      icon: ExternalLink,
      bg: "bg-gray-100 text-gray-500 hover:bg-gray-200",
      angle: 315,
    },
  ];
  

export default function RuixenBtn08() {
  const [open, setOpen] = useState(false);
  const radius = 90; // spread distance

  return (
    <div className="relative w-fit h-fit">
      {/* Central Share Button */}
      <Button
        size="icon"
        className="rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:scale-105 transition z-20"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Share2 className="w-5 h-5" />
      </Button>

      {/* Radial Fan-Out Icons */}
      {shareButtons.map(({ icon: Icon, angle, bg }, index) => {
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        return (
          <Button
            key={index}
            className={cn(
              "absolute left-1 top-1 w-10 h-10",
              "rounded-full shadow-md flex items-center border border-gray-200 justify-center",
              "transition-all duration-300 ease-out",
              bg,
              open ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
            style={{
              transform: open
                ? `translate(${x}px, ${y}px)`
                : `translate(0px, 0px)`,
              transitionDelay: `${index * 60}ms`,
            }}
          >
            <Icon className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );
}
