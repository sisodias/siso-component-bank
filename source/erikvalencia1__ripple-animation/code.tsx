import React, { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RippleEffectProps extends ComponentPropsWithoutRef<"div"> {
  baseSize?: number;
  baseOpacity?: number;
  circlesCount?: number;
}

export const RippleEffect = React.memo(function RippleEffect({
  baseSize = 210,
  baseOpacity = 0.24,
  circlesCount = 8,
  className,
  ...rest
}: RippleEffectProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)] select-none",
        className
      )}
      {...rest}
    >
      {Array.from({ length: circlesCount }, (_, index) => {
        const circleSize = baseSize + index * 70;
        const circleOpacity = baseOpacity - index * 0.03;
        const delay = `${index * 0.06}s`;

        return (
          <div
            key={index}
            className="animate-ripple bg-foreground/25 absolute rounded-full border shadow-xl"
            style={
              {
                "--i": index,
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                opacity: circleOpacity,
                animationDelay: delay,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "var(--foreground)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

RippleEffect.displayName = "RippleEffect";
