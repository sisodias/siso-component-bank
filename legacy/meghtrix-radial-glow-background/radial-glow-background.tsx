import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
  {/* Dark Radial Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)`,
    }}
  />
     {/* Your Content/Components */}
</div>
  );
};
