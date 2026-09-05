import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <div class="meta">
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    </section>
  );
};
