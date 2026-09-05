import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-white relative">
{/* Magenta Orb Grid Background */}
<div
 className="absolute inset-0 z-0"
 style={{
   background: "white",
   backgroundImage: `
     linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
     linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
     radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
   `,
   backgroundSize: "40px 40px, 40px 40px, 100% 100%",
 }}
/>
  {/* Your Content/Components */}
</div>
  );
};
