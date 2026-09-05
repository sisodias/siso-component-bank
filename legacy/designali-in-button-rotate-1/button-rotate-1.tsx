import { Button } from "./button";
import { Moon } from "@aliimam/icons";
import { cn } from "../_utils/cn";

export function ButtonDemo() {
  return (
    <div className="flex gap-3">
      
      <Button size={"icon"} className="relative p-0.5 overflow-hidden">
        <span
          className={cn(
            "absolute inset-[-300%] animate-[spin_3s_linear_infinite]",
            "bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#fff_50%,var(--primary)_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#000_50%,var(--primary)_100%)]"
          )}
        />
        <span
          className={cn(
            "inline-flex size-full items-center text-primary-foreground justify-center rounded-sm backdrop-blur-3xl"
          )}
        >
          <Moon />
        </span>
      </Button>
 
      <Button
         
        className="relative  p-0.5 inline-flex overflow-hidden"
      >
        <span
          className={cn(
            "absolute inset-[-300%] animate-[spin_3s_linear_infinite]",
            "bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#fff_50%,var(--primary)_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#000_50%,var(--primary)_100%)]"
          )}
        />
        <span
          className={cn(
            "inline-flex size-full items-center text-primary-foreground justify-centerrounded-sm px-6 backdrop-blur-3xl"
          )}
        >
          Rotate Background
        </span>
      </Button>

      <Button size={"icon"} className="relative p-0.5 overflow-hidden">
        <span
          className={cn(
            "absolute inset-[-300%] animate-[spin_3s_linear_infinite]",
            "bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#fff_50%,var(--primary)_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#000_50%,var(--primary)_100%)]"
          )}
        />
        <span
          className={cn(
            "inline-flex size-full items-center justify-center text-foreground rounded-sm bg-background backdrop-blur-3xl"
          )}
        >
          <Moon />
        </span>
      </Button>

      <Button
         
        className="relative p-0.5 inline-flex overflow-hidden"
      >
        <span
          className={cn(
            "absolute inset-[-300%] animate-[spin_3s_linear_infinite]",
            "bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#fff_50%,var(--primary)_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,#000_50%,var(--primary)_100%)]"
          )}
        />
        <span
          className={cn(
            "inline-flex size-full text-foreground items-center justify-center rounded-sm bg-background px-6 backdrop-blur-3xl"
          )}
        >
          Rotate Border
        </span>
      </Button>
    </div>
  );
}
