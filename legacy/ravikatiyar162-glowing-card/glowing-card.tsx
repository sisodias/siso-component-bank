import { cn } from "../_utils/cn";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
<div class="outer">
  <div class="dot"></div>
  <div class="card">
    <div class="ray"></div>
    <div class="text">750k</div>
    <div>Views</div>
    <div class="line topl"></div>
    <div class="line leftl"></div>
    <div class="line bottoml"></div>
    <div class="line rightl"></div>
  </div>
</div>

  );
};
