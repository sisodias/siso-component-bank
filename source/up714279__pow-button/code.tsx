import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
   <div class="comic-brutal-button-container">
  <button class="comic-brutal-button">
    <div class="button-inner">
      <span class="button-text">POW!</span>
      <div class="halftone-overlay"></div>
      <div class="ink-splatter"></div>
    </div>
    <div class="button-shadow"></div>
    <div class="button-frame"></div>
  </button>
</div>
  );
};
