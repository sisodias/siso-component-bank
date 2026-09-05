import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface SocialCardProps {
  name: string;
  gradient: string;
  textColor?: string;
  bgIconColor?: string;
  largeLogo: React.ReactNode;
  smallLogo: React.ReactNode;
  onClick?: () => void;
}

export const Component = ({
  name,
  gradient,
  textColor = "text-gray-900",
  bgIconColor = "bg-white",
  largeLogo,
  smallLogo,
  onClick,
}: SocialCardProps) => {
  return (
     <Card
      onClick={onClick}
      className={cn(
        "group relative h-[350px] w-[340px] cursor-pointer overflow-hidden rounded-[2rem] shadow-lg transition-all hover:scale-105 hover:shadow-xl",
        gradient
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-25">
        <div className="h-[280px] w-[280px] blur-sm">{largeLogo}</div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl shadow-md",
              bgIconColor
            )}
          >
            <div className="h-10 w-10">{smallLogo}</div>
          </div>
        </div>
        <h2 className={cn("text-3xl font-semibold", textColor)}>{name}</h2>
      </div>
    </Card>
  );
};
