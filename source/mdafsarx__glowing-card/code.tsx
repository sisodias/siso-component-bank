"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function GlowingCard({ className }: { className?: string }) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 1) % 360);
    }, 10); // smooth rotation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("flex flex-col justify-center items-center", className)}>
      <div className="relative overflow-hidden w-[min(14.5em,80vmin)] aspect-square rounded-xl grid place-items-center p-2 text-[#ededed] text-center uppercase text-balance text-[clamp(1em,2vw+2vh,2em)]">
        I glow :)
        <div
          className="absolute -inset-4 -z-10 pointer-events-none blur-lg border-[30px] rounded-xl"
          style={{
            borderImage: `conic-gradient(from ${angle}deg, #669900, #99cc33, #ccee66, #006699, #3399cc, #990066, #cc3399, #ff6600, #ff9900, #ffcc00, #669900) 1`,
            borderStyle: "solid",
          }}
        />
      </div>
    </div>
  );
}
