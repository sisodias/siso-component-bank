"use client";

import React from "react";
import {
  Users,
  MessageSquare,
  UserPlus,
  ShieldIcon,
  LockKeyholeOpenIcon,
} from "lucide-react";
import { RiReactjsLine, RiNextjsFill, RiStackLine } from "react-icons/ri";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type GroupType = "react" | "nextJS" | "fullstack";

type GroupListCardProps = {
  name?: string;
  type?: GroupType;
  memberCount?: number;
  isOwner?: boolean;
  isPrivate?: boolean;
  allowedUser?: boolean;
};

export function GroupListCard({
  name = "Frontend Masters",
  type = "react",
  memberCount = 128,
  isOwner = false,
  isPrivate = false,
  allowedUser = false,
}: GroupListCardProps) {
  const getTypeConfig = (type: GroupType) => {
    switch (type) {
      case "nextJS":
        return {
          icon: <RiNextjsFill className="size-4" />,
          label: "Next.js",
          color: "text-foreground",
        };
      case "react":
        return {
          icon: <RiReactjsLine className="size-4" />,
          label: "React",
          color: "text-sky-400",
        };
      case "fullstack":
        return {
          icon: <RiStackLine className="size-4" />,
          label: "Fullstack",
          color: "text-emerald-400",
        };
      default:
        return { icon: null, label: "", color: "" };
    }
  };

  const config = getTypeConfig(type);

  return (
    <div className="relative flex flex-col w-full border p-3 overflow-hidden hover:bg-accent/5 transition-colors">
          <div className="min-h-full -z-10 w-full bg-transparent absolute top-0 left-0 pointer-events-none">
      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />
      {/* Your Content/Components */}
    </div>

      <div className="flex flex-col sm:flex-row gap-4 z-10 w-full items-start sm:items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="size-12 border bg-accent/10 flex items-center justify-center rounded-sm">
            {config.icon}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase tracking-tight">
                {name}
              </h3>

              {isPrivate ? (
                <span className="flex items-center gap-1 text-[0.6rem] bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 font-bold uppercase">
                  <ShieldIcon className="size-3" /> Private
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[0.6rem] bg-green-500/20 border border-green-500/30 px-1.5 py-0.5 font-bold uppercase">
                  <LockKeyholeOpenIcon className="size-3" /> Public
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1">
              <span
                className={cn(
                  "text-[0.65rem] font-mono font-bold uppercase tracking-widest flex items-center gap-1",
                  config.color
                )}
              >
                {config.label}
              </span>

              <span className="text-[0.65rem] text-muted-foreground flex items-center gap-1">
                <Users className="size-3" /> {memberCount} Members
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          {allowedUser || isOwner ? (
            <Button
              size="sm"
              className="flex-1 sm:w-28 h-8 text-[0.7rem] uppercase font-bold tracking-widest"
            >
              <MessageSquare className="size-3 mr-2" />
              Chat
            </Button>
          ) : isPrivate ? (
            <Button
              size="sm"
              className="flex-1 sm:w-28 h-8 text-[0.7rem] uppercase font-bold tracking-widest"
            >
              <UserPlus className="size-3 mr-2" />
              Request
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex-1 sm:w-28 h-8 text-[0.7rem] uppercase font-bold tracking-widest"
            >
              <UserPlus className="size-3 mr-2" />
              Join
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="flex-1 sm:w-28 h-8 text-[0.7rem] uppercase font-bold tracking-widest"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
