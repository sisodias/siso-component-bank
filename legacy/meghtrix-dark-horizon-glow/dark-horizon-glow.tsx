import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (<div className="min-h-screen w-full relative">
        {/* Dark Horizon Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
          }}
        />
        {/* Your Content/Components */}
  
      </div>
  );
};
