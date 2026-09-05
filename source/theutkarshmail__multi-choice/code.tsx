import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<div class="box">
  <div class="container">
    <button class="button"><span>A</span></button>
    <button class="button"><span>B</span></button>
    <button class="button"><span>C</span></button>
    <button class="button"><span>D</span></button>
  </div>
</div>

  );
};
