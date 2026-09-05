import { cn } from "../_utils/cn";
import { useRef } from "react";

export const Component = () => {
  const animationStartTime = useRef(Date.now());

  const getAnimationDelay = (index) => {
    const elapsed = (Date.now() - animationStartTime.current) / 1000;
    const baseDelay = index * 0.01;
    const cycleTime = 5;
    const currentCycle = elapsed % cycleTime;
    return (baseDelay - currentCycle + cycleTime) % cycleTime;
  };

  return (
    <div className="flex h-screen justify-center items-center bg-black w-full">
        <div className="box-grid">
          {Array.from({ length: 81 }, (_, i) => (
            <div
              key={i}
              className="animated-box aspect-square bg-[#5BC2E7]"
              style={{
                animationDelay: `${getAnimationDelay(i)}s`
              }}
            />
          ))}
        </div>
      </div>
  );
};
