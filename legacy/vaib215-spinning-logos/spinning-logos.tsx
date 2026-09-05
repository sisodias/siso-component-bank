"use client"

import React from 'react';
import { 
  Facebook, 
  Youtube, 
  Gamepad2, 
  Code, 
  Palette, 
  Camera,
  Zap
} from 'lucide-react';
import { cn } from "../_utils/cn";

export const SpinningLogos: React.FC = () => {
  const radiusToCenterOfIcons = 180;
  const iconWrapperWidth = 60;
  const ringPadding = 40;

  const toRadians = (degrees: number): number => (Math.PI / 180) * degrees;

  const logos = [
    { Icon: Code, className: 'bg-purple-600 text-white', name: 'VSCode' },
    { Icon: Palette, className: 'bg-red-600 text-white', name: 'Adobe' },
    { Icon: Camera, className: 'bg-orange-600 text-white', name: 'Reddit' },
    { Icon: Zap, className: 'bg-blue-600 text-white', name: 'Coinbase' },
    { Icon: Gamepad2, className: 'bg-indigo-600 text-white', name: 'PlayStation' },
    { Icon: Facebook, className: 'bg-blue-500 text-white', name: 'Facebook' },
    { Icon: Youtube, className: 'bg-red-500 text-white', name: 'YouTube' },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-8 overflow-hidden">
      <div
        style={{
          width: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
          height: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
        }}
        className="relative rounded-full bg-muted/50 shadow-lg border border-border"
      >
        <div className="absolute inset-0 animate-spin-slow">
          {logos.map((logo, index) => {
            const angle = (360 / logos.length) * index;
            return (
              <div
                key={index}
                style={{
                  top: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.sin(toRadians(angle))}px)`,
                  left: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.cos(toRadians(angle))}px)`,
                  width: iconWrapperWidth,
                  height: iconWrapperWidth,
                }}
                className={cn(
                  "absolute flex items-center justify-center rounded-full shadow-md border-2 border-white dark:border-gray-800 animate-spin-reverse",
                  logo.className
                )}
                aria-label={`${logo.name} logo`}
              >
                <logo.Icon className="w-6 h-6" />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background rounded-full w-3/5 h-3/5 flex items-center justify-center shadow-inner border-4 border-border">
            <span className="text-2xl sm:text-3xl font-bold text-foreground text-center px-4">
              YOUR LOGO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
