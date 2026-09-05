"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Star, Copy } from "lucide-react";

export interface Achievement {
  label: string;
  value: string | number;
}

export interface FreelancerProfileCardProps {
  name: string;
  title: string;
  avatarUrl?: string;
  email?: string;
  location?: string;
  rating?: number; // out of 5
  achievements?: Achievement[];
  qrCodeUrl?: string;
  onShare?: () => void;
  onCopyEmail?: () => void;
  className?: string;
}

export const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  name,
  title,
  avatarUrl,
  email,
  location,
  rating = 0,
  achievements = [],
  qrCodeUrl,
  onShare,
  onCopyEmail,
  className,
}) => {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-full max-w-md bg-card text-card-foreground rounded-2xl border shadow-lg p-6 flex flex-col gap-6",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground">{title}</p>
              {location && <p className="text-xs text-muted-foreground">{location}</p>}
            </div>
          </div>
          {qrCodeUrl && (
            <img src={qrCodeUrl} alt="Profile QR Code" className="h-16 w-16 rounded-md" />
          )}
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("h-5 w-5", i < rating ? "text-yellow-400" : "text-muted-foreground")}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">{rating.toFixed(1)}/5</span>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((ach, idx) => (
              <div key={idx} className="bg-muted rounded-lg p-4 flex flex-col">
                <p className="text-xl font-bold">{ach.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{ach.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact & Share Buttons */}
        <div className="flex gap-2 justify-end">
          {email && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCopyEmail}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" /> Copy Email
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy freelancer email</TooltipContent>
            </Tooltip>
          )}
          {onShare && (
            <Button size="sm" onClick={onShare}>
              Share Profile
            </Button>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
