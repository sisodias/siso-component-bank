import * as React from "react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn
import { Zap, Smartphone } from "lucide-react";

// Props definition for type-safety and reusability
export interface BatteryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  deviceName: string;
  deviceIcon?: React.ReactNode;
  batteryLevel: number; // A number from 0 to 100
  isCharging: boolean;
  timeToFull: string;
  estimateLabel?: string;
}

const BatteryCard = React.forwardRef<HTMLDivElement, BatteryCardProps>(
  (
    {
      className,
      deviceName,
      deviceIcon = <Smartphone className="h-4 w-4" />,
      batteryLevel,
      isCharging,
      timeToFull,
      estimateLabel = "Full battery estimate",
      ...props
    },
    ref
  ) => {
    // Clamp battery level between 0 and 100
    const clampedBatteryLevel = Math.max(0, Math.min(100, batteryLevel));

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {deviceIcon}
            <span>{deviceName}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 items-center gap-4">
          {/* Battery Animation Container */}
          <div className="relative col-span-1 h-32 w-full overflow-hidden rounded-lg bg-muted/40">
            {/* The animated wave */}
            <div
              className="absolute bottom-0 w-[2000px] transition-all duration-500 ease-in-out"
              style={{ height: `${clampedBatteryLevel}%` }}
            >
              <svg
                className="absolute -bottom-1 h-4 w-[2000px] animate-[wave-animation_7s_linear_infinite]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 88.6"
                style={{ fill: `hsl(var(--battery-wave))` }}
              >
                <path d="M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.7h800v-.2-31.4z" />
              </svg>
              <svg
                className="absolute -bottom-1 h-5 w-[2000px] animate-[wave-animation_10s_linear_infinite]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 88.6"
                style={{
                  fill: `hsl(var(--battery-wave))`,
                  opacity: 0.5,
                }}
              >
                <path d="M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.7h800v-.2-31.4z" />
              </svg>
            </div>
            
            {/* Battery Level Text and Charging Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
              {isCharging && (
                <Zap className="h-5 w-5" style={{ color: `hsl(var(--battery-wave-foreground))` }} />
              )}
              <span className="text-xl font-bold" style={{ color: `hsl(var(--battery-wave-foreground))` }}>
                {clampedBatteryLevel}%
              </span>
            </div>
          </div>
          
          {/* Time Estimate Section */}
          <div className="col-span-2 flex flex-col items-start justify-center">
            <p className="text-4xl font-bold tracking-tight text-foreground">
              {timeToFull}
            </p>
            <p className="text-sm text-muted-foreground">{estimateLabel}</p>
          </div>
        </div>
      </div>
    );
  }
);

BatteryCard.displayName = "BatteryCard";

export { BatteryCard };