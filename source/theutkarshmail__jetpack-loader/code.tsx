import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <>
    <div class="loader">
  <span><span></span><span></span><span></span><span></span></span>
  <div class="base">
    <span></span>
    <div class="face"></div>
  </div>
</div>
<div class="longfazers">
  <span></span><span></span><span></span><span></span>
</div>
</>
  );
};
